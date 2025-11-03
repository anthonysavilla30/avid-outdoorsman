
import { WeatherAlert } from '@/types/Weather';

export const mockWeatherAlerts: WeatherAlert[] = [
  {
    id: '1',
    type: 'severe-thunderstorm',
    severity: 'warning',
    title: 'Severe Thunderstorm Warning',
    description: 'Severe thunderstorms with damaging winds up to 60 mph and quarter-size hail possible. Seek shelter immediately if outdoors.',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    affectedAreas: ['Mountain County', 'Valley Region'],
  },
  {
    id: '2',
    type: 'flood',
    severity: 'watch',
    title: 'Flood Watch',
    description: 'Heavy rainfall may cause flooding in low-lying areas and near streams. Avoid crossing flooded roads.',
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    affectedAreas: ['River Valley', 'Creek Basin'],
  },
];
