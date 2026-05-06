/**
 * 从 Markdown 内容中提取纯文本摘要
 * @param content Markdown 内容
 * @param maxLength 最大长度，默认 160
 * @returns 纯文本摘要
 */
export function extractExcerpt(content: string, maxLength = 160): string {
  if (!content) return '';

  const cleanText = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[.*?\]\(.*?\)/g, '$1') // 保留链接文本
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`([^`]+)`/g, '$1') // 移除行内代码标记
    .replace(/[#*`~>_\-[]()|!]/g, '') // 移除 markdown 标记
    .replace(/\s+/g, ' ') // 合并空白
    .trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // 尝试在句子或单词边界截断
  const truncated = cleanText.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('。');
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastPeriod > maxLength * 0.7) {
    return truncated.slice(0, lastPeriod + 1);
  }

  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace) + '...';
  }

  return truncated + '...';
}
