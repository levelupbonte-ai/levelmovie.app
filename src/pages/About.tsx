import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function About() {
  return (
    <div className="min-h-screen bg-[#0B0B14] text-white">
      <SEO
        title="About Us | LevelUp Ecosystem"
        description="Learn who we are and what we do at LevelUp Ecosystem — an independent web architecture and security studio engineered for businesses and creators."
        canonical="/about"
        breadcrumbs={[
          { name: 'About', url: '/about' }
        ]}
      />

      <Breadcrumbs
        items={[
          { name: 'About', url: '/about' }
        ]}
      />

      {/* Header */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Independent Studio
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About LevelUp Ecosystem
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            We are an independent web architecture and digital security studio. We engineer ultra-fast, mobile-first websites with integrated 24/7 online booking, e-commerce, and built-in security.
          </p>
        </div>
      </section>

      {/* Main Studio Profile */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-3xl mx-auto space-y-12 text-left">
          
          {/* Who We Are & What We Do */}
          <div className="space-y-6" data-reveal>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
              Our Mission
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Who We Are &amp; What We Do
            </h2>
            <p className="text-base text-[#A1A1B5] leading-relaxed">
              At LevelUp, we build digital infrastructure for local service businesses, barbershops, hair salons, wellness clinics, personal trainers, and independent creators. We believe your website should be your hardest-working asset: capturing bookings while you sleep, loading instantly on mobile phones, and protecting client transactions.
            </p>
            <div className="space-y-4 pl-4 border-l-2 border-[#7C3AED]/40">
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>The Traditional Trap:</strong> Many businesses spend thousands on agencies that deliver slow, bloated template sites that lag on mobile devices and take weeks for simple updates.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>The DIY Headache:</strong> Others struggle with complex DIY builders that lack automated calendar sync, leak emails to spam bots, and don't rank properly on Google Maps.
              </p>
            </div>
            <p className="text-base text-[#A1A1B5] leading-relaxed">
              LevelUp was founded to deliver a better alternative: clean, bespoke, lightweight code engineered for real-world conversion, frictionless customer scheduling, and robust security from day one.
            </p>
          </div>

          {/* How We Work */}
          <div className="space-y-6 pt-6 border-t border-white/[0.08]" data-reveal>
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A78BFA]">
                Engineering Principles
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                How We Work
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" data-reveal-group>
              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2" data-reveal>
                <h3 className="text-base font-bold text-white">
                  1. Direct Studio Partnership
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  No account reps, no ticket queues, no call centers. You work directly with our engineering team from concept through deployment and maintenance.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2" data-reveal>
                <h3 className="text-base font-bold text-white">
                  2. Security Built In by Default
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Every site includes SSL/HTTPS encryption, honeypot anti-spam defense, strict security headers, and two-factor authentication safeguards on administrative portals.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2" data-reveal>
                <h3 className="text-base font-bold text-white">
                  3. Transparent, Fixed Pricing
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Zero hidden hosting surcharges or surprise billing. You always know exact project costs upfront before any work begins.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2" data-reveal>
                <h3 className="text-base font-bold text-white">
                  4. Try Before You Commit
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  We build working interactive previews before signing contracts. You test-drive your layout, mobile responsiveness, and booking flows risk-free.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t border-white/[0.08] pt-8 flex flex-wrap gap-4" data-reveal>
            <Link
              to="/services"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              Explore Website Services →
            </Link>
            <Link
              to="/preview"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              Request a Free Preview →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-8 bg-[#14141F] border-t border-white/[0.08]">
        <div className="max-w-3xl mx-auto text-center space-y-6" data-reveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Let's build something exceptional together
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1B5]">
            Have an upcoming project or need a high-performance website with automated booking?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/preview"
              className="px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all shadow-md shadow-[#7C3AED]/25"
            >
              Get a free preview
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-semibold text-sm border border-white/[0.1] transition-all"
            >
              Contact our studio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
