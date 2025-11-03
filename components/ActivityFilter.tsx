
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { ActivityType } from '@/types/Post';
import { IconSymbol } from './IconSymbol';

interface ActivityFilterProps {
  selectedActivity: ActivityType;
  onSelectActivity: (activity: ActivityType) => void;
}

const activities: { type: ActivityType; label: string; icon: string }[] = [
  { type: 'all', label: 'All', icon: 'square.grid.2x2' },
  { type: 'hunting', label: 'Hunting', icon: 'scope' },
  { type: 'fishing', label: 'Fishing', icon: 'figure.fishing' },
  { type: 'hiking', label: 'Hiking', icon: 'figure.hiking' },
  { type: 'camping', label: 'Camping', icon: 'tent' },
];

export default function ActivityFilter({ selectedActivity, onSelectActivity }: ActivityFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {activities.map((activity) => {
        const isSelected = selectedActivity === activity.type;
        return (
          <Pressable
            key={activity.type}
            style={[styles.filterButton, isSelected && styles.filterButtonActive]}
            onPress={() => onSelectActivity(activity.type)}
          >
            <IconSymbol
              name={activity.icon as any}
              size={20}
              color={isSelected ? '#ffffff' : colors.text}
            />
            <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
              {activity.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterTextActive: {
    color: '#ffffff',
  },
});
