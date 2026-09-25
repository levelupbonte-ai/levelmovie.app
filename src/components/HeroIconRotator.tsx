import React, { useState, useEffect, useRef } from 'react';

interface RotatorItem {
  id: string;
  word: string;
  link?: string;
}

export const ROTATOR_ITEMS: RotatorItem[] = [
  { id: 'barbershops', word: 'barbershops', link: '/websites-for/barbershops' },
  { id: 'salons', word: 'salons', link: '/websites-for/salons' },
  { id: 'creators', word: 'creators', link: '/services/creator-websites' },
  { id: 'online-stores', word: 'online stores', link: '/services/online-stores' },
  { id: 'portfolios', word: 'portfolios', link: '/services/portfolio-websites' },
  { id: 'security', word: 'security audits', link: '/services/security-check' },
  { id: 'bookings', word: 'local bookings', link: '/services/local-business-websites' },
  { id: 'care-plans', word: 'care plans', link: '/services/care-plans' },
];

export default function HeroIconRotator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 2.5s interval rotation when playing, not hovered, not focused, not reduced motion
  useEffect(() => {
    if (prefersReducedMotion || !isPlaying || isHovered || isFocused) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ROTATOR_ITEMS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, isFocused, prefersReducedMotion]);

  // If user prefers reduced motion: show static sentence
  if (prefersReducedMotion) {
    return (
      <div className="pt-2 space-y-2" aria-live="off">
        <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Made for <span className="text-[#DDD6FE] underline decoration-[#7C3AED] decoration-2 underline-offset-4">barbershops, salons, creators &amp; online businesses</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="pt-2"
      aria-live="off"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#A78BFA]">
            Targeted Craft
          </span>

          {/* Pause / Resume Button */}
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-label={isPlaying ? 'Pause rotating industries' : 'Resume rotating industries'}
            title={isPlaying ? 'Pause rotator' : 'Resume rotator'}
            className="p-1 rounded-md text-[#A1A1B5] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] cursor-pointer"
          >
            {isPlaying ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
        </div>

        <div className="relative h-10 sm:h-12 overflow-hidden flex items-center">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mr-2.5 shrink-0">
            Made for
          </span>

          {/* All words exist in HTML */}
          <div className="relative inline-block h-full min-w-[180px] sm:min-w-[240px]">
            {ROTATOR_ITEMS.map((item, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <span
                  key={item.id}
                  className="absolute left-0 top-0 bottom-0 flex items-center text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#DDD6FE] via-[#A78BFA] to-[#C4B5FD] transition-all duration-500 ease-out whitespace-nowrap will-change-[transform,opacity]"
                  style={{
                    opacity: isCurrent ? 1 : 0,
                    transform: isCurrent ? 'translateY(0)' : 'translateY(12px)',
                    pointerEvents: isCurrent ? 'auto' : 'none',
                  }}
                >
                  {item.word}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
