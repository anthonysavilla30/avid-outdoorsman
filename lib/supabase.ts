
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// These will be set by the user when they enable Supabase
// Using optional chaining to safely access process.env
const supabaseUrl = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_URL) || '';
const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY) || '';

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  const hasUrl = Boolean(supabaseUrl && supabaseUrl !== '' && supabaseUrl !== 'https://your-project-id.supabase.co');
  const hasKey = Boolean(supabaseAnonKey && supabaseAnonKey !== '' && supabaseAnonKey !== 'your-anon-key-here');
  return hasUrl && hasKey;
};

// Create a placeholder client or real client based on configuration
let supabaseClient: SupabaseClient | null = null;

const initializeSupabase = () => {
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
      console.log('📍 Supabase URL:', supabaseUrl.substring(0, 30) + '...');
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error);
      supabaseClient = null;
    }
  } else {
    console.log('⚠️ Supabase not configured - using mock data mode');
    console.log('To enable Supabase:');
    console.log('1. Create a .env file in the root directory');
    console.log('2. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
    console.log('3. Restart the Expo dev server with: npm run dev');
    supabaseClient = null;
  }
};

// Initialize on module load
initializeSupabase();

// Export the client (will be null if not configured)
export const supabase = supabaseClient as SupabaseClient;

// Helper function to safely use Supabase
export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase is not configured. Using mock data mode.');
    return null;
  }
  return supabaseClient;
};
