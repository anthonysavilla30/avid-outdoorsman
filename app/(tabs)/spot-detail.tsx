
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
  TextInput,
  Alert,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { mockSpots, mockReviews } from '@/data/mockSpots';
import { Review } from '@/types/Review';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 120,
  },
  imageContainer: {
    height: 300,
    backgroundColor: colors.border,
  },
  spotImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  spotName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  spotType: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'capitalize',
    marginBottom: 12,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amenityText: {
    fontSize: 13,
    color: colors.text,
  },
  difficultyBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  reviewsSection: {
    marginTop: 20,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  addReviewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reviewCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    marginRight: 12,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  reviewContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewPhotos: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  reviewPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  reviewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  reviewTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  reviewTagText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
});

export default function SpotDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const spotId = params.id as string;

  const spot = mockSpots.find((s) => s.id === spotId);
  const reviews = mockReviews.filter((r) => r.spotId === spotId);

  if (!spot) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.content}>
          <Text style={styles.spotName}>Spot not found</Text>
        </View>
      </SafeAreaView>
    );
  }

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

  const renderStars = (rating: number, size: number = 16) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <IconSymbol
          key={i}
          name={i < Math.floor(rating) ? 'star.fill' : 'star'}
          size={size}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  const handleAddReview = () => {
    Alert.alert('Add Review', 'Review functionality coming soon!');
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderReview = (review: Review) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
        <View style={styles.reviewUserInfo}>
          <Text style={styles.reviewUserName}>{review.userName}</Text>
          <Text style={styles.reviewDate}>{formatDate(review.date)}</Text>
        </View>
        <View style={styles.reviewRating}>{renderStars(review.rating, 14)}</View>
      </View>

      <Text style={styles.reviewTitle}>{review.title}</Text>
      <Text style={styles.reviewContent}>{review.content}</Text>

      {review.photos.length > 0 && (
        <View style={styles.reviewPhotos}>
          {review.photos.map((photo, index) => (
            <Image key={index} source={{ uri: photo }} style={styles.reviewPhoto} />
          ))}
        </View>
      )}

      {review.tags.length > 0 && (
        <View style={styles.reviewTags}>
          {review.tags.map((tag, index) => (
            <View key={index} style={styles.reviewTag}>
              <Text style={styles.reviewTagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.reviewFooter}>
        <Pressable style={styles.helpfulButton}>
          <IconSymbol name="hand.thumbsup" size={16} color={colors.textSecondary} />
          <Text style={styles.helpfulText}>Helpful ({review.helpful})</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: spot.photos[0] }} style={styles.spotImage} />
          <Pressable style={styles.backButton} onPress={handleBack}>
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.spotName}>{spot.name}</Text>
            <Text style={styles.spotType}>{spot.type.replace('-', ' ')}</Text>

            <View style={styles.ratingSection}>
              <View style={styles.ratingContainer}>
                {renderStars(spot.averageRating, 20)}
                <Text style={styles.ratingText}>{spot.averageRating.toFixed(1)}</Text>
              </View>
              <Text style={styles.reviewCount}>({spot.totalReviews} reviews)</Text>
            </View>
          </View>

          <Text style={styles.description}>{spot.description}</Text>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Details</Text>
            {spot.difficulty && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Difficulty:</Text>
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
              </View>
            )}
            {spot.bestTimeToVisit && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Best Time:</Text>
                <Text style={styles.infoValue}>{spot.bestTimeToVisit}</Text>
              </View>
            )}
            {spot.accessibility && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Access:</Text>
                <Text style={styles.infoValue}>{spot.accessibility}</Text>
              </View>
            )}
          </View>

          {spot.amenities.length > 0 && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {spot.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
              <Pressable style={styles.addReviewButton} onPress={handleAddReview}>
                <Text style={styles.addReviewButtonText}>Add Review</Text>
              </Pressable>
            </View>
            {reviews.map(renderReview)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
