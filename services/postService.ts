
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { Post, ActivityType } from '@/types/Post';
import { mockPosts } from '@/data/mockPosts';

class PostService {
  // Create a new post
  async createPost(post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments'>): Promise<{ data: Post | null; error: Error | null }> {
    const supabase = getSupabase();
    if (!supabase) {
      console.log('⚠️ Supabase not configured, using mock data');
      return { data: null, error: new Error('Supabase not configured') };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          activity: post.activity,
          location: post.location,
          content: post.content,
          images: post.images,
          tags: post.tags,
          conditions: post.conditions,
        })
        .select()
        .single();

      if (error) throw error;

      return { data: this.mapPostFromDb(data), error: null };
    } catch (error) {
      console.error('Create post error:', error);
      return { data: null, error: error as Error };
    }
  }

  // Get posts feed
  async getPosts(filters?: {
    activity?: ActivityType;
    radius?: number;
    userLocation?: { latitude: number; longitude: number };
  }): Promise<{ data: Post[]; error: Error | null }> {
    const supabase = getSupabase();
    if (!supabase) {
      console.log('⚠️ Supabase not configured, using mock data');
      return { data: mockPosts, error: null };
    }

    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            avatar
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (filters?.activity && filters.activity !== 'all') {
        query = query.eq('activity', filters.activity);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data.map(this.mapPostFromDb), error: null };
    } catch (error) {
      console.error('Get posts error:', error);
      return { data: mockPosts, error: error as Error };
    }
  }

  // Get single post
  async getPost(postId: string): Promise<{ data: Post | null; error: Error | null }> {
    const supabase = getSupabase();
    if (!supabase) {
      const post = mockPosts.find(p => p.id === postId);
      return { data: post || null, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            avatar
          )
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;

      return { data: this.mapPostFromDb(data), error: null };
    } catch (error) {
      console.error('Get post error:', error);
      return { data: null, error: error as Error };
    }
  }

  // Like a post
  async likePost(postId: string): Promise<{ error: Error | null }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id,
        });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Like post error:', error);
      return { error: error as Error };
    }
  }

  // Unlike a post
  async unlikePost(postId: string): Promise<{ error: Error | null }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Unlike post error:', error);
      return { error: error as Error };
    }
  }

  // Add comment to post
  async addComment(postId: string, content: string): Promise<{ error: Error | null }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
        });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Add comment error:', error);
      return { error: error as Error };
    }
  }

  // Helper to map database post to Post type
  private mapPostFromDb(dbPost: any): Post {
    return {
      id: dbPost.id,
      author: {
        name: dbPost.profiles?.name || 'Unknown',
        avatar: dbPost.profiles?.avatar || '',
        distance: 0, // Calculate based on user location
      },
      activity: dbPost.activity,
      location: dbPost.location,
      timestamp: new Date(dbPost.created_at),
      content: dbPost.content,
      images: dbPost.images || [],
      likes: dbPost.likes_count || 0,
      comments: dbPost.comments_count || 0,
      tags: dbPost.tags || [],
      conditions: dbPost.conditions,
    };
  }
}

export const postService = new PostService();
