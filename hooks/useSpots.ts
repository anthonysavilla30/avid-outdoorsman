
import { useState, useEffect } from 'react';
import { Spot, Review, SpotType } from '@/types/Review';
import { spotService } from '@/services/spotService';

export function useSpots(filters?: {
  type?: SpotType;
  minRating?: number;
}) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadSpots();
  }, [filters?.type, filters?.minRating]);

  const loadSpots = async () => {
    setLoading(true);
    const { data, error } = await spotService.getSpots(filters);
    if (error) {
      setError(error);
    } else {
      setSpots(data);
    }
    setLoading(false);
  };

  const createSpot = async (spot: Omit<Spot, 'id' | 'averageRating' | 'totalReviews'>) => {
    const { data, error } = await spotService.createSpot(spot);
    if (!error && data) {
      setSpots([data, ...spots]);
    }
    return { data, error };
  };

  return {
    spots,
    loading,
    error,
    refresh: loadSpots,
    createSpot,
  };
}

export function useSpotReviews(spotId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadReviews();
  }, [spotId]);

  const loadReviews = async () => {
    setLoading(true);
    const { data, error } = await spotService.getSpotReviews(spotId);
    if (error) {
      setError(error);
    } else {
      setReviews(data);
    }
    setLoading(false);
  };

  const addReview = async (review: Omit<Review, 'id' | 'date' | 'helpful'>) => {
    const { data, error } = await spotService.addReview(review);
    if (!error && data) {
      setReviews([data, ...reviews]);
    }
    return { data, error };
  };

  return {
    reviews,
    loading,
    error,
    refresh: loadReviews,
    addReview,
  };
}
