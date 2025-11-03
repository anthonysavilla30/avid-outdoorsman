
import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import ActivityFilter from '@/components/ActivityFilter';
import PostCard from '@/components/PostCard';
import { mockPosts } from '@/data/mockPosts';
import { ActivityType } from '@/types/Post';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('all');

  const filteredPosts = selectedActivity === 'all' 
    ? mockPosts 
    : mockPosts.filter(post => post.activity === selectedActivity);

  const handleCreatePost = () => {
    router.push('/(tabs)/(home)/create-post');
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Avid Outdoorsman</Text>
        <Text style={styles.subtitle}>Real conditions. Right now.</Text>
      </View>
      <ActivityFilter
        selectedActivity={selectedActivity}
        onSelectActivity={setSelectedActivity}
      />
    </View>
  );

  const renderHeaderRight = () => (
    <Pressable style={styles.headerButton} onPress={handleCreatePost}>
      <IconSymbol name="plus.circle.fill" color={colors.primary} size={28} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable style={styles.headerButton}>
      <IconSymbol name="line.3.horizontal.decrease.circle" color={colors.primary} size={28} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Feed',
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
            headerLargeTitle: false,
          }}
        />
      )}
      <View style={styles.container}>
        <FlatList
          data={filteredPosts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={[
            styles.listContent,
            Platform.OS !== 'ios' && styles.listContentWithTabBar,
          ]}
          showsVerticalScrollIndicator={false}
        />
        
        {/* Floating Action Button for Create Post */}
        {Platform.OS !== 'ios' && (
          <Pressable style={styles.fab} onPress={handleCreatePost}>
            <IconSymbol name="plus" color="#ffffff" size={28} />
          </Pressable>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 16,
  },
  listContentWithTabBar: {
    paddingBottom: 100,
  },
  headerContainer: {
    backgroundColor: colors.card,
    paddingTop: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
  },
  titleContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
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
  headerButton: {
    padding: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 8,
  },
});
