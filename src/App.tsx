import React, { useState, useEffect, useRef } from 'react';
import {
  Code, Cpu, Sparkles, Check, Star, ArrowRight, Headphones,
  Sun, Tv, ShieldCheck, CheckCircle2, Mail, Menu, X,
  Music, CloudSun, Film, PlayCircle, ArrowLeft, Send
} from 'lucide-react';
import LevelMovieApp from './LevelMovieApp';
import { LevelMusicApp } from './components/apps/LevelMusicApp';
import { LevelDayApp } from './components/apps/LevelDayApp';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // App views: 'ecosystem' (default home) or integrated apps ('movie', 'music', 'weather')
  const [currentAppView, setCurrentAppView] = useState<'ecosystem' | 'movie' | 'music' | 'weather'>('ecosystem');
  
  // Contact modal state
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', projectType: 'Site Basique (350$)', message: '' });
  const [contactSent, setContactSent] = useState(false);

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
      setContactForm({ name: '', email: '', projectType: 'Site Basique (350$)', message: '' });
    }, 2200);
  };

  // If user selected LevelMovie from Hub Films & Animes
  if (currentAppView === 'movie') {
    return (
      <div className="relative w-full min-h-screen levelmovie-app bg-[#060608]">
        {/* Top return banner to LevelUp Ecosystem */}
        <div className="sticky top-0 z-[9999] bg-[#0c0c14]/95 backdrop-blur-md border-b border-[#7c3aed]/30 px-4 py-2.5 flex items-center justify-between text-xs text-white">
          <button
            onClick={() => setCurrentAppView('ecosystem')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Retour à LevelUp Ecosystem</span>
          </button>
          <div className="flex items-center gap-2 text-white/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Écosystème LevelUp • Hub Streaming Actif</span>
          </div>
        </div>
        <LevelMovieApp onBackToEcosystem={() => setCurrentAppView('ecosystem')} />
      </div>
    );
  }

  // If user selected LevelMusic from Extraits Musicaux
  if (currentAppView === 'music') {
    return (
      <div className="relative w-full min-h-screen bg-[#07080f] text-white">
        <div className="sticky top-0 z-[9999] bg-[#0c0c14]/95 backdrop-blur-md border-b border-[#7c3aed]/30 px-4 py-2.5 flex items-center justify-between text-xs text-white">
          <button
            onClick={() => setCurrentAppView('ecosystem')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Retour à LevelUp Ecosystem</span>
          </button>
          <div className="flex items-center gap-2 text-white/60">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span>Écosystème LevelUp • LevelMusic</span>
          </div>
        </div>
        <div className="h-[calc(100vh-48px)]">
          <LevelMusicApp onClose={() => setCurrentAppView('ecosystem')} />
        </div>
      </div>
    );
  }

  // If user selected LevelDay from Météo en Direct
  if (currentAppView === 'weather') {
    return (
      <div className="relative w-full min-h-screen bg-[#02050e] text-white">
        <div className="sticky top-0 z-[9999] bg-[#0c0c14]/95 backdrop-blur-md border-b border-cyan-500/30 px-4 py-2.5 flex items-center justify-between text-xs text-white">
          <button
            onClick={() => setCurrentAppView('ecosystem')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Retour à LevelUp Ecosystem</span>
          </button>
          <div className="flex items-center gap-2 text-white/60">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Écosystème LevelUp • LevelDay Météo</span>
          </div>
        </div>
        <div className="h-[calc(100vh-48px)]">
          <LevelDayApp onClose={() => setCurrentAppView('ecosystem')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      
      {/* Navbar (Sticky, Frosted Glass effect) */}
      <header
        className={`fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
        id="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer select-none"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {/* Etoile Violette */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#7c3aed]">
                <path d="M16 1.5L19.53 10.87C19.78 11.52 20.48 11.96 21.18 11.96H30.5L23.04 17.65C22.48 18.08 22.25 18.82 22.45 19.49L25.3 28.86L17.7 23.33C17.16 22.94 16.42 22.94 15.88 23.33L8.28 28.86L11.13 19.49C11.33 18.82 11.1 18.08 10.54 17.65L3.08 11.96H12.4C13.1 11.96 13.8 11.52 14.05 10.87L16 1.5Z" fill="currentColor"/>
              </svg>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                LevelUp <span className="font-medium text-[#7c3aed]">Ecosystem</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-600 hover:text-[#7c3aed] font-medium transition-colors">Services</a>
              <a href="#tarifs" className="text-gray-600 hover:text-[#7c3aed] font-medium transition-colors">Nos Offres</a>
              <a href="#process" className="text-gray-600 hover:text-[#7c3aed] font-medium transition-colors">Processus</a>
              <a href="#ecosysteme" className="text-gray-600 hover:text-[#7c3aed] font-medium transition-colors">Écosystème</a>
              <a href="#securite" className="text-gray-600 hover:text-[#7c3aed] font-medium transition-colors">Sécurité</a>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex">
              <a
                href="#contact"
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
              >
                Rejoindre l'écosystème
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#7c3aed] hover:bg-gray-50"
              >
                Services
              </a>
              <a
                href="#tarifs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#7c3aed] hover:bg-gray-50"
              >
                Nos Offres
              </a>
              <a
                href="#process"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#7c3aed] hover:bg-gray-50"
              >
                Processus
              </a>
              <a
                href="#ecosysteme"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#7c3aed] hover:bg-gray-50"
              >
                Écosystème
              </a>
              <a
                href="#securite"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-[#7c3aed] hover:bg-gray-50"
              >
                Sécurité
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block mt-4 text-center px-3 py-3 rounded-md text-base font-medium bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
              >
                Rejoindre l'écosystème
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="pt-28 lg:pt-36 pb-20 overflow-hidden bg-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto fade-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8">
              L'intelligence artificielle au service de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-indigo-600">votre écosystème.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              LevelUp Ecosystem est une plateforme technologique avancée. Nous concevons vos sites web et applications web avec l'aide de l'IA, tout en offrant des outils quotidiens gratuits et une protection de pointe pour votre vie numérique.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#services"
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-lg shadow-[#7c3aed]/30 flex items-center justify-center gap-2"
              >
                <span>Découvrir nos solutions</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#tarifs"
                className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Voir les tarifs</span>
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
            <h2 className="text-[#7c3aed] font-semibold tracking-wide uppercase text-sm mb-3">Développement & Innovation</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Des solutions technologiques de haute précision.</h3>
            <p className="text-lg text-gray-600">Nous combinons l'expertise humaine et l'intelligence artificielle pour concevoir des sites web et des applications robustes, avec un design irréprochable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-[#c4b5fd] hover:shadow-card transition-all duration-300 fade-up">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#7c3aed] mb-6 border border-gray-200">
                <Code className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Sites Web Sur Mesure</h4>
              <p className="text-gray-600 leading-relaxed">De la page vitrine au site e-commerce complexe, nous structurons chaque projet pour garantir performance, rapidité et ergonomie optimale.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-[#c4b5fd] hover:shadow-card transition-all duration-300 fade-up" style={{ transitionDelay: '100ms' }}>
              <div className="w-12 h-12 bg-[#7c3aed] rounded-lg flex items-center justify-center shadow-sm text-white mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Architecture IA</h4>
              <p className="text-gray-600 leading-relaxed">Nos processus assistés par IA garantissent une qualité professionnelle supérieure, des standards de code rigoureux et un design comparable aux plus grandes plateformes tech.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-[#c4b5fd] hover:shadow-card transition-all duration-300 fade-up" style={{ transitionDelay: '200ms' }}>
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#7c3aed] mb-6 border border-gray-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Applications Web & Événements</h4>
              <p className="text-gray-600 leading-relaxed">Création d'applications web dynamiques et de superbes invitations virtuelles interactives personnalisées pour vos événements prestigieux.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Process Section */}
      <section id="process" className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            <h2 className="text-[#7c3aed] font-semibold tracking-wide uppercase text-sm mb-3">Méthodologie de confiance</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Notre engagement : Zéro risque pour vous.</h3>
            <p className="text-lg text-gray-600">Nous croyons en la transparence totale. C'est pourquoi nous travaillons selon un processus de validation strict avant tout paiement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative fade-up">
              <div className="text-[#7c3aed] font-bold text-4xl mb-4">01</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Construction Initiale</h4>
              <p className="text-gray-600">Nous construisons l'intégralité de votre site web ou de votre application selon vos critères exacts sans exiger de paiement anticipé.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative fade-up" style={{ transitionDelay: '100ms' }}>
              <div className="text-[#7c3aed] font-bold text-4xl mb-4">02</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Présentation & Validation</h4>
              <p className="text-gray-600">Nous vous présentons une version de démonstration interactive de votre projet fini. Vous visualisez le résultat réel.</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative fade-up" style={{ transitionDelay: '200ms' }}>
              <div className="text-[#7c3aed] font-bold text-4xl mb-4">03</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Paiement & Finalisation</h4>
              <p className="text-gray-600">Une fois que le projet vous satisfait pleinement, vous effectuez le paiement et nous finalisons le déploiement en ligne.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Pro SaaS Style) */}
      <section id="tarifs" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            <h2 className="text-[#7c3aed] font-semibold tracking-wide uppercase text-sm mb-3">Nos Offres et Tarifs</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Des formules claires adaptées à chaque besoin.</h3>
            <p className="text-lg text-gray-600">Des abonnements et forfaits professionnels conçus pour maximiser votre impact avec un rapport qualité-prix sans compromis.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* Invitations / Petits Projets */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col fade-up hover:border-[#c4b5fd] transition-all">
              <h4 className="text-lg font-bold text-gray-900 mb-1">Invitation & Événement</h4>
              <p className="text-gray-500 text-xs mb-6 h-10">Idéal pour mariages, anniversaires ou lancements.</p>
              <div className="mb-6">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">À partir de</span>
                <div className="text-3xl font-extrabold text-gray-900 mt-1">120$</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Invitation virtuelle interactive</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Design sur mesure</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Formulaire RSVP intégré</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Hébergement inclus</span>
                </li>
              </ul>
              <a
                href="#contact"
                className="block w-full py-2.5 px-4 bg-white text-gray-900 font-medium text-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-sm shadow-sm"
              >
                Commander
              </a>
            </div>

            {/* Basic Plan */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col fade-up hover:border-[#c4b5fd] transition-all" style={{ transitionDelay: '100ms' }}>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Site Basique</h4>
              <p className="text-gray-500 text-xs mb-6 h-10">La solution essentielle pour établir votre présence pro.</p>
              <div className="mb-6">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">À partir de</span>
                <div className="text-3xl font-extrabold text-gray-900 mt-1">350$</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Site vitrine professionnel (1-3 pages)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Design 100% responsif mobile</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Formulaire de contact pro</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Construction avant paiement</span>
                </li>
              </ul>
              <a
                href="#contact"
                className="block w-full py-2.5 px-4 bg-white text-gray-900 font-medium text-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-sm shadow-sm"
              >
                Démarrer
              </a>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex flex-col relative shadow-xl fade-up z-10" style={{ transitionDelay: '200ms' }}>
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                <span className="bg-[#8b5cf6] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wide rounded-full shadow-md">Populaire</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Business Pro</h4>
              <p className="text-gray-400 text-xs mb-6 h-10">Pour développer vos ventes et asseoir votre image.</p>
              <div className="mb-6">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">À partir de</span>
                <div className="text-3xl font-extrabold text-white mt-1">800$</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#a78bfa] shrink-0 mt-0.5" />
                  <span className="text-gray-300">Jusqu'à 10 pages optimisées</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#a78bfa] shrink-0 mt-0.5" />
                  <span className="text-gray-300">Modules E-commerce ou Réservation</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#a78bfa] shrink-0 mt-0.5" />
                  <span className="text-gray-300">Référencement SEO avancé</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#a78bfa] shrink-0 mt-0.5" />
                  <span className="text-gray-300">1 an de maintenance offert</span>
                </li>
              </ul>
              <a
                href="#contact"
                className="block w-full py-2.5 px-4 bg-[#7c3aed] text-white font-medium text-center rounded-lg hover:bg-[#8b5cf6] transition-colors text-sm shadow-md"
              >
                Choisir Pro
              </a>
            </div>

            {/* Premium Plan with 3 years follow-up */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col fade-up hover:border-[#c4b5fd] transition-all shadow-sm" style={{ transitionDelay: '300ms' }}>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Premium Écosystème</h4>
              <p className="text-gray-500 text-xs mb-6 h-10">L'application web haut de gamme avec suivi prolongé.</p>
              <div className="mb-6">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sur devis</span>
                <div className="text-3xl font-extrabold text-gray-900 mt-1">Sur Mesure</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1 text-sm">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600 font-medium">Développement Web App complet</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Base de données & cloud sécurisé</span>
                </li>
                <li className="flex items-start gap-2.5 bg-[#f5f3ff] p-2 rounded border border-[#ede9fe]">
                  <Star className="w-4 h-4 text-[#7c3aed] shrink-0 mt-0.5 fill-[#7c3aed]" />
                  <span className="text-[#4c1d95] font-semibold text-xs leading-tight">Suivi et maintenance garantis sur 3 ans</span>
                </li>
              </ul>
              <a
                href="#contact"
                className="block w-full py-2.5 px-4 bg-gray-50 text-gray-900 font-medium text-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-sm"
              >
                Contact expert
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* The Ecosystem (Free Daily Tools) */}
      <section id="ecosysteme" className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#7c3aed] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="lg:w-1/2 fade-up">
              <h2 className="text-[#a78bfa] font-semibold tracking-wide uppercase text-sm mb-3">Outils du quotidien</h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Un véritable écosystème de services <span className="text-[#a78bfa]">gratuits.</span>
              </h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                En plus de nos prestations professionnelles, LevelUp met à disposition du public des outils utilitaires intégrés pour enrichir votre quotidien en toute liberté.
              </p>
              
              <ul className="space-y-6">
                <li
                  onClick={() => setCurrentAppView('music')}
                  className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 text-[#a78bfa] mt-1 group-hover:bg-[#7c3aed] group-hover:text-white transition-colors">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 group-hover:text-[#a78bfa] transition-colors flex items-center gap-2">
                      <span>Extraits Musicaux (30 sec)</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-500/30">Tester</span>
                    </h4>
                    <p className="text-gray-400 text-sm">Écoutez des aperçus rapides des dernières tendances musicales directement sur notre plateforme.</p>
                  </div>
                </li>
                
                <li
                  onClick={() => setCurrentAppView('weather')}
                  className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 text-[#a78bfa] mt-1 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                      <span>Météo en Direct</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/30">Consulter</span>
                    </h4>
                    <p className="text-gray-400 text-sm">Consultez instantanément les conditions météorologiques et prévisions pour vos villes favorites.</p>
                  </div>
                </li>
                
                <li
                  onClick={() => setCurrentAppView('movie')}
                  className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 text-[#a78bfa] mt-1 group-hover:bg-[#7c3aed] group-hover:text-white transition-colors">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 group-hover:text-[#a78bfa] transition-colors flex items-center gap-2">
                      <span>Hub Films & Animes</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-500/30">LevelMovie</span>
                    </h4>
                    <p className="text-gray-400 text-sm">Informations, résumés et actualités sur vos films, séries et animés cultes du moment.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Bento Grid for Tools */}
            <div className="lg:w-1/2 w-full fade-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Music Bento Box */}
                <div
                  onClick={() => setCurrentAppView('music')}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <Headphones className="w-8 h-8 text-[#a78bfa] mb-4 group-hover:scale-110 transition-transform" />
                    <div className="h-2 w-1/2 bg-gray-700 rounded mb-2"></div>
                    <div className="h-2 w-3/4 bg-gray-700 rounded"></div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    <PlayCircle className="w-7 h-7 text-white group-hover:text-[#a78bfa] transition-colors" />
                  </div>
                </div>

                {/* Weather Bento Box */}
                <div
                  onClick={() => setCurrentAppView('weather')}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <Sun className="w-8 h-8 text-yellow-400 mb-4 group-hover:rotate-45 transition-transform" />
                    <div className="text-2xl font-bold text-white mb-1">24°C</div>
                    <div className="text-gray-400 text-sm">Météo en temps réel</div>
                  </div>
                  <div className="mt-4 h-1 w-full bg-gray-700 rounded overflow-hidden">
                    <div className="h-full bg-yellow-400 w-2/3"></div>
                  </div>
                </div>

                {/* Movie Hub Bento Box */}
                <div
                  onClick={() => setCurrentAppView('movie')}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-[#7c3aed] transition-all sm:col-span-2 cursor-pointer group"
                >
                  <div className="flex justify-between items-center mb-4">
                    <Tv className="w-8 h-8 text-[#a78bfa] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold bg-gray-700 group-hover:bg-[#7c3aed] group-hover:text-white text-gray-300 px-2 py-1 rounded transition-colors">
                      Films & Animes
                    </span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="h-24 w-16 bg-gray-700 rounded-md shrink-0 overflow-hidden relative group-hover:shadow-lg transition-all">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-1">
                        <span className="text-[8px] font-bold text-purple-300 uppercase">HD</span>
                      </div>
                    </div>
                    <div className="space-y-3 flex-1 pt-1">
                      <div className="h-2.5 w-full bg-gray-600 rounded"></div>
                      <div className="h-2 w-5/6 bg-gray-700 rounded"></div>
                      <div className="h-2 w-4/6 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Cybersecurity Section */}
      <section id="securite" className="py-24 bg-white">
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sécurité & Protection Numérique</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Naviguez en toute sérénité. LevelUp Ecosystem intègre des protocoles de protection avancés et aide les utilisateurs à identifier les menaces en ligne, contrer le phishing et sécuriser leurs données personnelles.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#7c3aed] shrink-0" />
                  <span>Protection des données privées</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#7c3aed] shrink-0" />
                  <span>Prévention et veille anti-phishing</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#7c3aed] shrink-0" />
                  <span>Audits de sécurité web</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#7c3aed] shrink-0" />
                  <span>Conseils et guides préventifs</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Contact Section */}
      <section id="contact" className="py-20 bg-white fade-up border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Prêt à lancer votre projet avec nous ?</h2>
          <p className="text-lg text-gray-600 mb-10">Rappelez-vous : nous construisons votre site d'abord, vous validez, et vous ne payez qu'ensuite. Contactez-nous dès aujourd'hui.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:contact@levelupecosystem.com"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Commencer un projet</span>
              <Mail className="w-5 h-5" />
            </a>
            <button
              onClick={() => setContactModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-[#f5f3ff] hover:bg-[#ede9fe] text-[#6d28d9] border border-[#ddd6fe] px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>Formulaire instantané</span>
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#7c3aed]">
                  <path d="M16 1.5L19.53 10.87C19.78 11.52 20.48 11.96 21.18 11.96H30.5L23.04 17.65C22.48 18.08 22.25 18.82 22.45 19.49L25.3 28.86L17.7 23.33C17.16 22.94 16.42 22.94 15.88 23.33L8.28 28.86L11.13 19.49C11.33 18.82 11.1 18.08 10.54 17.65L3.08 11.96H12.4C13.1 11.96 13.8 11.52 14.05 10.87L16 1.5Z" fill="currentColor"/>
                </svg>
                <span className="font-bold text-lg text-gray-900">LevelUp Ecosystem</span>
              </div>
              <p className="text-gray-500 mb-6 max-w-sm">
                L'intelligence artificielle et l'innovation web regroupées dans une plateforme unique, au service de vos projets.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Solutions</h4>
              <ul className="space-y-3">
                <li><a href="#tarifs" className="text-gray-500 hover:text-[#7c3aed] transition-colors">Invitations (120$)</a></li>
                <li><a href="#tarifs" className="text-gray-500 hover:text-[#7c3aed] transition-colors">Sites Basiques (350$)</a></li>
                <li><a href="#tarifs" className="text-gray-500 hover:text-[#7c3aed] transition-colors">Offres Pro & Sur Mesure</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Écosystème</h4>
              <ul className="space-y-3">
                <li><button onClick={() => setCurrentAppView('music')} className="text-gray-500 hover:text-[#7c3aed] transition-colors text-left cursor-pointer">Musique & Média</button></li>
                <li><button onClick={() => setCurrentAppView('weather')} className="text-gray-500 hover:text-[#7c3aed] transition-colors text-left cursor-pointer">Météo en direct</button></li>
                <li><button onClick={() => setCurrentAppView('movie')} className="text-gray-500 hover:text-[#7c3aed] transition-colors text-left cursor-pointer">Hub Films & Animes</button></li>
                <li><a href="#securite" className="text-gray-500 hover:text-[#7c3aed] transition-colors">Sécurité Numérique</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2026 LevelUp Ecosystem. Tous droits réservés.</p>
            <div className="flex space-x-6 text-gray-400">
              <a href="https://twitter.com/LevelUpEco" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.94 0 1.7-.76 1.7-1.7s-.76-1.7-1.7-1.7-1.7.76-1.7 1.7.76 1.7 1.7 1.7m1.4 9.74v-8.37H5.06v8.37h2.8z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Instant Contact Form Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#f5f3ff] text-[#7c3aed] flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Contact Rapide</h3>
                <p className="text-xs text-gray-500">Présentez votre projet à l'équipe LevelUp</p>
              </div>
            </div>

            {contactSent ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Demande envoyée avec succès !</h4>
                <p className="text-sm text-gray-600">Notre équipe analysera votre projet et vous répondra sous 24h ouvrées.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Votre Nom / Entreprise</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Jean Dupont"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7c3aed] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Adresse Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="jean.dupont@example.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7c3aed] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Formule Souhaitée</label>
                  <select
                    value={contactForm.projectType}
                    onChange={e => setContactForm(prev => ({ ...prev, projectType: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7c3aed] focus:bg-white transition-all"
                  >
                    <option value="Invitation & Événement (120$)">Invitation & Événement (120$)</option>
                    <option value="Site Basique (350$)">Site Basique (350$)</option>
                    <option value="Business Pro (800$)">Business Pro (800$)</option>
                    <option value="Premium Écosystème (Sur Mesure)">Premium Écosystème (Sur Mesure)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Détails de votre projet</label>
                  <textarea
                    required
                    rows={3}
                    value={contactForm.message}
                    onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Décrivez vos attentes, délais et fonctionnalités souhaitées..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7c3aed] focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Envoyer la demande</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-gray-400 text-center mt-2">Zéro engagement : nous construisons d'abord, vous validez ensuite.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
