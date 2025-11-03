
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

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
  { time: 'Now', temp: 68, condition: 'Partly Cloudy', icon: 'cloud.sun.fill', precipitation: 10 },
  { time: '2 PM', temp: 72, condition: 'Sunny', icon: 'sun.max.fill', precipitation: 5 },
  { time: '3 PM', temp: 74, condition: 'Sunny', icon: 'sun.max.fill', precipitation: 5 },
  { time: '4 PM', temp: 73, condition: 'Partly Cloudy', icon: 'cloud.sun.fill', precipitation: 10 },
  { time: '5 PM', temp: 70, condition: 'Cloudy', icon: 'cloud.fill', precipitation: 20 },
  { time: '6 PM', temp: 67, condition: 'Cloudy', icon: 'cloud.fill', precipitation: 25 },
];

const mockDailyForecast: DailyForecast[] = [
  { day: 'Today', high: 74, low: 58, condition: 'Partly Cloudy', icon: 'cloud.sun.fill', precipitation: 20 },
  { day: 'Tomorrow', high: 76, low: 60, condition: 'Sunny', icon: 'sun.max.fill', precipitation: 5 },
  { day: 'Wednesday', high: 72, low: 56, condition: 'Rain', icon: 'cloud.rain.fill', precipitation: 80 },
  { day: 'Thursday', high: 68, low: 54, condition: 'Cloudy', icon: 'cloud.fill', precipitation: 40 },
  { day: 'Friday', high: 70, low: 55, condition: 'Partly Cloudy', icon: 'cloud.sun.fill', precipitation: 15 },
  { day: 'Saturday', high: 75, low: 58, condition: 'Sunny', icon: 'sun.max.fill', precipitation: 0 },
  { day: 'Sunday', high: 78, low: 62, condition: 'Sunny', icon: 'sun.max.fill', precipitation: 0 },
];

