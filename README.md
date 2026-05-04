personal bloging page where i regularly uploaded intersting facts and real zone news and updates about AI and cool hacks,.

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing this application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your preferred IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your edits and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Supabase blog setup

This app uses Supabase directly from the frontend:

- Auth: sign up / sign in
- Data: posts, comments, likes, saves

### Sign up without email verification

After sign up, the app signs the user in immediately (no “check your email” step).

In the Supabase Dashboard go to **Authentication → Providers → Email** and turn **off** “Confirm email”.
If confirmation stays enabled, new users may not get a session until they verify mail.

### 1) Environment variables

Copy `.env.example` to `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_WRITER_EMAIL`
- `PORT` (optional for local Node server)

### 2) Database schema and RLS

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor.

Then run [`supabase/seed_blog_posts.sql`](supabase/seed_blog_posts.sql) in the same editor **or** rely on the app: the first time someone likes, saves, or comments on a built-in post, the app **inserts that post into `public.posts`** automatically (same data as `src/data/blogPosts.ts`).

The app can **show** posts from static files when the `posts` table is empty, but **comments, likes, and saves** require a row in `public.posts`. Seeding inserts all demo posts at once; auto-sync creates one row when needed.

To regenerate the seed file after editing `src/data/blogPosts.ts`, run `npm run seed:sql`.

It creates:

- `posts` table for blog content
- `comments`, `likes`, `saves` with `post_id -> posts.id` foreign keys
- `photo_urls` on `posts` for blog image galleries
- `post-images` storage bucket for uploaded blog photos
- Row Level Security policies:
  - public read for posts/comments/likes
  - authenticated users can insert/delete their own comments/likes/saves
  - users can read only their own saves

### 2.1) Post photo uploads

- Writer can upload up to 10 images while creating a post.
- Images are uploaded to Supabase Storage bucket `post-images`.
- Post stores public image URLs in `posts.photo_urls`.

### 3) JWT support

Supabase Auth already issues JWT access tokens after sign-in.

- Read current token from auth context:
  - `const { getAccessToken } = useAuth()`
- Build bearer headers for your own backend/API calls:
  - use `getJwtAuthHeaders()` from `src/lib/authHeaders.ts`

Example usage:

```ts
import { getJwtAuthHeaders } from '@/lib/authHeaders';

const headers = await getJwtAuthHeaders();
await fetch('/api/protected', { headers });
```
