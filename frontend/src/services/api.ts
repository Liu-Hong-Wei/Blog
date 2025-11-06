import type { About, Post, Tag } from '../types/types';
import { NotFoundError, APIError } from '../utils/errors';

// API URL is determined by the environment (production or development)
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';

// 通用请求处理函数
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError(`Resource not found: ${endpoint}`);
    }
    throw new APIError(`API error: ${response.statusText}`, response.status);
  }

  return response.json() as Promise<T>;
}

// 定义分页响应的类型
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// 博客文章API
export const PostsAPI = {
  getAll: (): Promise<Post[]> => 
    fetchAPI<PaginatedResponse<Post>>('posts/')
      .then(response => response.results),
  getBySlug: (slug: string): Promise<Post> => fetchAPI<Post>(`posts/${slug}/`),
  getByTag: (tagSlug: string): Promise<Post[]> => 
    fetchAPI<PaginatedResponse<Post>>(`posts/by_tag/?tag=${tagSlug}`)
      .then(response => response.results),
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