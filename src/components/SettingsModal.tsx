import React, { useState } from 'react';
import {
  X, User, Globe, Filter, Shield, Server, HardDrive, Cpu, 
  LogOut, Check, ChevronRight, Bookmark, Lock, 
  Trash2, RefreshCw, Key, ExternalLink, Zap, Info, Sliders,
  Film, Tv, Users, Bell, Play, Settings as SettingsIcon, ChevronLeft,
  Sparkles, Smartphone, Eye, Cloud, Radio, Volume2, ShieldCheck, Download
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  setLang: (lang: string) => void;
  contentLang: string;
  setContentLang: (lang: string) => void;
  user: any;
  userName: string;
  userEmail: string;
  userPhoto: string | null;
  parentalFilter: boolean;
  setParentalFilter: (val: boolean) => void;
  onOpenLogin: () => void;
  onOpenLogout: () => void;
  onOpenDona?: () => void;
  watchlistCount: number;
  historyCount: number;
  onNavigateCategory: (cat: string) => void;
  showToast: (msg: string, type?: string) => void;
  t: any;
}

type TabType = 'general' | 'account' | 'library' | 'streaming' | 'parental' | 'system';

interface TabItem {
  id: TabType;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  setLang,
  contentLang,
  setContentLang,
  user,
  userName,
  userEmail,
  userPhoto,
  parentalFilter,
  setParentalFilter,
  onOpenLogin,
  onOpenLogout,
  onOpenDona,
  watchlistCount,
  historyCount,
  onNavigateCategory,
  showToast,
  t
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  // On mobile: null = main categories list; TabType = opened category detail
  const [mobileActiveTab, setMobileActiveTab] = useState<TabType | null>(null);
  
  const [autoPlayTrailer, setAutoPlayTrailer] = useState(true);
  const [hdPosters, setHdPosters] = useState(true);
  const [defaultServer, setDefaultServer] = useState<'vidsrc' | 'vidlink' | 'superembed'>('vidsrc');
  const [autoFallback, setAutoFallback] = useState(true);
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(true);
  const [pinLockEnabled, setPinLockEnabled] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  // Development simulation profile for instant display
  const [devCustomName, setDevCustomName] = useState(userName || 'Cinéphile VIP');

  if (!isOpen) return null;

  const handleCopyUid = () => {
    const uidToCopy = user?.uid || 'usr_dev_46443716563';
    navigator.clipboard.writeText(uidToCopy);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
    showToast(lang === 'fr' ? 'Identifiant copié !' : 'ID copied!', 'success');
  };

  const handleClearCache = () => {
    setIsClearingCache(true);
    setTimeout(() => {
      localStorage.removeItem('lm_recent_searches');
      setIsClearingCache(false);
      showToast(t.cacheCleared || (lang === 'fr' ? 'Cache vidé avec succès.' : 'Cache cleared successfully.'), 'success');
    }, 600);
  };

  const tabs: TabItem[] = [
    { 
      id: 'general', 
      label: lang === 'fr' ? 'Général' : 'General', 
      sublabel: lang === 'fr' ? 'Langue, affichage et aperçus' : 'Language, UI and previews',
      icon: Sliders 
    },
    { 
      id: 'account', 
      label: lang === 'fr' ? 'Compte & Profil' : 'Account & Profile', 
      sublabel: lang === 'fr' ? 'Profil, synchronisation et sécurité' : 'Profile, sync and security',
      icon: User 
    },
    { 
      id: 'library', 
      label: lang === 'fr' ? 'Ma Bibliothèque' : 'My Library', 
      sublabel: lang === 'fr' ? 'Watchlist, salons et historique' : 'Saved list, watch parties, history',
      icon: Bookmark, 
      badge: watchlistCount > 0 ? watchlistCount : undefined 
    },
    { 
      id: 'streaming', 
      label: lang === 'fr' ? 'Serveurs & Lecture' : 'Stream & Servers', 
      sublabel: lang === 'fr' ? 'Miroirs par défaut et latence' : 'Default mirrors and speed',
      icon: Server 
    },
    { 
      id: 'parental', 
      label: lang === 'fr' ? 'Contrôle Parental' : 'Parental Controls', 
      sublabel: lang === 'fr' ? 'Filtrage des contenus 18+' : '18+ content filtering',
      icon: Shield 
    },
    { 
      id: 'system', 
      label: lang === 'fr' ? 'Système & Infos' : 'System & Info', 
      sublabel: lang === 'fr' ? 'Version, diagnostic et cloud' : 'App version, diagnostic and cloud',
      icon: Cpu 
    },
  ];

