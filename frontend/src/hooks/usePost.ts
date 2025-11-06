import { PostsAPI } from '../services/api'; 
import type { Post } from '../types/types';
import createResource from '../utils/resource';

// 单个文章资源缓存 - 使用 Map 按 slug 缓存不同的文章
const postResourcesCache = new Map<string, ReturnType<typeof createResource<Post>>>();

/**
 * 使用 Suspense 获取单篇文章的 Hook
 * 使用缓存避免重复请求相同的文章
 * @param slug 文章的 slug 标识符
 * @returns 返回单篇文章数据
 */
export default function usePost(slug: string) {
  // 检查缓存中是否已有该文章的资源
  let postResource = postResourcesCache.get(slug);
  
  // 如果没有缓存的资源，创建一个新的
  if (!postResource) {
    const promise = PostsAPI.getBySlug(slug);
    postResource = createResource<Post>(promise);
    postResourcesCache.set(slug, postResource);
  }

  // 尝试读取资源。这将在数据准备好之前"暂停"组件渲染。
  const post = postResource.read();

  return post;
}

/**
 * 清除指定文章的缓存，用于刷新数据
 * @param slug 要清除缓存的文章 slug，如果不提供则清除所有缓存
 */
export function clearPostCache(slug?: string) {
  if (slug) {
    postResourcesCache.delete(slug);
  } else {
    postResourcesCache.clear();
  }
}
