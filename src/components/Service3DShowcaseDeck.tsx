import React, { useState, useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Cycle forward automatically
  useEffect(() => {
    if (isHovered || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SERVICES.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [isHovered, prefersReducedMotion]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SERVICES.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const count = SERVICES.length;
  const currentService = SERVICES[activeIndex];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="3D Interactive Services Showcase"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-[520px] mx-auto select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED]"
    >
      {/* Soft ambient purple glow behind floating 3D trio */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[300px] bg-[#7C3AED]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* 3D Trio Floating Stage (NO background cards, completely à découvert) */}
      <div
        className="relative h-[240px] sm:h-[270px] w-full flex items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        {SERVICES.map((item, idx) => {
          let offset = (idx - activeIndex + count) % count;
          if (offset > count / 2) {
            offset -= count;
          }

          const isCenter = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;
          const isVisible = isCenter || isLeft || isRight;

          if (!isVisible) {
            return (
              <div
                key={item.id}
                aria-hidden="true"
                className="absolute opacity-0 pointer-events-none"
                style={{
                  transform: 'scale(0.5) translateZ(-150px)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            );
          }

          let transformStyle = '';
          let zIndex = 10;
          let opacity = 0.4;
          let sizeClass = 'w-24 h-24 sm:w-28 sm:h-28';

          if (isCenter) {
            // Front active object: Zoomed forward, large, floating à découvert
            transformStyle = 'translateX(0) scale(1.22) translateZ(80px) rotateY(0deg)';
            zIndex = 30;
            opacity = 1;
            sizeClass = 'w-36 h-36 sm:w-44 sm:h-44';
          } else if (isLeft) {
            // Flanking left in 3D perspective
            transformStyle = 'translateX(-120px) sm:translateX(-145px) scale(0.78) translateZ(-50px) rotateY(22deg)';
            zIndex = 20;
            opacity = 0.45;
          } else if (isRight) {
            // Flanking right in 3D perspective
            transformStyle = 'translateX(120px) sm:translateX(145px) scale(0.78) translateZ(-50px) rotateY(-22deg)';
            zIndex = 20;
            opacity = 0.45;
          }

          return (
            <div
              key={item.id}
              onClick={() => {
                if (!isCenter) setActiveIndex(idx);
              }}
              className={`absolute flex items-center justify-center transition-all duration-600 ease-out will-change-transform ${
                isCenter ? 'cursor-default' : 'cursor-pointer hover:opacity-80'
              }`}
              style={{
                transform: transformStyle,
                zIndex,
                opacity,
                transformStyle: 'preserve-3d',
              }}
              title={!isCenter ? `View ${item.title}` : undefined}
            >
              {/* Pure 3D Image floating without any card or box container */}
              <picture className={`${sizeClass} flex items-center justify-center relative select-none float-gentle`}>
                <source srcSet={`/assets/img/icons/${item.iconName}.avif`} type="image/avif" />
                <source srcSet={`/assets/img/icons/${item.iconName}.webp`} type="image/webp" />
                <img
                  src={`/assets/img/icons/${item.iconName}.png`}
                  alt={item.alt}
                  width="176"
                  height="176"
                  className={`w-full h-full object-contain filter transition-all duration-500 ${
                    isCenter
                      ? 'drop-shadow-[0_16px_30px_rgba(124,58,237,0.55)]'
                      : 'drop-shadow-[0_6px_14px_rgba(0,0,0,0.7)]'
                  }`}
                />
              </picture>
            </div>
          );
        })}
      </div>

      {/* Product Details Section: Clean typography directly on dark canvas (No black box/card) */}
      <div className="pt-2 text-center space-y-2.5 max-w-md mx-auto">
        {/* Category tag & highlight */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
            {currentService.tag}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-[11px] text-[#10B981] font-semibold">
            {currentService.highlight}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {currentService.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#A1A1B5] leading-relaxed max-w-sm mx-auto">
          {currentService.desc}
        </p>

        {/* Link to service */}
        <div className="pt-1.5">
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
