# Link Preview Cards — Design Spec

**Date**: 2026-07-13
**Status**: Approved

## Overview

在 Ideas 页面和 Blog Post 中，自动识别外部链接（豆瓣、网易云音乐、Apple Music 等），生成信息卡片展示标题、描述和封面图。

## Motivation

- Idea 内容中常包含引用链接（书籍、音乐、播客），但目前 URL 渲染为纯文本，不可点击
- 博客文章中也有类似需求：独占用一行的裸链接应该生成预览卡片
- 用户不想手动为每个链接写摘要和截图

## Design Decisions

| 决策 | 选择 | 原因 |
|------|------|------|
| 架构 | 前端解析 URL + 后端代理抓取 OG | 不修改 DB，无 CORS 问题，简单 |
| 通用方案 | Open Graph 抓取（`og:title/image/description`） | 覆盖面最广，无需平台特化 |
| 启动方式 | Ideas: 自动；Blog: 独占行裸链接 | Ideas 用户已天然写 URL；Blog 需要可控避免碎片 |
| 交互 | 静态信息卡片（首期） | 后续可升级嵌入式播放器 |
| 缓存 | 后端内存缓存（1h TTL） | 避免刷新页面重复抓取 |

## Architecture

```
Idea/Blog 文本 → 前端提取 URL → GET /api/link-preview/?url=... 
→ 后端 requests + BeautifulSoup 解析 OG 标签 
→ 返回 JSON {title, description, image, site_name, url}
→ 前端 LinkPreviewCard 渲染
```

## Backend

### New File: `backend/blog/link_preview.py`

```
fetch_og_metadata(url: str) -> dict | None
    requests.get(url, timeout=5s, User-Agent: BlogBot/1.0)
    → BeautifulSoup 解析:
        og:title > <title> 回退
        og:description > <meta name="description"> 回退
        og:image
        og:site_name > hostname 回退
    → 失败返回 None

link_preview_api(request)  # Django view
    GET /api/link-preview/?url=<encoded>
    → 检查缓存储存 → 调 fetch_og_metadata → 写缓存 → 返回 JSON
```

- **缓存**: `dict[url, (timestamp, data)]`，1 小时 TTL，最大 500 条
- **Deps**: `requests`, `beautifulsoup4`（新增到 `requirements.txt`）
- **URL 注册**: `backend/blog/urls.py` → `path('link-preview/', link_preview_api)`

### API Spec

**Request**: `GET /api/link-preview/?url=https%3A%2F%2Fbook.douban.com%2Fsubject%2Fxxx%2F`

**Response** (200):
```json
{
  "url": "https://book.douban.com/subject/xxx/",
  "title": "书名标题",
  "description": "简介文本...",
  "image": "https://img9.doubanio.com/view/...",
  "site_name": "豆瓣"
}
```

**Response** (200, fetch failed):
```json
{
  "url": "https://...",
  "error": true
}
```

## Frontend

### New Files

1. **`frontend/src/utils/extractUrls.ts`**
   - `extractUrls(text: string): string[]` — 正则 `https?://[^\s]+`，去重

2. **`frontend/src/hooks/useLinkPreview.ts`**
   - Suspense resource pattern（与 useIdeas 一致）
   - `useLinkPreview(url: string): PreviewData | null`
   - 调用 `GET /api/link-preview/?url=...`
   - 模块级 `Map<string, Resource>` 缓存（同一 URL 只 fetch 一次）

3. **`frontend/src/components/LinkPreviewCard.tsx`**
   - Props: `{ url, title, description, image, site_name }`
   - 左图右文布局，整体可点击跳转
   - 无 image → 灰色占位 icon
   - 加载态：骨架屏（可选）；失败态：不发散（返回 null）
   - Tailwind 样式跟随主题（bg-secondary, text-primary）

### Modified Files

4. **`frontend/src/pages/Ideas.tsx`**
   - `IdeaCard`: content 下方调用 `extractUrls(content)` → `useLinkPreview` → `LinkPreviewCard`
   - 卡片渲染在 ImageGrid 上方

5. **`frontend/src/components/MarkdownComponents.tsx`**
   - `<p>` 组件: 检测 children 是否为单个 `<a>` 且文本 === href（裸链接）
   - 若是 → 渲染 `<a>` + `<LinkPreviewCard>`
   - 若不是 → 正常 `<p>`

6. **`frontend/src/services/api.ts`**
   - 新增 `LinkPreviewAPI` 对象

### Component Tree

```
IdeaCard
├── <time> date
├── <div> content text (whitespace-pre-wrap, as-is)
├── LinkPreviewCard × N (from extractUrls)    ← NEW
└── IdeaImageGrid

Blog Post (via Markdown pipeline)
├── <p> normal paragraphs
├── <p> bare link paragraphs
│   ├── <a> url text
│   └── LinkPreviewCard                       ← NEW
└── ...
```

## Error Handling

| 场景 | 行为 |
|------|------|
| 后端抓取超时/网络错误 | 返回 `{error: true}`，前端静默跳过 |
| 页面无 OG 标签 | 回退 `<title>` + `<meta name="description">` |
| 完全无元数据 | 返回 `{error: true}` |
| 图片 URL 无效 | 前端 `onError` → 替换为灰色占位 |
| URL 格式非法 | `extractUrls` 正则不会匹配到 |

## Dependencies

### Backend (add to requirements.txt)
- `requests` — HTTP fetch
- `beautifulsoup4` — HTML parsing

### Frontend
- 无新依赖，使用已有 Suspense resource 模式

## Future Enhancements (Out of Scope)

- [ ] 平台专用解析（Apple Music oEmbed、Spotify oEmbed、网易云 Meting API）
- [ ] 嵌入式播放器（iframe）
- [ ] DB 持久化缓存（LinkPreview model）
- [ ] 管理后台手动刷新预览
- [ ] 图片本地代理/缓存（避免外部图片失效）
