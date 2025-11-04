
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import PostCard from '@/components/PostCard';
import { mockPosts } from '@/data/mockPosts';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  distance: number;
  stats: {
    posts: number;
    followers: number;
    following: number;
    points: number;
  };
  activities: string[];
  badges: number;
}

const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Mike Johnson',
  username: '@mikej_outdoors',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  bio: 'Avid angler and trail runner. Always chasing the next adventure. 🎣🏃‍♂️',
  location: 'Colorado',
  distance: 5,
  stats: {
    posts: 127,
    followers: 342,
    following: 189,
    points: 2450,
  },
  activities: ['fishing', 'hiking', 'camping'],
  badges: 12,
};

export default function UserProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.id as string;

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  const userPosts = mockPosts.filter((post) => post.author.name === mockUserProfile.name);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    console.log('Follow toggled:', !isFollowing);
  };

  const handleMessage = () => {
    console.log('Message user');
    router.push('/(tabs)/messages/compose');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: mockUserProfile.name,
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image source={{ uri: mockUserProfile.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{mockUserProfile.name}</Text>
          <Text style={styles.username}>{mockUserProfile.username}</Text>
          <View style={styles.locationRow}>
            <IconSymbol name="location.fill" size={14} color={colors.textSecondary} />
            <Text style={styles.locationText}>
              {mockUserProfile.location} • {mockUserProfile.distance} mi away
            </Text>
          </View>
          <Text style={styles.bio}>{mockUserProfile.bio}</Text>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockUserProfile.stats.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockUserProfile.stats.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockUserProfile.stats.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockUserProfile.stats.points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.actionButton, isFollowing && styles.actionButtonFollowing]}
              onPress={handleFollow}
            >
              <IconSymbol
                name={isFollowing ? 'checkmark' : 'person.badge.plus'}
                size={18}
                color="#ffffff"
              />
              <Text style={styles.actionButtonText}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
            <Pressable style={styles.actionButtonSecondary} onPress={handleMessage}>
              <IconSymbol name="message" size={18} color={colors.primary} />
              <Text style={styles.actionButtonTextSecondary}>Message</Text>
            </Pressable>
          </View>

          {/* Activities */}
          <View style={styles.activities}>
            {mockUserProfile.activities.map((activity, index) => (
              <View key={index} style={styles.activityBadge}>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
              Posts
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'about' && styles.tabActive]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
              About
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        {activeTab === 'posts' ? (
          <View style={styles.postsContainer}>
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {userPosts.length === 0 && (
              <Text style={styles.emptyText}>No posts yet</Text>
            )}
          </View>
        ) : (
          <View style={styles.aboutContainer}>
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>Badges</Text>
              <View style={styles.badgesRow}>
                <IconSymbol name="trophy.fill" size={24} color={colors.accent} />
                <Text style={styles.aboutText}>{mockUserProfile.badges} badges earned</Text>
              </View>
            </View>
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>Member Since</Text>
              <Text style={styles.aboutText}>January 2024</Text>
            </View>
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>Favorite Activities</Text>
              <Text style={styles.aboutText}>
                {mockUserProfile.activities.join(', ')}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.card,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.primary,
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
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bio: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
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
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonFollowing: {
    backgroundColor: colors.highlight,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonTextSecondary: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  activities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  activityBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  postsContainer: {
    padding: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  aboutContainer: {
    padding: 20,
  },
  aboutSection: {
    marginBottom: 24,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
