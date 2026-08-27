import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Project credentials configured for LevelMovie
const DEFAULT_SUPABASE_URL = 'https://epprgkolsywdfouffpmj.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_J_zIAK8taiWhsXWk3Rla6Q_Y9fEmnB5';

const env = (import.meta as any).env || {};
export const supabaseUrl = 
  env.VITE_SUPABASE_URL || 
  env.VITE_SUPABASE_PROJECT_URL || 
  env.SUPABASE_URL || 
  DEFAULT_SUPABASE_URL;

export const supabaseAnonKey = 
  env.VITE_SUPABASE_ANON_KEY || 
  env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  env.VITE_SUPABASE_PUBLIC_KEY || 
  env.VITE_SUPABASE_KEY || 
  DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey && supabase);

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Helper to sync user profile in Supabase
 */
export async function syncUserProfileSupabase(userId: string, data: { name?: string; email?: string; photo?: string; preferences?: any }) {
  if (!supabase) return null;
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: data.name,
        email: data.email,
        avatar_url: data.photo,
        preferences: data.preferences,
        updated_at: new Date().toISOString()
      });
    if (error) {
      console.warn('Supabase profile sync notice (table may need creation):', error.message);
    }
    return true;
  } catch (err) {
    console.warn('Supabase profile error:', err);
    return false;
  }
}

/**
 * Helper to sync watchlist in Supabase
 */
export async function syncWatchlistSupabase(userId: string, watchlist: any[]) {
  if (!supabase) return null;
  try {
    const { error } = await supabase
      .from('user_watchlists')
      .upsert({
        user_id: userId,
        items: watchlist,
        updated_at: new Date().toISOString()
      });
    if (error) {
      console.warn('Supabase watchlist sync notice:', error.message);
    }
    return true;
  } catch (err) {
    console.warn('Supabase watchlist error:', err);
    return false;
  }
}