export default function WeatherScreen() {
  const [selectedTab, setSelectedTab] = useState<'hourly' | 'daily'>('hourly');

  const currentSeason = 'Spring';
  const seasonInfo = {
    Spring: {
      icon: 'leaf.fill',
      color: colors.highlight,
      description: 'Prime time for turkey hunting and trout fishing. Trails are muddy but wildflowers are blooming.',
    },
    Summer: {
      icon: 'sun.max.fill',
      color: colors.accent,
      description: 'Peak hiking season. Early morning and evening are best for fishing. Stay hydrated.',
    },
    Fall: {
      icon: 'wind',
      color: '#e67e22',
      description: 'Deer hunting season. Cooler temperatures make for great hiking. Fall colors are spectacular.',
    },
    Winter: {
      icon: 'snowflake',
      color: '#3498db',
      description: 'Ice fishing and winter camping. Check trail conditions before heading out.',
    },
  };

  const season = seasonInfo[currentSeason as keyof typeof seasonInfo];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Weather',
          headerShown: Platform.OS === 'ios',
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          Platform.OS !== 'ios' && styles.contentWithTabBar,
        ]}
      >
        {Platform.OS !== 'ios' && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Weather</Text>
            <Text style={styles.headerSubtitle}>Current Location</Text>
          </View>
        )}

        {/* Current Weather */}
        <View style={styles.currentWeatherCard}>
          <View style={styles.currentWeatherTop}>
            <View>
              <Text style={styles.currentTemp}>68°</Text>
              <Text style={styles.currentCondition}>Partly Cloudy</Text>
              <Text style={styles.currentLocation}>Denver, CO</Text>
            </View>
            <IconSymbol name="cloud.sun.fill" size={80} color={colors.primary} />
          </View>

          <View style={styles.currentWeatherDetails}>
            <View style={styles.detailItem}>
              <IconSymbol name="wind" size={20} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>8 mph NW</Text>
            </View>
            <View style={styles.detailItem}>
              <IconSymbol name="drop.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>45%</Text>
            </View>
            <View style={styles.detailItem}>
              <IconSymbol name="eye.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Visibility</Text>
              <Text style={styles.detailValue}>10 mi</Text>
            </View>
            <View style={styles.detailItem}>
              <IconSymbol name="gauge" size={20} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>30.12 in</Text>
            </View>
          </View>
        </View>

        {/* Sun & Moon */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sun & Moon</Text>
          <View style={styles.sunMoonContainer}>
            <View style={styles.sunMoonItem}>
              <IconSymbol name="sunrise.fill" size={32} color={colors.accent} />
              <Text style={styles.sunMoonLabel}>Sunrise</Text>
              <Text style={styles.sunMoonValue}>6:24 AM</Text>
            </View>
            <View style={styles.sunMoonItem}>
              <IconSymbol name="sunset.fill" size={32} color={colors.secondary} />
              <Text style={styles.sunMoonLabel}>Sunset</Text>
              <Text style={styles.sunMoonValue}>7:48 PM</Text>
            </View>
            <View style={styles.sunMoonItem}>
              <IconSymbol name="moon.stars.fill" size={32} color={colors.primary} />
              <Text style={styles.sunMoonLabel}>Moon Phase</Text>
              <Text style={styles.sunMoonValue}>Waxing Crescent</Text>
            </View>
          </View>
        </View>

        {/* UV Index */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>UV Index</Text>
          <View style={styles.uvContainer}>
            <View style={styles.uvBar}>
              <View style={[styles.uvFill, { width: '60%' }]} />
            </View>
            <Text style={styles.uvValue}>6 - High</Text>
            <Text style={styles.uvDescription}>Wear sunscreen and protective clothing</Text>
          </View>
        </View>

        {/* Forecast Tabs */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, selectedTab === 'hourly' && styles.activeTab]}
            onPress={() => setSelectedTab('hourly')}
          >
            <Text style={[styles.tabText, selectedTab === 'hourly' && styles.activeTabText]}>
              Hourly
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, selectedTab === 'daily' && styles.activeTab]}
            onPress={() => setSelectedTab('daily')}
          >
            <Text style={[styles.tabText, selectedTab === 'daily' && styles.activeTabText]}>
              7-Day
            </Text>
          </Pressable>
        </View>

        {/* Hourly Forecast */}
        {selectedTab === 'hourly' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
            {mockHourlyForecast.map((hour, index) => (
              <View key={index} style={styles.hourlyCard}>
                <Text style={styles.hourlyTime}>{hour.time}</Text>
                <IconSymbol name={hour.icon as any} size={32} color={colors.primary} />
                <Text style={styles.hourlyTemp}>{hour.temp}°</Text>
                <View style={styles.precipContainer}>
                  <IconSymbol name="drop.fill" size={12} color={colors.primary} />
                  <Text style={styles.precipText}>{hour.precipitation}%</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Daily Forecast */}
        {selectedTab === 'daily' && (
          <View style={styles.dailyContainer}>
            {mockDailyForecast.map((day, index) => (
              <View key={index} style={styles.dailyCard}>
                <Text style={styles.dailyDay}>{day.day}</Text>
                <View style={styles.dailyMiddle}>
                  <IconSymbol name={day.icon as any} size={28} color={colors.primary} />
                  <Text style={styles.dailyCondition}>{day.condition}</Text>
                </View>
                <View style={styles.dailyRight}>
                  <View style={styles.precipContainer}>
                    <IconSymbol name="drop.fill" size={12} color={colors.primary} />
                    <Text style={styles.precipText}>{day.precipitation}%</Text>
                  </View>
                  <Text style={styles.dailyTemp}>{day.high}° / {day.low}°</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Season Information */}
        <View style={styles.seasonCard}>
          <View style={styles.seasonHeader}>
            <IconSymbol name={season.icon as any} size={40} color={season.color} />
            <Text style={styles.seasonTitle}>{currentSeason} Season</Text>
          </View>
          <Text style={styles.seasonDescription}>{season.description}</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 16,
  },
  contentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: colors.card,
    marginHorizontal: -16,
    marginTop: -16,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    marginBottom: 16,
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  currentWeatherCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  currentWeatherTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  currentTemp: {
    fontSize: 64,
    fontWeight: '700',
    color: colors.text,
  },
  currentCondition: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  currentLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  currentWeatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  sunMoonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sunMoonItem: {
    alignItems: 'center',
    gap: 8,
  },
  sunMoonLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sunMoonValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  uvContainer: {
    gap: 8,
  },
  uvBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  uvFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  uvValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  uvDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: '#ffffff',
  },
  forecastScroll: {
    marginBottom: 16,
  },
  hourlyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    gap: 8,
    minWidth: 80,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  hourlyTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  hourlyTemp: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  precipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  precipText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dailyContainer: {
    gap: 12,
    marginBottom: 16,
  },
  dailyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  dailyDay: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    width: 90,
  },
  dailyMiddle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dailyCondition: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dailyRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  dailyTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  seasonCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  seasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  seasonTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  seasonDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
