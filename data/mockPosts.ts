
import { Post } from '@/types/Post';

export const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      distance: 5,
    },
    activity: 'fishing',
    location: 'Silver Creek',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    content: 'Caught a 5lb rainbow trout this morning! Water level is perfect, using size 12 elk hair caddis. Best spot is near the old bridge.',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'],
    likes: 24,
    comments: 8,
    tags: ['trout', 'fly-fishing', 'morning'],
    conditions: {
      weather: 'Partly Cloudy',
      difficulty: 'moderate',
      crowded: false,
    },
  },
  {
    id: '2',
    author: {
      name: 'Sarah Martinez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      distance: 12,
    },
    activity: 'hiking',
    location: 'Eagle Peak Trail',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    content: 'Trail conditions are excellent! No mud, clear views from the summit. Saw a family of deer at mile marker 3. Bring plenty of water.',
    images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop'],
    likes: 42,
    comments: 15,
    tags: ['trail', 'summit', 'wildlife'],
    conditions: {
      weather: 'Clear',
      difficulty: 'hard',
      crowded: false,
    },
  },
  {
    id: '3',
    author: {
      name: 'Tom Anderson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      distance: 8,
    },
    activity: 'hunting',
    location: 'North Ridge WMA',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    content: 'Saw 3 bucks this morning near the oak grove. Lots of fresh scrapes and rubs. Wind was perfect from the north. Season opens in 2 weeks!',
    images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop'],
    likes: 31,
    comments: 12,
    tags: ['deer', 'scouting', 'pre-season'],
    conditions: {
      weather: 'Foggy',
      difficulty: 'moderate',
      crowded: false,
    },
  },
  {
    id: '4',
    author: {
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      distance: 15,
    },
    activity: 'camping',
    location: 'Pine Lake Campground',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    content: 'Amazing spot! Site 12 has the best lake view. Water is clean, fire pit in great shape. Saw the Milky Way last night. No cell service but worth it.',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop'],
    likes: 56,
    comments: 22,
    tags: ['camping', 'stargazing', 'lakeside'],
    conditions: {
      weather: 'Clear',
      difficulty: 'easy',
      crowded: false,
    },
  },
  {
    id: '5',
    author: {
      name: 'Jake Wilson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      distance: 3,
    },
    activity: 'fishing',
    location: 'Willow Creek',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    content: 'Creek is running high after yesterday&apos;s rain. Bass are hitting topwater lures near the fallen logs. Caught and released 8 today!',
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'],
    likes: 38,
    comments: 11,
    tags: ['bass', 'topwater', 'catch-release'],
    conditions: {
      weather: 'Overcast',
      difficulty: 'easy',
      crowded: true,
    },
  },
];
