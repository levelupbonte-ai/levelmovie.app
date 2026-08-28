import React from 'react';
import {
  X, Settings, Bookmark, Clapperboard, LayoutGrid, HelpCircle,
  Film, Tv, Users, Home, LogOut, User, ChevronRight, ExternalLink
} from 'lucide-react';
import { LevelMovieLogo, DonaStar } from '../constants';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenFavorites: () => void;
  onOpenTrailers: () => void;
  onOpenExternalApps: () => void;
  onOpenSupport: () => void;
  onOpenDona?: () => void;
  onNavigateCategory: (cat: string) => void;
  onOpenLogin: () => void;
  onOpenLogout: () => void;
  user: any;
  userName: string;
  userEmail: string;
  userPhoto: string | null;
  watchlistCount: number;
  currentCategory: string;
  lang: string;
  t: any;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenFavorites,
  onOpenTrailers,
  onOpenExternalApps,
  onOpenSupport,
  onOpenDona,
  onNavigateCategory,
  onOpenLogin,
  onOpenLogout,
  user,
  userName,
  userEmail,
  userPhoto,
  watchlistCount,
  currentCategory,
  lang,
  t
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9200] flex justify-end animate-in fade-in duration-200">
      {/* Dark Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Docked RIGHT Sidebar Container */}
      <div className="relative w-72 sm:w-80 h-full bg-[#090a10] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden z-10 animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0c0d14] shrink-0">
          <div className="flex items-center gap-2.5">
            <LevelMovieLogo className="w-6 h-6 text-[#a855f7]" />
            <div className="text-base font-black tracking-widest leading-none flex items-center">
              <span className="text-white">Level</span><span className="text-[#a855f7]">Movie</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white transition-colors cursor-pointer outline-none active:scale-90"
            title={lang === 'fr' ? 'Fermer le menu' : 'Close menu'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Center Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
          {/* User Account Section (Simple & Clean, No Heavy Bubbles) */}
          <div className="pb-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {userPhoto ? (
                  <img src={userPhoto} className="w-full h-full object-cover" alt="Profile" />
                ) : user ? (
                  <span className="text-sm font-black text-[#a855f7]">
                    {(userName || 'U').charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-5 h-5 text-white/40" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {userName || t.defaultUser}
                </div>
                <div className="text-[11px] text-white/40 truncate font-mono">
                  {user ? (userEmail || 'ID: ' + (user.uid || user.id || 'usr_member')) : (lang === 'fr' ? 'Mode Invité' : 'Guest Mode')}
                </div>
              </div>
            </div>

            {!user ? (
              <button
                onClick={() => { onClose(); onOpenLogin(); }}
                className="text-xs font-semibold text-[#c084fc] hover:text-white transition-colors cursor-pointer"
              >
                {lang === 'fr' ? 'Connexion' : 'Login'}
              </button>
            ) : null}
          </div>

          {/* MAIN MENU BUTTONS (Clean items: Plain Icon + Name + Chevron) */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/30 px-2 pb-2">
              {lang === 'fr' ? 'Menu Principal' : 'Main Menu'}
            </div>

            {/* 0. DONA */}
            {onOpenDona && (
              <button
                onClick={() => { onClose(); onOpenDona(); }}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-white/5 transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <DonaStar className="w-5 h-5 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                      Dona
                    </div>
                    <div className="text-[10px] text-white/40">
                      {lang === 'fr' ? 'Recommandations & Assistant' : 'Movie & Series Advisor'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>
            )}

            {/* 1. PARAMÈTRES */}
            <button
              onClick={() => { onClose(); onOpenSettings(); }}
              className="w-full py-2.5 px-3 rounded-xl hover:bg-white/5 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Settings className="w-4 h-4 text-white/50 group-hover:text-[#c084fc] transition-colors" />
                <div>
                  <div className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                    {lang === 'fr' ? 'Paramètres' : 'Settings'}
                  </div>
                  <div className="text-[10px] text-white/40">
                    {lang === 'fr' ? 'Langue, serveurs, sécurité' : 'Config, mirrors, parental filter'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* 2. MES FAVORIS */}
            <button
              onClick={() => { onClose(); onOpenFavorites(); }}
              className={`w-full py-2.5 px-3 rounded-xl transition-all text-left flex items-center justify-between group cursor-pointer ${
                currentCategory === 'watchlist'
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Bookmark className="w-4 h-4 text-white/50 group-hover:text-amber-400 transition-colors" />
                <div>
                  <div className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                    {lang === 'fr' ? 'Mes Favoris' : 'My Favorites'}
                  </div>
                  <div className="text-[10px] text-white/40">
                    {watchlistCount} {lang === 'fr' ? 'titres enregistrés' : 'saved titles'}
                  </div>
                </div>
              </div>
              {watchlistCount > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-mono font-bold">
                  {watchlistCount}
                </span>
              ) : (
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              )}
            </button>

            {/* 3. BANDES-ANNONCES */}
            <button
              onClick={() => { onClose(); onOpenTrailers(); }}
              className={`w-full py-2.5 px-3 rounded-xl transition-all text-left flex items-center justify-between group cursor-pointer ${
                currentCategory === 'trailers'
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Clapperboard className="w-4 h-4 text-white/50 group-hover:text-pink-400 transition-colors" />
                <div>
                  <div className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                    {lang === 'fr' ? 'Bandes-Annonces' : 'Trailers Hub'}
                  </div>
                  <div className="text-[10px] text-white/40">
                    {lang === 'fr' ? 'Derniers trailers & teasers HD' : 'Latest teasers & clips'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* 3.5. ANIME HUB */}
            <button
              onClick={() => { onClose(); onNavigateCategory('anime'); }}
              className={`w-full py-2.5 px-3 rounded-xl transition-all text-left flex items-center justify-between group cursor-pointer ${
                currentCategory === 'anime'
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <LevelMovieLogo className="w-4 h-4 group-hover:scale-110 transition-transform" color="#ef4444" />
                <div>
                  <div className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                    LevelAnime
                  </div>
                  <div className="text-[10px] text-white/40">
                    {lang === 'fr' ? 'Simulcasts, VF/VOSTFR & saisons' : 'Simulcasts, dubs & seasons'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* 4. APPLICATIONS EXTERNES / LEVELUP STORE */}
            <button
              onClick={() => { onClose(); onOpenExternalApps(); }}
              className="w-full py-2.5 px-3 rounded-xl hover:bg-white/5 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <LayoutGrid className="w-4 h-4 text-white/50 group-hover:text-purple-400 transition-colors" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                      LevelUp App Store
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                      Suite
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40">
                    {lang === 'fr' ? 'Écosystème & modules connectés' : 'Ecosystem & connected apps'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-colors" />
            </button>

            {/* 5. AIDE & SUPPORT */}
            <button
              onClick={() => { onClose(); onOpenSupport(); }}
              className="w-full py-2.5 px-3 rounded-xl hover:bg-white/5 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <HelpCircle className="w-4 h-4 text-white/50 group-hover:text-emerald-400 transition-colors" />
                <div>
                  <div className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                    {lang === 'fr' ? 'Aide & Support' : 'Help & Support'}
                  </div>
                  <div className="text-[10px] text-white/40">
                    {lang === 'fr' ? 'FAQ, requêtes & assistance' : 'Bug report, request & FAQ'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

        </div>

        {/* Footer Area: Clean Version Display & Connect / Disconnect Action */}
        <div className="p-4 border-t border-white/10 bg-[#090a10] space-y-3 shrink-0">
          <div className="flex items-center justify-between text-[11px] text-white/40 px-1">
            <span>LevelMovie</span>
            <span>v2.5</span>
          </div>

          {user ? (
            <button
              onClick={() => { onClose(); onOpenLogout(); }}
              className="w-full py-2.5 px-3 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.logoutBtn || (lang === 'fr' ? 'Se déconnecter' : 'Log Out')}</span>
            </button>
          ) : (
            <button
              onClick={() => { onClose(); onOpenLogin(); }}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.guestConnectLabel || (lang === 'fr' ? 'Se connecter' : 'Log In')}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
