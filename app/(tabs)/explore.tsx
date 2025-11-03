
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
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface User {
  id: string;
  name: string;
  avatar: string;
  distance: number;
  activities: string[];
  followers: number;
  posts: number;
  bio: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jake Morrison',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    distance: 12,
    activities: ['Hunting', 'Fishing'],
    followers: 234,
    posts: 89,
    bio: 'Bow hunter and fly fisherman. Always chasing the next adventure.',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    distance: 8,
    activities: ['Hiking', 'Camping'],
    followers: 567,
    posts: 142,
    bio: 'Backpacking enthusiast. Love exploring remote trails.',
  },
  {
    id: '3',
    name: 'Mike Thompson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    distance: 15,
    activities: ['Fishing', 'Camping'],
    followers: 189,
    posts: 67,
    bio: 'Bass fishing expert. Sharing my favorite spots.',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    distance: 22,
    activities: ['Hiking', 'Hunting'],
    followers: 423,
    posts: 156,
    bio: 'Wildlife photographer and deer hunter.',
  },
  {
    id: '5',
    name: 'Chris Anderson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    distance: 18,
    activities: ['Camping', 'Fishing'],
    followers: 312,
    posts: 98,
    bio: 'Camping gear enthusiast. Always testing new equipment.',
  },
];

export default function ExploreScreen() {
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  const handleFollow = (userId: string) => {
    setFollowedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const renderUser = ({ item }: { item: User }) => {
    const isFollowing = followedUsers.has(item.id);

    return (
      <View style={styles.userCard}>
        <View style={styles.userHeader}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <View style={styles.distanceContainer}>
              <IconSymbol name="location.fill" size={14} color={colors.textSecondary} />
              <Text style={styles.distance}>{item.distance} miles away</Text>
            </View>
          </View>
          <Pressable
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={() => handleFollow(item.id)}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.bio}>{item.bio}</Text>

        <View style={styles.activitiesContainer}>
          {item.activities.map((activity, index) => (
            <View key={index} style={styles.activityBadge}>
              <Text style={styles.activityText}>{activity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Explore',
          headerShown: Platform.OS === 'ios',
        }}
      />
      <View style={styles.container}>
        {Platform.OS !== 'ios' && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Explore</Text>
            <Text style={styles.headerSubtitle}>Discover outdoorsmen near you</Text>
          </View>
        )}
        <FlatList
          data={mockUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
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
  header: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 16,
  },
  listContentWithTabBar: {
    paddingBottom: 100,
  },
  userCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  followingButtonText: {
    color: colors.text,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  activityBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activityText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
});
