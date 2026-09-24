import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageLayoutProps {
  currentPath?: string;
  children: React.ReactNode;
}

export default function PageLayout({ currentPath, children }: PageLayoutProps) {
  useEffect(() => {
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
          // Force layout reflow
          void bar.offsetWidth;
          bar.classList.add('loading');
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B14] text-[#A1A1B5] font-sans selection:bg-[#7C3AED] selection:text-white flex flex-col relative">
      {/* Top thin purple progress bar (3px gradient #7C3AED to #A78BFA) */}
      <div id="page-progress-bar" aria-hidden="true" />

      <Navbar currentPath={currentPath} />

      <main className="flex-1 page-fade-in">
        {children}
      </main>

      <Footer />
    </div>
  );
}
