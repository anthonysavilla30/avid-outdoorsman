
export type ActivityType = 
  | 'hunting' 
  | 'fishing' 
  | 'hiking' 
  | 'camping' 
  | 'kayaking' 
  | 'mountain-biking' 
  | 'overlanding' 
  | 'backpacking'
  | 'rock-climbing'
  | 'trail-running'
  | 'wildlife-photography'
  | 'foraging'
  | 'off-roading'
  | 'canoeing'
  | 'paddleboarding'
  | 'snowshoeing'
  | 'cross-country-skiing'
  | 'all';

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    distance: number; // miles away
  };
  activity: ActivityType;
  location: string;
  timestamp: Date;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  tags: string[];
  conditions?: {
    weather?: string;
    difficulty?: 'easy' | 'moderate' | 'hard';
    crowded?: boolean;
  };
}
