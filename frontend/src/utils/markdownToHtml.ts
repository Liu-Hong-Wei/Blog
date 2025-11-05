import { unified } from 'unified'
// remark-parse：解析 Markdown 文本。
import remarkParse from 'remark-parse'
// remark-rehype：将 Markdown 抽象语法树（MDAST）转换为 HTML 抽象语法树（HAST）。
import remarkRehype from 'remark-rehype'
// rehype-react：将 HAST 转换为 React 元素。
import rehypeReact from 'rehype-react'
import { createElement, ReactElement, Fragment } from 'react'
// 仅导入生产环境需要的 jsx 和 Fragment
import { jsx, jsxs } from 'react/jsx-runtime'

// Shiki in rehype for syntax highlighting
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'
import { markdownComponents } from '../components/MarkdownComponents'

// 定义返回类型，包含成功和错误状态
export interface MarkdownResult {
  success: boolean;
  content?: ReactElement;
  error?: string;
}

// 定义错误类型
export class MarkdownError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'MarkdownError';
  }
}

export default async function markdownToHtml(markdown: string): Promise<MarkdownResult> {
  try {
    // 输入验证
    if (markdown === null || markdown === undefined || typeof markdown !== 'string') {
      throw new MarkdownError('Markdown content cannot be empty or invalid format');
    }

    // 如果内容为空，返回空元素
    if (markdown.trim() === '') {
      return {
        success: true,
        content: createElement('div', { className: 'empty-content' }, 'No content available')
      };
    }

    // 处理 markdown 转换
    const file = await unified()
      .use(remarkParse)      // 1. Parse Markdown to MDAST
      .use(remarkRehype) 
      .use(rehypeShiki, {           // 2. Syntax highlighting
        // or `theme` for a single theme
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        }
      })         
      // Transform MDAST to HAST
      .use(rehypeStringify)
      // .use(rehypeSanitize)     // 3. Sanitize HTML to prevent XSS  (DON'T NEED IT tho)
      .use(rehypeReact, {        // 4. Transform HAST to React elements
        createElement,
        Fragment,
        jsx,
        jsxs,
        components: markdownComponents
      })
      .process(markdown);

    const result = file.result as ReactElement;

    // 验证结果
    if (!result) {
      throw new MarkdownError('Markdown conversion failed: No valid content generated');
    }

    return {
      success: true,
      content: result
    };

  } catch (error) {
    console.error('Markdown conversion error:', error);

    // 处理不同类型的错误
    if (error instanceof MarkdownError) {
      return {
        success: false,
        error: error.message
      };
    }

    // 处理 unified 相关错误
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = error.message as string;
      if (errorMessage.includes('parse')) {
        return {
          success: false,
          error: 'Markdown parsing error: Please check the syntax'
        };
      }
      if (errorMessage.includes('transform')) {
        return {
          success: false,
          error: 'Markdown transformation error: Please check the content format'
        };
      }
    }

    // 默认错误处理
    return {
      success: false,
      error: 'Markdown processing failed: Please try again later'
    };
  }
}