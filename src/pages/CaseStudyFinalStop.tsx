import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function CaseStudyFinalStop() {
  return (
    <div>
      <SEO
        title="Final Stop Barber Shop Case Study | LevelUp Ecosystem"
        description="Case study: How LevelUp Ecosystem delivered a fast website with 24/7 online booking for Final Stop Barber Shop & Salon in San Diego."
        canonical="/projects/final-stop"
        breadcrumbs={[
          { name: 'Projects', url: '/projects' },
          { name: 'Final Stop Case Study', url: '/projects/final-stop' }
        ]}
      />

      <Breadcrumbs
        items={[
          { name: 'Projects', url: '/projects' },
          { name: 'Final Stop Case Study', url: '/projects/final-stop' }
        ]}
      />

      {/* Hero Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-6 text-left" data-reveal>
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
              Client Case Study • San Diego, CA
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Final Stop Barber Shop & Salon
            </h1>
            <p className="text-base sm:text-xl text-[#A1A1B5] leading-relaxed">
              Replacing phone tag with 24/7 mobile appointment booking and an elegant digital storefront for a premier San Diego barbershop and salon.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="https://finalstop.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-[#7C3AED]/25"
            >
              Visit live site: finalstop.org ↗
            </a>

            <Link
              to="/preview"
              className="px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs sm:text-sm font-medium border border-white/[0.1] transition-all"
            >
              Get a preview for your shop →
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-16 text-left">
          
          {/* Hero Image Showcase */}
          <div className="rounded-3xl overflow-hidden border border-white/[0.08] bg-[#14141F] shadow-2xl" data-reveal>
            <img
              src="/finalstop-preview.jpg"
              alt="Final Stop Barber Shop & Salon desktop and mobile website preview"
              loading="lazy"
              width="900"
              height="450"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Background & Challenge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-reveal-group>
            <div className="p-8 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <span className="text-xs font-mono font-bold text-[#A78BFA] uppercase">The Challenge</span>
              <h2 className="text-xl font-bold text-white">Manual Booking & Cluttered Links</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Final Stop was relying on direct messages, phone calls, and an outdated social bio link. Clients frequently double-booked, walked in during peak appointment hours without notice, and struggled to locate current pricing for braiding and specialized hair grooming services.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <span className="text-xs font-mono font-bold text-[#A78BFA] uppercase">The Solution</span>
              <h2 className="text-xl font-bold text-white">Mobile-First Booking & Google Maps</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                LevelUp Ecosystem designed and deployed a fast, custom web presence with synchronized calendar booking. Barbers and braiders set their independent schedules, clients book and confirm appointments online 24/7, and Google Maps integration directs new local walk-ins straight to the shop.
              </p>
            </div>
          </div>

          {/* Results Metric Callout */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#14141F] border border-[#7C3AED]/30 space-y-6" data-reveal>
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#A78BFA] uppercase">Measured Impact</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Key Results Delivered</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-white/[0.08]">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#7C3AED]">&lt; 1.8s</div>
                <div className="text-xs text-[#A1A1B5] mt-1 font-medium">Mobile page load</div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#7C3AED]">40%+</div>
                <div className="text-xs text-[#A1A1B5] mt-1 font-medium">Self-serve bookings</div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#7C3AED]">Zero</div>
                <div className="text-xs text-[#A1A1B5] mt-1 font-medium">No-show scheduling bugs</div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#7C3AED]">100%</div>
                <div className="text-xs text-[#A1A1B5] mt-1 font-medium">Client data encrypted</div>
              </div>
            </div>
          </div>

          {/* Related Links */}
          <div className="border-t border-white/[0.08] pt-8 flex flex-wrap gap-4" data-reveal>
            <Link
              to="/services/local-business-websites"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              Learn about our local business websites with booking →
            </Link>
            <Link
              to="/web-design-san-diego"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              Web design in San Diego →
            </Link>
          </div>

          {/* CTA */}
          <div className="text-center p-8 sm:p-12 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-6" data-reveal>
            <h2 className="text-2xl font-bold text-white">
              Ready to modernize your barbershop, salon, or local business?
            </h2>
            <p className="text-sm text-[#A1A1B5] max-w-xl mx-auto">
              Get an interactive mobile preview built for your brand with zero upfront cost.
            </p>
            <Link
              to="/preview"
              className="inline-block px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all shadow-md shadow-[#7C3AED]/25"
            >
              Get a free preview
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
