
import { IconSymbol } from '@/components/IconSymbol';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { mockWeatherAlerts } from '@/data/mockWeatherAlerts';
import { WeatherAlert } from '@/types/Weather';

interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  icon: string;
  precipitation: number;
}

interface DailyForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

const mockHourlyForecast: HourlyForecast[] = [
  { time: '12 PM', temp: 68, condition: 'Sunny', icon: 'sun.max.fill', precipitation: 0 },
  { time: '1 PM', temp: 70, condition: 'Sunny', icon: 'sun.max.fill', precipitation: 0 },
  { time: '2 PM', temp: 72, condition: 'Partly Cloudy', icon: 'cloud.sun.fill', precipitation: 5 },
  { time: '3 PM', temp: 71, condition: 'Partly Cloudy', icon: 'cloud.sun.fill', precipitation: 10 },
  { time: '4 PM', temp: 69, condition: 'Cloudy', icon: 'cloud.fill', precipitation: 20 },
  { time: '5 PM', temp: 66, condition: 'Rain', icon: 'cloud.rain.fill', precipitation: 60 },
];

const mockDailyForecast: DailyForecast[] = [
  { day: 'Today', high: 72, low: 58, condition: 'Partly Cloudy', icon: 'cloud.sun.fill', precipitation: 20 },
  { day: 'Tomorrow', high: 68, low: 54, condition: 'Rain', icon: 'cloud.rain.fill', precipitation: 70 },
  { day: 'Wednesday', high: 65, low: 52, condition: 'Cloudy', icon: 'cloud.fill', precipitation: 40 },
  { day: 'Thursday', high: 70, low: 56, condition: 'Sunny', icon: 'sun.max.fill', precipitation: 10 },
  { day: 'Friday', high: 74, low: 60, condition: 'Sunny', icon: 'sun.max.fill', precipitation: 5 },
  { day: 'Saturday', high: 76, low: 62, condition: 'Partly Cloudy', icon: 'cloud.sun.fill', precipitation: 15 },
  { day: 'Sunday', high: 73, low: 59, condition: 'Partly Cloudy', icon: 'cloud.sun.fill', precipitation: 25 },
];

