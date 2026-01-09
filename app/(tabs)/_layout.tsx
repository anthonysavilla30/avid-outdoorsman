
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration - Home, Explore, Post, Profile
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'explore',
      route: '/(tabs)/explore',
      icon: 'explore',
      label: 'Explore',
    },
    {
      name: 'create-post',
      route: '/(tabs)/(home)/create-post',
      icon: 'add-circle',
      label: 'Post',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
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
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="explore" name="explore" />
        <Stack.Screen key="profile" name="profile" />
        <Stack.Screen key="map" name="map" />
      </Stack>
      <FloatingTabBar tabs={tabs} containerWidth={340} />
    </>
  );
}
