
import { useState, useEffect } from 'react';
import { Post, ActivityType } from '@/types/Post';
import { postService } from '@/services/postService';

export function usePosts(filters?: {
  activity?: ActivityType;
  radius?: number;
  userLocation?: { latitude: number; longitude: number };
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadPosts();
  }, [filters?.activity, filters?.radius]);

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await postService.getPosts(filters);
    if (error) {
      setError(error);
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

  const createPost = async (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
    const { data, error } = await postService.createPost(post);
    if (!error && data) {
      setPosts([data, ...posts]);
    }
    return { data, error };
  };

  const likePost = async (postId: string) => {
    const { error } = await postService.likePost(postId);
    if (!error) {
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ));
    }
    return { error };
  };

  const unlikePost = async (postId: string) => {
    const { error } = await postService.unlikePost(postId);
    if (!error) {
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1) } : p
      ));
    }
    return { error };
  };

  const addComment = async (postId: string, content: string) => {
    const { error } = await postService.addComment(postId, content);
    if (!error) {
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, comments: p.comments + 1 } : p
      ));
    }
    return { error };
  };

  return {
    posts,
    loading,
    error,
    refresh: loadPosts,
    createPost,
    likePost,
    unlikePost,
    addComment,
  };
}
