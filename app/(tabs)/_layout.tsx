
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  // Define the tabs configuration
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'house.fill',
      label: 'Feed',
    },
    {
      name: 'explore',
      route: '/(tabs)/explore',
      icon: 'person.2.fill',
      label: 'Explore',
    },
    {
      name: 'post',
      route: '/(tabs)/(home)/create-post',
      icon: 'plus.circle.fill',
      label: 'Post',
    },
    {
      name: 'weather',
      route: '/(tabs)/weather',
      icon: 'cloud.sun.fill',
      label: 'Weather',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person.fill',
      label: 'Profile',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="house.fill" drawable="ic_home" />
          <Label>Feed</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="explore">
          <Icon sf="person.2.fill" drawable="ic_explore" />
          <Label>Explore</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="(home)/create-post">
          <Icon sf="plus.circle.fill" drawable="ic_add" />
          <Label>Post</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="weather">
          <Icon sf="cloud.sun.fill" drawable="ic_weather" />
          <Label>Weather</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person.fill" drawable="ic_profile" />
          <Label>Profile</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="weather" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="map" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="notifications" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
