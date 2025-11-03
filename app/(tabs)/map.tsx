
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from 'react-native';
import { mockLandmarks } from '@/data/mockLandmarks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import LandmarkModal from '@/components/LandmarkModal';
import { IconSymbol } from '@/components/IconSymbol';
import { Landmark } from '@/types/Landmark';
import MapFeatureCard from '@/components/MapFeatureCard';
import {
  mockSkiResorts,
  mockNationalForests,
  mockStateForests,
  mockCampgrounds,
  mockWildlifeManagementAreas,
} from '@/data/mockMapFeatures';

type FilterType = 'all' | 'ski-resorts' | 'forests' | 'campgrounds' | 'wildlife' | 'landmarks';

export default function MapScreen() {
  const router = useRouter();
  const [landmarks, setLandmarks] = useState<Landmark[]>(mockLandmarks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const handleAddLandmark = () => {
    setIsModalVisible(true);
  };

  const handleSaveLandmark = (landmarkData: {
    title: string;
    description: string;
    visibility: any;
    category: string;
  }) => {
    const newLandmark: Landmark = {
      id: Date.now().toString(),
      ...landmarkData,
      latitude: 39.7392 + (Math.random() - 0.5) * 0.1,
      longitude: -104.9903 + (Math.random() - 0.5) * 0.1,
      createdBy: {
        id: 'current-user',
        name: 'Current User',
      },
      createdAt: new Date(),
    };

    setLandmarks([...landmarks, newLandmark]);
    setIsModalVisible(false);
    Alert.alert('Success', 'Landmark added successfully!');
  };

  const getLandmarkIcon = (category: string) => {
    switch (category) {
      case 'fishing-spot':
        return 'fish.fill';
      case 'hunting-area':
        return 'scope';
      case 'camping':
        return 'tent.fill';
      case 'trail':
        return 'figure.hiking';
      case 'viewpoint':
        return 'eye.fill';
      default:
        return 'mappin.circle.fill';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return 'globe';
      case 'followers':
        return 'person.2.fill';
      case 'only-me':
        return 'lock.fill';
      default:
        return 'lock.fill';
    }
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

  const filters: { type: FilterType; label: string; icon: string; count: number }[] = [
    { type: 'all', label: 'All', icon: 'map.fill', count: mockSkiResorts.length + mockNationalForests.length + mockStateForests.length + mockCampgrounds.length + mockWildlifeManagementAreas.length + landmarks.length },
    { type: 'ski-resorts', label: 'Ski Resorts', icon: 'snowflake', count: mockSkiResorts.length },
    { type: 'forests', label: 'Forests', icon: 'tree.fill', count: mockNationalForests.length + mockStateForests.length },
    { type: 'campgrounds', label: 'Campgrounds', icon: 'tent.fill', count: mockCampgrounds.length },
    { type: 'wildlife', label: 'Wildlife Areas', icon: 'pawprint.fill', count: mockWildlifeManagementAreas.length },
    { type: 'landmarks', label: 'My Landmarks', icon: 'mappin.circle.fill', count: landmarks.length },
  ];

  const shouldShowSkiResorts = activeFilter === 'all' || activeFilter === 'ski-resorts';
  const shouldShowForests = activeFilter === 'all' || activeFilter === 'forests';
  const shouldShowCampgrounds = activeFilter === 'all' || activeFilter === 'campgrounds';
  const shouldShowWildlife = activeFilter === 'all' || activeFilter === 'wildlife';
  const shouldShowLandmarks = activeFilter === 'all' || activeFilter === 'landmarks';

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Map',
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
            headerLargeTitle: false,
          }}
        />
      )}
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            Platform.OS !== 'ios' && styles.contentWithTabBar,
          ]}
        >
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

          <View style={styles.header}>
            <Text style={styles.title}>Outdoor Recreation Map</Text>
            <Text style={styles.subtitle}>
              Note: react-native-maps is not currently supported in Natively. 
              This is a comprehensive list of outdoor recreation areas.
            </Text>
          </View>

          <View style={styles.mapPlaceholder}>
            <IconSymbol name="map.fill" size={64} color={colors.textSecondary} />
            <Text style={styles.placeholderText}>Interactive Map View</Text>
            <Text style={styles.placeholderSubtext}>
              Ski resorts, forests, campgrounds, wildlife areas, and custom landmarks
            </Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {filters.map((filter) => (
              <Pressable
                key={filter.type}
                style={[
                  styles.filterButton,
                  activeFilter === filter.type && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter(filter.type)}
              >
                <IconSymbol
                  name={filter.icon as any}
                  size={18}
                  color={activeFilter === filter.type ? '#ffffff' : colors.text}
                />
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === filter.type && styles.filterButtonTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
                <View
                  style={[
                    styles.filterBadge,
                    activeFilter === filter.type && styles.filterBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterBadgeText,
                      activeFilter === filter.type && styles.filterBadgeTextActive,
                    ]}
                  >
                    {filter.count}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable style={styles.addButton} onPress={handleAddLandmark}>
            <IconSymbol name="plus.circle.fill" size={24} color="#ffffff" />
            <Text style={styles.addButtonText}>Add Personal Landmark</Text>
          </Pressable>

          {shouldShowSkiResorts && mockSkiResorts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="snowflake" size={24} color="#4A90E2" />
                <Text style={styles.sectionTitle}>Ski Resorts ({mockSkiResorts.length})</Text>
              </View>
              {mockSkiResorts.map((resort) => (
                <MapFeatureCard
                  key={resort.id}
                  type="ski-resort"
                  data={resort}
                />
              ))}
            </View>
          )}

          {shouldShowForests && (mockNationalForests.length > 0 || mockStateForests.length > 0) && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="tree.fill" size={24} color="#2ECC71" />
                <Text style={styles.sectionTitle}>
                  National & State Forests ({mockNationalForests.length + mockStateForests.length})
                </Text>
              </View>
              {mockNationalForests.map((forest) => (
                <MapFeatureCard
                  key={forest.id}
                  type="forest"
                  data={forest}
                />
              ))}
              {mockStateForests.map((forest) => (
                <MapFeatureCard
                  key={forest.id}
                  type="forest"
                  data={forest}
                />
              ))}
            </View>
          )}

          {shouldShowCampgrounds && mockCampgrounds.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="tent.fill" size={24} color="#E67E22" />
                <Text style={styles.sectionTitle}>Campgrounds ({mockCampgrounds.length})</Text>
              </View>
              {mockCampgrounds.map((campground) => (
                <MapFeatureCard
                  key={campground.id}
                  type="campground"
                  data={campground}
                />
              ))}
            </View>
          )}

          {shouldShowWildlife && mockWildlifeManagementAreas.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="pawprint.fill" size={24} color="#9B59B6" />
                <Text style={styles.sectionTitle}>
                  Wildlife Management Areas ({mockWildlifeManagementAreas.length})
                </Text>
              </View>
              {mockWildlifeManagementAreas.map((wma) => (
                <MapFeatureCard
                  key={wma.id}
                  type="wildlife-management-area"
                  data={wma}
                />
              ))}
            </View>
          )}

          {shouldShowLandmarks && landmarks.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="mappin.circle.fill" size={24} color={colors.primary} />
                <Text style={styles.sectionTitle}>Your Landmarks ({landmarks.length})</Text>
              </View>
              {landmarks.map((landmark) => (
                <View key={landmark.id} style={styles.landmarkCard}>
                  <View style={styles.landmarkHeader}>
                    <IconSymbol
                      name={getLandmarkIcon(landmark.category || 'other') as any}
                      size={24}
                      color={colors.primary}
                    />
                    <View style={styles.landmarkInfo}>
                      <Text style={styles.landmarkTitle}>{landmark.title}</Text>
                      <Text style={styles.landmarkDescription}>{landmark.description}</Text>
                    </View>
                    <IconSymbol
                      name={getVisibilityIcon(landmark.visibility) as any}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </View>
                  <View style={styles.landmarkFooter}>
                    <Text style={styles.landmarkCategory}>
                      {landmark.category?.replace('-', ' ') || 'other'}
                    </Text>
                    <Text style={styles.landmarkCoords}>
                      {landmark.latitude.toFixed(4)}, {landmark.longitude.toFixed(4)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.legendSection}>
            <Text style={styles.legendTitle}>Map Legend</Text>
            <View style={styles.legendGrid}>
              <LegendItem icon="snowflake" label="Ski Resorts" color="#4A90E2" />
              <LegendItem icon="tree.fill" label="Forests" color="#2ECC71" />
              <LegendItem icon="tent.fill" label="Campgrounds" color="#E67E22" />
              <LegendItem icon="pawprint.fill" label="Wildlife Areas" color="#9B59B6" />
              <LegendItem icon="mappin.circle.fill" label="Your Landmarks" color={colors.primary} />
            </View>
          </View>
        </ScrollView>

        <LandmarkModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleSaveLandmark}
          latitude={39.7392}
          longitude={-104.9903}
        />
      </View>
    </>
  );
}

function LegendItem({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendIcon, { backgroundColor: color + '20' }]}>
        <IconSymbol name={icon as any} size={16} color={color} />
      </View>
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 16,
  },
  contentWithTabBar: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  topButton: {
    padding: 8,
  },
  topRight: {
    flexDirection: 'row',
    gap: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  mapPlaceholder: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 200,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  filterContainer: {
    marginBottom: 16,
    maxHeight: 50,
  },
  filterContent: {
    gap: 8,
    paddingRight: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  filterBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  filterBadgeTextActive: {
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  landmarkCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  landmarkHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  landmarkInfo: {
    flex: 1,
  },
  landmarkTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  landmarkDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  landmarkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  landmarkCategory: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  landmarkCoords: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  legendSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '45%',
  },
  legendIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendLabel: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
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
