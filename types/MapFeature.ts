
export type MapFeatureType = 
  | 'ski-resort'
  | 'national-forest'
  | 'state-forest'
  | 'campground'
  | 'wildlife-management-area'
  | 'ski-trail';

export type SkiTrailDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface SkiTrail {
  id: string;
  name: string;
  difficulty: SkiTrailDifficulty;
  length: number; // in miles
  verticalDrop: number; // in feet
  open: boolean;
}

export interface SkiResort {
  id: string;
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  trails: SkiTrail[];
  lifts: number;
  baseElevation: number;
  summitElevation: number;
  acres: number;
  season: {
    start: string;
    end: string;
  };
  amenities: string[];
}

export interface Forest {
  id: string;
  name: string;
  type: 'national' | 'state';
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  acres: number;
  activities: string[];
  regulations: string[];
}

export interface Campground {
  id: string;
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  sites: number;
  amenities: string[];
  reservable: boolean;
  fee: string;
  season: {
    start: string;
    end: string;
  };
}

export interface WildlifeManagementArea {
  id: string;
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  acres: number;
  species: string[];
  activities: string[];
  regulations: string[];
  huntingSeasons: string[];
}

export interface MapFeature {
  id: string;
  type: MapFeatureType;
  data: SkiResort | Forest | Campground | WildlifeManagementArea;
}
