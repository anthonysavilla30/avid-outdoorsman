
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { BlurView } from 'expo-blur';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name?: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = 360,
  borderRadius = 30,
  bottomMargin = 20,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const animatedValue = useSharedValue(0);

  const handleTabPress = (route: string, index: number) => {
    console.log('Navigating to:', route);
    router.push(route as any);
  };

  const activeIndex = tabs.findIndex((tab) => {
    if (pathname === '/' || pathname === '/(tabs)/(home)/' || pathname === '/(tabs)/(home)') {
      return tab.route.includes('(home)') && !tab.route.includes('create-post');
    }
    if (pathname.includes('create-post')) {
      return tab.route.includes('create-post');
    }
    if (pathname.includes('post-detail')) {
      return tab.route.includes('(home)') && !tab.route.includes('create-post');
    }
    // Extract the tab name from the route
    const tabName = tab.route.split('/').pop();
    return pathname.includes(tabName || '');
  });

  useEffect(() => {
    animatedValue.value = withSpring(activeIndex >= 0 ? activeIndex : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [activeIndex, animatedValue]);

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    return {
      transform: [
        {
          translateX: interpolate(
            animatedValue.value,
            tabs.map((_, i) => i),
            tabs.map((_, i) => i * tabWidth)
          ),
        },
      ],
      width: tabWidth,
    };
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={[styles.container, { marginBottom: bottomMargin }]}>
        <BlurView
          intensity={90}
          tint="dark"
          style={[
            styles.tabBar,
            {
              width: containerWidth,
              borderRadius: borderRadius,
            },
          ]}
        >
          <Animated.View style={[styles.indicator, indicatorStyle]} />
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;

            return (
              <TouchableOpacity
                key={tab.route}
                style={styles.tab}
                onPress={() => handleTabPress(tab.route, index)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name={tab.icon as any}
                  size={26}
                  color={isActive ? colors.primary : colors.text}
                />
                <Text
                  style={[
                    styles.label,
                    { color: isActive ? colors.primary : colors.text },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    boxShadow: `0px 4px 16px ${colors.shadow}`,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
    zIndex: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  indicator: {
    position: 'absolute',
    height: '80%',
    backgroundColor: 'rgba(52, 152, 219, 0.15)',
    borderRadius: 20,
    top: '10%',
    zIndex: 1,
  },
});
