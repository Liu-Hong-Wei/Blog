import { IdeasAPI } from '../services/api';
import type { Idea } from '../types/types';
import createResource from '../utils/resource';

// 全局资源缓存 - 确保整个应用只有一个 ideas 资源实例
let ideasResource: ReturnType<typeof createResource<Idea[]>> | null = null;

/**
 * 使用 Suspense 获取 Ideas 列表的 Hook
 * 使用全局缓存避免重复请求
 * @returns 返回 Ideas 列表
 */
export default function useIdeas() {
  // 如果没有缓存的资源，创建一个新的
  if (!ideasResource) {
    const promise = IdeasAPI.getAll();
    ideasResource = createResource<Idea[]>(promise);
  }

  // 尝试读取资源。这将在数据准备好之前"暂停"组件渲染。
  const ideas = ideasResource.read();

  return ideas;
}

/**
 * 清除缓存的资源，用于刷新数据
 */
export function clearIdeasCache() {
  ideasResource = null;
}
