import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, RotateCw, Globe, Shield, Sparkles, Music, 
  Bot, Tv, Smartphone, ExternalLink, Check, Lock, Layers,
  Compass, Search, Star, Download, ChevronRight, Home,
  ShieldCheck, Share2, Info, ArrowUpRight, Grid, Bookmark,
  LogOut, Play
} from 'lucide-react';
import { LevelMovieLogo } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface LevelApp {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  iconType: 'bot' | 'music' | 'pwa' | 'ai' | 'tv' | 'tools' | 'store';
  badge: string;
  badgeColor: string;
  rating: string;
  downloads: string;
  embedUrl: string;
  accentColor: string;
  features: string[];
}

interface ExternalAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  showToast?: (msg: string, type?: string) => void;
}

export const ExternalAppsModal: React.FC<ExternalAppsModalProps> = ({
  isOpen,
  onClose,
  lang,
  showToast
}) => {
  const isFr = lang === 'fr';

  // Applications officielles de l'écosystème LevelUp
  const defaultApps: LevelApp[] = [
    {
      id: 'levelup-ai-assistant',
      name: 'LevelUp AI Media Assistant',
      category: isFr ? 'Assistant & Intelligence' : 'AI & Intelligence',
      tagline: isFr ? 'Assistant de découverte cinématographique et d’alertes' : 'Smart cinema discovery & release companion',
      description: isFr 
        ? 'Assistant multimodal intelligent pour analyser vos goûts, explorer les synopsis complets et planifier des notifications pour vos sorties favorites.' 
        : 'Smart assistant designed to curate custom recommendations, explore filmography details and set calendar notifications.',
      iconType: 'bot',
      badge: 'Officiel',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      rating: '4.9',
      downloads: '18.4k',
      embedUrl: 'https://en.wikipedia.org/wiki/Portal:Film',
      accentColor: 'from-emerald-500/20 via-indigo-500/10 to-transparent',
      features: [
        isFr ? 'Recommandations intelligentes' : 'Intelligent recommendations',
        isFr ? 'Fiches d’analyse approfondies' : 'In-depth filmography analysis',
        isFr ? 'Alertes de sorties en direct' : 'Live theatrical alerts'
      ]
    },
    {
      id: 'level-music-ost',
      name: 'LevelMusic Cinema & OST',
      category: isFr ? 'Musique & Hi-Fi OST' : 'Cinema OST & Soundtracks',
      tagline: isFr ? 'Bandes originales cultes, thèmes d’animes et scores' : 'Iconic movie scores & anime soundtracks',
      description: isFr
        ? 'Lecteur audio haute fidélité dédié aux chefs-d’œuvre musicaux du 7ème art, compositeurs légendaires et génériques cultes.'
        : 'High-fidelity audio player streaming legendary cinematic scores, epic themes, and curated anime soundtracks.',
      iconType: 'music',
      badge: 'Hi-Fi Audio',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      rating: '4.8',
      downloads: '32.1k',
      embedUrl: 'https://archive.org/details/audio_music',
      accentColor: 'from-purple-500/20 via-pink-500/10 to-transparent',
      features: [
        isFr ? 'Qualité audio Master sans perte' : 'Lossless Master sound quality',
        isFr ? 'Playlists par compositeur (Zimmer, Williams...)' : 'Composer collections (Zimmer, Williams...)',
        isFr ? 'Mode lecture arrière-plan' : 'Background playback engine'
      ]
    },
    {
      id: 'cinepulse-analytics',
      name: 'CinéPulse Box-Office Live',
      category: isFr ? 'Analyses & Tendances' : 'Box Office & Stats',
      tagline: isFr ? 'Chiffres du box-office mondial et tendances en direct' : 'Worldwide box office metrics & trends',
      description: isFr
        ? 'Tableau de bord financier et statistique en direct des recettes cinématographiques internationales et notes presse.'
        : 'Real-time financial and statistical tracking of global box-office grosses, theatrical admissions, and critic rankings.',
      iconType: 'tv',
      badge: 'Live Metrics',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      rating: '4.7',
      downloads: '12.8k',
      embedUrl: 'https://www.themoviedb.org/movie/now-playing',
      accentColor: 'from-amber-500/20 via-orange-500/10 to-transparent',
      features: [
        isFr ? 'Suivi des entrées mondiales' : 'Global box-office tracking',
        isFr ? 'Comparatifs de rentabilité' : 'Budget vs revenue analytics',
        isFr ? 'Notes de la presse internationale' : 'Global press score aggregations'
      ]
    },
    {
      id: 'ai-recommender-engine',
      name: 'LevelUp Neural Mood Finder',
      category: isFr ? 'Moteur Sémantique' : 'Neural Mood Engine',
      tagline: isFr ? 'Trouvez le film parfait selon votre humeur' : 'Match the exact movie to your mood',
      description: isFr
        ? 'Moteur sémantique neural qui analyse vos envies du moment (frissons, nostalgie, rires) pour générer votre séance idéale.'
        : 'Semantic neural engine that understands emotional nuances to curate tailored movie selections instantly.',
      iconType: 'ai',
      badge: 'Neural AI',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      rating: '4.9',
      downloads: '45.6k',
      embedUrl: 'https://www.themoviedb.org/trending',
      accentColor: 'from-blue-500/20 via-cyan-500/10 to-transparent',
      features: [
        isFr ? 'Recherche par émotion / humeur' : 'Emotion & mood targeting',
        isFr ? 'Filtres de durée et rythme' : 'Pacing & duration filters',
        isFr ? 'Export direct vers LevelMovie' : 'One-click launch in LevelMovie'
      ]
    },
    {
      id: 'levelup-pwa-standalone',
      name: 'LevelMovie PWA Studio Companion',
      category: isFr ? 'Application Mobile PWA' : 'Standalone PWA App',
      tagline: isFr ? 'Installation smartphone, tablette et bureau' : 'Offline-ready Progressive Web App',
      description: isFr
        ? 'Guide et pack d’optimisation pour installer LevelMovie comme application native plein écran avec cache hors-ligne.'
        : 'Companion pack to install LevelMovie directly on Android, iOS or Desktop as a standalone application.',
      iconType: 'pwa',
      badge: 'PWA v3',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      rating: '5.0',
      downloads: '58.9k',
      embedUrl: 'https://web.dev/progressive-web-apps/',
      accentColor: 'from-teal-500/20 via-emerald-500/10 to-transparent',
      features: [
        isFr ? 'Installation 1-clic écran d’accueil' : '1-click home screen install',
        isFr ? 'Accélération matérielle' : 'Hardware video acceleration',
        isFr ? 'Zéro consommation d’espace disque' : 'Ultralight storage footprint'
      ]
    }
  ];

  const [appsList, setAppsList] = useState<LevelApp[]>(defaultApps);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation du Navigateur d'Écosystème
  const [currentApp, setCurrentApp] = useState<LevelApp | null>(null);
  const [browserHistory, setBrowserHistory] = useState<LevelApp[]>([]);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(false);

  // Synchronisation avec Supabase si présent
  useEffect(() => {
    if (!isOpen) {
      setCurrentApp(null);
      setBrowserHistory([]);
      return;
    }

    if (isSupabaseConfigured && supabase) {
      (async () => {
        try {
          const { data, error } = await supabase
            .from('external_apps')
            .select('*')
            .limit(20);

          if (data && data.length > 0 && !error) {
            const remoteApps: LevelApp[] = data.map((d: any) => ({
              id: d.id,
              name: d.name,
              category: d.category || (isFr ? 'Écosystème LevelUp' : 'LevelUp Ecosystem'),
              tagline: d.tagline || (isFr ? 'Application vérifiée' : 'Verified companion app'),
              description: d.description || '',
              iconType: 'store',
              badge: d.badge || 'LevelUp Verified',
              badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
              rating: d.rating || '4.8',
              downloads: d.downloads || '10k',
              embedUrl: d.embed_url || d.url || '',
              accentColor: 'from-purple-500/20 via-indigo-500/10 to-transparent',
              features: d.features || [isFr ? 'Intégration LevelMovie' : 'LevelMovie Integration']
            }));
            setAppsList([...defaultApps, ...remoteApps]);
          }
        } catch (e) {
          // keep defaults
        }
      })();
    }
  }, [isOpen, isFr]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: isFr ? 'Tout l’Écosystème' : 'All Ecosystem' },
    { id: 'ai', label: isFr ? 'Intelligence IA' : 'AI & Brain' },
    { id: 'music', label: isFr ? 'Musique & OST' : 'Music & Audio' },
    { id: 'stats', label: isFr ? 'Box-Office & Data' : 'Stats & Box-Office' },
    { id: 'apps', label: isFr ? 'Apps Mobiles' : 'Mobile Apps' }
  ];

  const filteredApps = appsList.filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'ai') return app.iconType === 'ai' || app.iconType === 'bot';
    if (selectedCategory === 'music') return app.iconType === 'music';
    if (selectedCategory === 'stats') return app.iconType === 'tv';
    if (selectedCategory === 'apps') return app.iconType === 'pwa';
    return true;
  });

  const handleLaunchApp = (app: LevelApp) => {
    setBrowserHistory((prev) => [...prev, app]);
    setCurrentApp(app);
    setIframeLoading(true);
    setIframeKey((prev) => prev + 1);
    if (showToast) {
      showToast(isFr ? `Lancement de ${app.name}...` : `Launching ${app.name}...`, 'info');
    }
  };

  const handleBackToStore = () => {
    setCurrentApp(null);
  };

  const getAppIcon = (type: string) => {
    switch (type) {
      case 'bot':
        return <Bot className="w-5 h-5 text-indigo-400" />;
      case 'music':
        return <Music className="w-5 h-5 text-pink-400" />;
      case 'ai':
        return <Sparkles className="w-5 h-5 text-blue-400" />;
      case 'pwa':
        return <Smartphone className="w-5 h-5 text-teal-400" />;
      case 'tv':
        return <Tv className="w-5 h-5 text-amber-400" />;
      default:
        return <Layers className="w-5 h-5 text-[#a855f7]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[9650] w-screen h-screen bg-[#05060a] text-white flex flex-col overflow-hidden animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* TOP BAR : LEVELUP APP NAVIGATEUR & ECOSYSTEM                              */}
      {/* ========================================================================= */}
      <header className="h-16 px-4 sm:px-6 bg-[#080911] border-b border-white/10 flex items-center justify-between gap-3 shrink-0 z-30">
        
        {/* Left: Titre épuré "LevelUp App" (sans logo levelmovie) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black tracking-wider text-white">
              Level<span className="text-[#a855f7]">Up</span>
              <span className="text-white/60 ml-1 font-semibold text-sm sm:text-base">App</span>
            </span>
          </div>

          {/* Badge statut URL active */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/60">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] text-white/80">
              {currentApp ? `levelup://${currentApp.id}` : 'levelup://apps.home'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Center: Recherche (en mode Store) */}
        {!currentApp && (
          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
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

        {/* Right: 4 Boutons de Navigation épurés et design */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Bouton 1 : Rafraîchir / Recharger */}
          <button
            onClick={() => {
              if (currentApp) {
                setIframeLoading(true);
                setIframeKey((k) => k + 1);
              } else {
                setIframeLoading(true);
                setTimeout(() => setIframeLoading(false), 300);
              }
              if (showToast) {
                showToast(isFr ? 'Actualisation...' : 'Refreshing...', 'info');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-all cursor-pointer border border-white/10 active:scale-95 text-xs font-semibold"
            title={isFr ? 'Rafraîchir la vue' : 'Refresh view'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${iframeLoading ? 'animate-spin text-[#a855f7]' : ''}`} />
            <span className="hidden sm:inline">{isFr ? 'Actualiser' : 'Refresh'}</span>
          </button>

          {/* Bouton 2 : Revenir à l'accueil du Store */}
          <button
            onClick={handleBackToStore}
            disabled={!currentApp}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border active:scale-95 ${
              currentApp 
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/15 cursor-pointer shadow-sm' 
                : 'bg-white/[0.02] text-white/30 border-white/5 cursor-not-allowed'
            }`}
            title={isFr ? "Retour à l'accueil du store" : 'Back to Store Hub'}
          >
            <Home className="w-3.5 h-3.5 text-[#a855f7]" />
            <span className="hidden sm:inline">{isFr ? 'Accueil' : 'Home'}</span>
          </button>

          {/* Bouton 3 : Changer / Explorer les Apps */}
          <button
            onClick={() => {
              if (currentApp) {
                handleBackToStore();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border active:scale-95 ${
              !currentApp
                ? 'bg-purple-600/30 text-purple-200 border-purple-500/40 cursor-default'
                : 'bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border-white/10 cursor-pointer'
            }`}
            title={isFr ? 'Catalogue d’applications' : 'App Catalog'}
          >
            <Grid className="w-3.5 h-3.5 text-[#c084fc]" />
            <span className="hidden sm:inline">{isFr ? 'Catalogue' : 'Catalog'}</span>
          </button>

          {/* Bouton 4 : Sortir / Quitter le Store */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-200 hover:border-rose-500/40 text-white text-xs font-bold transition-all cursor-pointer border border-white/15 shadow-sm active:scale-95 ml-1"
            title={isFr ? 'Quitter LevelUp App' : 'Exit LevelUp App'}
          >
            <LogOut className="w-3.5 h-3.5 rotate-180 text-white/80" />
            <span>{isFr ? 'Sortir' : 'Exit'}</span>
          </button>

        </div>

      </header>

      {/* ========================================================================= */}
      {/* CORPS PRINCIPAL : SOIT LE STORE ÉCOSYSTÈME, SOIT LE NAVIGATEUR IN-APP     */}
      {/* ========================================================================= */}
      {currentApp ? (
        
        /* --------------------------------------------------------- */
        /* MODE A : NAVIGATEUR IN-APP SANDBOX POUR L'APP ACTIVE      */
        /* --------------------------------------------------------- */
        <div className="flex-1 relative w-full h-full bg-[#05060a] overflow-hidden flex flex-col">
          
          {/* Top In-App Breadcrumb Header */}
          <div className="px-4 py-2 bg-[#090a12] border-b border-white/5 flex items-center justify-between text-xs text-white/60 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center">
                {getAppIcon(currentApp.iconType)}
              </div>
              <span className="font-bold text-white text-xs sm:text-sm">{currentApp.name}</span>
              <span className="text-[10px] font-mono text-[#c084fc] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                {currentApp.category}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sandbox Certifiée</span>
            </div>
          </div>

          {/* Iframe Viewer */}
          <div className="flex-1 relative w-full h-full bg-[#020306]">
            {iframeLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#07080e]/95 gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#a855f7] border-t-transparent animate-spin" />
                <span className="text-xs font-mono text-white/70">
                  {isFr ? 'Exécution sécurisée dans l’écosystème LevelUp...' : 'Secure sandbox execution in progress...'}
                </span>
              </div>
            )}

            <iframe
              key={iframeKey}
              src={currentApp.embedUrl}
              onLoad={() => setIframeLoading(false)}
              className="w-full h-full border-none"
              title={currentApp.name}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              allow="autoplay; encrypted-media; fullscreen"
            />
          </div>

        </div>

      ) : (

        /* --------------------------------------------------------- */
        /* MODE B : LE STORE ÉCOSYSTÈME LEVELUP (STYLE APP STORE)   */
        /* --------------------------------------------------------- */
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 lg:p-12 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Hero Storefront Banner */}
          <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#170a2c] via-[#0e1022] to-[#070810] border border-white/10 overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono text-[#c084fc]">
                <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
                <span>{isFr ? 'Écosystème Officiel LevelUp' : 'LevelUp Official Storefront'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {isFr 
                  ? 'Le Hub d’Applications pour votre Expérience Cinéma' 
                  : 'The Dedicated App Hub for Next-Gen Cinema'}
              </h2>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                {isFr
                  ? 'Découvrez et lancez instantanément tous les services connectés LevelUp au sein de votre navigateur, sans quitter LevelMovie.'
                  : 'Run all connected LevelUp companion tools seamlessly inside your app without external redirects or popups.'}
              </p>
            </div>
          </div>

          {/* Search bar on mobile */}
          <div className="lg:hidden">
            <div className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              <Search className="w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFr ? 'Rechercher une application...' : 'Search apps...'}
                className="flex-1 bg-transparent text-xs text-white placeholder-white/40 outline-none"
              />
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/30'
                    : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Apps Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:from-white/[0.08] hover:to-white/[0.03] border border-white/10 hover:border-[#a855f7]/40 p-6 flex flex-col justify-between gap-6 transition-all group shadow-lg hover:shadow-purple-900/20"
              >
                {/* App Card Header */}
                <div className="space-y-4">
                  
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      {getAppIcon(app.iconType)}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${app.badgeColor}`}>
                        {app.badge}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{app.rating}</span>
                        <span className="text-white/30 text-[10px]">({app.downloads})</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#c084fc] transition-colors leading-snug">
                      {app.name}
                    </h3>
                    <p className="text-xs font-semibold text-white/50 mt-0.5">
                      {app.tagline}
                    </p>
                    <p className="text-xs text-white/60 mt-3 leading-relaxed">
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

                {/* Launch Button */}
                <button
                  onClick={() => handleLaunchApp(app)}
                  className="w-full py-3 rounded-2xl bg-white/10 hover:bg-[#a855f7] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 group-hover:bg-[#a855f7]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isFr ? 'Ouvrir dans le Navigateur' : 'Launch In Ecosystem'}</span>
                </button>

              </div>
            ))}
          </div>

          {/* Store Footer */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isFr ? 'Toutes les applications sont vérifiées et isolées dans la Sandbox LevelUp.' : 'All applications are sandboxed and verified by LevelUp.'}</span>
            </div>
            <span>© {new Date().getFullYear()} LevelUp Ecosystem Store</span>
          </div>

        </div>

      )}

    </div>
  );
};
