
import { ActivityType } from './Post';

export interface GearItem {
  id: string;
  name: string;
  category: 'clothing' | 'equipment' | 'safety' | 'navigation' | 'food';
  description: string;
  priority: 'essential' | 'recommended' | 'optional';
  icon: string;
}

export interface GearRecommendation {
  activity: ActivityType;
  weather: string;
  difficulty?: 'easy' | 'moderate' | 'hard';
  items: GearItem[];
}
