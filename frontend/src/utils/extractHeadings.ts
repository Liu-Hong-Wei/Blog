export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

/**
 * 从 Markdown 内容中提取标题结构，用于生成目录
 * @param content Markdown 内容
 * @returns 标题列表
 */
export function extractHeadings(content: string): HeadingItem[] {
  if (!content) return [];

  const headings: HeadingItem[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim().replace(/\s*#+\s*$/, ''); // 移除尾部 #
      const id = text
        .toLowerCase()
        .replace(/[^\w\s\u4e00-\u9fa5-]/g, '') // 保留中英文、数字、空格、连字符
        .replace(/\s+/g, '-'); // 空格转连字符

      headings.push({ id, text, level });
    }
  }

  return headings;
}
