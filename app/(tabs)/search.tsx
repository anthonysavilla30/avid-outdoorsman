
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockPosts } from '@/data/mockPosts';

interface SearchResult {
  type: 'user' | 'post' | 'location';
  id: string;
  title: string;
  subtitle: string;
  image?: string;
}

const mockSearchResults: SearchResult[] = [
  {
    type: 'user',
    id: '1',
    title: 'Mike Johnson',
    subtitle: '@mikej_outdoors • 5 mi away',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    type: 'user',
    id: '2',
    title: 'Sarah Martinez',
    subtitle: '@sarahm_hikes • 12 mi away',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    type: 'location',
    id: '3',
    title: 'Silver Creek',
    subtitle: 'Popular fishing spot • 5 mi away',
  },
  {
    type: 'location',
    id: '4',
    title: 'Eagle Peak Trail',
    subtitle: 'Hiking trail • 12 mi away',
  },
  {
    type: 'post',
    id: '5',
    title: 'Caught a 5lb rainbow trout this morning!',
    subtitle: 'Mike Johnson • 2h ago',
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'users' | 'posts' | 'locations'>('all');

  const filteredResults = mockSearchResults.filter((result) => {
    if (activeFilter !== 'all' && result.type !== activeFilter.slice(0, -1)) {
      return false;
    }
    if (searchQuery.trim()) {
      return result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             result.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleResultPress = (result: SearchResult) => {
    console.log('Search result pressed:', result);
    if (result.type === 'user') {
      router.push(`/(tabs)/user-profile?id=${result.id}`);
    } else if (result.type === 'post') {
      router.push(`/(tabs)/(home)/post-detail?id=${result.id}`);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'user':
        return 'person.circle';
      case 'post':
        return 'doc.text';
      case 'location':
        return 'location.circle';
      default:
        return 'magnifyingglass';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Search',
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <View style={styles.container}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users, posts, locations..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {(['all', 'users', 'posts', 'locations'] as const).map((filter) => (
            <Pressable
              key={filter}
              style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Results */}
        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <Pressable
                key={result.id}
                style={styles.resultCard}
                onPress={() => handleResultPress(result)}
              >
                {result.image ? (
                  <Image source={{ uri: result.image }} style={styles.resultImage} />
                ) : (
                  <View style={styles.resultIconContainer}>
                    <IconSymbol
                      name={getResultIcon(result.type) as any}
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                )}
                <View style={styles.resultContent}>
                  <Text style={styles.resultTitle}>{result.title}</Text>
                  <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="magnifyingglass" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>
                {searchQuery.trim() ? 'No results found' : 'Start typing to search'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Popular Searches */}
        {!searchQuery.trim() && (
          <View style={styles.popularSection}>
            <Text style={styles.popularTitle}>Popular Searches</Text>
            <View style={styles.popularTags}>
              {['trout', 'hiking trails', 'camping spots', 'deer hunting', 'bass fishing'].map(
                (tag, index) => (
                  <Pressable
                    key={index}
                    style={styles.popularTag}
                    onPress={() => setSearchQuery(tag)}
                  >
                    <Text style={styles.popularTagText}>#{tag}</Text>
                  </Pressable>
                )
              )}
            </View>
          </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
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
    color: colors.text,
  },
  filterTextActive: {
    color: '#ffffff',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  resultImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  resultIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  popularSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularTag: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  popularTagText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
});
