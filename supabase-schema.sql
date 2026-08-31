-- =========================================================================
--  LEVELMOVIE & LEVELUP ECOSYSTEM - SCHÉMA COMPLET SUPABASE (POSTGRESQL)
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILS & STATUT VIP (4 CONNEXIONS / SEMAINE)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  age INTEGER DEFAULT 18,
  is_vip BOOLEAN DEFAULT FALSE,
  weekly_logins_count INTEGER DEFAULT 1,
  current_week_key TEXT,
  last_login_date DATE DEFAULT CURRENT_DATE,
  dona_used_today INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  parental_filter BOOLEAN DEFAULT TRUE,
  low_data_mode BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 2. JOURNAL D'ASSIDUITÉ HEBDOMADAIRE
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_key TEXT NOT NULL,
  login_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, login_date)
);

CREATE INDEX IF NOT EXISTS idx_user_activity ON public.user_activity_logs(user_id, week_key);

-- 3. FAVORIS & HISTORIQUE DE REPRISE
CREATE TABLE IF NOT EXISTS public.watchlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  movie_id TEXT NOT NULL,
  media_type TEXT DEFAULT 'movie',
  title TEXT NOT NULL,
  poster_path TEXT,
  backdrop_path TEXT,
  vote_average NUMERIC(3, 1),
  release_date TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, movie_id, media_type)
);

CREATE TABLE IF NOT EXISTS public.watch_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  movie_id TEXT NOT NULL,
  media_type TEXT DEFAULT 'movie',
  title TEXT NOT NULL,
  poster_path TEXT,
  season INTEGER DEFAULT 1,
  episode INTEGER DEFAULT 1,
  progress_seconds NUMERIC DEFAULT 0,
  duration_seconds NUMERIC DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, movie_id, season, episode)
);

-- 4. DONA IA (SESSIONS & MESSAGES)
CREATE TABLE IF NOT EXISTS public.dona_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dona_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES public.dona_sessions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WATCH PARTIES & CHAT EN DIRECT
CREATE TABLE IF NOT EXISTS public.watch_parties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  host_id TEXT NOT NULL,
  host_name TEXT DEFAULT 'Hôte LevelMovie',
  movie_id TEXT NOT NULL,
  media_type TEXT DEFAULT 'movie',
  title TEXT NOT NULL,
  poster_path TEXT,
  season INTEGER DEFAULT 1,
  episode INTEGER DEFAULT 1,
  playback_position NUMERIC DEFAULT 0,
  is_playing BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.watch_party_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  party_id UUID REFERENCES public.watch_parties(id) ON DELETE CASCADE,
  user_id TEXT,
  username TEXT NOT NULL,
  avatar_url TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AVIS, NOTIFICATIONS, RAPPELS & SIGNALEMENTS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_vip_author BOOLEAN DEFAULT FALSE,
  photo_url TEXT,
  movie_id TEXT,
  media_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.movie_reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  movie_id TEXT NOT NULL,
  media_type TEXT DEFAULT 'movie',
  title TEXT NOT NULL,
  release_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, movie_id)
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT,
  movie_id TEXT NOT NULL,
  media_type TEXT DEFAULT 'movie',
  title TEXT,
  season INTEGER,
  episode INTEGER,
  problem_type TEXT NOT NULL,
  player_source TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ÉCOSYSTÈME LEVELUP (Music, Oppa Feed, Weather)
CREATE TABLE IF NOT EXISTS public.music_likes (
  user_id TEXT PRIMARY KEY,
  tracks JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.music_playlists (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  tracks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.oppa_bookmarks (
  user_id TEXT PRIMARY KEY,
  article_ids JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.weather_settings (
  user_id TEXT PRIMARY KEY,
  last_city TEXT,
  lat NUMERIC,
  lon NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SÉCURITÉ ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dona_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dona_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_party_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oppa_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_settings ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès ouvertes pour l'application
DO $$ 
DECLARE
  tbl text;
  tbls text[] := ARRAY[
    'profiles', 'user_activity_logs', 'watchlist', 'watch_history',
    'dona_sessions', 'dona_messages', 'watch_parties', 'watch_party_messages',
    'reviews', 'notifications', 'movie_reminders', 'reports',
    'music_likes', 'music_playlists', 'oppa_bookmarks', 'weather_settings'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    EXECUTE format('DROP POLICY IF EXISTS "app_access_policy" ON public.%I', tbl);
    EXECUTE format('CREATE POLICY "app_access_policy" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;
