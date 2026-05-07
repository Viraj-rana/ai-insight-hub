# Railway Deployment Guide

This guide will help you deploy your AI Insight Hub to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Your Supabase project URL and anon key

## Deployment Steps

### 1. Prepare Environment Variables

Before deploying, you need to set up your environment variables in Railway:

1. Go to your Railway project dashboard
2. Navigate to the "Variables" tab
3. Add the following environment variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Note:** Railway will automatically set the `PORT` environment variable, so you don't need to set it manually.

### 2. Deploy to Railway

#### Option A: Deploy via GitHub (Recommended)

1. Push your code to a GitHub repository
2. In Railway dashboard, click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect it's a Node.js project
6. Add your environment variables in the Variables tab
7. Railway will build and deploy automatically

#### Option B: Deploy via Railway CLI

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Link to project: `railway link`
5. Set environment variables: `railway variables set VITE_SUPABASE_URL=your-url`
6. Deploy: `railway up`

### 3. Build Configuration

Railway will automatically:
- Run `npm install` to install dependencies
- Run `npm run build` to build your Vite app
- Run `npm start` to start the production server

The production server (`server.js`) will:
- Serve static files from the `dist` directory
- Handle SPA routing (all routes serve `index.html`)
- Use the PORT environment variable provided by Railway

### 4. Verify Deployment

After deployment:
1. Check the Railway logs to ensure the build succeeded
2. Visit your Railway-provided URL
3. Test all routes to ensure SPA routing works correctly
4. Verify Supabase connection is working

## Troubleshooting

### Build Fails
- Check that all dependencies are listed in `package.json`
- Ensure Node.js version is compatible (Railway uses Node 18+ by default)

### Environment Variables Not Working
- Make sure variables are prefixed with `VITE_` for client-side access
- Restart the deployment after adding variables
- Check Railway logs for any errors

### SPA Routing Issues
- Ensure `server.js` is correctly serving `index.html` for all routes
- Check that the build output exists in the `dist` directory

### Port Issues
- Railway automatically sets the PORT variable
- The server.js reads `process.env.PORT` automatically
- No manual configuration needed

## Security Notes

- ✅ Environment variables are now used instead of hardcoded credentials
- ✅ `.env` files are excluded from git via `.gitignore`
- ✅ Supabase anon key is safe to expose in client-side code (it's public by design)
- ⚠️ Never commit `.env` files with real credentials

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vite Production Guide](https://vitejs.dev/guide/build.html)
- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)
