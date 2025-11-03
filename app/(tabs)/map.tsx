
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function MapScreen() {
  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Map',
            headerLargeTitle: false,
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

          <View style={styles.comingSoonBadge}>
            <IconSymbol name="clock" size={20} color={colors.accent} />
            <Text style={styles.comingSoonText}>
              Maps will be available in a future update
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
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
});
