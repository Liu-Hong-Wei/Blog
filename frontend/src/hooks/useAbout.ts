
import { AboutAPI } from '../services/api';
import type { About } from '../types/types';
import createResource from '../utils/resource';

// 全局资源缓存 - 确保整个应用只有一个 about 资源实例
let aboutResource: ReturnType<typeof createResource<About>> | null = null;

/**
 * 使用 Suspense 获取关于的 Hook
 * 使用全局缓存避免重复请求
 * @returns 返回关于信息
 */
export default function useAbout() {
  // 如果没有缓存的资源，创建一个新的
  if (!aboutResource) {
    const promise = AboutAPI.get();
    aboutResource = createResource<About>(promise);
  }

  // 尝试读取资源。这将在数据准备好之前"暂停"组件渲染。
  const about = aboutResource.read();

  return about;
}

/**
 * 清除缓存的资源，用于刷新数据
 */
export function clearAboutCache() {
  aboutResource = null;
}