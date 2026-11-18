import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type UserProfile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
  created_at: string;
  updated_at: string;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<UserProfile | null>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (displayName: string, email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function getOrCreateProfile(user: User): Promise<UserProfile> {
  const { data: existing, error: selectError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing as UserProfile;

  const metadataName =
    typeof user.user_metadata?.display_name === 'string'
      ? user.user_metadata.display_name
      : typeof user.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : user.email?.split('@')[0] ?? 'Usuário';

  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({ id: user.id, display_name: metadataName })
    .select('*')
    .single();

  if (insertError) throw insertError;
  return created as UserProfile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!session?.user || !isSupabaseConfigured) return null;
    const nextProfile = await getOrCreateProfile(session.user);
    setProfile(nextProfile);
    return nextProfile;
  }, [session?.user]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession()
      .then(async ({ data, error }) => {
        if (!mounted) return;
        if (error) console.warn('Não foi possível recuperar a sessão:', error.message);
        setSession(data.session);

        if (data.session?.user) {
          try {
            const nextProfile = await getOrCreateProfile(data.session.user);
            if (mounted) setProfile(nextProfile);
          } catch (profileError) {
            console.warn('Não foi possível carregar o perfil:', profileError);
          }
        }

        if (mounted) setLoading(false);
      })
      .catch((error: unknown) => {
        console.warn('Falha ao iniciar autenticação:', error);
        if (mounted) setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (!nextSession) setProfile(null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Configure as variáveis do Supabase no arquivo .env.local.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw error;

    const nextProfile = await getOrCreateProfile(data.user);
    setProfile(nextProfile);
  }, []);

  const signUp = useCallback(async (displayName: string, email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Configure as variáveis do Supabase no arquivo .env.local.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { display_name: displayName.trim(), full_name: displayName.trim() } },
    });
    if (error) throw error;

    if (data.session && data.user) {
      const nextProfile = await getOrCreateProfile(data.user);
      setProfile(nextProfile);
    }

    return { needsEmailConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      refreshProfile,
      signIn,
      signUp,
      signOut,
    }),
    [session, profile, loading, refreshProfile, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa ser usado dentro de AuthProvider.');
  return context;
}
