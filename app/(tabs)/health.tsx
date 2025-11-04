
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { HealthData, DailyGoals, WorkoutSession } from '@/types/Wearable';
import { Pedometer } from 'expo-sensors';

export default function HealthScreen() {
  const router = useRouter();
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [todaySteps, setTodaySteps] = useState(0);
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    distance: 0,
    calories: 0,
    activeMinutes: 0,
    timestamp: new Date(),
  });
  const [dailyGoals] = useState<DailyGoals>({
    steps: 10000,
    distance: 5,
    calories: 500,
    activeMinutes: 60,
  });

  const checkPedometerAvailability = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(isAvailable);
    
    if (!isAvailable) {
      console.log('Pedometer is not available on this device');
    }
  };

  const updateHealthData = useCallback((steps: number) => {
    // Rough calculations - in production, these would be more accurate
    const distance = (steps * 0.0005); // ~0.5 miles per 1000 steps
    const calories = Math.floor(steps * 0.04); // ~40 calories per 1000 steps
    const activeMinutes = Math.floor(steps / 100); // ~100 steps per minute

    setHealthData({
      steps,
      distance,
      calories,
      activeMinutes,
      timestamp: new Date(),
    });
  }, []);

  const subscribeToPedometer = useCallback(() => {
    const subscription = Pedometer.watchStepCount(result => {
      setTodaySteps(result.steps);
      updateHealthData(result.steps);
    });

    return () => subscription && subscription.remove();
  }, [updateHealthData]);

  useEffect(() => {
    checkPedometerAvailability();
    const cleanup = subscribeToPedometer();
    return cleanup;
  }, [subscribeToPedometer]);

  const handleMapPress = () => {
    router.push('/(tabs)/map');
  };

  const handleMessagesPress = () => {
    router.push('/(tabs)/messages');
  };

  const handleNotificationsPress = () => {
    router.push('/(tabs)/notifications');
  };

  const renderHeaderRight = () => (
    <View style={styles.headerButtonGroup}>
      <Pressable style={styles.headerButton} onPress={handleMessagesPress}>
        <IconSymbol name="message.fill" color={colors.primary} size={24} />
      </Pressable>
      <Pressable style={styles.headerButton} onPress={handleNotificationsPress}>
        <IconSymbol name="bell.fill" color={colors.primary} size={24} />
      </Pressable>
    </View>
  );

  const renderHeaderLeft = () => (
    <Pressable style={styles.headerButton} onPress={handleMapPress}>
      <IconSymbol name="map.fill" color={colors.primary} size={24} />
    </Pressable>
  );

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const renderProgressRing = (current: number, goal: number, label: string, icon: string, color: string) => {
    const percentage = getProgressPercentage(current, goal);
    
    return (
      <View style={styles.progressRing}>
        <View style={styles.progressCircle}>
          <View style={[styles.progressFill, { 
            backgroundColor: color,
            transform: [{ rotate: `${(percentage / 100) * 360}deg` }]
          }]} />
          <View style={styles.progressInner}>
            <IconSymbol name={icon} color={color} size={32} />
            <Text style={styles.progressValue}>{current.toLocaleString()}</Text>
            <Text style={styles.progressGoal}>of {goal.toLocaleString()}</Text>
          </View>
        </View>
        <Text style={styles.progressLabel}>{label}</Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Health & Fitness',
          headerRight: Platform.OS === 'ios' ? renderHeaderRight : undefined,
          headerLeft: Platform.OS === 'ios' ? renderHeaderLeft : undefined,
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            Platform.OS !== 'ios' && styles.contentWithTabBar,
          ]}
        >
          {/* Status Banner */}
          {!isPedometerAvailable && (
            <View style={styles.warningBanner}>
              <IconSymbol name="exclamationmark.triangle.fill" color={colors.accent} size={24} />
              <Text style={styles.warningText}>
                Step tracking is not available on this device
              </Text>
            </View>
          )}

          {/* Today's Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Today&apos;s Activity</Text>
            <Text style={styles.summaryDate}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          {/* Main Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <IconSymbol name="figure.walk" color={colors.primary} size={32} />
              <Text style={styles.statValue}>{healthData.steps.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Steps</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${getProgressPercentage(healthData.steps, dailyGoals.steps)}%`,
                      backgroundColor: colors.primary 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.goalText}>
                Goal: {dailyGoals.steps.toLocaleString()}
              </Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol name="figure.run" color={colors.highlight} size={32} />
              <Text style={styles.statValue}>{healthData.distance.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Miles</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${getProgressPercentage(healthData.distance, dailyGoals.distance)}%`,
                      backgroundColor: colors.highlight 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.goalText}>
                Goal: {dailyGoals.distance} mi
              </Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol name="flame.fill" color={colors.accent} size={32} />
              <Text style={styles.statValue}>{healthData.calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${getProgressPercentage(healthData.calories, dailyGoals.calories)}%`,
                      backgroundColor: colors.accent 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.goalText}>
                Goal: {dailyGoals.calories}
              </Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol name="clock.fill" color={colors.secondary} size={32} />
              <Text style={styles.statValue}>{healthData.activeMinutes}</Text>
              <Text style={styles.statLabel}>Active Min</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${getProgressPercentage(healthData.activeMinutes, dailyGoals.activeMinutes)}%`,
                      backgroundColor: colors.secondary 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.goalText}>
                Goal: {dailyGoals.activeMinutes} min
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Pressable 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/activity-tracker')}
            >
              <IconSymbol name="play.circle.fill" color={colors.primary} size={24} />
              <Text style={styles.actionButtonText}>Start Activity Tracking</Text>
              <IconSymbol name="chevron.right" color={colors.textSecondary} size={20} />
            </Pressable>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <IconSymbol name="info.circle.fill" color={colors.primary} size={24} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Wearable Device Integration</Text>
              <Text style={styles.infoText}>
                Connect your fitness tracker or smartwatch for more accurate health data and real-time tracking during outdoor activities.
              </Text>
            </View>
          </View>
        </ScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 16,
  },
  contentWithTabBar: {
    paddingBottom: 100,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  summaryDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
  },
  goalText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  progressRing: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressCircle: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  progressInner: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: 10,
    left: 10,
    backgroundColor: colors.card,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  progressGoal: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  headerButton: {
    padding: 4,
  },
  headerButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginRight: 8,
  },
});
