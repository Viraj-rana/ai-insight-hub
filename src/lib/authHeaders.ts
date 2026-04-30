import { supabase } from '@/lib/supabase';

export const getJwtAuthHeaders = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const accessToken = data.session?.access_token;
  if (!accessToken) return {};

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};
