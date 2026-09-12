-- ==============================================================================
-- KarsaDev - Seeding Data Supabase Jurusan PPLG
-- Guru, Mapel, Rombel, & Generator 43-46 Siswa per Kelas
-- ==============================================================================

-- 1. SEED MASTER KELAS (9 ROMBEL PPLG)
INSERT INTO public.classes (id, name, grade, academic_year, student_capacity)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'X PPLG 1', '10', '2025/2026', 44),
    ('c1000000-0000-0000-0000-000000000002', 'X PPLG 2', '10', '2025/2026', 45),
    ('c1000000-0000-0000-0000-000000000003', 'X PPLG 3', '10', '2025/2026', 43),
    ('c1000000-0000-0000-0000-000000000004', 'XI PPLG 1', '11', '2025/2026', 46),
    ('c1000000-0000-0000-0000-000000000005', 'XI PPLG 2', '11', '2025/2026', 44),
    ('c1000000-0000-0000-0000-000000000006', 'XI PPLG 3', '11', '2025/2026', 45),
    ('c1000000-0000-0000-0000-000000000007', 'XII PPLG 1', '12', '2025/2026', 45),
    ('c1000000-0000-0000-0000-000000000008', 'XII PPLG 2', '12', '2025/2026', 44),
    ('c1000000-0000-0000-0000-000000000009', 'XII PPLG 3', '12', '2025/2026', 45)
ON CONFLICT (name) DO UPDATE SET
    student_capacity = EXCLUDED.student_capacity;

-- 2. SEED MASTER MATA PELAJARAN KEJURUAN PPLG
INSERT INTO public.subjects (id, code, name, grade, description)
VALUES
    ('s1000000-0000-0000-0000-000000000001', 'AI_KIK', 'Kecerdasan Buatan & KIK', 'ALL', 'Pemanfaatan AI, prompt engineering, dan etika kecerdasan buatan'),
    ('s1000000-0000-0000-0000-000000000002', 'WEB_DEV', 'Pemrograman Web (Laravel / React)', 'ALL', 'Pengembangan aplikasi web berbasis framework modern'),
    ('s1000000-0000-0000-0000-000000000003', 'PBO', 'Pemrograman Berorientasi Objek (OOP)', '11', 'Konsep OOP, Java, C#, dan design patterns'),
    ('s1000000-0000-0000-0000-000000000004', 'BASIS_DATA', 'Basis Data & SQL', '10', 'Desain relasi database, normalisasi, dan query SQL Supabase'),
    ('s1000000-0000-0000-0000-000000000005', 'MOBILE_DEV', 'Pemrograman Perangkat Bergerak', '12', 'Aplikasi mobile cross-platform Flutter dan React Native'),
    ('s1000000-0000-0000-0000-000000000006', 'DASAR_PPLG', 'Dasar-dasar Program Keahlian PPLG', '10', 'Algoritma, logika pemrograman, dan UI/UX fundamentals')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description;

-- 3. SEED PROFIL GURU & ADMIN PPLG
-- Catatan: Jika dibuat langsung di Supabase Auth, ID akan mengikuti UUID Auth.
-- Query ini memastikan profil publik langsung siap digunakan.
INSERT INTO public.profiles (id, email, full_name, role, nip, class_name, bio)
VALUES
    (
        'e1000000-0000-0000-0000-000000000001',
        'wanda@smk.sch.id',
        'Wanda Kurniawan, S.Kom.',
        'teacher',
        '198503152010011012',
        'Kecerdasan Buatan & Pemodelan PPLG',
        'Pengampu Mapel AI, Pemrograman Web Modern, dan Kaprodi PPLG.'
    ),
    (
        'e1000000-0000-0000-0000-000000000002',
        'didin@smk.sch.id',
        'Didin Saharudin, M.Kom.',
        'teacher',
        '198207202008011005',
        'Pemrograman Web Laravel & Basis Data',
        'Fokus pada arsitektur backend, RESTful API, dan optimasi SQL database.'
    ),
    (
        'e1000000-0000-0000-0000-000000000003',
        'diah@smk.sch.id',
        'Diah Pungki Octaviani, S.Pd.',
        'teacher',
        '199011042015022003',
        'Analisis Sistem & Wali Kelas XII PPLG 2',
        'Pengampu Rekayasa Perangkat Lunak, UI/UX Design, dan Quality Assurance.'
    ),
    (
        'e1000000-0000-0000-0000-000000000004',
        'admin@smk.sch.id',
        'Administrator Jurusan PPLG',
        'admin',
        '198001012005011001',
        'Manajemen Kurikulum & Server PPLG',
        'Pengelola infrastruktur dan sistem informasi terpadu jurusan PPLG.'
    )
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    nip = EXCLUDED.nip,
    bio = EXCLUDED.bio;

