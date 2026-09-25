import React, { useState, useEffect, useRef } from 'react';
import { Link } from './Link';

interface NavbarProps {
  currentPath?: string;
}

interface ServiceSubmenuItem {
  label: string;
  desc: string;
  path: string;
  iconName: string;
  tag: string;
}

export default function Navbar({ currentPath }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [path, setPath] = useState(currentPath || '');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (!currentPath && typeof window !== 'undefined') {
      setPath(window.location.pathname);
    } else if (currentPath) {
      setPath(currentPath);
    }
  }, [currentPath]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsScrolled(currentY > 20);

          if (window.innerWidth < 1024) {
            if (currentY > 70 && currentY > lastScrollY.current + 5) {
              setIsVisible(false);
            } else if (currentY < lastScrollY.current - 5 || currentY <= 50) {
              setIsVisible(true);
            }
          } else {
            setIsVisible(true);
          }

          lastScrollY.current = Math.max(0, currentY);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesDropdownOpen(false);
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
      desc: '24/7 chair booking, rosters & local ranking',
      path: '/websites-for/barbershops',
      iconName: 'barbershop',
      tag: 'Chairs & Grooming',
    },
    {
      label: 'Salon & Beauty Websites',
      desc: 'Stylist portfolios & service menus',
      path: '/websites-for/salons',
      iconName: 'salon',
      tag: 'Hair & Esthetics',
    },
    {
      label: 'Creator Websites',
      desc: 'Custom link-in-bio & live media kit',
      path: '/services/creator-websites',
      iconName: 'creators',
      tag: 'Creator Economy',
    },
    {
      label: 'Small Online Stores',
      desc: 'Checkout for merch & digital downloads',
      path: '/services/online-stores',
      iconName: 'store',
      tag: 'Lean E-Commerce',
    },
    {
      label: 'Portfolio Websites',
      desc: 'Clean showcases on your domain',
      path: '/services/portfolio-websites',
      iconName: 'portfolio',
      tag: 'Visual Showcases',
    },
    {
      label: 'Website Security Check',
      desc: 'Plain-English technical hardening review',
      path: '/services/security-check',
      iconName: 'security',
      tag: 'Vulnerability Audit',
    },
    {
      label: 'Local Business Sites',
      desc: 'Online booking & Google Maps ranking',
      path: '/services/local-business-websites',
      iconName: 'booking',
      tag: 'Local Operations',
    },
    {
      label: 'Website Care Plans',
      desc: 'Fast hosting, backups & monthly edits',
      path: '/services/care-plans',
      iconName: 'care',
      tag: 'Maintenance & Care',
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

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 250);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out border-b border-white/[0.08] ${
        isScrolled
          ? 'bg-[#0B0B14]/95 backdrop-blur-md shadow-lg shadow-black/20 py-2 sm:py-2.5'
          : 'bg-[#0B0B14]/80 backdrop-blur-sm py-3.5 sm:py-4'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'}`}
      style={{
        paddingTop: 'max(0.6rem, env(safe-area-inset-top, 0px))',
        viewTransitionName: 'nav',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 relative">
        {/* LOGO */}
        <div className="shrink-0">
          <Link to="/" className="flex items-center group">
            <img
              src="/levelup-logo.svg"
              alt="LevelUp Ecosystem"
              className={`w-auto select-none transition-all duration-200 group-hover:scale-[1.01] ${
                isScrolled ? 'h-8 sm:h-9' : 'h-9 sm:h-10'
              }`}
              width="160"
              height="36"
            />
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-7 shrink-0">
          <nav className="flex items-center gap-4 xl:gap-6 text-sm font-medium">
            {/* Services Mega-Menu Trigger */}
            <div
              ref={dropdownRef}
              className="static"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                aria-expanded={servicesDropdownOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-md ${
                  isServicesActive() ? 'text-white font-semibold' : 'text-[#A1A1B5] hover:text-white'
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

              {/* MEGA-MENU DROPDOWN ("GROS TABLEAU DES SERVICES") */}
              {servicesDropdownOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[min(94vw,980px)] z-50 animate-in fade-in slide-in-from-top-3 duration-200"
                >
                  <div className="rounded-3xl bg-[#12121E]/98 backdrop-blur-2xl border border-white/[0.14] p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(124,58,237,0.25)] text-left">
                    
                    {/* Header bar of Mega-Menu */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A78BFA] bg-[#7C3AED]/20 px-2.5 py-0.5 rounded-full border border-[#7C3AED]/40">
                            Nos Spécialités
                          </span>
                          <span className="text-xs text-[#A1A1B5] font-medium">
                            8 solutions web sur mesure
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-white">
                          Conçues pour la conversion, la vitesse et la sécurité
                        </h4>
                      </div>

                      <Link
                        to="/services"
                        onClick={() => setServicesDropdownOpen(false)}
                        className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors flex items-center gap-1 group"
                      >
                        <span>Vue d&apos;ensemble de tous les services</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </div>

                    {/* 8 Services Grid (Gros tableau) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-5">
                      {serviceItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            role="menuitem"
                            onClick={() => setServicesDropdownOpen(false)}
                            className={`group relative p-3.5 rounded-2xl transition-all duration-200 border flex flex-col justify-between ${
                              active
                                ? 'bg-[#7C3AED]/15 border-[#7C3AED] shadow-[0_0_20px_rgba(124,58,237,0.25)]'
                                : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.06] hover:border-[#7C3AED]/50'
                            }`}
                          >
                            <div className="space-y-3">
                              {/* Pure 3D icon à découvert + Tag */}
                              <div className="flex items-center justify-between">
                                <div className="w-9 h-9 relative flex items-center justify-center select-none">
                                  <picture className="w-full h-full flex items-center justify-center">
                                    <source srcSet={`/assets/img/icons/${item.iconName}.avif`} type="image/avif" />
                                    <source srcSet={`/assets/img/icons/${item.iconName}.webp`} type="image/webp" />
                                    <img
                                      src={`/assets/img/icons/${item.iconName}.png`}
                                      alt=""
                                      width="36"
                                      height="36"
                                      className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(124,58,237,0.35)] group-hover:scale-105 transition-transform"
                                    />
                                  </picture>
                                </div>
                                <span className="text-[10px] font-mono text-[#A78BFA]/80 font-bold uppercase">
                                  {item.tag}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-white group-hover:text-[#DDD6FE] transition-colors leading-tight">
                                  {item.label}
                                </h5>
                                <p className="text-[11px] text-[#A1A1B5] leading-relaxed line-clamp-2">
                                  {item.desc}
                                </p>
                              </div>
                            </div>

                            <div className="pt-2 mt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-semibold text-[#A78BFA] group-hover:text-white transition-colors">
                              <span>En savoir plus</span>
                              <span className="transition-transform group-hover:translate-x-1">→</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Mega-Menu Bottom Bar */}
                    <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[#A1A1B5]">
                        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                        <span>Aperçu mobile personnalisé interactif prêt sous 24 à 48h sans engagement</span>
                      </div>

                      <Link
                        to="/preview"
                        onClick={() => setServicesDropdownOpen(false)}
                        className="px-4 py-1.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold transition-all shadow-md shadow-[#7C3AED]/30"
                      >
                        Demander un aperçu gratuit →
                      </Link>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Standard Nav Links */}
            {standardNavLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
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
            className="px-4 xl:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white transition-all duration-200 hover:shadow-[0_0_18px_rgba(124,58,237,0.45)] active:scale-95 whitespace-nowrap shrink-0"
          >
            Get a free preview
          </Link>
        </div>

        {/* MOBILE & TABLET ACTIONS */}
        <div className="lg:hidden flex items-center gap-2">
          <Link
            to="/preview"
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-[#7C3AED] text-white active:scale-95 whitespace-nowrap shrink-0"
          >
            Preview
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="p-2 text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-lg"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white transition-opacity duration-200 ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE & TABLET DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden pt-4 pb-4 px-4 border-t border-white/[0.08] mt-2 space-y-3 bg-[#0B0B14]">
          <div className="flex flex-col space-y-1 text-sm font-semibold text-slate-200">
            {/* Services Accordion on Mobile */}
            <div className="border-b border-white/[0.06] pb-1 mb-1">
              <button
                type="button"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                aria-expanded={mobileServicesOpen}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-left text-[#A1A1B5] hover:bg-white/[0.05] hover:text-white"
              >
                <span className={isServicesActive() ? 'text-white font-bold' : ''}>Services</span>
                <svg
                  className={`w-4 h-4 text-[#A78BFA] transition-transform duration-200 ${
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

              {mobileServicesOpen && (
                <div className="pl-3 pr-1 py-1 space-y-1">
                  <Link
                    to="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-3 text-xs font-bold text-[#A78BFA] hover:text-white"
                  >
                    All Services Overview →
                  </Link>
                  {serviceItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs transition-colors ${
                        isActive(item.path)
                          ? 'bg-white/[0.08] text-white font-bold'
                          : 'text-[#A1A1B5] hover:text-white'
                      }`}
                    >
                      <picture className="w-5 h-5 shrink-0">
                        <source srcSet={`/assets/img/icons/${item.iconName}.avif`} type="image/avif" />
                        <source srcSet={`/assets/img/icons/${item.iconName}.webp`} type="image/webp" />
                        <img
                          src={`/assets/img/icons/${item.iconName}.png`}
                          alt=""
                          width="20"
                          height="20"
                          className="w-full h-full object-contain"
                        />
                      </picture>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Other standard nav links */}
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

          <div className="pt-2">
            <Link
              to="/preview"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 rounded-xl bg-[#7C3AED] text-white font-bold text-xs text-center cursor-pointer shadow-md shadow-[#7C3AED]/25"
            >
              Get a free preview
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
