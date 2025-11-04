
import { Post } from '@/types/Post';
import { AdvancedFilter } from '@/types/Filter';

export class FilterEngine {
  static applyFilters(posts: Post[], filter: AdvancedFilter): Post[] {
    let filtered = [...posts];

    // Activity filter
    if (filter.activities.length > 0) {
      filtered = filtered.filter(post => 
        filter.activities.includes(post.activity)
      );
    }

    // Date range filter
    if (filter.dateRange.start) {
      filtered = filtered.filter(post => 
        post.timestamp >= filter.dateRange.start!
      );
    }
    if (filter.dateRange.end) {
      filtered = filtered.filter(post => 
        post.timestamp <= filter.dateRange.end!
      );
    }

    // Difficulty filter
    if (filter.difficulty.length > 0) {
      filtered = filtered.filter(post => 
        post.conditions?.difficulty && 
        filter.difficulty.includes(post.conditions.difficulty)
      );
    }

    // Weather filter
    if (filter.weather.length > 0) {
      filtered = filtered.filter(post => 
        post.conditions?.weather && 
        filter.weather.includes(post.conditions.weather)
      );
    }

    // Crowded filter
    if (filter.crowded !== null) {
      filtered = filtered.filter(post => 
        post.conditions?.crowded === filter.crowded
      );
    }

    // Tags filter
    if (filter.tags.length > 0) {
      filtered = filtered.filter(post => 
        filter.tags.some(tag => post.tags.includes(tag))
      );
    }

    // Min likes filter
    if (filter.minLikes > 0) {
      filtered = filtered.filter(post => post.likes >= filter.minLikes);
    }

    // Has images filter
    if (filter.hasImages) {
      filtered = filtered.filter(post => post.images.length > 0);
    }

    // Radius filter (mock - would use actual location in production)
    // This is handled separately in the component

    // Sort
    filtered = this.sortPosts(filtered, filter.sortBy);

    return filtered;
  }

  private static sortPosts(posts: Post[], sortBy: AdvancedFilter['sortBy']): Post[] {
    switch (sortBy) {
      case 'recent':
        return posts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      case 'popular':
        return posts.sort((a, b) => b.likes - a.likes);
      case 'distance':
        return posts.sort((a, b) => a.author.distance - b.author.distance);
      case 'relevant':
        // Would use recommendation score in production
        return posts.sort((a, b) => b.likes - a.likes);
      default:
        return posts;
    }
  }

  static getAvailableTags(posts: Post[]): string[] {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  static getAvailableWeather(posts: Post[]): string[] {
    const weather = new Set<string>();
    posts.forEach(post => {
      if (post.conditions?.weather) {
        weather.add(post.conditions.weather);
      }
    });
    return Array.from(weather).sort();
  }
}
