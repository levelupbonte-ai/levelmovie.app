import React, { useEffect } from 'react';
import { useInRouterContext, BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageLayoutProps {
  currentPath?: string;
  children: React.ReactNode;
}

function PageLayoutContent({ currentPath, children }: PageLayoutProps) {
  useEffect(() => {
    if (!window.LevelUpLoader && !document.getElementById('levelup-loader-script')) {
      const s = document.createElement('script');
      s.id = 'levelup-loader-script';
      s.src = '/assets/js/loader.js';
      s.defer = true;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    // Dismiss any loader overlay immediately on route change
    if (typeof window !== 'undefined') {
      if (window.LevelUpLoader) {
        window.LevelUpLoader.hideNavigationOverlay();
      }
      const navOverlay = document.getElementById('levelup-nav-overlay');
      if (navOverlay) {
        navOverlay.classList.remove('overlay-active');
        navOverlay.style.display = 'none';
        if (navOverlay.parentNode) {
          navOverlay.parentNode.removeChild(navOverlay);
        }
      }
      const brandedLoader = document.getElementById('branded-loader');
      if (brandedLoader) {
        brandedLoader.classList.add('loader-hidden');
        if (brandedLoader.parentNode) {
          brandedLoader.parentNode.removeChild(brandedLoader);
        }
      }
    }

    // Complete progress bar on mount
    const bar = document.getElementById('page-progress-bar');
    if (bar) {
      bar.classList.add('finish');
      const timer = setTimeout(() => {
        bar.classList.remove('active', 'loading', 'finish');
        bar.style.width = '0%';
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentPath]);

  useEffect(() => {
    // Intercept internal link clicks to trigger progress bar
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      if (
        href &&
        !href.startsWith('http') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !href.startsWith('#') &&
        targetAttr !== '_blank'
      ) {
        const bar = document.getElementById('page-progress-bar');
        if (bar) {
          bar.style.width = '0%';
          bar.classList.remove('finish');
          bar.classList.add('active');
          void bar.offsetWidth;
          bar.classList.add('loading');
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        if (window.LevelUpLoader) {
          window.LevelUpLoader.hideNavigationOverlay();
        }
        const bar = document.getElementById('page-progress-bar');
        if (bar) {
          bar.classList.remove('active', 'loading', 'finish');
          bar.style.width = '0%';
        }
      }
    };
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // IntersectionObserver for scroll-reveal animations & immediate above-fold visibility
  useEffect(() => {
    // Immediately remove any stuck branded loader once React mounts
    const brandedLoader = document.getElementById('branded-loader');
    if (brandedLoader) {
      brandedLoader.classList.add('loader-hidden');
      setTimeout(() => {
        if (brandedLoader.parentNode) {
          brandedLoader.parentNode.removeChild(brandedLoader);
        }
      }, 150);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');

    // Reveal anything in or near the viewport immediately so no top blank void ever occurs
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (prefersReducedMotion || !('IntersectionObserver' in window) || rect.top < (window.innerHeight || 800) + 120) {
        el.classList.add('is-revealed');
      }
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '120px 0px 80px 0px',
      }
    );

    elements.forEach((el) => {
      if (!el.classList.contains('is-revealed')) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [currentPath, children]);

  return (
    <div className="min-h-screen bg-[#0B0B14] text-[#A1A1B5] font-sans selection:bg-[#7C3AED] selection:text-white flex flex-col relative">
      {/* Top thin purple progress bar (hidden by default) */}
      <div id="page-progress-bar" className="hidden" aria-hidden="true" />

      {/* Subtle stylish top blurred gradient fade: gently softens content as it scrolls up under the header */}
      <div
        className="pointer-events-none fixed top-0 left-0 right-0 h-20 sm:h-28 z-30 bg-gradient-to-b from-[#0B0B14] via-[#0B0B14]/85 to-transparent backdrop-blur-md"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
        }}
        aria-hidden="true"
      />

      <Navbar currentPath={currentPath} />

      <main className="flex-1 page-fade-in">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default function PageLayout({ currentPath, children }: PageLayoutProps) {
  const inRouter = useInRouterContext();

  if (!inRouter) {
    return (
      <BrowserRouter>
        <PageLayoutContent currentPath={currentPath}>
          {children}
        </PageLayoutContent>
      </BrowserRouter>
    );
  }

  return (
    <PageLayoutContent currentPath={currentPath}>
      {children}
    </PageLayoutContent>
  );
}
