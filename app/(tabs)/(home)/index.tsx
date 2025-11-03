
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

  const handleMapPress = () => {
    router.push('/(tabs)/map');
  };

  const handleMessagesPress = () => {
    router.push('/(tabs)/messages');
  };

  const handleNotificationsPress = () => {
    router.push('/(tabs)/notifications');
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {Platform.OS !== 'ios' && (
        <View style={styles.topBar}>
          <Pressable style={styles.topButton} onPress={handleMapPress}>
            <IconSymbol name="map.fill" color={colors.text} size={24} />
          </Pressable>
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
    <Pressable style={styles.headerButton} onPress={handleMapPress}>
      <IconSymbol name="map.fill" color={colors.primary} size={24} />
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
        
        {/* Floating Action Button for Create Post - Hidden since we have tab bar button now */}
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
    paddingTop: Platform.OS === 'ios' ? 16 : 60,
    marginBottom: 12,
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topButton: {
    padding: 8,
  },
  topRight: {
    flexDirection: 'row',
    gap: 8,
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
  headerButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginRight: 8,
  },
});
