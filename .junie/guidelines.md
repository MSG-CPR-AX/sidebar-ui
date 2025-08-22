# Project Guidelines — SideBeam (Sidebar UI)

This document provides a concise project overview and practical instructions for Junie to work effectively in this repository.

## Project Overview
SideBeam is a production‑ready Chrome MV3 side panel extension for bookmark management and sharing, with optional GitLab integration. It features:
- Side panel UI optimized for the narrow viewport
- Virtualized lists (1000+ bookmarks)
- Advanced search and filtering
- Local Chrome bookmarks integration
- Optional GitLab‑backed CRUD for shared bookmarks
- Modern React + TypeScript stack with Vite and Tailwind CSS

## Tech Stack
- Runtime/UI: React 18, TypeScript, Tailwind CSS
- Data: TanStack Query (React Query)
- Build tooling: Vite, @crxjs/vite-plugin for MV3
- Testing: Vitest (+ @testing-library), Playwright for E2E
- Lint/Format: ESLint, Prettier (+ tailwindcss plugin)

## Project Structure (high‑level)
- public/ — extension public assets, MV3 manifest and static files
- src/
  - components/
    - bookmarks/ — bookmark views and list components (TSX)
    - layout/ — header, sidebar, layout shell
    - ui/ — primitive UI components (button, input, icon, loading)
    - local-bookmarks/ — local Chrome bookmarks views
  - hooks/ — custom hooks (e.g., use-bookmarks)
  - lib/ — api/query clients and utilities
  - data/ — example JSON/data loaders
  - styles/ — global styles (Tailwind)
  - main.tsx — app entry, React mounting
- config: vite.config.ts, tsconfig*.json, tailwind.config.js, eslint.config.js, vitest.config.ts, playwright.config.ts

## Environment Configuration
Environment variables are read via Vite (VITE_*):
- VITE_API_BASE_URL
- VITE_GITLAB_BASE_URL
- VITE_GITLAB_PROJECT_PATH
- VITE_USE_MOCK (boolean, enables mock data)
- VITE_SENTRY_DSN (optional)

Create a local .env or pass env vars via your shell. For quick local work without a backend, prefer VITE_USE_MOCK=true.

## Commands
- Development
  - npm run dev — start dev server (real API if configured)
  - npm run dev:mock — start dev server with mock data
- Build/Preview
  - npm run build — typecheck + production build to dist/
  - npm run preview — preview the built app
- Quality
  - npm run typecheck — TypeScript compile check
  - npm run lint — ESLint
  - npm run lint:fix — ESLint with fixes
  - npm run format — Prettier format src/**/*.{ts,tsx,css,md}
- Tests
  - npm run test — unit tests (Vitest)
  - npm run test:ui — Vitest UI runner
  - npm run test:e2e — Playwright E2E tests

Tip: For E2E the first time, install browsers: npx playwright install

## Load the Extension in Chrome (manual test)
1) npm run build
2) Open chrome://extensions, enable Developer mode
3) Load unpacked → select dist/ folder

## Coding Guidelines for Junie
- Prefer TypeScript in src/**/*.ts(x); maintain strict typings and avoid any unless essential.
- Keep UI changes in components/ui or feature folders; avoid coupling UI and data layers.
- Use TanStack Query for async data and caching; keep side effects in hooks/lib.
- Follow Tailwind utility conventions; avoid inline styles.
- Keep components small and accessible; leverage @testing-library for UI tests.

## What Junie Should Run Before Submitting Changes
- For logic/TS changes: npm run typecheck && npm run test
- For UI/behavior changes: also consider npm run test:e2e (optional if unaffected)
- For extension‑related changes: npm run build to ensure dist compiles
- For docs/config only: no build/tests required unless specified by the task

## Notes
- Node.js 18+ recommended.
- This guidelines file is for operational clarity; see README.md for a more comprehensive product overview and usage details.
