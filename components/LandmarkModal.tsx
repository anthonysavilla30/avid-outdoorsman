
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';
import { LandmarkVisibility } from '@/types/Landmark';

interface LandmarkModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (landmark: {
    title: string;
    description: string;
    visibility: LandmarkVisibility;
    category: string;
  }) => void;
  latitude: number;
  longitude: number;
}

export default function LandmarkModal({
  visible,
  onClose,
  onSave,
  latitude,
  longitude,
}: LandmarkModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<LandmarkVisibility>('followers');
  const [category, setCategory] = useState<string>('other');

  const categories = [
    { value: 'trail', label: 'Trail', icon: 'figure.hiking' },
    { value: 'fishing-spot', label: 'Fishing', icon: 'figure.fishing' },
    { value: 'camping', label: 'Camping', icon: 'tent.fill' },
    { value: 'hunting-area', label: 'Hunting', icon: 'scope' },
    { value: 'viewpoint', label: 'Viewpoint', icon: 'eye.fill' },
    { value: 'other', label: 'Other', icon: 'mappin.circle.fill' },
  ];

  const visibilityOptions = [
    {
      value: 'only-me' as LandmarkVisibility,
      label: 'Only Me',
      icon: 'lock.fill',
      description: 'Only you can see this landmark',
    },
    {
      value: 'followers' as LandmarkVisibility,
      label: 'Followers',
      icon: 'person.2.fill',
      description: 'Your followers can see this',
    },
    {
      value: 'public' as LandmarkVisibility,
      label: 'Public',
      icon: 'globe',
      description: 'Everyone can see this',
    },
  ];

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please add a title for your landmark.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      visibility,
      category,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setVisibility('followers');
    setCategory('other');
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setVisibility('followers');
    setCategory('other');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Landmark</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Location Info */}
            <View style={styles.locationInfo}>
              <IconSymbol name="mappin.circle.fill" size={20} color={colors.primary} />
              <Text style={styles.locationText}>
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </Text>
            </View>

            {/* Title */}
            <View style={styles.section}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Secret Fishing Hole"
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add details about this location..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
              />
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <Pressable
                    key={cat.value}
                    style={[
                      styles.categoryButton,
                      category === cat.value && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategory(cat.value)}
                  >
                    <IconSymbol
                      name={cat.icon as any}
                      size={24}
                      color={category === cat.value ? '#ffffff' : colors.primary}
                    />
                    <Text
                      style={[
                        styles.categoryLabel,
                        category === cat.value && styles.categoryLabelActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Visibility */}
            <View style={styles.section}>
              <Text style={styles.label}>Who can see this?</Text>
              {visibilityOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.visibilityOption,
                    visibility === option.value && styles.visibilityOptionActive,
                  ]}
                  onPress={() => setVisibility(option.value)}
                >
                  <View style={styles.visibilityLeft}>
                    <IconSymbol
                      name={option.icon as any}
                      size={24}
                      color={visibility === option.value ? colors.primary : colors.textSecondary}
                    />
                    <View style={styles.visibilityText}>
                      <Text
                        style={[
                          styles.visibilityLabel,
                          visibility === option.value && styles.visibilityLabelActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text style={styles.visibilityDescription}>{option.description}</Text>
                    </View>
                  </View>
                  {visibility === option.value && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Landmark</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: '30%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  categoryLabelActive: {
    color: '#ffffff',
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  visibilityOptionActive: {
    borderColor: colors.primary,
  },
  visibilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  visibilityText: {
    flex: 1,
  },
  visibilityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  visibilityLabelActive: {
    color: colors.primary,
  },
  visibilityDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
