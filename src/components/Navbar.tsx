import React, { useState, useEffect, useRef } from 'react';
import { Link } from './Link';

interface NavbarProps {
  currentPath?: string;
}

interface ServiceSubmenuItem {
  label: string;
  desc: string;
  path: string;
  tag: string;
  iconName: string;
}

export default function Navbar({ currentPath }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [path, setPath] = useState(currentPath || '');
  const [isMobileFloating, setIsMobileFloating] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ticking = useRef(false);
  
  // Anti-loop hysteresis state refs
  const prevScrollY = useRef(0);
  const accumulatedScrollUp = useRef(0);
  const lastToggleTime = useRef(0);
  const isFloatingRef = useRef(false);

  const handleServicesMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setServicesDropdownOpen(true);
  };

  const handleServicesMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 240);
  };

  useEffect(() => {
    if (!currentPath && typeof window !== 'undefined') {
      setPath(window.location.pathname);
    } else if (currentPath) {
      setPath(currentPath);
    }
  }, [currentPath]);

  // Mobile & Tablet Only: Anti-oscillation iOS 26 Glass Bubble Scroll Engine
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = Math.max(0, window.scrollY);
          const isTouchOrTablet = window.innerWidth < 1024;
          const now = Date.now();

          if (!isTouchOrTablet) {
            // NEVER float on desktop (>=1024px)
            if (isFloatingRef.current) {
              isFloatingRef.current = false;
              setIsMobileFloating(false);
            }
          } else {
            const diff = currentY - prevScrollY.current;
            const timeSinceToggle = now - lastToggleTime.current;

            // Cooldown of 200ms to physically prevent infinite oscillation loops
            const canToggle = timeSinceToggle > 200;

            if (currentY <= 25) {
              // Reached top of page: always restore natural full-width navbar
              if (isFloatingRef.current && canToggle) {
                isFloatingRef.current = false;
                setIsMobileFloating(false);
                lastToggleTime.current = now;
                accumulatedScrollUp.current = 0;
              }
            } else if (diff > 0) {
              // Scrolling DOWN: reset upward accumulation
              accumulatedScrollUp.current = 0;

              // Only float if past threshold and scrolling down
              if (!isFloatingRef.current && currentY > 55 && canToggle) {
                isFloatingRef.current = true;
                setIsMobileFloating(true);
                lastToggleTime.current = now;
              }
            } else if (diff < 0) {
              // Scrolling UP: accumulate continuous upward movement
              accumulatedScrollUp.current += Math.abs(diff);

              // Require deliberate scroll-up intent (at least 28px) to unfloat
              if (isFloatingRef.current && accumulatedScrollUp.current > 28 && canToggle) {
                isFloatingRef.current = false;
                setIsMobileFloating(false);
                lastToggleTime.current = now;
                accumulatedScrollUp.current = 0;
              }
            }
          }

          prevScrollY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setServicesDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const serviceItems: ServiceSubmenuItem[] = [
    {
      label: 'Barbershop Websites',
      desc: '24/7 chair booking, barber rosters & Google Maps local ranking.',
      path: '/websites-for/barbershops',
      tag: 'Chairs & Grooming',
      iconName: 'barbershop',
    },
    {
      label: 'Salon & Beauty Websites',
      desc: 'Stylist portfolios, tiered service menus & multi-service booking.',
      path: '/websites-for/salons',
      tag: 'Hair & Esthetics',
      iconName: 'salon',
    },
    {
      label: 'Creator Websites',
      desc: 'Independent link-in-bio hub, live collaboration media kit & newsletter.',
      path: '/services/creator-websites',
      tag: 'Creator Economy',
      iconName: 'creators',
    },
    {
      label: 'Small Online Stores',
      desc: 'Fast checkout for merch, products & digital downloads without platform fees.',
      path: '/services/online-stores',
      tag: 'Lean E-Commerce',
      iconName: 'store',
    },
    {
      label: 'Portfolio Websites',
      desc: 'High-resolution showcases with sub-second page loads on your domain.',
      path: '/services/portfolio-websites',
      tag: 'Visual Showcases',
      iconName: 'portfolio',
    },
    {
      label: 'Website Security Check',
      desc: 'Plain-English technical audit of database rules, HTTPS & exposed keys.',
      path: '/services/security-check',
      tag: 'Vulnerability Audit',
      iconName: 'security',
    },
    {
      label: 'Local Business Sites',
      desc: 'Google Business Profile sync, neighborhood rankings & online booking.',
      path: '/services/local-business-websites',
      tag: 'Local Operations',
      iconName: 'booking',
    },
    {
      label: 'Website Care Plans',
      desc: 'Fast cloud hosting, daily backups & on-demand monthly updates.',
      path: '/services/care-plans',
      tag: 'Maintenance & Care',
      iconName: 'care',
    },
  ];

  const standardNavLinks = [
    { label: 'Projects', path: '/projects' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'How we build', path: '/process' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isServicesActive = () => {
    const cleanPath = path.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
    return cleanPath.startsWith('/services') || cleanPath.startsWith('/websites-for');
  };

  const isActive = (targetPath: string) => {
    const cleanPath = path.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
    const cleanTarget = targetPath.replace(/\/$/, '') || '/';
    return cleanPath === cleanTarget;
  };

  return (
    <>
      {/* Backdrop overlay for mobile menu */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full pointer-events-none transition-all duration-300"
        style={{
          paddingTop: 'max(0.25rem, env(safe-area-inset-top, 0px))',
          viewTransitionName: 'nav',
        }}
      >
        {/*
          RESPONSIVE HEADER CAPSULE:
          - Keeps height stable (min-h-[56px]) so layout never jumps or triggers infinite zoom/scroll loops.
          - Mobile Phone (<640px): w-[calc(100%-1.25rem)] max-w-md
          - Small Tablet / Large Phone (640-768px): sm:w-[calc(100%-2rem)] sm:max-w-xl
          - Tablet / iPad (768-1024px): md:w-[calc(100%-2.5rem)] md:max-w-3xl (generous width, no truncated look)
          - Desktop (1024px+): ALWAYS standard natural full-width navbar
        */}
        <div
          className={`pointer-events-auto relative transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] min-h-[56px] flex items-center ${
            isMobileFloating
              ? 'w-[calc(100%-1.25rem)] sm:w-[calc(100%-2rem)] md:w-[calc(100%-2.5rem)] max-w-md sm:max-w-xl md:max-w-3xl mx-auto mt-2 px-4 sm:px-6 py-2 rounded-full bg-[#0D0D18]/80 backdrop-blur-2xl border border-white/[0.22] shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.45),0_14px_36px_-6px_rgba(0,0,0,0.85),0_0_24px_rgba(124,58,237,0.18)]'
              : 'w-full max-w-full px-4 sm:px-6 md:px-8 py-3 mt-0 rounded-none bg-[#0B0B14]/90 backdrop-blur-md border-b border-white/[0.08] shadow-none'
          } lg:w-full lg:max-w-full lg:mt-0 lg:px-8 lg:py-4 lg:rounded-none lg:bg-[#0B0B14]/90 lg:backdrop-blur-md lg:border-b lg:border-white/[0.08] lg:shadow-none`}
        >
          {/* iOS 26 Glass Specular Top Highlight (Mobile/Tablet Floating only) */}
          {isMobileFloating && (
            <>
              <div
                className="lg:hidden absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="lg:hidden absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.1] to-transparent pointer-events-none"
                aria-hidden="true"
              />
            </>
          )}

          <div className="relative z-10 w-full flex items-center justify-between gap-3">
            {/* LOGO: constant stable height to eliminate any zoom/dezoom flickering */}
            <div className="shrink-0 flex items-center">
              <Link to="/" className="flex items-center group">
                <img
                  src="/levelup-logo.svg"
                  alt="LevelUp Ecosystem"
                  className="w-auto select-none transition-transform duration-200 group-hover:scale-[1.02] h-7 sm:h-8"
                  width="150"
                  height="32"
                />
              </Link>
            </div>

            {/* DESKTOP NAV (Standard, clean, generous on >= 1024px) */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-8 shrink-0">
              <nav className="flex items-center gap-5 xl:gap-7 text-sm font-medium">
                {/* Services Trigger */}
                <div
                  className="relative"
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => setServicesDropdownOpen((prev) => !prev)}
                    aria-expanded={servicesDropdownOpen}
                    aria-haspopup="true"
                    className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-md ${
                      isServicesActive() || servicesDropdownOpen
                        ? 'text-white font-semibold'
                        : 'text-[#A1A1B5] hover:text-white'
                    }`}
                  >
                    <span>Services</span>
                    <svg
                      className={`w-3.5 h-3.5 text-[#A78BFA] transition-transform duration-300 ${
                        servicesDropdownOpen ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                    {isServicesActive() && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
                    )}
                  </button>
                </div>

                {/* Standard Nav Links */}
                {standardNavLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setServicesDropdownOpen(false)}
                      className={`relative py-1 transition-colors whitespace-nowrap ${
                        active ? 'text-white font-semibold' : 'text-[#A1A1B5] hover:text-white'
                      }`}
                    >
                      {link.label}
                      {active && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <Link
                to="/preview"
                onClick={() => setServicesDropdownOpen(false)}
                className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white transition-all duration-200 hover:shadow-[0_0_18px_rgba(124,58,237,0.45)] active:scale-95 whitespace-nowrap shrink-0"
              >
                Get a free preview
              </Link>
            </div>

            {/* MOBILE & TABLET ACTIONS */}
            <div className="lg:hidden flex items-center gap-2 sm:gap-3">
              <Link
                to="/preview"
                className="font-semibold rounded-full bg-[#7C3AED] text-white active:scale-95 whitespace-nowrap shrink-0 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm shadow-[0_0_12px_rgba(124,58,237,0.35)] transition-all"
              >
                Preview
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                className="p-2 text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-full"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span
                    className={`block h-0.5 w-5 bg-white transition-transform duration-300 ease-out origin-center ${
                      mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 bg-white transition-opacity duration-200 ${
                      mobileMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 bg-white transition-transform duration-300 ease-out origin-center ${
                      mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/*
          MOBILE & TABLET LIQUID GLASS MENU:
          - Pure GPU-composited transform & opacity transition: zero layout recalculations or glitches
          - Scales perfectly for Phone (<640px) and Tablet/iPad (640-1024px)
        */}
        <div
          className={`lg:hidden pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-3 scale-95 pointer-events-none select-none'
          } w-[calc(100%-1.25rem)] sm:w-[calc(100%-2rem)] md:w-[calc(100%-2.5rem)] max-w-md sm:max-w-xl md:max-w-3xl mx-auto mt-2 rounded-3xl bg-[#0D0D18]/95 backdrop-blur-2xl border border-white/[0.18] shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.35),0_20px_50px_rgba(0,0,0,0.92),0_0_24px_rgba(124,58,237,0.18)] overflow-hidden`}
        >
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col space-y-1 text-sm font-semibold text-slate-200">
              {/* Services Accordion on Mobile / Tablet */}
              <div className="border-b border-white/[0.08] pb-2 mb-1">
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((prev) => !prev)}
                  aria-expanded={mobileServicesOpen}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-left text-[#A1A1B5] hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <span className={isServicesActive() ? 'text-white font-bold' : ''}>Services</span>
                  <svg
                    className={`w-4 h-4 text-[#A78BFA] transition-transform duration-250 ease-out ${
                      mobileServicesOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Submenu Accordion Container */}
                {mobileServicesOpen && (
                  <div className="pl-3 pr-1 py-1 space-y-1 animate-in fade-in duration-200">
                    <Link
                      to="/services"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-3 text-xs font-bold text-[#A78BFA] hover:text-white"
                    >
                      All Services Overview →
                    </Link>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {serviceItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-xs transition-colors ${
                            isActive(item.path)
                              ? 'bg-white/[0.08] text-white font-bold'
                              : 'text-[#A1A1B5] hover:bg-white/[0.04] hover:text-white'
                          }`}
                        >
                          <div className="w-5 h-5 shrink-0 rounded-md bg-[#14141F] border border-white/[0.08] p-0.5 flex items-center justify-center">
                            <img
                              src={`/assets/img/icons/${item.iconName}.png`}
                              alt=""
                              width="16"
                              height="16"
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          </div>
                          <span className="truncate">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Standard Nav Links in mobile/tablet drawer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                {standardNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-left py-2.5 px-3 rounded-xl transition-colors ${
                      isActive(link.path)
                        ? 'bg-white/[0.08] text-white'
                        : 'text-[#A1A1B5] hover:bg-white/[0.05]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Action CTA in drawer */}
            <div className="pt-2 border-t border-white/[0.08]">
              <Link
                to="/preview"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-xs sm:text-sm text-center cursor-pointer shadow-md shadow-[#7C3AED]/25 transition-all whitespace-nowrap"
              >
                Get a free preview
              </Link>
            </div>
          </div>
        </div>

        {/* DESKTOP SERVICES MEGA-MENU: ALWAYS CLEAN & STANDARD UNDER THE DESKTOP HEADER */}
        {servicesDropdownOpen && (
          <div
            role="menu"
            aria-orientation="vertical"
            onMouseEnter={() => {
              if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
            }}
            onMouseLeave={handleServicesMouseLeave}
            className="pointer-events-auto hidden lg:block w-full bg-[#0B0B14]/98 backdrop-blur-2xl border-t border-b border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.95)] animate-in fade-in slide-in-from-top-1 duration-200 text-left"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8 space-y-8">
              {/* 3 Clean Typographic Columns */}
              <div className="grid grid-cols-3 gap-10 xl:gap-14">
                {/* Column 1: CRÉATION */}
                <div className="space-y-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#DDD6FE] pb-2 border-b border-white/[0.12] flex items-center justify-between">
                    <span>CRÉATION &amp; SHOWCASE</span>
                    <span className="text-[10px] text-[#71717A] font-mono">01</span>
                  </div>
                  <div className="space-y-5">
                    <Link
                      to="/services/portfolio-websites"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="group block space-y-1"
                    >
                      <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                        <span>Portfolio Websites</span>
                        <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                      </h4>
                      <p className="text-xs text-[#A1A1B5] leading-relaxed">
                        Clean, high-resolution visual showcases with sub-second load times on your domain.
                      </p>
                    </Link>

                    <Link
                      to="/services/creator-websites"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="group block space-y-1"
                    >
                      <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                        <span>Creator Websites</span>
                        <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                      </h4>
                      <p className="text-xs text-[#A1A1B5] leading-relaxed">
                        Independent link-in-bio hub, brand collaboration media kit, and direct fan contact.
                      </p>
                    </Link>

                    <Link
                      to="/projects"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="group block space-y-1"
                    >
                      <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                        <span>Work &amp; Examples Showcase</span>
                        <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                      </h4>
                      <p className="text-xs text-[#A1A1B5] leading-relaxed">
                        Explore live client deployments and concept prototypes built with speed and security.
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 2: BUSINESS */}
                <div className="space-y-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#DDD6FE] pb-2 border-b border-white/[0.12] flex items-center justify-between">
                    <span>BUSINESS &amp; BOOKING</span>
                    <span className="text-[10px] text-[#71717A] font-mono">02</span>
                  </div>
                  <div className="space-y-5">
                    <Link
                      to="/websites-for/barbershops"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="group block space-y-1"
                    >
                      <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                        <span>Barbershop Websites</span>
                        <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                      </h4>
                      <p className="text-xs text-[#A1A1B5] leading-relaxed">
                        24/7 chair booking, barber profiles, and Google Calendar real-time sync.
                      </p>
                    </Link>

                    <Link
                      to="/websites-for/salons"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="group block space-y-1"
                    >
                      <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                        <span>Salon &amp; Beauty Websites</span>
                        <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                      </h4>
                      <p className="text-xs text-[#A1A1B5] leading-relaxed">
                        Stylist portfolios, tiered service menus, and multi-service appointment scheduling.
                      </p>
                    </Link>

                    <Link
                      to="/services/online-stores"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="group block space-y-1"
                    >
                      <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                        <span>Small Online Stores</span>
                        <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                      </h4>
                      <p className="text-xs text-[#A1A1B5] leading-relaxed">
                        Fast, lightweight checkout for products, merch, and digital downloads without platform lock-in.
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 3: OPERATIONS & MAINTENANCE */}
                <div className="space-y-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#DDD6FE] pb-2 border-b border-white/[0.12] flex items-center justify-between">
                    <span>CARE &amp; PROTECTION</span>
                    <span className="text-[10px] text-[#71717A] font-mono">03</span>
                  </div>
                  <div className="space-y-5">
                    <Link
                      to="/services/care-plans"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="group block space-y-1"
                    >
                      <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                        <span>Website Care Plans</span>
                        <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                      </h4>
                      <p className="text-xs text-[#A1A1B5] leading-relaxed">
                        Cloud hosting, daily automated backups, uptime monitoring, and fast on-demand edits.
                      </p>
                    </Link>

                    <Link
                      to="/services/security-check"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="group block space-y-1"
                    >
                      <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                        <span>Website Security Check</span>
                        <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                      </h4>
                      <p className="text-xs text-[#A1A1B5] leading-relaxed">
                        Plain-English audit of database rules, CSP headers, exposed keys, and account hygiene.
                      </p>
                    </Link>

                    <Link
                      to="/services"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="group block space-y-1"
                    >
                      <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                        <span>All Services Overview</span>
                        <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                      </h4>
                      <p className="text-xs text-[#A1A1B5] leading-relaxed">
                        Compare website packages, pricing tiers, and launch timelines for your project.
                      </p>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Strip: ESSENTIALS */}
              <div className="pt-5 border-t border-white/[0.1] flex flex-wrap items-center justify-between gap-4 text-xs text-[#A1A1B5]">
                <div className="flex items-center gap-6">
                  <span className="font-semibold text-white">Security-First:</span>
                  <span>Strict CSP Headers</span>
                  <span>•</span>
                  <span>Deny-by-default rules</span>
                  <span>•</span>
                  <span>Zero client secrets</span>
                </div>
                <Link
                  to="/security"
                  onClick={() => setServicesDropdownOpen(false)}
                  className="text-[#A78BFA] hover:text-white font-medium transition-colors flex items-center gap-1"
                >
                  <span>Read our security architecture</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
