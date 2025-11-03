
export type LandmarkVisibility = 'only-me' | 'followers' | 'public';

export interface Landmark {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  visibility: LandmarkVisibility;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: Date;
  category?: 'trail' | 'fishing-spot' | 'camping' | 'hunting-area' | 'viewpoint' | 'other';
  images?: string[];
  tags?: string[];
}
