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

const USERS_STORAGE_KEY = 'karsadev_registered_users';

export const getLocalUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLocalUser = (userData) => {
  const users = getLocalUsers();
  const normalizedEmail = String(userData.email || '').trim().toLowerCase();
  const existingIndex = users.findIndex(
    (u) => String(u.email || '').trim().toLowerCase() === normalizedEmail
  );
  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...userData };
  } else {
    users.push(userData);
  }
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn('Gagal menyimpan user lokal:', err);
  }
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    return { success: false, message: 'Email dan password wajib diisi.' };
  }

  const isLocalDevelopment = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname);

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
        avatar_url: null,
        is_admin: true,
      },
    };
  }

  // Cek apakah ada di akun registrasi lokal
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const localUsers = getLocalUsers();
  const foundUser = localUsers.find(
    (u) => String(u.email || '').trim().toLowerCase() === normalizedEmail
  );

  if (!isSupabaseConfigured || !supabase) {
    if (!isLocalDevelopment) {
      return {
        success: false,
        message: 'Sistem autentikasi belum siap. Silakan hubungi admin untuk mengaktifkan Supabase.',
      };
    }

    if (foundUser) {
      if (foundUser.password && foundUser.password !== password) {
        return { success: false, message: 'Kata sandi tidak sesuai.' };
      }
      return {
        success: true,
        demo: true,
        user: {
          id: foundUser.id || `local-${foundUser.email}`,
          email: foundUser.email,
        },
        profile: {
          id: foundUser.id || `local-${foundUser.email}`,
          full_name: foundUser.full_name,
          email: foundUser.email,
          role: foundUser.role || 'student',
          class_name: foundUser.class_name || 'X PPLG 1',
          nisn: foundUser.nisn || '',
          avatar_url: foundUser.avatar_url || null,
          is_admin: false,
        },
      };
    }

    // Jika belum terdaftar sebelumnya, ekstrak nama dari email
    const autoName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      success: true,
      demo: true,
      user: {
        id: 'local-user',
        email,
      },
      profile: {
        id: 'local-user',
        full_name: autoName || 'Siswa PPLG',
        email,
        role: 'student',
        class_name: 'X PPLG 1',
        avatar_url: null,
        is_admin: false,
      },
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const errorMsg = error.message || '';

    // Tangani jika Supabase menolak karena "Email not confirmed"
    if (errorMsg.toLowerCase().includes('email not confirmed')) {
      if (foundUser) {
        if (foundUser.password && foundUser.password !== password) {
          return { success: false, message: 'Kata sandi tidak sesuai.' };
        }
        return {
          success: true,
          user: {
            id: foundUser.id || `local-${foundUser.email}`,
            email: foundUser.email,
          },
          profile: {
            id: foundUser.id || `local-${foundUser.email}`,
            full_name: foundUser.full_name,
            email: foundUser.email,
            role: foundUser.role || 'student',
            class_name: foundUser.class_name || 'X PPLG 1',
            nisn: foundUser.nisn || '',
            avatar_url: foundUser.avatar_url || null,
            is_admin: false,
          },
        };
      }

      // Coba query langsung tabel profiles supabase jika ada
      try {
        const { data: profData } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (profData) {
          return {
            success: true,
            user: {
              id: profData.id,
              email: profData.email,
            },
            profile: {
              ...profData,
              is_admin: false,
            },
          };
        }
      } catch (e) {
        console.warn('Fallback profile query failed:', e);
      }

      // Fallback jika baru mendaftar
      const autoName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const fallbackProfile = {
        id: `user-${email}`,
        full_name: autoName || 'Siswa PPLG',
        email,
        role: 'student',
        class_name: 'X PPLG 1',
        nisn: '',
        avatar_url: null,
        is_admin: false,
      };
      saveLocalUser({ ...fallbackProfile, password });

      return {
        success: true,
        user: { id: `user-${email}`, email },
        profile: fallbackProfile,
      };
    }

    if (errorMsg.includes('Invalid login credentials')) {
      return { success: false, message: 'Email atau kata sandi tidak cocok.' };
    }

    return { success: false, message: error.message };
  }

  const remoteProfile = data?.user ? await getProfileFromSupabase(data.user.id) : null;

  return {
    success: true,
    user: data?.user || null,
    profile: {
      id: data?.user?.id || 'local-user',
      email: data?.user?.email || email,
      full_name: remoteProfile?.full_name || foundUser?.full_name || data?.user?.user_metadata?.full_name || 'Siswa PPLG',
      class_name: remoteProfile?.class_name || foundUser?.class_name || data?.user?.user_metadata?.class_name || 'X PPLG 1',
      avatar_url: remoteProfile?.avatar_url || foundUser?.avatar_url || null,
      role: remoteProfile?.role || 'student',
      ...(remoteProfile || {}),
      is_admin: !!remoteProfile?.is_admin || isTrustedAdminEmail(data?.user?.email || email),
    },
  };
};

export const registerUser = async ({ email, password, full_name, class_name, nisn = '' }) => {
  if (!email || !password) {
    return { success: false, message: 'Email dan password wajib diisi.' };
  }

  const isLocalDevelopment = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname);

  const localUserObj = {
    id: `user-${Date.now()}`,
    email,
    password,
    full_name: full_name || 'Siswa PPLG',
    class_name: class_name || 'X PPLG 1',
    nisn: nisn || '',
    role: 'student',
    avatar_url: null,
    created_at: new Date().toISOString(),
  };

  // Simpan selalu ke storage lokal agar konsisten di kedua mode
  saveLocalUser(localUserObj);

  if (!isSupabaseConfigured || !supabase) {
    if (!isLocalDevelopment) {
      return {
        success: false,
        message: 'Pendaftaran belum bisa dilakukan karena Supabase belum aktif di deploy ini.',
      };
    }

    return {
      success: true,
      demo: true,
      user: {
        id: localUserObj.id,
        email,
      },
      profile: {
        ...localUserObj,
        is_admin: false,
      },
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: localUserObj.full_name,
        class_name: localUserObj.class_name,
        nisn: localUserObj.nisn,
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data?.user) {
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: localUserObj.full_name,
        class_name: localUserObj.class_name,
        nisn: localUserObj.nisn,
        role: 'student',
        avatar_url: null,
        is_admin: false,
      });
    } catch (e) {
      console.warn('Upsert profile di Supabase gagal:', e);
    }
  }

  return {
    success: true,
    user: data?.user || null,
    profile: {
      id: data?.user?.id || localUserObj.id,
      email: data?.user?.email || email,
      full_name: localUserObj.full_name,
      class_name: localUserObj.class_name,
      nisn: localUserObj.nisn,
      role: 'student',
      avatar_url: null,
      is_admin: false,
    },
  };
};

export const updateUserProfile = async (profileData) => {
  if (profileData?.email) {
    saveLocalUser(profileData);
  }

  if (isSupabaseConfigured && supabase && profileData?.id && !profileData.id.startsWith('local-')) {
    try {
      await supabase.from('profiles').upsert({
        id: profileData.id,
        full_name: profileData.full_name,
        class_name: profileData.class_name,
        avatar_url: profileData.avatar_url,
        nisn: profileData.nisn,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Update remote profile gagal:', e);
    }
  }

  return { success: true };
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
