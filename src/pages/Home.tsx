import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Star3DHero from '../components/Star3DHero';
import Service3DShowcaseDeck from '../components/Service3DShowcaseDeck';
import HeroIconRotator from '../components/HeroIconRotator';
import WhoItsForSection from '../components/WhoItsForSection';
import VideoPlayer from '../components/VideoPlayer';

export default function Home() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('contact@levelup-ecosystem.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="relative">
      <SEO
        title="LevelUp Ecosystem | Websites for Businesses & Creators"
        description="Fast, professional websites with online booking and security built in, for local businesses, creators and portfolios. Get a free preview."
        canonical="/"
      />

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-10 sm:pt-16 pb-20 sm:pb-28 px-4 sm:px-8 border-b border-white/[0.08] overflow-hidden bg-[#0B0B14]">
        {/* Clean, deep studio radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-[#7C3AED]/12 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left" data-reveal>
            {/* Signature 3D Star insignia alongside header metadata */}
            <div className="flex items-center gap-4">
              <Star3DHero />
              <div>
                <div className="text-xs sm:text-sm font-bold tracking-wider text-[#A78BFA] uppercase">
                  Independent Web Studio &amp; Security
                </div>
                <div className="text-xs text-[#A1A1B5] font-mono mt-0.5">
                  Built in San Diego, CA
                </div>
              </div>
            </div>

            {/* H1 (Unchanged) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
              Websites that look professional and are built secure.
            </h1>

            {/* Icon Rotator: "Made for <rotating word>" next to borderless 3D icon */}
            <HeroIconRotator />

            <p className="text-base sm:text-lg text-[#A1A1B5] leading-relaxed font-normal max-w-xl">
              For local businesses, creators and portfolios. Preview your new site before you decide.
            </p>

            <div className="pt-2 space-y-3">
              <div>
                <Link
                  to="/preview"
                  className="inline-flex items-center px-7 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm sm:text-base transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 cursor-pointer"
                >
                  Get a free preview
                </Link>
              </div>

              <div className="text-xs sm:text-sm text-[#A1A1B5] font-medium">
                Free preview. No obligation to purchase.
              </div>
            </div>

            {/* Quick stats */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/[0.08] max-w-md">
              <div>
                <div className="text-xl font-bold text-white">&lt; 2s</div>
                <div className="text-[11px] text-[#A78BFA]">Mobile load speed</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">24/7</div>
                <div className="text-[11px] text-[#A78BFA]">Online booking</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">Protected</div>
                <div className="text-[11px] text-[#A78BFA]">From day one</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Product Zoom Trio Card Deck replacing the old big card */}
          <div className="lg:col-span-6 flex justify-center py-2" data-reveal>
            <Service3DShowcaseDeck />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* "WHO IT'S FOR" SECTION                                        */}
      {/* ------------------------------------------------------------- */}
      <WhoItsForSection />

      {/* ------------------------------------------------------------- */}
      {/* 3-STEP PROCESS PREVIEW                                        */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 bg-[#0B0B14] border-b border-white/[0.08] relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" data-reveal>
            <div className="space-y-2 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                Simple Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                From idea to live site in 3 steps
              </h2>
            </div>
            <div>
              <Link
                to="/process"
                className="text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Learn how we build with security checks →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left" data-reveal-group>
            <div
              onMouseMove={handleCardMouseMove}
              className="group relative p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-4 overflow-hidden"
              data-reveal
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.07), transparent 80%)',
                }}
              />
              <div className="text-xs font-mono font-bold text-[#A78BFA]">
                STEP 01
              </div>
              <h3 className="text-lg font-bold text-white">
                Discovery &amp; Free Preview
              </h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Tell us about your business goals and style preferences. Within 24 to 48 hours, we assemble a functional mobile preview so you can experience how your site will look and feel before spending a dollar.
              </p>
            </div>

            <div
              onMouseMove={handleCardMouseMove}
              className="group relative p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-4 overflow-hidden"
              data-reveal
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.07), transparent 80%)',
                }}
              />
              <div className="text-xs font-mono font-bold text-[#A78BFA]">
                STEP 02
              </div>
              <h3 className="text-lg font-bold text-white">
                Build &amp; Security Check
              </h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Once approved, we build your complete site with fast loading speeds, seamless booking, and technical hardening: SSL certificates, 2FA on admin logins, and spam honeypot filters.
              </p>
            </div>

            <div
              onMouseMove={handleCardMouseMove}
              className="group relative p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-4 overflow-hidden"
              data-reveal
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.07), transparent 80%)',
                }}
              />
              <div className="text-xs font-mono font-bold text-[#A78BFA]">
                STEP 03
              </div>
              <h3 className="text-lg font-bold text-white">
                Launch &amp; Care
              </h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                We go live on your custom domain, connect your Google Maps profile, and set up daily backups. Our optional monthly care plan ensures your software remains updated and safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FEATURED PROJECT : Final Stop Barber Shop & Salon             */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#0B0B14] border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left" data-reveal>
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                Featured Client Work
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Real results for a modern business
              </p>
            </div>
            <div>
              <Link
                to="/projects"
                className="text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                View all projects →
              </Link>
            </div>
          </div>

          <div className="bg-[#14141F] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 hover:border-[#7C3AED]/40 transition-all duration-300 text-left" data-reveal>
            <div className="lg:col-span-7 aspect-video sm:aspect-[16/10] overflow-hidden border-b lg:border-b-0 lg:border-r border-white/[0.08] relative">
              <picture>
                <source type="image/avif" srcSet="/assets/img/finalstop-desktop.avif" />
                <source type="image/webp" srcSet="/assets/img/finalstop-desktop.webp" />
                <img
                  src="/assets/img/finalstop-desktop.jpg"
                  alt="Final Stop Barber Shop &amp; Salon desktop website showcase"
                  loading="lazy"
                  decoding="async"
                  width="1000"
                  height="625"
                  className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500"
                />
              </picture>
            </div>

            <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#A78BFA] uppercase tracking-wider">
                  Barbershop &amp; Braiding Lounge
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Final Stop Barber Shop &amp; Salon
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  A high-speed, mobile-first website for a premier unisex barbershop and braiding lounge with integrated 24/7 online appointment booking.
                </p>
                <div className="pt-1 flex items-center gap-3 text-xs font-semibold text-[#10B981]">
                  <span>✓ +40% Appointment Bookings</span>
                  <span>•</span>
                  <span>✓ &lt; 1.8s Load Speed</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  to="/projects/final-stop"
                  className="block w-full py-2.5 px-5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold text-center transition-all duration-200 shadow-md shadow-[#7C3AED]/25"
                >
                  Read full case study with before/after slider →
                </Link>

                <div className="flex items-center gap-3">
                  <a
                    href="https://finalstop.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-medium text-center border border-white/[0.1] transition-all"
                  >
                    Visit finalstop.org ↗
                  </a>
                  <Link
                    to="/websites-for/barbershops"
                    className="flex-1 py-2 px-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#A78BFA] hover:text-white text-xs font-medium text-center border border-white/[0.1] transition-all"
                  >
                    Barbershop sites
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SERVICES DIRECTORY (WIX-STYLE CLEAN TABLE LAYOUT)             */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#0B0B14] border-b border-white/[0.08] relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left" data-reveal>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                Catalogue des Solutions &amp; Services
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                All Services &amp; Specialties
              </h2>
              <p className="text-sm sm:text-base text-[#A1A1B5] max-w-xl leading-relaxed">
                Simple, transparent, without useless bloat or hidden fees. Choose your category to explore features.
              </p>
            </div>
            <div>
              <Link
                to="/services"
                className="text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <span>View complete services directory</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Wix-Style Clean Directory Table (Zero bloated borders, pure clean typography) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 text-left" data-reveal>
            {/* Column 1: LOCAL BUSINESS & COMMERCE */}
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1B5] pb-3 border-b border-white/[0.12]">
                Local Business &amp; Commerce
              </div>
              <div className="space-y-6">
                <Link to="/websites-for/barbershops" className="group block">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                    <span>Barbershop Websites</span>
                    <span className="text-xs text-[#71717A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed mt-1">
                    24/7 online chair booking, barber rosters &amp; Google Maps ranking with zero interruptions.
                  </p>
                </Link>

                <Link to="/websites-for/salons" className="group block">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                    <span>Salon &amp; Beauty Websites</span>
                    <span className="text-xs text-[#71717A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed mt-1">
                    Stylist portfolio showcases, clear pricing tiers, and automated multi-service scheduling.
                  </p>
                </Link>

                <Link to="/services/online-stores" className="group block">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                    <span>Small Online Stores</span>
                    <span className="text-xs text-[#71717A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed mt-1">
                    Frictionless checkout for merchandise, physical goods, and digital downloads without high fees.
                  </p>
                </Link>

                <Link to="/services/local-business-websites" className="group block">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                    <span>Local Business Sites</span>
                    <span className="text-xs text-[#71717A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed mt-1">
                    Google Business Profile sync, neighborhood map rankings, and click-to-navigate GPS directions.
                  </p>
                </Link>
              </div>
            </div>

            {/* Column 2: CREATORS & PORTFOLIOS */}
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1B5] pb-3 border-b border-white/[0.12]">
                Creators &amp; Showcases
              </div>
              <div className="space-y-6">
                <Link to="/services/creator-websites" className="group block">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                    <span>Creator Websites</span>
                    <span className="text-xs text-[#71717A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed mt-1">
                    Custom link-in-bio hub on your own domain, media kit for brand deals, and direct newsletter capture.
                  </p>
                </Link>

                <Link to="/services/portfolio-websites" className="group block">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                    <span>Portfolio Websites</span>
                    <span className="text-xs text-[#71717A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed mt-1">
                    Clean, high-resolution project showcases with sub-second page loads for designers, artists &amp; pros.
                  </p>
                </Link>

                <Link to="/preview" className="group block">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                    <span>Landing Pages</span>
                    <span className="text-xs text-[#71717A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed mt-1">
                    Single-page websites engineered for product launches, event promotions, and lead conversion.
                  </p>
                </Link>

                <Link to="/preview" className="group block">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                    <span>Events &amp; Gatherings</span>
                    <span className="text-xs text-[#71717A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed mt-1">
                    Interactive digital RSVP coordination, venue directions, schedule itinerary, and photo galleries.
                  </p>
                </Link>
              </div>
            </div>

            {/* Column 3: SECURITY & ESSENTIALS */}
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A1A1B5] pb-3 border-b border-white/[0.12]">
                Security &amp; Essentials
              </div>
              <div className="space-y-6">
                <Link to="/services/security-check" className="group block">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                    <span>Website Security Check</span>
                    <span className="text-xs text-[#71717A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed mt-1">
                    Plain-English review of database rules, HTTPS, exposed API keys, backups and account protection.
                  </p>
                </Link>

                <Link to="/services/care-plans" className="group block">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                    <span>Website Care Plans</span>
                    <span className="text-xs text-[#71717A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed mt-1">
                    Fast cloud hosting, daily automated backups, security monitoring, and on-demand content edits.
                  </p>
                </Link>

                <Link to="/services/local-business-websites" className="group block">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                    <span>Online Booking System</span>
                    <span className="text-xs text-[#71717A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed mt-1">
                    Calendar sync, automated SMS/email reminders, and customer self-scheduling around the clock.
                  </p>
                </Link>

                <Link to="/security" className="group block">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                    <span>Engineering Hardening</span>
                    <span className="text-xs text-[#71717A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed mt-1">
                    Strict CSP headers, deny-by-default rules, honeypot anti-spam, and zero browser secrets.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STUDIO PHILOSOPHY & VIDEO DEMO                                */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 bg-[#0B0B14] border-b border-white/[0.08] relative overflow-hidden">
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#14141F] border border-white/[0.08] p-8 sm:p-12 text-left relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10" data-reveal>
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
              Studio Philosophy &amp; Technology
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI-assisted. Human-directed. Security-checked.
            </h2>
            <p className="text-base text-[#A1A1B5] leading-relaxed">
              We use modern AI tools to design and build websites faster, which keeps prices fair for small businesses and independent creators. Every project is planned, reviewed, and tested before launch, with security checks on database rules, exposed keys, HTTPS, backups, and account protection.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/process"
                className="px-6 py-3 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-[#7C3AED]/25"
              >
                Read full process breakdown
              </Link>

              <span className="text-xs text-[#A1A1B5] flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Zero client data shared with AI models.</span>
              </span>
            </div>
          </div>

          {/* Real Studio Demo Video */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-white/[0.12] bg-black shadow-xl aspect-[16/10] relative">
            <VideoPlayer
              webmSrc="/assets/video/studio-demo.webm"
              mp4Src="/assets/video/studio-demo.mp4"
              posterWebp="/assets/video/studio-demo-poster.webp"
              posterJpg="/assets/video/studio-demo-poster.jpg"
              alt="LevelUp Studio automated preview demonstration"
              caption="Studio interactive preview demo"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FINAL CALL TO ACTION WITH 3D STAR                             */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-8 bg-[#14141F] relative overflow-hidden">
        {/* Subtle purple radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#7C3AED]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-7 relative z-10" data-reveal>
          {/* Centered 3D Star Insignia */}
          <div className="flex justify-center pb-2">
            <Star3DHero />
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
              Free preview ready in 24–48 hours
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Ready to elevate your online presence?
            </h2>

            <p className="text-base text-[#A1A1B5]">
              Tell us about your business or vision. We will assemble a working mobile preview for you to review before making any commitment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/preview"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 text-center"
            >
              Get a free preview
            </Link>

            <button
              onClick={copyEmail}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium text-sm border border-white/[0.1] transition-all cursor-pointer"
            >
              {copiedEmail ? 'Email copied!' : 'contact@levelup-ecosystem.com'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
