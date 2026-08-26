import React, { useState } from 'react';
import {
  X, User, Globe, Filter, Shield, Server, HardDrive, Cpu, 
  LogOut, Check, Sparkles, ChevronRight, Bookmark, Lock, 
  Trash2, RefreshCw, Key, ExternalLink, Zap, Info, Sliders,
  Film, Tv, Users, Bell, Play
} from 'lucide-react';
import { LevelMovieLogo } from '../constants';

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
  watchlistCount: number;
  historyCount: number;
  onNavigateCategory: (cat: string) => void;
  showToast: (msg: string, type?: string) => void;
  t: any;
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
  watchlistCount,
  historyCount,
  onNavigateCategory,
  showToast,
  t
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'account' | 'library' | 'streaming' | 'parental' | 'system'>('general');
  const [autoPlayTrailer, setAutoPlayTrailer] = useState(true);
  const [defaultServer, setDefaultServer] = useState<'vidsrc' | 'smashy' | 'superembed'>('vidsrc');
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  if (!isOpen) return null;

  const handleCopyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
      showToast(lang === 'fr' ? 'Identifiant copié !' : 'ID copied!', 'success');
    }
  };

  const handleClearCache = () => {
    setIsClearingCache(true);
    setTimeout(() => {
      localStorage.removeItem('lm_recent_searches');
      setIsClearingCache(false);
      showToast(t.cacheCleared || 'Cache vidé avec succès.', 'success');
    }, 600);
  };

  interface TabItem {
    id: 'general' | 'account' | 'library' | 'streaming' | 'parental' | 'system';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const tabs: TabItem[] = [
    { id: 'general', label: lang === 'fr' ? 'Général' : 'General', icon: Sliders },
    { id: 'account', label: lang === 'fr' ? 'Compte' : 'Account', icon: User },
    { id: 'library', label: lang === 'fr' ? 'Bibliothèque' : 'Library', icon: Bookmark, badge: watchlistCount > 0 ? watchlistCount : undefined },
    { id: 'streaming', label: lang === 'fr' ? 'Serveurs & Flux' : 'Stream & Servers', icon: Server },
    { id: 'parental', label: lang === 'fr' ? 'Sécurité' : 'Safety', icon: Shield },
    { id: 'system', label: lang === 'fr' ? 'Système & IA' : 'System & AI', icon: Cpu },
  ];

  return (
    <div className="fixed inset-0 z-[9500] bg-[#07080f] text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Outer Studio Fullscreen Container */}
      <div className="relative w-full h-full flex flex-col overflow-hidden text-white">
        
        {/* Header Bar - Studio Style */}
        <div className="px-5 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between bg-[#0c0d16]/90 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#a855f7] to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-wide text-white">
                  {lang === 'fr' ? 'Paramètres Studio' : 'Studio Settings'}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/40 text-[#c084fc] font-mono font-bold tracking-wider">
                  STUDIO ENGINE v2.5
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer outline-none active:scale-90"
            title={lang === 'fr' ? 'Fermer' : 'Close'}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Mobile Horizontal Tabs */}
        <div className="flex sm:hidden overflow-x-auto no-scrollbar border-b border-white/10 px-3 py-2 bg-[#0a0b10] gap-1 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/30 text-white' : 'bg-purple-500/20 text-purple-300'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body: Sidebar (Desktop) + Main Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Left Sidebar */}
          <div className="hidden sm:flex flex-col w-56 border-r border-white/10 bg-[#090a10]/90 p-3.5 gap-1.5 shrink-0 select-none">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 pt-1 pb-2">
              {lang === 'fr' ? 'Configuration' : 'Configuration'}
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#a855f7]/20 to-indigo-500/10 text-white border border-[#a855f7]/40 shadow-[0_0_15px_rgba(168,85,247,0.15)] font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
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

            {/* Quick stats at bottom of sidebar */}
            <div className="mt-auto pt-3 border-t border-white/5 px-2">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] space-y-1 text-white/50">
                <div className="flex items-center justify-between">
                  <span>Ping</span>
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    24ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mode</span>
                  <span className="text-[#a855f7] font-mono font-bold">Ultra HD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#0c0d14]/90 custom-scrollbar">
            
            {/* TAB: GENERAL */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#a855f7]" />
                    {lang === 'fr' ? 'Préférences Générales' : 'General Preferences'}
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    {lang === 'fr' ? "Personnalise ton expérience de navigation et d'affichage." : 'Customize your UI and language experience.'}
                  </p>
                </div>

                {/* Interface Language */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-[#a855f7]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.interfaceLang}</div>
                      <div className="text-xs text-white/50">{lang === 'fr' ? 'Langue des boutons, menus et titres' : 'App UI language'}</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => { setLang('fr'); localStorage.setItem('levelmovie_lang', 'fr'); showToast('Langue changée en Français', 'success'); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${lang === 'fr' ? 'bg-[#a855f7] text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
                    >
                      FRANÇAIS
                    </button>
                    <button
                      onClick={() => { setLang('en'); localStorage.setItem('levelmovie_lang', 'en'); showToast('Language changed to English', 'success'); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${lang === 'en' ? 'bg-[#a855f7] text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
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
                      <div className="text-sm font-semibold text-white">{t.contentOrigin}</div>
                      <div className="text-xs text-white/50">{t.contentOriginDesc}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => { setContentLang('all'); localStorage.setItem('levelmovie_content_lang', 'all'); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${contentLang === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
                    >
                      {t.worldAll || 'Tous'}
                    </button>
                    <button
                      onClick={() => { setContentLang('fr'); localStorage.setItem('levelmovie_content_lang', 'fr'); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${contentLang === 'fr' ? 'bg-indigo-600 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
                    >
                      {t.frenchVF || 'VF'}
                    </button>
                    <button
                      onClick={() => { setContentLang('en'); localStorage.setItem('levelmovie_content_lang', 'en'); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${contentLang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
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
                      <div className="text-xs text-white/50">{lang === 'fr' ? 'Animations dynamiques sur les nouveautés' : 'Dynamic trailer highlights'}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setAutoPlayTrailer(!autoPlayTrailer)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer outline-none ${autoPlayTrailer ? 'bg-[#a855f7]' : 'bg-white/20'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoPlayTrailer ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB: ACCOUNT */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-[#a855f7]" />
                    {lang === 'fr' ? 'Gestion du Compte' : 'Account Management'}
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    {lang === 'fr' ? 'Synchronise tes listes, favoris et salons entre tous tes appareils.' : 'Manage authentication and synced multi-device profile.'}
                  </p>
                </div>

                {/* User Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#a855f7]/15 via-black/40 to-indigo-900/20 border border-[#a855f7]/30 shadow-lg relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#151522] border-2 border-[#a855f7]/60 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                      {userPhoto ? (
                        <img src={userPhoto} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <span className="text-2xl font-black text-[#a855f7]">
                          {(userName || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white truncate">{userName || t.defaultUser}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                          {user ? 'SYNCRONISÉ' : 'INVITÉ'}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 truncate">{userEmail || (user ? 'Compte Google / OAuth' : 'Session anonyme')}</p>
                      {user?.uid && (
                        <button
                          onClick={handleCopyUid}
                          className="mt-2 text-[11px] font-mono text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>UID: {user.uid.substring(0, 12)}...</span>
                          {copiedUid ? <Check className="w-3 h-3 text-emerald-400" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {!user ? (
                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => { onClose(); onOpenLogin(); }}
                        className="flex-1 py-3 px-4 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                      >
                        <Key className="w-4 h-4" />
                        {t.guestConnectLabel || 'Se connecter avec Google'}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                      <button
                        onClick={onOpenLogout}
                        className="py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-red-200 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {t.logoutBtn || 'Se déconnecter'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Features unlocked with account */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Watchlist Cloud</div>
                      <div className="text-[10px] text-white/50">Sauvegarde automatique Firestore</div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Watch Party Synchro</div>
                      <div className="text-[10px] text-white/50">Salons multi-utilisateurs & chat</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LIBRARY */}
            {activeTab === 'library' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#a855f7]" />
                    {lang === 'fr' ? 'Bibliothèque & Raccourcis' : 'Library & Shortcuts'}
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    {lang === 'fr' ? 'Accède rapidement à tes favoris, ton historique et tes salons.' : 'Direct shortcuts to your content collection.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
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
                    onClick={() => { onClose(); onNavigateCategory('party'); }}
                    className="p-4 rounded-2xl bg-white/[0.03] hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/40 transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{t.partyTab || 'Salons Watch Party'}</div>
                        <div className="text-xs text-white/50">{lang === 'fr' ? 'Rejoindre ou créer un salon' : 'Live group sessions'}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                  </button>

                  <button
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

                {/* Clear Local Cache / History */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      {t.systemCache || 'Cache & Recherches récentes'}
                    </div>
                    <div className="text-[11px] text-white/50">{lang === 'fr' ? 'Efface les requêtes de recherche mémorisées' : 'Reset search queries cache'}</div>
                  </div>
                  <button
                    onClick={handleClearCache}
                    disabled={isClearingCache}
                    className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isClearingCache ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    {t.clearCache || 'Vider'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB: STREAMING */}
            {activeTab === 'streaming' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#a855f7]" />
                    {lang === 'fr' ? 'Serveurs & Qualité de Lecture' : 'Streaming Servers & Playback'}
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    {lang === 'fr' ? 'Sélectionne le miroir par défaut pour la lecture des vidéos.' : 'Manage default stream mirrors and embed preferences.'}
                  </p>
                </div>

                {/* Default Server Selection */}
                <div className="space-y-3">
                  {[
                    { id: 'vidsrc', name: 'VidSrc Alpha (Recommandé)', desc: 'Lecture ultra-rapide, multi-langues et sous-titres FR/EN', speed: '99.8% uptime' },
                    { id: 'smashy', name: 'SmashyStream Pro', desc: 'Serveur alternatif HD avec lecteur moderne et pistes audio', speed: '98.5% uptime' },
                    { id: 'superembed', name: 'SuperEmbed VIP', desc: 'Miroir de secours haute fidélité pour films et séries', speed: '97.9% uptime' },
                  ].map((srv) => {
                    const isSelected = defaultServer === srv.id;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => { setDefaultServer(srv.id as any); showToast(`Serveur par défaut : ${srv.name}`, 'success'); }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
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
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                          {srv.speed}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: PARENTAL CONTROL */}
            {activeTab === 'parental' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#a855f7]" />
                    {t.parentalFilter || 'Contrôle Parental & Sécurité'}
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    {t.parentalFilterDesc || 'Masque strictement les contenus sensibles et réservés aux adultes.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${parentalFilter ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-white/10 text-white/60'}`}>
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{lang === 'fr' ? 'Filtre Strict 18+' : 'Strict 18+ Content Filter'}</div>
                      <div className="text-xs text-white/50">{parentalFilter ? 'Actif : Les titres explicites sont masqués' : 'Inactif : Tout le catalogue est visible'}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !parentalFilter;
                      setParentalFilter(next);
                      showToast(next ? 'Filtre parental activé' : 'Filtre parental désactivé', 'info');
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer outline-none ${parentalFilter ? 'bg-emerald-500' : 'bg-white/20'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${parentalFilter ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB: SYSTEM & ABOUT */}
            {activeTab === 'system' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#a855f7]" />
                    {lang === 'fr' ? 'Architecture & Statut Système' : 'System Architecture & AI Studio Status'}
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    {lang === 'fr' ? "Détails techniques de l'application et de l'infrastructure cloud." : 'Cloud execution engine and app metadata.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-xs text-white/60">Version de l'App</span>
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
                  LevelMovie • Propulsé par LevelUp IA Ecosystem
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#090a10] flex items-center justify-between text-xs text-white/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-medium text-white/70">Connecté au réseau LevelMovie</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all cursor-pointer"
          >
            {t.confirm || 'Fermer'}
          </button>
        </div>

      </div>
    </div>
  );
};
