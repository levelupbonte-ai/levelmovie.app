import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Star3DHero from '../components/Star3DHero';
import Service3DShowcaseDeck from '../components/Service3DShowcaseDeck';
import HeroIconRotator from '../components/HeroIconRotator';
import WhoItsForSection from '../components/WhoItsForSection';

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

        {/* Ambient 3D floating background icons (Subtle, high-trust craft aesthetic) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {/* Security Shield Icon (Top Right) */}
          <div className="absolute -top-4 right-[3%] lg:right-[7%] w-24 h-24 sm:w-36 sm:h-36 opacity-18 lg:opacity-22 ambient-float-1 select-none">
            <picture>
              <source srcSet="/assets/img/icons/security.avif" type="image/avif" />
              <source srcSet="/assets/img/icons/security.webp" type="image/webp" />
              <img
                src="/assets/img/icons/security.png"
                alt=""
                width="144"
                height="144"
                className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                loading="lazy"
              />
            </picture>
          </div>

          {/* Creator Camera Icon (Top Left / behind header badge) */}
          <div className="absolute top-10 left-[1%] lg:left-[4%] w-20 h-20 sm:w-28 sm:h-28 opacity-14 lg:opacity-18 ambient-float-2 select-none">
            <picture>
              <source srcSet="/assets/img/icons/creators.avif" type="image/avif" />
              <source srcSet="/assets/img/icons/creators.webp" type="image/webp" />
              <img
                src="/assets/img/icons/creators.png"
                alt=""
                width="112"
                height="112"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                loading="lazy"
              />
            </picture>
          </div>

          {/* Store / Shopping Bag Icon (Center / behind divider) */}
          <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 opacity-10 lg:opacity-14 ambient-float-3 select-none">
            <picture>
              <source srcSet="/assets/img/icons/store.avif" type="image/avif" />
              <source srcSet="/assets/img/icons/store.webp" type="image/webp" />
              <img
                src="/assets/img/icons/store.png"
                alt=""
                width="144"
                height="144"
                className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                loading="lazy"
              />
            </picture>
          </div>

          {/* Barbershop Scissors & Comb Icon (Bottom Left / under stats) */}
          <div className="absolute -bottom-6 left-[8%] lg:left-[14%] w-20 h-20 sm:w-32 sm:h-32 opacity-14 lg:opacity-18 ambient-float-1 select-none">
            <picture>
              <source srcSet="/assets/img/icons/barbershop.avif" type="image/avif" />
              <source srcSet="/assets/img/icons/barbershop.webp" type="image/webp" />
              <img
                src="/assets/img/icons/barbershop.png"
                alt=""
                width="128"
                height="128"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                loading="lazy"
              />
            </picture>
          </div>

          {/* Salon / Beauty Icon (Bottom Right) */}
          <div className="absolute -bottom-6 right-[12%] lg:right-[18%] w-22 h-22 sm:w-32 sm:h-32 opacity-15 lg:opacity-20 ambient-float-2 select-none">
            <picture>
              <source srcSet="/assets/img/icons/salon.avif" type="image/avif" />
              <source srcSet="/assets/img/icons/salon.webp" type="image/webp" />
              <img
                src="/assets/img/icons/salon.png"
                alt=""
                width="128"
                height="128"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                loading="lazy"
              />
            </picture>
          </div>
        </div>

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
      {/* WORKFLOW SECTION (Clean White Background per design specification) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-b border-gray-200 relative overflow-hidden select-none">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 relative z-10 text-center">
          <div className="space-y-3" data-reveal>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#7C3AED]">
              Simple Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B0B14] tracking-tight">
              From idea to live site in 3 steps
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
              Our clear, transparent process built for momentum, bank-grade security, and zero guesswork.
            </p>
          </div>

          {/* Workflow Diagram Image (Generous footprint for PC & Tablet, mobile-optimized portrait for phones) */}
          <div className="w-full flex items-center justify-center" data-reveal>
            <div className="w-full max-w-5xl rounded-2xl overflow-hidden select-none pointer-events-none shadow-sm flex justify-center">
              <picture className="w-full block text-center">
                {/* Portrait workflow image optimized specifically for mobile viewports */}
                <source media="(max-width: 639px)" srcSet="/assets/img/workflow-mobile.png" />
                {/* Full landscape workflow diagram for tablet and desktop */}
                <img
                  src="/assets/img/workflow.png"
                  alt="LevelUp Ecosystem Build Workflow"
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-auto object-contain select-none pointer-events-none block max-w-xs sm:max-w-none mx-auto"
                />
              </picture>
            </div>
          </div>

          <div className="pt-2 text-center" data-reveal>
            <Link
              to="/process"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#7C3AED] hover:text-[#5B21B6] transition-colors"
            >
              <span>Learn how we build with security checks</span>
              <span>→</span>
            </Link>
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
