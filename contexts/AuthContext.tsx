
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
      try {
        console.log('🔐 AuthContext: Checking user authentication...');
        
        if (!isConfigured) {
          console.log('ℹ️ AuthContext: Supabase not configured, skipping auth check');
          setLoading(false);
          return;
        }

        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        console.log('✅ AuthContext: User check complete', currentUser ? 'User found' : 'No user');
        setLoading(false);
      } catch (error) {
        console.error('❌ AuthContext: Error checking user:', error);
        setLoading(false);
      }
    };

    checkUser();

    // Listen to auth state changes
    if (isConfigured) {
      try {
        const { data: { subscription } } = authService.onAuthStateChange((user) => {
          console.log('🔄 AuthContext: Auth state changed', user ? 'User logged in' : 'User logged out');
          setUser(user);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('❌ AuthContext: Error setting up auth listener:', error);
      }
    }
  }, [isConfigured]);

  const signIn = async (email: string, password: string) => {
    try {
      const { user: newUser, error } = await authService.signIn(email, password);
      if (!error && newUser) {
        setUser(newUser);
      }
      return { error };
    } catch (error) {
      console.error('❌ AuthContext: Sign in error:', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { user: newUser, error } = await authService.signUp(email, password, name);
      if (!error && newUser) {
        setUser(newUser);
      }
      return { error };
    } catch (error) {
      console.error('❌ AuthContext: Sign up error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await authService.signOut();
      if (!error) {
        setUser(null);
      }
      return { error };
    } catch (error) {
      console.error('❌ AuthContext: Sign out error:', error);
      return { error: error as Error };
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    try {
      const { error } = await authService.updateProfile(user.id, updates);
      if (!error) {
        setUser({ ...user, ...updates });
      }
      return { error };
    } catch (error) {
      console.error('❌ AuthContext: Update profile error:', error);
      return { error: error as Error };
    }
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
