import React, { useState, useEffect, useRef } from 'react';
import {
  Code, Cpu, Sparkles, Check, Star, ArrowRight, Headphones,
  Sun, Tv, ShieldCheck, CheckCircle2, Mail, Menu, X,
  Music, CloudSun, Film, PlayCircle, Play, Send, ExternalLink,
  FileText, Layers, ChevronRight, Lock, Shield
} from 'lucide-react';
import LevelMovieApp from './LevelMovieApp';
import { LevelMusicApp } from './components/apps/LevelMusicApp';
import { LevelDayApp } from './components/apps/LevelDayApp';
import { ProjectStudioApp } from './components/apps/ProjectStudioApp';
import { StudioPreparationScreen } from './components/apps/StudioPreparationScreen';
import { BuildFirstFaq } from './components/BuildFirstFaq';
import { LevelMovieLogo } from './constants';

type AppRoute = 'ecosystem' | 'movie' | 'music' | 'weather' | 'studio';

const ROUTE_PATHS: Record<AppRoute, string> = {
  ecosystem: '/',
  movie: '/levelmovie',
  music: '/music',
  weather: '/weather',
  studio: '/studio'
};

const ROUTE_TITLES: Record<AppRoute, string> = {
  ecosystem: 'LevelUp Ecosystem | Next-Gen AI Web Development & Digital Platform',
  movie: 'LevelMovie — Stream Movies & Series HD | LevelUp Ecosystem',
  music: 'LevelMusic — Trending Audio & Previews | LevelUp Ecosystem',
  weather: 'LevelDay — Live Weather & Atmospheric Data | LevelUp Ecosystem',
  studio: 'LevelUp Project Studio — Espace Pro & Cahier des Charges Étape par Étape'
};

