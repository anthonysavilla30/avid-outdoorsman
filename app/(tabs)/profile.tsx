
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Platform, Image, Pressable } from 'react-native';
import React from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export default function ProfileScreen() {
  const router = useRouter();

  const handleMapPress = () => {
    router.push('/(tabs)/map');
  };

  const handleTrackMilesPress = () => {
    console.log('Track Miles pressed - already on profile');
  };

  const handleMessagesPress = () => {
    router.push('/(tabs)/messages');
  };

  const handleNotificationsPress = () => {
    router.push('/(tabs)/notifications');
  };

  const renderHeaderRight = () => (
    <View style={styles.headerButtonGroup}>
      <Pressable style={styles.headerButton} onPress={handleMessagesPress}>
        <IconSymbol name="message.fill" color={colors.primary} size={24} />
      </Pressable>
      <Pressable style={styles.headerButton} onPress={handleNotificationsPress}>
        <IconSymbol name="bell.fill" color={colors.primary} size={24} />
      </Pressable>
    </View>
  );

  const renderHeaderLeft = () => (
    <View style={styles.headerButtonGroup}>
      <Pressable style={styles.headerButton} onPress={handleMapPress}>
        <IconSymbol name="map.fill" color={colors.primary} size={24} />
      </Pressable>
      <Pressable style={styles.trackMilesButtonIOS} onPress={handleTrackMilesPress}>
        <IconSymbol name="figure.run" color={colors.primary} size={20} />
      </Pressable>
    </View>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Profile',
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
            headerLargeTitle: false,
          }}
        />
      )}
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            Platform.OS !== 'ios' && styles.contentWithTabBar,
          ]}
        >
          {Platform.OS !== 'ios' && (
            <View style={styles.topBar}>
              <View style={styles.topLeft}>
                <Pressable style={styles.topButton} onPress={handleMapPress}>
                  <IconSymbol name="map.fill" color={colors.text} size={24} />
                </Pressable>
                <Pressable style={styles.trackMilesButton} onPress={handleTrackMilesPress}>
                  <IconSymbol name="figure.run" color="#ffffff" size={20} />
                  <Text style={styles.trackMilesText}>Track Miles</Text>
                </Pressable>
              </View>
              <View style={styles.topRight}>
                <Pressable style={styles.topButton} onPress={handleMessagesPress}>
                  <IconSymbol name="message.fill" color={colors.text} size={24} />
                </Pressable>
                <Pressable style={styles.topButton} onPress={handleNotificationsPress}>
                  <IconSymbol name="bell.fill" color={colors.text} size={24} />
                </Pressable>
              </View>
            </View>
          )}

          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }}
              style={styles.avatar}
            />
            <Text style={styles.name}>John Outdoorsman</Text>
            <Text style={styles.username}>@john_outdoors</Text>
            <Text style={styles.bio}>
              Passionate hunter, angler, and hiker. Sharing my adventures and favorite spots with the community.
            </Text>
            
            <Pressable style={styles.editButton}>
              <IconSymbol name="pencil" color={colors.primary} size={16} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>1.2K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>543</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Activity Badges */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activities</Text>
            <View style={styles.badgesContainer}>
              <ActivityBadge icon="fish.fill" label="Fishing" color={colors.primary} />
              <ActivityBadge icon="scope" label="Hunting" color={colors.secondary} />
              <ActivityBadge icon="figure.hiking" label="Hiking" color={colors.highlight} />
              <ActivityBadge icon="tent.fill" label="Camping" color={colors.accent} />
            </View>
          </View>

          {/* Stats Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.card}>
              <StatRow icon="mappin.circle.fill" label="Landmarks Created" value="23" />
              <StatRow icon="location.fill" label="Miles Traveled" value="1,247" />
              <StatRow icon="calendar" label="Days Outdoors" value="89" />
              <StatRow icon="star.fill" label="Reviews Written" value="45" />
            </View>
          </View>

          {/* Mile Tracking Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mile Tracking</Text>
            <View style={styles.card}>
              <View style={styles.mileTrackingHeader}>
                <IconSymbol name="figure.run" size={32} color={colors.primary} />
                <View style={styles.mileTrackingInfo}>
                  <Text style={styles.mileTrackingTitle}>Track Your Miles</Text>
                  <Text style={styles.mileTrackingSubtitle}>
                    Start tracking your outdoor adventures and compete on the leaderboard!
                  </Text>
                </View>
              </View>
              <Pressable style={styles.startTrackingButton}>
                <IconSymbol name="play.fill" color="#ffffff" size={20} />
                <Text style={styles.startTrackingText}>Start Tracking</Text>
              </Pressable>
              <View style={styles.leaderboardPreview}>
                <Text style={styles.leaderboardTitle}>Leaderboard Preview</Text>
                <Text style={styles.leaderboardSubtitle}>Coming soon: Compete with others and win prizes!</Text>
              </View>
            </View>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.card}>
              <SettingRow icon="bell.fill" label="Notifications" />
              <SettingRow icon="lock.fill" label="Privacy" />
              <SettingRow icon="location.fill" label="Location Services" />
              <SettingRow icon="questionmark.circle.fill" label="Help & Support" />
              <SettingRow icon="info.circle.fill" label="About" />
            </View>
          </View>

          <Pressable style={styles.logoutButton}>
            <IconSymbol name="arrow.right.square.fill" color={colors.secondary} size={20} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
}

function ActivityBadge({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <View style={[styles.activityBadge, { borderColor: color }]}>
      <IconSymbol name={icon as any} size={24} color={color} />
      <Text style={[styles.activityLabel, { color }]}>{label}</Text>
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
      <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 16,
  },
  contentWithTabBar: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.card,
  },
  topLeft: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  topButton: {
    padding: 8,
  },
  topRight: {
    flexDirection: 'row',
    gap: 8,
  },
  trackMilesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackMilesText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  trackMilesButtonIOS: {
    padding: 4,
  },
  profileHeader: {
    backgroundColor: colors.card,
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: colors.card,
  },
  activityLabel: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 16,
    color: colors.text,
  },
  statRowValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  mileTrackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  mileTrackingInfo: {
    flex: 1,
  },
  mileTrackingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  mileTrackingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  startTrackingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  startTrackingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  leaderboardPreview: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  leaderboardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingRowLabel: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
  },
  headerButton: {
    padding: 4,
  },
  headerButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginRight: 8,
  },
});
