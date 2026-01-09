
import { IconSymbol } from '@/components/IconSymbol';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: 160,
    height: 120,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginRight: 12,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Hunting', icon: 'nature-people', count: '1.2k posts', color: '#8B4513' },
    { name: 'Fishing', icon: 'water', count: '2.5k posts', color: '#1E90FF' },
    { name: 'Hiking', icon: 'hiking', count: '3.1k posts', color: '#228B22' },
    { name: 'Camping', icon: 'camping', count: '1.8k posts', color: '#FF8C00' },
    { name: 'Skiing', icon: 'downhill-skiing', count: '890 posts', color: '#4169E1' },
    { name: 'Biking', icon: 'directions-bike', count: '1.5k posts', color: '#DC143C' },
  ];

  const handleMapPress = () => {
    console.log('Navigating to map from Explore screen');
    router.push('/(tabs)/map');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Explore',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerLeft: () => (
            <Pressable 
              onPress={handleMapPress} 
              style={{ 
                marginLeft: Platform.OS === 'ios' ? 0 : 16,
                padding: 8,
              }}
            >
              <IconSymbol
                android_material_icon_name="map"
                ios_icon_name="map.fill"
                size={24}
                color={colors.primary}
              />
            </Pressable>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchBar}>
          <IconSymbol
            android_material_icon_name="search"
            ios_icon_name="magnifyingglass"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations, activities..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Activity</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((category, index) => (
              <Pressable
                key={index}
                style={styles.categoryCard}
                onPress={() => {
                  console.log('Category selected:', category.name);
                }}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <IconSymbol
                    android_material_icon_name={category.icon}
                    ios_icon_name={category.icon}
                    size={24}
                    color={category.color}
                  />
                </View>
                <View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>{category.count}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
