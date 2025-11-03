
export interface UserPoints {
  total: number;
  weekly: number;
  monthly: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedDate?: Date;
  progress?: number; // 0-100
  requirement: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  points: number;
  miles: number;
  posts: number;
  badges: number;
}

export type PointsActivity = 
  | 'post_created'
  | 'landmark_added'
  | 'mile_tracked'
  | 'review_written'
  | 'photo_uploaded'
  | 'location_explored';

export const POINTS_VALUES: Record<PointsActivity, number> = {
  post_created: 10,
  landmark_added: 25,
  mile_tracked: 5,
  review_written: 15,
  photo_uploaded: 5,
  location_explored: 20,
};
