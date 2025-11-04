
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
            tabBarIcon: ({ color }) => <IconSymbol name="safari.fill" color={color} />,
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
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol name="person.fill" color={color} />,
          }}
        />
        {/* Hidden tabs - accessible via navigation */}
        <Tabs.Screen
          name="map"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="spots"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="regulations"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="gear"
          options={{
            href: null,
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
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="user-profile"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="saved"
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
                icon: 'safari.fill',
              },
              {
                route: '/(tabs)/(home)/create-post',
                label: 'Post',
                icon: 'plus.circle.fill',
              },
              {
                route: '/(tabs)/weather',
                label: 'Weather',
                icon: 'cloud.sun.fill',
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
        <Tabs.Screen name="weather" />
        <Tabs.Screen name="profile" />
        {/* Hidden tabs - accessible via navigation */}
        <Tabs.Screen
          name="map"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="spots"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="regulations"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="gear"
          options={{
            href: null,
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
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="user-profile"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
