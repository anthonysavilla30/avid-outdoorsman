
export type TripType = 
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
  | 'cross-country-skiing';

export type TripStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export type TripPrivacy = 'public' | 'friends' | 'private';

export interface TripParticipant {
  id: string;
  name: string;
  avatar: string;
  status: 'going' | 'maybe' | 'invited' | 'declined';
  role?: 'organizer' | 'guide' | 'participant';
}

export interface TripLocation {
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  type: TripType;
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  location: TripLocation;
  startDate: Date;
  endDate: Date;
  status: TripStatus;
  privacy: TripPrivacy;
  participants: TripParticipant[];
  maxParticipants?: number;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  gearRequired: string[];
  meetingPoint?: string;
  notes?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TripJournalEntry {
  id: string;
  tripId?: string;
  userId: string;
  title: string;
  type: TripType;
  location: TripLocation;
  startTime: Date;
  endTime: Date;
  distance?: number; // miles
  duration: number; // seconds
  elevationGain?: number; // feet
  photos: string[];
  notes: string;
  weather?: {
    condition: string;
    temperature: number;
    windSpeed?: number;
  };
  route?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  }[];
  highlights: string[];
  companions: string[];
  gear: string[];
  species?: string[]; // animals/fish seen or caught
  createdAt: Date;
  isPublic: boolean;
}
