import React from 'react';
import { LevelMovieLogo } from '../constants';

interface FooterDisclaimerProps {
  lang: string;
}

export const FooterDisclaimer: React.FC<FooterDisclaimerProps> = ({ lang }) => {
  const isFr = lang === 'fr';

  return (
    <footer className="w-full mt-16 pt-10 pb-24 md:pb-12 border-t border-white/5 bg-[#05060a] relative z-20 text-white/50">
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

        {/* Aucun droit réservé */}
        <p className="text-[11px] text-white/30 font-mono">
          {isFr ? "Aucun droit réservé" : "No rights reserved"}
        </p>
      </div>
    </footer>
  );
};
