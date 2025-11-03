
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Stack, useRouter } from 'expo-router';
import { mockLeaderboard } from '@/data/mockLeaderboard';
import { LeaderboardEntry } from '@/types/Gamification';

type LeaderboardFilter = 'all-time' | 'monthly' | 'weekly';

export default function LeaderboardScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<LeaderboardFilter>('all-time');

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

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return colors.textSecondary;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return 'trophy.fill';
    if (rank === 2) return 'medal.fill';
    if (rank === 3) return 'medal.fill';
    return 'number.square.fill';
  };

  const renderEntry = ({ item }: { item: LeaderboardEntry }) => {
    const isCurrentUser = item.username === 'john_outdoors';
    
    return (
      <View style={[styles.entryCard, isCurrentUser && styles.currentUserCard]}>
        <View style={styles.rankContainer}>
          <IconSymbol 
            name={getRankIcon(item.rank) as any} 
            size={32} 
            color={getRankColor(item.rank)} 
          />
          <Text style={[styles.rankText, { color: getRankColor(item.rank) }]}>
            #{item.rank}
          </Text>
        </View>
        
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        
        <View style={styles.entryInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <IconSymbol name="star.fill" size={14} color={colors.accent} />
              <Text style={styles.statText}>{item.points.toLocaleString()}</Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol name="figure.run" size={14} color={colors.primary} />
              <Text style={styles.statText}>{item.miles}</Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol name="doc.text.fill" size={14} color={colors.highlight} />
              <Text style={styles.statText}>{item.posts}</Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol name="rosette" size={14} color={colors.secondary} />
              <Text style={styles.statText}>{item.badges}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Leaderboard',
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
            headerLargeTitle: false,
          }}
        />
      )}
      <View style={styles.container}>
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
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>Compete with outdoor enthusiasts</Text>
        </View>

        <View style={styles.filterContainer}>
          <Pressable
            style={[styles.filterButton, filter === 'all-time' && styles.filterButtonActive]}
            onPress={() => setFilter('all-time')}
          >
            <Text style={[styles.filterText, filter === 'all-time' && styles.filterTextActive]}>
              All Time
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, filter === 'monthly' && styles.filterButtonActive]}
            onPress={() => setFilter('monthly')}
          >
            <Text style={[styles.filterText, filter === 'monthly' && styles.filterTextActive]}>
              Monthly
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, filter === 'weekly' && styles.filterButtonActive]}
            onPress={() => setFilter('weekly')}
          >
            <Text style={[styles.filterText, filter === 'weekly' && styles.filterTextActive]}>
              Weekly
            </Text>
          </Pressable>
        </View>

        <View style={styles.prizesBanner}>
          <IconSymbol name="gift.fill" size={24} color={colors.accent} />
          <Text style={styles.prizeText}>
            Top 10 monthly winners receive outdoor gear prizes!
          </Text>
        </View>

        <FlatList
          data={mockLeaderboard}
          renderItem={renderEntry}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={[
            styles.listContent,
            Platform.OS !== 'ios' && styles.listContentWithTabBar,
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#ffffff',
  },
  prizesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  prizeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContentWithTabBar: {
    paddingBottom: 100,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  currentUserCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  entryInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
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
