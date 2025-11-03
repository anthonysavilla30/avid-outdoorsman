
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Stack, useRouter } from 'expo-router';
import { mockBadges } from '@/data/mockBadges';
import { Badge } from '@/types/Gamification';

export default function BadgesScreen() {
  const router = useRouter();

  const handleMapPress = () => {
    router.push('/(tabs)/map');
  };

  const handleTrackMilesPress = () => {
    router.push('/(tabs)/profile');
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

  const earnedBadges = mockBadges.filter(b => b.earned);
  const lockedBadges = mockBadges.filter(b => !b.earned);

  const renderBadge = (badge: Badge) => (
    <View
      key={badge.id}
      style={[
        styles.badgeCard,
        !badge.earned && styles.badgeCardLocked,
      ]}
    >
      <View style={[styles.badgeIconContainer, { backgroundColor: badge.earned ? badge.color : colors.border }]}>
        <IconSymbol
          name={badge.icon as any}
          size={40}
          color={badge.earned ? '#ffffff' : colors.textSecondary}
        />
      </View>
      <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}>
        {badge.name}
      </Text>
      <Text style={styles.badgeDescription}>{badge.description}</Text>
      <Text style={styles.badgeRequirement}>{badge.requirement}</Text>
      
      {!badge.earned && badge.progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${badge.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{badge.progress}%</Text>
        </View>
      )}
      
      {badge.earned && badge.earnedDate && (
        <Text style={styles.earnedDate}>
          Earned {badge.earnedDate.toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Badges',
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

          <View style={styles.header}>
            <Text style={styles.title}>Achievement Badges</Text>
            <Text style={styles.subtitle}>
              Earn badges by completing challenges and milestones
            </Text>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <IconSymbol name="rosette" size={32} color={colors.accent} />
              <Text style={styles.statValue}>{earnedBadges.length}</Text>
              <Text style={styles.statLabel}>Earned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <IconSymbol name="lock.fill" size={32} color={colors.textSecondary} />
              <Text style={styles.statValue}>{lockedBadges.length}</Text>
              <Text style={styles.statLabel}>Locked</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <IconSymbol name="star.fill" size={32} color={colors.primary} />
              <Text style={styles.statValue}>2,341</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>

          {earnedBadges.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Earned Badges</Text>
              <View style={styles.badgesGrid}>
                {earnedBadges.map(renderBadge)}
              </View>
            </View>
          )}

          {lockedBadges.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Locked Badges</Text>
              <View style={styles.badgesGrid}>
                {lockedBadges.map(renderBadge)}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </>
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
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 20,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeNameLocked: {
    color: colors.textSecondary,
  },
  badgeDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeRequirement: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  progressContainer: {
    width: '100%',
    marginTop: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  earnedDate: {
    fontSize: 11,
    color: colors.highlight,
    marginTop: 8,
    textAlign: 'center',
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
