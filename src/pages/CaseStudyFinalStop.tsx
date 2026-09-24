import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';

export default function CaseStudyFinalStop() {
  return (
    <div>
      <SEO
        title="Final Stop Barber Shop & Salon - Case Study"
        description="How LevelUp Ecosystem designed and deployed a fast, secure website with 24/7 online booking for Final Stop Barber Shop & Salon in San Diego."
      />

      {/* Hero Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link
            to="/projects"
            className="inline-flex items-center text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors"
          >
            ← Back to all projects
          </Link>

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
              to="/contact"
              className="px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs sm:text-sm font-medium border border-white/[0.1] transition-all"
            >
              Get a preview for your shop →
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Main Screenshot */}
          <div className="rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#14141F]">
            <img
              src="/finalstop-preview.jpg"
              alt="Final Stop Barber Shop & Salon full layout"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#14141F] border border-white/[0.08]">
              <div className="text-xs text-[#A78BFA] font-medium uppercase">Client</div>
              <div className="text-base font-bold text-white mt-1">Final Stop</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#14141F] border border-white/[0.08]">
              <div className="text-xs text-[#A78BFA] font-medium uppercase">Industry</div>
              <div className="text-base font-bold text-white mt-1">Barber & Braiding</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#14141F] border border-white/[0.08]">
              <div className="text-xs text-[#A78BFA] font-medium uppercase">Location</div>
              <div className="text-base font-bold text-white mt-1">San Diego, CA</div>
            </div>
            <div className="p-5 rounded-2xl bg-[#14141F] border border-white/[0.08]">
              <div className="text-xs text-[#A78BFA] font-medium uppercase">Deliverables</div>
              <div className="text-base font-bold text-white mt-1">Design, Code, Booking</div>
            </div>
          </div>

          {/* Context & The Challenge */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              The Context & Challenge
            </h2>
            <p className="text-base text-[#A1A1B5] leading-relaxed">
              Final Stop Barber Shop & Salon provides hair cuts, beard grooming, loc maintenance, and intricate braiding services in San Diego.
            </p>
            <p className="text-base text-[#A1A1B5] leading-relaxed">
              Like many busy neighborhood businesses, relying exclusively on phone calls and Instagram direct messages created friction: stylists were constantly interrupted during appointments to answer pricing inquiries, check calendars, and negotiate booking times. Without an organized mobile website, new visitors searching on Google Maps couldn't immediately view services or book an appointment on the spot.
            </p>
          </div>

          {/* What I Built */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              What I Engineered
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-3">
                <h3 className="text-lg font-bold text-white">
                  1. Instant Online Booking
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Integrated a direct scheduling system allowing clients to select services, choose their barber or stylist, pick an open slot, and receive automated SMS/email reminders.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-3">
                <h3 className="text-lg font-bold text-white">
                  2. Sub-2-Second Mobile Performance
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Lightweight code without unnecessary heavy plugins or slow trackers ensures pages load instantly even on congested cellular networks in San Diego.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-3">
                <h3 className="text-lg font-bold text-white">
                  3. Transparent Digital Service Menu
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  A categorized menu detailing hair cuts, braiding styles, and specialty treatments with clear descriptions and duration estimates to eliminate customer uncertainty.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-3">
                <h3 className="text-lg font-bold text-white">
                  4. Security & Domain Hygiene
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
                  Full SSL HTTPS configuration, modern DNS records, spam bot suppression on contact channels, and secure admin authentication setup.
                </p>
              </div>

            </div>
          </div>

          {/* Real Laptop Device Visual */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-4">
            <h3 className="text-lg font-bold text-white">Responsive Presentation</h3>
            <p className="text-sm text-[#A1A1B5]">
              Designed to look crisp and feel native whether opened on an iPhone, tablet, or desktop computer.
            </p>
            <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-black/40">
              <img
                src="/laptop-hero.jpg"
                alt="Final Stop site displayed on a laptop screen"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Takeaway & Next Step */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-[#7C3AED]/30 space-y-6 text-center">
            <h3 className="text-2xl font-bold text-white">
              Want a similar system for your business?
            </h3>
            <p className="text-sm sm:text-base text-[#A1A1B5] max-w-xl mx-auto">
              I can prepare a working interactive mobile preview for your barbershop, salon, gym, or local business within 24 to 48 hours. No commitment required.
            </p>
            <div>
              <Link
                to="/preview"
                className="inline-block px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all shadow-lg shadow-[#7C3AED]/25"
              >
                Get a free preview
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
