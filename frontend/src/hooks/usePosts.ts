import { PostsAPI } from '../services/api'; 
import { Post } from '../types/types';
import createResource from '../utils/resource';

// 全局资源缓存 - 确保整个应用只有一个 posts 资源实例
let postsResource: ReturnType<typeof createResource<Post[]>> | null = null;

/**
 * 使用 Suspense 获取文章列表的 Hook
 * 使用全局缓存避免重复请求
 * @returns 返回文章列表
 */
export default function usePosts() {
  // 如果没有缓存的资源，创建一个新的
  if (!postsResource) {
    const promise = PostsAPI.getAll();
    postsResource = createResource<Post[]>(promise);
  }

  // 尝试读取资源。这将在数据准备好之前"暂停"组件渲染。
  const posts = postsResource.read();

  return posts;
}

/**
 * 清除缓存的资源，用于刷新数据
 */
export function clearPostsCache() {
  postsResource = null;
}
