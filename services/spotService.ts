
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Spot, Review, SpotType, DifficultyLevel } from '@/types/Review';
import { mockSpots, mockReviews } from '@/data/mockSpots';

class SpotService {
  // Get all spots
  async getSpots(filters?: {
    type?: SpotType;
    minRating?: number;
  }): Promise<{ data: Spot[]; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data');
      return { data: mockSpots, error: null };
    }

    try {
      let query = supabase
        .from('spots')
        .select('*')
        .order('average_rating', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.minRating) {
        query = query.gte('average_rating', filters.minRating);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data.map(this.mapSpotFromDb), error: null };
    } catch (error) {
      console.error('Get spots error:', error);
      return { data: mockSpots, error: error as Error };
    }
  }

  // Get single spot
  async getSpot(spotId: string): Promise<{ data: Spot | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      const spot = mockSpots.find(s => s.id === spotId);
      return { data: spot || null, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('spots')
        .select('*')
        .eq('id', spotId)
        .single();

      if (error) throw error;

      return { data: this.mapSpotFromDb(data), error: null };
    } catch (error) {
      console.error('Get spot error:', error);
      return { data: null, error: error as Error };
    }
  }

  // Create a new spot
  async createSpot(spot: Omit<Spot, 'id' | 'averageRating' | 'totalReviews'>): Promise<{ data: Spot | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('spots')
        .insert({
          name: spot.name,
          type: spot.type,
          latitude: spot.latitude,
          longitude: spot.longitude,
          description: spot.description,
          difficulty: spot.difficulty,
          photos: spot.photos,
          amenities: spot.amenities,
          best_time_to_visit: spot.bestTimeToVisit,
          accessibility: spot.accessibility,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      return { data: this.mapSpotFromDb(data), error: null };
    } catch (error) {
      console.error('Create spot error:', error);
      return { data: null, error: error as Error };
    }
  }

  // Get reviews for a spot
  async getSpotReviews(spotId: string): Promise<{ data: Review[]; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      const reviews = mockReviews.filter(r => r.spotId === spotId);
      return { data: reviews, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            avatar
          )
        `)
        .eq('spot_id', spotId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data.map(this.mapReviewFromDb), error: null };
    } catch (error) {
      console.error('Get spot reviews error:', error);
      return { data: [], error: error as Error };
    }
  }

  // Add review to spot
  async addReview(review: Omit<Review, 'id' | 'date' | 'helpful'>): Promise<{ data: Review | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          spot_id: review.spotId,
          user_id: user.id,
          rating: review.rating,
          difficulty: review.difficulty,
          title: review.title,
          content: review.content,
          photos: review.photos,
          tags: review.tags,
        })
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            avatar
          )
        `)
        .single();

      if (error) throw error;

      return { data: this.mapReviewFromDb(data), error: null };
    } catch (error) {
      console.error('Add review error:', error);
      return { data: null, error: error as Error };
    }
  }

  // Helper to map database spot to Spot type
  private mapSpotFromDb(dbSpot: any): Spot {
    return {
      id: dbSpot.id,
      name: dbSpot.name,
      type: dbSpot.type,
      latitude: dbSpot.latitude,
      longitude: dbSpot.longitude,
      description: dbSpot.description,
      averageRating: dbSpot.average_rating || 0,
      totalReviews: dbSpot.total_reviews || 0,
      difficulty: dbSpot.difficulty,
      photos: dbSpot.photos || [],
      amenities: dbSpot.amenities || [],
      bestTimeToVisit: dbSpot.best_time_to_visit,
      accessibility: dbSpot.accessibility,
    };
  }

  // Helper to map database review to Review type
  private mapReviewFromDb(dbReview: any): Review {
    return {
      id: dbReview.id,
      spotId: dbReview.spot_id,
      userId: dbReview.user_id,
      userName: dbReview.profiles?.name || 'Unknown',
      userAvatar: dbReview.profiles?.avatar || '',
      rating: dbReview.rating,
      difficulty: dbReview.difficulty,
      title: dbReview.title,
      content: dbReview.content,
      photos: dbReview.photos || [],
      date: new Date(dbReview.created_at),
      helpful: dbReview.helpful_count || 0,
      tags: dbReview.tags || [],
    };
  }
}

export const spotService = new SpotService();
