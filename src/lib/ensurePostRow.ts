import { supabase } from '@/lib/supabase';
import { blogPosts } from '@/data/blogPosts';
import type { BlogPost } from '@/types/blog';

/**
 * Ensures public.posts has a row for postId so comments/likes/saves FK succeed.
 * Uses the in-memory post from the page when provided, otherwise static blogPosts.
 */
export async function ensurePostRowExists(postId: string, source?: BlogPost | null): Promise<void> {
  const { data: existing, error: selectError } = await supabase
    .from('posts')
    .select('id')
    .eq('id', postId)
    .maybeSingle();
  if (selectError) throw selectError;
  if (existing) return;

  const post = source ?? blogPosts.find((p) => p.id === postId);
  if (!post) {
    throw new Error(
      'This post is not in the database and has no built-in copy to sync. Open it from the home page or add it in Supabase.'
    );
  }

  const row = {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: post.date,
    read_time: post.readTime,
    tags: post.tags,
    cover_emoji: post.coverEmoji,
    photo_urls: post.photoUrls ?? [],
  };

  const { error } = await supabase.from('posts').insert(row);
  if (error) {
    if (error.code === '23505') return;
    throw error;
  }
}
