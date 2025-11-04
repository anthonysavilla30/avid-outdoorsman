
export type SpotType = 'trail' | 'fishing-hole' | 'campsite' | 'hunting-area' | 'other';
export type DifficultyLevel = 'easy' | 'moderate' | 'hard' | 'expert';

export interface Review {
  id: string;
  spotId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  difficulty?: DifficultyLevel;
  title: string;
  content: string;
  photos: string[];
  date: Date;
  helpful: number;
  tags: string[];
}

export interface Spot {
  id: string;
  name: string;
  type: SpotType;
  latitude: number;
  longitude: number;
  description: string;
  averageRating: number;
  totalReviews: number;
  difficulty?: DifficultyLevel;
  photos: string[];
  amenities: string[];
  bestTimeToVisit?: string;
  accessibility?: string;
}
