
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Trip, TripJournalEntry, TripStatus } from '@/types/Trip';
import { mockTrips } from '@/data/mockTrips';

class TripService {
  // Get all trips
  async getTrips(filters?: {
    status?: TripStatus;
    userId?: string;
  }): Promise<{ data: Trip[]; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data');
      return { data: mockTrips, error: null };
    }

    try {
      let query = supabase
        .from('trips')
        .select(`
          *,
          organizer:organizer_id (
            id,
            name,
            avatar
          ),
          participants:trip_participants (
            user_id,
            status,
            role,
            profiles (
              id,
              name,
              avatar
            )
          )
        `)
        .order('start_date', { ascending: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.userId) {
        query = query.or(`organizer_id.eq.${filters.userId},participants.user_id.eq.${filters.userId}`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data.map(this.mapTripFromDb), error: null };
    } catch (error) {
      console.error('Get trips error:', error);
      return { data: mockTrips, error: error as Error };
    }
  }

  // Get single trip
  async getTrip(tripId: string): Promise<{ data: Trip | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      const trip = mockTrips.find(t => t.id === tripId);
      return { data: trip || null, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          organizer:organizer_id (
            id,
            name,
            avatar
          ),
          participants:trip_participants (
            user_id,
            status,
            role,
            profiles (
              id,
              name,
              avatar
            )
          )
        `)
        .eq('id', tripId)
        .single();

      if (error) throw error;

      return { data: this.mapTripFromDb(data), error: null };
    } catch (error) {
      console.error('Get trip error:', error);
      return { data: null, error: error as Error };
    }
  }

  // Create a new trip
  async createTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ data: Trip | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('trips')
        .insert({
          title: trip.title,
          description: trip.description,
          type: trip.type,
          organizer_id: user.id,
          location_name: trip.location.name,
          location_latitude: trip.location.latitude,
          location_longitude: trip.location.longitude,
          location_address: trip.location.address,
          start_date: trip.startDate.toISOString(),
          end_date: trip.endDate.toISOString(),
          status: trip.status,
          privacy: trip.privacy,
          max_participants: trip.maxParticipants,
          difficulty: trip.difficulty,
          gear_required: trip.gearRequired,
          meeting_point: trip.meetingPoint,
          notes: trip.notes,
          images: trip.images,
        })
        .select()
        .single();

      if (error) throw error;

      return { data: this.mapTripFromDb(data), error: null };
    } catch (error) {
      console.error('Create trip error:', error);
      return { data: null, error: error as Error };
    }
  }

  // Join a trip
  async joinTrip(tripId: string): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('trip_participants')
        .insert({
          trip_id: tripId,
          user_id: user.id,
          status: 'going',
          role: 'participant',
        });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Join trip error:', error);
      return { error: error as Error };
    }
  }

  // Create journal entry
  async createJournalEntry(entry: Omit<TripJournalEntry, 'id' | 'createdAt'>): Promise<{ data: TripJournalEntry | null; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          trip_id: entry.tripId,
          user_id: user.id,
          title: entry.title,
          type: entry.type,
          location_name: entry.location.name,
          location_latitude: entry.location.latitude,
          location_longitude: entry.location.longitude,
          start_time: entry.startTime.toISOString(),
          end_time: entry.endTime.toISOString(),
          distance: entry.distance,
          duration: entry.duration,
          elevation_gain: entry.elevationGain,
          photos: entry.photos,
          notes: entry.notes,
          weather: entry.weather,
          route: entry.route,
          highlights: entry.highlights,
          companions: entry.companions,
          gear: entry.gear,
          species: entry.species,
          is_public: entry.isPublic,
        })
        .select()
        .single();

      if (error) throw error;

      return { data: this.mapJournalEntryFromDb(data), error: null };
    } catch (error) {
      console.error('Create journal entry error:', error);
      return { data: null, error: error as Error };
    }
  }

  // Helper to map database trip to Trip type
  private mapTripFromDb(dbTrip: any): Trip {
    return {
      id: dbTrip.id,
      title: dbTrip.title,
      description: dbTrip.description,
      type: dbTrip.type,
      organizer: {
        id: dbTrip.organizer?.id || '',
        name: dbTrip.organizer?.name || 'Unknown',
        avatar: dbTrip.organizer?.avatar || '',
      },
      location: {
        name: dbTrip.location_name,
        latitude: dbTrip.location_latitude,
        longitude: dbTrip.location_longitude,
        address: dbTrip.location_address,
      },
      startDate: new Date(dbTrip.start_date),
      endDate: new Date(dbTrip.end_date),
      status: dbTrip.status,
      privacy: dbTrip.privacy,
      participants: dbTrip.participants?.map((p: any) => ({
        id: p.profiles?.id || '',
        name: p.profiles?.name || 'Unknown',
        avatar: p.profiles?.avatar || '',
        status: p.status,
        role: p.role,
      })) || [],
      maxParticipants: dbTrip.max_participants,
      difficulty: dbTrip.difficulty,
      gearRequired: dbTrip.gear_required || [],
      meetingPoint: dbTrip.meeting_point,
      notes: dbTrip.notes,
      images: dbTrip.images || [],
      createdAt: new Date(dbTrip.created_at),
      updatedAt: new Date(dbTrip.updated_at),
    };
  }

  // Helper to map database journal entry to TripJournalEntry type
  private mapJournalEntryFromDb(dbEntry: any): TripJournalEntry {
    return {
      id: dbEntry.id,
      tripId: dbEntry.trip_id,
      userId: dbEntry.user_id,
      title: dbEntry.title,
      type: dbEntry.type,
      location: {
        name: dbEntry.location_name,
        latitude: dbEntry.location_latitude,
        longitude: dbEntry.location_longitude,
      },
      startTime: new Date(dbEntry.start_time),
      endTime: new Date(dbEntry.end_time),
      distance: dbEntry.distance,
      duration: dbEntry.duration,
      elevationGain: dbEntry.elevation_gain,
      photos: dbEntry.photos || [],
      notes: dbEntry.notes,
      weather: dbEntry.weather,
      route: dbEntry.route,
      highlights: dbEntry.highlights || [],
      companions: dbEntry.companions || [],
      gear: dbEntry.gear || [],
      species: dbEntry.species || [],
      createdAt: new Date(dbEntry.created_at),
      isPublic: dbEntry.is_public,
    };
  }
}

export const tripService = new TripService();
