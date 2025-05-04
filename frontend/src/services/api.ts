import { config } from '../config/env';

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export async function fetchApi<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(`${config.apiUrl}${endpoint}`, requestOptions);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }
  
  return response.json();
}

export const postsApi = {
  getPosts: () => fetchApi<any[]>('/posts/'),
  getPost: (id: number) => fetchApi<any>(`/posts/${id}/`),
  createPost: (data: any) => fetchApi<any>('/posts/', { method: 'POST', body: data }),
  updatePost: (id: number, data: any) => fetchApi<any>(`/posts/${id}/`, { method: 'PUT', body: data }),
  deletePost: (id: number) => fetchApi<void>(`/posts/${id}/`, { method: 'DELETE' }),
};