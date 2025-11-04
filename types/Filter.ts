
import { ActivityType } from './Post';

export interface AdvancedFilter {
  activities: ActivityType[];
  radius: number; // in miles
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  difficulty: ('easy' | 'moderate' | 'hard')[];
  weather: string[];
  crowded: boolean | null;
  tags: string[];
  minLikes: number;
  hasImages: boolean;
  sortBy: 'recent' | 'popular' | 'distance' | 'relevant';
}

export const defaultFilter: AdvancedFilter = {
  activities: [],
  radius: 100,
  dateRange: {
    start: null,
    end: null,
  },
  difficulty: [],
  weather: [],
  crowded: null,
  tags: [],
  minLikes: 0,
  hasImages: false,
  sortBy: 'recent',
};
