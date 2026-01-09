
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform, ScrollView, TextInput, Modal } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region, Circle, Callout } from 'react-native-maps';
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
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [userRadius, setUserRadius] = useState<number>(50); // miles

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
        Alert.alert('Location Permission', 'Please enable location services to see your position on the map.');
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

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }, 1000);
      console.log('Centered map on user location');
    } else {
      Alert.alert('Location Unavailable', 'Unable to get your current location.');
    }
  };

  const toggleMapType = () => {
    const types: Array<'standard' | 'satellite' | 'hybrid'> = ['standard', 'satellite', 'hybrid'];
    const currentIndex = types.indexOf(mapType);
    const nextType = types[(currentIndex + 1) % types.length];
    setMapType(nextType);
    console.log('Map type changed to:', nextType);
  };

  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.getCamera().then(camera => {
        if (camera.zoom) {
          mapRef.current?.animateCamera({ zoom: camera.zoom + 1 }, { duration: 300 });
        }
      });
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.getCamera().then(camera => {
        if (camera.zoom) {
          mapRef.current?.animateCamera({ zoom: camera.zoom - 1 }, { duration: 300 });
        }
      });
    }
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

  const renderMarkerDetails = () => {
    if (!selectedMarker) return null;

    const data = selectedMarker.data;
    
    return (
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHeader}>
          <View style={styles.bottomSheetHandle} />
        </View>
        
        <ScrollView style={styles.bottomSheetContent} showsVerticalScrollIndicator={false}>
          <View style={styles.markerTypeContainer}>
            <View style={[styles.markerTypeBadge, { backgroundColor: getMarkerColor(selectedMarker.type) }]}>
              <IconSymbol 
                ios_icon_name="mappin.circle.fill" 
                android_material_icon_name={getMarkerIcon(selectedMarker.type)} 
                size={16} 
                color="#fff" 
              />
              <Text style={styles.markerTypeText}>
                {selectedMarker.type.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
            {location && (
              <Text style={styles.distanceText}>{getDistanceFromUser(selectedMarker)}</Text>
            )}
          </View>

          <Text style={styles.markerTitle}>{selectedMarker.title}</Text>
          <Text style={styles.markerDescription}>{selectedMarker.description}</Text>

          {selectedMarker.type === 'ski-resort' && (
            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>Resort Information</Text>
              <View style={styles.detailRow}>
                <IconSymbol ios_icon_name="arrow.up" android_material_icon_name="arrow-upward" size={16} color={colors.text} />
                <Text style={styles.detailText}>
                  Base: {(data as SkiResort).baseElevation}ft | Summit: {(data as SkiResort).summitElevation}ft
                </Text>
              </View>
              <View style={styles.detailRow}>
                <IconSymbol ios_icon_name="map" android_material_icon_name="terrain" size={16} color={colors.text} />
                <Text style={styles.detailText}>
                  {(data as SkiResort).acres.toLocaleString()} acres | {(data as SkiResort).lifts} lifts
                </Text>
              </View>
              <View style={styles.detailRow}>
                <IconSymbol ios_icon_name="calendar" android_material_icon_name="calendar-today" size={16} color={colors.text} />
                <Text style={styles.detailText}>
                  Season: {(data as SkiResort).season.start} - {(data as SkiResort).season.end}
                </Text>
              </View>
              <Text style={styles.detailsSubtitle}>Trails: {(data as SkiResort).trails.length} total</Text>
            </View>
          )}

          {selectedMarker.type === 'forest' && (
            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>Forest Information</Text>
              <View style={styles.detailRow}>
                <IconSymbol ios_icon_name="map" android_material_icon_name="terrain" size={16} color={colors.text} />
                <Text style={styles.detailText}>
                  {((data as Forest).acres / 1000).toFixed(0)}K acres
                </Text>
              </View>
              <Text style={styles.detailsSubtitle}>Activities:</Text>
              <View style={styles.tagContainer}>
                {(data as Forest).activities.map((activity, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{activity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedMarker.type === 'campground' && (
            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>Campground Information</Text>
              <View style={styles.detailRow}>
                <IconSymbol ios_icon_name="tent" android_material_icon_name="camping" size={16} color={colors.text} />
                <Text style={styles.detailText}>
                  {(data as Campground).sites} sites | {(data as Campground).fee}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <IconSymbol ios_icon_name="calendar" android_material_icon_name="calendar-today" size={16} color={colors.text} />
                <Text style={styles.detailText}>
                  Season: {(data as Campground).season.start} - {(data as Campground).season.end}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <IconSymbol 
                  ios_icon_name={(data as Campground).reservable ? "checkmark.circle" : "xmark.circle"} 
                  android_material_icon_name={(data as Campground).reservable ? "check-circle" : "cancel"} 
                  size={16} 
                  color={(data as Campground).reservable ? '#4CAF50' : '#F44336'} 
                />
                <Text style={styles.detailText}>
                  {(data as Campground).reservable ? 'Reservations Available' : 'First Come, First Served'}
                </Text>
              </View>
              <Text style={styles.detailsSubtitle}>Amenities:</Text>
              <View style={styles.tagContainer}>
                {(data as Campground).amenities.map((amenity, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedMarker.type === 'wildlife-area' && (
            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>Wildlife Management Area</Text>
              <View style={styles.detailRow}>
                <IconSymbol ios_icon_name="map" android_material_icon_name="terrain" size={16} color={colors.text} />
                <Text style={styles.detailText}>
                  {((data as WildlifeManagementArea).acres / 1000).toFixed(0)}K acres
                </Text>
              </View>
              <Text style={styles.detailsSubtitle}>Species:</Text>
              <View style={styles.tagContainer}>
                {(data as WildlifeManagementArea).species.map((species, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{species}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.detailsSubtitle}>Hunting Seasons:</Text>
              {(data as WildlifeManagementArea).huntingSeasons.map((season, index) => (
                <Text key={index} style={styles.seasonText}>• {season}</Text>
              ))}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Pressable style={styles.directionsButton} onPress={handleGetDirections}>
              <IconSymbol ios_icon_name="arrow.triangle.turn.up.right.circle.fill" android_material_icon_name="directions" size={20} color="#fff" />
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </Pressable>
            <Pressable style={styles.closeButton} onPress={() => setSelectedMarker(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        initialRegion={{
          latitude: location?.coords.latitude || 39.5501,
          longitude: location?.coords.longitude || -105.7821,
          latitudeDelta: 2,
          longitudeDelta: 2,
        }}
      >
        {filteredMarkers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={getMarkerColor(marker.type)}
            onPress={() => handleMarkerPress(marker)}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={styles.calloutDescription}>{marker.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {location && (
          <Circle
            center={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={userRadius * 1609.34} // Convert miles to meters
            strokeColor="rgba(0, 122, 255, 0.3)"
            fillColor="rgba(0, 122, 255, 0.1)"
          />
        )}
      </MapView>

      {/* Top Controls */}
      <View style={styles.topControls}>
        <Pressable style={styles.searchButton} onPress={() => setShowSearch(!showSearch)}>
          <IconSymbol ios_icon_name="magnifyingglass" android_material_icon_name="search" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Search Bar */}
      {showSearch && (
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
      )}

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

      {/* Right Side Controls */}
      <View style={styles.rightControls}>
        <Pressable style={styles.controlButton} onPress={toggleMapType}>
          <IconSymbol ios_icon_name="map" android_material_icon_name="map" size={24} color="#fff" />
          <Text style={styles.controlButtonLabel}>{mapType}</Text>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={centerOnUser}>
          <IconSymbol ios_icon_name="location.fill" android_material_icon_name="my-location" size={24} color="#fff" />
        </Pressable>
        <Pressable style={styles.controlButton} onPress={zoomIn}>
          <IconSymbol ios_icon_name="plus" android_material_icon_name="add" size={24} color="#fff" />
        </Pressable>
        <Pressable style={styles.controlButton} onPress={zoomOut}>
          <IconSymbol ios_icon_name="minus" android_material_icon_name="remove" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Results Counter */}
      {searchQuery.length > 0 && (
        <View style={styles.resultsCounter}>
          <Text style={styles.resultsCounterText}>
            {filteredMarkers.length} result{filteredMarkers.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}

      {/* Bottom Sheet */}
      {selectedMarker && renderMarkerDetails()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: colors.background,
  },
  map: { 
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 70,
    left: 16,
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 70,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  filterContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 120 : 130,
    left: 0,
    right: 0,
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  rightControls: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 70,
    right: 16,
    gap: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  controlButtonLabel: {
    fontSize: 8,
    color: '#fff',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  resultsCounter: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 180 : 190,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  resultsCounterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  calloutContainer: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 12,
    color: '#666',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    maxHeight: '60%',
  },
  bottomSheetHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  markerTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  markerTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  markerTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  markerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  markerDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  detailsSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  seasonText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
