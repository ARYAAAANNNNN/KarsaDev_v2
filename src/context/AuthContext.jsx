import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { isTrustedAdminEmail, loginUser, logoutUser, registerUser } from '../lib/authApi';
import { getProfileFromSupabase, isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

const defaultProfile = {
  id: 'local-user',
  full_name: 'Siswa PPLG',
  email: 'siswa@smk.sch.id',
  role: 'student',
  class_name: 'X PPLG 1',
  xp: 0,
  is_admin: false,
};

const STORAGE_KEY = 'karsadev_profile';

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultProfile;

    try {
      return JSON.parse(saved);
    } catch {
      return defaultProfile;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    const hydrate = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;

        if (!user) {
          setLoading(false);
          return;
        }

        const remoteProfile = await getProfileFromSupabase(user.id);
        if (remoteProfile) {
          setProfile({
            ...defaultProfile,
            ...remoteProfile,
            id: remoteProfile.id || user.id,
            email: remoteProfile.email || user.email,
          });
        }
      } catch (error) {
        console.warn('Auth hydration failed:', error);
      } finally {
        setLoading(false);
      }
    };

    hydrate();

    const { data: authListener } = supabase
      ? supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_OUT') {
            setProfile(defaultProfile);
            return;
          }

          const user = session?.user;
          if (!user) return;

          const remoteProfile = await getProfileFromSupabase(user.id);
          const nextProfile = {
            ...defaultProfile,
            ...(remoteProfile || {}),
            id: user.id,
            email: user.email || remoteProfile?.email || defaultProfile.email,
          };

          setProfile(nextProfile);
        })
      : { data: { subscription: null } };

    return () => authListener?.subscription?.unsubscribe?.();
  }, []);

  const signIn = async (email, password) => {
    const result = await loginUser({ email, password });

    if (!result.success) {
      return result;
    }

    const nextProfile = {
      ...defaultProfile,
      ...(result.profile || {}),
      id: result.profile?.id || result.user?.id || defaultProfile.id,
      email: result.profile?.email || result.user?.email || email,
      role: result.profile?.role || defaultProfile.role,
      class_name: result.profile?.class_name || defaultProfile.class_name,
      full_name: result.profile?.full_name || defaultProfile.full_name,
      is_admin: !!(result.profile?.is_admin || isTrustedAdminEmail(result.profile?.email || email)),
    };

    setProfile(nextProfile);
    return { success: true, profile: nextProfile };
  };

  const signUp = async ({ email, password, full_name, class_name }) => {
    const result = await registerUser({ email, password, full_name, class_name });

    if (!result.success) {
      return result;
    }

    const nextProfile = {
      ...defaultProfile,
      ...(result.profile || {}),
      id: result.profile?.id || result.user?.id || defaultProfile.id,
      email: result.profile?.email || result.user?.email || email,
      full_name: result.profile?.full_name || full_name || defaultProfile.full_name,
      class_name: result.profile?.class_name || class_name || defaultProfile.class_name,
      role: result.profile?.role || 'student',
      is_admin: !!(result.profile?.is_admin || false),
    };

    setProfile(nextProfile);
    return { success: true, profile: nextProfile };
  };

  const switchTeacherRole = useCallback(async (pin) => {
    const normalized = String(pin || '').trim().toUpperCase();

    if (normalized !== 'GURU2026') {
      return { success: false, message: 'PIN tidak valid. Gunakan GURU2026.' };
    }

    const currentEmail = String(profile?.email || '').trim().toLowerCase();
    if (!isTrustedAdminEmail(currentEmail)) {
      return { success: false, message: 'Akses admin hanya dapat dipakai oleh akun terdaftar.' };
    }

    const updatedProfile = {
      ...profile,
      role: 'teacher',
      is_admin: true,
    };

    setProfile(updatedProfile);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            role: 'teacher',
            is_admin: true,
          })
          .eq('id', profile.id);
      } catch (error) {
        console.warn('Role update to Supabase failed:', error);
      }
    }

    return { success: true, role: 'teacher' };
  }, [profile]);

  const switchStudentRole = useCallback(async () => {
    const updatedProfile = {
      ...profile,
      role: 'student',
      full_name: defaultProfile.full_name,
      class_name: defaultProfile.class_name,
    };

    setProfile(updatedProfile);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            role: 'student',
            full_name: defaultProfile.full_name,
            class_name: defaultProfile.class_name,
          })
          .eq('id', profile.id);
      } catch (error) {
        console.warn('Role reset to student failed:', error);
      }
    }

    return { success: true, role: 'student' };
  }, [profile]);

  const signOut = async () => {
    const result = await logoutUser();

    if (!result.success) {
      console.warn('Logout failed:', result.message);
    }

    setProfile(defaultProfile);
    return result;
  };

  const value = useMemo(
    () => ({ profile, setProfile, loading, signIn, signUp, switchTeacherRole, switchStudentRole, signOut }),
    [profile, loading, switchTeacherRole, switchStudentRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
