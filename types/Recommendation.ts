
import { Post } from './Post';
import { Spot } from './Review';
import { Trip } from './Trip';

export interface UserPreferences {
  favoriteActivities: string[];
  preferredDifficulty: string[];
  preferredWeather: string[];
  activityHistory: string[];
  savedPosts: string[];
  savedSpots: string[];
  frequentLocations: string[];
}

export interface Recommendation {
  id: string;
  type: 'post' | 'spot' | 'trip' | 'user';
  item: Post | Spot | Trip | any;
  score: number; // 0-100
  reason: string;
  category: 'trending' | 'personalized' | 'nearby' | 'similar';
}
