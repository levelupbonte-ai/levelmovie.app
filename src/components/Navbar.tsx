import React, { useState, useEffect, useRef } from 'react';
import { Link } from './Link';
import ServicesMegaMenu from './ServicesMegaMenu';
import MobileServicesMenu from './MobileServicesMenu';

interface NavbarProps {
  currentPath?: string;
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

  // Mobile & Tablet Only: Smooth Apple Liquid Glass Scroll Engine
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = Math.max(0, window.scrollY);
          const isPhone = window.innerWidth < 768;
          const now = Date.now();

          if (!isPhone) {
            // NEVER float on tablet (>=768px) or desktop - stays natural full-width
            if (isFloatingRef.current) {
              isFloatingRef.current = false;
              setIsMobileFloating(false);
            }
          } else {
            const diff = currentY - prevScrollY.current;

            if (currentY <= 25) {
              // At the very top: immediately restore natural full-width
              if (isFloatingRef.current) {
                isFloatingRef.current = false;
                setIsMobileFloating(false);
              }
            } else if (diff < -2) {
              // Instant, fluid return to normal on ANY upward scroll gesture
              if (isFloatingRef.current) {
                isFloatingRef.current = false;
                setIsMobileFloating(false);
              }
            } else if (diff > 2 && currentY > 40) {
              // Scrolling DOWN: float into liquid glass capsule
              if (!isFloatingRef.current) {
                isFloatingRef.current = true;
                setIsMobileFloating(true);
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
        className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full pointer-events-none p-0 m-0"
        style={{
          viewTransitionName: 'nav',
        }}
      >
        {/*
          RESPONSIVE HEADER CAPSULE:
          - Flushed to top-0 with ZERO gap when normal (scrolled up or at top)
          - Transitions smoothly into an ultra-clean, frosted glass capsule when scrolling down
          - No fake white lines, no stripes: genuine deep tinted frosted glass with hairline subtle border
        */}
        <div
          className={`pointer-events-auto relative flex items-center transition-all duration-200 ease-out min-h-[58px] ${
            isMobileFloating
              ? 'w-[calc(100%-1.25rem)] sm:w-[calc(100%-2rem)] max-w-md sm:max-w-xl mx-auto mt-2 px-4 sm:px-6 py-2 rounded-full bg-[#0E0E1A]/85 backdrop-blur-xl border border-white/[0.12] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.8),0_0_20px_rgba(124,58,237,0.12)]'
              : 'w-full max-w-full mx-0 mt-0 px-4 sm:px-6 md:px-8 py-3.5 rounded-none bg-[#0B0B14]/95 backdrop-blur-md border border-transparent border-b-white/[0.08] shadow-none'
          } lg:w-full lg:max-w-full lg:mx-0 lg:mt-0 lg:px-8 lg:py-4 lg:rounded-none lg:bg-[#0B0B14]/95 lg:backdrop-blur-md lg:border-transparent lg:border-b-white/[0.08] lg:shadow-none`}
        >
          <div className="relative z-10 w-full flex items-center justify-between gap-3">
            {/* LOGO: stable height for zero jitter */}
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

            {/* DESKTOP & TABLET NAV (Standard, clean, generous on >= 768px) */}
            <div className="hidden md:flex items-center gap-3.5 lg:gap-5 xl:gap-8 shrink-0">
              <nav className="flex items-center gap-3.5 lg:gap-5 xl:gap-7 text-xs lg:text-sm font-medium">
                {/* Services Trigger with direct link to /services + mega-menu toggle/hover */}
                <div
                  className="relative flex items-center"
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <Link
                    to="/services"
                    onClick={() => setServicesDropdownOpen(false)}
                    className={`flex items-center gap-1 py-1 transition-colors whitespace-nowrap ${
                      isServicesActive()
                        ? 'text-white font-semibold'
                        : 'text-[#A1A1B5] hover:text-white'
                    }`}
                  >
                    <span>Services</span>
                    {isServicesActive() && (
                      <span className="absolute bottom-0 left-0 right-5 h-0.5 bg-[#7C3AED] rounded-full" />
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setServicesDropdownOpen((prev) => !prev);
                    }}
                    aria-label="Toggle services menu"
                    aria-expanded={servicesDropdownOpen}
                    aria-haspopup="true"
                    className="p-1 text-[#A78BFA] hover:text-white transition-colors cursor-pointer rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED]"
                  >
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
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
                className="px-4 lg:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white transition-all duration-200 hover:shadow-[0_0_18px_rgba(124,58,237,0.45)] active:scale-95 whitespace-nowrap shrink-0"
              >
                Get a free preview
              </Link>
            </div>

            {/* PHONE ACTIONS (< 768px) */}
            <div className="md:hidden flex items-center gap-2 sm:gap-3">
              <Link
                to="/preview"
                className="font-semibold rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white active:scale-95 whitespace-nowrap shrink-0 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm shadow-[0_0_12px_rgba(124,58,237,0.3)] transition-all"
              >
                Preview
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                className="p-2 text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-full hover:bg-white/[0.04] transition-colors"
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
          - Positioned absolute outside flow so it never creates an empty void below the navbar
          - Responsive width: phone (<640px) and tablet/iPad (640-1024px)
        */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 z-50 pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto visible'
              : 'opacity-0 -translate-y-2.5 scale-95 pointer-events-none select-none invisible'
          } w-[calc(100%-1.25rem)] sm:w-[calc(100%-2rem)] md:w-[calc(100%-2.5rem)] max-w-md sm:max-w-xl md:max-w-3xl mx-auto mt-2 rounded-2xl sm:rounded-3xl bg-[#0E0E1A]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain touch-pan-y`}
        >
          <div className="p-4 sm:p-6 pb-6 space-y-4">
            <div className="flex flex-col space-y-1 text-sm font-semibold text-slate-200">
              {/* Dedicated Mobile Services Interface with its own direct link and code */}
              <MobileServicesMenu
                isOpen={mobileServicesOpen}
                onToggle={() => setMobileServicesOpen((prev) => !prev)}
                onClose={() => setMobileMenuOpen(false)}
                isServicesActive={isServicesActive()}
                currentPath={path}
              />

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

        {/* DESKTOP SERVICES MEGA-MENU: DEDICATED COMPONENT & CLEAN ARCHITECTURE */}
        <ServicesMegaMenu
          isOpen={servicesDropdownOpen}
          onClose={() => setServicesDropdownOpen(false)}
          onMouseEnter={handleServicesMouseEnter}
          onMouseLeave={handleServicesMouseLeave}
        />
      </header>
    </>
  );
}
