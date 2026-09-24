import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';

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
        title="Secure Websites for San Diego Businesses & Creators"
        description="Fast, modern websites with online booking, mobile-first design, and built-in security for San Diego businesses, creators, and professionals."
      />

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION : Subtle radial purple glow, faceted shapes      */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-14 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 border-b border-white/[0.08] overflow-hidden">
        
        {/* Subtle radial purple glow echoing logo */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#7C3AED]/12 rounded-full blur-[140px] pointer-events-none" />

        {/* Faceted geometric shapes echoing logo star in low opacity background */}
        <svg
          className="absolute -right-24 top-0 w-96 h-96 opacity-[0.03] pointer-events-none"
          viewBox="0 0 100 100"
          fill="none"
        >
          <polygon points="50,6 60.58,35.44 91.85,36.4 67.12,55.56 75.86,85.6 50,68 24.14,85.6 32.88,55.56 8.15,36.4 39.42,35.44" stroke="#7C3AED" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="50" y2="6" stroke="#7C3AED" strokeWidth="1" />
          <line x1="50" y1="50" x2="91.85" y2="36.4" stroke="#7C3AED" strokeWidth="1" />
          <line x1="50" y1="50" x2="75.86" y2="85.6" stroke="#7C3AED" strokeWidth="1" />
          <line x1="50" y1="50" x2="24.14" y2="85.6" stroke="#7C3AED" strokeWidth="1" />
          <line x1="50" y1="50" x2="8.15" y2="36.4" stroke="#7C3AED" strokeWidth="1" />
        </svg>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left">
            
            <div className="text-xs sm:text-sm font-bold tracking-wider text-[#A78BFA] uppercase">
              San Diego Web Studio & Security
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
              Secure websites for San Diego businesses and creators.
            </h1>

            <p className="text-base sm:text-lg text-[#A1A1B5] leading-relaxed font-normal max-w-xl">
              Get a fast, modern site with online booking, built with your customers' data protected from day one.
            </p>

            <div className="pt-2 space-y-3">
              <div>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-7 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm sm:text-base transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 cursor-pointer"
                >
                  Get a free preview →
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

          {/* Right Column : Laptop Screen Showcase */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden bg-[#14141F] border border-white/[0.08] p-3 sm:p-5 shadow-2xl">
              
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-black/40 flex items-center justify-center">
                <img
                  src="/laptop-hero.jpg"
                  alt="Modern website preview on laptop"
                  className="w-full h-full object-cover rounded-lg shadow-inner"
                />

                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/[0.12] text-xs font-semibold text-white shadow-lg">
                  Live Client Site
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-[#A1A1B5]">
                <span className="text-[#A78BFA] font-medium">Final Stop Barber Shop & Salon</span>
                <Link
                  to="/projects/final-stop"
                  className="text-white hover:underline"
                >
                  View Case Study →
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3-STEP PROCESS PREVIEW                                        */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 bg-[#0B0B14] border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
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
                Learn how I build with AI & security checks →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4">
              <div className="text-xs font-mono font-bold text-[#A78BFA]">
                STEP 01
              </div>
              <h3 className="text-lg font-bold text-white">
                Discovery & Free Preview
              </h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Tell me about your business and goals. Within 24 to 48 hours, I assemble a functional mobile preview so you can experience how your site will look and feel before spending a dollar.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4">
              <div className="text-xs font-mono font-bold text-[#A78BFA]">
                STEP 02
              </div>
              <h3 className="text-lg font-bold text-white">
                Build & Security Check
              </h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Once approved, I build your complete site with fast loading speeds, seamless booking, and technical hardening: SSL certificates, 2FA on admin logins, and spam protection.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4">
              <div className="text-xs font-mono font-bold text-[#A78BFA]">
                STEP 03
              </div>
              <h3 className="text-lg font-bold text-white">
                Launch & Care
              </h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                We go live on your custom domain, connect your Google Maps profile, and set up daily backups. Optional monthly maintenance ensures your software remains updated and safe.
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
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                Featured Client Work
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Real results for a San Diego business
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

          <div className="bg-[#14141F] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 hover:border-[#7C3AED]/40 transition-all">
            
            <div className="lg:col-span-7 aspect-video sm:aspect-[16/10] overflow-hidden border-b lg:border-b-0 lg:border-r border-white/[0.08] relative">
              <img
                src="/finalstop-preview.jpg"
                alt="Final Stop Barber Shop & Salon website showcase"
                className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-500"
              />
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
                  A high-speed, mobile-first website for a premier San Diego unisex barbershop and braiding lounge with integrated 24/7 online appointment booking.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  to="/projects/final-stop"
                  className="block w-full py-2.5 px-5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold text-center transition-all duration-200 shadow-md shadow-[#7C3AED]/25"
                >
                  Read full case study →
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
      {/* 3 FEATURED SERVICES                                           */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#0B0B14] border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                What I Build
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Popular service categories
              </h2>
            </div>
            <div>
              <Link
                to="/services"
                className="text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Explore all 9 categories →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Service 1 */}
            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#A78BFA]">01</span>
                <h3 className="text-xl font-bold text-white">Local Business Sites</h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Tailored for barbers, salons, med spas, gyms, restaurants, and local artisans. Includes mobile-first layout, online booking, and Google Maps integration.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#A1A1B5]">Booking 24/7</span>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#A1A1B5]">Google Maps</span>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#A1A1B5]">Fast Mobile</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <Link to="/contact" className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors">
                  Get a free preview →
                </Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#A78BFA]">02</span>
                <h3 className="text-xl font-bold text-white">Creator & Influencer Sites</h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Replace fragile link-in-bio trees with an independent digital home. Centralize your links, media kit for brand partnerships, and direct email list signup.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#A1A1B5]">Link in bio</span>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#A1A1B5]">Media Kit</span>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#A1A1B5]">Newsletter</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <Link to="/contact" className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors">
                  Get a free preview →
                </Link>
              </div>
            </div>

            {/* Service 3 */}
            <div className="p-7 rounded-2xl bg-[#14141F] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#A78BFA]">03</span>
                <h3 className="text-xl font-bold text-white">Security Check</h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  A pragmatic cybersecurity audit for your existing business tools. I audit your domain registrar, hosting, admin 2FA, and train you on anti-phishing defense.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#A1A1B5]">2FA Lockdown</span>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#A1A1B5]">Phishing Hygiene</span>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#A1A1B5]">Domain Audit</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <Link to="/contact" className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors">
                  Get a free preview →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SHORT TRUST SECTION : How we build                            */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 bg-[#0B0B14] border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#14141F] border border-white/[0.08] p-8 sm:p-12 space-y-6 text-left relative overflow-hidden">
          
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
              Studio Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI-assisted. Human-directed. Security-checked.
            </h2>
            <p className="text-base text-[#A1A1B5] leading-relaxed">
              I use modern AI tools to design and build websites faster, which keeps prices fair for small businesses. Every project is planned, reviewed, and tested by me before launch, with security checks on database rules, exposed keys, HTTPS, backups, and account protection.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              to="/process"
              className="px-6 py-3 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-[#7C3AED]/25"
            >
              Read full process breakdown →
            </Link>

            <span className="text-xs text-[#A1A1B5]">
              🔒 I never share clients' private data with AI tools.
            </span>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FINAL CALL TO ACTION                                          */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-8 bg-[#14141F]">
        <div className="max-w-4xl mx-auto text-center space-y-7">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-xs text-[#A78BFA] font-medium">
              Free preview ready in 24–48 hours
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to elevate your online presence?
            </h2>

            <p className="text-base text-[#A1A1B5]">
              Tell me about your business or vision. I'll put together a working mobile preview for you to review before making any commitment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 text-center"
            >
              Get a free preview →
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
