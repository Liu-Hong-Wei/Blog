# Link Preview Cards — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add automatic link preview cards for external URLs in Ideas and Blog Posts via Open Graph metadata scraping.

**Architecture:** Frontend extracts URLs from text → calls Django backend proxy `/api/link-preview/?url=` → backend uses `requests` + `BeautifulSoup` to scrape Open Graph tags → returns JSON `{title, description, image, site_name}` → frontend renders `LinkPreviewCard`.

**Tech Stack:** Django REST Framework (Python) + React/TypeScript + Suspense resource pattern + `requests`/`beautifulsoup4`

## Global Constraints

- Backend stays read-only (no DB migrations — no new models)
- Frontend follows existing Suspense resource pattern for data fetching
- Link preview cards: left-image-right-text layout, clickable, theme-aware (Tailwind)
- Ideas: auto-extract URLs from `content` text, render cards below text above `IdeaImageGrid`
- Blog Posts: only bare links on their own line trigger cards
- Failed fetches: silent (no card rendered, no error shown)
- Backend cache: in-memory dict, 1h TTL, max 500 entries

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `backend/requirements.txt` | Modify | Add `requests`, `beautifulsoup4` |
| `backend/blog/link_preview.py` | Create | `fetch_og_metadata()`, `link_preview_api()` view, in-memory cache |
| `backend/blog/urls.py` | Modify | Register `/api/link-preview/` path |
| `frontend/src/types/types.ts` | Modify | Add `LinkPreviewData` interface |
| `frontend/src/services/api.ts` | Modify | Add `LinkPreviewAPI` |
| `frontend/src/utils/extractUrls.ts` | Create | `extractUrls(text): string[]` |
| `frontend/src/hooks/useLinkPreview.ts` | Create | `useLinkPreview(url): LinkPreviewData | null` with cache |
| `frontend/src/components/LinkPreviewCard.tsx` | Create | Display component for link preview card |
| `frontend/src/pages/Ideas.tsx` | Modify | Extract URLs → render `LinkPreviewCard` below content |
| `frontend/src/components/MarkdownComponents.tsx` | Modify | Detect bare-link paragraphs → render `LinkPreviewCard` |

---

### Task 1: Add backend dependencies

**Files:**
- Modify: `backend/requirements.txt`

**Interfaces:**
- Produces: `requests` and `beautifulsoup4` available in Python environment

- [ ] **Step 1: Add `requests` and `beautifulsoup4` to requirements.txt**

```
asgiref==3.8.1
Django==5.1.7
django-cors-headers==4.7.0
djangorestframework==3.15.2
sqlparse==0.5.3
tzdata==2025.1
gunicorn==21.2.0
psycopg2-binary==2.9.9
python-dotenv==1.1.1
requests==2.32.4
beautifulsoup4==4.13.5
```

- [ ] **Step 2: Install dependencies**

Run: `cd backend && pip install requests beautifulsoup4`
Expected: Successfully installed requests, beautifulsoup4

- [ ] **Step 3: Verify imports work**

Run: `cd backend && python -c "import requests; from bs4 import BeautifulSoup; print('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add backend/requirements.txt
git commit -m "feat: add requests and beautifulsoup4 for link preview metadata fetching

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Create backend link preview module

**Files:**
- Create: `backend/blog/link_preview.py`

**Interfaces:**
- Produces: `fetch_og_metadata(url: str) -> dict | None`
- Produces: `link_preview_api(request) -> JsonResponse` (Django view, GET `/api/link-preview/?url=`)

- [ ] **Step 1: Create `backend/blog/link_preview.py`**

```python
import re
import time
from urllib.parse import urlparse

from django.http import JsonResponse
import requests
from bs4 import BeautifulSoup

# In-memory cache: {url: (timestamp, data)}
_preview_cache: dict[str, tuple[float, dict]] = {}
_CACHE_TTL = 3600  # 1 hour
_CACHE_MAX_SIZE = 500


def extract_urls(text: str) -> list[str]:
    """Extract unique HTTP(S) URLs from plain text.

    Used by frontend utility — included here for completeness; the
    primary URL extraction happens client-side in extractUrls.ts.
    """
    urls = re.findall(r'https?://[^\s]+', text)
    seen: set[str] = set()
    result: list[str] = []
    for url in urls:
        url = url.rstrip('.,;:!?）)')
        if url not in seen:
            seen.add(url)
            result.append(url)
    return result


