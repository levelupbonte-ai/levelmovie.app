import React, { useState, useEffect, useRef } from 'react';
import { Link } from './Link';

interface NavbarProps {
  currentPath?: string;
}

export default function Navbar({ currentPath }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [path, setPath] = useState(currentPath || '');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
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

          // Mobile & Tablet hide on scroll down, show on scroll up
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

  const navLinks = [
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'How we build', path: '/process' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (targetPath: string) => {
    const cleanPath = path.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
    const cleanTarget = targetPath.replace(/\/$/, '') || '/';

    if (cleanTarget === '/services') {
      return cleanPath.startsWith('/services');
    }
    if (cleanTarget === '/projects') {
      return cleanPath.startsWith('/projects');
    }
    return cleanPath === cleanTarget;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
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
        <div className="hidden lg:flex items-center gap-7">
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 transition-colors ${
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
            className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white transition-all duration-200 hover:shadow-[0_0_18px_rgba(124,58,237,0.45)] active:scale-95 shrink-0"
          >
            Get a free preview
          </Link>
        </div>

        {/* MOBILE & TABLET ACTIONS */}
        <div className="lg:hidden flex items-center gap-2.5">
          <Link
            to="/preview"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#7C3AED] text-white active:scale-95"
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
            {navLinks.map((link) => (
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