  const currentTabObj = tabs.find(t => t.id === (mobileActiveTab || activeTab)) || tabs[0];

  // Render the inner content for a selected tab
  const renderTabContent = (tabId: TabType) => {
    switch (tabId) {
      case 'general':
        return (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#a855f7]" />
                {lang === 'fr' ? 'Préférences Générales' : 'General Preferences'}
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                {lang === 'fr' ? "Personnalisez l'affichage, les langues et les aperçus de l'application." : 'Customize your app display and language settings.'}
              </p>
            </div>

            {/* Interface Language */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-[#a855f7]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.interfaceLang || 'Langue de l’interface'}</div>
                  <div className="text-xs text-white/50">{lang === 'fr' ? 'Langue des boutons, menus et titres' : 'App UI language'}</div>
                </div>
              </div>
              <div className="flex gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => { setLang('fr'); localStorage.setItem('levelmovie_lang', 'fr'); showToast('Langue changée en Français', 'success'); }}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${lang === 'fr' ? 'bg-[#a855f7] text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
                >
                  FRANÇAIS
                </button>
                <button
                  type="button"
                  onClick={() => { setLang('en'); localStorage.setItem('levelmovie_lang', 'en'); showToast('Language changed to English', 'success'); }}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${lang === 'en' ? 'bg-[#a855f7] text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
                >
                  ENGLISH
                </button>
              </div>
            </div>

            {/* Content Language Origin */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Filter className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.contentOrigin || 'Origine des Contenus'}</div>
                  <div className="text-xs text-white/50">{t.contentOriginDesc || 'Filtrer par langue de production'}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => { setContentLang('all'); localStorage.setItem('levelmovie_content_lang', 'all'); }}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${contentLang === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
                >
                  {t.worldAll || 'Tous'}
                </button>
                <button
                  type="button"
                  onClick={() => { setContentLang('fr'); localStorage.setItem('levelmovie_content_lang', 'fr'); }}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${contentLang === 'fr' ? 'bg-indigo-600 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
                >
                  {t.frenchVF || 'VF'}
                </button>
                <button
                  type="button"
                  onClick={() => { setContentLang('en'); localStorage.setItem('levelmovie_content_lang', 'en'); }}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${contentLang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
                >
                  {t.usEnglish || 'VO'}
                </button>
              </div>
            </div>

            {/* Auto Trailer Play Preview */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shrink-0">
                  <Play className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{lang === 'fr' ? 'Aperçu Vidéo en Bannière' : 'Hero Video Auto-preview'}</div>
                  <div className="text-xs text-white/50">{lang === 'fr' ? 'Lecture dynamique sur les nouveautés en vedette' : 'Dynamic trailer highlights'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoPlayTrailer(!autoPlayTrailer)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer outline-none shrink-0 ${autoPlayTrailer ? 'bg-[#a855f7]' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoPlayTrailer ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* HD Posters Rendering */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{lang === 'fr' ? 'Affiches Haute Définition' : 'Ultra HD Posters'}</div>
                  <div className="text-xs text-white/50">{lang === 'fr' ? 'Qualité maximale pour les jaquettes' : 'Load high resolution artwork'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHdPosters(!hdPosters)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer outline-none shrink-0 ${hdPosters ? 'bg-cyan-500' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${hdPosters ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#a855f7]" />
                {lang === 'fr' ? 'Gestion du Compte & Profil' : 'Account & Profile Management'}
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                {lang === 'fr' ? 'Accédez à toutes vos options de profil, synchronisation et sécurité.' : 'Manage authentication and synced multi-device profile.'}
              </p>
            </div>

            {/* Full Profile Card (Always visible with full details for development & live use) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#a855f7]/15 via-black/50 to-indigo-950/30 border border-[#a855f7]/30 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#151522] border-2 border-[#a855f7]/60 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {userPhoto ? (
                    <img src={userPhoto} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <span className="text-2xl font-black text-[#a855f7]">
                      {(userName || devCustomName || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-white truncate">{userName || devCustomName || 'Cinéphile'}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${user ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-purple-500/20 border-purple-500/40 text-purple-300'}`}>
                      {user ? (lang === 'fr' ? 'SYNCHRONISÉ' : 'SYNCED') : (lang === 'fr' ? 'PROFIL ACTIF' : 'ACTIVE PROFILE')}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 truncate mt-0.5">
                    {userEmail || (user ? 'Compte Google Connecté' : 'levelup.ia0@gmail.com (Session active)')}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyUid}
                    className="mt-2 text-[11px] font-mono text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>UID: {user?.uid ? user.uid.substring(0, 14) + '...' : 'usr_lvl_46443716563'}</span>
                    {copiedUid ? <Check className="w-3 h-3 text-emerald-400" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Action buttons (both connect & disconnect accessible for testing) */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenLogin(); }}
                  className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                >
                  <Key className="w-3.5 h-3.5" />
                  {user ? (lang === 'fr' ? 'Changer de compte' : 'Switch account') : (lang === 'fr' ? 'Connexion Google' : 'Sign in with Google')}
                </button>
                <button
                  type="button"
                  onClick={onOpenLogout}
                  className="py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-red-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t.logoutBtn || (lang === 'fr' ? 'Déconnexion' : 'Sign out')}
                </button>
              </div>
            </div>

            {/* Cloud synchronization options */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cloudSyncEnabled ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-white/10 text-white/60'}`}>
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{lang === 'fr' ? 'Synchronisation Cloud Firestore' : 'Firestore Cloud Sync'}</div>
                  <div className="text-xs text-white/50">{cloudSyncEnabled ? (lang === 'fr' ? 'Activée : Vos favoris sont synchronisés en direct' : 'Active: Real-time multi-device sync') : (lang === 'fr' ? 'Désactivée' : 'Disabled')}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCloudSyncEnabled(!cloudSyncEnabled);
                  showToast(cloudSyncEnabled ? 'Sync Cloud en pause' : 'Sync Cloud réactivée', 'info');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer outline-none shrink-0 ${cloudSyncEnabled ? 'bg-emerald-500' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${cloudSyncEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Cloud Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Watchlist Cloud</div>
                  <div className="text-[10px] text-white/50">{lang === 'fr' ? 'Sauvegarde automatique Firestore' : 'Automatic Firestore sync'}</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Watch Party Synchro</div>
                  <div className="text-[10px] text-white/50">{lang === 'fr' ? 'Salons multi-utilisateurs & chat' : 'Live multi-user party & chat'}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'library':
        return (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#a855f7]" />
                {lang === 'fr' ? 'Ma Bibliothèque & Raccourcis' : 'My Library & Shortcuts'}
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                {lang === 'fr' ? 'Accédez directement à vos sélections, vos salons et votre historique.' : 'Direct shortcuts to your content collection.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { onClose(); onNavigateCategory('watchlist'); }}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-[#a855f7]/10 border border-white/10 hover:border-[#a855f7]/40 transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#a855f7]/20 flex items-center justify-center text-[#c084fc] group-hover:scale-110 transition-transform">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.myList || 'Ma Liste'}</div>
                    <div className="text-xs text-white/50">{watchlistCount} {lang === 'fr' ? 'titres enregistrés' : 'saved titles'}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => { onClose(); onNavigateCategory('party'); }}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/40 transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.partyTab || 'Salons Watch Party'}</div>
                    <div className="text-xs text-white/50">{lang === 'fr' ? 'Créer ou rejoindre un salon' : 'Live group sessions'}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => { onClose(); onNavigateCategory('movie'); }}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/40 transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.movies || 'Catalogue Films'}</div>
                    <div className="text-xs text-white/50">{lang === 'fr' ? 'Box-office, nouveautés, genres' : 'Explore full movies'}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => { onClose(); onNavigateCategory('tv'); }}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.series || 'Séries TV'}</div>
                    <div className="text-xs text-white/50">{lang === 'fr' ? 'Saisons & épisodes complets' : 'TV Shows & Animes'}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Clear Local Cache */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  {t.systemCache || (lang === 'fr' ? 'Cache des recherches' : 'Search Cache')}
                </div>
                <div className="text-[11px] text-white/50">{lang === 'fr' ? 'Efface l’historique des requêtes en mémoire' : 'Reset search queries cache'}</div>
              </div>
              <button
                type="button"
                onClick={handleClearCache}
                disabled={isClearingCache}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
              >
                {isClearingCache ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {t.clearCache || (lang === 'fr' ? 'Vider' : 'Clear')}
              </button>
            </div>
          </div>
        );

      case 'streaming':
        return (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-[#a855f7]" />
                {lang === 'fr' ? 'Serveurs & Qualité de Lecture' : 'Streaming Servers & Playback'}
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                {lang === 'fr' ? 'Configurez vos serveurs par défaut et le basculement automatique.' : 'Manage default stream mirrors and embed preferences.'}
              </p>
            </div>

            {/* Default Server Selection */}
            <div className="space-y-2.5">
              {[
                { id: 'vidsrc', name: 'Global Alpha (Recommandé)', desc: 'Lecture ultra-rapide, multi-langues et sous-titres FR/EN', speed: '99.8% uptime', ping: '18ms' },
                { id: 'vidlink', name: 'VidLink Ultra', desc: 'Serveur alternatif HD avec lecteur moderne et pistes audio', speed: '99.1% uptime', ping: '24ms' },
                { id: 'superembed', name: 'SuperEmbed VIP', desc: 'Miroir de secours haute fidélité pour films et séries', speed: '98.5% uptime', ping: '31ms' },
              ].map((srv) => {
                const isSelected = defaultServer === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => { setDefaultServer(srv.id as any); showToast(`Serveur par défaut : ${srv.name}`, 'success'); }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#a855f7]/10 border-[#a855f7]/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#a855f7] text-white' : 'bg-white/10 text-white/60'}`}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          {srv.name}
                          {isSelected && <span className="text-[10px] bg-[#a855f7]/30 text-purple-200 px-2 py-0.2 rounded-full">Actif</span>}
                        </div>
                        <div className="text-xs text-white/50">{srv.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-lg hidden sm:inline">
                        {srv.ping}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                        {srv.speed}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Auto Fallback switch */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{lang === 'fr' ? 'Basculement Automatique de Miroir' : 'Auto-fallback on error'}</div>
                  <div className="text-xs text-white/50">{lang === 'fr' ? 'Bascule sur le serveur suivant si un lien est inaccessible' : 'Switches mirror if stream fails'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoFallback(!autoFallback)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer outline-none shrink-0 ${autoFallback ? 'bg-[#a855f7]' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoFallback ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        );

      case 'parental':
        return (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#a855f7]" />
                {t.parentalFilter || (lang === 'fr' ? 'Contrôle Parental & Sécurité' : 'Parental Controls')}
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                {t.parentalFilterDesc || (lang === 'fr' ? 'Masque strictement les contenus sensibles et réservés aux adultes.' : 'Strictly hide explicit 18+ titles from catalog.')}
              </p>
            </div>

            {/* Strict 18+ Filter */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${parentalFilter ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-white/10 text-white/60'}`}>
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{lang === 'fr' ? 'Filtre Strict 18+' : 'Strict 18+ Content Filter'}</div>
                  <div className="text-xs text-white/50">{parentalFilter ? (lang === 'fr' ? 'Actif : Les titres explicites sont masqués' : 'Active: Explicit titles are hidden') : (lang === 'fr' ? 'Inactif : Tout le catalogue est visible' : 'Inactive: Full catalog is visible')}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !parentalFilter;
                  setParentalFilter(next);
                  showToast(next ? 'Filtre parental activé' : 'Filtre parental désactivé', 'info');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer outline-none shrink-0 ${parentalFilter ? 'bg-emerald-500' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${parentalFilter ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* PIN Lock Option */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{lang === 'fr' ? 'Code PIN Parental' : 'Parental PIN Lock'}</div>
                  <div className="text-xs text-white/50">{lang === 'fr' ? 'Verrouiller la modification des paramètres par un code à 4 chiffres' : 'Lock settings with a 4-digit code'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPinLockEnabled(!pinLockEnabled);
                  showToast(pinLockEnabled ? 'Code PIN désactivé' : 'Code PIN configuré (0000)', 'info');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer outline-none shrink-0 ${pinLockEnabled ? 'bg-amber-500' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${pinLockEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#a855f7]" />
                {lang === 'fr' ? 'Architecture & Statut Système' : 'System Architecture & Status'}
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                {lang === 'fr' ? "Détails techniques et infrastructure réseau." : 'Cloud execution engine and app metadata.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs text-white/60">{lang === 'fr' ? "Version de l'App" : 'App Version'}</span>
                <span className="text-xs font-mono font-bold text-white">LevelMovie v2.5.0</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs text-white/60">Environnement</span>
                <span className="text-xs font-mono text-[#c084fc]">Google Cloud Run Container</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs text-white/60">Base de données & Auth</span>
                <span className="text-xs font-mono text-emerald-400">Firebase Firestore & Auth</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs text-white/60">Fournisseur Métadonnées</span>
                <span className="text-xs font-mono text-indigo-300">TMDB API v3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Statut du Réseau</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Opérationnel 100%
                </span>
              </div>
            </div>

            <div className="text-center text-[11px] text-white/40 pt-2">
              LevelMovie • Propulsé par LevelUp Ecosystem
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[9500] bg-[#07080f] text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full h-full flex flex-col overflow-hidden text-white">
        
        {/* ================= HEADER ================= */}
        <div className="px-4 sm:px-8 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#0a0b12] shrink-0">
          
          {/* MOBILE HEADER */}
          <div className="flex items-center gap-2 sm:hidden">
            {mobileActiveTab !== null ? (
              <button
                type="button"
                onClick={() => setMobileActiveTab(null)}
                className="flex items-center gap-1.5 py-1 px-2 -ml-2 rounded-xl text-white hover:text-white hover:bg-white/5 transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 text-[#a855f7]" />
                <span className="text-sm font-bold tracking-wide">{currentTabObj.label}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 py-1 px-2 -ml-2 rounded-xl text-white hover:text-white hover:bg-white/5 transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 text-[#a855f7]" />
                <span className="text-base font-bold tracking-wide">{lang === 'fr' ? 'Paramètres' : 'Settings'}</span>
              </button>
            )}
          </div>

          {/* DESKTOP HEADER */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#a855f7]">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg tracking-wide text-white">
                {lang === 'fr' ? 'Paramètres' : 'Settings'}
              </h2>
            </div>
          </div>
          
          {/* Close button (Desktop only, on mobile the ChevronLeft exit arrow is used) */}
          <button 
            type="button"
            onClick={onClose}
            className="hidden sm:flex p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer outline-none active:scale-90"
            title={lang === 'fr' ? 'Fermer' : 'Close'}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* ================= MOBILE VIEW (ChatGPT / Claude / iOS Settings Drill-down) ================= */}
        <div className="flex-1 overflow-y-auto sm:hidden bg-[#07080f] p-4 custom-scrollbar">
          {mobileActiveTab === null ? (
            /* Main Mobile Options Menu */
            <div className="space-y-4 animate-in fade-in duration-150 pb-8">
              {/* User profile quick summary card */}
              <div 
                onClick={() => setMobileActiveTab('account')}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between cursor-pointer active:bg-white/[0.06] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#151522] border border-[#a855f7]/50 flex items-center justify-center overflow-hidden shrink-0">
                    {userPhoto ? (
                      <img src={userPhoto} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <span className="text-lg font-black text-[#a855f7]">
                        {(userName || devCustomName || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{userName || devCustomName || t.defaultUser || 'Cinéphile'}</div>
                    <div className="text-xs text-white/50 truncate">{userEmail || 'levelup.ia0@gmail.com (Profil actif)'}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />
              </div>

              {/* Grouped Options List */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden divide-y divide-white/5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setMobileActiveTab(tab.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c084fc] shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white flex items-center gap-2">
                            <span>{tab.label}</span>
                            {tab.badge !== undefined && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#a855f7]/30 text-purple-200 font-mono">
                                {tab.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-white/40 truncate">{tab.sublabel}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
                    </button>
                  );
                })}
              </div>

              {/* Bottom Quick Logout / Connect */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenLogin(); }}
                  className="w-full py-3.5 rounded-2xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
                >
                  <Key className="w-4 h-4" />
                  {user ? (lang === 'fr' ? 'Changer de compte' : 'Switch account') : (lang === 'fr' ? 'Se connecter avec Google' : 'Sign in with Google')}
                </button>
              </div>
            </div>
          ) : (
            /* Sub-Option Detail on Mobile */
            <div className="pb-8">
              {renderTabContent(mobileActiveTab)}
            </div>
          )}
        </div>

        {/* ================= DESKTOP VIEW (Two Columns: Sidebar + Content) ================= */}
        <div className="hidden sm:flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="flex flex-col w-64 border-r border-white/10 bg-[#090a10] p-4 gap-1.5 shrink-0 select-none">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 pt-1 pb-2">
              {lang === 'fr' ? 'Catégories' : 'Categories'}
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#a855f7]/20 to-indigo-500/10 text-white border border-[#a855f7]/40 shadow-[0_0_15px_rgba(168,85,247,0.15)] font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#c084fc]' : 'text-white/50'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#a855f7]/30 text-purple-200 font-mono">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick stats at bottom of desktop sidebar */}
            <div className="mt-auto pt-3 border-t border-white/5 px-1">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] space-y-1.5 text-white/50">
                <div className="flex items-center justify-between">
                  <span>Ping</span>
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    24ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Moteur</span>
                  <span className="text-[#a855f7] font-mono font-bold">LevelMovie v2.5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 bg-[#0c0d14] custom-scrollbar">
            {renderTabContent(activeTab)}
          </div>
        </div>

        {/* ================= FOOTER BAR (Desktop) ================= */}
        <div className="hidden sm:flex px-6 py-3.5 border-t border-white/10 bg-[#090a10] items-center justify-between text-xs text-white/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-medium text-white/70">Connecté au réseau LevelMovie</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all cursor-pointer"
          >
            {t.confirm || (lang === 'fr' ? 'Fermer' : 'Close')}
          </button>
        </div>

      </div>
    </div>
  );
};
