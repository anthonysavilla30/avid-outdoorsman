
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { ActivityType } from '@/types/Post';

export default function CreatePostScreen() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('fishing');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [weather, setWeather] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'moderate' | 'hard'>('moderate');
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);

  const activities: { type: ActivityType; icon: string; label: string }[] = [
    { type: 'hunting', icon: 'scope', label: 'Hunting' },
    { type: 'fishing', icon: 'figure.fishing', label: 'Angling' },
    { type: 'hiking', icon: 'figure.hiking', label: 'Hiking' },
    { type: 'camping', icon: 'tent.fill', label: 'Camping' },
    { type: 'kayaking', icon: 'water.waves', label: 'Kayaking' },
    { type: 'mountain-biking', icon: 'bicycle', label: 'Mountain Biking' },
    { type: 'overlanding', icon: 'car.fill', label: 'Overlanding' },
    { type: 'backpacking', icon: 'backpack.fill', label: 'Backpacking' },
    { type: 'rock-climbing', icon: 'figure.climbing', label: 'Rock Climbing' },
    { type: 'trail-running', icon: 'figure.run', label: 'Trail Running' },
    { type: 'wildlife-photography', icon: 'camera.fill', label: 'Wildlife Photography' },
    { type: 'foraging', icon: 'leaf.fill', label: 'Foraging' },
    { type: 'off-roading', icon: 'car.2.fill', label: 'Off-Roading' },
    { type: 'canoeing', icon: 'water.waves', label: 'Canoeing' },
    { type: 'paddleboarding', icon: 'figure.surfing', label: 'Stand-Up Paddleboarding' },
    { type: 'snowshoeing', icon: 'snowflake', label: 'Snowshoeing' },
    { type: 'cross-country-skiing', icon: 'figure.skiing.crosscountry', label: 'Cross-Country Skiing' },
  ];

  const selectedActivityData = activities.find(a => a.type === selectedActivity) || activities[0];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages([...selectedImages, ...newImages].slice(0, 5));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets) {
      setSelectedImages([...selectedImages, result.assets[0].uri].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    if (!content.trim()) {
      Alert.alert('Content required', 'Please add some content to your post.');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Location required', 'Please add a location for your post.');
      return;
    }

    // Here you would normally save the post to your backend
    console.log('Creating post:', {
      content,
      activity: selectedActivity,
      location,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      images: selectedImages,
      weather,
      difficulty,
    });

    Alert.alert('Success', 'Your post has been created!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Post',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.headerButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={handlePost} style={styles.headerButton}>
              <Text style={styles.postText}>Post</Text>
            </Pressable>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Activity Type Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Activity Type</Text>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setShowActivityDropdown(true)}
            >
              <View style={styles.dropdownContent}>
                <IconSymbol
                  name={selectedActivityData.icon as any}
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.dropdownText}>{selectedActivityData.label}</Text>
              </View>
              <IconSymbol name="chevron.down" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.section}>
            <Text style={styles.label}>What&apos;s happening?</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Share conditions, tips, or your experience..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
            />
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputContainer}>
              <IconSymbol name="mappin.circle.fill" size={20} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Silver Creek, Eagle Peak Trail"
                placeholderTextColor={colors.textSecondary}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* Images */}
          <View style={styles.section}>
            <Text style={styles.label}>Photos ({selectedImages.length}/5)</Text>
            <View style={styles.imageSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.imageList}>
                  {selectedImages.map((uri, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Image source={{ uri }} style={styles.image} />
                      <Pressable
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <IconSymbol name="xmark.circle.fill" size={24} color="#ffffff" />
                      </Pressable>
                    </View>
                  ))}
                  {selectedImages.length < 5 && (
                    <>
                      <Pressable style={styles.addImageButton} onPress={pickImage}>
                        <IconSymbol name="photo" size={32} color={colors.primary} />
                        <Text style={styles.addImageText}>Gallery</Text>
                      </Pressable>
                      <Pressable style={styles.addImageButton} onPress={takePhoto}>
                        <IconSymbol name="camera.fill" size={32} color={colors.primary} />
                        <Text style={styles.addImageText}>Camera</Text>
                      </Pressable>
                    </>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Conditions */}
          <View style={styles.section}>
            <Text style={styles.label}>Conditions</Text>
            
            <View style={styles.inputContainer}>
              <IconSymbol name="cloud.sun.fill" size={20} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Weather (e.g., Sunny, Overcast)"
                placeholderTextColor={colors.textSecondary}
                value={weather}
                onChangeText={setWeather}
              />
            </View>

            <Text style={[styles.label, styles.labelSmall]}>Difficulty</Text>
            <View style={styles.difficultyButtons}>
              {(['easy', 'moderate', 'hard'] as const).map((level) => (
                <Pressable
                  key={level}
                  style={[
                    styles.difficultyButton,
                    difficulty === level && styles.difficultyButtonActive,
                  ]}
                  onPress={() => setDifficulty(level)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      difficulty === level && styles.difficultyTextActive,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.inputContainer}>
              <IconSymbol name="tag.fill" size={20} color={colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Separate with commas (e.g., trout, fly-fishing)"
                placeholderTextColor={colors.textSecondary}
                value={tags}
                onChangeText={setTags}
              />
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Activity Dropdown Modal */}
        <Modal
          visible={showActivityDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowActivityDropdown(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowActivityDropdown(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Activity Type</Text>
                <Pressable onPress={() => setShowActivityDropdown(false)}>
                  <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
                </Pressable>
              </View>
              <ScrollView style={styles.modalScroll}>
                {activities.map((activity) => (
                  <Pressable
                    key={activity.type}
                    style={[
                      styles.activityOption,
                      selectedActivity === activity.type && styles.activityOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedActivity(activity.type);
                      setShowActivityDropdown(false);
                    }}
                  >
                    <View style={styles.activityOptionContent}>
                      <IconSymbol
                        name={activity.icon as any}
                        size={28}
                        color={selectedActivity === activity.type ? colors.primary : colors.text}
                      />
                      <Text
                        style={[
                          styles.activityOptionText,
                          selectedActivity === activity.type && styles.activityOptionTextActive,
                        ]}
                      >
                        {activity.label}
                      </Text>
                    </View>
                    {selectedActivity === activity.type && (
                      <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
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
  scrollContent: {
    padding: 16,
  },
  headerButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  postText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
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
  labelSmall: {
    fontSize: 14,
    marginTop: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  contentInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  imageSection: {
    marginTop: 8,
  },
  imageList: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  addImageButton: {
    width: 120,
    height: 120,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addImageText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  difficultyButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  difficultyTextActive: {
    color: '#ffffff',
  },
  bottomPadding: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    boxShadow: `0px 4px 16px ${colors.shadow}`,
    elevation: 5,
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  modalScroll: {
    maxHeight: 400,
  },
  activityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityOptionActive: {
    backgroundColor: colors.primary + '10',
  },
  activityOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  activityOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  activityOptionTextActive: {
    fontWeight: '700',
    color: colors.primary,
  },
});
