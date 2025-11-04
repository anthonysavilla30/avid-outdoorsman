
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ConnectionTest {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  testContent: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  testMessage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  testDetails: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  configCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  configLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  configValue: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  instructionsStep: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginLeft: 8,
  },
});

export default function SupabaseStatusScreen() {
  const router = useRouter();
  const { user, isConfigured } = useAuth();
  const [testing, setTesting] = useState(false);
  const [tests, setTests] = useState<ConnectionTest[]>([]);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setTesting(true);
    const results: ConnectionTest[] = [];

    // Test 1: Check environment variables
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      results.push({
        name: 'Environment Variables',
        status: 'error',
        message: 'Supabase credentials not found',
        details: 'EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY must be set in .env file',
      });
    } else if (supabaseUrl.includes('your-project-id') || supabaseKey.includes('your-anon-key')) {
      results.push({
        name: 'Environment Variables',
        status: 'warning',
        message: 'Using placeholder credentials',
        details: 'Replace placeholder values in .env with your actual Supabase credentials',
      });
    } else {
      results.push({
        name: 'Environment Variables',
        status: 'success',
        message: 'Credentials found',
        details: `URL: ${supabaseUrl.substring(0, 30)}...`,
      });
    }

    // Test 2: Check Supabase client initialization
    if (isSupabaseConfigured()) {
      results.push({
        name: 'Client Initialization',
        status: 'success',
        message: 'Supabase client initialized',
        details: 'Client is ready to make requests',
      });
    } else {
      results.push({
        name: 'Client Initialization',
        status: 'error',
        message: 'Client not initialized',
        details: 'Check your environment variables',
      });
    }

    // Test 3: Test database connection
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
          results.push({
            name: 'Database Connection',
            status: 'error',
            message: 'Database connection failed',
            details: error.message,
          });
        } else {
          results.push({
            name: 'Database Connection',
            status: 'success',
            message: 'Database connected',
            details: 'Successfully queried profiles table',
          });
        }
      } catch (error: any) {
        results.push({
          name: 'Database Connection',
          status: 'error',
          message: 'Connection error',
          details: error.message,
        });
      }
    } else {
      results.push({
        name: 'Database Connection',
        status: 'pending',
        message: 'Skipped - client not configured',
        details: 'Configure environment variables first',
      });
    }

    // Test 4: Check authentication status
    if (isSupabaseConfigured()) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          results.push({
            name: 'Authentication',
            status: 'warning',
            message: 'Auth check failed',
            details: error.message,
          });
        } else if (session) {
          results.push({
            name: 'Authentication',
            status: 'success',
            message: 'User authenticated',
            details: `Logged in as ${session.user.email}`,
          });
        } else {
          results.push({
            name: 'Authentication',
            status: 'warning',
            message: 'No active session',
            details: 'User not logged in',
          });
        }
      } catch (error: any) {
        results.push({
          name: 'Authentication',
          status: 'error',
          message: 'Auth error',
          details: error.message,
        });
      }
    } else {
      results.push({
        name: 'Authentication',
        status: 'pending',
        message: 'Skipped - client not configured',
        details: 'Configure environment variables first',
      });
    }

    // Test 5: Check storage bucket
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
          results.push({
            name: 'Storage',
            status: 'warning',
            message: 'Storage check failed',
            details: error.message,
          });
        } else {
          const hasPostImages = data.some(bucket => bucket.name === 'post-images');
          if (hasPostImages) {
            results.push({
              name: 'Storage',
              status: 'success',
              message: 'Storage configured',
              details: 'post-images bucket found',
            });
          } else {
            results.push({
              name: 'Storage',
              status: 'warning',
              message: 'Storage accessible',
              details: 'post-images bucket not found - create it in Supabase dashboard',
            });
          }
        }
      } catch (error: any) {
        results.push({
          name: 'Storage',
          status: 'error',
          message: 'Storage error',
          details: error.message,
        });
      }
    } else {
      results.push({
        name: 'Storage',
        status: 'pending',
        message: 'Skipped - client not configured',
        details: 'Configure environment variables first',
      });
    }

    setTests(results);
    setTesting(false);
  };

  const getStatusColor = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'pending':
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'success':
        return 'checkmark.circle.fill';
      case 'error':
        return 'xmark.circle.fill';
      case 'warning':
        return 'exclamationmark.triangle.fill';
      case 'pending':
        return 'clock.fill';
    }
  };

  const getOverallStatus = () => {
    if (tests.length === 0) return 'pending';
    if (tests.some(t => t.status === 'error')) return 'error';
    if (tests.some(t => t.status === 'warning')) return 'warning';
    if (tests.every(t => t.status === 'success')) return 'success';
    return 'pending';
  };

  const handleOpenDocs = () => {
    Alert.alert(
      'Setup Instructions',
      'To connect Supabase:\n\n1. Create a .env file in your project root\n2. Copy contents from .env.example\n3. Replace placeholder values with your Supabase credentials\n4. Restart the Expo dev server\n\nFind your credentials at:\nhttps://app.supabase.com/project/_/settings/api',
      [{ text: 'OK' }]
    );
  };

  const overallStatus = getOverallStatus();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Supabase Connection',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View
            style={[
              styles.statusIcon,
              { backgroundColor: getStatusColor(overallStatus) + '20' },
            ]}
          >
            {testing ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <IconSymbol
                name={getStatusIcon(overallStatus)}
                size={40}
                color={getStatusColor(overallStatus)}
              />
            )}
          </View>
          <Text style={styles.title}>
            {testing
              ? 'Testing Connection...'
              : overallStatus === 'success'
              ? 'Connected'
              : overallStatus === 'error'
              ? 'Connection Failed'
              : overallStatus === 'warning'
              ? 'Partially Connected'
              : 'Not Configured'}
          </Text>
          <Text style={styles.subtitle}>
            {testing
              ? 'Running diagnostics'
              : isConfigured
              ? 'Supabase backend is active'
              : 'Configure Supabase to enable backend features'}
          </Text>
        </View>

        {!isConfigured && (
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>⚠️ Setup Required</Text>
            <Text style={styles.instructionsText}>
              To connect Supabase:
            </Text>
            <Text style={styles.instructionsStep}>
              1. Create a .env file in your project root
            </Text>
            <Text style={styles.instructionsStep}>
              2. Copy contents from .env.example
            </Text>
            <Text style={styles.instructionsStep}>
              3. Add your Supabase URL and anon key
            </Text>
            <Text style={styles.instructionsStep}>
              4. Restart the Expo dev server
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuration</Text>
          <View style={styles.configCard}>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Status:</Text>
              <Text style={styles.configValue}>
                {isConfigured ? '✅ Configured' : '❌ Not Configured'}
              </Text>
            </View>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>User:</Text>
              <Text style={styles.configValue}>
                {user ? user.email : 'Not logged in'}
              </Text>
            </View>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>URL:</Text>
              <Text style={styles.configValue} numberOfLines={1}>
                {process.env.EXPO_PUBLIC_SUPABASE_URL || 'Not set'}
              </Text>
            </View>
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>Key:</Text>
              <Text style={styles.configValue} numberOfLines={1}>
                {process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
                  ? '••••••••••••'
                  : 'Not set'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Tests</Text>
          {tests.map((test, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.testRow}>
                <View
                  style={[
                    styles.testIcon,
                    { backgroundColor: getStatusColor(test.status) + '20' },
                  ]}
                >
                  <IconSymbol
                    name={getStatusIcon(test.status)}
                    size={16}
                    color={getStatusColor(test.status)}
                  />
                </View>
                <View style={styles.testContent}>
                  <Text style={styles.testName}>{test.name}</Text>
                  <Text style={styles.testMessage}>{test.message}</Text>
                  {test.details && (
                    <Text style={styles.testDetails}>{test.details}</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.button} onPress={runTests} disabled={testing}>
          <Text style={styles.buttonText}>
            {testing ? 'Testing...' : 'Run Tests Again'}
          </Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleOpenDocs}>
          <Text style={styles.secondaryButtonText}>Setup Instructions</Text>
        </Pressable>

        {isConfigured && !user && (
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/(tabs)/auth/login')}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
