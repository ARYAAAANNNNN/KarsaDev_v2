import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfileFromSupabase, isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

const defaultProfile = {
  id: 'local-user',
  full_name: 'Ahmad Fauzi',
  email: 'ahmad.fauzi@smk.sch.id',
  role: 'student',
  class_name: 'XII PPLG 1',
  xp: 1250,
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
    if (!isSupabaseConfigured || !supabase) {
      const nextProfile = {
        ...defaultProfile,
        email,
        role: email.includes('guru') || email.includes('teacher') ? 'teacher' : 'student',
      };
      setProfile(nextProfile);
      return { success: true, profile: nextProfile };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, message: error.message };
    }

    const remoteProfile = await getProfileFromSupabase(data.user.id);
    const nextProfile = {
      ...defaultProfile,
      ...(remoteProfile || {}),
      id: data.user.id,
      email: data.user.email,
    };

    setProfile(nextProfile);
    return { success: true, profile: nextProfile };
  };

  const signUp = async ({ email, password, full_name, class_name }) => {
    if (!isSupabaseConfigured || !supabase) {
      const nextProfile = {
        ...defaultProfile,
        email,
        full_name: full_name || defaultProfile.full_name,
        class_name: class_name || defaultProfile.class_name,
        role: 'student',
      };
      setProfile(nextProfile);
      return { success: true, profile: nextProfile };
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

    const nextProfile = {
      ...defaultProfile,
      id: data.user?.id || defaultProfile.id,
      email: data.user?.email || email,
      full_name: full_name || defaultProfile.full_name,
      class_name: class_name || defaultProfile.class_name,
      role: 'student',
    };

    setProfile(nextProfile);
    return { success: true, profile: nextProfile };
  };

  const switchTeacherRole = async (pin) => {
    const normalized = String(pin || '').trim().toUpperCase();

    if (normalized !== 'GURU2026') {
      return { success: false, message: 'PIN tidak valid. Gunakan GURU2026.' };
    }

    const updatedProfile = {
      ...profile,
      role: 'teacher',
      full_name: 'Wanda Kurniawan',
      class_name: 'Guru PPLG',
    };

    setProfile(updatedProfile);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            role: 'teacher',
            full_name: 'Wanda Kurniawan',
            class_name: 'Guru PPLG',
          })
          .eq('id', profile.id);
      } catch (error) {
        console.warn('Role update to Supabase failed:', error);
      }
    }

    return { success: true, role: 'teacher' };
  };

  const switchStudentRole = async () => {
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
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }

    setProfile(defaultProfile);
  };

  const value = useMemo(
    () => ({ profile, setProfile, loading, signIn, signUp, switchTeacherRole, switchStudentRole, signOut }),
    [profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
