
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Alert } from 'react-native';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  favoriteActivities?: string[];
  createdAt: Date;
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

class AuthService {
  // Sign up with email and password
  async signUp(email: string, password: string, name?: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      return { user: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: name || email.split('@')[0],
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: name || email.split('@')[0],
            createdAt: new Date(),
          },
          error: null,
        };
      }

      return { user: null, error: new Error('Sign up failed') };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: error as Error };
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      return { user: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile
        const profile = await this.getUserProfile(data.user.id);
        return { user: profile, error: null };
      }

      return { user: null, error: new Error('Sign in failed') };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: error as Error };
    }
  }

  // Sign out
  async signOut(): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as Error };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      return await this.getUserProfile(user.id);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        bio: data.bio,
        location: data.location,
        favoriteActivities: data.favorite_activities,
        createdAt: new Date(data.created_at),
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          avatar: updates.avatar,
          bio: updates.bio,
          location: updates.location,
          favorite_activities: updates.favoriteActivities,
        })
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error as Error };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    if (!isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (session?.user) {
        const profile = await this.getUserProfile(session.user.id);
        callback(profile);
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
