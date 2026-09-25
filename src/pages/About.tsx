import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function About() {
  return (
    <div>
      <SEO
        title="About | LevelUp Ecosystem"
        description="Meet LevelUp Ecosystem, an independent web and cybersecurity studio serving San Diego businesses and creators."
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
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4" data-reveal>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Independent Studio
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About LevelUp Ecosystem
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            An independent web design and security studio dedicated to helping San Diego small businesses, barbers, salons, and creators establish a fast, credible, and protected web presence.
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-3xl mx-auto space-y-12 text-left">
          <div className="space-y-6" data-reveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why I started LevelUp Ecosystem
            </h2>
            <p className="text-base text-[#A1A1B5] leading-relaxed">
              I am a cybersecurity student living in San Diego, CA. Over the past few years, I noticed that most local barbershops, hair salons, personal trainers, and independent creators were faced with two bad options:
            </p>
            <div className="space-y-4 pl-4 border-l-2 border-[#7C3AED]/40">
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>Option A:</strong> Spend thousands of dollars with a traditional marketing agency that builds on top of fragile, bloated templates that load slowly on phones and take weeks to make minor edits.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>Option B:</strong> Try to build a generic DIY site on their own that lacks proper booking integrations, leaks contact details to spam bots, and doesn't appear when people search nearby on Google Maps.
              </p>
            </div>
            <p className="text-base text-[#A1A1B5] leading-relaxed">
              LevelUp Ecosystem was created to be the third option: a direct, honest partner who builds modern, fast, mobile-friendly websites with 24/7 online booking, transparent pricing, and proactive security hygiene built in from the very beginning.
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/[0.08]" data-reveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How I work
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" data-reveal-group>
              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2" data-reveal>
                <h3 className="text-base font-bold text-white">
                  1. You deal with me directly
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  No account reps, no outsourcing to call centers. I personally handle discovery, code the site, verify security configurations, and maintain your system.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2" data-reveal>
                <h3 className="text-base font-bold text-white">
                  2. Security is never an afterthought
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Every site includes SSL encryption, 2FA on admin access, and spam filters. If you already have a site, I can run a plain-English security check to verify your setup.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2" data-reveal>
                <h3 className="text-base font-bold text-white">
                  3. Transparent, upfront pricing
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  No hidden hosting surcharges or surprise invoices. You always know the fixed cost upfront before any work begins.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2" data-reveal>
                <h3 className="text-base font-bold text-white">
                  4. Try before you commit
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  I offer a free preview for prospective clients. You get to interact with a working mobile preview of your future website before making any purchasing decision.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t border-white/[0.08] pt-8 flex flex-wrap gap-4" data-reveal>
            <Link
              to="/web-design-san-diego"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              Explore Web Design in San Diego →
            </Link>
            <Link
              to="/projects/final-stop"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              View Final Stop Barber Shop Case Study →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-8 bg-[#14141F] border-t border-white/[0.08]">
        <div className="max-w-3xl mx-auto text-center space-y-6" data-reveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Let's build something great together
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1B5]">
            Have an upcoming project or need a security review for your existing business tools?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/preview"
              className="px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all shadow-md shadow-[#7C3AED]/25"
            >
              Get a free preview
            </Link>
            <Link
              to="/preview"
              className="px-8 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-semibold text-sm border border-white/[0.1] transition-all"
            >
              Create your website
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
