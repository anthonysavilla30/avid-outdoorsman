
# Backend Integration Guide

This guide explains how to use the backend integration in your Avid Outdoorsman app.

## Overview

The app now includes a complete backend integration using Supabase. The integration provides:

- **Authentication**: User sign up, sign in, and profile management
- **Posts**: Create, read, like, and comment on posts
- **Spots**: Discover and review outdoor locations
- **Trips**: Plan and join outdoor trips with other users
- **Regulations**: Access hunting and fishing regulations
- **Real-time Updates**: Live updates for posts, likes, and comments

## Getting Started

### 1. Enable Supabase

To use the backend features:

1. Click the **Supabase** button in Natively
2. Connect to an existing Supabase project or create a new one
3. Copy your project URL and anon key

### 2. Set Environment Variables

Add these to your project environment:

```
EXPO_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Up Database

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the SQL migrations from `docs/DATABASE_SCHEMA.md`
4. Run the migrations to create all tables and functions

### 4. Create Storage Buckets

In Supabase Storage, create these buckets:
- `avatars` (for user profile pictures)
- `post-images` (for post photos)
- `spot-photos` (for spot photos)
- `trip-images` (for trip photos)

## Using the Backend

### Authentication

The app uses the `AuthContext` to manage user authentication:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth();

  // Check if user is logged in
  if (user) {
    return <Text>Welcome, {user.name}!</Text>;
  }

  // Sign in
  const handleSignIn = async () => {
    const { error } = await signIn('email@example.com', 'password');
    if (error) {
      console.error('Sign in error:', error);
    }
  };

  return <Button onPress={handleSignIn}>Sign In</Button>;
}
```

### Posts

Use the `usePosts` hook to manage posts:

```typescript
import { usePosts } from '@/hooks/usePosts';

function PostsScreen() {
  const { posts, loading, createPost, likePost } = usePosts({
    activity: 'fishing',
    radius: 50,
  });

  // Create a new post
  const handleCreatePost = async () => {
    const { data, error } = await createPost({
      author: { name: 'John', avatar: '', distance: 0 },
      activity: 'fishing',
      location: 'Silver Creek',
      content: 'Great fishing today!',
      images: [],
      tags: ['trout', 'fly-fishing'],
    });
  };

  // Like a post
  const handleLike = async (postId: string) => {
    await likePost(postId);
  };

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
    />
  );
}
```

### Spots

Use the `useSpots` hook to manage outdoor spots:

```typescript
import { useSpots, useSpotReviews } from '@/hooks/useSpots';

function SpotsScreen() {
  const { spots, loading, createSpot } = useSpots({
    type: 'trail',
    minRating: 4,
  });

  const { reviews, addReview } = useSpotReviews(spotId);

  // Add a review
  const handleAddReview = async () => {
    await addReview({
      spotId: 'spot-id',
      userId: 'user-id',
      userName: 'John',
      userAvatar: '',
      rating: 5,
      title: 'Amazing trail!',
      content: 'Beautiful views and well maintained.',
      photos: [],
      tags: ['scenic', 'easy'],
    });
  };
}
```

### Trips

Use the `useTrips` hook to manage trips:

```typescript
import { useTrips } from '@/hooks/useTrips';

function TripsScreen() {
  const { trips, loading, createTrip, joinTrip } = useTrips({
    status: 'upcoming',
  });

  // Create a trip
  const handleCreateTrip = async () => {
    await createTrip({
      title: 'Weekend Hiking Trip',
      description: 'Join us for a scenic hike!',
      type: 'hiking',
      organizer: { id: 'user-id', name: 'John', avatar: '' },
      location: {
        name: 'Eagle Peak',
        latitude: 40.7128,
        longitude: -74.0060,
      },
      startDate: new Date(),
      endDate: new Date(),
      status: 'upcoming',
      privacy: 'public',
      participants: [],
      difficulty: 'moderate',
      gearRequired: ['hiking boots', 'water'],
      images: [],
    });
  };

  // Join a trip
  const handleJoinTrip = async (tripId: string) => {
    await joinTrip(tripId);
  };
}
```

## Offline Support

The app works offline by falling back to mock data when Supabase is not configured or when there's no internet connection. All services check `isSupabaseConfigured()` before making API calls.

When offline:
- Posts, spots, trips, and regulations use mock data
- User actions are queued (future enhancement)
- The app displays an offline indicator

## Services

The app includes these service modules:

- **authService**: User authentication and profile management
- **postService**: Post creation, retrieval, likes, and comments
- **spotService**: Spot management and reviews
- **tripService**: Trip planning and journal entries
- **regulationService**: Hunting and fishing regulations

All services are located in the `services/` directory.

## Hooks

Custom hooks provide easy access to backend data:

- **useAuth**: Authentication state and methods
- **usePosts**: Posts feed and interactions
- **useSpots**: Spots discovery and reviews
- **useTrips**: Trip planning and participation

All hooks are located in the `hooks/` directory.

## Real-time Features

The app supports real-time updates for:
- New posts in your feed
- Likes and comments on posts
- Trip participant updates

To enable real-time features, make sure to enable Realtime in your Supabase project settings for the relevant tables.

## Security

The app uses Row Level Security (RLS) policies to ensure:
- Users can only update their own profiles
- Users can only delete their own posts
- Private trips are only visible to participants
- All data access is properly authenticated

## Testing

To test the backend integration:

1. **Without Supabase**: The app will use mock data automatically
2. **With Supabase**: Set up your environment variables and database, then test all features

## Troubleshooting

### "Supabase not configured" error
- Make sure you've set the environment variables
- Restart the Expo dev server after adding environment variables

### Authentication not working
- Check that you've run all database migrations
- Verify your Supabase project URL and anon key are correct
- Check the Supabase dashboard for authentication errors

### Data not loading
- Check your internet connection
- Verify RLS policies are set up correctly
- Check the Supabase logs for errors

## Next Steps

1. Customize the database schema for your needs
2. Add more features like messaging, notifications, etc.
3. Implement image upload to Supabase Storage
4. Add offline queue for user actions
5. Implement push notifications

## Support

For more information:
- [Supabase Documentation](https://supabase.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
