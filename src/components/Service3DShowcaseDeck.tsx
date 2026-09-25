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
    alt: '3D faceted barbershop scissors and comb icon',
    link: '/websites-for/barbershops',
    highlight: '+40% Appointments',
  },
  {
    id: 'salons',
    tag: 'Hair & Esthetics',
    title: 'Salon & Beauty Websites',
    desc: 'Stylist portfolio showcases, transparent service tier pricing, and automated multi-service scheduling.',
    iconName: 'salon',
    alt: '3D faceted salon hairdryer and mirror icon',
    link: '/websites-for/salons',
    highlight: 'Stylist Rosters',
  },
  {
    id: 'creators',
    tag: 'Creator Economy',
    title: 'Creator Websites',
    desc: 'Own your audience. Branded link-in-bio hub, live collaboration media kit, and direct newsletter capture.',
    iconName: 'creators',
    alt: '3D faceted creator camera and play button icon',
    link: '/services/creator-websites',
    highlight: 'Custom Domain',
  },
  {
    id: 'store',
    tag: 'Lean E-Commerce',
    title: 'Small Online Stores',
    desc: 'Fast checkout for merch, physical products, and instant digital downloads without high monthly platform fees.',
    iconName: 'store',
    alt: '3D faceted shopping bag store icon',
    link: '/services/online-stores',
    highlight: 'Zero Monthly Bloat',
  },
  {
    id: 'portfolio',
    tag: 'Visual Showcases',
    title: 'Portfolio Websites',
    desc: 'Clean, high-resolution project showcases with sub-second page loads for designers, photographers & pros.',
    iconName: 'portfolio',
    alt: '3D faceted portfolio gallery frame icon',
    link: '/services/portfolio-websites',
    highlight: '< 1s Load Speed',
  },
  {
    id: 'security',
    tag: 'Technical Hardening',
    title: 'Website Security Check',
    desc: 'Plain-English technical review of your database rules, HTTPS, exposed API keys, and account protection.',
    iconName: 'security',
    alt: '3D faceted protective shield and padlock icon',
    link: '/services/security-check',
    highlight: 'Vulnerability Audit',
  },
  {
    id: 'booking',
    tag: 'Local Operations',
    title: 'Online Booking System',
    desc: 'Calendar synchronization, automated SMS/email reminders, and seamless customer self-scheduling 24/7.',
    iconName: 'booking',
    alt: '3D faceted appointment booking calendar icon',
    link: '/services/local-business-websites',
    highlight: '24/7 Self-Serve',
  },
  {
    id: 'care',
    tag: 'Maintenance & Care',
    title: 'Website Care Plans',
    desc: 'Fast cloud hosting, automated daily backups, security monitoring, and on-demand monthly content updates.',
    iconName: 'care',
    alt: '3D faceted wrench and heart care icon',
    link: '/services/care-plans',
    highlight: 'Worry-Free Support',
  },
];

export default function Service3DShowcaseDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Swipe gesture tracking (touch & mouse)
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

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Gentle auto-rotation (pauses when user hovers or interacts)
  useEffect(() => {
    if (isHovered || prefersReducedMotion) return;

    const timer = setInterval(() => {
      handleNext();
    }, 3800);

    return () => clearInterval(timer);
  }, [isHovered, prefersReducedMotion, handleNext]);

  // Touch Swipe for mobile (swiping with fingers)
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

      // Only register horizontal swipe if movement is predominantly horizontal
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
        if (diffX > 0) {
          handleNext(); // Finger swiped left -> next product zooms in
        } else {
          handlePrev(); // Finger swiped right -> previous product zooms in
        }
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchEndXRef.current = null;
    setTimeout(() => setIsHovered(false), 2200);
  };

  // Mouse Drag Swipe for PC
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
      if (diff > 40) {
        handleNext();
      } else if (diff < -40) {
        handlePrev();
      }
    }
    isDraggingRef.current = false;
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    }
  };

  const currentService = SERVICES[activeIndex];

  // Calculate circular distance to render full continuous trio carousel
  const getPositionData = (index: number) => {
    let diff = (index - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      // CENTER: Zoomed forward towards the user, 100% opacity, front-stage
      return {
        style: 'translateX(0px) scale(1.24) translateZ(80px) rotateY(0deg)',
        opacity: 1,
        zIndex: 30,
        pointer: 'cursor-grab',
        isClickable: false,
      };
    } else if (diff === -1) {
      // LEFT FLANK: Angled inwards, pushed back into perspective, preparing to leave or be pulled
      return {
        style: 'translateX(-125px) sm:translateX(-175px) scale(0.72) translateZ(-80px) rotateY(26deg)',
        opacity: 0.42,
        zIndex: 15,
        pointer: 'cursor-pointer hover:opacity-75',
        isClickable: true,
        action: handlePrev,
      };
    } else if (diff === 1) {
      // RIGHT FLANK: Angled inwards, pushed back into perspective, next in line
      return {
        style: 'translateX(125px) sm:translateX(175px) scale(0.72) translateZ(-80px) rotateY(-26deg)',
        opacity: 0.42,
        zIndex: 15,
        pointer: 'cursor-pointer hover:opacity-75',
        isClickable: true,
        action: handleNext,
      };
    } else if (diff < -1) {
      // Far left in hidden queue
      return {
        style: 'translateX(-260px) scale(0.38) translateZ(-160px) rotateY(35deg)',
        opacity: 0,
        zIndex: 5,
        pointer: 'pointer-events-none',
        isClickable: false,
      };
    } else {
      // Far right in hidden queue
      return {
        style: 'translateX(260px) scale(0.38) translateZ(-160px) rotateY(-35deg)',
        opacity: 0,
        zIndex: 5,
        pointer: 'pointer-events-none',
        isClickable: false,
      };
    }
  };

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="3D Trio Product Carousel"
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
      className="relative w-full max-w-[520px] mx-auto select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED]"
    >
      {/* 3D Trio Stage: One steps aside, next zooms forward */}
      <div
        className="relative h-[250px] sm:h-[290px] w-full flex items-center justify-center overflow-visible touch-pan-y"
        style={{ perspective: '1100px', transformStyle: 'preserve-3d' }}
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
              className={`absolute flex items-center justify-center will-change-[transform,opacity] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${pos.pointer}`}
              style={{
                transform: pos.style,
                opacity: pos.opacity,
                zIndex: pos.zIndex,
              }}
            >
              {/* Clean, professional 3D product icon without artificial halos */}
              <div className="w-36 h-36 sm:w-48 sm:h-48 relative flex items-center justify-center select-none pointer-events-none">
                <picture className="w-full h-full flex items-center justify-center">
                  <source srcSet={`/assets/img/icons/${item.iconName}.avif`} type="image/avif" />
                  <source srcSet={`/assets/img/icons/${item.iconName}.webp`} type="image/webp" />
                  <img
                    src={`/assets/img/icons/${item.iconName}.png`}
                    alt={item.alt}
                    width="192"
                    height="192"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.65)]"
                  />
                </picture>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Details Section: Dynamic title, tag & description matching the front item */}
      <div className="pt-2 text-center space-y-2 max-w-md mx-auto">
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

        {/* Subtle dot indicators */}
        <div className="flex items-center justify-center gap-1.5 pt-3">
          {SERVICES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to ${s.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? 'w-6 bg-[#7C3AED]'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
