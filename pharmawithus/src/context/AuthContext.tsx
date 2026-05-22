import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
      setProfile(null);
    } else {
      setProfile(data as Profile);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const init = async () => {
      try {
        // Get initial session
        const { data: { session: s } } = await supabase.auth.getSession();
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          await fetchProfile(s.user.id);
        }
      } catch (err) {
        console.warn('Supabase auth not configured:', err);
      } finally {
        setLoading(false);
      }

      try {
        // Listen for auth changes
        const { data } = supabase.auth.onAuthStateChange(
          async (_event, s) => {
            setSession(s);
            setUser(s?.user ?? null);
            if (s?.user) {
              await fetchProfile(s.user.id);
            } else {
              setProfile(null);
            }
          }
        );
        subscription = data.subscription;
      } catch (err) {
        console.warn('Supabase listener not configured:', err);
      }
    };

    init();

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
    // Fire and forget the server-side sign out so a network hang doesn't block the UI
    supabase.auth.signOut().catch(err => console.warn('Supabase sign out error:', err));
    
    clearSessionCache();
    
    // Force clear local storage just in case Supabase's background task fails
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        localStorage.removeItem(key);
      }
    }
    
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAdmin: profile?.role === 'admin',
        loading,
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
