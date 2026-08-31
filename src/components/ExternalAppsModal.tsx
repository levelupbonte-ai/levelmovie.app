import React, { useState, useEffect } from 'react';
import { 
  RotateCw, Music, Flame, Sun, 
  MessageSquare, LogOut, Home,
  Layers, ExternalLink, Tv
} from 'lucide-react';
import { LevelMusicApp } from './apps/LevelMusicApp';
import { LevelOppaApp } from './apps/LevelOppaApp';
import { LevelDayApp } from './apps/LevelDayApp';
import { LevelReviewsApp } from './apps/LevelReviewsApp';
import { LevelAnimeApp } from './apps/LevelAnimeApp';
import { LevelMovieLogo } from '../constants';

interface LevelApp {
  id: 'level-anime' | 'level-music' | 'level-oppa' | 'level-day' | 'level-reviews';
  name: string;
  category: string;
  tagline: string;
  description: string;
  iconType: 'anime' | 'music' | 'oppa' | 'weather' | 'reviews';
  badge: string;
  badgeColor: string;
  rating: string;
  downloads: string;
  accentColor: string;
  features: string[];
}

interface ExternalAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  user?: any;
  onRequireAuth?: () => void;
  showToast?: (msg: string, type?: string) => void;
}

export const ExternalAppsModal: React.FC<ExternalAppsModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  onRequireAuth,
  showToast
}) => {
  const isFr = lang === 'fr';

  // The Official LevelUp Ecosystem Apps
  const officialApps: LevelApp[] = [
    {
      id: 'level-anime',
      name: 'LevelAnime',
      category: isFr ? 'Anime & Simulcast HD' : 'Anime & Simulcast',
      tagline: isFr ? 'Catalogue Anime complet, épisodes en VF/VOSTFR et classements' : 'Complete Anime hub, VF/VOSTFR episodes & rankings',
      description: isFr
        ? 'Plateforme ultime d’anime avec streaming des épisodes par saison, top 10 des sorties, lecteur multivoix VF & VOSTFR et base de données complète.'
        : 'Ultimate anime portal featuring full season streams, top rankings, multi-server player and extensive catalog.',
      iconType: 'anime',
      badge: 'LevelAnime',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
      rating: '5.0',
      downloads: '75.4k',
      accentColor: 'from-red-600/30 via-rose-600/10 to-transparent',
      features: [
        isFr ? 'Lecteur d’épisodes par saisons & serveurs multiples' : 'Season episode player & multi-servers',
        isFr ? 'Simulcasts, classements mondiaux & genres' : 'Simulcasts, worldwide charts & genres',
        isFr ? 'Listes de favoris et mode découverte' : 'Anime watchlist & surprise explorer'
      ]
    },
    {
      id: 'level-music',
      name: 'LevelMusic',
      category: isFr ? 'Musique & Hi-Fi OST' : 'Music & Audio',
      tagline: isFr ? 'Streaming musical, playlists et hits mondiaux' : 'Global hits, curated tracks & playlists',
      description: isFr 
        ? 'Lecteur audio interactif avec recherche intégrée, classements mondiaux, création de playlists et synchronisation Supabase.'
        : 'Interactive music player with catalog search, charts, custom playlists, and cloud sync.',
      iconType: 'music',
      badge: 'LevelMusic',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      rating: '4.9',
      downloads: '48.2k',
      accentColor: 'from-blue-600/30 via-indigo-600/10 to-transparent',
      features: [
        isFr ? 'Lecteur audio avec scrubbing en direct' : 'Live audio player with seek control',
        isFr ? 'Playlists & Favoris synchronisés' : 'Synced Playlists & Favorites',
        isFr ? 'Liaisons directes Apple Music, Spotify, YouTube' : 'Apple Music, Spotify & YouTube links'
      ]
    },
    {
      id: 'level-oppa',
      name: 'LevelUp - Oppa Feed',
      category: isFr ? 'Actus & Moments Vidéo' : 'News & Video Moments',
      tagline: isFr ? 'Fil d’actualité, Stories 24h et Trailers cinéma' : 'Newsfeed, 24h Stories & Movie Trailers',
      description: isFr 
        ? 'Réseau d’actualités cinéma et pop-culture avec Stories dynamiques, vidéos Moments façon reels, galerie Shows et Radar de sorties.'
        : 'Cinema & pop-culture hub featuring dynamic Stories, vertical Moment reels, Shows wall, and Radar releases.',
      iconType: 'oppa',
      badge: 'Oppa Feed',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      rating: '5.0',
      downloads: '64.5k',
      accentColor: 'from-purple-600/30 via-pink-600/10 to-transparent',
      features: [
        isFr ? 'Stories interactives avec pistes sonores' : 'Interactive stories with soundtrack clips',
        isFr ? 'Moments : Bandes-annonces en plein écran' : 'Moments : Fullscreen movie trailer reels',
        isFr ? 'Espace VIP & notifications en direct' : 'VIP Hub & realtime alerts'
      ]
    },
    {
      id: 'level-day',
      name: 'LevelDay - Weather Pro',
      category: isFr ? 'Météo & Radar Satellite' : 'Weather Radar & Satellite',
      tagline: isFr ? 'Prévisions ultra précises et arc solaire' : 'High-precision forecasts & solar arc',
      description: isFr 
        ? 'Station météo avancée avec prévisions heure par heure, arc de trajectoire solaire/lunaire en temps réel et analyse de qualité d’air EPA.'
        : 'Advanced meteorological dashboard with hourly forecasts, live sun/moon trajectory arc, and air quality indices.',
      iconType: 'weather',
      badge: 'Weather Pro',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      rating: '4.8',
      downloads: '31.7k',
      accentColor: 'from-amber-600/30 via-orange-600/10 to-transparent',
      features: [
        isFr ? 'Arc solaire & nocturne en temps réel' : 'Live solar & nighttime arc physics',
        isFr ? 'Prévisions 24h et alertes météo' : '24h forecast & severe weather alerts',
        isFr ? 'Qualité de l’air & phases de la Lune' : 'Air quality EPA & Moon phases'
      ]
    },
    {
      id: 'level-reviews',
      name: 'Avis Clients - LevelUp',
      category: isFr ? 'Avis & Communauté' : 'Reviews & Feedback',
      tagline: isFr ? 'Retours d’expérience certifiés et notations' : 'Certified customer feedback & ratings',
      description: isFr 
        ? 'Plateforme officielle d’avis et d’évaluation des services LevelUp, avec certification par Clé VIP ou compte utilisateur relié à Supabase.'
        : 'Official community feedback hub with VIP key certification and cloud-synced reviews.',
      iconType: 'reviews',
      badge: 'Certifié',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      rating: '4.9',
      downloads: '22.1k',
      accentColor: 'from-emerald-600/30 via-teal-600/10 to-transparent',
      features: [
        isFr ? 'Publication instantanée d’avis 1 à 5 étoiles' : 'Instant 1 to 5 stars reviews',
        isFr ? 'Certification par Clé privée LevelUp' : 'LevelUp private key verification',
        isFr ? 'Synchronisation directe avec la base Supabase' : 'Direct Supabase database syncing'
      ]
    }
  ];

  const [currentAppId, setCurrentAppId] = useState<LevelApp['id'] | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('modal', 'apps');
        if (currentAppId) {
          url.searchParams.set('app', currentAppId);
        }
        window.history.replaceState({}, '', url.pathname + '?' + url.searchParams.toString() + url.hash);
      } catch (_) {}
    } else {
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.get('modal') === 'apps') {
          url.searchParams.delete('modal');
          url.searchParams.delete('app');
          url.searchParams.delete('apps');
          const qs = url.searchParams.toString();
          window.history.replaceState({}, '', url.pathname + (qs ? '?' + qs : '') + url.hash);
        }
      } catch (_) {}
    }
  }, [isOpen, currentAppId]);

  if (!isOpen) return null;

  const currentApp = officialApps.find(a => a.id === currentAppId) || null;

  const getAppIcon = (type: LevelApp['iconType']) => {
    switch (type) {
      case 'anime':
        return <LevelMovieLogo className="w-7 h-7" color="#ef4444" />;
      case 'music':
        return <Music className="w-7 h-7 text-blue-400" />;
      case 'oppa':
        return <Flame className="w-7 h-7 text-purple-400" />;
      case 'weather':
        return <Sun className="w-7 h-7 text-amber-400" />;
      case 'reviews':
        return <MessageSquare className="w-7 h-7 text-emerald-400" />;
      default:
        return <Layers className="w-7 h-7 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[9650] w-screen h-screen bg-[#040509] text-white flex flex-col overflow-hidden animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* TOP ECOSYSTEM HEADER BAR                                                  */}
      {/* ========================================================================= */}
      <header className="h-16 px-4 sm:px-6 bg-[#080911] border-b border-white/10 flex items-center justify-between gap-3 shrink-0 z-40">
        
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-black tracking-wider text-white">
            Level<span className="text-[#a855f7]">Up</span>
            <span className="text-white/60 ml-1 font-semibold text-sm sm:text-base">
              {currentApp ? `• ${currentApp.name}` : 'App Store'}
            </span>
          </span>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Quick Login if Guest */}
          {(!user || user.isGuest) && (
            <button
              onClick={onRequireAuth}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
            >
              {isFr ? 'Connexion' : 'Sign in'}
            </button>
          )}

          {/* Home / Hub Button (No bubble, sleek header action) */}
          {currentApp && (
            <button
              onClick={() => setCurrentAppId(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all cursor-pointer text-xs font-semibold"
              title={isFr ? "Retour au Hub Store" : "Back to Store Hub"}
            >
              <Home className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">{isFr ? 'Hub' : 'Hub'}</span>
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={() => {
              setRefreshKey(k => k + 1);
              if (showToast) showToast(isFr ? 'Actualisation de l’application...' : 'Refreshing app...', 'info');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all cursor-pointer text-xs font-semibold"
            title={isFr ? 'Actualiser' : 'Refresh'}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isFr ? 'Actualiser' : 'Refresh'}</span>
          </button>

          {/* Exit */}
          <button
            onClick={onClose}
            className="flex items-center justify-center p-2 rounded-lg text-white/70 hover:text-rose-400 hover:bg-white/5 transition-all cursor-pointer ml-1"
            title={isFr ? 'Fermer' : 'Close'}
          >
            <LogOut className="w-4 h-4 rotate-180" />
          </button>

        </div>

      </header>

      {/* ========================================================================= */}
      {/* APP VIEWER OR STORE HUB                                                   */}
      {/* ========================================================================= */}
      {currentAppId === 'level-anime' && (
        <div key={`app-anime-${refreshKey}`} className="flex-1 w-full h-full overflow-hidden">
          <LevelAnimeApp lang={lang} user={user} showToast={showToast} />
        </div>
      )}

      {currentAppId === 'level-music' && (
        <div key={`app-music-${refreshKey}`} className="flex-1 w-full h-full overflow-hidden">
          <LevelMusicApp onClose={() => setCurrentAppId(null)} lang={lang} user={user} onRequireAuth={onRequireAuth} />
        </div>
      )}

      {currentAppId === 'level-oppa' && (
        <div key={`app-oppa-${refreshKey}`} className="flex-1 w-full h-full overflow-hidden">
          <LevelOppaApp onClose={() => setCurrentAppId(null)} lang={lang} user={user} />
        </div>
      )}

      {currentAppId === 'level-day' && (
        <div key={`app-day-${refreshKey}`} className="flex-1 w-full h-full overflow-hidden">
          <LevelDayApp onClose={() => setCurrentAppId(null)} lang={lang} user={user} />
        </div>
      )}

      {currentAppId === 'level-reviews' && (
        <div key={`app-reviews-${refreshKey}`} className="flex-1 w-full h-full overflow-hidden">
          <LevelReviewsApp onClose={() => setCurrentAppId(null)} lang={lang} user={user} onRequireAuth={onRequireAuth} />
        </div>
      )}

      {!currentAppId && (
        /* Store Front Hub */
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 lg:p-12 max-w-7xl w-full mx-auto space-y-8 animate-in fade-in">
          
          {/* Executive Header Banner */}
          <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#170a2c] via-[#0e1022] to-[#070810] border border-purple-500/20 overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                LevelUp <span className="text-[#a855f7]">App Store</span>
              </h2>

              <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-2xl">
                {isFr
                  ? 'Portail applicatif unifié de l’écosystème LevelUp. Découvrez nos applications de streaming musical, flux d’actualités vidéo, station météo et centre d’avis communautaires.'
                  : 'Unified application portal for the LevelUp ecosystem. Explore music streaming, video newsfeeds, weather station and community feedback.'}
              </p>
            </div>
          </div>

          {/* Grid of the 4 Apps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {officialApps.map((app) => (
              <div
                key={app.id}
                className="rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] hover:border-purple-500/30 border border-white/10 p-6 flex flex-col justify-between gap-6 transition-all group shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div className="shrink-0 group-hover:scale-110 transition-transform">
                      {getAppIcon(app.iconType)}
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-white leading-snug group-hover:text-purple-300 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-xs font-semibold text-white/50 mt-0.5">
                        {app.tagline}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {app.description}
                    </p>
                  </div>

                  {/* Highlights list */}
                  <div className="pt-2 space-y-1.5 border-t border-white/5">
                    {app.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-white/60">
                        <span className="text-[#a855f7] font-bold">—</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch / Open Button */}
                <button
                  onClick={() => {
                    setCurrentAppId(app.id);
                    if (showToast) {
                      showToast(isFr ? `Ouverture de ${app.name}...` : `Launching ${app.name}...`, 'success');
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-[#a855f7] hover:from-purple-500 hover:to-[#9333ea] border border-purple-400/30 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isFr ? `Lancer ${app.name}` : `Launch ${app.name}`}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <span>{isFr ? 'Applications synchronisées avec l’écosystème LevelUp.' : 'Applications synchronized with the LevelUp ecosystem.'}</span>
            <span>© {new Date().getFullYear()} LevelUp Ecosystem</span>
          </div>

        </div>
      )}

    </div>
  );
};

