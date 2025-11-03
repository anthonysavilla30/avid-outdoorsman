
import { Landmark } from '@/types/Landmark';

export const mockLandmarks: Landmark[] = [
  {
    id: '1',
    title: 'Secret Fishing Hole',
    description: 'Great spot for trout. Best in early morning.',
    latitude: 40.7128,
    longitude: -74.0060,
    visibility: 'followers',
    createdBy: {
      id: 'user1',
      name: 'Mike Johnson',
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    category: 'fishing-spot',
    tags: ['trout', 'quiet'],
  },
  {
    id: '2',
    title: 'Eagle Peak Summit',
    description: 'Amazing 360-degree views. Steep climb but worth it.',
    latitude: 40.7580,
    longitude: -73.9855,
    visibility: 'public',
    createdBy: {
      id: 'user2',
      name: 'Sarah Martinez',
    },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    category: 'viewpoint',
    tags: ['summit', 'views', 'challenging'],
  },
  {
    id: '3',
    title: 'Hidden Campsite',
    description: 'Off the beaten path. No facilities but very peaceful.',
    latitude: 40.7489,
    longitude: -73.9680,
    visibility: 'only-me',
    createdBy: {
      id: 'user3',
      name: 'Tom Anderson',
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    category: 'camping',
    tags: ['primitive', 'quiet'],
  },
];
