import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Professional {
  id: number;
  name: string;
  email: string;
  subscription_status: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  professional: Professional | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, professionalData: { name: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfessional = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('professional_id')
        .eq('id', userId)
        .single();

      if (profile) {
        const { data: professionalData } = await supabase
          .from('professionals')
          .select('*')
          .eq('id', profile.professional_id)
          .single();

        if (professionalData) {
          setProfessional(professionalData);
        }
      }
    } catch (error) {
      console.error('Error fetching professional:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfessional(session.user.id);
          }, 0);
        } else {
          setProfessional(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfessional(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signUp = async (email: string, password: string, professionalData: { name: string }) => {
    // First create the professional record
    const { data: professionalRecord, error: professionalError } = await supabase
      .from('professionals')
      .insert({
        name: professionalData.name,
        email: email,
        subscription_status: 'inactive'
      })
      .select()
      .single();

    if (professionalError) {
      return { error: professionalError };
    }

    // Then create the auth user with professional_id in metadata
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          professional_id: professionalRecord.id
        }
      }
    });

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setProfessional(null);
    }
  };

  const value = {
    user,
    session,
    professional,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};