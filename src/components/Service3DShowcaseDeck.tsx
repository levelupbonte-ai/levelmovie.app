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
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isAnimatingText, setIsAnimatingText] = useState(false);

  // Swipe tracking
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
    setIsAnimatingText(true);
    setActiveIndex(nextIdx);
    setTimeout(() => {
      setIsAnimatingText(false);
    }, 280);
  }, []);

  const handleNext = useCallback(() => {
    triggerChange((activeIndex + 1) % total);
  }, [activeIndex, total, triggerChange]);

  const handlePrev = useCallback(() => {
    triggerChange((activeIndex - 1 + total) % total);
  }, [activeIndex, total, triggerChange]);

  // Gentle auto-rotation
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
   * Conflict-Free Trio Calculation:
   * To prevent any polygonal intersection clipping or overlapping during animation:
   * 1. No preserve-3d on parent (elements are rendered in clean discrete Z-stacking layers).
   * 2. Clear horizontal separation (sm: 210px between centers; element width is <= 160px, so at least 50px clearance at all times).
   * 3. Offstage items don't animate across the screen when modulo wraps.
   */
  const getPositionData = (index: number) => {
    let diff = (index - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      // CENTER ACTIVE: Zoomed forward in the foreground, 100% clarity
      return {
        transform: 'translateX(0px) scale(1) rotateY(0deg)',
        opacity: 1,
        zIndex: 30,
        pointer: 'cursor-default',
        isClickable: false,
        visible: true,
      };
    } else if (diff === -1) {
      // LEFT FLANK: In the depth background, cleanly separated on the left
      return {
        transform: 'translateX(-135px) sm:translateX(-195px) scale(0.68) rotateY(16deg)',
        opacity: 0.5,
        zIndex: 15,
        pointer: 'cursor-pointer hover:opacity-85',
        isClickable: true,
        action: handlePrev,
        visible: true,
      };
    } else if (diff === 1) {
      // RIGHT FLANK: In the depth background, cleanly separated on the right
      return {
        transform: 'translateX(135px) sm:translateX(195px) scale(0.68) rotateY(-16deg)',
        opacity: 0.55,
        zIndex: 15,
        pointer: 'cursor-pointer hover:opacity-85',
        isClickable: true,
        action: handleNext,
        visible: true,
      };
    } else if (diff === 2) {
      // VISIBLE IN THE DISTANCE: The upcoming product queued up in line (seen from afar)
      return {
        transform: 'translateX(225px) sm:translateX(320px) scale(0.44) rotateY(-24deg)',
        opacity: 0.28,
        zIndex: 6,
        pointer: 'cursor-pointer hover:opacity-50',
        isClickable: true,
        action: handleNext,
        visible: true,
      };
    } else if (diff === -2) {
      // In the distance on the left (retreating product)
      return {
        transform: 'translateX(-225px) sm:translateX(-320px) scale(0.44) rotateY(24deg)',
        opacity: 0.18,
        zIndex: 6,
        pointer: 'cursor-pointer hover:opacity-40',
        isClickable: true,
        action: handlePrev,
        visible: true,
      };
    } else if (diff === 3) {
      // Entering offstage
      return {
        transform: 'translateX(300px) sm:translateX(420px) scale(0.25) rotateY(-30deg)',
        opacity: 0,
        zIndex: 1,
        pointer: 'pointer-events-none',
        isClickable: false,
        visible: false,
      };
    } else {
      // Offstage left or hidden
      return {
        transform: 'translateX(-300px) sm:translateX(-420px) scale(0.25) rotateY(30deg)',
        opacity: 0,
        zIndex: 1,
        pointer: 'pointer-events-none',
        isClickable: false,
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
      className="relative w-full max-w-[560px] sm:max-w-[620px] mx-auto select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED]"
    >
      {/* 3D Queue Stage: Clean layered depth so items never collide or intersect, with upcoming product visible in the distance */}
      <div
        className="relative h-[250px] sm:h-[290px] w-full flex items-center justify-center overflow-visible touch-pan-y"
        style={{ perspective: '1100px' }}
      >
        {SERVICES.map((item, idx) => {
          const pos = getPositionData(idx);

          return (
            <div
              key={item.id}
              onClick={() => {
                if (pos.isClickable && pos.action) {
                  pos.action();
                }
              }}
              title={pos.isClickable ? `View ${item.title}` : item.title}
              className={`absolute flex items-center justify-center will-change-[transform,opacity] transition-all duration-600 ease-[cubic-bezier(0.2,0.85,0.25,1)] ${pos.pointer}`}
              style={{
                transform: pos.transform,
                opacity: pos.opacity,
                zIndex: pos.zIndex,
                visibility: pos.visible || pos.opacity > 0 ? 'visible' : 'hidden',
              }}
            >
              {/* Authentic crystal-clear 3D image */}
              <div className="w-32 h-32 sm:w-44 sm:h-44 relative flex items-center justify-center select-none pointer-events-none">
                <picture className="w-full h-full flex items-center justify-center">
                  <source srcSet={`/assets/img/icons/${item.iconName}.avif`} type="image/avif" />
                  <source srcSet={`/assets/img/icons/${item.iconName}.webp`} type="image/webp" />
                  <img
                    src={`/assets/img/icons/${item.iconName}.png`}
                    alt={item.alt}
                    width="192"
                    height="192"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.55)]"
                  />
                </picture>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Details Section: Clean typography right below the front item */}
      <div
        className={`pt-2 text-center space-y-2 max-w-md mx-auto transition-opacity duration-300 ${
          isAnimatingText ? 'opacity-40' : 'opacity-100'
        }`}
      >
        {/* Category tag & highlight */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
            {currentService.tag}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-[11px] text-[#10B981] font-semibold">
            {currentService.highlight}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {currentService.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed max-w-sm mx-auto min-h-[44px]">
          {currentService.desc}
        </p>

        {/* Link to service */}
        <div className="pt-1">
          <Link
            to={currentService.link}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#A78BFA] hover:text-white transition-colors group cursor-pointer"
          >
            <span>Explore {currentService.title}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
