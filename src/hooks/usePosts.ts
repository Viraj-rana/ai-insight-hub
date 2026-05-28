import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { BlogPost } from '@/types/blog';
import { mergeAllPosts, staticPosts } from '@/lib/mergePosts';

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

async function fetchAllPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase.from('posts').select(POSTS_COLUMNS);

    if (error) {
      return mergeAllPosts([]);
    }

    const fromDb = (data ?? []).map((row) => mapPost(row as SupabasePostRow));
    return mergeAllPosts(fromDb);
  } catch {
    return mergeAllPosts([]);
  }
}

export const usePosts = () =>
  useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
    initialData: staticPosts,
    staleTime: 60_000,
  });

export const usePost = (id: string) =>
  useQuery({
    queryKey: ['post', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const all = await fetchAllPosts();
      return all.find((post) => post.id === id) ?? null;
    },
    placeholderData: () => staticPosts.find((post) => post.id === id) ?? undefined,
  });
