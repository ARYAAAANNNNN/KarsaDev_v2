import { getProfileFromSupabase, isSupabaseConfigured, supabase } from './supabaseClient';

export const ADMIN_ACCOUNTS = [
  {
    email: 'wanda@smk.sch.id',
    password: 'wanda2026',
    full_name: 'Wanda Kurniawan',
    class_name: 'Guru PPLG',
    role: 'teacher',
  },
  {
    email: 'didin@smk.sch.id',
    password: 'didin2026',
    full_name: 'Didin Saharudin, M.Kom.',
    class_name: 'Guru PPLG',
    role: 'teacher',
  },
  {
    email: 'diah@smk.sch.id',
    password: 'diah2026',
    full_name: 'Diah Pungki Octaviani, S.Pd.',
    class_name: 'Guru PPLG',
    role: 'teacher',
  },
  {
    email: 'admin@smk.sch.id',
    password: 'admin2026',
    full_name: 'Administrator PPLG',
    class_name: 'Admin PPLG',
    role: 'teacher',
  },
];

export const isTrustedAdminEmail = (email) => {
  const normalized = String(email || '').trim().toLowerCase();
  return ADMIN_ACCOUNTS.some((account) => account.email.toLowerCase() === normalized);
};

export const verifyAdminCredentials = (email, password) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '').trim();

  return ADMIN_ACCOUNTS.find(
    (account) =>
      account.email.toLowerCase() === normalizedEmail &&
      account.password === normalizedPassword
  );
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    return { success: false, message: 'Email dan password wajib diisi.' };
  }

  const adminAccount = verifyAdminCredentials(email, password);
  if (adminAccount) {
    return {
      success: true,
      demo: true,
      user: {
        id: `admin-${adminAccount.email}`,
        email: adminAccount.email,
      },
      profile: {
        id: `admin-${adminAccount.email}`,
        full_name: adminAccount.full_name,
        email: adminAccount.email,
        role: 'teacher',
        class_name: adminAccount.class_name,
        is_admin: true,
      },
    };
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
        full_name: 'Siswa PPLG',
        email,
        role: 'student',
        class_name: 'X PPLG 1',
        is_admin: false,
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
      is_admin: !!remoteProfile?.is_admin || isTrustedAdminEmail(data?.user?.email || email),
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
        is_admin: false,
      },
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: full_name || 'Siswa PPLG',
        class_name: class_name || 'X PPLG 1',
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
      is_admin: false,
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
