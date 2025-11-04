
export interface HealthData {
  steps: number;
  distance: number; // in miles
  calories: number;
  heartRate?: number; // bpm
  activeMinutes: number;
  timestamp: Date;
}

export interface WorkoutSession {
  id: string;
  type: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  distance: number; // in miles
  steps: number;
  calories: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  route?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  }[];
}

export interface DailyGoals {
  steps: number;
  distance: number;
  calories: number;
  activeMinutes: number;
}
