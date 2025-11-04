
import { Recommendation } from '@/types/Recommendation';
import { mockPosts } from './mockPosts';
import { mockSpots } from './mockSpots';

export const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'post',
    item: mockPosts[0],
    score: 95,
    reason: 'Based on your fishing activity',
    category: 'personalized',
  },
  {
    id: '2',
    type: 'spot',
    item: mockSpots[0],
    score: 88,
    reason: 'Popular in your area',
    category: 'nearby',
  },
  {
    id: '3',
    type: 'post',
    item: mockPosts[1],
    score: 92,
    reason: 'Trending in hiking community',
    category: 'trending',
  },
  {
    id: '4',
    type: 'spot',
    item: mockSpots[1],
    score: 85,
    reason: 'Similar to spots you saved',
    category: 'similar',
  },
  {
    id: '5',
    type: 'post',
    item: mockPosts[2],
    score: 90,
    reason: 'Matches your preferred difficulty',
    category: 'personalized',
  },
];
