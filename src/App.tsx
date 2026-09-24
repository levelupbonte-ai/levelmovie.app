import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Core Pages
import Home from './pages/Home';
import Services from './pages/Services';
import LocalBusinessWebsites from './pages/LocalBusinessWebsites';
import CreatorWebsites from './pages/CreatorWebsites';
import PortfolioWebsites from './pages/PortfolioWebsites';
import OnlineStores from './pages/OnlineStores';
import SecurityCheck from './pages/SecurityCheck';
import CarePlans from './pages/CarePlans';
import WebDesignSanDiego from './pages/WebDesignSanDiego';
import Projects from './pages/Projects';
import CaseStudyFinalStop from './pages/CaseStudyFinalStop';
import Pricing from './pages/Pricing';
import Process from './pages/Process';
import About from './pages/About';
import Contact from './pages/Contact';
import PreviewHub from './pages/PreviewHub';
import PreviewCustom from './pages/PreviewCustom';
import PreviewInstant from './pages/PreviewInstant';
import Sitemap from './pages/Sitemap';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Security from './pages/Security';
import NotFound from './pages/NotFound';

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Complete progress bar on route change
    const bar = document.getElementById('page-progress-bar');
    if (bar) {
      bar.classList.add('finish');
      const timer = setTimeout(() => {
        bar.classList.remove('active', 'loading', 'finish');
        bar.style.width = '0%';
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-revealed'));
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
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0B0B14] text-[#A1A1B5] font-sans selection:bg-[#7C3AED] selection:text-white flex flex-col relative">
      {/* Top thin purple progress bar (3px gradient #7C3AED to #A78BFA) */}
      <div id="page-progress-bar" aria-hidden="true" />

      <ScrollToTop />
      <Navbar currentPath={location.pathname} />
      
      <main className="flex-1 page-fade-in" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/local-business-websites" element={<LocalBusinessWebsites />} />
          <Route path="/services/creator-websites" element={<CreatorWebsites />} />
          <Route path="/services/portfolio-websites" element={<PortfolioWebsites />} />
          <Route path="/services/online-stores" element={<OnlineStores />} />
          <Route path="/services/security-check" element={<SecurityCheck />} />
          <Route path="/services/care-plans" element={<CarePlans />} />
          <Route path="/web-design-san-diego" element={<WebDesignSanDiego />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/final-stop" element={<CaseStudyFinalStop />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/process" element={<Process />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/preview" element={<PreviewHub />} />
          <Route path="/preview/custom" element={<PreviewCustom />} />
          <Route path="/preview/instant" element={<PreviewInstant />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
