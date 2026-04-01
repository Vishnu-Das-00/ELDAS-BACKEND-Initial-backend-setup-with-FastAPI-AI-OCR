# Eldas Frontend

React frontend for Eldas, built with Vite, TypeScript, Tailwind CSS, React Router, TanStack Query, Axios, Zustand, React Hook Form, Zod, Sonner, and Recharts.

## Features

- Role-based auth for teacher, student, and parent users
- Shared SaaS-style app shell with responsive sidebar and mobile navigation
- Teacher classroom analytics and test builder
- Student classroom join, submission upload, and cognitive evaluation views
- Parent child-linking, progress reports, warnings, and notifications
- In-app notifications with mark-as-read support
- Chart-driven progress and classroom performance views

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
# PowerShell: Copy-Item .env.example .env
```

3. Start the dev server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Run the end-to-end flow against the FastAPI backend:

```bash
npm run e2e
```

This launches the frontend on `http://127.0.0.1:4173` and a SQLite-backed backend on `http://127.0.0.1:8001` through [playwright.config.ts](/F:/eldas/eldas-frontend/playwright.config.ts). By default the E2E suite uses the installed Microsoft Edge channel on Windows; if you prefer another Playwright browser, set `PLAYWRIGHT_CHANNEL` before running the command.

## Environment

Required variable:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Point this to the FastAPI backend base path for your deployed environment.

For end-to-end runs, the frontend reads [.env.e2e](/F:/eldas/eldas-frontend/.env.e2e), which points at the temporary backend launched by the Playwright config.

## Deployment

### Vercel

- Import `eldas-frontend` as the project root.
- Set `VITE_API_BASE_URL` in the Vercel environment settings.
- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback is handled by [vercel.json](/F:/eldas/eldas-frontend/vercel.json)

### Netlify

- Base directory: `eldas-frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Add `VITE_API_BASE_URL` in Site Configuration.
- SPA fallback is handled by [netlify.toml](/F:/eldas/eldas-frontend/netlify.toml) and [public/_redirects](/F:/eldas/eldas-frontend/public/_redirects)

### Railway

- Create a static frontend service rooted at `eldas-frontend`
- Set build command to `npm run build`
- Serve the generated `dist` folder with Railway static hosting or your preferred static adapter
- Add `VITE_API_BASE_URL` in Railway variables

## Project structure

```text
src/
  app/
  components/
  features/
  hooks/
  layouts/
  lib/
  pages/
  routes/
  services/
  store/
  types/
  utils/
```
