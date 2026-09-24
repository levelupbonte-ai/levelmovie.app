import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Star3DHero from '../components/Star3DHero';
import FloatingWindowsHero from '../components/FloatingWindowsHero';

export default function Home() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('contact@levelup-ecosystem.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div>
      <SEO
        title="LevelUp Ecosystem | Websites for Businesses & Creators"
        description="Fast, professional websites with online booking and security built in, for local businesses, creators and portfolios. Get a free preview."
        canonical="/"
      />

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION : Subtle radial purple glow, faceted shapes      */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-10 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-8 border-b border-white/[0.08] overflow-hidden">
        {/* Subtle radial purple glow echoing logo */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#7C3AED]/12 rounded-full blur-[140px] pointer-events-none" />

        {/* Floating low-opacity faceted shapes (3-4 slow shapes) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          <svg
            className="absolute top-12 right-10 w-28 h-28 opacity-[0.06] animate-[floatPiece_14s_ease-in-out_infinite]"
            viewBox="0 0 100 100"
            fill="none"
          >
            <polygon points="50,6 60.58,35.44 91.85,36.4 67.12,55.56 75.86,85.6 50,68 24.14,85.6 32.88,55.56 8.15,36.4 39.42,35.44" stroke="#7C3AED" strokeWidth="1.5" />
          </svg>
          <svg
            className="absolute bottom-16 left-6 w-20 h-20 opacity-[0.05] animate-[floatPiece_18s_ease-in-out_infinite_reverse]"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path d="M 50,50 L 39.42,35.44 L 50,6 Z" fill="#DDD6FE" />
            <path d="M 50,50 L 50,6 L 60.58,35.44 Z" fill="#8B5CF6" />
          </svg>
          <svg
            className="absolute top-1/2 -right-8 w-48 h-48 opacity-[0.03] animate-[floatPiece_24s_ease-in-out_infinite]"
            viewBox="0 0 100 100"
            fill="none"
          >
            <polygon points="50,6 60.58,35.44 91.85,36.4 67.12,55.56 75.86,85.6 50,68 24.14,85.6 32.88,55.56 8.15,36.4 39.42,35.44" stroke="#A78BFA" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left" data-reveal>
            {/* Signature 3D Star insignia alongside header metadata */}
            <div className="flex items-center gap-4">
              <Star3DHero />
              <div>
                <div className="text-xs sm:text-sm font-bold tracking-wider text-[#A78BFA] uppercase">
                  Independent Web Studio & Security
                </div>
                <div className="text-xs text-[#A1A1B5] font-mono mt-0.5">
                  Built in San Diego, CA
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
              Websites that look professional and are built secure.
            </h1>

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

          {/* Right Column : Floating Windows Scene (CSS 3D, No WebGL) */}
          <div className="lg:col-span-6 flex justify-center py-4" data-reveal>
            <FloatingWindowsHero />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3-STEP PROCESS PREVIEW                                        */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 bg-[#0B0B14] border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" data-reveal>
            <div className="space-y-2">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-reveal-group>
            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-4" data-reveal>
              <div className="text-xs font-mono font-bold text-[#A78BFA]">
                STEP 01
              </div>
              <h3 className="text-lg font-bold text-white">
                Discovery & Free Preview
              </h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Tell us about your business goals and style preferences. Within 24 to 48 hours, we assemble a functional mobile preview so you can experience how your site will look and feel before spending a dollar.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-4" data-reveal>
              <div className="text-xs font-mono font-bold text-[#A78BFA]">
                STEP 02
              </div>
              <h3 className="text-lg font-bold text-white">
                Build & Security Check
              </h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Once approved, we build your complete site with fast loading speeds, seamless booking, and technical hardening: SSL certificates, 2FA on admin logins, and spam honeypot filters.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-4" data-reveal>
              <div className="text-xs font-mono font-bold text-[#A78BFA]">
                STEP 03
              </div>
              <h3 className="text-lg font-bold text-white">
                Launch & Care
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" data-reveal>
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

          <div className="bg-[#14141F] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 hover:border-[#7C3AED]/40 transition-all duration-300" data-reveal>
            <div className="lg:col-span-7 aspect-video sm:aspect-[16/10] overflow-hidden border-b lg:border-b-0 lg:border-r border-white/[0.08] relative">
              <picture>
                <source type="image/avif" srcSet="/assets/img/finalstop-desktop.avif" />
                <source type="image/webp" srcSet="/assets/img/finalstop-desktop.webp" />
                <img
                  src="/assets/img/finalstop-desktop.jpg"
                  alt="Final Stop Barber Shop & Salon desktop website showcase"
                  loading="lazy"
                  decoding="async"
                  width="1000"
                  height="625"
                  className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500"
                />
              </picture>
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-semibold text-white border border-white/[0.12]">
                Live Client Site
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-9 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#A78BFA] uppercase tracking-wider">
                  Barbershop & Braiding Lounge
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Final Stop Barber Shop & Salon
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  A high-speed, mobile-first website for a premier unisex barbershop and braiding lounge with integrated 24/7 online appointment booking.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  to="/projects/final-stop"
                  className="block w-full py-2.5 px-5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold text-center transition-all duration-200 shadow-md shadow-[#7C3AED]/25"
                >
                  Read full case study
                </Link>

                <a
                  href="https://finalstop.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 px-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-medium text-center border border-white/[0.1] transition-all"
                >
                  Visit finalstop.org ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6 SPECIALIZED SERVICES GRID WITH DESCRIPTIVE ANCHOR TEXT     */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#0B0B14] border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" data-reveal>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                What We Build
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Specialized web solutions
              </h2>
            </div>
            <div>
              <Link
                to="/services"
                className="text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Explore all services →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal-group>
            {/* Service 1 */}
            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-[#7C3AED]/40 transition-all flex flex-col justify-between space-y-6" data-reveal>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#A78BFA]">01</span>
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A2E]/80 border border-white/[0.08] p-1.5 flex items-center justify-center">
                    <img
                      src="/assets/img/icons/local-business.svg"
                      alt=""
                      width="32"
                      height="32"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Local Business Sites</h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Tailored for barbers, salons, med spas, gyms, and local professionals. Features seamless 24/7 online appointment booking, digital menus, and Google Maps integration.
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.06]">
                <Link
                  to="/services/local-business-websites"
                  className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Local business websites with booking →
                </Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-[#7C3AED]/40 transition-all flex flex-col justify-between space-y-6" data-reveal>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#A78BFA]">02</span>
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A2E]/80 border border-white/[0.08] p-1.5 flex items-center justify-center">
                    <img
                      src="/assets/img/icons/creator-sites.svg"
                      alt=""
                      width="32"
                      height="32"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Creator & Influencer Hubs</h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Replace fragile link-in-bio trees with an independent digital home. Centralize your links, interactive media kit for brand deals, and direct email list signup.
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.06]">
                <Link
                  to="/services/creator-websites"
                  className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Website for creators & influencers →
                </Link>
              </div>
            </div>

            {/* Service 3 */}
            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-[#7C3AED]/40 transition-all flex flex-col justify-between space-y-6" data-reveal>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#A78BFA]">03</span>
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A2E]/80 border border-white/[0.08] p-1.5 flex items-center justify-center">
                    <img
                      src="/assets/img/icons/portfolios.svg"
                      alt=""
                      width="32"
                      height="32"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Portfolios</h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Clean, fast portfolio websites for students, designers, photographers, developers and artists. Showcase your work with fast image loading and downloadable resumes.
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.06]">
                <Link
                  to="/services/portfolio-websites"
                  className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Portfolio website design →
                </Link>
              </div>
            </div>

            {/* Service 4 */}
            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-[#7C3AED]/40 transition-all flex flex-col justify-between space-y-6" data-reveal>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#A78BFA]">04</span>
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A2E]/80 border border-white/[0.08] p-1.5 flex items-center justify-center">
                    <img
                      src="/assets/img/icons/online-stores.svg"
                      alt=""
                      width="32"
                      height="32"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Small Online Stores</h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Simple, secure online stores for products, merch and digital downloads, with checkout handled by trusted payment providers like Stripe and Apple Pay.
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.06]">
                <Link
                  to="/services/online-stores"
                  className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Small online store setup →
                </Link>
              </div>
            </div>

            {/* Service 5 */}
            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-[#7C3AED]/40 transition-all flex flex-col justify-between space-y-6" data-reveal>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#A78BFA]">05</span>
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A2E]/80 border border-white/[0.08] p-1.5 flex items-center justify-center">
                    <img
                      src="/assets/img/icons/security-check.svg"
                      alt=""
                      width="32"
                      height="32"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Security Check</h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  A plain-English review of your website's security basics: database rules, HTTPS, exposed keys, backups and account protection to prevent breaches.
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.06]">
                <Link
                  to="/services/security-check"
                  className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Website security check →
                </Link>
              </div>
            </div>

            {/* Service 6 */}
            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-[#7C3AED]/40 transition-all flex flex-col justify-between space-y-6" data-reveal>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#A78BFA]">06</span>
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A2E]/80 border border-white/[0.08] p-1.5 flex items-center justify-center">
                    <img
                      src="/assets/img/icons/care-plans.svg"
                      alt=""
                      width="32"
                      height="32"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Care Plans</h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Hosting, backups, quick edits and basic security monitoring to keep your website updated and running smoothly without technical headaches.
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.06]">
                <Link
                  to="/services/care-plans"
                  className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Website care plans →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SHORT TRUST SECTION : Studio philosophy                       */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 bg-[#0B0B14] border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#14141F] border border-white/[0.08] p-8 sm:p-12 space-y-6 text-left relative overflow-hidden" data-reveal>
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
              Studio Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI-assisted. Human-directed. Security-checked.
            </h2>
            <p className="text-base text-[#A1A1B5] leading-relaxed">
              We use modern AI tools to design and build websites faster, which keeps prices fair for small businesses and independent creators. Every project is planned, reviewed, and tested before launch, with security checks on database rules, exposed keys, HTTPS, backups, and account protection.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              to="/process"
              className="px-6 py-3 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-[#7C3AED]/25"
            >
              Read full process breakdown
            </Link>

            <span className="text-xs text-[#A1A1B5]">
              🔒 Private client data is never shared with third-party AI models.
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FINAL CALL TO ACTION                                          */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-8 bg-[#14141F]">
        <div className="max-w-4xl mx-auto text-center space-y-7" data-reveal>
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-xs text-[#A78BFA] font-medium">
              Free preview ready in 24–48 hours
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
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
