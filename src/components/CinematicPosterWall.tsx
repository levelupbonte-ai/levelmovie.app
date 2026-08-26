import React, { useEffect, useState } from 'react';
import { IMAGE_BASE_URL } from '../constants';

const POPULAR_POSTERS = [
  '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // The Dark Knight
  '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', // Dune: Part Two
  '/fiVW06jE7z9YnO4trhaMEdclSiC.jpg', // Fast X
  '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', // Dune
  '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', // Avengers Infinity War
  '/1E5baAaEse26fej7uHcjOgEE2t2.jpg', // Fast & Furious
  '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', // Deadpool & Wolverine
  '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', // Spirited Away
  '/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg', // The Flash
  '/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg', // Kung Fu Panda 4
  '/cxevDYdeFq29UCi9nF7kP1yhA6C.jpg', // Godzilla x Kong
  '/bXi6IQPV9VvgVKnGNFMrGvrHQ0V.jpg', // Oppenheimer
  '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', // Avatar
  '/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg', // Avatar: The Way of Water
  '/A4j8S6moJS2zNtRR8oWF08gRJ07.jpg', // Spider-Man No Way Home
  '/NNxYkU70HPurnNCSiCjYAmacwm.jpg', // Mission Impossible
  '/wRnbSplAnMFgg7fXj1kYnK1i8gA.jpg', // Interstellar
  '/74xTEgt7R36Fpooo50r9T25onhq.jpg', // The Batman
  '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', // Fight Club
  '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg'  // The Matrix
];

interface CinematicPosterWallProps {
  opacity?: number;
  interactive?: boolean;
}

export const CinematicPosterWall: React.FC<CinematicPosterWallProps> = ({
  opacity = 0.25
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Dynamic 3-row diagonal / sliding movie wall */}
      <div 
        className="absolute -inset-10 flex flex-col gap-4 opacity-40 scale-105 transform -rotate-3 transition-opacity duration-1000"
        style={{ opacity }}
      >
        {/* Row 1 */}
        <div className="flex gap-4 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
          {POPULAR_POSTERS.slice(0, 10).map((path, idx) => (
            <div
              key={`r1-${idx}`}
              className="w-28 sm:w-36 md:w-44 aspect-[2/3] rounded-xl overflow-hidden bg-[#151624] shrink-0 shadow-2xl border border-white/5"
            >
              <img
                src={`${IMAGE_BASE_URL}${path}`}
                alt="Movie poster"
                className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all"
                loading="eager"
              />
            </div>
          ))}
          {POPULAR_POSTERS.slice(0, 10).map((path, idx) => (
            <div
              key={`r1-dup-${idx}`}
              className="w-28 sm:w-36 md:w-44 aspect-[2/3] rounded-xl overflow-hidden bg-[#151624] shrink-0 shadow-2xl border border-white/5"
            >
              <img
                src={`${IMAGE_BASE_URL}${path}`}
                alt="Movie poster"
                className="w-full h-full object-cover grayscale-[30%]"
                loading="eager"
              />
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex gap-4 animate-[marquee_50s_linear_infinite_reverse] whitespace-nowrap">
          {POPULAR_POSTERS.slice(5, 15).map((path, idx) => (
            <div
              key={`r2-${idx}`}
              className="w-28 sm:w-36 md:w-44 aspect-[2/3] rounded-xl overflow-hidden bg-[#151624] shrink-0 shadow-2xl border border-white/5"
            >
              <img
                src={`${IMAGE_BASE_URL}${path}`}
                alt="Movie poster"
                className="w-full h-full object-cover grayscale-[30%]"
                loading="eager"
              />
            </div>
          ))}
          {POPULAR_POSTERS.slice(5, 15).map((path, idx) => (
            <div
              key={`r2-dup-${idx}`}
              className="w-28 sm:w-36 md:w-44 aspect-[2/3] rounded-xl overflow-hidden bg-[#151624] shrink-0 shadow-2xl border border-white/5"
            >
              <img
                src={`${IMAGE_BASE_URL}${path}`}
                alt="Movie poster"
                className="w-full h-full object-cover grayscale-[30%]"
                loading="eager"
              />
            </div>
          ))}
        </div>

        {/* Row 3 */}
        <div className="flex gap-4 animate-[marquee_45s_linear_infinite] whitespace-nowrap">
          {POPULAR_POSTERS.slice(10, 20).map((path, idx) => (
            <div
              key={`r3-${idx}`}
              className="w-28 sm:w-36 md:w-44 aspect-[2/3] rounded-xl overflow-hidden bg-[#151624] shrink-0 shadow-2xl border border-white/5"
            >
              <img
                src={`${IMAGE_BASE_URL}${path}`}
                alt="Movie poster"
                className="w-full h-full object-cover grayscale-[30%]"
                loading="eager"
              />
            </div>
          ))}
          {POPULAR_POSTERS.slice(10, 20).map((path, idx) => (
            <div
              key={`r3-dup-${idx}`}
              className="w-28 sm:w-36 md:w-44 aspect-[2/3] rounded-xl overflow-hidden bg-[#151624] shrink-0 shadow-2xl border border-white/5"
            >
              <img
                src={`${IMAGE_BASE_URL}${path}`}
                alt="Movie poster"
                className="w-full h-full object-cover grayscale-[30%]"
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Cinematic Overlays: Vignette & Ambient Radial Lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/70 to-[#060608]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,6,8,0.92)_80%)]" />
      <div className="absolute inset-0 bg-[#8b5cf6]/10 mix-blend-color-dodge" />
    </div>
  );
};
