
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
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';

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
    name: 'Alex Rivers',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    distance: 3.2,
    activities: ['Fishing', 'Hiking'],
    followers: 234,
    posts: 45,
    bio: 'Fly fishing enthusiast and trail explorer',
  },
  {
    id: '2',
    name: 'Maria Santos',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    distance: 5.8,
    activities: ['Hunting', 'Camping'],
    followers: 567,
    posts: 89,
    bio: 'Bow hunter and wilderness camper',
  },
  {
    id: '3',
    name: 'Tom Bradley',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    distance: 8.1,
    activities: ['Hiking', 'Photography'],
    followers: 892,
    posts: 156,
    bio: 'Capturing nature one trail at a time',
  },
];

export default function ExploreScreen() {
  const router = useRouter();
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

  const renderUser = ({ item }: { item: User }) => {
    const isFollowing = followedUsers.has(item.id);

    return (
      <View style={styles.userCard}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.distance}>{item.distance} mi away</Text>
          </View>
          <Text style={styles.bio} numberOfLines={2}>
            {item.bio}
          </Text>
          <View style={styles.activities}>
            {item.activities.map((activity, index) => (
              <View key={index} style={styles.activityBadge}>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{item.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{item.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
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
    );
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Explore',
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
          <Text style={styles.title}>Discover Outdoorsmen</Text>
          <Text style={styles.subtitle}>Connect with people near you</Text>
        </View>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
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
  header: {
    backgroundColor: colors.card,
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 12,
    marginBottom: 12,
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
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
    marginBottom: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    alignSelf: 'center',
  },
  userInfo: {
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  distance: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  activities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  activityBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  followingButtonText: {
    color: colors.primary,
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
