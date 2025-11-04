
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useRouter } from 'expo-router';

interface QuickAccessItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  color: string;
}

const quickAccessItems: QuickAccessItem[] = [
  {
    id: '1',
    title: 'Spots',
    icon: 'star.fill',
    route: '/(tabs)/spots',
    color: colors.accent,
  },
  {
    id: '2',
    title: 'Regulations',
    icon: 'doc.text.fill',
    route: '/(tabs)/regulations',
    color: colors.secondary,
  },
  {
    id: '3',
    title: 'Gear',
    icon: 'backpack.fill',
    route: '/(tabs)/gear',
    color: colors.highlight,
  },
  {
    id: '4',
    title: 'Saved',
    icon: 'bookmark.fill',
    route: '/(tabs)/saved',
    color: colors.primary,
  },
];

const nearbyUsers = [
  {
    id: '1',
    name: 'John Tracker',
    distance: '2.3 miles',
    activity: 'Hunting',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    name: 'Sarah Rivers',
    distance: '5.1 miles',
    activity: 'Fishing',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    name: 'Mike Trails',
    distance: '8.7 miles',
    activity: 'Hiking',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  },
  {
    id: '4',
    name: 'Emma Woods',
    distance: '12.4 miles',
    activity: 'Camping',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusFilter, setRadiusFilter] = useState(50);

  const handleQuickAccess = (route: string) => {
    console.log('Navigating to:', route);
    router.push(route as any);
  };

  const handleUserPress = (userId: string) => {
    console.log('Viewing user profile:', userId);
    router.push('/(tabs)/user-profile' as any);
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Explore</Text>
          <Text style={commonStyles.textSecondary}>
            Discover outdoorsmen and locations near you
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users, locations..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quick Access Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            {quickAccessItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickAccessCard}
                onPress={() => handleQuickAccess(item.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.quickAccessIcon, { backgroundColor: item.color }]}>
                  <IconSymbol name={item.icon as any} size={28} color="#ffffff" />
                </View>
                <Text style={styles.quickAccessTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Radius Filter */}
        <View style={styles.section}>
          <View style={styles.filterHeader}>
            <Text style={styles.sectionTitle}>Nearby Outdoorsmen</Text>
            <TouchableOpacity style={styles.radiusButton}>
              <IconSymbol name="location.fill" size={16} color={colors.primary} />
              <Text style={styles.radiusText}>{radiusFilter} miles</Text>
            </TouchableOpacity>
          </View>

          {/* User List */}
          <View style={styles.userList}>
            {nearbyUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                onPress={() => handleUserPress(user.id)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <View style={styles.userMeta}>
                    <IconSymbol name="location.fill" size={12} color={colors.textSecondary} />
                    <Text style={styles.userDistance}>{user.distance}</Text>
                    <Text style={styles.userDivider}>•</Text>
                    <Text style={styles.userActivity}>{user.activity}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAccessCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAccessTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  radiusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  radiusText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  userList: {
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.border,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userDistance: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  userDivider: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  userActivity: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottomPadding: {
    height: 100,
  },
});
