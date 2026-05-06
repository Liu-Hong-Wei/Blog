# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Primary reference

`AGENTS.md` at the repo root is the authoritative agent guide — read it first. It covers stack, structure, env vars, deployment, data models, API endpoints, the markdown pipeline, and known issues/TODOs. Don't duplicate its content here; update it when project facts change.

## Commands

Frontend (`cd frontend`):
- `npm run dev` — Vite dev server on :5173
- `npm run build` — type-check (`tsc -b`) then Vite build
- `npm run lint` — ESLint + Prettier check
- No test runner configured.

Backend (`cd backend`):
- `python manage.py runserver 0.0.0.0:8000`
- `python manage.py migrate`
- `python manage.py createsuperuser` — needed to author content via `/admin`
- `backend/blog/tests.py` is empty; no tests run.

Docker:
- Dev (no db service, falls back to SQLite): `docker compose -f docker-compose.dev.yml up --build`
- Prod-style: `docker compose up -d --build`

## Architecture notes worth knowing up front

- **Read-only public API.** All content management happens through Django Admin (`/admin`). DRF viewsets are `ReadOnlyModelViewSet` with `AllowAny`. Don't add write endpoints without explicit ask.
- **Suspense-based data fetching, not React Query.** `frontend/src/utils/resource.ts` implements a custom Suspense-compatible resource; hooks like `usePosts`/`usePost`/`useAbout` wrap it with module-level singleton caches. Errors propagate to `SuspenseErrorBoundary`.
- **API base URL** is `/api` in prod (Nginx in the frontend container proxies `/api` and `/admin` to the backend) and `http://localhost:8000/api` in dev. See `frontend/src/services/api.ts`.
- **Markdown pipeline** lives in `frontend/src/utils/markdownToHtml.ts` (Unified.js → Shiki via `rehype-pretty-code` with `catppuccin-latte`/`catppuccin-mocha`, then `rehypeReact` with custom components from `MarkdownComponents.tsx`). `rehype-sanitize` is installed but intentionally commented out — raw HTML is allowed.
- **Lightbox integration**: markdown images route through `MarkdownImage.tsx`, which uses `useLightbox` context — preserve this when touching image rendering.
- **Routing**: `App.tsx` uses `react-router` v7 with `React.lazy()` for all pages except `Test.tsx`. Route transitions are handled by an inline `AnimatedOutlet` (the standalone `PageTransition.tsx` is unused — don't wire to it).
- **Vite manual chunks** (`vite.config.ts`): `react-vendor`, `router`, `markdown`. Pages and components get separate output paths (`assets/pages/...`, `assets/components/...`).
- **Theme**: Tailwind v4 with `@theme` tokens in `index.css` (`--color-bgprimary`, `--color-bgsecondary`, `--color-primary`, `--color-secondary`). FOUC-prevention script is inlined in `index.html`.
- **Database fallback**: backend uses Postgres if `DB_NAME` is set in `.env`, otherwise SQLite. The dev compose file deliberately omits a `db` service.
- **Deployment** is push-to-`main` → GitHub Actions SSH → `git pull && docker compose up --build -d` on the VPS. See `.github/workflows/deploy.yml`.

## Known landmines

See `AGENTS.md` §13 for the full list. The most likely to bite:
- `AboutSerializer.fields` is declared twice in `backend/blog/serializers.py` — second wins.
- `CORS_ALLOWED_ORIGINS` defined twice in `backend/backend/settings.py`.
- Dev Dockerfiles hardcode `HTTP_PROXY=http://127.0.0.1:20171` — will fail outside the original author's machine.
