
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User } from '@/services/authService';
import { isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: Error | null }>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured] = useState(isSupabaseConfigured());

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      if (!isConfigured) {
        setLoading(false);
        return;
      }

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();

    // Listen to auth state changes
    if (isConfigured) {
      const { data: { subscription } } = authService.onAuthStateChange((user) => {
        setUser(user);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isConfigured]);

  const signIn = async (email: string, password: string) => {
    const { user: newUser, error } = await authService.signIn(email, password);
    if (!error && newUser) {
      setUser(newUser);
    }
    return { error };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const { user: newUser, error } = await authService.signUp(email, password, name);
    if (!error && newUser) {
      setUser(newUser);
    }
    return { error };
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    const { error } = await authService.updateProfile(user.id, updates);
    if (!error) {
      setUser({ ...user, ...updates });
    }
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile, isConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
