
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration with all main screens
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      iosIcon: 'house.fill',
      androidIcon: 'home',
      label: 'Home',
    },
    {
      name: 'map',
      route: '/(tabs)/map',
      iosIcon: 'map.fill',
      androidIcon: 'map',
      label: 'Map',
    },
    {
      name: 'trips',
      route: '/(tabs)/trips',
      iosIcon: 'backpack.fill',
      androidIcon: 'luggage',
      label: 'Trips',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      iosIcon: 'person.fill',
      androidIcon: 'person',
      label: 'Profile',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="map" />
        <Stack.Screen name="trips" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="weather" />
        <Stack.Screen name="regulations" />
        <Stack.Screen name="gear" />
        <Stack.Screen name="health" />
        <Stack.Screen name="activity-tracker" />
        <Stack.Screen name="spot-detail" />
        <Stack.Screen name="supabase-status" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="search" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="spots" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="recommendations" />
        <Stack.Screen name="badges" />
        <Stack.Screen name="leaderboard" />
        <Stack.Screen name="offline-maps" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="user-profile" />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="terms-conditions" />
      </Stack>
      <FloatingTabBar tabs={tabs} containerWidth={340} />
    </>
  );
}
