import { config } from '../config/env';

// 定义接口类型
export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  slug: string;
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface About {
  id: number;
  title: string;
  content: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

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

// 博客文章API
export const PostsAPI = {
  getAll: () => fetchAPI<Post[]>('posts/'),
  getBySlug: (slug: string) => fetchAPI<Post>(`posts/${slug}/`),
  getByTag: (tagSlug: string) => fetchAPI<Post[]>(`posts/by_tag/?tag=${tagSlug}`),
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