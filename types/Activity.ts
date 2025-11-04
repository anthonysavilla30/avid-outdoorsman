
export type ActivityStatus = 'active' | 'paused' | 'completed';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp: number;
  accuracy?: number;
  speed?: number;
}

export interface ActivityStats {
  distance: number; // in miles
  duration: number; // in seconds
  elevationGain: number; // in feet
  elevationLoss: number; // in feet
  maxSpeed: number; // in mph
  avgSpeed: number; // in mph
  calories?: number;
}

export interface TrackedActivity {
  id: string;
  type: 'hunting' | 'fishing' | 'hiking' | 'camping' | 'kayaking' | 'mountain-biking' | 'overlanding' | 'backpacking' | 'rock-climbing' | 'trail-running' | 'cross-country-skiing' | 'snowshoeing';
  status: ActivityStatus;
  startTime: Date;
  endTime?: Date;
  route: LocationPoint[];
  stats: ActivityStats;
  name?: string;
  notes?: string;
  photos?: string[];
}

export interface ActivitySummary {
  totalActivities: number;
  totalDistance: number;
  totalDuration: number;
  totalElevationGain: number;
  activitiesByType: Record<string, number>;
  recentActivities: TrackedActivity[];
}
