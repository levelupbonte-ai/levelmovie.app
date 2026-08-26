import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support both standard Supabase and new Supabase Publishable / Anon / Public key conventions
const env = (import.meta as any).env || {};
const supabaseUrl = 
  env.VITE_SUPABASE_URL || 
  env.VITE_SUPABASE_PROJECT_URL || 
  env.SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  env.VITE_SUPABASE_ANON_KEY || 
  env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  env.VITE_SUPABASE_PUBLIC_KEY || 
  env.VITE_SUPABASE_KEY || 
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
