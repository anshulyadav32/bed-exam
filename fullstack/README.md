# Fullstack App

This folder is the single entrypoint for the combined application.

- Frontend: rendered by the Next.js app in `../backend/app`
- Backend API: available from the same root URL under `/api/*`

Examples:

- Frontend root: `https://your-root-url/`
- Backend health endpoint: `https://your-root-url/api/health`

Commands:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run migrate`

All commands delegate to the combined Next.js app that already contains both UI pages and API routes.