export default function WeatherScreen() {
  const router = useRouter();
  const [selectedView, setSelectedView] = useState<'hourly' | 'daily'>('hourly');

  const handleMapPress = () => {
    router.push('/(tabs)/map');
  };

  const handleTrackMilesPress = () => {
    router.push('/(tabs)/profile');
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
    <View style={styles.headerButtonGroup}>
      <Pressable style={styles.headerButton} onPress={handleMapPress}>
        <IconSymbol name="map.fill" color={colors.primary} size={24} />
      </Pressable>
      <Pressable style={styles.trackMilesButtonIOS} onPress={handleTrackMilesPress}>
        <IconSymbol name="figure.run" color={colors.primary} size={20} />
      </Pressable>
    </View>
  );

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'warning': return colors.secondary;
      case 'watch': return colors.accent;
      case 'advisory': return colors.primary;
      default: return colors.textSecondary;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'severe-thunderstorm': return 'cloud.bolt.fill';
      case 'flood': return 'drop.fill';
      case 'winter-storm': return 'snowflake';
      case 'heat': return 'sun.max.fill';
      case 'wind': return 'wind';
      case 'fire': return 'flame.fill';
      default: return 'exclamationmark.triangle.fill';
    }
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Weather',
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
            headerLargeTitle: false,
          }}
        />
      )}
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            Platform.OS !== 'ios' && styles.contentWithTabBar,
          ]}
        >
          {Platform.OS !== 'ios' && (
            <View style={styles.topBar}>
              <View style={styles.topLeft}>
                <Pressable style={styles.topButton} onPress={handleMapPress}>
                  <IconSymbol name="map.fill" color={colors.text} size={24} />
                </Pressable>
                <Pressable style={styles.trackMilesButton} onPress={handleTrackMilesPress}>
                  <IconSymbol name="figure.run" color="#ffffff" size={20} />
                  <Text style={styles.trackMilesText}>Track Miles</Text>
                </Pressable>
              </View>
              <View style={styles.topRight}>
                <Pressable style={styles.topButton} onPress={handleMessagesPress}>
                  <IconSymbol name="message.fill" color={colors.text} size={24} />
                </Pressable>
                <Pressable style={styles.topButton} onPress={handleNotificationsPress}>
                  <IconSymbol name="bell.fill" color={colors.text} size={24} />
                </Pressable>
              </View>
            </View>
          )}

          {/* Weather Alerts */}
          {mockWeatherAlerts.length > 0 && (
            <View style={styles.alertsSection}>
              {mockWeatherAlerts.map((alert) => (
                <View
                  key={alert.id}
                  style={[styles.alertCard, { borderLeftColor: getAlertColor(alert.severity) }]}
                >
                  <View style={styles.alertHeader}>
                    <IconSymbol
                      name={getAlertIcon(alert.type) as any}
                      size={24}
                      color={getAlertColor(alert.severity)}
                    />
                    <View style={styles.alertTitleContainer}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      <Text style={[styles.alertSeverity, { color: getAlertColor(alert.severity) }]}>
                        {alert.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.alertDescription}>{alert.description}</Text>
                  <Text style={styles.alertTime}>
                    Until {alert.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Weather Radar */}
          <View style={styles.radarCard}>
            <View style={styles.radarHeader}>
              <IconSymbol name="cloud.bolt.rain.fill" size={28} color={colors.primary} />
              <Text style={styles.radarTitle}>Weather Radar</Text>
            </View>
            <View style={styles.radarPlaceholder}>
              <IconSymbol name="map.fill" size={48} color={colors.textSecondary} />
              <Text style={styles.radarPlaceholderText}>
                Weather radar visualization coming soon
              </Text>
              <Text style={styles.radarPlaceholderSubtext}>
                Real-time precipitation and storm tracking
              </Text>
            </View>
          </View>

          {/* Current Weather */}
          <View style={styles.currentWeather}>
            <IconSymbol name="cloud.sun.fill" size={80} color={colors.accent} />
            <Text style={styles.currentTemp}>72°F</Text>
            <Text style={styles.currentCondition}>Partly Cloudy</Text>
            <Text style={styles.location}>Denver, CO</Text>
          </View>

          {/* Weather Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <IconSymbol name="wind" size={24} color={colors.primary} />
              <Text style={styles.detailValue}>12 mph</Text>
              <Text style={styles.detailLabel}>Wind</Text>
            </View>
            <View style={styles.detailCard}>
              <IconSymbol name="drop.fill" size={24} color={colors.primary} />
              <Text style={styles.detailValue}>45%</Text>
              <Text style={styles.detailLabel}>Humidity</Text>
            </View>
            <View style={styles.detailCard}>
              <IconSymbol name="sun.max.fill" size={24} color={colors.accent} />
              <Text style={styles.detailValue}>UV 6</Text>
              <Text style={styles.detailLabel}>UV Index</Text>
            </View>
            <View style={styles.detailCard}>
              <IconSymbol name="moon.fill" size={24} color={colors.textSecondary} />
              <Text style={styles.detailValue}>Waxing</Text>
              <Text style={styles.detailLabel}>Moon Phase</Text>
            </View>
          </View>

          {/* View Toggle */}
          <View style={styles.toggleContainer}>
            <Pressable
              style={[styles.toggleButton, selectedView === 'hourly' && styles.toggleButtonActive]}
              onPress={() => setSelectedView('hourly')}
            >
              <Text style={[styles.toggleText, selectedView === 'hourly' && styles.toggleTextActive]}>
                24-Hour
              </Text>
            </Pressable>
            <Pressable
              style={[styles.toggleButton, selectedView === 'daily' && styles.toggleButtonActive]}
              onPress={() => setSelectedView('daily')}
            >
              <Text style={[styles.toggleText, selectedView === 'daily' && styles.toggleTextActive]}>
                7-Day
              </Text>
            </Pressable>
          </View>

          {/* Hourly Forecast */}
          {selectedView === 'hourly' && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
              {mockHourlyForecast.map((hour, index) => (
                <View key={index} style={styles.hourlyCard}>
                  <Text style={styles.hourlyTime}>{hour.time}</Text>
                  <IconSymbol name={hour.icon as any} size={32} color={colors.primary} />
                  <Text style={styles.hourlyTemp}>{hour.temp}°</Text>
                  <View style={styles.precipitationRow}>
                    <IconSymbol name="drop.fill" size={12} color={colors.primary} />
                    <Text style={styles.precipitationText}>{hour.precipitation}%</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Daily Forecast */}
          {selectedView === 'daily' && (
            <View style={styles.dailyForecast}>
              {mockDailyForecast.map((day, index) => (
                <View key={index} style={styles.dailyCard}>
                  <Text style={styles.dayName}>{day.day}</Text>
                  <IconSymbol name={day.icon as any} size={28} color={colors.primary} />
                  <View style={styles.tempRange}>
                    <Text style={styles.highTemp}>{day.high}°</Text>
                    <Text style={styles.lowTemp}>{day.low}°</Text>
                  </View>
                  <View style={styles.precipitationRow}>
                    <IconSymbol name="drop.fill" size={12} color={colors.primary} />
                    <Text style={styles.precipitationText}>{day.precipitation}%</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Sunrise/Sunset */}
          <View style={styles.sunTimesCard}>
            <View style={styles.sunTimeRow}>
              <IconSymbol name="sunrise.fill" size={32} color={colors.accent} />
              <View>
                <Text style={styles.sunTimeLabel}>Sunrise</Text>
                <Text style={styles.sunTimeValue}>6:24 AM</Text>
              </View>
            </View>
            <View style={styles.sunTimeRow}>
              <IconSymbol name="sunset.fill" size={32} color={colors.secondary} />
              <View>
                <Text style={styles.sunTimeLabel}>Sunset</Text>
                <Text style={styles.sunTimeValue}>7:45 PM</Text>
              </View>
            </View>
          </View>

          {/* Historical Weather */}
          <View style={styles.historicalCard}>
            <View style={styles.historicalHeader}>
              <IconSymbol name="calendar" size={24} color={colors.primary} />
              <Text style={styles.historicalTitle}>Historical Weather</Text>
            </View>
            <Text style={styles.historicalSubtitle}>
              View past weather data for this location
            </Text>
            <Pressable style={styles.historicalButton}>
              <Text style={styles.historicalButtonText}>View Historical Data</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.primary} />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 16,
  },
  contentWithTabBar: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.card,
  },
  topLeft: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  topButton: {
    padding: 8,
  },
  topRight: {
    flexDirection: 'row',
    gap: 8,
  },
  trackMilesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackMilesText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  trackMilesButtonIOS: {
    padding: 4,
  },
  alertsSection: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  alertSeverity: {
    fontSize: 12,
    fontWeight: '700',
  },
  alertDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  alertTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  radarCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  radarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  radarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  radarPlaceholder: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  radarPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  radarPlaceholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  currentWeather: {
    backgroundColor: colors.card,
    alignItems: 'center',
    padding: 32,
    marginBottom: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  currentTemp: {
    fontSize: 64,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  currentCondition: {
    fontSize: 20,
    color: colors.textSecondary,
    marginTop: 8,
  },
  location: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  detailCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  forecastScroll: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  hourlyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  hourlyTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  hourlyTemp: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  precipitationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  precipitationText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dailyForecast: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dailyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  tempRange: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  highTemp: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  lowTemp: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  sunTimesCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  sunTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sunTimeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sunTimeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  historicalCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  historicalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  historicalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  historicalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  historicalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  historicalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
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
