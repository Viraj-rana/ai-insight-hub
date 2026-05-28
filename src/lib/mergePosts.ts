import { blogPosts as staticPosts } from '@/data/blogPosts';
import type { BlogPost } from '@/types/blog';

/**
 * Union of built-in demo posts and rows from Supabase.
 * Same `id` → Supabase row wins. Sorted by `date` (newest first).
 */
export function mergeAllPosts(fromDatabase: BlogPost[]): BlogPost[] {
  const byId = new Map<string, BlogPost>();
  for (const post of staticPosts) {
    byId.set(post.id, post);
  }
  for (const post of fromDatabase) {
    byId.set(post.id, post);
  }
  return Array.from(byId.values()).sort((a, b) => {
    const ta = new Date(a.date).getTime();
    const tb = new Date(b.date).getTime();
    const safeA = Number.isNaN(ta) ? 0 : ta;
    const safeB = Number.isNaN(tb) ? 0 : tb;
    return safeB - safeA;
  });
}

export { staticPosts };
