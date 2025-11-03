
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import React, { useState } from 'react';
import { colors } from '@/styles/commonStyles';
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
  const [visibility, setVisibility] = useState<LandmarkVisibility>('only-me');
  const [category, setCategory] = useState('other');

  const categories = [
    { id: 'fishing-spot', label: 'Fishing Spot', icon: 'fish.fill' },
    { id: 'hunting-area', label: 'Hunting Area', icon: 'scope' },
    { id: 'camping', label: 'Camping', icon: 'tent.fill' },
    { id: 'trail', label: 'Trail', icon: 'figure.hiking' },
    { id: 'viewpoint', label: 'Viewpoint', icon: 'eye.fill' },
    { id: 'other', label: 'Other', icon: 'mappin.circle.fill' },
  ];

  const visibilityOptions = [
    { id: 'only-me', label: 'Only Me', icon: 'lock.fill', description: 'Private to you' },
    { id: 'followers', label: 'Followers', icon: 'person.2.fill', description: 'Visible to followers' },
    { id: 'public', label: 'Public', icon: 'globe', description: 'Visible to everyone' },
  ];

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your landmark');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      visibility,
      category,
    });

    setTitle('');
    setDescription('');
    setVisibility('only-me');
    setCategory('other');
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setVisibility('only-me');
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Landmark</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Secret Fishing Hole"
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add details about this location..."
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={[
                      styles.categoryButton,
                      category === cat.id && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <IconSymbol
                      name={cat.icon as any}
                      size={24}
                      color={category === cat.id ? '#ffffff' : colors.text}
                    />
                    <Text
                      style={[
                        styles.categoryLabel,
                        category === cat.id && styles.categoryLabelActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Visibility</Text>
              {visibilityOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.visibilityOption,
                    visibility === option.id && styles.visibilityOptionActive,
                  ]}
                  onPress={() => setVisibility(option.id as LandmarkVisibility)}
                >
                  <View style={styles.visibilityLeft}>
                    <IconSymbol
                      name={option.icon as any}
                      size={24}
                      color={visibility === option.id ? colors.primary : colors.textSecondary}
                    />
                    <View style={styles.visibilityText}>
                      <Text
                        style={[
                          styles.visibilityLabel,
                          visibility === option.id && styles.visibilityLabelActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text style={styles.visibilityDescription}>{option.description}</Text>
                    </View>
                  </View>
                  {visibility === option.id && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>

            <View style={styles.coordinatesInfo}>
              <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
              <Text style={styles.coordinatesText}>
                Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
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
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
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
    paddingTop: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: '#ffffff',
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  visibilityOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
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
    marginBottom: 2,
  },
  visibilityLabelActive: {
    color: colors.primary,
  },
  visibilityDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  coordinatesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginTop: 8,
  },
  coordinatesText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
