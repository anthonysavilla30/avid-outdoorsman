
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';
import { SkiResort, Forest, Campground, WildlifeManagementArea, SkiTrail } from '@/types/MapFeature';

interface MapFeatureCardProps {
  type: 'ski-resort' | 'forest' | 'campground' | 'wildlife-management-area';
  data: SkiResort | Forest | Campground | WildlifeManagementArea;
  onPress?: () => void;
}

export default function MapFeatureCard({ type, data, onPress }: MapFeatureCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'ski-resort':
        return 'snowflake';
      case 'forest':
        return 'tree.fill';
      case 'campground':
        return 'tent.fill';
      case 'wildlife-management-area':
        return 'pawprint.fill';
      default:
        return 'mappin.circle.fill';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'ski-resort':
        return '#4A90E2';
      case 'forest':
        return '#2ECC71';
      case 'campground':
        return '#E67E22';
      case 'wildlife-management-area':
        return '#9B59B6';
      default:
        return colors.primary;
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'ski-resort':
        return <SkiResortContent data={data as SkiResort} />;
      case 'forest':
        return <ForestContent data={data as Forest} />;
      case 'campground':
        return <CampgroundContent data={data as Campground} />;
      case 'wildlife-management-area':
        return <WildlifeManagementAreaContent data={data as WildlifeManagementArea} />;
      default:
        return null;
    }
  };

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: colors.border }}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getColor() + '20' }]}>
          <IconSymbol name={getIcon() as any} size={24} color={getColor()} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{data.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {data.description}
          </Text>
        </View>
      </View>
      {renderContent()}
    </Pressable>
  );
}

function SkiResortContent({ data }: { data: SkiResort }) {
  const openTrails = data.trails.filter(t => t.open).length;
  
  return (
    <View style={styles.content}>
      <View style={styles.statsRow}>
        <StatItem icon="mountain.2.fill" label="Elevation" value={`${data.summitElevation}ft`} />
        <StatItem icon="arrow.up.arrow.down" label="Vertical" value={`${data.summitElevation - data.baseElevation}ft`} />
        <StatItem icon="figure.skiing.downhill" label="Trails" value={`${openTrails}/${data.trails.length}`} />
      </View>
      <View style={styles.trailsSection}>
        <Text style={styles.sectionTitle}>Trails</Text>
        {data.trails.slice(0, 3).map((trail) => (
          <TrailItem key={trail.id} trail={trail} />
        ))}
        {data.trails.length > 3 && (
          <Text style={styles.moreText}>+{data.trails.length - 3} more trails</Text>
        )}
      </View>
      <View style={styles.amenitiesSection}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesList}>
          {data.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function TrailItem({ trail }: { trail: SkiTrail }) {
  const getDifficultyColor = () => {
    switch (trail.difficulty) {
      case 'beginner':
        return '#2ECC71';
      case 'intermediate':
        return '#3498DB';
      case 'advanced':
        return '#E67E22';
      case 'expert':
        return '#E74C3C';
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={styles.trailItem}>
      <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor() }]} />
      <Text style={styles.trailName}>{trail.name}</Text>
      <Text style={styles.trailLength}>{trail.length}mi</Text>
      {!trail.open && <Text style={styles.closedTag}>Closed</Text>}
    </View>
  );
}

function ForestContent({ data }: { data: Forest }) {
  return (
    <View style={styles.content}>
      <View style={styles.statsRow}>
        <StatItem icon="map.fill" label="Size" value={`${(data.acres / 1000).toFixed(0)}K acres`} />
        <StatItem icon="figure.hiking" label="Activities" value={`${data.activities.length}`} />
        <StatItem 
          icon={data.type === 'national' ? 'flag.fill' : 'building.columns.fill'} 
          label="Type" 
          value={data.type === 'national' ? 'National' : 'State'} 
        />
      </View>
      <View style={styles.activitiesSection}>
        <Text style={styles.sectionTitle}>Activities</Text>
        <View style={styles.amenitiesList}>
          {data.activities.slice(0, 4).map((activity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{activity}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function CampgroundContent({ data }: { data: Campground }) {
  return (
    <View style={styles.content}>
      <View style={styles.statsRow}>
        <StatItem icon="tent.fill" label="Sites" value={`${data.sites}`} />
        <StatItem icon="dollarsign.circle.fill" label="Fee" value={data.fee} />
        <StatItem 
          icon={data.reservable ? 'calendar.badge.checkmark' : 'calendar.badge.exclamationmark'} 
          label="Booking" 
          value={data.reservable ? 'Required' : 'First Come'} 
        />
      </View>
      <View style={styles.amenitiesSection}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesList}>
          {data.amenities.slice(0, 4).map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.seasonSection}>
        <IconSymbol name="calendar" size={16} color={colors.textSecondary} />
        <Text style={styles.seasonText}>
          Season: {data.season.start} - {data.season.end}
        </Text>
      </View>
    </View>
  );
}

function WildlifeManagementAreaContent({ data }: { data: WildlifeManagementArea }) {
  return (
    <View style={styles.content}>
      <View style={styles.statsRow}>
        <StatItem icon="map.fill" label="Size" value={`${(data.acres / 1000).toFixed(1)}K acres`} />
        <StatItem icon="pawprint.fill" label="Species" value={`${data.species.length}`} />
        <StatItem icon="figure.hunting" label="Activities" value={`${data.activities.length}`} />
      </View>
      <View style={styles.speciesSection}>
        <Text style={styles.sectionTitle}>Wildlife</Text>
        <View style={styles.amenitiesList}>
          {data.species.slice(0, 4).map((species, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{species}</Text>
            </View>
          ))}
        </View>
      </View>
      {data.huntingSeasons.length > 0 && (
        <View style={styles.seasonsSection}>
          <Text style={styles.sectionTitle}>Hunting Seasons</Text>
          {data.huntingSeasons.slice(0, 2).map((season, index) => (
            <Text key={index} style={styles.seasonItem}>• {season}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

function StatItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <IconSymbol name={icon as any} size={16} color={colors.textSecondary} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  content: {
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  trailsSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  trailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  trailName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  trailLength: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  closedTag: {
    fontSize: 11,
    color: '#E74C3C',
    fontWeight: '600',
  },
  moreText: {
    fontSize: 12,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  amenitiesSection: {
    gap: 8,
  },
  activitiesSection: {
    gap: 8,
  },
  speciesSection: {
    gap: 8,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTag: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amenityText: {
    fontSize: 12,
    color: colors.text,
  },
  seasonSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  seasonText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  seasonsSection: {
    gap: 4,
  },
  seasonItem: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
});
