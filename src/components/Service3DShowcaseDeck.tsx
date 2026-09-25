import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from './Link';

interface ServiceItem {
  id: string;
  tag: string;
  title: string;
  desc: string;
  iconName: string;
  alt: string;
  link: string;
  highlight: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'barbershops',
    tag: 'Chairs & Grooming',
    title: 'Barbershop Websites',
    desc: '24/7 online chair booking, barber team rosters & Google Maps local ranking with zero phone interruptions.',
    iconName: 'barbershop',
    alt: 'Barbershop scissors and comb 3D icon',
    link: '/websites-for/barbershops',
    highlight: '+40% Appointments',
  },
  {
    id: 'salons',
    tag: 'Hair & Esthetics',
    title: 'Salon & Beauty Websites',
    desc: 'Stylist portfolio showcases, transparent service tier pricing, and automated multi-service scheduling.',
    iconName: 'salon',
    alt: 'Salon hairdryer and mirror 3D icon',
    link: '/websites-for/salons',
    highlight: 'Stylist Rosters',
  },
  {
    id: 'creators',
    tag: 'Creator Economy',
    title: 'Creator Websites',
    desc: 'Own your audience. Branded link-in-bio hub, live collaboration media kit, and direct newsletter capture.',
    iconName: 'creators',
    alt: 'Creator camera and media 3D icon',
    link: '/services/creator-websites',
    highlight: 'Custom Domain',
  },
  {
    id: 'store',
    tag: 'Lean E-Commerce',
    title: 'Small Online Stores',
    desc: 'Fast checkout for merch, physical products, and instant digital downloads without high monthly platform fees.',
    iconName: 'store',
    alt: 'Shopping bag store 3D icon',
    link: '/services/online-stores',
    highlight: 'Zero Monthly Bloat',
  },
  {
    id: 'portfolio',
    tag: 'Visual Showcases',
    title: 'Portfolio Websites',
    desc: 'Clean, high-resolution project showcases with sub-second page loads for designers, photographers & pros.',
    iconName: 'portfolio',
    alt: 'Portfolio showcase 3D icon',
    link: '/services/portfolio-websites',
    highlight: '< 1s Load Speed',
  },
  {
    id: 'security',
    tag: 'Technical Hardening',
    title: 'Website Security Check',
    desc: 'Plain-English technical review of your database rules, HTTPS, exposed API keys, and account protection.',
    iconName: 'security',
    alt: 'Shield security 3D icon',
    link: '/services/security-check',
    highlight: 'Vulnerability Audit',
  },
  {
    id: 'booking',
    tag: 'Local Operations',
    title: 'Online Booking System',
    desc: 'Calendar synchronization, automated SMS/email reminders, and seamless customer self-scheduling 24/7.',
    iconName: 'booking',
    alt: 'Booking calendar 3D icon',
    link: '/services/local-business-websites',
    highlight: '24/7 Self-Serve',
  },
  {
    id: 'care',
    tag: 'Maintenance & Care',
    title: 'Website Care Plans',
    desc: 'Fast cloud hosting, automated daily backups, security monitoring, and on-demand monthly content updates.',
    iconName: 'care',
    alt: 'Care and support 3D icon',
    link: '/services/care-plans',
    highlight: 'Worry-Free Support',
  },
];

