
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
  Modal,
  TextInput,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Stack, useRouter } from 'expo-router';
import { mockRegulations } from '@/data/mockRegulations';
import { Regulation, ActivityCategory, Season } from '@/types/Regulation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 120,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  stateButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  stateButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stateButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  stateButtonTextActive: {
    color: '#FFFFFF',
  },
  regulationCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  regulationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  regulationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  seasonCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  seasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  speciesName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  dateRange: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  seasonDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  seasonDetailText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 8,
  },
  seasonNotes: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  ruleText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 12,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  stateScrollContainer: {
    marginBottom: 12,
  },
  stateScrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default function RegulationsScreen() {
  const [selectedState, setSelectedState] = useState<string>('Colorado');
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all');
  const router = useRouter();

  const states = ['Colorado', 'Montana', 'Wyoming', 'Idaho', 'Utah'];

  const filteredRegulations = mockRegulations.filter((reg) => {
    const stateMatch = selectedState === 'all' || reg.state === selectedState;
    const categoryMatch = selectedCategory === 'all' || reg.category === selectedCategory;
    return stateMatch && categoryMatch;
  });

  const handleMapPress = () => {
    router.push('/(tabs)/map');
  };

  const handleTrackMilesPress = () => {
    console.log('Track miles pressed');
  };

  const handleMessagesPress = () => {
    router.push('/(tabs)/messages');
  };

  const handleNotificationsPress = () => {
    router.push('/(tabs)/notifications');
  };

  const renderHeaderRight = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Pressable onPress={handleTrackMilesPress}>
        <IconSymbol name="figure.walk" size={24} color={colors.text} />
      </Pressable>
      <Pressable onPress={handleMapPress}>
        <IconSymbol name="map" size={24} color={colors.text} />
      </Pressable>
      <Pressable onPress={handleMessagesPress}>
        <IconSymbol name="message" size={24} color={colors.text} />
      </Pressable>
      <Pressable onPress={handleNotificationsPress}>
        <IconSymbol name="bell" size={24} color={colors.text} />
      </Pressable>
    </View>
  );

  const renderHeaderLeft = () => (
    <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
      Regulations
    </Text>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderSeason = (season: Season) => (
    <View key={season.id} style={styles.seasonCard}>
      <View style={styles.seasonHeader}>
        <Text style={styles.speciesName}>{season.species}</Text>
        <Text style={styles.dateRange}>
          {formatDate(season.startDate)} - {formatDate(season.endDate)}
        </Text>
      </View>
      <View style={styles.seasonDetail}>
        <IconSymbol name="target" size={16} color={colors.primary} />
        <Text style={styles.seasonDetailText}>Bag Limit: {season.bagLimit}</Text>
      </View>
      <View style={styles.seasonDetail}>
        <IconSymbol name="bag" size={16} color={colors.primary} />
        <Text style={styles.seasonDetailText}>
          Possession: {season.possessionLimit}
        </Text>
      </View>
      {season.zones && season.zones.length > 0 && (
        <View style={styles.seasonDetail}>
          <IconSymbol name="map" size={16} color={colors.primary} />
          <Text style={styles.seasonDetailText}>Zones: {season.zones.join(', ')}</Text>
        </View>
      )}
      {season.notes && (
        <Text style={styles.seasonNotes}>{season.notes}</Text>
      )}
    </View>
  );

  const renderRegulation = (regulation: Regulation) => (
    <View key={regulation.id} style={styles.regulationCard}>
      <View style={styles.regulationHeader}>
        <Text style={styles.regulationTitle}>{regulation.state}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{regulation.category}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Seasons</Text>
      {regulation.seasons.map(renderSeason)}

      <Text style={styles.sectionTitle}>License Requirements</Text>
      {regulation.licenseRequirements.map((req, index) => (
        <View key={index} style={styles.requirementItem}>
          <IconSymbol name="checkmark.circle.fill" size={16} color={colors.primary} />
          <Text style={styles.requirementText}>{req}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Special Rules</Text>
      {regulation.specialRules.map((rule, index) => (
        <View key={index} style={styles.ruleItem}>
          <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#FFA500" />
          <Text style={styles.ruleText}>{rule}</Text>
        </View>
      ))}

      <Text style={styles.lastUpdated}>
        Last updated: {new Date(regulation.lastUpdated).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: renderHeaderLeft,
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Hunting & Fishing Regulations</Text>
          <Text style={styles.subtitle}>
            Season dates, bag limits, and licensing requirements
          </Text>
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Activity Type</Text>
          <View style={styles.filterRow}>
            <Pressable
              style={[
                styles.filterButton,
                selectedCategory === 'all' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === 'all' && styles.filterButtonTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterButton,
                selectedCategory === 'hunting' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedCategory('hunting')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === 'hunting' && styles.filterButtonTextActive,
                ]}
              >
                Hunting
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterButton,
                selectedCategory === 'fishing' && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedCategory('fishing')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === 'fishing' && styles.filterButtonTextActive,
                ]}
              >
                Fishing
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>State</Text>
          <View style={styles.stateScrollContainer}>
            <View style={styles.stateScrollContent}>
              {states.map((state) => (
                <Pressable
                  key={state}
                  style={[
                    styles.stateButton,
                    selectedState === state && styles.stateButtonActive,
                  ]}
                  onPress={() => setSelectedState(state)}
                >
                  <Text
                    style={[
                      styles.stateButtonText,
                      selectedState === state && styles.stateButtonTextActive,
                    ]}
                  >
                    {state}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {filteredRegulations.length > 0 ? (
          filteredRegulations.map(renderRegulation)
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="doc.text.magnifyingglass" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              No regulations found for selected filters
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
