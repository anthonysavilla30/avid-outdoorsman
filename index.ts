
// Log app startup for debugging
console.log('🚀 Avid Outdoorsman - App Starting...');
console.log('📱 Platform:', require('react-native').Platform.OS);
console.log('🔧 Environment:', __DEV__ ? 'Development' : 'Production');

// Check if environment variables are loaded
if (typeof process !== 'undefined' && process.env) {
  const hasSupabaseUrl = Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL);
  const hasSupabaseKey = Boolean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
  console.log('🔑 Supabase URL configured:', hasSupabaseUrl);
  console.log('🔑 Supabase Key configured:', hasSupabaseKey);
  
  if (!hasSupabaseUrl || !hasSupabaseKey) {
    console.log('ℹ️ Running in MOCK DATA mode - Supabase not configured');
  }
} else {
  console.log('⚠️ process.env not available');
}

import 'expo-router/entry';
