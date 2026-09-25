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
}

export default function Navbar({ currentPath }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [path, setPath] = useState(currentPath || '');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const headerRef = useRef<HTMLElement>(null);
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
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
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
      desc: '24/7 chair booking, barber rosters & Google Maps local ranking.',
      path: '/websites-for/barbershops',
      tag: 'Chairs & Grooming',
    },
    {
      label: 'Salon & Beauty Websites',
      desc: 'Stylist portfolios, tiered service menus & multi-service booking.',
      path: '/websites-for/salons',
      tag: 'Hair & Esthetics',
    },
    {
      label: 'Creator Websites',
      desc: 'Independent link-in-bio hub, live collaboration media kit & newsletter.',
      path: '/services/creator-websites',
      tag: 'Creator Economy',
    },
    {
      label: 'Small Online Stores',
      desc: 'Fast checkout for merch, products & digital downloads without platform fees.',
      path: '/services/online-stores',
      tag: 'Lean E-Commerce',
    },
    {
      label: 'Portfolio Websites',
      desc: 'High-resolution showcases with sub-second page loads on your domain.',
      path: '/services/portfolio-websites',
      tag: 'Visual Showcases',
    },
    {
      label: 'Website Security Check',
      desc: 'Plain-English technical audit of database rules, HTTPS & exposed keys.',
      path: '/services/security-check',
      tag: 'Vulnerability Audit',
    },
    {
      label: 'Local Business Sites',
      desc: 'Google Business Profile sync, neighborhood rankings & online booking.',
      path: '/services/local-business-websites',
      tag: 'Local Operations',
    },
    {
      label: 'Website Care Plans',
      desc: 'Fast cloud hosting, daily backups & on-demand monthly updates.',
      path: '/services/care-plans',
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

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out border-b border-white/[0.08] ${
        isScrolled
          ? 'bg-[#0B0B14]/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-[#0B0B14]/90 backdrop-blur-sm'
      } ${isVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'}`}
      style={{
        paddingTop: 'max(0.6rem, env(safe-area-inset-top, 0px))',
        viewTransitionName: 'nav',
      }}
    >
      {/* Top Navbar Row */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 transition-all duration-200 ${
          isScrolled ? 'py-2 sm:py-2.5' : 'py-3.5 sm:py-4'
        }`}
      >
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
            {/* Services Trigger: Click toggles attached table directly below navbar */}
            <div className="relative">
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

      {/* ATTACHED SERVICES BOARD (COLLÉ DIRECTEMENT À LA BARRE DU HAUT, SANS AUCUNE ICÔNE) */}
      {servicesDropdownOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="hidden lg:block w-full bg-[#0D0D17]/98 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-top-1 duration-200 text-left"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-7">
            {/* Top header of the attached board */}
            <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA] bg-[#7C3AED]/20 px-2.5 py-0.5 rounded-full border border-[#7C3AED]/40">
                  Solutions &amp; Métiers
                </span>
                <span className="text-xs text-[#A1A1B5]">
                  Sites haute vitesse &lt; 2s • Réservations 24/7 • Sécurité renforcée
                </span>
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

            {/* 4 Clean Columns of Services (NO ICONS, PURE PRO DIRECTORY) */}
            <div className="grid grid-cols-4 gap-6 pt-6 pb-2">
              {serviceItems.map((item, idx) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    role="menuitem"
                    onClick={() => setServicesDropdownOpen(false)}
                    className={`group block p-4 rounded-2xl border transition-all duration-200 ${
                      active
                        ? 'bg-[#7C3AED]/15 border-[#7C3AED]/70 shadow-[0_0_20px_rgba(124,58,237,0.25)]'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.06] hover:border-[#7C3AED]/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
                          0{idx + 1} • {item.tag}
                        </span>
                        <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-[#DDD6FE] transition-colors leading-tight">
                        {item.label}
                      </h4>

                      <p className="text-xs text-[#A1A1B5] leading-relaxed line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Action Strip */}
            <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#A1A1B5]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>Aperçu interactif personnalisé prêt sous 24 à 48h sans aucun engagement d&apos;achat</span>
              </div>

              <Link
                to="/preview"
                onClick={() => setServicesDropdownOpen(false)}
                className="px-4 py-2 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold transition-all shadow-md shadow-[#7C3AED]/30 whitespace-nowrap"
              >
                Demander un aperçu gratuit →
              </Link>
            </div>
          </div>
        </div>
      )}

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
                      className={`block py-2 px-3 rounded-lg text-xs transition-colors ${
                        isActive(item.path)
                          ? 'bg-white/[0.08] text-white font-bold'
                          : 'text-[#A1A1B5] hover:text-white'
                      }`}
                    >
                      {item.label}
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
              className="block w-full py-3 rounded-xl bg-[#7C3AED] text-white font-bold text-xs text-center cursor-pointer shadow-md shadow-[#7C3AED]/25 whitespace-nowrap"
            >
              Get a free preview
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
