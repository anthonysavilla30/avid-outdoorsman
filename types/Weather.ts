
export interface WeatherAlert {
  id: string;
  type: 'severe-thunderstorm' | 'flood' | 'winter-storm' | 'heat' | 'wind' | 'fire';
  severity: 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  affectedAreas: string[];
}

export interface WeatherRadarData {
  available: boolean;
  lastUpdate: Date;
  radarUrl?: string;
}

export interface HistoricalWeather {
  date: Date;
  highTemp: number;
  lowTemp: number;
  precipitation: number;
  conditions: string;
}
