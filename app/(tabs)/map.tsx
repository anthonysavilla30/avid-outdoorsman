
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import LandmarkModal from '@/components/LandmarkModal';
import { mockLandmarks } from '@/data/mockLandmarks';
import { Landmark } from '@/types/Landmark';

export default function MapScreen() {
  const [landmarks, setLandmarks] = useState<Landmark[]>(mockLandmarks);
  const [showLandmarkModal, setShowLandmarkModal] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState({ lat: 0, lng: 0 });

  const handleAddLandmark = () => {
    // Simulate selecting a location on the map
    // In a real app, this would come from a long-press on the map
    const randomLat = 40.7 + Math.random() * 0.1;
    const randomLng = -74.0 + Math.random() * 0.1;
    
    setSelectedCoordinates({ lat: randomLat, lng: randomLng });
    setShowLandmarkModal(true);
  };

  const handleSaveLandmark = (landmarkData: {
    title: string;
    description: string;
    visibility: any;
    category: string;
  }) => {
    const newLandmark: Landmark = {
      id: Date.now().toString(),
      title: landmarkData.title,
      description: landmarkData.description,
      latitude: selectedCoordinates.lat,
      longitude: selectedCoordinates.lng,
      visibility: landmarkData.visibility,
      createdBy: {
        id: 'current-user',
        name: 'You',
      },
      createdAt: new Date(),
      category: landmarkData.category as any,
    };

    setLandmarks([...landmarks, newLandmark]);
    setShowLandmarkModal(false);
    
    Alert.alert('Success', 'Landmark added successfully!');
    console.log('New landmark created:', newLandmark);
  };

  const getLandmarkIcon = (category?: string) => {
    switch (category) {
      case 'trail':
        return 'figure.hiking';
      case 'fishing-spot':
        return 'figure.fishing';
      case 'camping':
        return 'tent.fill';
      case 'hunting-area':
        return 'scope';
      case 'viewpoint':
        return 'eye.fill';
      default:
        return 'mappin.circle.fill';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'only-me':
        return 'lock.fill';
      case 'followers':
        return 'person.2.fill';
      case 'public':
        return 'globe';
      default:
        return 'mappin.circle.fill';
    }
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Map',
            headerLargeTitle: false,
            headerRight: () => (
              <Pressable onPress={handleAddLandmark} style={styles.headerButton}>
                <IconSymbol name="plus.circle.fill" color={colors.primary} size={28} />
              </Pressable>
            ),
          }}
        />
      )}
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            Platform.OS !== 'ios' && styles.contentWithTabBar,
          ]}
        >
          <View style={styles.iconContainer}>
            <IconSymbol name="map" size={80} color={colors.primary} />
          </View>
          
          <Text style={styles.title}>Interactive Maps</Text>
          <Text style={styles.subtitle}>Coming Soon</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Note:</Text> react-native-maps is not currently supported in the Natively environment.
            </Text>
            <Text style={[styles.infoText, styles.marginTop]}>
              The full version of Avid Outdoorsman will include:
            </Text>
          </View>

          <View style={styles.featureList}>
            <FeatureItem 
              icon="map.fill" 
              text="High-resolution satellite imagery"
            />
            <FeatureItem 
              icon="mountain.2" 
              text="Topographic contour lines for elevation"
            />
            <FeatureItem 
              icon="square.dashed" 
              text="BLM and National Forest boundaries"
            />
            <FeatureItem 
              icon="house.fill" 
              text="Private property lines (stay legal, stay safe)"
            />
            <FeatureItem 
              icon="figure.hiking" 
              text="Trail overlays from OpenStreetMap"
            />
            <FeatureItem 
              icon="mappin.circle.fill" 
              text="Custom markers with privacy controls"
            />
            <FeatureItem 
              icon="magnifyingglass" 
              text="Location search to scout new areas"
            />
          </View>

          {/* Landmark Features Section */}
          <View style={styles.landmarkSection}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="mappin.and.ellipse" size={28} color={colors.accent} />
              <Text style={styles.sectionTitle}>Landmark Features</Text>
            </View>
            
            <Text style={styles.sectionDescription}>
              Mark your favorite spots and share them with followers:
            </Text>

            <View style={styles.landmarkFeatures}>
              <View style={styles.landmarkFeature}>
                <IconSymbol name="hand.tap.fill" size={24} color={colors.primary} />
                <Text style={styles.landmarkFeatureText}>
                  Long-press on map to drop a pin
                </Text>
              </View>
              <View style={styles.landmarkFeature}>
                <IconSymbol name="lock.fill" size={24} color={colors.primary} />
                <Text style={styles.landmarkFeatureText}>
                  Control who can see your landmarks
                </Text>
              </View>
              <View style={styles.landmarkFeature}>
                <IconSymbol name="tag.fill" size={24} color={colors.primary} />
                <Text style={styles.landmarkFeatureText}>
                  Categorize by activity type
                </Text>
              </View>
              <View style={styles.landmarkFeature}>
                <IconSymbol name="photo.fill" size={24} color={colors.primary} />
                <Text style={styles.landmarkFeatureText}>
                  Add photos and descriptions
                </Text>
              </View>
            </View>

            <Pressable style={styles.demoButton} onPress={handleAddLandmark}>
              <IconSymbol name="plus.circle.fill" size={24} color="#ffffff" />
              <Text style={styles.demoButtonText}>Try Adding a Landmark</Text>
            </Pressable>
          </View>

          {/* Your Landmarks */}
          {landmarks.length > 0 && (
            <View style={styles.landmarksListSection}>
              <Text style={styles.sectionTitle}>Your Landmarks ({landmarks.length})</Text>
              {landmarks.map((landmark) => (
                <View key={landmark.id} style={styles.landmarkCard}>
                  <View style={styles.landmarkHeader}>
                    <View style={styles.landmarkTitleRow}>
                      <IconSymbol
                        name={getLandmarkIcon(landmark.category) as any}
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={styles.landmarkTitle}>{landmark.title}</Text>
                    </View>
                    <View style={styles.visibilityBadge}>
                      <IconSymbol
                        name={getVisibilityIcon(landmark.visibility) as any}
                        size={14}
                        color={colors.textSecondary}
                      />
                    </View>
                  </View>
                  {landmark.description && (
                    <Text style={styles.landmarkDescription}>{landmark.description}</Text>
                  )}
                  <View style={styles.landmarkFooter}>
                    <Text style={styles.landmarkCoords}>
                      {landmark.latitude.toFixed(4)}, {landmark.longitude.toFixed(4)}
                    </Text>
                    <Text style={styles.landmarkDate}>
                      {landmark.createdAt.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.comingSoonBadge}>
            <IconSymbol name="clock" size={20} color={colors.accent} />
            <Text style={styles.comingSoonText}>
              Maps will be available in a future update
            </Text>
          </View>
        </ScrollView>

        {/* Floating Action Button for Add Landmark */}
        {Platform.OS !== 'ios' && (
          <Pressable style={styles.fab} onPress={handleAddLandmark}>
            <IconSymbol name="mappin.and.ellipse" color="#ffffff" size={28} />
          </Pressable>
        )}
      </SafeAreaView>

      <LandmarkModal
        visible={showLandmarkModal}
        onClose={() => setShowLandmarkModal(false)}
        onSave={handleSaveLandmark}
        latitude={selectedCoordinates.lat}
        longitude={selectedCoordinates.lng}
      />
    </>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <IconSymbol name={icon as any} size={24} color={colors.primary} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  contentWithTabBar: {
    paddingBottom: 100,
  },
  iconContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 32,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  bold: {
    fontWeight: '700',
  },
  marginTop: {
    marginTop: 12,
  },
  featureList: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 10,
    gap: 12,
    boxShadow: `0px 1px 4px ${colors.shadow}`,
    elevation: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  landmarkSection: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  sectionDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  landmarkFeatures: {
    gap: 16,
    marginBottom: 20,
  },
  landmarkFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  landmarkFeatureText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  landmarksListSection: {
    width: '100%',
    marginBottom: 24,
  },
  landmarkCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    boxShadow: `0px 2px 6px ${colors.shadow}`,
    elevation: 2,
  },
  landmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  landmarkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  landmarkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  visibilityBadge: {
    backgroundColor: colors.background,
    padding: 6,
    borderRadius: 8,
  },
  landmarkDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  landmarkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  landmarkCoords: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  landmarkDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  comingSoonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerButton: {
    padding: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 8,
  },
});
