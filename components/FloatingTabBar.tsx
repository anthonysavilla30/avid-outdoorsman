
import React from 'react';
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
  name: string;
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
  containerWidth = 380,
  borderRadius = 28,
  bottomMargin = 20,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const animatedValue = useSharedValue(0);

  const handleTabPress = (route: string, index: number) => {
    console.log('Navigating to:', route);
    // Center button (Post) - index 2
    if (index === 2) {
      router.push('/(tabs)/(home)/create-post' as any);
    } else {
      router.push(route as any);
    }
  };

  const activeIndex = tabs.findIndex((tab) => {
    if (pathname === '/' || pathname === '/(tabs)/(home)/' || pathname === '/(tabs)/(home)') {
      return tab.name === '(home)';
    }
    if (pathname.includes('create-post')) {
      return tab.name === 'post';
    }
    return pathname.includes(tab.name);
  });

  React.useEffect(() => {
    animatedValue.value = withSpring(activeIndex >= 0 ? activeIndex : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [activeIndex]);

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
            const isCenterButton = index === 2; // Post button

            if (isCenterButton) {
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={styles.centerButtonContainer}
                  onPress={() => handleTabPress(tab.route, index)}
                  activeOpacity={0.7}
                >
                  <View style={styles.centerButton}>
                    <IconSymbol
                      name={tab.icon as any}
                      size={36}
                      color="#ffffff"
                    />
                  </View>
                  <Text style={styles.centerLabel}>{tab.label}</Text>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tab}
                onPress={() => handleTabPress(tab.route, index)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name={tab.icon as any}
                  size={28}
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
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    boxShadow: `0px 4px 16px ${colors.shadow}`,
    elevation: 10,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    zIndex: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  centerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  indicator: {
    position: 'absolute',
    height: '75%',
    backgroundColor: 'rgba(52, 152, 219, 0.15)',
    borderRadius: 20,
    top: '12.5%',
    zIndex: 1,
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -32,
    boxShadow: `0px 6px 16px ${colors.shadow}`,
    elevation: 12,
    borderWidth: 3,
    borderColor: colors.background,
  },
});
