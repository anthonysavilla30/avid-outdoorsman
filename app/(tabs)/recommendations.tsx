
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Recommendation, UserPreferences } from '@/types/Recommendation';
import { RecommendationEngine } from '@/utils/recommendationEngine';
import { mockPosts } from '@/data/mockPosts';
import { mockSpots } from '@/data/mockSpots';
import PostCard from '@/components/PostCard';

export default function RecommendationsScreen() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'personalized' | 'trending' | 'nearby'>('all');

  useEffect(() => {
    // Mock user preferences - in production, this would come from user profile
    const userPreferences: UserPreferences = {
      favoriteActivities: ['fishing', 'hiking', 'camping'],
      preferredDifficulty: ['moderate', 'hard'],
      preferredWeather: ['Clear', 'Partly Cloudy'],
      activityHistory: ['trout', 'fly-fishing', 'trail', 'summit'],
      savedPosts: ['1', '2'],
      savedSpots: ['1'],
      frequentLocations: ['Silver Creek', 'Eagle Peak Trail'],
    };

    const engine = new RecommendationEngine(userPreferences);
    const recs = engine.generateRecommendations(mockPosts, mockSpots);
    setRecommendations(recs);
  }, []);

  const filteredRecommendations = selectedCategory === 'all'
    ? recommendations
    : recommendations.filter(rec => rec.category === selectedCategory);

  const handleMapPress = () => {
    router.push('/(tabs)/map');
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
    <Pressable style={styles.headerButton} onPress={handleMapPress}>
      <IconSymbol name="map.fill" color={colors.primary} size={24} />
    </Pressable>
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personalized':
        return 'person.fill';
      case 'trending':
        return 'chart.line.uptrend.xyaxis';
      case 'nearby':
        return 'location.fill';
      case 'similar':
        return 'star.fill';
      default:
        return 'sparkles';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personalized':
        return colors.primary;
      case 'trending':
        return colors.accent;
      case 'nearby':
        return colors.highlight;
      case 'similar':
        return colors.secondary;
      default:
        return colors.text;
    }
  };

  const renderRecommendation = (rec: Recommendation) => {
    if (rec.type === 'post') {
      return (
        <View key={rec.id} style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <View style={styles.categoryBadge}>
              <IconSymbol
                name={getCategoryIcon(rec.category)}
                color={getCategoryColor(rec.category)}
                size={16}
              />
              <Text style={[styles.categoryText, { color: getCategoryColor(rec.category) }]}>
                {rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}
              </Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{rec.score}%</Text>
            </View>
          </View>
          <Text style={styles.reasonText}>{rec.reason}</Text>
          <PostCard post={rec.item} />
        </View>
      );
    }

    if (rec.type === 'spot') {
      const spot = rec.item;
      return (
        <Pressable
          key={rec.id}
          style={styles.recommendationCard}
          onPress={() => router.push(`/(tabs)/spot-detail?id=${spot.id}`)}
        >
          <View style={styles.recommendationHeader}>
            <View style={styles.categoryBadge}>
              <IconSymbol
                name={getCategoryIcon(rec.category)}
                color={getCategoryColor(rec.category)}
                size={16}
              />
              <Text style={[styles.categoryText, { color: getCategoryColor(rec.category) }]}>
                {rec.category.charAt(0).toUpperCase() + rec.category.slice(1)}
              </Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{rec.score}%</Text>
            </View>
          </View>
          <Text style={styles.reasonText}>{rec.reason}</Text>
          
          <View style={styles.spotCard}>
            {spot.images && spot.images.length > 0 && (
              <Image source={{ uri: spot.images[0] }} style={styles.spotImage} />
            )}
            <View style={styles.spotInfo}>
              <Text style={styles.spotName}>{spot.name}</Text>
              <Text style={styles.spotLocation}>{spot.location}</Text>
              <View style={styles.spotMeta}>
                <View style={styles.ratingContainer}>
                  <IconSymbol name="star.fill" color={colors.accent} size={16} />
                  <Text style={styles.ratingText}>{spot.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.reviewCount}>({spot.reviewCount} reviews)</Text>
              </View>
            </View>
          </View>
        </Pressable>
      );
    }

    return null;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Recommendations',
          headerRight: Platform.OS === 'ios' ? renderHeaderRight : undefined,
          headerLeft: Platform.OS === 'ios' ? renderHeaderLeft : undefined,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            Platform.OS !== 'ios' && styles.contentWithTabBar,
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Recommended For You</Text>
            <Text style={styles.subtitle}>
              Based on your activity and preferences
            </Text>
          </View>

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {['all', 'personalized', 'trending', 'nearby'].map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category as any)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Recommendations */}
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map(renderRecommendation)
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="sparkles" color={colors.textSecondary} size={48} />
              <Text style={styles.emptyText}>No recommendations yet</Text>
              <Text style={styles.emptySubtext}>
                Keep using the app to get personalized recommendations
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
  },
  contentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    padding: 16,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  recommendationCard: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.highlight,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  reasonText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  spotCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  spotImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
  },
  spotInfo: {
    padding: 16,
  },
  spotName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  spotLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  spotMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
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
