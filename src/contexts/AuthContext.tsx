import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const mapAuthError = (error: { message?: string; status?: number; code?: string }) => {
  const msg = (error.message || '').toLowerCase();
  if (error.status === 429 || msg.includes('rate limit') || msg.includes('too many')) {
    return new Error('EMAIL_RATE_LIMIT');
  }
  return error instanceof Error ? error : new Error(String(error.message || 'Auth error'));
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isWriter: boolean;
  loading: boolean;
  getAccessToken: () => Promise<string | null>;
  /** Creates user; signs in immediately when email confirmation is off in Supabase. */
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const writerEmail = (import.meta.env.VITE_WRITER_EMAIL || '').toLowerCase().trim();
  const isWriter = !!user?.email && !!writerEmail && user.email.toLowerCase() === writerEmail;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const trimmed = email.trim();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmed,
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });
      if (error) throw mapAuthError(error);
      
      // If no session is returned, it means email confirmation is likely enabled.
      // We should NOT try to sign in with password here because it will fail with 400 
      // if the email is not confirmed yet.
      if (!data.session) {
        // Just return - the UI will handle the "Check your email" state implicitly 
        // because no error was thrown but no user is logged in yet.
        return;
      }
    } catch (error: unknown) {
      if (error instanceof TypeError) {
        throw new Error('NETWORK_AUTH_FAILED');
      }
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw mapAuthError(error);
    } catch (error: unknown) {
      if (error instanceof TypeError) {
        throw new Error('NETWORK_AUTH_FAILED');
      }
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    const trimmed = email.trim();
    const redirectTo = `${window.location.origin}/auth`;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, { redirectTo });
      if (error) throw mapAuthError(error);
    } catch (error: unknown) {
      if (error instanceof TypeError) {
        throw new Error('NETWORK_AUTH_FAILED');
      }
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw mapAuthError(error);
    } catch (error: unknown) {
      if (error instanceof TypeError) {
        throw new Error('NETWORK_AUTH_FAILED');
      }
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const getAccessToken = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session?.access_token ?? null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isWriter,
        loading,
        getAccessToken,
        signUpWithEmail,
        signInWithEmail,
        requestPasswordReset,
        updatePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
