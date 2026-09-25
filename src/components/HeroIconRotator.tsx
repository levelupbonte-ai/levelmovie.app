import React, { useState, useEffect, useRef } from 'react';

interface RotatorItem {
  id: string;
  word: string;
  iconName: string;
  alt: string;
  link?: string;
}

export const ROTATOR_ITEMS: RotatorItem[] = [
  { id: 'barbershops', word: 'barbershops', iconName: 'barbershop', alt: '3D faceted barbershop scissors and comb icon', link: '/websites-for/barbershops' },
  { id: 'salons', word: 'salons', iconName: 'salon', alt: '3D faceted hair salon dryer and mirror icon', link: '/websites-for/salons' },
  { id: 'creators', word: 'creators', iconName: 'creators', alt: '3D faceted creator camera and video play icon', link: '/services/creator-websites' },
  { id: 'online-stores', word: 'online stores', iconName: 'store', alt: '3D faceted shopping bag store icon', link: '/services/online-stores' },
  { id: 'portfolios', word: 'portfolios', iconName: 'portfolio', alt: '3D faceted portfolio gallery frame icon', link: '/services/portfolio-websites' },
  { id: 'security', word: 'security', iconName: 'security', alt: '3D faceted protective shield and padlock icon', link: '/services/security-check' },
  { id: 'bookings', word: 'bookings', iconName: 'booking', alt: '3D faceted calendar checkmark appointment icon', link: '/services/local-business-websites' },
  { id: 'care-plans', word: 'care plans', iconName: 'care', alt: '3D faceted wrench and heart website care icon', link: '/services/care-plans' },
];

export default function HeroIconRotator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [secondaryLoaded, setSecondaryLoaded] = useState(false);

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

  // Lazy-load secondary icons after page load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPageLoad = () => {
      setTimeout(() => setSecondaryLoaded(true), 300);
    };

    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad, { once: true });
    }
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

  // If user prefers reduced motion: show first icon and static row of all icons without bubble boxes
  if (prefersReducedMotion) {
    return (
      <div className="pt-2 space-y-3" aria-live="off">
        <div className="flex items-center gap-3">
          <picture className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center select-none">
            <source srcSet="/assets/img/icons/barbershop.avif" type="image/avif" />
            <source srcSet="/assets/img/icons/barbershop.webp" type="image/webp" />
            <img
              src="/assets/img/icons/barbershop.png"
              alt={ROTATOR_ITEMS[0].alt}
              width="72"
              height="72"
              className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(124,58,237,0.45)]"
            />
          </picture>
          <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            Made for <span className="text-[#DDD6FE] underline decoration-[#7C3AED] decoration-2 underline-offset-4">barbershops, salons, creators &amp; online businesses</span>
          </div>
        </div>

        {/* Clean borderless row of all icons */}
        <div className="flex flex-wrap items-center gap-4 pt-1">
          {ROTATOR_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 text-xs font-semibold text-[#A1A1B5] hover:text-white transition-colors"
            >
              <picture className="w-6 h-6 shrink-0">
                <source srcSet={`/assets/img/icons/${item.iconName}.avif`} type="image/avif" />
                <source srcSet={`/assets/img/icons/${item.iconName}.webp`} type="image/webp" />
                <img
                  src={`/assets/img/icons/${item.iconName}.png`}
                  alt=""
                  width="24"
                  height="24"
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(124,58,237,0.4)]"
                />
              </picture>
              <span>{item.word}</span>
            </div>
          ))}
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
      <div className="flex items-center gap-3.5 sm:gap-4.5">
        {/* Large 3D Icon: Clean, borderless, floating directly without bubble box */}
        <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center select-none">
          {/* Subtle natural purple aura */}
          <div className="absolute inset-1 bg-[#7C3AED]/20 rounded-full blur-xl pointer-events-none" />

          {/* Render all icons for smooth crossfade, with first having fetchPriority="high" */}
          {ROTATOR_ITEMS.map((item, idx) => {
            const isCurrent = idx === currentIndex;
            const isFirst = idx === 0;

            if (!isFirst && !secondaryLoaded && !isCurrent) {
              return null;
            }

            return (
              <picture
                key={item.id}
                className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out will-change-[transform,opacity]"
                style={{
                  opacity: isCurrent ? 1 : 0,
                  transform: isCurrent ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.92)',
                  pointerEvents: isCurrent ? 'auto' : 'none',
                }}
              >
                <source srcSet={`/assets/img/icons/${item.iconName}.avif`} type="image/avif" />
                <source srcSet={`/assets/img/icons/${item.iconName}.webp`} type="image/webp" />
                <img
                  src={`/assets/img/icons/${item.iconName}.png`}
                  alt={item.alt}
                  width="72"
                  height="72"
                  fetchPriority={isFirst ? 'high' : 'auto'}
                  loading={isFirst ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(124,58,237,0.45)]"
                />
              </picture>
            );
          })}
        </div>

        {/* Text Area: "Made for <rotating word>" */}
        <div className="flex-1 min-w-0">
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

          <div className="relative h-9 sm:h-11 overflow-hidden flex items-center mt-0.5">
            <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mr-2 shrink-0">
              Made for
            </span>

            {/* All words exist in HTML */}
            <div className="relative inline-block h-full min-w-[140px] sm:min-w-[180px]">
              {ROTATOR_ITEMS.map((item, idx) => {
                const isCurrent = idx === currentIndex;
                return (
                  <span
                    key={item.id}
                    className="absolute left-0 top-0 bottom-0 flex items-center text-xl sm:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#DDD6FE] via-[#A78BFA] to-[#C4B5FD] transition-all duration-500 ease-out whitespace-nowrap will-change-[transform,opacity]"
                    style={{
                      opacity: isCurrent ? 1 : 0,
                      transform: isCurrent ? 'translateY(0)' : 'translateY(10px)',
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
    </div>
  );
}
