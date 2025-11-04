
import { Post } from '@/types/Post';
import { Spot } from '@/types/Review';
import { Recommendation, UserPreferences } from '@/types/Recommendation';

export class RecommendationEngine {
  private userPreferences: UserPreferences;

  constructor(preferences: UserPreferences) {
    this.userPreferences = preferences;
  }

  calculatePostScore(post: Post): number {
    let score = 50; // Base score

    // Activity preference match
    if (this.userPreferences.favoriteActivities.includes(post.activity)) {
      score += 20;
    }

    // Difficulty preference match
    if (post.conditions?.difficulty && 
        this.userPreferences.preferredDifficulty.includes(post.conditions.difficulty)) {
      score += 15;
    }

    // Tag overlap
    const tagOverlap = post.tags.filter(tag => 
      this.userPreferences.activityHistory.includes(tag)
    ).length;
    score += Math.min(tagOverlap * 5, 15);

    // Popularity factor
    score += Math.min(post.likes / 10, 10);

    // Recency factor
    const hoursSincePost = (Date.now() - post.timestamp.getTime()) / (1000 * 60 * 60);
    if (hoursSincePost < 24) {
      score += 10;
    } else if (hoursSincePost < 72) {
      score += 5;
    }

    return Math.min(score, 100);
  }

  calculateSpotScore(spot: Spot): number {
    let score = 50; // Base score

    // Activity type match
    if (this.userPreferences.favoriteActivities.includes(spot.type)) {
      score += 20;
    }

    // Difficulty preference match
    if (this.userPreferences.preferredDifficulty.includes(spot.difficulty)) {
      score += 15;
    }

    // Rating factor
    score += spot.rating * 5;

    // Review count factor
    score += Math.min(spot.reviewCount / 5, 10);

    return Math.min(score, 100);
  }

  generateRecommendations(posts: Post[], spots: Spot[]): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Score and rank posts
    const scoredPosts = posts.map(post => ({
      post,
      score: this.calculatePostScore(post),
    })).sort((a, b) => b.score - a.score);

    // Score and rank spots
    const scoredSpots = spots.map(spot => ({
      spot,
      score: this.calculateSpotScore(spot),
    })).sort((a, b) => b.score - a.score);

    // Add top posts
    scoredPosts.slice(0, 5).forEach((item, index) => {
      recommendations.push({
        id: `post-${index}`,
        type: 'post',
        item: item.post,
        score: item.score,
        reason: this.getRecommendationReason(item.post, item.score),
        category: this.getRecommendationCategory(item.score),
      });
    });

    // Add top spots
    scoredSpots.slice(0, 3).forEach((item, index) => {
      recommendations.push({
        id: `spot-${index}`,
        type: 'spot',
        item: item.spot,
        score: item.score,
        reason: this.getSpotRecommendationReason(item.spot, item.score),
        category: this.getRecommendationCategory(item.score),
      });
    });

    return recommendations.sort((a, b) => b.score - a.score);
  }

  private getRecommendationReason(post: Post, score: number): string {
    if (this.userPreferences.favoriteActivities.includes(post.activity)) {
      return `Based on your ${post.activity} activity`;
    }
    if (score > 80) {
      return 'Highly rated by the community';
    }
    if (post.likes > 30) {
      return 'Trending in your area';
    }
    return 'Recommended for you';
  }

  private getSpotRecommendationReason(spot: Spot, score: number): string {
    if (this.userPreferences.favoriteActivities.includes(spot.type)) {
      return `Perfect for ${spot.type}`;
    }
    if (spot.rating >= 4.5) {
      return 'Highly rated spot';
    }
    return 'Popular in your area';
  }

  private getRecommendationCategory(score: number): 'trending' | 'personalized' | 'nearby' | 'similar' {
    if (score >= 90) return 'personalized';
    if (score >= 75) return 'trending';
    if (score >= 60) return 'nearby';
    return 'similar';
  }
}
