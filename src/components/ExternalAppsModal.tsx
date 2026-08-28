import React, { useState } from 'react';
import { 
  RotateCw, Sparkles, Music, Flame, Sun, 
  MessageSquare, Star, Home, LogOut, Play,
  ShieldCheck, Search, ChevronRight, Layers, ArrowLeft
} from 'lucide-react';
import { LevelMusicApp } from './apps/LevelMusicApp';
import { LevelOppaApp } from './apps/LevelOppaApp';
import { LevelDayApp } from './apps/LevelDayApp';
import { LevelReviewsApp } from './apps/LevelReviewsApp';

interface LevelApp {
  id: 'level-music' | 'level-oppa' | 'level-day' | 'level-reviews';
  name: string;
  category: string;
  tagline: string;
  description: string;
  iconType: 'music' | 'oppa' | 'weather' | 'reviews';
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
  showToast?: (msg: string, type?: string) => void;
}

export const ExternalAppsModal: React.FC<ExternalAppsModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  showToast
}) => {
  const isFr = lang === 'fr';

  // The 4 Official LevelUp Ecosystem Apps requested by user
  const officialApps: LevelApp[] = [
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
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isOpen) return null;

  const currentApp = officialApps.find(a => a.id === currentAppId) || null;

  const filteredApps = officialApps.filter((app) => {
    const q = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(q) ||
      app.tagline.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q)
    );
  });

  const getAppIcon = (type: LevelApp['iconType']) => {
    switch (type) {
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
        
        {/* Left: App switcher / Title */}
        <div className="flex items-center gap-3">
          {currentApp && (
            <button
              onClick={() => setCurrentAppId(null)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors mr-1 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{isFr ? 'Écosystème' : 'All Apps'}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black tracking-wider text-white">
              Level<span className="text-[#a855f7]">Up</span>
              <span className="text-white/60 ml-1 font-semibold text-sm sm:text-base">
                {currentApp ? `• ${currentApp.name}` : 'App Store'}
              </span>
            </span>
            {!currentApp && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                {isFr ? 'Bientôt disponible' : 'Coming Soon'}
              </span>
            )}
          </div>
        </div>

        {/* Center: Search (only in Store Hub) */}
        {!currentApp && (
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div className="w-full flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 focus-within:border-[#a855f7] transition-colors">
              <Search className="w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFr ? 'Rechercher une application...' : 'Search applications...'}
                className="flex-1 bg-transparent text-xs text-white placeholder-white/40 outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white text-xs">
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
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

          {/* Return to Home / Store */}
          <button
            onClick={() => setCurrentAppId(null)}
            disabled={!currentApp}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentApp 
                ? 'text-white hover:text-[#c084fc] hover:bg-white/5 cursor-pointer' 
                : 'text-white/30 cursor-not-allowed opacity-40'
            }`}
            title={isFr ? "Retour au Hub" : 'Back to Store Hub'}
          >
            <Home className="w-3.5 h-3.5 text-[#a855f7]" />
            <span className="hidden sm:inline">{isFr ? 'Hub' : 'Hub'}</span>
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
      {currentAppId === 'level-music' && (
        <div key={`app-music-${refreshKey}`} className="flex-1 w-full h-full overflow-hidden">
          <LevelMusicApp onClose={() => setCurrentAppId(null)} lang={lang} user={user} />
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
          <LevelReviewsApp onClose={() => setCurrentAppId(null)} lang={lang} user={user} />
        </div>
      )}

      {!currentAppId && (
        /* Store Front Hub */
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 lg:p-12 max-w-7xl w-full mx-auto space-y-8 animate-in fade-in">
          
          {/* Banner */}
          <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#170a2c] via-[#0e1022] to-[#070810] border border-white/10 overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-xs font-mono text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isFr ? 'Bientôt disponible • Coming Soon' : 'Coming Soon'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {isFr 
                  ? 'LevelUp App Store' 
                  : 'LevelUp App Store'}
              </h2>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                {isFr
                  ? 'Le magasin d’applications officiel de l’écosystème LevelUp est actuellement en cours de préparation technique. Toutes les applications seront accessibles très prochainement.'
                  : 'The official LevelUp ecosystem App Store is currently in development. All integrated apps will be unlocked soon.'}
              </p>
            </div>
          </div>

          {/* Grid of the 4 Apps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 p-6 flex flex-col justify-between gap-6 transition-all group shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10">
                      {getAppIcon(app.iconType)}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-amber-500/15 text-amber-300 border-amber-500/30">
                        {isFr ? 'Bientôt disponible' : 'Coming Soon'}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{app.rating}</span>
                        <span className="text-white/30 text-[10px]">({app.downloads})</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                      {app.name}
                    </h3>
                    <p className="text-xs font-semibold text-white/50 mt-0.5">
                      {app.tagline}
                    </p>
                    <p className="text-xs text-white/60 mt-2.5 leading-relaxed">
                      {app.description}
                    </p>
                  </div>

                  {/* Highlights list */}
                  <div className="pt-2 space-y-1.5">
                    {app.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-white/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch / Coming Soon Button */}
                <button
                  onClick={() => {
                    if (showToast) {
                      showToast(isFr ? `LevelUp App Store est en cours de préparation (Bientôt disponible)` : `LevelUp App Store is coming soon`, 'info');
                    }
                  }}
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-md"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>{isFr ? 'Bientôt disponible' : 'Coming Soon'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Footer badge */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isFr ? 'Toutes les applications sont 100% synchronisées avec Supabase.' : 'All applications are fully connected to Supabase.'}</span>
            </div>
            <span>© {new Date().getFullYear()} LevelUp Ecosystem Hub</span>
          </div>

        </div>
      )}

    </div>
  );
};
