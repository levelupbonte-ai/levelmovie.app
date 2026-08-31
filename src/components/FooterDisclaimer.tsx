import React from 'react';
import { LevelMovieLogo } from '../constants';
import { 
  Shield, 
  FileText, 
  Film, 
  Tv, 
  Sparkles, 
  Users, 
  Bot, 
  Key, 
  LogIn, 
  UserPlus, 
  Bookmark, 
  History, 
  HelpCircle, 
  Flame, 
  Search,
  ExternalLink,
  CheckCircle2,
  Globe
} from 'lucide-react';

interface FooterDisclaimerProps {
  lang: string;
  onOpenSupport?: () => void;
  onOpenSettings?: (tab?: string) => void;
  onOpenLegal?: (doc: 'terms' | 'privacy') => void;
  onOpenAuth?: (view: 'view-main' | 'view-login' | 'view-signup' | 'view-key') => void;
  onNavigateCategory?: (cat: string) => void;
  onSearchQuery?: (query: string) => void;
  onOpenDona?: () => void;
}

export const FooterDisclaimer: React.FC<FooterDisclaimerProps> = ({
  lang,
  onOpenSupport,
  onOpenSettings,
  onOpenLegal,
  onOpenAuth,
  onNavigateCategory,
  onSearchQuery,
  onOpenDona
}) => {
  const isFr = lang === 'fr';

  const handleLink = (action: () => void) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    action();
  };

  return (
    <footer id="main-footer" className="w-full mt-20 border-t border-white/10 bg-[#050508] relative z-20 text-white/70 overflow-hidden">
      {/* Glow ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-44 bg-purple-900/10 blur-2xl pointer-events-none" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Top Branding */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <LevelMovieLogo className="w-7 h-7 text-[#a855f7]" />
            <div>
              <div className="text-2xl font-black tracking-wider leading-none">
                <span className="text-white">Level</span>
                <span className="text-[#a855f7]">Movie</span>
              </div>
              <p className="text-xs text-white/50 font-medium mt-1">
                {isFr
                  ? "Plateforme Cinématographique & Streaming HD Décentralisé"
                  : "Decentralized Cinema & HD Streaming Platform"}
              </p>
            </div>
          </div>
        </div>

        {/* 5-Column Rich Sitelinks (Netflix / Prime Video Style) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-12 text-xs border-b border-white/10">
          {/* Col 1: Explorer / Navigation */}
          <div className="space-y-3.5">
            <p className="font-bold text-sm text-white tracking-wide flex items-center gap-2">
              <Film className="w-4 h-4 text-purple-400" />
              {isFr ? "Explorer le Catalogue" : "Browse Catalog"}
            </p>
            <ul className="space-y-2.5 text-white/60">
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onNavigateCategory?.('movies'))}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <Film className="w-3 h-3 text-white/40" />
                  {isFr ? "Films HD en Streaming" : "HD Movies Streaming"}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onNavigateCategory?.('series'))}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <Tv className="w-3 h-3 text-white/40" />
                  {isFr ? "Séries TV Complètes" : "Full TV Series"}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onNavigateCategory?.('anime'))}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <Flame className="w-3 h-3 text-amber-400" />
                  {isFr ? "Animes Japonais VF & VOSTFR" : "Anime VF & VOSTFR"}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onNavigateCategory?.('trending'))}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left"
                >
                  {isFr ? "Tendances de la Semaine" : "Trending This Week"}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onNavigateCategory?.('top10'))}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left"
                >
                  {isFr ? "Top 10 LevelMovie" : "Top 10 Picks"}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Titres Populaires & Recherches Rapides (SEO) */}
          <div className="space-y-3.5">
            <p className="font-bold text-sm text-white tracking-wide flex items-center gap-2">
              <Search className="w-4 h-4 text-purple-400" />
              {isFr ? "Titres Phares (Recherche)" : "Popular Titles"}
            </p>
            <ul className="space-y-2.5 text-white/60">
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onSearchQuery?.('Naruto'))}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <span>🍥 Naruto & Shippuden</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onSearchQuery?.('One Piece'))}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <span>🏴‍☠️ One Piece</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onSearchQuery?.('Jujutsu Kaisen'))}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <span>⚡ Jujutsu Kaisen</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onSearchQuery?.('Attaque des Titans'))}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <span>⚔️ L'Attaque des Titans</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onSearchQuery?.('Demon Slayer'))}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <span>🗡️ Demon Slayer</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Compte & Accès (Sign In / Sign Up) */}
          <div className="space-y-3.5">
            <p className="font-bold text-sm text-white tracking-wide flex items-center gap-2">
              <LogIn className="w-4 h-4 text-purple-400" />
              {isFr ? "Compte & Accès" : "Account & Access"}
            </p>
            <ul className="space-y-2.5 text-white/60">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuth?.('view-login')}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <LogIn className="w-3 h-3 text-purple-400" />
                  <span className="font-medium text-white/80">{isFr ? "Se connecter (Sign In)" : "Sign In"}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuth?.('view-signup')}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <UserPlus className="w-3 h-3 text-purple-400" />
                  <span className="font-medium text-white/80">{isFr ? "Créer un compte (Sign Up)" : "Sign Up"}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuth?.('view-key')}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <Key className="w-3 h-3 text-purple-400" />
                  <span>{isFr ? "Activer avec Clé LVL" : "Activate with LVL Key"}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onNavigateCategory?.('watchlist'))}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <Bookmark className="w-3 h-3 text-white/40" />
                  <span>{isFr ? "Ma Liste / Favoris" : "My Watchlist"}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onNavigateCategory?.('history'))}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <History className="w-3 h-3 text-white/40" />
                  <span>{isFr ? "Historique de lecture" : "Viewing History"}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Fonctionnalités & Écosystème */}
          <div className="space-y-3.5">
            <p className="font-bold text-sm text-white tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              {isFr ? "Fonctionnalités & IA" : "Features & AI"}
            </p>
            <ul className="space-y-2.5 text-white/60">
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onNavigateCategory?.('parties'))}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <Users className="w-3 h-3 text-purple-400" />
                  <span>{isFr ? "Watch Party en Direct" : "Live Watch Party"}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onOpenDona?.())}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <Bot className="w-3 h-3 text-purple-400" />
                  <span>{isFr ? "Dona IA (Conseils Cinéma)" : "Dona AI Assistant"}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLink(() => onNavigateCategory?.('music'))}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left"
                >
                  <span>LevelMusic (Lecteur Audio HD)</span>
                </button>
              </li>
              <li>
                <a
                  href="https://levelup-ecosystem.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#c084fc] hover:translate-x-0.5 transition-all text-left flex items-center gap-1"
                >
                  <span>LevelUp Ecosystem</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Légal & Confidentialité */}
          <div className="space-y-3.5">
            <p className="font-bold text-sm text-white tracking-wide flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              {isFr ? "Légal & Sécurité" : "Legal & Privacy"}
            </p>
            <ul className="space-y-2.5 text-white/60">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('terms')}
                  className="hover:text-purple-300 hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5 font-medium"
                >
                  <FileText className="w-3 h-3 text-purple-400" />
                  <span>{isFr ? "Conditions d'utilisation (/terms)" : "Terms of Service (/terms)"}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('privacy')}
                  className="hover:text-blue-300 hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5 font-medium"
                >
                  <Shield className="w-3 h-3 text-blue-400" />
                  <span>{isFr ? "Confidentialité & RGPD (/privacy)" : "Privacy Policy (/privacy)"}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('terms')}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left"
                >
                  {isFr ? "Charte DMCA & Retrait" : "DMCA & Copyright Policy"}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenSupport?.()}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3 h-3 text-white/40" />
                  <span>{isFr ? "Centre d'aide & Signalement" : "Help Center & Report"}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenSettings?.('about')}
                  className="hover:text-white hover:translate-x-0.5 transition-all text-left"
                >
                  {isFr ? "À propos de LevelMovie" : "About LevelMovie"}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Légal & Copyright */}
        <div className="pt-8 space-y-4 text-xs text-white/40 leading-relaxed">
          <p className="max-w-4xl">
            {isFr
              ? "Avis de non-responsabilité : LevelMovie est un moteur de recherche et un indexeur automatisé décentralisé. LevelMovie n'héberge, ne stocke et ne transmet aucun fichier vidéo sur ses propres serveurs. Tous les flux proviennent de services tiers indépendants."
              : "Disclaimer: LevelMovie is a decentralized media search engine and indexing tool. LevelMovie does not host, upload, or transmit any video files on its servers. All streams are retrieved from independent third-party sources."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5 text-[11px]">
            <p>© 2026 LevelUp Ecosystem &middot; LevelMovie. Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <a href="/terms" target="_blank" className="hover:text-white transition-colors">/terms</a>
              <span>•</span>
              <a href="/privacy" target="_blank" className="hover:text-white transition-colors">/privacy</a>
              <span>•</span>
              <span className="text-purple-400 font-medium">Build 2026.1 &middot; Ultra HD Fast Engine</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


