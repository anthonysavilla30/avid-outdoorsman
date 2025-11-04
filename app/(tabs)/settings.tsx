
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [showDistance, setShowDistance] = useState(true);

  const supabaseConnected = isSupabaseConfigured();

  const handleLogout = () => {
    if (!user) {
      Alert.alert('Not Logged In', 'You are not currently logged in.');
      return;
    }

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error', 'Failed to logout: ' + error.message);
            } else {
              Alert.alert('Success', 'You have been logged out');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Account deleted');
            Alert.alert('Feature Coming Soon', 'Account deletion will be available in a future update.');
          },
        },
      ]
    );
  };

  const handleSupabaseStatus = () => {
    router.push('/(tabs)/supabase-status');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Backend Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backend</Text>
          <Pressable style={styles.settingRow} onPress={handleSupabaseStatus}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: supabaseConnected ? colors.success : colors.error },
                ]}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Supabase Connection</Text>
                <Text style={styles.settingSubtext}>
                  {supabaseConnected ? 'Connected' : 'Not configured'}
                </Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
          {user && (
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol name="person.circle.fill" size={24} color={colors.success} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingText}>Logged In</Text>
                  <Text style={styles.settingSubtext}>{user.email}</Text>
                </View>
              </View>
            </View>
          )}
          {!user && supabaseConnected && (
            <Pressable
              style={styles.settingRow}
              onPress={() => router.push('/(tabs)/auth/login')}
            >
              <View style={styles.settingLeft}>
                <IconSymbol name="person.circle" size={24} color={colors.warning} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingText}>Sign In</Text>
                  <Text style={styles.settingSubtext}>Access your account</Text>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Pressable style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol name="person.circle" size={24} color={colors.text} />
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol name="key" size={24} color={colors.text} />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol name="lock" size={24} color={colors.text} />
              <Text style={styles.settingText}>Private Profile</Text>
            </View>
            <Switch
              value={privateProfile}
              onValueChange={setPrivateProfile}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol name="location" size={24} color={colors.text} />
              <Text style={styles.settingText}>Location Sharing</Text>
            </View>
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol name="eye" size={24} color={colors.text} />
              <Text style={styles.settingText}>Show Distance</Text>
            </View>
            <Switch
              value={showDistance}
              onValueChange={setShowDistance}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol name="bell" size={24} color={colors.text} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol name="envelope" size={24} color={colors.text} />
              <Text style={styles.settingText}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <Pressable style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol name="info.circle" size={24} color={colors.text} />
              <Text style={styles.settingText}>About</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
          <Pressable 
            style={styles.settingRow}
            onPress={() => router.push('/(tabs)/terms-conditions')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol name="doc.text" size={24} color={colors.text} />
              <Text style={styles.settingText}>Terms & Conditions</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
          <Pressable 
            style={styles.settingRow}
            onPress={() => router.push('/(tabs)/privacy-policy')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol name="lock.shield" size={24} color={colors.text} />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Danger Zone */}
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            <Pressable style={styles.settingRow} onPress={handleLogout}>
              <View style={styles.settingLeft}>
                <IconSymbol name="arrow.right.square" size={24} color={colors.secondary} />
                <Text style={[styles.settingText, styles.dangerText]}>Logout</Text>
              </View>
            </Pressable>
            <Pressable style={styles.settingRow} onPress={handleDeleteAccount}>
              <View style={styles.settingLeft}>
                <IconSymbol name="trash" size={24} color={colors.secondary} />
                <Text style={[styles.settingText, styles.dangerText]}>Delete Account</Text>
              </View>
            </Pressable>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Avid Outdoorsman v1.0.0</Text>
          <Text style={styles.footerText}>Built by outdoorsmen, for outdoorsmen</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  settingSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dangerText: {
    color: colors.secondary,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
