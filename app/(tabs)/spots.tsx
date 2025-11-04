
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
  Image,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Stack, useRouter } from 'expo-router';
import { mockSpots } from '@/data/mockSpots';
import { Spot, SpotType } from '@/types/Review';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 120,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterScrollContainer: {
    marginBottom: 12,
  },
  filterScrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  spotCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  spotImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
  },
  spotContent: {
    padding: 16,
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  spotType: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  spotDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  spotStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  difficultyBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  amenityTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  amenityText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  viewButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
});

export default function SpotsScreen() {
  const [selectedType, setSelectedType] = useState<SpotType | 'all'>('all');
  const router = useRouter();

  const spotTypes: Array<{ value: SpotType | 'all'; label: string }> = [
    { value: 'all', label: 'All Spots' },
    { value: 'trail', label: 'Trails' },
    { value: 'fishing-hole', label: 'Fishing' },
    { value: 'campsite', label: 'Camping' },
    { value: 'hunting-area', label: 'Hunting' },
  ];

  const filteredSpots = mockSpots.filter((spot) => {
    return selectedType === 'all' || spot.type === selectedType;
  });

  const handleMapPress = () => {
    router.push('/(tabs)/map');
  };

  const handleTrackMilesPress = () => {
    console.log('Track miles pressed');
  };

  const handleMessagesPress = () => {
    router.push('/(tabs)/messages');
  };

  const handleNotificationsPress = () => {
    router.push('/(tabs)/notifications');
  };

  const renderHeaderRight = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Pressable onPress={handleTrackMilesPress}>
        <IconSymbol name="figure.walk" size={24} color={colors.text} />
      </Pressable>
      <Pressable onPress={handleMapPress}>
        <IconSymbol name="map" size={24} color={colors.text} />
      </Pressable>
      <Pressable onPress={handleMessagesPress}>
        <IconSymbol name="message" size={24} color={colors.text} />
      </Pressable>
      <Pressable onPress={handleNotificationsPress}>
        <IconSymbol name="bell" size={24} color={colors.text} />
      </Pressable>
    </View>
  );

  const renderHeaderLeft = () => (
    <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
      Spots & Reviews
    </Text>
  );

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'moderate':
        return '#FFA500';
      case 'hard':
        return '#FF5722';
      case 'expert':
        return '#D32F2F';
      default:
        return colors.textSecondary;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <IconSymbol
          key={i}
          name={i < Math.floor(rating) ? 'star.fill' : 'star'}
          size={14}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  const handleViewSpot = (spotId: string) => {
    router.push(`/(tabs)/spot-detail?id=${spotId}`);
  };

  const renderSpot = (spot: Spot) => (
    <View key={spot.id} style={styles.spotCard}>
      <Image source={{ uri: spot.photos[0] }} style={styles.spotImage} />
      <View style={styles.spotContent}>
        <View style={styles.spotHeader}>
          <Text style={styles.spotName}>{spot.name}</Text>
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={14} color="#FFFFFF" />
            <Text style={styles.ratingText}>{spot.averageRating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.spotType}>{spot.type.replace('-', ' ')}</Text>

        <Text style={styles.spotDescription} numberOfLines={3}>
          {spot.description}
        </Text>

        <View style={styles.spotStats}>
          <View style={styles.statItem}>
            <IconSymbol name="text.bubble" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{spot.totalReviews} reviews</Text>
          </View>
          {spot.difficulty && (
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(spot.difficulty) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(spot.difficulty) },
                ]}
              >
                {spot.difficulty}
              </Text>
            </View>
          )}
          {spot.bestTimeToVisit && (
            <View style={styles.statItem}>
              <IconSymbol name="calendar" size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{spot.bestTimeToVisit}</Text>
            </View>
          )}
        </View>

        {spot.amenities.length > 0 && (
          <View style={styles.amenitiesContainer}>
            {spot.amenities.slice(0, 3).map((amenity, index) => (
              <View key={index} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        )}

        <Pressable style={styles.viewButton} onPress={() => handleViewSpot(spot.id)}>
          <Text style={styles.viewButtonText}>View Details & Reviews</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: renderHeaderLeft,
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Discover Spots</Text>
          <Text style={styles.subtitle}>
            Reviews and ratings from real outdoorsmen
          </Text>
        </View>

        <View style={styles.filterSection}>
          <View style={styles.filterScrollContainer}>
            <View style={styles.filterScrollContent}>
              {spotTypes.map((type) => (
                <Pressable
                  key={type.value}
                  style={[
                    styles.filterButton,
                    selectedType === type.value && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedType(type.value)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedType === type.value && styles.filterButtonTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {filteredSpots.length > 0 ? (
          filteredSpots.map(renderSpot)
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="map" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No spots found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
