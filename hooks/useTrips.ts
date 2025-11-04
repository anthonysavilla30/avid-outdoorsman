
import { useState, useEffect } from 'react';
import { Trip, TripStatus } from '@/types/Trip';
import { tripService } from '@/services/tripService';

export function useTrips(filters?: {
  status?: TripStatus;
  userId?: string;
}) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadTrips();
  }, [filters?.status, filters?.userId]);

  const loadTrips = async () => {
    setLoading(true);
    const { data, error } = await tripService.getTrips(filters);
    if (error) {
      setError(error);
    } else {
      setTrips(data);
    }
    setLoading(false);
  };

  const createTrip = async (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await tripService.createTrip(trip);
    if (!error && data) {
      setTrips([data, ...trips]);
    }
    return { data, error };
  };

  const joinTrip = async (tripId: string) => {
    const { error } = await tripService.joinTrip(tripId);
    if (!error) {
      await loadTrips(); // Reload to get updated participant list
    }
    return { error };
  };

  return {
    trips,
    loading,
    error,
    refresh: loadTrips,
    createTrip,
    joinTrip,
  };
}
