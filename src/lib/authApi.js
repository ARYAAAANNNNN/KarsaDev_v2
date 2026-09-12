import { getProfileFromSupabase, isSupabaseConfigured, supabase } from './supabaseClient';

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    return { success: false, message: 'Email dan password wajib diisi.' };
  }

  if (!isSupabaseConfigured || !supabase) {
    return {
      success: true,
      demo: true,
      user: {
        id: 'local-user',
        email,
      },
      profile: {
        id: 'local-user',
        full_name: email.includes('guru') || email.includes('teacher') ? 'Guru PPLG' : 'Siswa PPLG',
        email,
        role: email.includes('guru') || email.includes('teacher') ? 'teacher' : 'student',
        class_name: email.includes('guru') || email.includes('teacher') ? 'Staff Pengajar' : 'X PPLG 1',
      },
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  const remoteProfile = data?.user ? await getProfileFromSupabase(data.user.id) : null;

  return {
    success: true,
    user: data?.user || null,
    profile: {
      id: data?.user?.id || 'local-user',
      email: data?.user?.email || email,
      ...(remoteProfile || {}),
    },
  };
};

export const registerUser = async ({ email, password, full_name, class_name }) => {
  if (!email || !password) {
    return { success: false, message: 'Email dan password wajib diisi.' };
  }

  if (!isSupabaseConfigured || !supabase) {
    return {
      success: true,
      demo: true,
      user: {
        id: 'local-user',
        email,
      },
      profile: {
        id: 'local-user',
        full_name: full_name || 'Siswa PPLG',
        email,
        role: 'student',
        class_name: class_name || 'X PPLG 1',
      },
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: full_name || 'Siswa PPLG',
        class_name: class_name || 'XII PPLG 1',
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    user: data?.user || null,
    profile: {
      id: data?.user?.id || 'local-user',
      email: data?.user?.email || email,
      full_name: full_name || 'Siswa PPLG',
      class_name: class_name || 'X PPLG 1',
      role: 'student',
    },
  };
};

export const logoutUser = async () => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, message: error.message };
    }
  }

  return { success: true };
};

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true, user: null };
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { success: false, message: error.message, user: null };
  }

  return { success: true, user: data?.user || null };
};
