import { useState, useEffect } from 'react';
import { PostsAPI } from '../services/api';

export function usePosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await PostsAPI.getAll();
        // If paginated, use data.results; otherwise, use data directly
        setPosts(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}