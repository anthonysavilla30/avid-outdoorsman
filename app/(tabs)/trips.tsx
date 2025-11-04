
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { mockTrips } from '@/data/mockTrips';
import { Trip } from '@/types/Trip';

type TripFilter = 'all' | 'upcoming' | 'my-trips';

export default function TripsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<TripFilter>('all');

  const filteredTrips = mockTrips.filter((trip) => {
    if (filter === 'upcoming') return trip.status === 'upcoming';
    if (filter === 'my-trips') {
      // Mock: show trips where user is organizer or participant
      return trip.participants.some(p => p.id === 'user1');
    }
    return true;
  });

  const handleCreateTrip = () => {
    console.log('Create trip');
    router.push('/(tabs)/trips/create-trip' as any);
  };

  const handleTripPress = (tripId: string) => {
    console.log('View trip:', tripId);
    router.push(`/(tabs)/trips/trip-detail?id=${tripId}` as any);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return colors.success;
      case 'moderate':
        return colors.accent;
      case 'hard':
        return colors.secondary;
      case 'expert':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      hunting: 'scope',
      fishing: 'fish.fill',
      hiking: 'figure.walk',
      camping: 'tent.fill',
      kayaking: 'water.waves',
      'mountain-biking': 'bicycle',
      overlanding: 'car.fill',
      backpacking: 'backpack.fill',
      'rock-climbing': 'mountain.2.fill',
      'trail-running': 'figure.run',
    };
    return icons[type] || 'map.fill';
  };

  const renderTrip = (trip: Trip) => (
    <Pressable
      key={trip.id}
      style={styles.tripCard}
      onPress={() => handleTripPress(trip.id)}
    >
      {trip.images.length > 0 && (
        <Image source={{ uri: trip.images[0] }} style={styles.tripImage} />
      )}
      
      <View style={styles.tripContent}>
        <View style={styles.tripHeader}>
          <View style={styles.tripTypeContainer}>
            <IconSymbol
              name={getActivityIcon(trip.type) as any}
              size={16}
              color={colors.primary}
            />
            <Text style={styles.tripType}>{trip.type.replace('-', ' ')}</Text>
          </View>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(trip.difficulty) + '20' },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                { color: getDifficultyColor(trip.difficulty) },
              ]}
            >
              {trip.difficulty}
            </Text>
          </View>
        </View>

        <Text style={styles.tripTitle}>{trip.title}</Text>
        <Text style={styles.tripDescription} numberOfLines={2}>
          {trip.description}
        </Text>

        <View style={styles.tripMeta}>
          <View style={styles.metaItem}>
            <IconSymbol name="calendar" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {formatDate(trip.startDate)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <IconSymbol name="clock.fill" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {formatTime(trip.startDate)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <IconSymbol name="location.fill" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {trip.location.name}
            </Text>
          </View>
        </View>

        <View style={styles.tripFooter}>
          <View style={styles.organizerInfo}>
            <Image
              source={{ uri: trip.organizer.avatar }}
              style={styles.organizerAvatar}
            />
            <Text style={styles.organizerName}>{trip.organizer.name}</Text>
          </View>

          <View style={styles.participantsInfo}>
            <View style={styles.avatarStack}>
              {trip.participants.slice(0, 3).map((participant, index) => (
                <Image
                  key={participant.id}
                  source={{ uri: participant.avatar }}
                  style={[styles.participantAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
                />
              ))}
            </View>
            <Text style={styles.participantCount}>
              {trip.participants.length}
              {trip.maxParticipants && `/${trip.maxParticipants}`}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderHeaderRight = () => (
    <Pressable style={styles.headerButton} onPress={handleCreateTrip}>
      <IconSymbol name="plus" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Trips & Events',
          headerRight: Platform.OS === 'ios' ? renderHeaderRight : undefined,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {Platform.OS !== 'ios' && (
            <View style={styles.header}>
              <Text style={styles.title}>Trips & Events</Text>
              <Pressable style={styles.createButton} onPress={handleCreateTrip}>
                <IconSymbol name="plus" color="#ffffff" size={20} />
                <Text style={styles.createButtonText}>Create Trip</Text>
              </Pressable>
            </View>
          )}

          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            <Pressable
              style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
              onPress={() => setFilter('all')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === 'all' && styles.filterTabTextActive,
                ]}
              >
                All Trips
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterTab, filter === 'upcoming' && styles.filterTabActive]}
              onPress={() => setFilter('upcoming')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === 'upcoming' && styles.filterTabTextActive,
                ]}
              >
                Upcoming
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterTab, filter === 'my-trips' && styles.filterTabActive]}
              onPress={() => setFilter('my-trips')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === 'my-trips' && styles.filterTabTextActive,
                ]}
              >
                My Trips
              </Text>
            </Pressable>
          </View>

          {/* Trips List */}
          <View style={styles.tripsList}>
            {filteredTrips.length > 0 ? (
              filteredTrips.map(renderTrip)
            ) : (
              <View style={styles.emptyState}>
                <IconSymbol name="calendar.badge.exclamationmark" size={64} color={colors.textSecondary} />
                <Text style={styles.emptyStateTitle}>No trips found</Text>
                <Text style={styles.emptyStateText}>
                  Create a trip or change your filter
                </Text>
              </View>
            )}
          </View>
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
  scrollContent: {
    paddingBottom: 16,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  tripsList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  tripCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  tripImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.border,
  },
  tripContent: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripType: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  tripDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  tripMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  organizerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
  },
  organizerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  participantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  participantAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    borderWidth: 2,
    borderColor: colors.card,
  },
  participantCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  headerButton: {
    padding: 4,
  },
});