-- Update Wali Kelas di master classes
UPDATE public.classes SET homeroom_teacher_id = 'e1000000-0000-0000-0000-000000000001' WHERE name = 'XII PPLG 1';
UPDATE public.classes SET homeroom_teacher_id = 'e1000000-0000-0000-0000-000000000003' WHERE name = 'XII PPLG 2';
UPDATE public.classes SET homeroom_teacher_id = 'e1000000-0000-0000-0000-000000000002' WHERE name = 'XI PPLG 1';

-- 4. SEED PENUGASAN GURU KE KELAS (TEACHER ASSIGNMENTS)
INSERT INTO public.teacher_assignments (teacher_id, class_id, subject_id, academic_year)
VALUES
    -- Pak Wanda mengajar AI & KIK di XII PPLG 1, 2, 3
    ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000007', 's1000000-0000-0000-0000-000000000001', '2025/2026'),
    ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000008', 's1000000-0000-0000-0000-000000000001', '2025/2026'),
    ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000009', 's1000000-0000-0000-0000-000000000001', '2025/2026'),
    -- Pak Didin mengajar Laravel & Basis Data di XI PPLG 1, 2, 3
    ('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000002', '2025/2026'),
    ('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000005', 's1000000-0000-0000-0000-000000000002', '2025/2026'),
    ('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000006', 's1000000-0000-0000-0000-000000000002', '2025/2026'),
    -- Bu Diah mengajar Analisis Sistem & Dasar PPLG di X PPLG 1, 2, 3
    ('e1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000006', '2025/2026'),
    ('e1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000006', '2025/2026'),
    ('e1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 's1000000-0000-0000-0000-000000000006', '2025/2026')
ON CONFLICT DO NOTHING;

-- 5. SEED MODUL LKPD GURU
INSERT INTO public.lkpd_modules (id, title, teacher_id, teacher_name, subject, task_type, class_target, deadline, resource_url, xp_reward, description)
VALUES
    (
        'm1000000-0000-0000-0000-000000000001',
        'LKPD AI 01 - Prompt Engineering & Workflow Otomasi',
        'e1000000-0000-0000-0000-000000000001',
        'Wanda Kurniawan, S.Kom.',
        'Kecerdasan Buatan & KIK',
        'docs',
        'Semua PPLG',
        NOW() + INTERVAL '7 days',
        'https://docs.google.com/',
        150,
        'Menganalisis perancangan prompt terstruktur untuk rekayasa perangkat lunak.'
    ),
    (
        'm1000000-0000-0000-0000-000000000002',
        'Praktik & Rangkuman Laravel MVC & Migration Database',
        'e1000000-0000-0000-0000-000000000002',
        'Didin Saharudin, M.Kom.',
        'Pemrograman Web & Mobile',
        'video',
        'XI PPLG & XII PPLG',
        NOW() + INTERVAL '10 days',
        'https://youtube.com/',
        180,
        'Implementasi REST API dengan migration, model Eloquent, dan controller.'
    ),
    (
        'm1000000-0000-0000-0000-000000000003',
        'Analisis Kebutuhan Sistem (SRS) & Use Case Diagram',
        'e1000000-0000-0000-0000-000000000003',
        'Diah Pungki Octaviani, S.Pd.',
        'Analisis Sistem & Rekayasa Perangkat Lunak',
        'docs',
        'Semua PPLG',
        NOW() + INTERVAL '14 days',
        'https://drive.google.com/',
        120,
        'Menyusun dokumen Software Requirement Specification dan diagram use case.'
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    teacher_name = EXCLUDED.teacher_name;

-- 6. GENERATOR SISWA 43-46 PER KELAS DENGAN SIMULASI REALISTIS
-- Fungsi ini menghasilkan siswa di setiap 9 rombel PPLG beserta submissions tugasnya
DO $$
DECLARE
    class_rec RECORD;
    student_idx INT;
    first_names TEXT[] := ARRAY['Ahmad', 'Aditya', 'Bayu', 'Bintang', 'Citra', 'Dimas', 'Dinda', 'Fajar', 'Farhan', 'Gita', 'Hafiz', 'Indah', 'Irfan', 'Joko', 'Kevin', 'Lina', 'Muhammad', 'Nabila', 'Naufal', 'Putri', 'Rafi', 'Rizky', 'Salsa', 'Taufik', 'Wahyu', 'Yoga', 'Zahra', 'Ilham', 'Tio', 'Rendi', 'Vina', 'Dewi', 'Arya', 'Siti', 'Riko', 'Fauzan', 'Aldi', 'Anisa', 'Bagas', 'Doni', 'Eka', 'Hendra', 'Maya', 'Nanda', 'Reza', 'Surya'];
    last_names TEXT[] := ARRAY['Pratama', 'Saputra', 'Ramadhan', 'Hidayat', 'Kurniawan', 'Putra', 'Maulana', 'Wulandari', 'Lestari', 'Santoso', 'Utami', 'Siregar', 'Kusuma', 'Nugraha', 'Setiawan', 'Wijaya', 'Permana', 'Firmansyah', 'Syahputra', 'Anggraini', 'Purnama', 'Wahyudi', 'Safitri', 'Gunawan', 'Hakim'];
    student_name TEXT;
    student_nisn TEXT;
    target_count INT;
    new_student_id UUID;
    score_val INT;
BEGIN
    FOR class_rec IN SELECT id, name, student_capacity FROM public.classes LOOP
        target_count := class_rec.student_capacity;
        
        FOR student_idx IN 1..target_count LOOP
            -- Susun nama siswa
            student_name := first_names[1 + ((student_idx + ASCII(SUBSTRING(class_rec.name FROM 1 FOR 1))) % array_length(first_names, 1))] || ' ' ||
                            last_names[1 + ((student_idx * 3 + ASCII(SUBSTRING(class_rec.name FROM 3 FOR 1))) % array_length(last_names, 1))];
            
            -- Susun NISN unik
            student_nisn := '00' || (2025 - 16) || LPAD(student_idx::TEXT, 2, '0') || LPAD((ASCII(SUBSTRING(class_rec.name FROM 1 FOR 1)) * 10 + student_idx)::TEXT, 3, '0');
            
            new_student_id := gen_random_uuid();
            
            -- Insert profile siswa
            INSERT INTO public.profiles (
                id,
                email,
                full_name,
                role,
                nisn,
                class_name,
                bio
            )
            VALUES (
                new_student_id,
                'siswa.' || LOWER(REPLACE(class_rec.name, ' ', '')) || '.' || student_idx || '@smk.sch.id',
                student_name,
                'student',
                student_nisn,
                class_rec.name,
                'Siswa Konsentrasi Keahlian PPLG - ' || class_rec.name
            )
            ON CONFLICT (email) DO NOTHING;

            -- Simulasi pengumpulan LKPD (Sebagian dinilai, sebagian pending, sebagian belum kumpul)
            IF (student_idx % 5 != 0) THEN
                -- Tentukan skor (kebanyakan tuntas >= 78, beberapa perlu remidi)
                IF (student_idx % 8 = 0) THEN
                    score_val := 68 + (student_idx % 8); -- Perlu Remidi
                ELSE
                    score_val := 80 + (student_idx % 19); -- Tuntas
                END IF;

                INSERT INTO public.lkpd_submissions (
                    module_id,
                    student_id,
                    student_name,
                    student_class,
                    submission_url,
                    notes,
                    status,
                    score,
                    feedback,
                    submitted_at,
                    graded_at,
                    graded_by
                )
                VALUES (
                    'm1000000-0000-0000-0000-000000000001',
                    new_student_id,
                    student_name,
                    class_rec.name,
                    'https://github.com/smk-pplg/' || LOWER(REPLACE(student_name, ' ', '-')),
                    'Pengumpulan tugas tepat waktu melalui repositori proyek.',
                    CASE WHEN student_idx % 6 = 0 THEN 'Pending' ELSE 'Dinilai' END,
                    CASE WHEN student_idx % 6 = 0 THEN NULL ELSE score_val END,
                    CASE WHEN student_idx % 6 = 0 THEN NULL ELSE 'Kerja bagus, alur dan struktur kode tersusun rapi.' END,
                    NOW() - (student_idx || ' hours')::INTERVAL,
                    CASE WHEN student_idx % 6 = 0 THEN NULL ELSE NOW() - (student_idx || ' hours')::INTERVAL + INTERVAL '1 hour' END,
                    'e1000000-0000-0000-0000-000000000001'
                );
            END IF;
        END LOOP;
    END LOOP;
END $$;
