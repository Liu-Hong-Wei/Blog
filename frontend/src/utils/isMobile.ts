/**
 * 检测当前是否为移动设备（基于屏幕宽度）
 * @returns boolean
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || 'ontouchstart' in window;
}

/**
 * 检测当前是否为窄屏设备
 * @returns boolean
 */
export function isNarrowScreen(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}
