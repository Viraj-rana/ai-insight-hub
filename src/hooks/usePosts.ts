import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/types/blog';
import { blogPosts as staticPosts } from '@/data/blogPosts';

type SupabasePostRow = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  read_time: string;
  tags: string[] | null;
  cover_emoji: string;
  photo_urls: string[] | null;
};

const POSTS_COLUMNS = 'id, title, excerpt, content, date, read_time, tags, cover_emoji, photo_urls';

const mapPost = (row: SupabasePostRow): BlogPost => ({
  id: row.id,
  title: row.title,
  excerpt: row.excerpt,
  content: row.content,
  date: row.date,
  readTime: row.read_time,
  tags: row.tags ?? [],
  coverEmoji: row.cover_emoji,
  photoUrls: row.photo_urls ?? [],
});

export const usePosts = () =>
  useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(POSTS_COLUMNS)
        .order('date', { ascending: false });
      if (error) return staticPosts;

      const mapped = (data ?? []).map((row) => mapPost(row as SupabasePostRow));
      return mapped.length > 0 ? mapped : staticPosts;
    },
  });

export const usePost = (id: string) =>
  useQuery({
    queryKey: ['post', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(POSTS_COLUMNS)
        .eq('id', id)
        .maybeSingle();
      if (error) return staticPosts.find((post) => post.id === id) ?? null;
      return data ? mapPost(data as SupabasePostRow) : staticPosts.find((post) => post.id === id) ?? null;
    },
  });
