
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from 'react-native';
import { mockLandmarks } from '@/data/mockLandmarks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import LandmarkModal from '@/components/LandmarkModal';
import { IconSymbol } from '@/components/IconSymbol';
import { Landmark } from '@/types/Landmark';

export default function MapScreen() {
  const router = useRouter();
  const [landmarks, setLandmarks] = useState<Landmark[]>(mockLandmarks);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      coordinates: {
        latitude: 39.7392 + (Math.random() - 0.5) * 0.1,
        longitude: -104.9903 + (Math.random() - 0.5) * 0.1,
      },
      createdBy: 'Current User',
      createdAt: new Date(),
    };

    setLandmarks([...landmarks, newLandmark]);
    setIsModalVisible(false);
    Alert.alert('Success', 'Landmark added successfully!');
  };

  const getLandmarkIcon = (category: string) => {
    switch (category) {
      case 'fishing':
        return 'fish.fill';
      case 'hunting':
        return 'scope';
      case 'camping':
        return 'tent.fill';
      case 'hiking':
        return 'figure.hiking';
      case 'other':
        return 'mappin.circle.fill';
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
      case 'private':
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
            <Text style={styles.title}>Interactive Maps</Text>
            <Text style={styles.subtitle}>
              Note: react-native-maps is not currently supported in Natively. 
              This is a placeholder showing map features.
            </Text>
          </View>

          <View style={styles.mapPlaceholder}>
            <IconSymbol name="map.fill" size={64} color={colors.textSecondary} />
            <Text style={styles.placeholderText}>Map View</Text>
            <Text style={styles.placeholderSubtext}>
              Interactive map with satellite imagery, topographic lines, and property boundaries
            </Text>
          </View>

          <Pressable style={styles.addButton} onPress={handleAddLandmark}>
            <IconSymbol name="plus.circle.fill" size={24} color="#ffffff" />
            <Text style={styles.addButtonText}>Add Landmark</Text>
          </Pressable>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Map Features</Text>
            <FeatureItem icon="map.fill" text="High-resolution satellite imagery" />
            <FeatureItem icon="mountain.2.fill" text="Topographic contour lines" />
            <FeatureItem icon="square.dashed" text="BLM and National Forest boundaries" />
            <FeatureItem icon="house.fill" text="Private property lines" />
            <FeatureItem icon="figure.walk" text="Trail overlays from OpenStreetMap" />
            <FeatureItem icon="mappin.circle.fill" text="Custom markers with privacy controls" />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Landmarks ({landmarks.length})</Text>
            {landmarks.map((landmark) => (
              <View key={landmark.id} style={styles.landmarkCard}>
                <View style={styles.landmarkHeader}>
                  <IconSymbol
                    name={getLandmarkIcon(landmark.category) as any}
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
                  <Text style={styles.landmarkCategory}>{landmark.category}</Text>
                  <Text style={styles.landmarkCoords}>
                    {landmark.coordinates.latitude.toFixed(4)}, {landmark.coordinates.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
            ))}
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

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <IconSymbol name={icon as any} size={20} color={colors.primary} />
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
    minHeight: 250,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
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
  headerButton: {
    padding: 4,
  },
  headerButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginRight: 8,
  },
});
