import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { clearSessionCache } from '../lib/api';
import { friendlyAuthMessage } from '../lib/errors';
import type { UserRole } from '../lib/database.types';

interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileReady, setProfileReady] = useState(false);
  const profileRequestId = useRef(0);

  const fetchProfile = useCallback(async (userId: string) => {
    const requestId = ++profileRequestId.current;
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, avatar_url')
      .eq('id', userId)
      .single();

    if (requestId !== profileRequestId.current) return;

    if (error) {
      console.error('Error fetching profile:', error.message);
      setProfile(null);
    } else {
      setProfile(data as Profile);
    }
    setProfileReady(true);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    try {
      // INITIAL_SESSION is the first load. Do not getSession() and then wipe
      // profile here — that made admin routes bounce to /dashboard and back.
      const { data } = supabase.auth.onAuthStateChange((event, s) => {
        setSession(s);
        setUser(s?.user ?? null);

        if (!s?.user) {
          profileRequestId.current += 1;
          setProfile(null);
          setProfileReady(true);
          setLoading(false);
          return;
        }

        if (event === 'TOKEN_REFRESHED') {
          setLoading(false);
          return;
        }

        void fetchProfile(s.user.id).finally(() => setLoading(false));
      });
      subscription = data.subscription;
    } catch (err) {
      console.warn('Supabase listener not configured:', err);
      setLoading(false);
      setProfileReady(true);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) return { error: friendlyAuthMessage(error.message) };
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: friendlyAuthMessage(error.message) };
    return { error: null };
  };

  const signOut = async () => {
    clearSessionCache();

    profileRequestId.current += 1;
    setUser(null);
    setProfile(null);
    setProfileReady(true);
    setSession(null);

    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      console.warn('Supabase sign out error:', error.message);
    }

    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        localStorage.removeItem(key);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAdmin: profile?.role === 'admin',
        loading: loading || Boolean(user && !profileReady),
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
