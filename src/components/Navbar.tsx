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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const headerRef = useRef<HTMLElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

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
            {/* Services Trigger: Hover or click toggles attached table directly below navbar */}
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

      {/* ATTACHED SERVICES MEGA-MENU (STYLE WIX PRO : COLONNES TYPOGRAPHIQUES ÉPURÉES, SANS CARTES LOURDES) */}
      {servicesDropdownOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          onMouseEnter={() => {
            if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
          }}
          onMouseLeave={handleServicesMouseLeave}
          className="hidden lg:block w-full bg-[#0B0B14]/98 backdrop-blur-2xl border-t border-b border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.95)] animate-in fade-in slide-in-from-top-1 duration-200 text-left"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-9 space-y-9">
            
            {/* 3 Clean Wix-Style Columns */}
            <div className="grid grid-cols-3 gap-12 xl:gap-16">
              
              {/* Column 1: CRÉATION */}
              <div className="space-y-6">
                <div className="text-xs font-bold uppercase tracking-widest text-[#DDD6FE] pb-2.5 border-b border-white/[0.12] flex items-center justify-between">
                  <span>CRÉATION</span>
                  <span className="text-[10px] text-[#71717A] font-mono">01</span>
                </div>
                <div className="space-y-6">
                  <Link
                    to="/services/portfolio-websites"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="group block space-y-1"
                  >
                    <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                      <span>Portfolio en ligne</span>
                      <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </h4>
                    <p className="text-xs text-[#A1A1B5] leading-relaxed">
                      Exposez votre travail et vos créations avec un portfolio ultra-rapide sur votre propre nom de domaine.
                    </p>
                  </Link>

                  <Link
                    to="/services/creator-websites"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="group block space-y-1"
                  >
                    <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                      <span>Sites Créateurs &amp; Médias</span>
                      <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </h4>
                    <p className="text-xs text-[#A1A1B5] leading-relaxed">
                      Page link-in-bio indépendante, kit média interactif pour partenariats marques et capture d'inscriptions.
                    </p>
                  </Link>

                  <Link
                    to="/preview"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="group block space-y-1"
                  >
                    <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                      <span>Web design &amp; Landing Pages</span>
                      <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </h4>
                    <p className="text-xs text-[#A1A1B5] leading-relaxed">
                      Profitez de fonctionnalités de design percutantes et modernes optimisées pour convertir vos prospects.
                    </p>
                  </Link>
                </div>
              </div>

              {/* Column 2: BUSINESS */}
              <div className="space-y-6">
                <div className="text-xs font-bold uppercase tracking-widest text-[#DDD6FE] pb-2.5 border-b border-white/[0.12] flex items-center justify-between">
                  <span>BUSINESS &amp; ACTIVITÉ</span>
                  <span className="text-[10px] text-[#71717A] font-mono">02</span>
                </div>
                <div className="space-y-6">
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
                      Réservation de fauteuils 24/7, profils des barbiers et visibilité locale Google Maps.
                    </p>
                  </Link>

                  <Link
                    to="/websites-for/salons"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="group block space-y-1"
                  >
                    <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                      <span>Salons de coiffure &amp; Beauté</span>
                      <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </h4>
                    <p className="text-xs text-[#A1A1B5] leading-relaxed">
                      Portfolios de coiffeurs et stylistes, grilles tarifaires et planification de prestations.
                    </p>
                  </Link>

                  <Link
                    to="/services/online-stores"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="group block space-y-1"
                  >
                    <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                      <span>Boutique en ligne</span>
                      <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </h4>
                    <p className="text-xs text-[#A1A1B5] leading-relaxed">
                      Gérez et développez votre vente de produits, merch et téléchargements avec paiements sécurisés.
                    </p>
                  </Link>

                  <Link
                    to="/services/local-business-websites"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="group block space-y-1"
                  >
                    <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                      <span>Réservation en ligne</span>
                      <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </h4>
                    <p className="text-xs text-[#A1A1B5] leading-relaxed">
                      Gérez vos rendez-vous, équipes et clients avec synchronisation de calendriers en temps réel.
                    </p>
                  </Link>
                </div>
              </div>

              {/* Column 3: RESTAURANT & EXPÉRIENCES */}
              <div className="space-y-6">
                <div className="text-xs font-bold uppercase tracking-widest text-[#DDD6FE] pb-2.5 border-b border-white/[0.12] flex items-center justify-between">
                  <span>COMMERCES &amp; RESTAURANTS</span>
                  <span className="text-[10px] text-[#71717A] font-mono">03</span>
                </div>
                <div className="space-y-6">
                  <Link
                    to="/services/local-business-websites"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="group block space-y-1"
                  >
                    <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                      <span>Restaurant &amp; Cafés</span>
                      <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </h4>
                    <p className="text-xs text-[#A1A1B5] leading-relaxed">
                      Menus interactifs pour smartphones, réservation de tables et itinéraire GPS en un clic.
                    </p>
                  </Link>

                  <Link
                    to="/preview"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="group block space-y-1"
                  >
                    <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                      <span>Événements &amp; Éphémères</span>
                      <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </h4>
                    <p className="text-xs text-[#A1A1B5] leading-relaxed">
                      Pages RSVP, billetterie, programme et galeries pour festivals, pop-ups et lancements.
                    </p>
                  </Link>

                  <Link
                    to="/services"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="group block space-y-1"
                  >
                    <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                      <span>Catalogue complet</span>
                      <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </h4>
                    <p className="text-xs text-[#A1A1B5] leading-relaxed">
                      Découvrez tous nos forfaits, forfaits mensuels et options de personnalisation.
                    </p>
                  </Link>
                </div>
              </div>

            </div>

            {/* Bottom Wix-Style Strip: LES INDISPENSABLES */}
            <div className="pt-6 border-t border-white/[0.12] space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1B5]">
                LES INDISPENSABLES
              </div>
              <div className="grid grid-cols-4 gap-6">
                <Link
                  to="/contact"
                  onClick={() => setServicesDropdownOpen(false)}
                  className="group block space-y-0.5"
                >
                  <h5 className="text-xs font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center gap-1">
                    <span>Nom de domaine &amp; DNS</span>
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#A78BFA]">↗</span>
                  </h5>
                  <p className="text-[11px] text-[#71717A]">
                    Configuration de votre adresse et emails pros.
                  </p>
                </Link>

                <Link
                  to="/services/care-plans"
                  onClick={() => setServicesDropdownOpen(false)}
                  className="group block space-y-0.5"
                >
                  <h5 className="text-xs font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center gap-1">
                    <span>Hébergement Cloud Rapide</span>
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#A78BFA]">↗</span>
                  </h5>
                  <p className="text-[11px] text-[#71717A]">
                    Serveurs ultra-rapides et 99.9% de disponibilité.
                  </p>
                </Link>

                <Link
                  to="/services/security-check"
                  onClick={() => setServicesDropdownOpen(false)}
                  className="group block space-y-0.5"
                >
                  <h5 className="text-xs font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center gap-1">
                    <span>Sécurité Web &amp; SSL</span>
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#A78BFA]">↗</span>
                  </h5>
                  <p className="text-[11px] text-[#71717A]">
                    En-têtes CSP stricts, protection et certificat HTTPS.
                  </p>
                </Link>

                <Link
                  to="/services/care-plans"
                  onClick={() => setServicesDropdownOpen(false)}
                  className="group block space-y-0.5"
                >
                  <h5 className="text-xs font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center gap-1">
                    <span>Plans d'Entretien</span>
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#A78BFA]">↗</span>
                  </h5>
                  <p className="text-[11px] text-[#71717A]">
                    Sauvegardes quotidiennes et mises à jour régulières.
                  </p>
                </Link>
              </div>
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
