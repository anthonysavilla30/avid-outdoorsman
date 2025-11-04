
import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import ActivityFilter from '@/components/ActivityFilter';
import PostCard from '@/components/PostCard';
import { mockPosts } from '@/data/mockPosts';
import { ActivityType } from '@/types/Post';

type RadiusFilter = 'all' | '5-10' | '10-20' | '20-50' | '50-100';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('all');
  const [selectedRadius, setSelectedRadius] = useState<RadiusFilter>('all');
  const [showRadiusFilter, setShowRadiusFilter] = useState(false);

  const filteredPosts = mockPosts.filter(post => {
    // Filter by activity
    if (selectedActivity !== 'all' && post.activity !== selectedActivity) {
      return false;
    }
    
    // Filter by radius (mock implementation - in real app would use actual location)
    if (selectedRadius !== 'all') {
      // Mock distance calculation - in real app would use user's location
      const mockDistance = Math.random() * 100;
      
      switch (selectedRadius) {
        case '5-10':
          return mockDistance >= 5 && mockDistance <= 10;
        case '10-20':
          return mockDistance >= 10 && mockDistance <= 20;
        case '20-50':
          return mockDistance >= 20 && mockDistance <= 50;
        case '50-100':
          return mockDistance >= 50 && mockDistance <= 100;
      }
    }
    
    return true;
  });

  const handleCreatePost = () => {
    router.push('/(tabs)/(home)/create-post');
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

  const handleSearchPress = () => {
    router.push('/(tabs)/search');
  };

  const radiusOptions: { value: RadiusFilter; label: string }[] = [
    { value: 'all', label: 'All Posts' },
    { value: '5-10', label: '5-10 miles' },
    { value: '10-20', label: '10-20 miles' },
    { value: '20-50', label: '20-50 miles' },
    { value: '50-100', label: '50-100 miles' },
  ];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
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
            <Pressable style={styles.topButton} onPress={handleSearchPress}>
              <IconSymbol name="magnifyingglass" color={colors.text} size={24} />
            </Pressable>
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
      
      {/* Radius Filter */}
      <View style={styles.radiusFilterContainer}>
        <Pressable 
          style={styles.radiusFilterButton}
          onPress={() => setShowRadiusFilter(!showRadiusFilter)}
        >
          <IconSymbol name="location.fill" color={colors.primary} size={20} />
          <Text style={styles.radiusFilterButtonText}>
            {radiusOptions.find(opt => opt.value === selectedRadius)?.label || 'All Posts'}
          </Text>
          <IconSymbol 
            name={showRadiusFilter ? "chevron.up" : "chevron.down"} 
            color={colors.text} 
            size={16} 
          />
        </Pressable>
        
        {showRadiusFilter && (
          <View style={styles.radiusDropdown}>
            {radiusOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.radiusOption,
                  selectedRadius === option.value && styles.radiusOptionActive,
                ]}
                onPress={() => {
                  setSelectedRadius(option.value);
                  setShowRadiusFilter(false);
                }}
              >
                <Text
                  style={[
                    styles.radiusOptionText,
                    selectedRadius === option.value && styles.radiusOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {selectedRadius === option.value && (
                  <IconSymbol name="checkmark" color={colors.primary} size={20} />
                )}
              </Pressable>
            ))}
          </View>
        )}
      </View>
      
      <ActivityFilter
        selectedActivity={selectedActivity}
        onSelectActivity={setSelectedActivity}
      />
    </View>
  );

  const renderHeaderRight = () => (
    <View style={styles.headerButtonGroup}>
      <Pressable style={styles.headerButton} onPress={handleSearchPress}>
        <IconSymbol name="magnifyingglass" color={colors.primary} size={24} />
      </Pressable>
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
        
        {/* Floating Action Button */}
        <Pressable 
          style={styles.fab}
          onPress={handleCreatePost}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
        >
          <IconSymbol name="plus" color="#ffffff" size={28} />
        </Pressable>
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
  titleContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
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
  radiusFilterContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  radiusFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  radiusFilterButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  radiusDropdown: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  radiusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  radiusOptionActive: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  radiusOptionText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  radiusOptionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  headerButton: {
    padding: 4,
  },
  headerButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 8,
    zIndex: 1000,
  },
});
