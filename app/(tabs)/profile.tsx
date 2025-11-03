
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Profile',
            headerLargeTitle: false,
          }}
        />
      )}
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            Platform.OS !== 'ios' && styles.contentWithTabBar,
          ]}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' }}
              style={styles.avatar}
            />
            <Text style={styles.name}>John Outdoorsman</Text>
            <Text style={styles.location}>
              <IconSymbol name="location.fill" size={14} color={colors.textSecondary} />
              {' '}Montana
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>127</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>342</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>89</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
            <Pressable style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          </View>

          {/* Activities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Activities</Text>
            <View style={styles.activitiesGrid}>
              <ActivityBadge icon="scope" label="Hunting" color={colors.secondary} />
              <ActivityBadge icon="figure.fishing" label="Fishing" color={colors.primary} />
              <ActivityBadge icon="figure.hiking" label="Hiking" color={colors.highlight} />
              <ActivityBadge icon="tent" label="Camping" color={colors.accent} />
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Season</Text>
            <View style={styles.card}>
              <StatRow icon="figure.fishing" label="Fish Caught" value="47" />
              <StatRow icon="figure.hiking" label="Miles Hiked" value="156" />
              <StatRow icon="mountain.2" label="Peaks Summited" value="8" />
              <StatRow icon="tent" label="Nights Camped" value="23" />
            </View>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.card}>
              <SettingRow icon="bell.fill" label="Notifications" />
              <SettingRow icon="lock.fill" label="Privacy" />
              <SettingRow icon="location.fill" label="Location Settings" />
              <SettingRow icon="questionmark.circle.fill" label="Help & Support" />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function ActivityBadge({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <View style={[styles.activityBadge, { backgroundColor: color }]}>
      <IconSymbol name={icon as any} size={28} color="#ffffff" />
      <Text style={styles.activityLabel}>{label}</Text>
    </View>
  );
}

function StatRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <View style={styles.statRowLeft}>
        <IconSymbol name={icon as any} size={20} color={colors.primary} />
        <Text style={styles.statRowLabel}>{label}</Text>
      </View>
      <Text style={styles.statRowValue}>{value}</Text>
    </View>
  );
}

function SettingRow({ icon, label }: { icon: string; label: string }) {
  return (
    <Pressable style={styles.settingRow}>
      <View style={styles.settingRowLeft}>
        <IconSymbol name={icon as any} size={20} color={colors.textSecondary} />
        <Text style={styles.settingRowLabel}>{label}</Text>
      </View>
      <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  contentWithTabBar: {
    paddingBottom: 100,
  },
  profileHeader: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityBadge: {
    flex: 1,
    minWidth: '45%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  activityLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statRowLabel: {
    fontSize: 15,
    color: colors.text,
  },
  statRowValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingRowLabel: {
    fontSize: 15,
    color: colors.text,
  },
});
