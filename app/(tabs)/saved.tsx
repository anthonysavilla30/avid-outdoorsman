
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import PostCard from '@/components/PostCard';
import { mockPosts } from '@/data/mockPosts';

export default function SavedScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'landmarks' | 'spots'>('posts');

  // Mock saved items - in a real app, these would be fetched from a backend
  const savedPosts = mockPosts.slice(0, 3);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Saved',
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
            onPress={() => setActiveTab('posts')}
          >
            <IconSymbol
              name="bookmark.fill"
              size={20}
              color={activeTab === 'posts' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
              Posts
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'landmarks' && styles.tabActive]}
            onPress={() => setActiveTab('landmarks')}
          >
            <IconSymbol
              name="mappin.circle.fill"
              size={20}
              color={activeTab === 'landmarks' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'landmarks' && styles.tabTextActive]}>
              Landmarks
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'spots' && styles.tabActive]}
            onPress={() => setActiveTab('spots')}
          >
            <IconSymbol
              name="star.fill"
              size={20}
              color={activeTab === 'spots' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === 'spots' && styles.tabTextActive]}>
              Spots
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'posts' && (
            <View style={styles.postsContainer}>
              {savedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {savedPosts.length === 0 && (
                <View style={styles.emptyState}>
                  <IconSymbol name="bookmark" size={48} color={colors.textSecondary} />
                  <Text style={styles.emptyText}>No saved posts yet</Text>
                  <Text style={styles.emptySubtext}>
                    Tap the bookmark icon on posts to save them here
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'landmarks' && (
            <View style={styles.emptyState}>
              <IconSymbol name="mappin.circle" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No saved landmarks yet</Text>
              <Text style={styles.emptySubtext}>
                Save landmarks from the map to access them quickly
              </Text>
            </View>
          )}

          {activeTab === 'spots' && (
            <View style={styles.emptyState}>
              <IconSymbol name="star" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No saved spots yet</Text>
              <Text style={styles.emptySubtext}>
                Save your favorite spots to keep track of them
              </Text>
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  postsContainer: {
    padding: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
