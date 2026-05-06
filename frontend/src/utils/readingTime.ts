/**
 * 估算文章阅读时间
 * @param content 文章内容（Markdown 或纯文本）
 * @param wordsPerMinute 每分钟阅读字数，默认 275（中文约 300，英文约 200，取中间值）
 * @returns 阅读时间字符串，如 "3 min read"
 */
export function estimateReadingTime(content: string, wordsPerMinute = 275): string {
  if (!content) return '1 min read';

  // 移除 markdown 标记，估算纯文本字数
  // 中文字符直接计数，英文按单词计数
  const cleanText = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[.*?\]\(.*?\)/g, '$1') // 保留链接文本
    .replace(/[#*`~>_\-[]()|]/g, '') // 移除 markdown 标记
    .replace(/\s+/g, ' '); // 合并空白

  const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = cleanText
    .replace(/[\u4e00-\u9fa5]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const totalWords = chineseChars + englishWords;
  const minutes = Math.max(1, Math.ceil(totalWords / wordsPerMinute));

  return `${minutes} min read`;
}
