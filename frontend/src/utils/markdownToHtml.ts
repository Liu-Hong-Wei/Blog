import { createElement, Fragment } from 'react';
import type { ReactElement } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
// import rehypeRaw from 'rehype-raw';
import rehypeReact from 'rehype-react';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import { markdownComponents } from '../components/MarkdownComponents';
export interface MarkdownResult {
  success: boolean;
  content?: ReactElement;
  error?: string;
}

// 定义错误类型
export class MarkdownError extends Error {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'MarkdownError';
  }
}

const prettyCodeOptions = {
  grid: true,
  theme: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' },
  keepBackground: false,
  defaultLang: {
    block: 'plaintext',
    inline: 'plaintext',
  },
  // onVisitLine(node: any) {
  //   if (node.children.length === 0) node.children = [{ type: 'text', value: ' ' }];
  // },
  // onVisitHighlightedLine(node: any) {
  //   node.properties ||= {};
  //   node.properties['data-highlighted'] = true;
  // },
  // onVisitHighlightedWord(node: any) {
  //   node.properties ||= {};
  //   node.properties['data-highlighted-word'] = true;
  // },
} as const;

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
        content: createElement('div', { className: 'empty-content' }, 'No content available'),
      };
    }

    // 处理 markdown 转换 remarkParse → remarkGfm →
    // remarkRehype({ allowDangerousHtml: true }) → rehypeRaw
    // → rehypeSlug → rehypeAutolinkHeadings → rehypePrettyCode → rehypeReact
    const file = await unified()
      .use(remarkParse) // Parse markdown to AST
      .use(remarkGfm) // Support GitHub Flavored Markdown
      // .use(rehypeRaw) // Allow raw HTML in markdown
      .use(remarkRehype) // Transform AST to HAST
      .use(rehypeSlug) // Add IDs to headings
      .use(rehypeAutolinkHeadings, { behavior: 'append' }) // Add anchor links to headings
      .use(rehypePrettyCode, prettyCodeOptions)
      // .use(rehypeShiki, {           // 5. Syntax highlighting (SWITCHED TO rehype-pretty-code)
      //   // or `theme` for a single theme
      //   defaultLanguage: 'plaintext',
      //   themes: {
      //     light: 'catppuccin-latte',
      //     dark: 'catppuccin-mocha',
      //   },
      //   inline: 'tailing-curly-colon',
      //   keepBackground: false,
      // })
      .use(rehypeStringify) // Serialize HAST to HTML
      // .use(rehypeSanitize)  // Sanitize HTML to prevent XSS  (DON'T NEED IT tho)
      .use(rehypeReact, { // Transform HTML to React elements
        createElement,
        Fragment,
        jsx,
        jsxs,
        components: markdownComponents,
      })
      .process(markdown);

    const result = file.result as ReactElement;

    // 验证结果
    if (!result) {
      throw new MarkdownError('Markdown conversion failed: No valid content generated');
    }

    return {
      success: true,
      content: result,
    };
  } catch (error) {
    console.error('Markdown conversion error:', error);

    // 处理不同类型的错误
    if (error instanceof MarkdownError) {
      return {
        success: false,
        error: error.message,
      };
    }

    // 处理 unified 相关错误
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = error.message as string;
      if (errorMessage.includes('parse')) {
        return {
          success: false,
          error: 'Markdown parsing error: Please check the syntax',
        };
      }
      if (errorMessage.includes('transform')) {
        return {
          success: false,
          error: 'Markdown transformation error: Please check the content format',
        };
      }
    }

    // 默认错误处理
    return {
      success: false,
      error: 'Markdown processing failed: Please try again later',
    };
  }
}
