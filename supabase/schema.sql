-- ==============================================================================
-- KarsaDev - Skema Database Supabase Jurusan PPLG
-- Multi-Guru & Manajemen Rombel Kelas Besar (43-46 Siswa per Kelas)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (PENGGUNA: GURU, SISWA, ADMIN)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    nip TEXT,                        -- Khusus Guru/Tenaga Pendidik
    nisn TEXT,                       -- Khusus Siswa
    class_name TEXT,                 -- Contoh: 'XII PPLG 1', 'X PPLG 2'
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeks untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_class_name ON public.profiles(class_name);
CREATE INDEX IF NOT EXISTS idx_profiles_nisn ON public.profiles(nisn);

-- 3. TABEL CLASSES (9 ROMBEL RESMI JURUSAN PPLG)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,       -- 'X PPLG 1', 'X PPLG 2', ..., 'XII PPLG 3'
    grade TEXT NOT NULL CHECK (grade IN ('10', '11', '12')),
    academic_year TEXT NOT NULL DEFAULT '2025/2026',
    homeroom_teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_capacity INTEGER NOT NULL DEFAULT 46,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL SUBJECTS (MATA PELAJARAN KEJURUAN PPLG)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,       -- 'PBO', 'WEB_DEV', 'MOBILE_DEV', 'BASIS_DATA', 'AI_KIK', 'DASAR_PPLG'
    name TEXT NOT NULL,              -- Contoh: 'Pemrograman Web & Mobile'
    grade TEXT NOT NULL DEFAULT 'ALL',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL TEACHER_ASSIGNMENTS (PENUGASAN GURU KE KELAS & MAPEL)
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL DEFAULT '2025/2026',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (teacher_id, class_id, subject_id, academic_year)
);

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_teacher ON public.teacher_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_class ON public.teacher_assignments(class_id);

-- 6. TABEL LKPD_MODULES (MODUL & TUGAS PRAKTIK)
CREATE TABLE IF NOT EXISTS public.lkpd_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    teacher_name TEXT NOT NULL DEFAULT 'Guru PPLG',
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    subject TEXT NOT NULL DEFAULT 'Kejuruan PPLG',
    task_type TEXT NOT NULL DEFAULT 'docs' CHECK (task_type IN ('docs', 'video', 'code', 'quiz')),
    class_target TEXT NOT NULL DEFAULT 'Semua PPLG',
    deadline TIMESTAMPTZ,
    resource_url TEXT,
    xp_reward INTEGER NOT NULL DEFAULT 100,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lkpd_modules_teacher ON public.lkpd_modules(teacher_id);

-- 7. TABEL LKPD_SUBMISSIONS (PENGUMPULAN & PENILAIAN TUGAS SISWA)
CREATE TABLE IF NOT EXISTS public.lkpd_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.lkpd_modules(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_class TEXT NOT NULL,
    submission_url TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Dinilai', 'Perlu Revisi')),
    score INTEGER CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    feedback TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_submissions_module ON public.lkpd_submissions(module_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.lkpd_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.lkpd_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_student_class ON public.lkpd_submissions(student_class);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lkpd_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lkpd_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles: Publik dapat membaca profil, pengguna dapat mengubah profil miliknya sendiri
CREATE POLICY "Profiles viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Classes & Subjects: Dapat dibaca oleh semua pengguna terotentikasi
CREATE POLICY "Classes viewable by all authenticated" 
    ON public.classes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Subjects viewable by all authenticated" 
    ON public.subjects FOR SELECT TO authenticated USING (true);

-- Teacher Assignments: Dapat dibaca semua guru/siswa
CREATE POLICY "Teacher assignments viewable by all authenticated" 
    ON public.teacher_assignments FOR SELECT TO authenticated USING (true);

-- Modules: Siswa & Guru dapat membaca, Guru/Admin dapat membuat dan mengedit
CREATE POLICY "Modules viewable by authenticated users" 
    ON public.lkpd_modules FOR SELECT TO authenticated USING (true);

CREATE POLICY "Teachers can insert and update modules" 
    ON public.lkpd_modules FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('teacher', 'admin')
        )
    );

-- Submissions:
-- Siswa hanya bisa melihat submission miliknya sendiri
-- Guru dapat melihat semua submission dan memperbarui nilai (score & feedback)
CREATE POLICY "Students can view own submissions" 
    ON public.lkpd_submissions FOR SELECT TO authenticated 
    USING (
        student_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('teacher', 'admin')
        )
    );

CREATE POLICY "Students can submit own task" 
    ON public.lkpd_submissions FOR INSERT TO authenticated 
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can update submission grade" 
    ON public.lkpd_submissions FOR UPDATE TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role IN ('teacher', 'admin')
        )
    );

-- ==============================================================================
-- 9. AUTH TRIGGER (AUTO SYNC AUTH.USERS -> PUBLIC.PROFILES)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        class_name,
        nisn,
        nip,
        avatar_url
    )
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        new.raw_user_meta_data->>'class_name',
        new.raw_user_meta_data->>'nisn',
        new.raw_user_meta_data->>'nip',
        new.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        class_name = COALESCE(EXCLUDED.class_name, profiles.class_name),
        nisn = COALESCE(EXCLUDED.nisn, profiles.nisn),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
