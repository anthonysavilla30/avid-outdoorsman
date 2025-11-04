
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';
import { AdvancedFilter, defaultFilter } from '@/types/Filter';
import { ActivityType } from '@/types/Post';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AdvancedFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filter: AdvancedFilter;
  onApply: (filter: AdvancedFilter) => void;
  availableTags: string[];
  availableWeather: string[];
}

export default function AdvancedFilterModal({
  visible,
  onClose,
  filter,
  onApply,
  availableTags,
  availableWeather,
}: AdvancedFilterModalProps) {
  const [localFilter, setLocalFilter] = useState<AdvancedFilter>(filter);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const activities: ActivityType[] = [
    'hunting',
    'fishing',
    'hiking',
    'camping',
    'kayaking',
    'mountain-biking',
    'overlanding',
    'backpacking',
  ];

  const difficulties = ['easy', 'moderate', 'hard'];
  const sortOptions: AdvancedFilter['sortBy'][] = ['recent', 'popular', 'distance', 'relevant'];

  const handleApply = () => {
    onApply(localFilter);
    onClose();
  };

  const handleReset = () => {
    setLocalFilter(defaultFilter);
  };

  const toggleActivity = (activity: ActivityType) => {
    setLocalFilter(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity],
    }));
  };

  const toggleDifficulty = (difficulty: 'easy' | 'moderate' | 'hard') => {
    setLocalFilter(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(difficulty)
        ? prev.difficulty.filter(d => d !== difficulty)
        : [...prev.difficulty, difficulty],
    }));
  };

  const toggleWeather = (weather: string) => {
    setLocalFilter(prev => ({
      ...prev,
      weather: prev.weather.includes(weather)
        ? prev.weather.filter(w => w !== weather)
        : [...prev.weather, weather],
    }));
  };

  const toggleTag = (tag: string) => {
    setLocalFilter(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" color={colors.text} size={24} />
          </Pressable>
          <Text style={styles.title}>Advanced Filters</Text>
          <Pressable onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Activities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activities</Text>
            <View style={styles.chipContainer}>
              {activities.map(activity => (
                <Pressable
                  key={activity}
                  style={[
                    styles.chip,
                    localFilter.activities.includes(activity) && styles.chipActive,
                  ]}
                  onPress={() => toggleActivity(activity)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      localFilter.activities.includes(activity) && styles.chipTextActive,
                    ]}
                  >
                    {activity.charAt(0).toUpperCase() + activity.slice(1).replace('-', ' ')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Radius */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Radius: {localFilter.radius} miles</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>5</Text>
              <View style={styles.sliderTrack}>
                <View 
                  style={[
                    styles.sliderFill, 
                    { width: `${(localFilter.radius / 100) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.sliderLabel}>100</Text>
            </View>
            <View style={styles.radiusButtons}>
              {[10, 25, 50, 100].map(radius => (
                <Pressable
                  key={radius}
                  style={[
                    styles.radiusButton,
                    localFilter.radius === radius && styles.radiusButtonActive,
                  ]}
                  onPress={() => setLocalFilter(prev => ({ ...prev, radius }))}
                >
                  <Text
                    style={[
                      styles.radiusButtonText,
                      localFilter.radius === radius && styles.radiusButtonTextActive,
                    ]}
                  >
                    {radius}mi
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Date Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date Range</Text>
            <View style={styles.dateContainer}>
              <Pressable
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateLabel}>From</Text>
                <Text style={styles.dateValue}>
                  {localFilter.dateRange.start
                    ? localFilter.dateRange.start.toLocaleDateString()
                    : 'Any date'}
                </Text>
              </Pressable>
              <Pressable
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateLabel}>To</Text>
                <Text style={styles.dateValue}>
                  {localFilter.dateRange.end
                    ? localFilter.dateRange.end.toLocaleDateString()
                    : 'Any date'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Difficulty */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Difficulty</Text>
            <View style={styles.chipContainer}>
              {difficulties.map(difficulty => (
                <Pressable
                  key={difficulty}
                  style={[
                    styles.chip,
                    localFilter.difficulty.includes(difficulty as any) && styles.chipActive,
                  ]}
                  onPress={() => toggleDifficulty(difficulty as any)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      localFilter.difficulty.includes(difficulty as any) && styles.chipTextActive,
                    ]}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Weather */}
          {availableWeather.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weather</Text>
              <View style={styles.chipContainer}>
                {availableWeather.map(weather => (
                  <Pressable
                    key={weather}
                    style={[
                      styles.chip,
                      localFilter.weather.includes(weather) && styles.chipActive,
                    ]}
                    onPress={() => toggleWeather(weather)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        localFilter.weather.includes(weather) && styles.chipTextActive,
                      ]}
                    >
                      {weather}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Crowded */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Crowd Level</Text>
            <View style={styles.chipContainer}>
              <Pressable
                style={[
                  styles.chip,
                  localFilter.crowded === false && styles.chipActive,
                ]}
                onPress={() => setLocalFilter(prev => ({ ...prev, crowded: false }))}
              >
                <Text
                  style={[
                    styles.chipText,
                    localFilter.crowded === false && styles.chipTextActive,
                  ]}
                >
                  Not Crowded
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.chip,
                  localFilter.crowded === true && styles.chipActive,
                ]}
                onPress={() => setLocalFilter(prev => ({ ...prev, crowded: true }))}
              >
                <Text
                  style={[
                    styles.chipText,
                    localFilter.crowded === true && styles.chipTextActive,
                  ]}
                >
                  Crowded
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.chip,
                  localFilter.crowded === null && styles.chipActive,
                ]}
                onPress={() => setLocalFilter(prev => ({ ...prev, crowded: null }))}
              >
                <Text
                  style={[
                    styles.chipText,
                    localFilter.crowded === null && styles.chipTextActive,
                  ]}
                >
                  Any
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Tags */}
          {availableTags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.chipContainer}>
                {availableTags.slice(0, 15).map(tag => (
                  <Pressable
                    key={tag}
                    style={[
                      styles.chip,
                      localFilter.tags.includes(tag) && styles.chipActive,
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        localFilter.tags.includes(tag) && styles.chipTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Min Likes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minimum Likes</Text>
            <TextInput
              style={styles.input}
              value={localFilter.minLikes.toString()}
              onChangeText={text => {
                const value = parseInt(text) || 0;
                setLocalFilter(prev => ({ ...prev, minLikes: value }));
              }}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Has Images */}
          <View style={styles.section}>
            <Pressable
              style={styles.checkboxRow}
              onPress={() =>
                setLocalFilter(prev => ({ ...prev, hasImages: !prev.hasImages }))
              }
            >
              <View style={[styles.checkbox, localFilter.hasImages && styles.checkboxActive]}>
                {localFilter.hasImages && (
                  <IconSymbol name="checkmark" color="#ffffff" size={16} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Only show posts with images</Text>
            </Pressable>
          </View>

          {/* Sort By */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort By</Text>
            <View style={styles.chipContainer}>
              {sortOptions.map(option => (
                <Pressable
                  key={option}
                  style={[
                    styles.chip,
                    localFilter.sortBy === option && styles.chipActive,
                  ]}
                  onPress={() => setLocalFilter(prev => ({ ...prev, sortBy: option }))}
                >
                  <Text
                    style={[
                      styles.chipText,
                      localFilter.sortBy === option && styles.chipTextActive,
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </Pressable>
        </View>

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={localFilter.dateRange.start || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartDatePicker(false);
              if (date) {
                setLocalFilter(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: date },
                }));
              }
            }}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={localFilter.dateRange.end || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndDatePicker(false);
              if (date) {
                setLocalFilter(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: date },
                }));
              }
            }}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  resetButton: {
    padding: 4,
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextActive: {
    color: '#ffffff',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  radiusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  radiusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  radiusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  radiusButtonTextActive: {
    color: '#ffffff',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.text,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
