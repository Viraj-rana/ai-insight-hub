# Render Deployment Guide

## 1) Push latest code to GitHub

Make sure your repository contains:
- `render.yaml`
- `server.js`
- `package.json` scripts:
  - `build`: `vite build`
  - `start`: `node server.js`

## 2) Create service on Render

1. Open Render Dashboard.
2. Click **New +** -> **Blueprint**.
3. Select your GitHub repository.
4. Render will detect `render.yaml` and create a static web service.

## 3) Set environment variables (required)

In Render service -> **Environment**, set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_WRITER_EMAIL`

Then deploy/redeploy.

## 4) Verify deployment

- Open the Render URL.
- Test:
  - Home page loads
  - Auth sign-in works
  - Like/comment/save actions work
  - New post appears for writer account only

## Notes

- This app is deployed as a static site from `dist`.
- A rewrite rule sends all routes to `/index.html` so React Router links work.
- `VITE_` variables are used at build time, so ensure they are present before the build starts.
