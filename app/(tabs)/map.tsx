
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform, ScrollView, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { IconSymbol } from '@/components/IconSymbol';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { 
  mockSkiResorts, 
  mockNationalForests, 
  mockStateForests, 
  mockCampgrounds, 
  mockWildlifeManagementAreas 
} from '@/data/mockMapFeatures';
import { SkiResort, Forest, Campground, WildlifeManagementArea } from '@/types/MapFeature';

interface MapMarker {
  id: string;
  title: string;
  type: 'ski-resort' | 'forest' | 'campground' | 'wildlife-area';
  coordinate: { latitude: number; longitude: number };
  description: string;
  data: SkiResort | Forest | Campground | WildlifeManagementArea;
}

type FilterType = 'all' | 'ski-resort' | 'forest' | 'campground' | 'wildlife-area';

export default function MapScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    requestLocationPermission();
    loadMarkers();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        console.log('User location obtained:', loc.coords);
      } else {
        console.log('Location permission denied');
        Alert.alert('Location Permission', 'Please enable location services to see your position.');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const loadMarkers = () => {
    const allMarkers: MapMarker[] = [
      ...mockSkiResorts.map(resort => ({
        id: resort.id,
        title: resort.name,
        type: 'ski-resort' as const,
        coordinate: resort.coordinates,
        description: resort.description,
        data: resort,
      })),
      ...mockNationalForests.map(forest => ({
        id: forest.id,
        title: forest.name,
        type: 'forest' as const,
        coordinate: forest.coordinates,
        description: forest.description,
        data: forest,
      })),
      ...mockStateForests.map(forest => ({
        id: forest.id,
        title: forest.name,
        type: 'forest' as const,
        coordinate: forest.coordinates,
        description: forest.description,
        data: forest,
      })),
      ...mockCampgrounds.map(camp => ({
        id: camp.id,
        title: camp.name,
        type: 'campground' as const,
        coordinate: camp.coordinates,
        description: camp.description,
        data: camp,
      })),
      ...mockWildlifeManagementAreas.map(wma => ({
        id: wma.id,
        title: wma.name,
        type: 'wildlife-area' as const,
        coordinate: wma.coordinates,
        description: wma.description,
        data: wma,
      })),
    ];
    setMarkers(allMarkers);
    console.log(`Loaded ${allMarkers.length} markers`);
  };

  const getMarkerColor = (type: string) => {
    switch(type) {
      case 'ski-resort': return '#2196F3';
      case 'forest': return '#4CAF50';
      case 'campground': return '#FF9800';
      case 'wildlife-area': return '#795548';
      default: return '#9E9E9E';
    }
  };

  const getMarkerIcon = (type: string) => {
    switch(type) {
      case 'ski-resort': return 'downhill-skiing';
      case 'forest': return 'park';
      case 'campground': return 'camping';
      case 'wildlife-area': return 'pets';
      default: return 'place';
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDistanceFromUser = (marker: MapMarker): string => {
    if (!location) return '';
    const distance = calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      marker.coordinate.latitude,
      marker.coordinate.longitude
    );
    return `${distance.toFixed(1)} mi away`;
  };

  const filteredMarkers = markers.filter(marker => {
    const matchesFilter = filter === 'all' || marker.type === filter;
    const matchesSearch = searchQuery === '' || 
      marker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marker.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (!location) return 0;
    const distA = calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      a.coordinate.latitude,
      a.coordinate.longitude
    );
    const distB = calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      b.coordinate.latitude,
      b.coordinate.longitude
    );
    return distA - distB;
  });

  const handleMarkerPress = (marker: MapMarker) => {
    setSelectedMarker(marker);
    console.log('Marker selected:', marker.title);
  };

  const handleGetDirections = () => {
    if (selectedMarker) {
      const { latitude, longitude } = selectedMarker.coordinate;
      const url = Platform.select({
        ios: `maps://app?daddr=${latitude},${longitude}`,
        android: `google.navigation:q=${latitude},${longitude}`,
        default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      });
      Alert.alert('Directions', `Opening directions to ${selectedMarker.title}...`);
      console.log('Opening directions URL:', url);
    }
  };

  const renderLocationCard = (marker: MapMarker) => {
    const data = marker.data;
    
    return (
      <Pressable 
        key={marker.id}
        style={styles.locationCard}
        onPress={() => handleMarkerPress(marker)}
      >
        <View style={styles.locationHeader}>
          <View style={[styles.locationIcon, { backgroundColor: getMarkerColor(marker.type) }]}>
            <IconSymbol 
              ios_icon_name="mappin.circle.fill" 
              android_material_icon_name={getMarkerIcon(marker.type)} 
              size={24} 
              color="#fff" 
            />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>{marker.title}</Text>
            <Text style={styles.locationType}>
              {marker.type.replace('-', ' ').toUpperCase()}
            </Text>
          </View>
          {location && (
            <Text style={styles.locationDistance}>{getDistanceFromUser(marker)}</Text>
          )}
        </View>
        
        <Text style={styles.locationDescription} numberOfLines={2}>
          {marker.description}
        </Text>

        {marker.type === 'ski-resort' && (
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <IconSymbol ios_icon_name="arrow.up" android_material_icon_name="arrow-upward" size={14} color={colors.text} />
              <Text style={styles.statText}>{(data as SkiResort).summitElevation}ft</Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol ios_icon_name="map" android_material_icon_name="terrain" size={14} color={colors.text} />
              <Text style={styles.statText}>{(data as SkiResort).acres} acres</Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol ios_icon_name="tram.fill" android_material_icon_name="cable-car" size={14} color={colors.text} />
              <Text style={styles.statText}>{(data as SkiResort).lifts} lifts</Text>
            </View>
          </View>
        )}

        {marker.type === 'campground' && (
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <IconSymbol ios_icon_name="tent" android_material_icon_name="camping" size={14} color={colors.text} />
              <Text style={styles.statText}>{(data as Campground).sites} sites</Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol ios_icon_name="dollarsign.circle" android_material_icon_name="attach-money" size={14} color={colors.text} />
              <Text style={styles.statText}>{(data as Campground).fee}</Text>
            </View>
          </View>
        )}

        <Pressable 
          style={styles.directionsButton}
          onPress={() => {
            setSelectedMarker(marker);
            handleGetDirections();
          }}
        >
          <IconSymbol ios_icon_name="arrow.triangle.turn.up.right.circle.fill" android_material_icon_name="directions" size={18} color={colors.primary} />
          <Text style={styles.directionsButtonText}>Get Directions</Text>
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Map',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerBackTitle: 'Back',
        }} 
      />
      
      {/* Map Notice */}
      <View style={styles.mapNotice}>
        <IconSymbol ios_icon_name="map.fill" android_material_icon_name="map" size={48} color={colors.primary} />
        <Text style={styles.mapNoticeTitle}>Interactive Map Coming Soon</Text>
        <Text style={styles.mapNoticeText}>
          Full interactive maps with react-native-maps are currently being integrated. 
          For now, browse locations below and get directions to any spot!
        </Text>
        {location && (
          <View style={styles.locationBadge}>
            <IconSymbol ios_icon_name="location.fill" android_material_icon_name="my-location" size={16} color="#fff" />
            <Text style={styles.locationBadgeText}>
              Your location: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
            </Text>
          </View>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <IconSymbol ios_icon_name="xmark.circle.fill" android_material_icon_name="cancel" size={20} color="#666" />
          </Pressable>
        )}
      </View>

      {/* Filter Buttons */}
      <ScrollView 
        horizontal 
        style={styles.filterContainer} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
      >
        <Pressable 
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]} 
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
            All ({markers.length})
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.filterButton, filter === 'ski-resort' && styles.filterButtonActive]} 
          onPress={() => setFilter('ski-resort')}
        >
          <IconSymbol ios_icon_name="snow" android_material_icon_name="downhill-skiing" size={16} color={filter === 'ski-resort' ? '#fff' : '#666'} />
          <Text style={[styles.filterButtonText, filter === 'ski-resort' && styles.filterButtonTextActive]}>
            Ski Resorts
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.filterButton, filter === 'forest' && styles.filterButtonActive]} 
          onPress={() => setFilter('forest')}
        >
          <IconSymbol ios_icon_name="tree" android_material_icon_name="park" size={16} color={filter === 'forest' ? '#fff' : '#666'} />
          <Text style={[styles.filterButtonText, filter === 'forest' && styles.filterButtonTextActive]}>
            Forests
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.filterButton, filter === 'campground' && styles.filterButtonActive]} 
          onPress={() => setFilter('campground')}
        >
          <IconSymbol ios_icon_name="tent" android_material_icon_name="camping" size={16} color={filter === 'campground' ? '#fff' : '#666'} />
          <Text style={[styles.filterButtonText, filter === 'campground' && styles.filterButtonTextActive]}>
            Campgrounds
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.filterButton, filter === 'wildlife-area' && styles.filterButtonActive]} 
          onPress={() => setFilter('wildlife-area')}
        >
          <IconSymbol ios_icon_name="pawprint" android_material_icon_name="pets" size={16} color={filter === 'wildlife-area' ? '#fff' : '#666'} />
          <Text style={[styles.filterButtonText, filter === 'wildlife-area' && styles.filterButtonTextActive]}>
            Wildlife Areas
          </Text>
        </Pressable>
      </ScrollView>

      {/* Results Counter */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredMarkers.length} location{filteredMarkers.length !== 1 ? 's' : ''} found
          {location && ' (sorted by distance)'}
        </Text>
      </View>

      {/* Locations List */}
      <ScrollView 
        style={styles.locationsList}
        contentContainerStyle={styles.locationsListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredMarkers.map(marker => renderLocationCard(marker))}
        
        {filteredMarkers.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No locations found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: colors.background,
  },
  mapNotice: {
    backgroundColor: colors.card,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mapNoticeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  mapNoticeText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
    gap: 6,
  },
  locationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    marginBottom: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filterContainer: {
    maxHeight: 50,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
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
    color: '#fff',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
    fontWeight: '500',
  },
  locationsList: {
    flex: 1,
  },
  locationsListContent: {
    padding: 16,
    paddingBottom: 100,
  },
  locationCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  locationType: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.6,
    fontWeight: '600',
  },
  locationDistance: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  locationDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 12,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    fontWeight: '500',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 8,
  },
  directionsButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.5,
    marginTop: 4,
  },
});
