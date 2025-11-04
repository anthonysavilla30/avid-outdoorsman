
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import FloatingTabBar from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const isIOS = Platform.OS === 'ios';

  if (isIOS) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <IconSymbol name="person.2.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            tabBarIcon: ({ color }) => <IconSymbol name="map.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="spots"
          options={{
            title: 'Spots',
            tabBarIcon: ({ color }) => <IconSymbol name="star.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="regulations"
          options={{
            title: 'Regulations',
            tabBarIcon: ({ color }) => <IconSymbol name="doc.text.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="weather"
          options={{
            title: 'Weather',
            tabBarIcon: ({ color }) => <IconSymbol name="cloud.sun.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="gear"
          options={{
            title: 'Gear',
            tabBarIcon: ({ color }) => <IconSymbol name="backpack.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol name="person.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="badges"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="spot-detail"
          options={{
            href: null,
          }}
        />
      </Tabs>
    );
  }

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={() => (
          <FloatingTabBar
            tabs={[
              {
                route: '/(tabs)/(home)',
                label: 'Home',
                icon: 'house.fill',
              },
              {
                route: '/(tabs)/explore',
                label: 'Explore',
                icon: 'person.2.fill',
              },
              {
                route: '/(tabs)/map',
                label: 'Map',
                icon: 'map.fill',
              },
              {
                route: '/(tabs)/spots',
                label: 'Spots',
                icon: 'star.fill',
              },
              {
                route: '/(tabs)/regulations',
                label: 'Rules',
                icon: 'doc.text.fill',
              },
              {
                route: '/(tabs)/weather',
                label: 'Weather',
                icon: 'cloud.sun.fill',
              },
              {
                route: '/(tabs)/gear',
                label: 'Gear',
                icon: 'backpack.fill',
              },
              {
                route: '/(tabs)/profile',
                label: 'Profile',
                icon: 'person.fill',
              },
            ]}
          />
        )}
      >
        <Tabs.Screen name="(home)" />
        <Tabs.Screen name="explore" />
        <Tabs.Screen name="map" />
        <Tabs.Screen name="spots" />
        <Tabs.Screen name="regulations" />
        <Tabs.Screen name="weather" />
        <Tabs.Screen name="gear" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen
          name="messages"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="badges"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="spot-detail"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
