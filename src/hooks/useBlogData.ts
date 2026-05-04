import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ensurePostRowExists } from '@/lib/ensurePostRow';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { BlogPost } from '@/types/blog';

function throwIfMissingPostRow(error: { message?: string; code?: string }) {
  const msg = error.message || '';
  if (
    msg.includes('_post_id_fkey') ||
    (error.code === '23503' && msg.toLowerCase().includes('post_id'))
  ) {
    throw new Error(
      'Could not link this action to a post row. Try again or run supabase/seed_blog_posts.sql in the SQL editor.'
    );
  }
  throw error;
}

// ---- Comments ----
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    enabled: Boolean(postId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

export const useAddComment = (postId: string, sourcePost?: BlogPost | null) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!user) throw new Error('Must be logged in');
      if (!postId) throw new Error('Post id is required');
      await ensurePostRowExists(postId, sourcePost);
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.id,
        author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        content: text,
      });
      if (error) throwIfMissingPostRow(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
};

// ---- Likes ----
export const useLikes = (postId: string) => {
  const { user } = useAuth();

  const countQuery = useQuery({
    queryKey: ['likes-count', postId],
    enabled: Boolean(postId),
    queryFn: async () => {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);
      if (error) throw error;
      return count ?? 0;
    },
  });

  const userLikedQuery = useQuery({
    queryKey: ['likes-user', postId, user?.id],
    enabled: !!user && Boolean(postId),
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  return { count: countQuery.data ?? 0, userLiked: userLikedQuery.data ?? false, isLoading: countQuery.isLoading };
};

export const useToggleLike = (postId: string, sourcePost?: BlogPost | null) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (currentlyLiked: boolean) => {
      if (!user) throw new Error('Must be logged in');
      if (!postId) throw new Error('Post id is required');
      if (currentlyLiked) {
        const { error } = await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
        if (error) throw error;
      } else {
        await ensurePostRowExists(postId, sourcePost);
        const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
        if (error) throwIfMissingPostRow(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes-count', postId] });
      queryClient.invalidateQueries({ queryKey: ['likes-user', postId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
};

// ---- Saves ----
export const useSaves = (postId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['saves', postId, user?.id],
    enabled: !!user && Boolean(postId),
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('saves')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
};

export const useToggleSave = (postId: string, sourcePost?: BlogPost | null) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (currentlySaved: boolean) => {
      if (!user) throw new Error('Must be logged in');
      if (!postId) throw new Error('Post id is required');
      if (currentlySaved) {
        const { error } = await supabase.from('saves').delete().eq('post_id', postId).eq('user_id', user.id);
        if (error) throw error;
      } else {
        await ensurePostRowExists(postId, sourcePost);
        const { error } = await supabase.from('saves').insert({ post_id: postId, user_id: user.id });
        if (error) throwIfMissingPostRow(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saves', postId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
};
