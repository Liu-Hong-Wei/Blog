<!-- From: /Users/ethanlau/Repo/Projects/Blog/AGENTS.md -->
# AGENTS.md — Full-Stack Personal Blog

This file contains essential context for AI coding agents working on this project.
Read this first before making any changes.

---

## 1. Project Overview

This is a **full-stack personal blog system** built with a modern frontend (React 19 + TypeScript + Vite) and a Django REST Framework backend. The entire application is containerized with Docker Compose and deployed automatically via GitHub Actions CI/CD to a VPS.

Key characteristics:
- **Content is managed through Django Admin** (`/admin`). The public API is read-only.
- **SPA frontend** with route-based code splitting and React Suspense for data fetching.
- **Markdown rendering pipeline** using the Unified.js ecosystem with Shiki syntax highlighting.
- **Dark mode support** with system preference detection and manual toggle (light / system / dark).
- **Production domain**: `liuhongwei.org` (also `www.liuhongwei.org`).

---

## 2. Technology Stack

### Frontend (`frontend/`)
- **Framework**: React 19, React DOM 19, React Router 7
- **Language**: TypeScript 5.7 (strict mode enabled)
- **Build Tool**: Vite 6.2 with `@vitejs/plugin-react-swc`
- **Styling**: Tailwind CSS 4.0.17 with `@tailwindcss/vite` plugin
- **Animation**: Motion (Framer Motion successor) 12.23.24
- **Markdown**: Unified.js pipeline (`remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-react`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`, `rehype-raw`, `shiki`)
- **Lightbox**: `yet-another-react-lightbox` 3.25.0
- **Dev Tools**: ESLint 9 (flat config), Prettier 3.6.2, `prettier-plugin-tailwindcss`

### Backend (`backend/`)
- **Framework**: Python 3.12, Django 5.1.7, Django REST Framework 3.15.2
- **Database**: PostgreSQL (production) or SQLite (fallback when `DB_NAME` is absent)
- **CORS**: `django-cors-headers` 4.7.0
- **WSGI Server**: Gunicorn 21.2.0 (4 workers)
- **Environment**: `python-dotenv` 1.1.1

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **Reverse Proxy**: Nginx (inside frontend container) + external `nginx-proxy` + `acme-companion` for automatic HTTPS
- **Image Hosting**: Separate Chevereto instance at `img.liuhongwei.org` (not in this repo)
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)

---

## 3. Project Structure

```
Blog/
├── backend/                    # Django project
│   ├── backend/                # Django project config
│   │   ├── settings.py         # Main settings (env-driven)
│   │   ├── urls.py             # Root URL conf: /admin + /api
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── blog/                   # Main Django app
│   │   ├── models.py           # Post, Tag, About
│   │   ├── views.py            # ReadOnlyModelViewSets
│   │   ├── serializers.py      # DRF serializers
│   │   ├── urls.py             # DefaultRouter: posts, tags, about
│   │   ├── admin.py            # Admin panel config
│   │   └── migrations/         # 0001_initial through 0006
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── Dockerfile.dev
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── main.tsx            # Entry point
│   │   ├── App.tsx             # BrowserRouter with lazy routes
│   │   ├── types/types.ts      # TypeScript interfaces
│   │   ├── services/api.ts     # Fetch wrapper + API endpoints
│   │   ├── utils/
│   │   │   ├── resource.ts     # Suspense-compatible createResource()
│   │   │   ├── errors.ts       # NotFoundError, APIError
│   │   │   ├── markdownToHtml.ts  # Unified.js markdown pipeline
│   │   │   ├── excerpt.ts      # Plain-text excerpt extraction
│   │   │   ├── extractHeadings.ts  # TOC heading extraction
│   │   │   ├── readingTime.ts  # Reading time estimator
│   │   │   ├── scrollAnimation.ts  # Motion-powered smooth scroll
│   │   │   └── ...
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── usePosts.ts
│   │   │   ├── usePost.ts
│   │   │   ├── useAbout.ts
│   │   │   ├── useScrollRestoration.ts
│   │   │   └── ...
│   │   ├── layouts/            # AppLayout, MainContentLayout
│   │   ├── components/         # Reusable components
│   │   │   ├── buttons/
│   │   │   ├── icons/
│   │   │   ├── MarkdownComponents.tsx
│   │   │   ├── MarkdownImage.tsx
│   │   │   ├── Lightbox.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   ├── ProfileCard.tsx
│   │   │   └── ...
│   │   ├── pages/              # Route pages + error pages
│   │   │   ├── errors/
│   │   │   └── ...
│   │   └── constants/
│   │       └── socialIcons.ts
│   ├── index.html              # Inline FOUC-prevention theme script
│   ├── index.css               # Tailwind v4 entry + custom theme tokens
│   ├── vite.config.ts
│   ├── eslint.config.js
│   ├── .prettierrc
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── nginx.conf
├── .github/workflows/deploy.yml
├── docker-compose.yml          # Production orchestration
├── docker-compose.dev.yml      # Development orchestration
├── .env                        # Environment variables (not committed)
└── README.md
```

---

## 4. Development Environment Setup

### Prerequisites
- Docker and Docker Compose
- (Optional) Node.js 24+ for local frontend IDE support
- (Optional) Python 3.12+ for local backend IDE support

### Quick Start (Docker Compose)
```bash
# Clone and enter project
cd Blog

# Create .env file at project root (see Environment Variables section)
# cp .env.example .env   # (create manually if .env.example doesn't exist)

# Start all services
docker compose -f docker-compose.dev.yml up --build
```

Services will be available at:
- Frontend (Vite dev server): `http://localhost:5173`
- Backend (Django runserver): `http://localhost:8000`
- Django Admin: `http://localhost:8000/admin`

**Note**: `docker-compose.dev.yml` does **not** include a `db` service. The backend loads env vars from `.env` and falls back to SQLite if `DB_NAME` is absent. The `.env` in the repo currently has PostgreSQL vars commented out, so development uses SQLite by default.

### Environment Variables (`.env` at project root)
The following variables are required for the backend and database:

```
# Django
DJANGO_SECRET_KEY=<your-secret-key>
DJANGO_DEBUG=True                    # Set to False in production
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database (if absent, backend falls back to SQLite)
DB_NAME=blog_db
DB_USER=blog_user
DB_PASSWORD=<db-password>
DB_HOST=db                           # Docker service name
DB_PORT=5432

# CORS / CSRF
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

The backend loads `.env` from the project root via `python-dotenv` (`backend/backend/settings.py` line 12).

---

## 5. Build and Test Commands

### Frontend
```bash
cd frontend

# Development server
npm run dev

# Production build (type-check + Vite build)
npm run build

# Lint (ESLint + Prettier check)
npm run lint

# Preview production build locally
npm run preview
```

### Backend
```bash
cd backend

# Development server
python manage.py runserver 0.0.0.0:8000

# Database migrations
python manage.py migrate

# Collect static files (production)
python manage.py collectstatic --no-input

# Create superuser for Django Admin
python manage.py createsuperuser
```

### Docker (Production)
```bash
# Build and start all production services
docker compose up -d --build

# Run migrations inside container
docker compose exec backend python manage.py migrate --no-input

# Collect static files inside container
docker compose exec backend python manage.py collectstatic --no-input
```

---

## 6. Code Style Guidelines

### Frontend (TypeScript / React)
- **Formatter**: Prettier 3.6.2 with `prettier-plugin-tailwindcss`
  - `semi: true`, `singleQuote: true`, `tabWidth: 2`, `printWidth: 100`
  - `trailingComma: "es5"`, `arrowParens: "avoid"`, `endOfLine: "auto"`
- **Linter**: ESLint 9 flat config (`eslint.config.js`)
  - Uses `typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-plugin-jsx-a11y`, `eslint-plugin-import`
  - Key rules:
    - `react-refresh/only-export-components: warn` (with `allowConstantExport: true`)
    - `import/order: warn` with alphabetization
    - `@typescript-eslint/consistent-type-imports: warn`
    - `@typescript-eslint/no-floating-promises: error`
    - `@typescript-eslint/no-explicit-any: off`
- **TypeScript**: Strict mode (`strict: true`), `noUnusedLocals: true`, `noUnusedParameters: true`
- **JSX transform**: `react-jsx` (no need to import React)
- **File naming**: PascalCase for components (`.tsx`), camelCase for utilities/hooks (`.ts`)
- **Tailwind v4**: Uses `@import 'tailwindcss'` in `index.css` with custom `@theme` tokens (`--color-bgprimary`, `--color-bgsecondary`, `--color-primary`, `--color-secondary`)

### Backend (Python / Django)
- **No explicit linting tool** is currently configured (no Black, Ruff, flake8, or isort).
- Follow PEP 8 and Django conventions.
- Use type hints where practical.
- Models use `slugify()` for auto-generating slugs on save.
- Views are `ReadOnlyModelViewSet` — the API is intentionally read-only for public access.

---

## 7. Testing Instructions

**⚠️ IMPORTANT: This project currently has NO automated tests.**

- `backend/blog/tests.py` is an empty placeholder.
- No test runner is installed or configured on either frontend or backend.
- The `frontend/package.json` does not include a `test` script.

If you add tests:
- **Frontend**: Consider Vitest (aligns with Vite) or Jest.
- **Backend**: Use Django's built-in `TestCase` or `pytest-django`.

---

## 8. Deployment Process

### CI/CD Pipeline (`.github/workflows/deploy.yml`)
Triggered on every push to `main`:

1. GitHub Actions runner checks out code
2. Sets up SSH agent with `secrets.VPS_SSH_KEY`
3. SSHs into VPS (`secrets.VPS_HOST`, `secrets.VPS_USERNAME`, `secrets.VPS_SSH_PORT`)
4. On the VPS:
   - `cd /home/et/Blog`
   - `git pull`
   - `docker compose down`
   - `docker compose up --build -d`
   - `docker compose exec backend python manage.py migrate --no-input`
   - `docker compose exec backend python manage.py collectstatic --no-input`
   - `docker image prune -f`

### Production Architecture
- **Frontend container**: Nginx serves static build files from `dist/`. Proxies `/api` and `/admin` to the backend container. SPA fallback via `try_files`.
- **Backend container**: Gunicorn with 4 workers serving Django WSGI.
- **Database container**: PostgreSQL with healthcheck.
- **Static files sharing**: `static_volume` Docker volume is shared between backend (`/app/staticfiles`) and frontend (`/usr/share/nginx/html/static`) so Nginx can serve collected Django admin static files.
- **External network**: `nginx-proxy` (external Docker network) is used by the frontend container for reverse proxying and automatic HTTPS via `acme-companion`.

---

## 9. Security Considerations

- **SECRET_KEY**: Must be overridden via `DJANGO_SECRET_KEY` env var in production. The fallback in `settings.py` is insecure.
- **DEBUG**: Must be `False` in production (`DJANGO_DEBUG=0`).
- **ALLOWED_HOSTS**: Must be explicitly set in production.
- **CORS_ALLOWED_ORIGINS / CSRF_TRUSTED_ORIGINS**: Configured via env vars. Defaults allow `localhost:5173` only.
- **No authentication on the public API**: All DRF ViewSets use `AllowAny` permission. Content management is done exclusively through Django Admin (`/admin`) which requires authentication.
- **Media files**: `MEDIA_URL = '/media/'`, `MEDIA_ROOT = BASE_DIR / 'mediafiles'`. Ensure this directory is properly secured in production.
- **Proxy settings in dev Dockerfiles**: Both `backend/Dockerfile.dev` and `frontend/Dockerfile.dev` contain hardcoded `HTTP_PROXY=http://127.0.0.1:20171` / `HTTPS_PROXY=http://127.0.0.1:20171`. These are local development artifacts and will likely fail in other environments. Remove or parameterize them if sharing the dev setup.

---

## 10. Data Models and API

### Models (`backend/blog/models.py`)
| Model | Fields | Notes |
|-------|--------|-------|
| **Post** | title, content, created_at, updated_at, is_published, slug (unique), views, tldr, tags (M2M → Tag) | Auto-slugify on save. Ordered by `-created_at`. |
| **Tag** | name (unique), slug (unique) | Auto-slugify on save. |
| **About** | title, content, updated_at | Single about page entry. |

### API Endpoints (`/api/`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/posts/` | Read | List published posts. Paginated (10/page). Supports `?search=`, `?ordering=`, `?tag=<slug>`. |
| `GET /api/posts/<slug>/` | Read | Retrieve single post. Atomically increments `views` via `F()`. |
| `GET /api/tags/` | Read | List all tags. |
| `GET /api/tags/<slug>/` | Read | Retrieve single tag. |
| `GET /api/about/` | Read | List about entries. |

### Frontend Data Fetching Pattern
- Uses a **custom Suspense-compatible resource** (`utils/resource.ts`) instead of React Query / SWR.
- Hooks (`usePosts`, `usePost`, `useAbout`) wrap API calls with module-level singleton caches.
- `resource.read()` throws the promise if pending (caught by `<Suspense>`) or throws errors (caught by `SuspenseErrorBoundary`).
- API base URL: `/api` in production, `http://localhost:8000/api` in development.

---

## 11. Frontend Routing and Code Splitting

`frontend/src/App.tsx` defines routes using `react-router` v7 (`createBrowserRouter`):

| Path | Component | Lazy Loaded |
|------|-----------|-------------|
| `/` | `Homepage` | Yes |
| `/ideas` | `Ideas` | Yes |
| `/projects` | `Projects` | Yes |
| `/about` | `About` | Yes |
| `/posts` | `Posts` | Yes |
| `/posts/:slug` | `Post` | Yes |
| `/test-page` | `Test` | No |
| `*` | `NotFound` | Yes |

All pages except `Test.tsx` are wrapped in `React.lazy()`. Route transitions use `motion/react` (`AnimatePresence` + `motion.div` with fade/slide) via an `AnimatedOutlet` wrapper.

**Vite build configuration** (`vite.config.ts`):
- Manual chunks:
  - `react-vendor`: `['react', 'react-dom']`
  - `router`: `['react-router']`
  - `markdown`: `['unified', 'remark-parse', 'remark-rehype', 'rehype-react']`
- Chunk file naming:
  - Routes containing `pages` → `assets/pages/[name]-[hash].js`
  - Routes containing `components` → `assets/components/[name]-[hash].js`
  - Default → `assets/js/[name]-[hash].js`

---

## 12. Markdown Rendering Pipeline

`frontend/src/utils/markdownToHtml.ts` implements a Unified.js pipeline:

1. `remarkParse` — parse markdown to mdast
2. `remarkGfm` — GitHub Flavored Markdown
3. `remarkRehype({ allowDangerousHtml: true })` — mdast → hast
4. `rehypeRaw` — parse raw HTML into hast
5. `rehypeSlug` — add IDs to headings
6. `rehypeAutolinkHeadings({ behavior: 'append' })` — anchor links
7. `rehypePrettyCode` — syntax highlighting (Shiki)
   - Themes: `catppuccin-latte` (light), `catppuccin-mocha` (dark)
   - `keepBackground: false`
   - Default lang: `plaintext`
8. `rehypeStringify` — serialize hast to HTML string
9. `rehypeReact` — convert HTML to React elements using custom `markdownComponents`

`rehype-sanitize` is installed but **commented out** in the pipeline.

Custom React components for rendered markdown are defined in `frontend/src/components/MarkdownComponents.tsx` — covers `h1`–`h6`, `p`, `a`, `blockquote`, `ul`/`ol`/`li`, `img` (uses `MarkdownImage`), `table`/`thead`/`tbody`/`tr`/`th`/`td`, `hr`, `em`, `strong`, `del`, `small`, `sup`/`sub`, `kbd`, `figure`/`figcaption`, `details`/`summary`, `mark`.

`MarkdownImage` (`frontend/src/components/MarkdownImage.tsx`) integrates with the lightbox context (`useLightbox`) so images are clickable and open in a full-screen lightbox.

---

## 13. Known Issues and TODOs

1. **No tests**: Zero test coverage on both frontend and backend.
2. **`AboutSerializer` bug**: `fields` is declared twice in `backend/blog/serializers.py`. The second `fields = '__all__'` overrides the first explicit list.
3. **Duplicate `CORS_ALLOWED_ORIGINS`**: Defined twice in `backend/backend/settings.py` (lines 24 and 167). The second definition overrides the first.
4. **Hardcoded proxy in dev Dockerfiles**: `HTTP_PROXY` / `HTTPS_PROXY` set to `127.0.0.1:20171` in both `Dockerfile.dev` files.
5. **PostgreSQL version**: `docker-compose.yml` specifies `postgres:18.0-alpine`. PostgreSQL 18 does not exist as of this writing; the latest stable is 16/17.
6. **`About` API data unused**: `frontend/src/pages/About.tsx` only renders `ProfileCard`; it does not consume the `About` model data fetched via `useAbout`.
7. **`content_format` field**: Commented out in `frontend/src/types/types.ts` (`//TODO: content_format: 'md' | 'mdx';`).
8. **`PageTransition.tsx` unused**: The standalone page transition component exists but is not used; `App.tsx` defines its own `AnimatedOutlet`.
9. **Future features** (from `dev_logs.md`): PWA, search, comments, RSS, reading progress (partially implemented), math formula support (KaTeX), client-side state management (Zustand), React Query migration.
