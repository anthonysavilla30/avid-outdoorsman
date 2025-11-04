
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// These will be set by the user when they enable Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '');
};

// Create a placeholder client or real client based on configuration
let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: Platform.OS === 'web' ? undefined : AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web',
      },
    });
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
    supabaseClient = null;
  }
} else {
  console.log('⚠️ Supabase not configured - using mock data mode');
  console.log('To enable Supabase:');
  console.log('1. Create a .env file in the root directory');
  console.log('2. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
  console.log('3. Restart the Expo dev server');
}

// Export the client (will be null if not configured)
export const supabase = supabaseClient as SupabaseClient;

// Helper function to safely use Supabase
export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase is not configured. Please set up environment variables.');
    return null;
  }
  return supabaseClient;
};