def fetch_og_metadata(url: str) -> dict | None:
    """Fetch and parse Open Graph metadata from a URL.

    Returns a dict with url, title, description, image, site_name
    on success, or None if the page is unreachable or has no useful
    metadata.
    """
    try:
        resp = requests.get(
            url,
            timeout=5,
            headers={'User-Agent': 'BlogBot/1.0 (+https://kylau.dev)'},
            allow_redirects=True,
        )
        resp.raise_for_status()
    except requests.RequestException:
        return None

    soup = BeautifulSoup(resp.text, 'html.parser')

    def og(prop: str) -> str:
        tag = soup.find('meta', attrs={'property': f'og:{prop}'})
        if tag:
            content = tag.get('content', '')
            if isinstance(content, str):
                return content.strip()
        return ''

    def meta_name(name: str) -> str:
        tag = soup.find('meta', attrs={'name': name})
        if tag:
            content = tag.get('content', '')
            if isinstance(content, str):
                return content.strip()
        return ''

    title = og('title')
    if not title:
        title_tag = soup.find('title')
        title = title_tag.get_text(strip=True) if title_tag else ''

    description = og('description')
    if not description:
        description = meta_name('description')

    image = og('image')
    site_name = og('site_name')

    if not site_name:
        parsed = urlparse(url)
        site_name = parsed.hostname or parsed.netloc

    # Nothing useful at all — treat as failure
    if not title and not description and not image:
        return None

    return {
        'url': url,
        'title': title,
        'description': description,
        'image': image,
        'site_name': site_name,
    }


def link_preview_api(request):
    """Django view: GET /api/link-preview/?url=<encoded_url>

    Fetches Open Graph metadata for the given URL, with a 1-hour
    in-memory cache to avoid re-fetching on repeat visits.
    """
    url = request.GET.get('url', '').strip()
    if not url:
        return JsonResponse({'error': 'Missing url parameter'}, status=400)

    # Check cache
    now = time.time()
    if url in _preview_cache:
        ts, data = _preview_cache[url]
        if now - ts < _CACHE_TTL:
            return JsonResponse(data)

    # Fetch metadata
    metadata = fetch_og_metadata(url)
    data = metadata if metadata is not None else {'url': url, 'error': True}

    # Evict oldest entry if cache is full
    if len(_preview_cache) >= _CACHE_MAX_SIZE:
        oldest_key = min(_preview_cache, key=lambda k: _preview_cache[k][0])
        del _preview_cache[oldest_key]

    _preview_cache[url] = (now, data)
    return JsonResponse(data)
```

- [ ] **Step 2: Verify the module imports correctly**

Run: `cd backend && python -c "from blog.link_preview import fetch_og_metadata, link_preview_api; print('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add backend/blog/link_preview.py
git commit -m "feat: add link preview backend module with OG metadata scraping

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Register link preview API endpoint

**Files:**
- Modify: `backend/blog/urls.py`

**Interfaces:**
- Consumes: `link_preview_api` view from `backend/blog/link_preview.py`
- Produces: GET `/api/link-preview/?url=<encoded>` available

- [ ] **Step 1: Add the link-preview path to urlpatterns**

Edit `backend/blog/urls.py` — change from:

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, TagViewSet, AboutViewSet, IdeaViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'tags', TagViewSet)
router.register(r'ideas', IdeaViewSet)
router.register(r'about', AboutViewSet)

urlpatterns = router.urls
# path('', include(router.urls)),
```

To:

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, TagViewSet, AboutViewSet, IdeaViewSet
from .link_preview import link_preview_api

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'tags', TagViewSet)
router.register(r'ideas', IdeaViewSet)
router.register(r'about', AboutViewSet)

urlpatterns = router.urls + [
    path('link-preview/', link_preview_api),
]
# path('', include(router.urls)),
```

- [ ] **Step 2: Start Django dev server and test the endpoint**

Start server: `cd backend && python manage.py runserver 0.0.0.0:8000`
Test: `curl "http://localhost:8000/api/link-preview/?url=https://book.douban.com/subject/1008145/"`
Expected: JSON response with title, description, image fields (or error if douban blocks)

- [ ] **Step 3: Commit**