export default function Service3DShowcaseDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomKey, setZoomKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Swipe / Drag tracking
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const total = SERVICES.length;

  const triggerChange = useCallback((nextIdx: number) => {
    setActiveIndex(nextIdx);
    setZoomKey((prev) => prev + 1);
  }, []);

  const handleNext = useCallback(() => {
    triggerChange((activeIndex + 1) % total);
  }, [activeIndex, total, triggerChange]);

  const handlePrev = useCallback(() => {
    triggerChange((activeIndex - 1 + total) % total);
  }, [activeIndex, total, triggerChange]);

  // Gentle auto-rotation (pauses when hovered or reduced motion)
  useEffect(() => {
    if (isHovered || prefersReducedMotion) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [isHovered, prefersReducedMotion, handleNext]);

  // Touch swipe support (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null && touchStartYRef.current !== null) {
      const diffX = touchStartXRef.current - touchEndXRef.current;
      const diffY = touchStartYRef.current - (e.changedTouches[0]?.clientY ?? touchStartYRef.current);

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 28) {
        if (diffX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchEndXRef.current = null;
    setTimeout(() => setIsHovered(false), 2000);
  };

  // Mouse drag support (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    touchStartXRef.current = e.clientX;
    touchEndXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    touchEndXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current && touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diff = touchStartXRef.current - touchEndXRef.current;
      if (diff > 35) {
        handleNext();
      } else if (diff < -35) {
        handlePrev();
      }
    }
    isDraggingRef.current = false;
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    }
  };

  const currentService = SERVICES[activeIndex];

  /**
   * 3D Trio Queue Geometry:
   * "un rang et les autres sont derrière comme un trio"
   * The active item zooms forward to the front rank (scale 1.18, translateZ 90px).
   * Flanking items wait behind in line (scale 0.72, translateZ -70px, angled inward).
   * When switching, the queued product zooms forward into view while the outgoing one leaves.
   */
  const getPositionData = (index: number) => {
    let diff = (index - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      // CENTER FOREGROUND (RANG 1 - ZOOMED FORWARD)
      return {
        transform: 'translate3d(0, 0, 90px) scale(1.18) rotateY(0deg)',
        opacity: 1,
        zIndex: 35,
        pointer: 'cursor-default',
        isClickable: false,
        filter: 'brightness(1.08) drop-shadow(0 26px 50px rgba(0,0,0,0.8)) drop-shadow(0 0 35px rgba(124,58,237,0.38))',
        visible: true,
      };
    } else if (diff === 1) {
      // RIGHT FLANK: Queued directly behind in the trio rank, angled towards center
      return {
        transform: 'translate3d(calc(var(--card-gap, 180px)), 16px, -70px) scale(0.72) rotateY(-18deg)',
        opacity: 0.65,
        zIndex: 20,
        pointer: 'cursor-pointer hover:opacity-90',
        isClickable: true,
        action: handleNext,
        filter: 'brightness(0.85) drop-shadow(0 14px 28px rgba(0,0,0,0.55))',
        visible: true,
      };
    } else if (diff === -1) {
      // LEFT FLANK: Previous item sitting behind on the left
      return {
        transform: 'translate3d(calc(-1 * var(--card-gap, 180px)), 16px, -70px) scale(0.72) rotateY(18deg)',
        opacity: 0.65,
        zIndex: 20,
        pointer: 'cursor-pointer hover:opacity-90',
        isClickable: true,
        action: handlePrev,
        filter: 'brightness(0.85) drop-shadow(0 14px 28px rgba(0,0,0,0.55))',
        visible: true,
      };
    } else if (diff === 2) {
      // DEEP QUEUE RIGHT: 2nd product waiting in line in the distance
      return {
        transform: 'translate3d(calc(1.72 * var(--card-gap, 180px)), 28px, -170px) scale(0.48) rotateY(-28deg)',
        opacity: 0.28,
        zIndex: 10,
        pointer: 'cursor-pointer hover:opacity-50',
        isClickable: true,
        action: handleNext,
        filter: 'brightness(0.7) blur(0.5px)',
        visible: true,
      };
    } else if (diff === -2) {
      // DEEP QUEUE LEFT: Retreating product in distance
      return {
        transform: 'translate3d(calc(-1.72 * var(--card-gap, 180px)), 28px, -170px) scale(0.48) rotateY(28deg)',
        opacity: 0.22,
        zIndex: 10,
        pointer: 'cursor-pointer hover:opacity-40',
        isClickable: true,
        action: handlePrev,
        filter: 'brightness(0.7) blur(0.5px)',
        visible: true,
      };
    } else {
      // Offstage hidden
      return {
        transform: 'translate3d(0, 0, -260px) scale(0.2)',
        opacity: 0,
        zIndex: 1,
        pointer: 'pointer-events-none',
        isClickable: false,
        filter: 'none',
        visible: false,
      };
    }
  };

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="3D Trio Product Showcase"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        isDraggingRef.current = false;
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="group relative w-full max-w-[620px] sm:max-w-[700px] mx-auto select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/70 rounded-3xl"
    >
      {/* 3D Depth Stage with perspective */}
      <div
        className="relative h-[320px] sm:h-[390px] md:h-[420px] w-full flex items-center justify-center overflow-visible touch-pan-y"
        style={
          {
            perspective: '1200px',
            '--card-gap': 'clamp(145px, 24vw, 220px)',
          } as React.CSSProperties
        }
      >
        {/* Subtle radial aura behind the front active item */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-80 sm:h-80 bg-[#7C3AED]/22 rounded-full blur-[60px] pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Previous button (hidden on mobile, reveals on desktop hover) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous product"
          className="hidden sm:flex items-center justify-center absolute left-1 sm:-left-4 top-1/2 -translate-y-1/2 z-40 p-2.5 rounded-full bg-[#14141F]/80 hover:bg-[#7C3AED] border border-white/10 hover:border-[#7C3AED] text-white/70 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next button (hidden on mobile, reveals on desktop hover) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next product"
          className="hidden sm:flex items-center justify-center absolute right-1 sm:-right-4 top-1/2 -translate-y-1/2 z-40 p-2.5 rounded-full bg-[#14141F]/80 hover:bg-[#7C3AED] border border-white/10 hover:border-[#7C3AED] text-white/70 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Products rendered in rank queue */}
        {SERVICES.map((item, idx) => {
          const pos = getPositionData(idx);
          const isFront = idx === activeIndex;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (pos.isClickable && pos.action) {
                  pos.action();
                }
              }}
              title={pos.isClickable ? `Zoom to ${item.title}` : item.title}
              className={`absolute flex items-center justify-center will-change-[transform,opacity,filter] transition-all duration-700 ease-[cubic-bezier(0.2,0.9,0.25,1.05)] ${pos.pointer}`}
              style={{
                transform: pos.transform,
                opacity: pos.opacity,
                zIndex: pos.zIndex,
                filter: pos.filter,
                visibility: pos.visible || pos.opacity > 0 ? 'visible' : 'hidden',
              }}
            >
              {/* Borderless 3D product visual container */}
              <div className="w-48 h-48 sm:w-60 sm:h-60 md:w-68 md:h-68 lg:w-72 lg:h-72 relative flex items-center justify-center select-none pointer-events-none">
                <picture className="w-full h-full flex items-center justify-center">
                  <source srcSet={`/assets/img/icons/${item.iconName}.avif`} type="image/avif" />
                  <source srcSet={`/assets/img/icons/${item.iconName}.webp`} type="image/webp" />
                  <img
                    src={`/assets/img/icons/${item.iconName}.png`}
                    alt={item.alt}
                    width="288"
                    height="288"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </picture>

                {/* Subtle highlight sheen for active front product */}
                {isFront && (
                  <div
                    className="absolute -bottom-3 w-3/4 h-4 bg-[#7C3AED]/35 rounded-full blur-[14px] pointer-events-none"
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Details Section: Clean, chic typography without bubble badges, zooming forward in sync with the product */}
      <div
        key={zoomKey}
        className="pt-3 text-center space-y-2 max-w-lg mx-auto animate-product-zoom"
      >
        {/* Category tag & highlight: Clean, professional line without pill bubble containers */}
        <div className="flex items-center justify-center gap-2.5 text-xs sm:text-sm font-mono tracking-wider uppercase text-[#A78BFA]">
          <span>{currentService.tag}</span>
          <span className="text-white/25">•</span>
          <span className="text-[#10B981] font-semibold">{currentService.highlight}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {currentService.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm md:text-base text-[#A1A1B5] leading-relaxed max-w-md mx-auto min-h-[44px]">
          {currentService.desc}
        </p>

        {/* Link to service */}
        <div className="pt-1">
          <Link
            to={currentService.link}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#A78BFA] hover:text-white transition-colors group cursor-pointer"
          >
            <span>Explore {currentService.title}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
