import React from 'react';

export type AppRoute = 'ecosystem' | 'movie' | 'music' | 'weather';

interface EcosystemLoaderProps {
  target?: AppRoute;
  progress?: number;
  step?: number;
}

export const EcosystemLoader: React.FC<EcosystemLoaderProps> = () => {
  return (
    <div
      id="ecosystem-transition-loader"
      className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-md flex flex-col items-center justify-center select-none pointer-events-auto transition-opacity duration-300"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Sleek Glowing Violet Spinner */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          {/* Subtle static circle track */}
          <div className="w-14 h-14 rounded-full border-2 border-white/10" />
          {/* High-speed glowing spinner arc */}
          <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-transparent border-t-[#a855f7] border-r-[#c084fc] animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          {/* Subtle core pulsing indicator */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#a855f7] shadow-[0_0_10px_#a855f7] animate-pulse" />
        </div>

        {/* Minimalist prompt below spinner */}
        <div className="text-center">
          <p className="text-white text-sm font-medium tracking-wider">
            Just a moment...
          </p>
        </div>
      </div>
    </div>
  );
};
