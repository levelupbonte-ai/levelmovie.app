import React, { useState, useEffect } from 'react';

interface NavbarProps {
  currentPath?: string;
}

export default function Navbar({ currentPath }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [path, setPath] = useState(currentPath || '');

  useEffect(() => {
    if (!currentPath && typeof window !== 'undefined') {
      setPath(window.location.pathname);
    } else if (currentPath) {
      setPath(currentPath);
    }
  }, [currentPath]);

  const navLinks = [
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'How we build', path: '/process' }
  ];

  const isActive = (targetPath: string) => {
    const cleanPath = path.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
    const cleanTarget = targetPath.replace(/\/$/, '') || '/';

    if (cleanTarget === '/projects') {
      return cleanPath.startsWith('/projects');
    }
    return cleanPath === cleanTarget;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B14]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* LOGO: Left side, ~40px height */}
        <div className="shrink-0">
          <a href="/" className="flex items-center group">
            <img
              src="/levelup-logo.svg"
              alt="LevelUp Ecosystem"
              className="h-10 sm:h-11 w-auto select-none transition-transform group-hover:scale-[1.01]"
            />
          </a>
        </div>

        {/* DESKTOP NAV: Links + Purple "Get a free preview" Button */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <a
                  key={link.path}
                  href={link.path}
                  className={`relative py-1 transition-colors ${
                    active ? 'text-white' : 'text-[#A1A1B5] hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full"></span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Solid purple pill button */}
          <a
            href="/contact"
            className="px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 shrink-0"
          >
            Get a free preview
          </a>
        </div>

        {/* MOBILE: Keep "Get a free preview" button visible + Clean hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <a
            href="/contact"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#7C3AED] text-white active:scale-95"
          >
            Preview
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-white cursor-pointer focus:outline-none"
          >
            <div className="w-6 h-4.5 flex flex-col justify-between">
              <span className={`block h-0.5 w-6 bg-white transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-3 px-3 border-t border-white/[0.08] mt-3 space-y-2 animate-in fade-in">
          <div className="flex flex-col space-y-1 text-sm font-semibold text-slate-200">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-left py-2.5 px-3 rounded-xl transition-colors ${
                  isActive(link.path) ? 'bg-white/[0.08] text-white' : 'text-[#A1A1B5] hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 rounded-xl bg-[#7C3AED] text-white font-bold text-xs text-center cursor-pointer shadow-md shadow-[#7C3AED]/25"
            >
              Get a free preview
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
