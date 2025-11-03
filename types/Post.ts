
export type ActivityType = 'hunting' | 'fishing' | 'hiking' | 'camping' | 'all';

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
