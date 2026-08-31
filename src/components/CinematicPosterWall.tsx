import React from 'react';
import { getBackdropImageUrl, isLowDataMode } from '../constants';

const FEATURED_BACKDROPS = [
  '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', // Dune: Part Two
  '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // The Dark Knight
  '/bXi6IQPV9VvgVKnGNFMrGvrHQ0V.jpg', // Oppenheimer
  '/wRnbSplAnMFgg7fXj1kYnK1i8gA.jpg'  // Interstellar
];

interface CinematicPosterWallProps {
  opacity?: number;
  interactive?: boolean;
  lowDataMode?: boolean;
}

export const CinematicPosterWall: React.FC<CinematicPosterWallProps> = ({
  opacity = 0.25,
  lowDataMode = isLowDataMode()
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* If Low Data Mode is active, skip background image downloads completely for zero CPU/GPU overhead */}
      {!lowDataMode && (
        <div 
          className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 scale-105 filter blur-sm transition-opacity duration-700"
          style={{ opacity }}
        >
          {FEATURED_BACKDROPS.map((path, idx) => (
            <div key={`wall-bg-${idx}`} className="w-full h-full relative overflow-hidden bg-[#0a0a14]">
              <img
                src={getBackdropImageUrl(path, lowDataMode)}
                alt=""
                decoding="async"
                className="w-full h-full object-cover grayscale-[40%] opacity-40 transform scale-100"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Cinematic Overlays: Vignette & Ambient Radial Lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/85 to-[#060608]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,6,8,0.95)_75%)]" />
      <div className="absolute inset-0 bg-purple-950/20" />
    </div>
  );
};