function getRouteFromPath(path: string): AppRoute {
  if (path.startsWith('/levelmovie') || path.startsWith('/movie')) return 'movie';
  if (path.startsWith('/music') || path.startsWith('/levelmusic')) return 'music';
  if (path.startsWith('/weather') || path.startsWith('/levelday')) return 'weather';
  if (path.startsWith('/studio') || path.startsWith('/project')) return 'studio';
  return 'ecosystem';
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // App views: 'ecosystem' (default home) or standalone integrated apps ('movie', 'music', 'weather')
  const [currentAppView, setCurrentAppView] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      return getRouteFromPath(window.location.pathname);
    }
    return 'ecosystem';
  });
  
  // Contact modal and Studio states
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [isPreparingStudio, setIsPreparingStudio] = useState(false);
  const [studioInitialPackage, setStudioInitialPackage] = useState('Starter Website ($350)');
  const [studioInitialMessage, setStudioInitialMessage] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    projectType: 'Starter Website ($350)',
    message: ''
  });
  const [contactSent, setContactSent] = useState(false);

  // Helper to open the full-page Project Studio with a 4-second preparation animation in superposition over the site
  const openStudio = (pkg?: string, msg?: string) => {
    if (pkg) setStudioInitialPackage(pkg);
    if (msg !== undefined) setStudioInitialMessage(msg);
    setIsPreparingStudio(true);
  };

  const handlePreparationComplete = () => {
    setIsPreparingStudio(false);
    navigateTo('studio');
  };

  const handlePreparationCancel = () => {
    setIsPreparingStudio(false);
  };

  // Helper to open quick inquiry modal form with pre-selected package or initial message
  const openInquiryWithPackage = (projectType?: string, initialMessage?: string) => {
    setContactForm(prev => ({
      ...prev,
      projectType: projectType || prev.projectType,
      message: initialMessage !== undefined ? initialMessage : prev.message
    }));
    setContactModalOpen(true);
  };

  // Synchronize browser history and page titles for instant true URL routing in the same tab
  const navigateTo = (route: AppRoute) => {
    const targetPath = ROUTE_PATHS[route];
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ route }, '', targetPath);
    }
    document.title = ROUTE_TITLES[route];
    setCurrentAppView(route);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handle browser Back & Forward button events (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromPath(window.location.pathname);
      navigateTo(route);
    };

    window.addEventListener('popstate', handlePopState);
    document.title = ROUTE_TITLES[currentAppView];

    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentAppView]);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for .fade-up animations
  useEffect(() => {
    if (currentAppView !== 'ecosystem') return;

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.fade-up');
    elements.forEach(elem => observer.observe(elem));

    return () => {
      elements.forEach(elem => observer.unobserve(elem));
    };
  }, [currentAppView]);

  // Handle Contact Form Submit
  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactModalOpen(false);
      setContactSent(false);
      setContactForm({
        name: '',
        email: '',
        projectType: 'Starter Website ($350)',
        message: ''
      });
    }, 2200);
  };

  return (
    <>
      {/* Superposition Loading Screen over the site */}
      {isPreparingStudio && (
        <StudioPreparationScreen
          onComplete={handlePreparationComplete}
          onCancel={handlePreparationCancel}
          lang="fr"
        />
      )}

      {/* SEPARATE DEDICATED APP VIEW: LEVELMOVIE (/levelmovie) */}
      {currentAppView === 'movie' && (
        <div className="relative w-full min-h-screen levelmovie-app bg-[#060608]">
          <LevelMovieApp onBackToEcosystem={() => navigateTo('ecosystem')} />
        </div>
      )}

      {/* SEPARATE DEDICATED APP VIEW: LEVELMUSIC (/music) */}
      {currentAppView === 'music' && (
        <div className="relative w-full h-screen bg-[#07080f] text-white overflow-hidden">
          <LevelMusicApp lang="en" onClose={() => navigateTo('ecosystem')} />
        </div>
      )}

      {/* SEPARATE DEDICATED APP VIEW: LEVELDAY WEATHER (/weather) */}
      {currentAppView === 'weather' && (
        <div className="relative w-full h-screen bg-[#02050e] text-white overflow-hidden">
          <LevelDayApp lang="en" onClose={() => navigateTo('ecosystem')} />
        </div>
      )}

      {/* SEPARATE DEDICATED APP VIEW: PROJECT STUDIO (/studio) */}
      {currentAppView === 'studio' && (
        <div className="relative w-full min-h-screen bg-[#07080f] text-white">
          <ProjectStudioApp
            initialPackage={studioInitialPackage}
            initialMessage={studioInitialMessage}
            onClose={() => navigateTo('ecosystem')}
            lang="fr"
          />
        </div>
      )}

      {/* MAIN HOMEPAGE VIEW: LEVELUP ECOSYSTEM (100% ENGLISH) */}
      {currentAppView === 'ecosystem' && (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      
      {/* Navbar (Sticky, Frosted Glass effect) */}
      <header
        className={`fixed w-full top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
        id="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Brand Logo with Purple Star */}
            <div
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer select-none"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#7c3aed]">
                <path d="M16 1.5L19.53 10.87C19.78 11.52 20.48 11.96 21.18 11.96H30.5L23.04 17.65C22.48 18.08 22.25 18.82 22.45 19.49L25.3 28.86L17.7 23.33C17.16 22.94 16.42 22.94 15.88 23.33L8.28 28.86L11.13 19.49C11.33 18.82 11.1 18.08 10.54 17.65L3.08 11.96H12.4C13.1 11.96 13.8 11.52 14.05 10.87L16 1.5Z" fill="currentColor"/>
              </svg>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                LevelUp <span className="font-medium text-[#7c3aed]">Ecosystem</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8">
              <a href="#services" className="text-gray-600 hover:text-[#7c3aed] font-medium transition-colors">Services</a>
              <a href="#ecosystem" className="text-gray-600 hover:text-[#7c3aed] font-medium transition-colors">Apps</a>
              <a href="#security" className="text-gray-600 hover:text-[#7c3aed] font-medium transition-colors">Security</a>
              <a href="#faq" className="text-gray-600 hover:text-[#7c3aed] font-medium transition-colors">FAQ</a>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <button
                type="button"
                id="navbar-join-ecosystem-btn"
                onClick={() => openStudio()}
                className="bg-gray-900 hover:bg-[#7c3aed] text-white px-5 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center"
              >
                <span>Join Ecosystem</span>
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center">
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-none text-base font-medium text-gray-700 hover:text-[#7c3aed] hover:bg-gray-50"
              >
                Services
              </a>
              <a
                href="#ecosystem"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-none text-base font-medium text-gray-700 hover:text-[#7c3aed] hover:bg-gray-50"
              >
                Apps
              </a>
              <a
                href="#security"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-none text-base font-medium text-gray-700 hover:text-[#7c3aed] hover:bg-gray-50"
              >
                Security
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-none text-base font-medium text-gray-700 hover:text-[#7c3aed] hover:bg-gray-50"
              >
                FAQ
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openStudio();
                }}
                className="w-full block mt-4 text-center px-3 py-3 rounded-none text-base font-medium bg-[#7c3aed] text-white hover:bg-[#6d28d9] cursor-pointer"
              >
                Join Ecosystem
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="pt-28 lg:pt-36 pb-20 overflow-hidden bg-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto fade-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8">
              Artificial intelligence powering <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-indigo-600">your ecosystem.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              LevelUp Ecosystem is an advanced technology platform. We engineer high-performance custom websites and web applications with AI assistance, while providing free daily utilities and elite digital cybersecurity.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#services"
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-none font-medium text-lg transition-all shadow-lg shadow-[#7c3aed]/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Discover Our Solutions</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#pricing"
                className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-8 py-4 rounded-none font-medium text-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>View Plans & Pricing</span>
              </a>
            </div>
          </div>

          {/* Abstract UI Mockup */}
          <div className="mt-20 relative max-w-5xl mx-auto fade-up">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent z-10 h-full pointer-events-none"></div>
            <div className="rounded-2xl border border-gray-200/60 bg-white/50 backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="bg-gray-100/50 border-b border-gray-200/60 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-32 bg-[#ede9fe] rounded-lg animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white relative border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            <h2 className="text-[#7c3aed] font-semibold tracking-wide uppercase text-sm mb-3">Development & Innovation</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">High-precision technological solutions.</h3>
            <p className="text-lg text-gray-600">We combine human engineering and artificial intelligence to design robust websites and applications with uncompromising aesthetic excellence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-none p-8 border border-gray-200 hover:border-[#c4b5fd] hover:shadow-card transition-all duration-300 fade-up">
              <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center shadow-sm text-[#7c3aed] mb-6 border border-gray-200">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Bespoke Websites</h4>
              <p className="text-gray-600 leading-relaxed">From showcase landing pages to complex e-commerce platforms, we engineer every project for peak performance, lightning speed, and optimal UX.</p>
            </div>

            {/* Feature 2: AI-Powered Architecture without bubble */}
            <div className="bg-gray-50 rounded-none p-8 border border-gray-200 hover:border-[#c4b5fd] hover:shadow-card transition-all duration-300 fade-up" style={{ transitionDelay: '100ms' }}>
              <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center shadow-sm text-[#7c3aed] mb-6 border border-gray-200">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Architecture</h4>
              <p className="text-gray-600 leading-relaxed">Our AI-assisted workflows ensure superior professional quality, strict coding standards, and a design aesthetic rivaling top global tech platforms.</p>
            </div>

            {/* Feature 3: Web Apps & Virtual Events with Pro Layers Icon */}
            <div className="bg-gray-50 rounded-none p-8 border border-gray-200 hover:border-[#c4b5fd] hover:shadow-card transition-all duration-300 fade-up" style={{ transitionDelay: '200ms' }}>
              <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center shadow-sm text-[#7c3aed] mb-6 border border-gray-200">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Web Apps & Virtual Events</h4>
              <p className="text-gray-600 leading-relaxed">Dynamic full-stack web applications and interactive virtual invitations tailored for high-profile events and modern digital experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Process Section */}
      <section id="process" className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            <h2 className="text-[#7c3aed] font-semibold tracking-wide uppercase text-sm mb-3">Trust Methodology</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Commitment: Zero Risk for You.</h3>
            <p className="text-lg text-gray-600">We believe in total transparency. That is why we operate with a strict review and validation process before any payment is requested.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-none border border-gray-200 shadow-sm relative fade-up">
              <div className="text-[#7c3aed] font-bold text-4xl mb-4">01</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Initial Build</h4>
              <p className="text-gray-600">We construct your entire website or web application according to your precise requirements with zero upfront cost.</p>
            </div>
            <div className="bg-white p-8 rounded-none border border-gray-200 shadow-sm relative fade-up" style={{ transitionDelay: '100ms' }}>
              <div className="text-[#7c3aed] font-bold text-4xl mb-4">02</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Demo & Validation</h4>
              <p className="text-gray-600">We showcase an interactive live demonstration of your completed project. You experience and test the real working product.</p>
            </div>
            <div className="bg-white p-8 rounded-none border border-gray-200 shadow-sm relative fade-up" style={{ transitionDelay: '200ms' }}>
              <div className="text-[#7c3aed] font-bold text-4xl mb-4">03</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Payment & Launch</h4>
              <p className="text-gray-600">Only once you are 100% satisfied with the outcome do you complete payment, and we deploy your platform live worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Pro SaaS Style) */}
      <section id="pricing" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            <h2 className="text-[#7c3aed] font-semibold tracking-wide uppercase text-sm mb-3">Our Plans and Pricing</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Clear, transparent packages designed for your goals.</h3>
            <p className="text-lg text-gray-600">Professional subscriptions and fixed-price packages structured to maximize your digital ROI with zero compromises on quality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* Invitations / Event Package */}
            <div id="pricing-event" className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col fade-up hover:border-[#c4b5fd] transition-all">
              <h4 className="text-lg font-bold text-gray-900 mb-1">Invitation & Event</h4>
              <p className="text-gray-500 text-xs mb-6 h-10">Ideal for weddings, galas, birthdays, or brand releases.</p>
              <div className="mb-6">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Starting at</span>
                <div className="text-3xl font-extrabold text-gray-900 mt-1">$120</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Interactive virtual invitation</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Custom bespoke design</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Built-in RSVP tracking form</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Cloud hosting included</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => openInquiryWithPackage('Virtual Invitation & Event ($120)', 'Hello, I would like to order or discuss a Virtual Invitation & Event website.')}
                className="block w-full py-2.5 px-4 bg-white text-gray-900 font-medium text-center rounded-none border border-gray-300 hover:bg-gray-100 transition-colors text-sm shadow-sm cursor-pointer"
              >
                Order Now ($120)
              </button>
            </div>

            {/* Starter Website */}
            <div id="pricing-starter" className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col fade-up hover:border-[#c4b5fd] transition-all" style={{ transitionDelay: '100ms' }}>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Starter Website</h4>
              <p className="text-gray-500 text-xs mb-6 h-10">The essential package to establish your professional presence.</p>
              <div className="mb-6">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Starting at</span>
                <div className="text-3xl font-extrabold text-gray-900 mt-1">$350</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Showcase website (1–3 pages)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">100% mobile-responsive layout</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Pro lead & contact form</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Build before payment</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => openInquiryWithPackage('Starter Website ($350)', 'Hello, I would like to start a Starter Website project with the zero-risk build-first workflow.')}
                className="block w-full py-2.5 px-4 bg-white text-gray-900 font-medium text-center rounded-none border border-gray-300 hover:bg-gray-100 transition-colors text-sm shadow-sm cursor-pointer"
              >
                Get Started ($350)
              </button>
            </div>

            {/* Pro Plan (Featured) */}
            <div id="pricing-pro" className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex flex-col relative shadow-xl fade-up z-10" style={{ transitionDelay: '200ms' }}>
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                <span className="bg-[#8b5cf6] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wide rounded-none shadow-md">Popular</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Business Pro</h4>
              <p className="text-gray-400 text-xs mb-6 h-10">Scale your customer acquisition and cement your brand authority.</p>
              <div className="mb-6">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Starting at</span>
                <div className="text-3xl font-extrabold text-white mt-1">$800</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#a78bfa] shrink-0 mt-0.5" />
                  <span className="text-gray-300">Up to 10 optimized pages</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#a78bfa] shrink-0 mt-0.5" />
                  <span className="text-gray-300">E-commerce or booking modules</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#a78bfa] shrink-0 mt-0.5" />
                  <span className="text-gray-300">Advanced SEO & schema markup</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#a78bfa] shrink-0 mt-0.5" />
                  <span className="text-gray-300">1 year complimentary maintenance</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => openInquiryWithPackage('Business Pro ($800)', 'Hello, I am interested in the Business Pro package for our company website.')}
                className="block w-full py-2.5 px-4 bg-[#7c3aed] text-white font-medium text-center rounded-none hover:bg-[#8b5cf6] transition-colors text-sm shadow-md cursor-pointer"
              >
                Choose Pro ($800)
              </button>
            </div>

            {/* Premium Ecosystem Plan */}
            <div id="pricing-custom" className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col fade-up hover:border-[#c4b5fd] transition-all shadow-sm" style={{ transitionDelay: '300ms' }}>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Ecosystem Premium</h4>
              <p className="text-gray-500 text-xs mb-6 h-10">High-end bespoke web application with extended support.</p>
              <div className="mb-6">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custom Quote</span>
                <div className="text-3xl font-extrabold text-gray-900 mt-1">Tailored</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600 font-medium">Full-stack web application</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Encrypted high-security cloud setup</span>
                </li>
                <li className="flex items-start gap-2.5 bg-[#f5f3ff] p-2 rounded-none border border-[#ede9fe]">
                  <Star className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5 fill-[#7c3aed]" />
                  <span className="text-[#4c1d95] font-semibold text-xs leading-tight">Guaranteed 3-year maintenance & support</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => openInquiryWithPackage('Ecosystem Premium (Custom Quote)', 'Hello, I would like to request a consultation and quote for a custom full-stack web application.')}
                className="block w-full py-2.5 px-4 bg-gray-50 text-gray-900 font-medium text-center rounded-none border border-gray-300 hover:bg-gray-100 transition-colors text-sm cursor-pointer"
              >
                Request Custom Quote
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* The Ecosystem (Free Daily Utilities) */}
      <section id="ecosystem" className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#7c3aed] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="lg:w-1/2 fade-up">
              <h2 className="text-[#a78bfa] font-semibold tracking-wide uppercase text-sm mb-3">Daily Utilities</h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                A genuine ecosystem of <span className="text-[#a78bfa]">free everyday services.</span>
              </h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Alongside our client engineering services, LevelUp offers integrated public utilities to enrich your daily digital life with complete freedom.
              </p>
              
              <ul className="space-y-6">
                {/* Music preview */}
                <li
                  onClick={() => navigateTo('music')}
                  className="flex items-start gap-4 p-3 rounded-none hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-none bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 text-[#a78bfa] mt-1 group-hover:bg-[#7c3aed] group-hover:text-white transition-colors">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 group-hover:text-[#a78bfa] transition-colors flex items-center gap-2">
                      <span>LevelMusic</span>
                      <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-none bg-purple-900/60 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Écouter</span>
                      </span>
                    </h4>
                    <p className="text-gray-400 text-sm">Listen to instant previews of the hottest trending tracks directly in our integrated player.</p>
                  </div>
                </li>
                
                {/* Weather */}
                <li
                  onClick={() => navigateTo('weather')}
                  className="flex items-start gap-4 p-3 rounded-none hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-none bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 text-[#a78bfa] mt-1 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                      <span>LevelDay</span>
                      <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-none bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                        <span>Consulter</span>
                      </span>
                    </h4>
                    <p className="text-gray-400 text-sm">Check real-time weather conditions, forecasts, and atmospheric metrics for your favorite cities worldwide.</p>
                  </div>
                </li>
                
                {/* Movies & Series */}
                <li
                  onClick={() => navigateTo('movie')}
                  className="flex items-start gap-4 p-3 rounded-none hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-none bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 text-[#a78bfa] mt-1 group-hover:bg-[#7c3aed] group-hover:text-white transition-colors">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 group-hover:text-[#a78bfa] transition-colors flex items-center gap-2">
                      <span>LevelMovie</span>
                      <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-none bg-[#7c3aed]/40 text-purple-200 border border-[#a78bfa]/40 flex items-center gap-1.5">
                        <Play className="w-2.5 h-2.5 fill-current text-[#a78bfa]" />
                        <span>Jouer</span>
                      </span>
                    </h4>
                    <p className="text-gray-400 text-sm">Discover trending releases, summaries, trailers, and stream movies, series, and anime in HD.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Bento Grid for Interactive App Previews */}
            <div className="lg:w-1/2 w-full fade-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Music Bento Box */}
                <div
                  onClick={() => navigateTo('music')}
                  className="bg-gray-800 rounded-none p-5 sm:p-6 border border-gray-700 hover:border-purple-500 transition-all flex flex-col justify-between cursor-pointer group select-none relative overflow-hidden"
                  title="Open LevelMusic Player"
                >
                  {/* Header with discreet pro button */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2.5">
                      <Headphones className="w-6 h-6 text-[#a78bfa] group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-sm font-bold text-white tracking-wide leading-tight">LevelMusic</div>
                        <div className="text-[10px] font-mono text-purple-300">Lossless 320kbps</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold bg-white/10 hover:bg-[#7c3aed] text-white px-3 py-1.5 rounded-none border border-white/15 transition-colors flex items-center gap-1.5">
                      <Play className="w-3 h-3 fill-current text-[#a78bfa] group-hover:text-white" />
                      <span>Écouter</span>
                    </span>
                  </div>

                  {/* Pro Music Cards */}
                  <div className="space-y-2.5 my-2">
                    {/* Track 1 */}
                    <div className="flex items-center gap-3 p-2 bg-black/40 border border-white/10 hover:border-purple-500/50 transition-all group/track">
                      <div className="relative w-11 h-11 bg-purple-950 shrink-0 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&auto=format&fit=crop&q=80"
                          alt="Midnight Horizon"
                          className="w-full h-full object-cover group-hover/track:scale-110 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 text-white fill-current opacity-90 group-hover/track:scale-110 transition-transform" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">Midnight Horizon</div>
                        <div className="text-[10px] text-gray-400 truncate">Synthwave • Neon Echoes</div>
                      </div>
                      {/* Mini animated equalizer */}
                      <div className="flex items-end gap-0.5 h-3.5 shrink-0 px-1">
                        <span className="w-1 bg-[#a78bfa] h-2.5 animate-pulse"></span>
                        <span className="w-1 bg-purple-400 h-3.5 animate-ping"></span>
                        <span className="w-1 bg-pink-400 h-2 animate-pulse"></span>
                      </div>
                    </div>

                    {/* Track 2 */}
                    <div className="flex items-center gap-3 p-2 bg-black/40 border border-white/10 hover:border-purple-500/50 transition-all group/track">
                      <div className="relative w-11 h-11 bg-indigo-950 shrink-0 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80"
                          alt="Amapiano Sunset"
                          className="w-full h-full object-cover group-hover/track:scale-110 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 text-white fill-current opacity-90 group-hover/track:scale-110 transition-transform" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">Golden Hour Groove</div>
                        <div className="text-[10px] text-gray-400 truncate">Amapiano & Afrobeat</div>
                      </div>
                      <span className="text-[10px] text-purple-300 font-mono shrink-0">3:24</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none animate-pulse"></span>
                      Hits 2025
                    </span>
                    <span className="text-purple-300 font-medium">Lecteur HD</span>
                  </div>
                </div>

                {/* Weather Bento Box */}
                <div
                  onClick={() => navigateTo('weather')}
                  className="bg-gray-800 rounded-none p-5 sm:p-6 border border-gray-700 hover:border-yellow-500 transition-all flex flex-col justify-between cursor-pointer group select-none"
                  title="Open LevelDay Weather"
                >
                  <div className="flex justify-between items-center mb-2">
                    <Sun className="w-8 h-8 text-yellow-400 group-hover:rotate-45 transition-transform" />
                    <span className="text-xs font-semibold bg-white/10 hover:bg-yellow-600/30 text-white px-2.5 py-1 rounded-none border border-white/15 transition-colors">
                      Consulter
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-0.5">24°C</div>
                    <div className="text-gray-300 text-xs font-medium">Paris • Ensoleillé</div>
                    <div className="text-gray-400 text-[11px] mt-1">Humidité 48% • Vent 14 km/h</div>
                  </div>
                  <div className="mt-4 h-1.5 w-full bg-gray-700 rounded-none overflow-hidden">
                    <div className="h-full bg-yellow-400 w-2/3"></div>
                  </div>
                </div>

                {/* Movie Hub Bento Box with Real Cinema Cards */}
                <div
                  onClick={() => navigateTo('movie')}
                  className="bg-gray-800 rounded-none p-5 sm:p-6 border border-gray-700 hover:border-[#7c3aed] transition-all sm:col-span-2 cursor-pointer group select-none"
                  title="Open LevelMovie HD Streaming Platform"
                >
                  {/* Header with discreet pro button (NO up arrow!) */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2.5">
                      <Tv className="w-7 h-7 text-[#a78bfa] group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-base font-bold text-white tracking-wide leading-tight">LevelMovie Cinema</div>
                        <div className="text-[11px] text-gray-400 font-mono">12 000+ Films, Séries & Animes HD</div>
                      </div>
                    </div>
                    {/* Discrete professional button: Jouer / Visiter (No arrow!) */}
                    <span className="text-xs font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-3.5 py-1.5 rounded-none border border-purple-400/40 shadow-sm transition-all flex items-center gap-1.5 tracking-wider uppercase">
                      <Play className="w-3.5 h-3.5 fill-current text-white" />
                      <span>Jouer</span>
                    </span>
                  </div>

                  {/* Real Cinema Cards Grid (3 pro cinema cards) */}
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
                    {/* Cinema Card 1: Dune 2 */}
                    <div className="group relative aspect-[2/3] bg-black/50 overflow-hidden border border-white/10 hover:border-[#a855f7] hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(168,85,247,0.4)] transition-all duration-500 ease-out hover:z-10">
                      <img
                        src="https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"
                        alt="Dune: Part Two"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      {/* Top badges */}
                      <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                        <span className="px-1.5 py-0.5 bg-black/85 text-[9px] font-bold text-amber-300 border border-amber-400/30">4K UHD</span>
                        <span className="px-1.5 py-0.5 bg-purple-950/90 text-[9px] font-bold text-white border border-purple-400/30">★ 8.6</span>
                      </div>
                      {/* Hover play overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-center justify-center">
                        <div className="w-9 h-9 rounded-none bg-[#7c3aed] flex items-center justify-center text-white shadow-[0_0_16px_rgba(124,58,237,0.6)] transform scale-90 group-hover:scale-100 transition-transform duration-300 ease-out">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      {/* Bottom movie info */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 pt-4">
                        <div className="text-xs font-bold text-white truncate leading-tight">Dune 2</div>
                        <div className="text-[10px] text-gray-400 truncate">Sci-Fi • 2024</div>
                      </div>
                    </div>

                    {/* Cinema Card 2: Oppenheimer */}
                    <div className="group relative aspect-[2/3] bg-black/50 overflow-hidden border border-white/10 hover:border-[#a855f7] hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(168,85,247,0.4)] transition-all duration-500 ease-out hover:z-10">
                      <img
                        src="https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg"
                        alt="Oppenheimer"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      {/* Top badges */}
                      <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                        <span className="px-1.5 py-0.5 bg-black/85 text-[9px] font-bold text-sky-300 border border-sky-400/30">IMAX</span>
                        <span className="px-1.5 py-0.5 bg-purple-950/90 text-[9px] font-bold text-white border border-purple-400/30">★ 8.9</span>
                      </div>
                      {/* Hover play overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-center justify-center">
                        <div className="w-9 h-9 rounded-none bg-[#7c3aed] flex items-center justify-center text-white shadow-[0_0_16px_rgba(124,58,237,0.6)] transform scale-90 group-hover:scale-100 transition-transform duration-300 ease-out">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      {/* Bottom movie info */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 pt-4">
                        <div className="text-xs font-bold text-white truncate leading-tight">Oppenheimer</div>
                        <div className="text-[10px] text-gray-400 truncate">Drame • 2023</div>
                      </div>
                    </div>

                    {/* Cinema Card 3: Interstellar */}
                    <div className="group relative aspect-[2/3] bg-black/50 overflow-hidden border border-white/10 hover:border-[#a855f7] hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(168,85,247,0.4)] transition-all duration-500 ease-out hover:z-10">
                      <img
                        src="https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
                        alt="Interstellar"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      {/* Top badges */}
                      <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                        <span className="px-1.5 py-0.5 bg-black/85 text-[9px] font-bold text-emerald-300 border border-emerald-400/30">HDR10</span>
                        <span className="px-1.5 py-0.5 bg-purple-950/90 text-[9px] font-bold text-white border border-purple-400/30">★ 8.7</span>
                      </div>
                      {/* Hover play overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-center justify-center">
                        <div className="w-9 h-9 rounded-none bg-[#7c3aed] flex items-center justify-center text-white shadow-[0_0_16px_rgba(124,58,237,0.6)] transform scale-90 group-hover:scale-100 transition-transform duration-300 ease-out">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      {/* Bottom movie info */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 pt-4">
                        <div className="text-xs font-bold text-white truncate leading-tight">Interstellar</div>
                        <div className="text-[10px] text-gray-400 truncate">Espace • Culte</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer status line */}
                  <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-none"></span>
                      <span className="text-white/80 font-medium text-[11px] sm:text-xs">Lecteur streaming intégré sans coupure</span>
                    </div>
                    <span className="text-[#a78bfa] font-mono text-[11px] hidden sm:inline">VF & VOSTFR</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Cybersecurity Section */}
      <section id="security" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f5f3ff] rounded-3xl p-8 md:p-16 border border-[#ede9fe] flex flex-col md:flex-row items-center gap-12 fade-up">
            
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-[#ddd6fe] rounded-full animate-ping opacity-20"></div>
                <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center shadow-xl border border-[#ede9fe] text-[#7c3aed]">
                  <ShieldCheck className="w-20 h-20" />
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Security & Digital Protection</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Browse with total peace of mind. LevelUp Ecosystem integrates advanced security protocols and empowers users to identify cyber threats, combat phishing, and safeguard private personal data.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#7c3aed] shrink-0" />
                  <span>Private data defense</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#7c3aed] shrink-0" />
                  <span>Anti-phishing monitoring & alerts</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#7c3aed] shrink-0" />
                  <span>Web security audits</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#7c3aed] shrink-0" />
                  <span>Cyber hygiene & best practices</span>
                </li>
              </ul>

              {/* Security Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  id="security-learn-btn"
                  onClick={() => setSecurityModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer rounded-none"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  id="security-audit-btn"
                  onClick={() => openInquiryWithPackage('Web Security Audit', 'Hello, I would like to request an assessment or audit for our website security.')}
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-6 py-3 font-medium text-sm transition-all shadow-sm cursor-pointer rounded-none"
                >
                  <span>Request Security Audit</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Build-First Zero-Risk Process FAQ Section */}
      <BuildFirstFaq
        onOpenStudio={() => openStudio()}
        onOpenContact={() => openInquiryWithPackage('General Inquiry', 'Hello, I have a question about the build-first zero-risk process.')}
      />

      {/* CTA Contact Section */}
      <section id="contact" className="py-20 bg-white fade-up border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to launch your project with us?</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">Remember: we build your product first, you inspect and validate, and you only pay after complete approval. Get in touch with our team today.</p>
          <p className="text-sm text-gray-500">
            Direct communications & inquiries: <a href="mailto:contact@levelupecosystem.com" className="text-[#7c3aed] font-semibold hover:underline">contact@levelupecosystem.com</a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            
            {/* Column 1: Brand & Mission */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a78bfa]">
                  <path d="M16 1.5L19.53 10.87C19.78 11.52 20.48 11.96 21.18 11.96H30.5L23.04 17.65C22.48 18.08 22.25 18.82 22.45 19.49L25.3 28.86L17.7 23.33C17.16 22.94 16.42 22.94 15.88 23.33L8.28 28.86L11.13 19.49C11.33 18.82 11.1 18.08 10.54 17.65L3.08 11.96H12.4C13.1 11.96 13.8 11.52 14.05 10.87L16 1.5Z" fill="currentColor"/>
                </svg>
                <span className="font-bold text-xl text-white tracking-tight">LevelUp Ecosystem</span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                Next-generation web development and AI ecosystem. We build your high-converting websites, applications, and cloud tools under a zero-risk, approval-first delivery model.
              </p>
            </div>

            {/* Column 2: Request Forms */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Request & Studio</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => openStudio()}
                    className="hover:text-[#c4b5fd] text-[#a78bfa] font-medium transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Start a Project (Studio)</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openInquiryWithPackage()}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Instant Project Form (Faire une demande)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openInquiryWithPackage('Ecosystem Premium (Custom Quote)')}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Custom Quote Request
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openInquiryWithPackage('Starter Website ($350)')}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    Starter Website Order
                  </button>
                </li>
                <li>
                  <a href="mailto:contact@levelupecosystem.com" className="hover:text-white transition-colors">
                    Direct Email Dispatch
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Ecosystem Apps */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Ecosystem Apps</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    onClick={() => navigateTo('movie')}
                    className="hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium text-gray-200"
                  >
                    <span className="text-[#a855f7]">★</span>
                    <span>LevelMovie</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('music')}
                    className="hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <span>LevelMusic</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('weather')}
                    className="hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <span>LevelDay</span>
                  </button>
                </li>
                <li><a href="#security" className="hover:text-white transition-colors">Cybersecurity Center</a></li>
                <li><a href="#process" className="hover:text-white transition-colors">Zero-Risk Guarantee</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Zero-Risk FAQ</a></li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">© 2026 LevelUp Ecosystem. All rights reserved. Built with modern AI and web innovation.</p>
            <div className="flex space-x-6 text-gray-400">
              <a href="https://twitter.com/LevelUpEco" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.94 0 1.7-.76 1.7-1.7s-.76-1.7-1.7-1.7-1.7.76-1.7 1.7.76 1.7 1.7 1.7m1.4 9.74v-8.37H5.06v8.37h2.8z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Instant Contact Form Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-none hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-none bg-[#f5f3ff] text-[#7c3aed] flex items-center justify-center font-bold border border-[#ede9fe]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Quick Project Inquiry</h3>
                <p className="text-xs text-gray-500">Present your project to the LevelUp engineering team</p>
              </div>
            </div>

            {contactSent ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-none bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Inquiry Sent Successfully!</h4>
                <p className="text-sm text-gray-600">Our team will analyze your specifications and respond within 24 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name or Organization</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-none text-sm focus:outline-none focus:border-[#7c3aed] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@example.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-none text-sm focus:outline-none focus:border-[#7c3aed] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Desired Solution</label>
                  <select
                    value={contactForm.projectType}
                    onChange={e => setContactForm(prev => ({ ...prev, projectType: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-none text-sm focus:outline-none focus:border-[#7c3aed] focus:bg-white transition-all"
                  >
                    <option value="Virtual Invitation & Event ($120)">Virtual Invitation & Event ($120)</option>
                    <option value="Starter Website ($350)">Starter Website ($350)</option>
                    <option value="Business Pro ($800)">Business Pro ($800)</option>
                    <option value="Ecosystem Premium (Custom Quote)">Ecosystem Premium (Custom Quote)</option>
                    <option value="Other Custom Project">Other Custom Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Project Details & Vision</label>
                  <textarea
                    required
                    rows={3}
                    value={contactForm.message}
                    onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your goals, requirements, timeline, or specific features..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-none text-sm focus:outline-none focus:border-[#7c3aed] focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium rounded-none transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Submit Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-gray-400 text-center mt-2">Zero upfront commitment: we build first, you approve later.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Security Details Modal (Opened via Learn More in Security section) */}
      {securityModalOpen && (
        <div
          id="security-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSecurityModalOpen(false)}
        >
          <div
            className="bg-white max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSecurityModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-none hover:bg-gray-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-purple-100 text-[#7c3aed] text-xs font-bold uppercase tracking-wider mb-1">
                  <Lock className="w-3 h-3" />
                  <span>Security & Digital Protection Standards</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  How LevelUp Protects Your Digital Presence
                </h3>
              </div>
            </div>

            {/* Security Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              
              {/* Pillar 1 */}
              <div className="p-4 bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2 text-[#7c3aed] font-bold text-sm">
                  <Shield className="w-4 h-4" />
                  <h4>Data Defense & Encryption</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  End-to-end TLS 1.3 in-transit encryption and AES-256 data storage standards ensure all user transactions and communications remain completely confidential.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-4 bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2 text-[#7c3aed] font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <h4>Anti-Phishing & Threat Alerts</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Active monitoring against lookalike domains, credential harvesting, spoofing, and rogue redirection ensures your visitors reach your authentic platforms.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-4 bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2 text-[#7c3aed] font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <h4>Zero-Trust Code Audits</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Strict OWASP Top 10 mitigation routines, automated dependency CVE scanning, and secure headers (CSP, CORS, HSTS) are baked into every build.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="p-4 bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-2 mb-2 text-[#7c3aed] font-bold text-sm">
                  <Lock className="w-4 h-4" />
                  <h4>Privacy-First Architecture</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Zero sale of customer data, zero invasive third-party tracking scripts, and strict compliance with global privacy standards (GDPR-ready).
                </p>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSecurityModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSecurityModalOpen(false);
                  openInquiryWithPackage('Web Security Audit', 'Hello, I would like to schedule a security consultation and audit for our website or application.');
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Security Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

        </div>
      )}
    </>
  );
}
