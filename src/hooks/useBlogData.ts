import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ---- Comments ----
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
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

export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.id,
        author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        content: text,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
};

// ---- Likes ----
export const useLikes = (postId: string) => {
  const { user } = useAuth();

  const countQuery = useQuery({
    queryKey: ['likes-count', postId],
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
    enabled: !!user,
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

export const useToggleLike = (postId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (currentlyLiked: boolean) => {
      if (!user) throw new Error('Must be logged in');
      if (currentlyLiked) {
        const { error } = await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes-count', postId] });
      queryClient.invalidateQueries({ queryKey: ['likes-user', postId, user?.id] });
    },
  });
};

// ---- Saves ----
export const useSaves = (postId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['saves', postId, user?.id],
    enabled: !!user,
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

export const useToggleSave = (postId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (currentlySaved: boolean) => {
      if (!user) throw new Error('Must be logged in');
      if (currentlySaved) {
        const { error } = await supabase.from('saves').delete().eq('post_id', postId).eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('saves').insert({ post_id: postId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saves', postId, user?.id] });
    },
  });
};
