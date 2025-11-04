
export type ActivityCategory = 'hunting' | 'fishing' | 'trapping';

export interface Season {
  id: string;
  species: string;
  startDate: string;
  endDate: string;
  bagLimit: string;
  possessionLimit: string;
  notes?: string;
  zones?: string[];
}

export interface Regulation {
  id: string;
  state: string;
  stateCode: string;
  category: ActivityCategory;
  seasons: Season[];
  licenseRequirements: string[];
  specialRules: string[];
  lastUpdated: string;
}

export interface RegulationFilter {
  state?: string;
  category?: ActivityCategory;
  species?: string;
}
