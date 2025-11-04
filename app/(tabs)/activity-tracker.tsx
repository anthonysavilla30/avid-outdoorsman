
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { TrackedActivity, LocationPoint, ActivityStats } from '@/types/Activity';

const LOCATION_TASK_NAME = 'background-location-task';

// Define the background task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data as any;
    console.log('Received new locations in background:', locations);
    // In a real app, you would store these locations
  }
});

export default function ActivityTrackerScreen() {
  const router = useRouter();
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [hasBackgroundPermission, setHasBackgroundPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<TrackedActivity | null>(null);
  const [activities, setActivities] = useState<TrackedActivity[]>([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivityType, setSelectedActivityType] = useState<TrackedActivity['type']>('hiking');
  const [activityName, setActivityName] = useState('');
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const startTime = useRef<Date | null>(null);
  const pausedTime = useRef<number>(0);

  useEffect(() => {
    requestPermissions();
    getCurrentLocation();
    loadActivities();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(foregroundStatus === 'granted');

      if (foregroundStatus === 'granted') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        setHasBackgroundPermission(backgroundStatus === 'granted');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Permission Error', 'Failed to request location permissions.');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const loadActivities = () => {
    // In a real app, load from storage
    const mockActivities: TrackedActivity[] = [
      {
        id: '1',
        type: 'hiking',
        status: 'completed',
        startTime: new Date(Date.now() - 3600000 * 2),
        endTime: new Date(Date.now() - 3600000),
        route: [],
        stats: {
          distance: 5.2,
          duration: 3600,
          elevationGain: 850,
          elevationLoss: 850,
          maxSpeed: 4.5,
          avgSpeed: 2.8,
          calories: 420,
        },
        name: 'Mountain Trail Loop',
      },
      {
        id: '2',
        type: 'fishing',
        status: 'completed',
        startTime: new Date(Date.now() - 86400000),
        endTime: new Date(Date.now() - 86400000 + 7200000),
        route: [],
        stats: {
          distance: 0.3,
          duration: 7200,
          elevationGain: 0,
          elevationLoss: 0,
          maxSpeed: 0.5,
          avgSpeed: 0.1,
        },
        name: 'Lake Fishing Session',
      },
    ];
    setActivities(mockActivities);
  };

  const startTracking = async () => {
    if (!hasLocationPermission) {
      Alert.alert('Permission Required', 'Please grant location permission to track activities.');
      return;
    }

    try {
      // Start foreground location tracking
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          console.log('Location update:', location);
          if (currentActivity && !isPaused) {
            const newPoint: LocationPoint = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              altitude: location.coords.altitude || undefined,
              timestamp: location.timestamp,
              accuracy: location.coords.accuracy || undefined,
              speed: location.coords.speed || undefined,
            };
            
            setCurrentActivity(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                route: [...prev.route, newPoint],
              };
            });
          }
        }
      );
      locationSubscription.current = subscription;

      // Start background location tracking if permission granted
      if (hasBackgroundPermission) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 20,
          foregroundService: {
            notificationTitle: 'Tracking Activity',
            notificationBody: 'Avid Outdoorsman is tracking your outdoor activity',
          },
        });
      }

      startTime.current = new Date();
      const newActivity: TrackedActivity = {
        id: Date.now().toString(),
        type: selectedActivityType,
        status: 'active',
        startTime: startTime.current,
        route: [],
        stats: {
          distance: 0,
          duration: 0,
          elevationGain: 0,
          elevationLoss: 0,
          maxSpeed: 0,
          avgSpeed: 0,
        },
        name: activityName || `${selectedActivityType} Activity`,
      };

      setCurrentActivity(newActivity);
      setIsTracking(true);
      setShowActivityModal(false);
      Alert.alert('Tracking Started', 'Your activity is now being tracked.');
    } catch (error) {
      console.error('Error starting tracking:', error);
      Alert.alert('Error', 'Failed to start activity tracking.');
    }
  };

  const pauseTracking = () => {
    setIsPaused(true);
    pausedTime.current = Date.now();
  };

  const resumeTracking = () => {
    setIsPaused(false);
    if (pausedTime.current > 0) {
      const pauseDuration = Date.now() - pausedTime.current;
      // Adjust start time to account for pause
      if (startTime.current) {
        startTime.current = new Date(startTime.current.getTime() + pauseDuration);
      }
    }
  };

  const stopTracking = async () => {
    try {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }

      if (hasBackgroundPermission) {
        const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (isTracking) {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }
      }

      if (currentActivity) {
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - currentActivity.startTime.getTime()) / 1000);
        
        // Calculate stats from route
        const stats = calculateStats(currentActivity.route, duration);
        
        const completedActivity: TrackedActivity = {
          ...currentActivity,
          status: 'completed',
          endTime,
          stats,
        };

        setActivities(prev => [completedActivity, ...prev]);
        setCurrentActivity(null);
      }

      setIsTracking(false);
      setIsPaused(false);
      startTime.current = null;
      pausedTime.current = 0;
      
      Alert.alert('Activity Saved', 'Your activity has been saved successfully.');
    } catch (error) {
      console.error('Error stopping tracking:', error);
      Alert.alert('Error', 'Failed to stop activity tracking.');
    }
  };

  const calculateStats = (route: LocationPoint[], duration: number): ActivityStats => {
    if (route.length < 2) {
      return {
        distance: 0,
        duration,
        elevationGain: 0,
        elevationLoss: 0,
        maxSpeed: 0,
        avgSpeed: 0,
      };
    }

    let totalDistance = 0;
    let elevationGain = 0;
    let elevationLoss = 0;
    let maxSpeed = 0;

    for (let i = 1; i < route.length; i++) {
      const prev = route[i - 1];
      const curr = route[i];

      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );
      totalDistance += distance;

      // Calculate elevation changes
      if (prev.altitude !== undefined && curr.altitude !== undefined) {
        const elevChange = (curr.altitude - prev.altitude) * 3.28084; // Convert to feet
        if (elevChange > 0) {
          elevationGain += elevChange;
        } else {
          elevationLoss += Math.abs(elevChange);
        }
      }

      // Track max speed
      if (curr.speed !== undefined) {
        const speedMph = curr.speed * 2.23694; // Convert m/s to mph
        maxSpeed = Math.max(maxSpeed, speedMph);
      }
    }

    const avgSpeed = duration > 0 ? (totalDistance / duration) * 3600 : 0;

    return {
      distance: totalDistance,
      duration,
      elevationGain,
      elevationLoss,
      maxSpeed,
      avgSpeed,
      calories: Math.floor(totalDistance * 100), // Rough estimate
    };
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getActivityIcon = (type: string): string => {
    const icons: Record<string, string> = {
      hiking: 'figure.hiking',
      fishing: 'fish.fill',
      hunting: 'scope',
      camping: 'tent.fill',
      kayaking: 'figure.outdoor.cycle',
      'mountain-biking': 'bicycle',
      overlanding: 'car.fill',
      backpacking: 'backpack.fill',
      'rock-climbing': 'figure.climbing',
      'trail-running': 'figure.run',
      'cross-country-skiing': 'figure.skiing.crosscountry',
      snowshoeing: 'figure.snowboarding',
    };
    return icons[type] || 'figure.walk';
  };

  const getActivityColor = (type: string): string => {
    const colors: Record<string, string> = {
      hiking: '#2ECC71',
      fishing: '#3498DB',
      hunting: '#E67E22',
      camping: '#9B59B6',
      kayaking: '#1ABC9C',
      'mountain-biking': '#E74C3C',
      overlanding: '#F39C12',
      backpacking: '#16A085',
      'rock-climbing': '#C0392B',
      'trail-running': '#27AE60',
      'cross-country-skiing': '#3498DB',
      snowshoeing: '#8E44AD',
    };
    return colors[type] || '#95A5A6';
  };

  const activityTypes: TrackedActivity['type'][] = [
    'hiking',
    'fishing',
    'hunting',
    'camping',
    'kayaking',
    'mountain-biking',
    'overlanding',
    'backpacking',
    'rock-climbing',
    'trail-running',
    'cross-country-skiing',
    'snowshoeing',
  ];

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
    <View style={styles.headerButtonGroup}>
      <Pressable style={styles.headerButton} onPress={handleMapPress}>
        <IconSymbol name="map.fill" color={colors.primary} size={24} />
      </Pressable>
    </View>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Activity Tracker',
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
            <Text style={styles.title}>Activity Tracker</Text>
            <Text style={styles.subtitle}>
              Track your outdoor adventures with GPS location and detailed stats
            </Text>
          </View>

          {/* Permission Status */}
          {!hasLocationPermission && (
            <View style={styles.permissionCard}>
              <IconSymbol name="location.slash.fill" size={32} color={colors.error} />
              <Text style={styles.permissionTitle}>Location Permission Required</Text>
              <Text style={styles.permissionText}>
                Grant location permission to track your outdoor activities
              </Text>
              <Pressable style={styles.permissionButton} onPress={requestPermissions}>
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
              </Pressable>
            </View>
          )}

          {hasLocationPermission && !hasBackgroundPermission && (
            <View style={styles.permissionCard}>
              <IconSymbol name="location.fill" size={32} color={colors.warning} />
              <Text style={styles.permissionTitle}>Background Location Recommended</Text>
              <Text style={styles.permissionText}>
                Enable background location to track activities even when the app is closed
              </Text>
              <Pressable style={styles.permissionButton} onPress={requestPermissions}>
                <Text style={styles.permissionButtonText}>Enable Background Tracking</Text>
              </Pressable>
            </View>
          )}

          {/* Current Location */}
          {currentLocation && (
            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <IconSymbol name="location.fill" size={24} color={colors.primary} />
                <Text style={styles.locationTitle}>Current Location</Text>
              </View>
              <Text style={styles.locationCoords}>
                {currentLocation.coords.latitude.toFixed(6)}, {currentLocation.coords.longitude.toFixed(6)}
              </Text>
              <View style={styles.locationStats}>
                <View style={styles.locationStat}>
                  <Text style={styles.locationStatLabel}>Accuracy</Text>
                  <Text style={styles.locationStatValue}>
                    {currentLocation.coords.accuracy?.toFixed(0) || 'N/A'}m
                  </Text>
                </View>
                {currentLocation.coords.altitude && (
                  <View style={styles.locationStat}>
                    <Text style={styles.locationStatLabel}>Altitude</Text>
                    <Text style={styles.locationStatValue}>
                      {(currentLocation.coords.altitude * 3.28084).toFixed(0)}ft
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Active Tracking */}
          {isTracking && currentActivity && (
            <View style={styles.activeTrackingCard}>
              <View style={styles.activeTrackingHeader}>
                <View style={styles.activeTrackingTitleRow}>
                  <IconSymbol
                    name={getActivityIcon(currentActivity.type) as any}
                    size={32}
                    color={getActivityColor(currentActivity.type)}
                  />
                  <View style={styles.activeTrackingInfo}>
                    <Text style={styles.activeTrackingTitle}>{currentActivity.name}</Text>
                    <Text style={styles.activeTrackingType}>
                      {currentActivity.type.replace('-', ' ')}
                    </Text>
                  </View>
                  {isPaused && (
                    <View style={styles.pausedBadge}>
                      <Text style={styles.pausedBadgeText}>PAUSED</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.activeTrackingStats}>
                <View style={styles.activeTrackingStat}>
                  <IconSymbol name="timer" size={20} color={colors.textSecondary} />
                  <Text style={styles.activeTrackingStatLabel}>Duration</Text>
                  <Text style={styles.activeTrackingStatValue}>
                    {formatDuration(Math.floor((Date.now() - currentActivity.startTime.getTime()) / 1000))}
                  </Text>
                </View>
                <View style={styles.activeTrackingStat}>
                  <IconSymbol name="arrow.up.right" size={20} color={colors.textSecondary} />
                  <Text style={styles.activeTrackingStatLabel}>Distance</Text>
                  <Text style={styles.activeTrackingStatValue}>
                    {currentActivity.route.length > 1
                      ? calculateStats(currentActivity.route, 0).distance.toFixed(2)
                      : '0.00'} mi
                  </Text>
                </View>
                <View style={styles.activeTrackingStat}>
                  <IconSymbol name="location.fill" size={20} color={colors.textSecondary} />
                  <Text style={styles.activeTrackingStatLabel}>Points</Text>
                  <Text style={styles.activeTrackingStatValue}>{currentActivity.route.length}</Text>
                </View>
              </View>

              <View style={styles.activeTrackingControls}>
                {!isPaused ? (
                  <Pressable style={styles.pauseButton} onPress={pauseTracking}>
                    <IconSymbol name="pause.fill" size={24} color="#ffffff" />
                    <Text style={styles.controlButtonText}>Pause</Text>
                  </Pressable>
                ) : (
                  <Pressable style={styles.resumeButton} onPress={resumeTracking}>
                    <IconSymbol name="play.fill" size={24} color="#ffffff" />
                    <Text style={styles.controlButtonText}>Resume</Text>
                  </Pressable>
                )}
                <Pressable style={styles.stopButton} onPress={stopTracking}>
                  <IconSymbol name="stop.fill" size={24} color="#ffffff" />
                  <Text style={styles.controlButtonText}>Stop & Save</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Start Tracking Button */}
          {!isTracking && hasLocationPermission && (
            <Pressable
              style={styles.startTrackingButton}
              onPress={() => setShowActivityModal(true)}
            >
              <IconSymbol name="play.circle.fill" size={32} color="#ffffff" />
              <Text style={styles.startTrackingButtonText}>Start New Activity</Text>
            </Pressable>
          )}

          {/* Activity History */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="clock.fill" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Activity History</Text>
            </View>

            {activities.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol name="figure.walk" size={64} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>No activities yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Start tracking your outdoor adventures
                </Text>
              </View>
            ) : (
              activities.map((activity) => (
                <View key={activity.id} style={styles.activityCard}>
                  <View style={styles.activityCardHeader}>
                    <View style={[
                      styles.activityIconContainer,
                      { backgroundColor: getActivityColor(activity.type) + '20' }
                    ]}>
                      <IconSymbol
                        name={getActivityIcon(activity.type) as any}
                        size={24}
                        color={getActivityColor(activity.type)}
                      />
                    </View>
                    <View style={styles.activityCardInfo}>
                      <Text style={styles.activityCardTitle}>{activity.name}</Text>
                      <Text style={styles.activityCardDate}>
                        {activity.startTime.toLocaleDateString()} at{' '}
                        {activity.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.activityCardStats}>
                    <View style={styles.activityCardStat}>
                      <IconSymbol name="arrow.up.right" size={16} color={colors.textSecondary} />
                      <Text style={styles.activityCardStatValue}>
                        {activity.stats.distance.toFixed(2)} mi
                      </Text>
                    </View>
                    <View style={styles.activityCardStat}>
                      <IconSymbol name="timer" size={16} color={colors.textSecondary} />
                      <Text style={styles.activityCardStatValue}>
                        {formatDuration(activity.stats.duration)}
                      </Text>
                    </View>
                    <View style={styles.activityCardStat}>
                      <IconSymbol name="arrow.up" size={16} color={colors.textSecondary} />
                      <Text style={styles.activityCardStatValue}>
                        {activity.stats.elevationGain.toFixed(0)} ft
                      </Text>
                    </View>
                    {activity.stats.calories && (
                      <View style={styles.activityCardStat}>
                        <IconSymbol name="flame.fill" size={16} color={colors.textSecondary} />
                        <Text style={styles.activityCardStatValue}>
                          {activity.stats.calories} cal
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Stats Summary */}
          {activities.length > 0 && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Total Stats</Text>
              <View style={styles.summaryStats}>
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatValue}>
                    {activities.reduce((sum, a) => sum + a.stats.distance, 0).toFixed(1)}
                  </Text>
                  <Text style={styles.summaryStatLabel}>Miles</Text>
                </View>
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatValue}>{activities.length}</Text>
                  <Text style={styles.summaryStatLabel}>Activities</Text>
                </View>
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatValue}>
                    {Math.floor(activities.reduce((sum, a) => sum + a.stats.duration, 0) / 3600)}
                  </Text>
                  <Text style={styles.summaryStatLabel}>Hours</Text>
                </View>
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatValue}>
                    {Math.floor(activities.reduce((sum, a) => sum + a.stats.elevationGain, 0))}
                  </Text>
                  <Text style={styles.summaryStatLabel}>Elevation (ft)</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Activity Type Selection Modal */}
        <Modal
          visible={showActivityModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowActivityModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowActivityModal(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Start Activity</Text>
                <Pressable onPress={() => setShowActivityModal(false)}>
                  <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll}>
                <Text style={styles.modalLabel}>Activity Name (Optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Morning Trail Run"
                  placeholderTextColor={colors.textSecondary}
                  value={activityName}
                  onChangeText={setActivityName}
                />

                <Text style={styles.modalLabel}>Activity Type</Text>
                <View style={styles.activityTypeGrid}>
                  {activityTypes.map((type) => (
                    <Pressable
                      key={type}
                      style={[
                        styles.activityTypeButton,
                        selectedActivityType === type && styles.activityTypeButtonActive,
                        { borderColor: getActivityColor(type) + '40' },
                      ]}
                      onPress={() => setSelectedActivityType(type)}
                    >
                      <IconSymbol
                        name={getActivityIcon(type) as any}
                        size={28}
                        color={
                          selectedActivityType === type
                            ? getActivityColor(type)
                            : colors.textSecondary
                        }
                      />
                      <Text
                        style={[
                          styles.activityTypeText,
                          selectedActivityType === type && styles.activityTypeTextActive,
                        ]}
                      >
                        {type.replace('-', ' ')}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <Pressable style={styles.modalButton} onPress={startTracking}>
                  <IconSymbol name="play.fill" size={20} color="#ffffff" />
                  <Text style={styles.modalButtonText}>Start Tracking</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
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
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  permissionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  locationCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  locationCoords: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  locationStats: {
    flexDirection: 'row',
    gap: 16,
  },
  locationStat: {
    flex: 1,
  },
  locationStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  locationStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  activeTrackingCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 5,
  },
  activeTrackingHeader: {
    marginBottom: 20,
  },
  activeTrackingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activeTrackingInfo: {
    flex: 1,
  },
  activeTrackingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  activeTrackingType: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  pausedBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pausedBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  activeTrackingStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  activeTrackingStat: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
  },
  activeTrackingStatLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 4,
  },
  activeTrackingStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  activeTrackingControls: {
    flexDirection: 'row',
    gap: 12,
  },
  pauseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.warning,
    padding: 16,
    borderRadius: 12,
  },
  resumeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.success,
    padding: 16,
    borderRadius: 12,
  },
  stopButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.error,
    padding: 16,
    borderRadius: 12,
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  startTrackingButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 5,
  },
  startTrackingButtonText: {
    color: '#ffffff',
    fontSize: 18,
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
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  activityCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityCardInfo: {
    flex: 1,
  },
  activityCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  activityCardDate: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  activityCardStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  activityCardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityCardStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  headerButton: {
    padding: 4,
  },
  headerButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    boxShadow: `0px -4px 16px ${colors.shadow}`,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  modalScroll: {
    maxHeight: 500,
    padding: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityTypeButton: {
    width: '47%',
    aspectRatio: 1.5,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
  },
  activityTypeButtonActive: {
    backgroundColor: colors.background,
    borderWidth: 2,
  },
  activityTypeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  activityTypeTextActive: {
    color: colors.text,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
