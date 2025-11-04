
# Avid Outdoorsman Database Schema

This document describes the Supabase database schema for the Avid Outdoorsman app.

## Setup Instructions

1. **Enable Supabase** in your Natively project by clicking the Supabase button
2. **Create a new Supabase project** or connect to an existing one
3. **Run the SQL migrations** below in your Supabase SQL Editor
4. **Set environment variables** in your project:
   - `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key

## Tables

### profiles
User profile information (extends Supabase auth.users)

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  favorite_activities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### posts
User posts about outdoor activities

```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity TEXT NOT NULL,
  location TEXT NOT NULL,
  content TEXT NOT NULL,
  images TEXT[],
  tags TEXT[],
  conditions JSONB,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX posts_user_id_idx ON posts(user_id);
CREATE INDEX posts_activity_idx ON posts(activity);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
```

### post_likes
Track which users liked which posts

```sql
CREATE TABLE post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Likes are viewable by everyone"
  ON post_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like posts"
  ON post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX post_likes_post_id_idx ON post_likes(post_id);
CREATE INDEX post_likes_user_id_idx ON post_likes(user_id);

-- Trigger to update likes_count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_likes_count_trigger
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();
```

### post_comments
Comments on posts

```sql
CREATE TABLE post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Comments are viewable by everyone"
  ON post_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON post_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX post_comments_post_id_idx ON post_comments(post_id);
CREATE INDEX post_comments_user_id_idx ON post_comments(user_id);

-- Trigger to update comments_count
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_comments_count_trigger
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();
```

### spots
Outdoor locations (trails, fishing holes, campsites, etc.)

```sql
CREATE TABLE spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description TEXT,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  difficulty TEXT,
  photos TEXT[],
  amenities TEXT[],
  best_time_to_visit TEXT,
  accessibility TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Spots are viewable by everyone"
  ON spots FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create spots"
  ON spots FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own spots"
  ON spots FOR UPDATE
  USING (auth.uid() = created_by);

-- Indexes
CREATE INDEX spots_type_idx ON spots(type);
CREATE INDEX spots_location_idx ON spots(latitude, longitude);
CREATE INDEX spots_rating_idx ON spots(average_rating DESC);
```

### reviews
Reviews for spots

```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  difficulty TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  photos TEXT[],
  tags TEXT[],
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(spot_id, user_id)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX reviews_spot_id_idx ON reviews(spot_id);
CREATE INDEX reviews_user_id_idx ON reviews(user_id);

-- Trigger to update spot ratings
CREATE OR REPLACE FUNCTION update_spot_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE spots
  SET 
    average_rating = (SELECT AVG(rating) FROM reviews WHERE spot_id = COALESCE(NEW.spot_id, OLD.spot_id)),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE spot_id = COALESCE(NEW.spot_id, OLD.spot_id))
  WHERE id = COALESCE(NEW.spot_id, OLD.spot_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER spot_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_spot_rating();
```

### trips
Planned outdoor trips

```sql
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  location_name TEXT NOT NULL,
  location_latitude DOUBLE PRECISION NOT NULL,
  location_longitude DOUBLE PRECISION NOT NULL,
  location_address TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  privacy TEXT NOT NULL DEFAULT 'public',
  max_participants INTEGER,
  difficulty TEXT NOT NULL,
  gear_required TEXT[],
  meeting_point TEXT,
  notes TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public trips are viewable by everyone"
  ON trips FOR SELECT
  USING (privacy = 'public' OR auth.uid() = organizer_id);

CREATE POLICY "Authenticated users can create trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own trips"
  ON trips FOR UPDATE
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own trips"
  ON trips FOR DELETE
  USING (auth.uid() = organizer_id);

-- Indexes
CREATE INDEX trips_organizer_id_idx ON trips(organizer_id);
CREATE INDEX trips_start_date_idx ON trips(start_date);
CREATE INDEX trips_status_idx ON trips(status);
```

### trip_participants
Track who is participating in trips

```sql
CREATE TABLE trip_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'invited',
  role TEXT NOT NULL DEFAULT 'participant',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- Enable RLS
ALTER TABLE trip_participants ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Trip participants are viewable by everyone"
  ON trip_participants FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can join trips"
  ON trip_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participation"
  ON trip_participants FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can leave trips"
  ON trip_participants FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX trip_participants_trip_id_idx ON trip_participants(trip_id);
CREATE INDEX trip_participants_user_id_idx ON trip_participants(user_id);
```

### journal_entries
Trip journal entries

```sql
CREATE TABLE journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  location_name TEXT NOT NULL,
  location_latitude DOUBLE PRECISION NOT NULL,
  location_longitude DOUBLE PRECISION NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  distance DOUBLE PRECISION,
  duration INTEGER NOT NULL,
  elevation_gain DOUBLE PRECISION,
  photos TEXT[],
  notes TEXT,
  weather JSONB,
  route JSONB,
  highlights TEXT[],
  companions TEXT[],
  gear TEXT[],
  species TEXT[],
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public journal entries are viewable by everyone"
  ON journal_entries FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create journal entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX journal_entries_user_id_idx ON journal_entries(user_id);
CREATE INDEX journal_entries_trip_id_idx ON journal_entries(trip_id);
CREATE INDEX journal_entries_created_at_idx ON journal_entries(created_at DESC);
```

### regulations
Hunting and fishing regulations by state

```sql
CREATE TABLE regulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT NOT NULL,
  state_code TEXT NOT NULL,
  category TEXT NOT NULL,
  seasons JSONB NOT NULL,
  license_requirements TEXT[],
  special_rules TEXT[],
  last_updated TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Regulations are viewable by everyone"
  ON regulations FOR SELECT
  USING (true);

-- Indexes
CREATE INDEX regulations_state_code_idx ON regulations(state_code);
CREATE INDEX regulations_category_idx ON regulations(category);
```

## Storage Buckets

Create the following storage buckets in Supabase Storage:

### avatars
User profile pictures
- Public: Yes
- File size limit: 2MB
- Allowed MIME types: image/jpeg, image/png, image/webp

### post-images
Images attached to posts
- Public: Yes
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/png, image/webp

### spot-photos
Photos of outdoor spots
- Public: Yes
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/png, image/webp

### trip-images
Trip photos and journal entry images
- Public: Yes
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/png, image/webp

## Realtime Configuration

Enable Realtime for the following tables to get live updates:
- posts
- post_likes
- post_comments
- trip_participants

## Functions

### Search Posts by Location
```sql
CREATE OR REPLACE FUNCTION search_posts_by_location(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_miles DOUBLE PRECISION
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  activity TEXT,
  location TEXT,
  content TEXT,
  images TEXT[],
  tags TEXT[],
  conditions JSONB,
  likes_count INTEGER,
  comments_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  distance_miles DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.*,
    (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(p.location_latitude)) * 
        cos(radians(p.location_longitude) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(p.location_latitude))
      )
    ) AS distance_miles
  FROM posts p
  WHERE (
    3959 * acos(
      cos(radians(user_lat)) * 
      cos(radians(p.location_latitude)) * 
      cos(radians(p.location_longitude) - radians(user_lng)) + 
      sin(radians(user_lat)) * 
      sin(radians(p.location_latitude))
    )
  ) <= radius_miles
  ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql;
```

## Environment Variables

Add these to your `.env` file:

```
EXPO_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Next Steps

1. Run all the SQL migrations in your Supabase SQL Editor
2. Create the storage buckets
3. Enable Realtime for the specified tables
4. Set up your environment variables
5. Test the authentication flow
6. Start using the app with real backend data!
