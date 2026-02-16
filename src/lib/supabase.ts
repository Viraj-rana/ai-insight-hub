import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://smlebcxvxwrimyvbayif.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtbGViY3h2eHdyaW15dmJheWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjkzMzYsImV4cCI6MjA4NjgwNTMzNn0.THeT35lCwNQ9PQtK9CD921SkXFLSApDbafxpfxgIv1o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
