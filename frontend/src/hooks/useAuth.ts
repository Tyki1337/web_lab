import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем текущую сессию при загрузке
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Подписываемся на изменения состояния авторизации (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = (email: string, pass: string) => 
    supabase.auth.signUp({ email, password: pass });

  const signIn = (email: string, pass: string) => 
    supabase.auth.signInWithPassword({ email, password: pass });

  const signOut = () => 
    supabase.auth.signOut();

  return { user, loading, signUp, signIn, signOut };
}