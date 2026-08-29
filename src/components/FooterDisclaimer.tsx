import React from 'react';
import { LevelMovieLogo } from '../constants';
import { Shield, FileText } from 'lucide-react';

interface FooterDisclaimerProps {
  lang: string;
  onOpenSupport?: () => void;
  onOpenSettings?: () => void;
  onOpenLegal?: (doc: 'terms' | 'privacy') => void;
}

export const FooterDisclaimer: React.FC<FooterDisclaimerProps> = ({ lang, onOpenLegal }) => {
  const isFr = lang === 'fr';

  return (
    <footer className="w-full mt-16 pt-10 pb-28 md:pb-12 border-t border-white/5 bg-[#05060a] relative z-20 text-white/50">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-3">
        {/* Logo & Nom */}
        <div className="flex items-center justify-center gap-2.5">
          <LevelMovieLogo className="w-6 h-6 text-[#a855f7]" />
          <div className="text-xl font-black tracking-widest leading-none">
            <span className="text-white">Level</span>
            <span className="text-[#a855f7]">Movie</span>
          </div>
        </div>

        {/* Description agrégateur & indexeur */}
        <p className="text-xs text-white/60 font-medium tracking-wide max-w-xl mx-auto">
          {isFr
            ? "Agrégateur & Indexeur Cinématographique Décentralisé"
            : "Decentralized Cinema Aggregator & Indexing Engine"}
        </p>

        {/* Liens Juridiques & Écosystème */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-white/40">
          <button
            type="button"
            onClick={() => onOpenLegal?.('terms')}
            className="hover:text-[#c084fc] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3 h-3" />
            {isFr ? "Conditions d'utilisation" : "Terms of Service"}
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onOpenLegal?.('privacy')}
            className="hover:text-[#60a5fa] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Shield className="w-3 h-3" />
            {isFr ? "Politique de confidentialité" : "Privacy Policy"}
          </button>
          <span>•</span>
          <a
            href="https://levelup-ecosystem.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#c084fc] transition-colors"
          >
            Powered by LevelUp Ecosystem
          </a>
        </div>
      </div>
    </footer>
  );
};

