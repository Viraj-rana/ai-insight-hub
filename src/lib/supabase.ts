import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://smlebcxvxwrimyvbayif.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtbGViY3h2eHdyaW15dmJheWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjkzMzYsImV4cCI6MjA4NjgwNTMzNn0.THeT35lCwNQ9PQtK9CD921SkXFLSApDbafxpfxgIv1o';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
