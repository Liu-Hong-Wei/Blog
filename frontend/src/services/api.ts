import { config } from '../config/env';
import { About, Post, Tag } from '../types/types';

// API请求函数
const API_URL = config.apiUrl;

// 通用请求处理函数
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// Define the paginated response type for posts
type PaginatedPostsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
};

// 博客文章API
export const PostsAPI = {
  getAll: (): Promise<PaginatedPostsResponse> => fetchAPI<PaginatedPostsResponse>('posts/'),
  getBySlug: (slug: string): Promise<Post> => fetchAPI<Post>(`posts/${slug}/`),
  getByTag: (tagSlug: string): Promise<Post[]> => fetchAPI<Post[]>(`posts/by_tag/?tag=${tagSlug}`),
};

// 标签API
export const TagsAPI = {
  getAll: () => fetchAPI<Tag[]>('tags/'),
  getBySlug: (slug: string) => fetchAPI<Tag>(`tags/${slug}/`),
};

// 关于页面API
export const AboutAPI = {
  get: () => fetchAPI<About[]>('about/').then(data => data[0]),
};