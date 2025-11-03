
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
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Stack, useRouter } from 'expo-router';
import { mockGearRecommendations } from '@/data/mockGearRecommendations';
import { ActivityType } from '@/types/Post';
import { GearItem } from '@/types/GearRecommendation';

export default function GearScreen() {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('hiking');
  const [showActivityPicker, setShowActivityPicker] = useState(false);

  const handleMapPress = () => {
    router.push('/(tabs)/map');
  };

  const handleTrackMilesPress = () => {
    router.push('/(tabs)/profile');
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
      <Pressable style={styles.trackMilesButtonIOS} onPress={handleTrackMilesPress}>
        <IconSymbol name="figure.run" color={colors.primary} size={20} />
      </Pressable>
    </View>
  );

  const currentRecommendation = mockGearRecommendations.find(
    (rec) => rec.activity === selectedActivity
  ) || mockGearRecommendations[0];

  const essentialItems = currentRecommendation.items.filter(item => item.priority === 'essential');
  const recommendedItems = currentRecommendation.items.filter(item => item.priority === 'recommended');
  const optionalItems = currentRecommendation.items.filter(item => item.priority === 'optional');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'essential': return colors.secondary;
      case 'recommended': return colors.accent;
      case 'optional': return colors.primary;
      default: return colors.textSecondary;
    }
  };

  const renderGearItem = (item: GearItem) => (
    <View key={item.id} style={styles.gearCard}>
      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
        <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
      </View>
      <View style={styles.gearHeader}>
        <IconSymbol name={item.icon as any} size={32} color={colors.primary} />
        <View style={styles.gearInfo}>
          <Text style={styles.gearName}>{item.name}</Text>
          <Text style={styles.gearCategory}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.gearDescription}>{item.description}</Text>
    </View>
  );

  const activities: { value: ActivityType; label: string }[] = [
    { value: 'hiking', label: 'Hiking' },
    { value: 'fishing', label: 'Fishing' },
    { value: 'camping', label: 'Camping' },
    { value: 'hunting', label: 'Hunting' },
    { value: 'kayaking', label: 'Kayaking' },
    { value: 'mountain-biking', label: 'Mountain Biking' },
  ];

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Gear Guide',
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
              <View style={styles.topLeft}>
                <Pressable style={styles.topButton} onPress={handleMapPress}>
                  <IconSymbol name="map.fill" color={colors.text} size={24} />
                </Pressable>
                <Pressable style={styles.trackMilesButton} onPress={handleTrackMilesPress}>
                  <IconSymbol name="figure.run" color="#ffffff" size={20} />
                  <Text style={styles.trackMilesText}>Track Miles</Text>
                </Pressable>
              </View>
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
            <Text style={styles.title}>Gear Recommendations</Text>
            <Text style={styles.subtitle}>
              Smart gear suggestions based on your activity and conditions
            </Text>
          </View>

          <Pressable
            style={styles.activitySelector}
            onPress={() => setShowActivityPicker(true)}
          >
            <Text style={styles.activityLabel}>Activity Type</Text>
            <View style={styles.activityValue}>
              <Text style={styles.activityText}>
                {activities.find(a => a.value === selectedActivity)?.label}
              </Text>
              <IconSymbol name="chevron.down" size={20} color={colors.textSecondary} />
            </View>
          </Pressable>

          <View style={styles.weatherInfo}>
            <IconSymbol name="cloud.sun.fill" size={24} color={colors.accent} />
            <Text style={styles.weatherText}>
              Recommendations for {currentRecommendation.weather} weather
            </Text>
          </View>

          {essentialItems.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.secondary} />
                <Text style={styles.sectionTitle}>Essential Gear</Text>
              </View>
              {essentialItems.map(renderGearItem)}
            </View>
          )}

          {recommendedItems.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="star.fill" size={24} color={colors.accent} />
                <Text style={styles.sectionTitle}>Recommended Gear</Text>
              </View>
              {recommendedItems.map(renderGearItem)}
            </View>
          )}

          {optionalItems.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
                <Text style={styles.sectionTitle}>Optional Gear</Text>
              </View>
              {optionalItems.map(renderGearItem)}
            </View>
          )}

          <View style={styles.infoCard}>
            <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
            <Text style={styles.infoText}>
              Gear recommendations are based on activity type, weather conditions, and difficulty level. 
              Always check local regulations and conditions before heading out.
            </Text>
          </View>
        </ScrollView>

        <Modal
          visible={showActivityPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowActivityPicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowActivityPicker(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Activity</Text>
              <ScrollView>
                {activities.map((activity) => (
                  <Pressable
                    key={activity.value}
                    style={[
                      styles.activityOption,
                      selectedActivity === activity.value && styles.activityOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedActivity(activity.value);
                      setShowActivityPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.activityOptionText,
                        selectedActivity === activity.value && styles.activityOptionTextSelected,
                      ]}
                    >
                      {activity.label}
                    </Text>
                    {selectedActivity === activity.value && (
                      <IconSymbol name="checkmark" size={20} color={colors.primary} />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topLeft: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  topButton: {
    padding: 8,
  },
  topRight: {
    flexDirection: 'row',
    gap: 8,
  },
  trackMilesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackMilesText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  trackMilesButtonIOS: {
    padding: 4,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  activitySelector: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  activityLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  activityValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  weatherText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
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
  gearCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  priorityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  gearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  gearInfo: {
    flex: 1,
  },
  gearName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  gearCategory: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  gearDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.card,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  activityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  activityOptionSelected: {
    backgroundColor: colors.primary + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  activityOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  activityOptionTextSelected: {
    fontWeight: '600',
    color: colors.primary,
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