```bash
git add backend/blog/urls.py
git commit -m "feat: register /api/link-preview/ endpoint for link metadata fetching

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Add LinkPreviewData type

**Files:**
- Modify: `frontend/src/types/types.ts`

**Interfaces:**
- Produces: `LinkPreviewData` interface consumed by all frontend tasks

- [ ] **Step 1: Add LinkPreviewData interface**

Append to `frontend/src/types/types.ts`:

```typescript
export interface LinkPreviewData {
  url: string;
  title: string;
  description: string;
  image: string;
  site_name: string;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add frontend/src/types/types.ts
git commit -m "feat: add LinkPreviewData type for link preview cards

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: Add LinkPreviewAPI to api.ts

**Files:**
- Modify: `frontend/src/services/api.ts`

**Interfaces:**
- Consumes: `LinkPreviewData` from `types.ts`
- Produces: `LinkPreviewAPI.get(url: string): Promise<LinkPreviewData | null>`

- [ ] **Step 1: Add LinkPreviewAPI**

In `frontend/src/services/api.ts`, add the import for `LinkPreviewData` and the API object.

Change the import line from:
```typescript
import type { About, Idea, Post, Tag } from '../types/types';
```
To:
```typescript
import type { About, Idea, LinkPreviewData, Post, Tag } from '../types/types';
```

Add the following after the `AboutAPI` definition (before the final empty line):

```typescript
// Link Preview API
export const LinkPreviewAPI = {
  get: (url: string): Promise<LinkPreviewData | null> =>
    fetchAPI<LinkPreviewData | { error: boolean }>(
      `link-preview/?url=${encodeURIComponent(url)}`
    ).then(data => ('error' in data ? null : data)),
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add frontend/src/services/api.ts
git commit -m "feat: add LinkPreviewAPI for fetching link preview metadata

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: Create extractUrls utility

**Files:**
- Create: `frontend/src/utils/extractUrls.ts`

**Interfaces:**
- Produces: `extractUrls(text: string): string[]`

- [ ] **Step 1: Create `frontend/src/utils/extractUrls.ts`**

```typescript
/**
 * Extract unique HTTP(S) URLs from plain text.
 * Strips trailing punctuation that commonly follows URLs in prose.
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const matches = text.match(urlRegex);
  if (!matches) return [];

  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of matches) {
    // Strip trailing punctuation that's unlikely to be part of the URL
    const cleaned = raw.replace(/[.,;:!?）)]+$/, '');
    if (!seen.has(cleaned)) {
      seen.add(cleaned);
      result.push(cleaned);
    }
  }

  return result;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add frontend/src/utils/extractUrls.ts
git commit -m "feat: add extractUrls utility for detecting URLs in text

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 7: Create useLinkPreview hook

**Files:**
- Create: `frontend/src/hooks/useLinkPreview.ts`

**Interfaces:**
- Consumes: `LinkPreviewAPI` from `api.ts`, `LinkPreviewData` from `types.ts`
- Produces: `useLinkPreview(url: string): LinkPreviewData | null`

- [ ] **Step 1: Create `frontend/src/hooks/useLinkPreview.ts`**

```typescript
import { useEffect, useState } from 'react';

import { LinkPreviewAPI } from '../services/api';
import type { LinkPreviewData } from '../types/types';

// Global caches shared across all hook instances:
// - promiseCache prevents duplicate in-flight requests
// - dataCache holds resolved values so re-mounts get instant data
const promiseCache = new Map<string, Promise<LinkPreviewData | null>>();
const dataCache = new Map<string, LinkPreviewData | null>();

/**
 * Fetch link preview metadata for a URL.
 * Returns null if the URL is invalid, the fetch fails, or
 * the page has no extractable metadata.
 *
 * Uses per-URL caching to avoid redundant network requests:
 * - In-flight deduplication via promiseCache
 * - Resolved values via dataCache for instant re-renders
 */
export default function useLinkPreview(url: string): LinkPreviewData | null {
  const [data, setData] = useState<LinkPreviewData | null>(
    () => dataCache.get(url) ?? null
  );

  useEffect(() => {
    // Already resolved — use cached value
    if (dataCache.has(url)) {
      setData(dataCache.get(url)!);
      return;
    }

    let cancelled = false;

    // Deduplicate in-flight requests
    if (!promiseCache.has(url)) {
      promiseCache.set(url, LinkPreviewAPI.get(url));
    }

    promiseCache.get(url)!.then(result => {
      if (!cancelled) {
        dataCache.set(url, result);
        setData(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return data;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add frontend/src/hooks/useLinkPreview.ts
git commit -m "feat: add useLinkPreview hook with request deduplication cache

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 8: Create LinkPreviewCard component

**Files:**
- Create: `frontend/src/components/LinkPreviewCard.tsx`

**Interfaces:**
- Consumes: `LinkPreviewData` from `types.ts`
- Produces: `<LinkPreviewCard>` display component for `Ideas.tsx` and `MarkdownComponents.tsx`

- [ ] **Step 1: Create `frontend/src/components/LinkPreviewCard.tsx`**

```typescript
import { useState } from 'react';

import type { LinkPreviewData } from '../types/types';

function DomainBadge({ siteName }: { siteName: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-primary/45">
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
        />
      </svg>
      {siteName}
    </span>
  );
}

export default function LinkPreviewCard({
  url,
  title,
  description,
  image,
  site_name: siteName,
}: LinkPreviewData) {
  const [imageError, setImageError] = useState(false);
  const showImage = image && !imageError;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-2 flex overflow-hidden rounded-xl border border-bgsecondary/30 bg-bgsecondary/15 p-3 no-underline transition-all duration-300 hover:border-bgsecondary/60 hover:bg-bgsecondary/25 hover:shadow-sm"
    >
      {/* Thumbnail */}
      <div className="mr-3 h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-bgsecondary/40">
        {showImage ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary/30">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="min-w-0 flex-1">
        {title && (
          <p className="truncate text-sm font-medium leading-snug text-primary transition-colors group-hover:text-secondary">
            {title}
          </p>
        )}
        {description && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-primary/60">
            {description}
          </p>
        )}
        <div className="mt-1">
          <DomainBadge siteName={siteName} />
        </div>
      </div>
    </a>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/LinkPreviewCard.tsx
git commit -m "feat: add LinkPreviewCard component with thumbnail + metadata display

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 9: Integrate link previews into Ideas page

**Files:**
- Modify: `frontend/src/pages/Ideas.tsx`

**Interfaces:**
- Consumes: `extractUrls` from `utils/extractUrls.ts`, `useLinkPreview` from `hooks/useLinkPreview.ts`, `LinkPreviewCard` from `components/LinkPreviewCard.tsx`
- Produces: Link preview cards rendered below idea content text, above `IdeaImageGrid`

- [ ] **Step 1: Add imports to Ideas.tsx**

Insert the following imports at the top of the file, after the existing `import useIdeas from '../hooks/useIdeas';` line:

```typescript
import LinkPreviewCard from '../components/LinkPreviewCard';
import useLinkPreview from '../hooks/useLinkPreview';
import { extractUrls } from '../utils/extractUrls';
```

- [ ] **Step 2: Create LinkPreviewsList sub-component**

Add these two components above `IdeaImageGrid`:

```typescript
function LinkPreviewItem({ url }: { url: string }) {
  const preview = useLinkPreview(url);
  if (!preview) return null;
  return <LinkPreviewCard {...preview} />;
}

function LinkPreviewsList({ urls }: { urls: string[] }) {
  if (!urls || urls.length === 0) return null;
  return (
    <div className="mt-3 space-y-2">
      {urls.map(url => (
        <LinkPreviewItem key={url} url={url} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Modify IdeaCard to extract URLs and render previews**

Replace the `IdeaCard` function body. Change:

```tsx
function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <article className="group relative">
      {/* 时间线节点 */}
      <div className="absolute top-1.5 -left-[26px] h-2.5 w-2.5 rounded-full bg-secondary ring-[3px] ring-bgprimary" />

      {/* 时间戳 */}
      <time
        dateTime={idea.created_at}
        className="text-xs font-medium tracking-wide text-primary/50"
      >
        {formatIdeaDate(idea.created_at)}
      </time>

      {/* 内容卡片 */}
      <div className="mt-2 overflow-hidden rounded-xl border border-bgsecondary/30 bg-bgprimary p-5 transition-all duration-300 hover:border-bgsecondary/60 hover:shadow-sm">
        <div className="max-w-none text-sm leading-relaxed break-words whitespace-pre-wrap text-primary/85">
          {idea.content}
        </div>

        {idea.images && idea.images.length > 0 && <IdeaImageGrid images={idea.images} />}
      </div>
    </article>
  );
}
```

To:

```tsx
function IdeaCard({ idea }: { idea: Idea }) {
  const urls = extractUrls(idea.content);

  return (
    <article className="group relative">
      {/* 时间线节点 */}
      <div className="absolute top-1.5 -left-[26px] h-2.5 w-2.5 rounded-full bg-secondary ring-[3px] ring-bgprimary" />

      {/* 时间戳 */}
      <time
        dateTime={idea.created_at}
        className="text-xs font-medium tracking-wide text-primary/50"
      >
        {formatIdeaDate(idea.created_at)}
      </time>

      {/* 内容卡片 */}
      <div className="mt-2 overflow-hidden rounded-xl border border-bgsecondary/30 bg-bgprimary p-5 transition-all duration-300 hover:border-bgsecondary/60 hover:shadow-sm">
        <div className="max-w-none text-sm leading-relaxed break-words whitespace-pre-wrap text-primary/85">
          {idea.content}
        </div>

        <LinkPreviewsList urls={urls} />

        {idea.images && idea.images.length > 0 && <IdeaImageGrid images={idea.images} />}
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/Ideas.tsx
git commit -m "feat: integrate link preview cards into Ideas page

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 10: Integrate link previews into Blog Post markdown

**Files:**
- Modify: `frontend/src/components/MarkdownComponents.tsx`

**Interfaces:**
- Consumes: `LinkPreviewCard` from `components/LinkPreviewCard.tsx`, `useLinkPreview` from `hooks/useLinkPreview.ts`
- Produces: Bare-link paragraphs in blog posts render `<a>` + `<LinkPreviewCard>` instead of plain `<p>`

- [ ] **Step 1: Add imports to MarkdownComponents.tsx**

Change the existing import line:

From:
```typescript
import type { ComponentProps, ElementType } from 'react';
```

To:
```typescript
import { Children, isValidElement, useMemo, type ComponentProps, type ElementType } from 'react';
```

And add below it:
```typescript
import LinkPreviewCard from './LinkPreviewCard';
import useLinkPreview from '../hooks/useLinkPreview';
```

- [ ] **Step 2: Create BareLinkCardLoader component**

Add above the `markdownComponents` export:

```typescript
function BareLinkCardLoader({ url }: { url: string }) {
  const preview = useLinkPreview(url);
  if (!preview) return null;
  return (
    <div className="mt-2">
      <LinkPreviewCard {...preview} />
    </div>
  );
}
```

- [ ] **Step 3: Create ParagraphWithLinkPreview component**

Add after `BareLinkCardLoader`:

```typescript
function ParagraphWithLinkPreview({
  className,
  children,
  ...props
}: ComponentProps<'p'>) {
  const bareLinkInfo = useMemo(() => {
    const childArray = Children.toArray(children);
    if (childArray.length !== 1) return null;
    const child = childArray[0];
    if (!isValidElement(child)) return null;
    if (child.type !== 'a') return null;
    const aProps = child.props as ComponentProps<'a'>;
    // Bare link: the text content of the <a> equals its href
    if (!aProps.href || aProps.children !== aProps.href) return null;
    return { href: aProps.href, aProps };
  }, [children]);

  if (!bareLinkInfo) {
    return (
      <p
        {...props}
        className={mergeClassName('my-3 text-base leading-relaxed text-primary', className)}
      >
        {children}
      </p>
    );
  }

  return (
    <div className="my-3">
      <a
        href={bareLinkInfo.href}
        target="_blank"
        rel="noopener noreferrer"
        className={mergeClassName(
          'text-secondary underline decoration-secondary/50 util-transition hover:decoration-secondary dark:text-secondary',
          (bareLinkInfo.aProps as Record<string, string>).className
        )}
      >
        {bareLinkInfo.href}
      </a>
      <BareLinkCardLoader url={bareLinkInfo.href} />
    </div>
  );
}
```

- [ ] **Step 4: Register ParagraphWithLinkPreview as the `p` component**

In the `markdownComponents` object, change:

```tsx
  p: ({ className, ...props }: ComponentProps<'p'>) => (
    <p
      {...props}
      className={mergeClassName('my-3 text-base leading-relaxed text-primary', className)}
    />
  ),
```

To:

```tsx
  p: ParagraphWithLinkPreview,
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No new errors

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/MarkdownComponents.tsx
git commit -m "feat: render link preview cards for bare-link paragraphs in blog posts

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---
