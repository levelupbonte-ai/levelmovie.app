import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Project credentials configured for LevelUp Ecosystem
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

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

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
 * Sync user profile in Supabase
 */
export async function syncUserProfileSupabase(
  userId: string,
  data: {
    name?: string;
    displayName?: string;
    email?: string;
    photo?: string;
    photoURL?: string;
    username?: string;
    age?: number;
    profile_completed?: boolean;
    preferences?: any;
  }
) {
  if (!supabase) return null;
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: data.displayName || data.name,
        email: data.email,
        avatar_url: data.photoURL || data.photo,
        username: data.username,
        age: data.age,
        preferences: data.preferences,
        updated_at: new Date().toISOString()
      });
    if (error) console.warn('Supabase profile sync notice:', error.message);
    return true;
  } catch (err) {
    console.warn('Supabase profile error:', err);
    return false;
  }
}

/**
 * =========================================================================
 * 1. LEVELMUSIC SUPABASE SYNC (Liked tracks & playlists)
 * =========================================================================
 */
export async function fetchMusicLikesSupabase(userId: string): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('music_likes')
      .select('tracks')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data?.tracks) {
      return data.tracks;
    }
  } catch (err) {
    console.warn('Supabase fetchMusicLikes error:', err);
  }
  return [];
}

export async function syncMusicLikesSupabase(userId: string, tracks: any[]) {
  if (!supabase) return;
  try {
    await supabase
      .from('music_likes')
      .upsert({
        user_id: userId,
        tracks,
        updated_at: new Date().toISOString()
      });
  } catch (err) {
    console.warn('Supabase syncMusicLikes error:', err);
  }
}

export async function fetchMusicPlaylistsSupabase(userId: string): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('music_playlists')
      .select('*')
      .eq('user_id', userId);

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn('Supabase fetchMusicPlaylists error:', err);
  }
  return [];
}

export async function createMusicPlaylistSupabase(userId: string, playlist: { id: string; name: string; tracks: any[] }) {
  if (!supabase) return;
  try {
    await supabase
      .from('music_playlists')
      .upsert({
        id: playlist.id,
        user_id: userId,
        name: playlist.name,
        tracks: playlist.tracks,
        created_at: new Date().toISOString()
      });
  } catch (err) {
    console.warn('Supabase createMusicPlaylist error:', err);
  }
}

/**
 * =========================================================================
 * 2. LEVELUP OPPA FEED SUPABASE SYNC (Notifications & Bookmarks)
 * =========================================================================
 */
export async function fetchNotificationsSupabase(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn('Supabase fetchNotifications error:', err);
  }
  return [];
}

export async function createNotificationSupabase(notif: { title: string; body: string; type: string }) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        title: notif.title,
        body: notif.body,
        type: notif.type,
        created_at: new Date().toISOString()
      });
    return !error;
  } catch (err) {
    console.warn('Supabase createNotification error:', err);
    return false;
  }
}

export async function fetchOppaBookmarksSupabase(userId: string): Promise<string[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('oppa_bookmarks')
      .select('article_ids')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data?.article_ids) {
      return data.article_ids;
    }
  } catch (err) {
    console.warn('Supabase fetchOppaBookmarks error:', err);
  }
  return [];
}

export async function syncOppaBookmarksSupabase(userId: string, articleIds: string[]) {
  if (!supabase) return;
  try {
    await supabase
      .from('oppa_bookmarks')
      .upsert({
        user_id: userId,
        article_ids: articleIds,
        updated_at: new Date().toISOString()
      });
  } catch (err) {
    console.warn('Supabase syncOppaBookmarks error:', err);
  }
}

/**
 * =========================================================================
 * 3. LEVELDAY WEATHER PRO SUPABASE SYNC (Location & History)
 * =========================================================================
 */
export async function syncWeatherLocationSupabase(userId: string, locationData: { city: string; lat?: number; lon?: number }) {
  if (!supabase) return;
  try {
    await supabase
      .from('weather_settings')
      .upsert({
        user_id: userId,
        last_city: locationData.city,
        lat: locationData.lat,
        lon: locationData.lon,
        updated_at: new Date().toISOString()
      });
  } catch (err) {
    console.warn('Supabase syncWeatherLocation error:', err);
  }
}

/**
 * =========================================================================
 * 4. LEVELUP AVIS CLIENTS / REVIEWS SUPABASE SYNC
 * =========================================================================
 */
export interface ClientReview {
  id?: string;
  name: string;
  rating: number;
  comment: string;
  isVerified?: boolean;
  authMethod?: 'google' | 'key' | 'levelmovie';
  photoURL?: string | null;
  userId?: string;
  created_at?: string;
}

export async function fetchClientReviewsSupabase(): Promise<ClientReview[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        name: d.name || 'Utilisateur',
        rating: Number(d.rating) || 5,
        comment: d.comment || '',
        isVerified: d.is_verified ?? d.isVerified ?? false,
        authMethod: d.auth_method ?? d.authMethod ?? 'google',
        photoURL: d.photo_url ?? d.photoURL ?? null,
        userId: d.user_id ?? d.userId ?? '',
        created_at: d.created_at || new Date().toISOString()
      }));
    }
  } catch (err) {
    console.warn('Supabase fetchClientReviews error:', err);
  }
  return [];
}

export async function postClientReviewSupabase(review: ClientReview): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('reviews')
      .insert({
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        is_verified: review.isVerified ?? false,
        auth_method: review.authMethod ?? 'google',
        photo_url: review.photoURL ?? null,
        user_id: review.userId ?? null,
        created_at: new Date().toISOString()
      });
    return !error;
  } catch (err) {
    console.warn('Supabase postClientReview error:', err);
    return false;
  }
}
