import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const STORAGE_KEYS = {
  modules: 'karsadev_modules',
  submissions: 'karsadev_submissions',
};

const defaultModules = [
  {
    id: 'module-1',
    title: 'LKPD AI 01 - Prompt Engineering',
    teacher_name: 'Wanda Kurniawan',
    subject: 'AI & KIK',
    task_type: 'docs',
    deadline: '2026-09-18T00:00:00.000Z',
    resource_url: 'https://docs.google.com/',
    xp_reward: 150,
    class_target: 'Semua PPLG',
    description: 'Prompt engineering',
  },
  {
    id: 'module-2',
    title: 'Praktik & Rangkuman Laravel MVC',
    teacher_name: 'Didin Saharudin, M.Kom.',
    subject: 'Web & Mobile',
    task_type: 'video',
    deadline: '2026-09-20T00:00:00.000Z',
    resource_url: 'https://youtube.com/',
    xp_reward: 180,
    class_target: 'Semua PPLG',
    description: 'Laravel MVC',
  },
];

const defaultSubmissions = [
  {
    id: 'sub-demo-1',
    student_name: 'Ahmad Fauzi',
    class_name: 'XII PPLG 1',
    module_title: 'Praktik & Rangkuman Laravel MVC',
    submitted_at: '2026-09-12T09:40:00.000Z',
    submission_url: 'https://drive.google.com/',
    notes: 'Link tugas dikirim dari portal siswa.',
    status: 'Pending',
    score: null,
    feedback: '',
  },
];

const readLocalStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Local storage write failed:', error);
  }
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('[YOUR_PROJECT_ID]') &&
    !supabaseAnonKey.includes('[YOUR_SUPABASE_ANON_KEY]')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const getProfileFromSupabase = async (userId) => {
  if (!supabase || !isSupabaseConfigured || !userId) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn('Supabase profile fetch failed:', error.message);
    return null;
  }

  return data;
};

export const fetchModules = async () => {
  if (!supabase || !isSupabaseConfigured) {
    const localModules = readLocalStorage(STORAGE_KEYS.modules, defaultModules);
    return Array.isArray(localModules) && localModules.length ? localModules : defaultModules;
  }

  const { data, error } = await supabase
    .from('lkpd_modules')
    .select('*')
    .order('deadline', { ascending: true });

  if (error) {
    console.warn('Fetch modules failed:', error.message);
    return readLocalStorage(STORAGE_KEYS.modules, defaultModules);
  }

  return data || readLocalStorage(STORAGE_KEYS.modules, defaultModules);
};

export const fetchSubmissions = async () => {
  if (!supabase || !isSupabaseConfigured) {
    const localSubmissions = readLocalStorage(STORAGE_KEYS.submissions, defaultSubmissions);
    return Array.isArray(localSubmissions) && localSubmissions.length ? localSubmissions : defaultSubmissions;
  }

  const { data, error } = await supabase
    .from('lkpd_submissions')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.warn('Fetch submissions failed:', error.message);
    return readLocalStorage(STORAGE_KEYS.submissions, defaultSubmissions);
  }

  return data || readLocalStorage(STORAGE_KEYS.submissions, defaultSubmissions);
};

export const subscribeToModules = (callback) => {
  if (!supabase || !isSupabaseConfigured) {
    return () => {};
  }

  const channel = supabase.channel('lkpd_modules_realtime');

  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'lkpd_modules' },
    callback
  );

  channel.subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToSubmissions = (callback) => {
  if (!supabase || !isSupabaseConfigured) {
    return () => {};
  }

  const channel = supabase.channel('lkpd_submissions_realtime');

  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'lkpd_submissions' },
    callback
  );

  channel.subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const upsertModule = async (payload, editingId = null) => {
  if (!supabase || !isSupabaseConfigured) {
    const current = readLocalStorage(STORAGE_KEYS.modules, defaultModules);
    const next = editingId
      ? current.map((item) => (item.id === editingId ? { ...item, ...payload, id: editingId } : item))
      : [{ ...payload, id: payload.id || `module-${Date.now()}` }, ...current];

    writeLocalStorage(STORAGE_KEYS.modules, next);
    return { success: true, data: next };
  }

  if (editingId) {
    const { error } = await supabase
      .from('lkpd_modules')
      .update(payload)
      .eq('id', editingId);

    if (error) {
      console.warn('Update module failed:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true };
  }

  const { error } = await supabase.from('lkpd_modules').insert(payload);

  if (error) {
    console.warn('Insert module failed:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true };
};

export const deleteModule = async (id) => {
  if (!supabase || !isSupabaseConfigured) {
    const current = readLocalStorage(STORAGE_KEYS.modules, defaultModules);
    const next = current.filter((item) => item.id !== id);
    writeLocalStorage(STORAGE_KEYS.modules, next);
    return { success: true, data: next };
  }

  const { error } = await supabase.from('lkpd_modules').delete().eq('id', id);

  if (error) {
    console.warn('Delete module failed:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true };
};

export const updateSubmissionGrade = async (id, score, status, feedback = '') => {
  if (!supabase || !isSupabaseConfigured) {
    const current = readLocalStorage(STORAGE_KEYS.submissions, defaultSubmissions);
    const next = current.map((item) =>
      item.id === id
        ? { ...item, score, status, feedback, graded_at: new Date().toISOString() }
        : item
    );
    writeLocalStorage(STORAGE_KEYS.submissions, next);
    return { success: true, data: next };
  }

  const { error } = await supabase
    .from('lkpd_submissions')
    .update({
      score,
      status,
      feedback,
      graded_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.warn('Update submission failed:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true };
};

export const submitStudentTask = async ({
  student_name,
  class_name,
  module_title,
  submission_url,
  notes = '',
  status = 'Pending',
}) => {
  const payload = {
    id: `sub-${Date.now()}`,
    student_name: student_name || 'Siswa',
    class_name: class_name || 'XII PPLG 1',
    module_title: module_title || 'Tugas',
    submitted_at: new Date().toISOString(),
    submission_url: submission_url || '#',
    notes: notes || 'Tugas dikirim melalui portal murid.',
    status,
    score: null,
    feedback: '',
  };

  if (!supabase || !isSupabaseConfigured) {
    const current = readLocalStorage(STORAGE_KEYS.submissions, defaultSubmissions);
    const next = [payload, ...current];
    writeLocalStorage(STORAGE_KEYS.submissions, next);
    return { success: true, data: next };
  }

  const { error } = await supabase.from('lkpd_submissions').insert(payload);

  if (error) {
    console.warn('Submit task failed:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true, data: payload };
};

export const signUpWithSupabase = async ({ email, password, full_name, class_name }) => {
  if (!supabase || !isSupabaseConfigured) {
    return { success: true, demo: true };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: full_name || 'Siswa PPLG',
        class_name: class_name || 'XII PPLG 2',
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, user: data?.user || null };
};
