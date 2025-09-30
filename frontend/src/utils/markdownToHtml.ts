import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeReact from 'rehype-react'
import { createElement, ReactElement, Fragment } from 'react'
import { jsxDEV } from 'react/jsx-dev-runtime'

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
    if (!markdown || typeof markdown !== 'string') {
      throw new MarkdownError('Markdown 内容不能为空或格式不正确');
    }

    // 如果内容为空，返回空元素
    if (markdown.trim() === '') {
      return {
        success: true,
        content: createElement('div', { className: 'empty-content' }, '暂无内容')
      };
    }

    // 处理 markdown 转换
    const file = await unified()
      .use(remarkParse)          // 1. Parse Markdown to MDAST
      .use(remarkRehype)         // 2. Transform MDAST to HAST
      .use(rehypeReact, {        // 3. Transform HAST to React JSX elements
        // createElement,           // React's createElement function
        development: true,       // Enable development mode for Vite dev server
      jsxDEV,                  // Required for development JSX handling
        Fragment,                // React's Fragment for wrapping
      })
      .process(markdown);

    const result = file.result as ReactElement;

    // 验证结果
    if (!result) {
      throw new MarkdownError('Markdown 转换失败：未生成有效内容');
    }

    return {
      success: true,
      content: result
    };

  } catch (error) {
    console.error('Markdown 转换错误:', error);
    
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
          error: 'Markdown 格式解析错误，请检查语法是否正确'
        };
      }
      if (errorMessage.includes('transform')) {
        return {
          success: false,
          error: 'Markdown 转换错误，请检查内容格式'
        };
      }
    }

    // 默认错误处理
    return {
      success: false,
      error: 'Markdown 处理失败，请稍后重试'
    };
  }
}