
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockMapRegions } from '@/data/mockOfflineMaps';
import { MapRegion } from '@/types/OfflineMap';

export default function OfflineMapsScreen() {
  const router = useRouter();
  const [regions, setRegions] = useState<MapRegion[]>(mockMapRegions);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDownload = (regionId: string) => {
    setRegions(prev => prev.map(region => {
      if (region.id === regionId) {
        return { ...region, status: 'downloading', progress: 0 };
      }
      return region;
    }));

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setRegions(prev => prev.map(region => {
        if (region.id === regionId) {
          if (progress >= 100) {
            clearInterval(interval);
            return {
              ...region,
              status: 'downloaded',
              progress: 100,
              downloadDate: new Date(),
            };
          }
          return { ...region, progress };
        }
        return region;
      }));
    }, 500);
  };

  const handleDelete = (regionId: string) => {
    Alert.alert(
      'Delete Map',
      'Are you sure you want to delete this offline map?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setRegions(prev => prev.map(region => {
              if (region.id === regionId) {
                return {
                  ...region,
                  status: 'available',
                  progress: undefined,
                  downloadDate: undefined,
                };
              }
              return region;
            }));
          },
        },
      ]
    );
  };

  const filteredRegions = regions.filter(region =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadedRegions = filteredRegions.filter(r => r.status === 'downloaded');
  const availableRegions = filteredRegions.filter(r => r.status === 'available');
  const downloadingRegions = filteredRegions.filter(r => r.status === 'downloading');

  const totalSize = downloadedRegions.reduce((sum, r) => sum + (r.size || 0), 0);

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

  const renderRegion = (region: MapRegion) => (
    <View key={region.id} style={styles.regionCard}>
      <View style={styles.regionHeader}>
        <View style={styles.regionInfo}>
          <Text style={styles.regionName}>{region.name}</Text>
          <Text style={styles.regionSize}>{region.size} MB</Text>
        </View>
        <View style={styles.regionActions}>
          {region.status === 'available' && (
            <Pressable
              style={styles.downloadButton}
              onPress={() => handleDownload(region.id)}
            >
              <IconSymbol name="arrow.down.circle.fill" color={colors.primary} size={32} />
            </Pressable>
          )}
          {region.status === 'downloading' && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>{region.progress}%</Text>
            </View>
          )}
          {region.status === 'downloaded' && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDelete(region.id)}
            >
              <IconSymbol name="trash.fill" color={colors.secondary} size={28} />
            </Pressable>
          )}
        </View>
      </View>
      {region.status === 'downloading' && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${region.progress}%` }]} />
        </View>
      )}
      {region.status === 'downloaded' && region.downloadDate && (
        <Text style={styles.downloadDate}>
          Downloaded {new Date(region.downloadDate).toLocaleDateString()}
        </Text>
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Offline Maps',
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
          {/* Storage Info */}
          <View style={styles.storageCard}>
            <View style={styles.storageHeader}>
              <IconSymbol name="internaldrive.fill" color={colors.primary} size={32} />
              <View style={styles.storageInfo}>
                <Text style={styles.storageTitle}>Storage Used</Text>
                <Text style={styles.storageSize}>{totalSize.toFixed(0)} MB</Text>
              </View>
            </View>
            <Text style={styles.storageSubtext}>
              {downloadedRegions.length} map{downloadedRegions.length !== 1 ? 's' : ''} downloaded
            </Text>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search regions..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <IconSymbol name="info.circle.fill" color={colors.accent} size={24} />
            <Text style={styles.infoBannerText}>
              Download maps for offline use when you&apos;re in areas without cell service
            </Text>
          </View>

          {/* Downloading */}
          {downloadingRegions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Downloading</Text>
              {downloadingRegions.map(renderRegion)}
            </View>
          )}

          {/* Downloaded Maps */}
          {downloadedRegions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Downloaded Maps</Text>
              {downloadedRegions.map(renderRegion)}
            </View>
          )}

          {/* Available Maps */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Maps</Text>
            {availableRegions.length > 0 ? (
              availableRegions.map(renderRegion)
            ) : (
              <Text style={styles.emptyText}>No maps available</Text>
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
  content: {
    padding: 16,
    paddingBottom: 16,
  },
  contentWithTabBar: {
    paddingBottom: 100,
  },
  storageCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  storageInfo: {
    flex: 1,
  },
  storageTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  storageSize: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  storageSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  regionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionInfo: {
    flex: 1,
  },
  regionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  regionSize: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  regionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  downloadButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  progressContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  downloadDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 24,
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
