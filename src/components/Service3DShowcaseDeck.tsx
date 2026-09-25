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

  const currentService = SERVICES[activeIndex];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="3D Interactive Service Showcase"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-[460px] mx-auto select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED]"
    >
      {/* Soft ambient purple glow behind the big 3D asset */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[320px] bg-[#7C3AED]/20 rounded-full blur-[110px] pointer-events-none" />

      {/* Grand 3D Product Stage: ONLY the big 3D asset zooming forward, pure and uncovered */}
      <div
        className="relative h-[250px] sm:h-[290px] w-full flex items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        {SERVICES.map((item, idx) => {
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={item.id}
              className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out will-change-[transform,opacity]"
              style={{
                opacity: isCurrent ? 1 : 0,
                transform: isCurrent
                  ? 'scale(1.18) translateZ(60px) rotateY(0deg)'
                  : 'scale(0.85) translateZ(-80px) rotateY(12deg)',
                pointerEvents: isCurrent ? 'auto' : 'none',
              }}
            >
              {/* Grand 3D Product Asset: Large, borderless, no background box */}
              <picture className="w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center relative select-none float-gentle">
                <source srcSet={`/assets/img/icons/${item.iconName}.avif`} type="image/avif" />
                <source srcSet={`/assets/img/icons/${item.iconName}.webp`} type="image/webp" />
                <img
                  src={`/assets/img/icons/${item.iconName}.png`}
                  alt={item.alt}
                  width="224"
                  height="224"
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(124,58,237,0.55)]"
                />
              </picture>
            </div>
          );
        })}
      </div>

      {/* Product Details Section: Clean typography directly on dark canvas */}
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
