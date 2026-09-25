import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function WebsitesForBarbershops() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does the online booking system work with our barbershop chairs?',
      a: 'We integrate with your preferred booking platform (such as Booksy, Square Appointments, Acuity, Calendly, or Google Calendar sync). Clients can select specific barbers, pick available time slots 24/7, and receive automated SMS/email reminders, reducing no-shows without phone interruptions while you cut.'
    },
    {
      q: 'Will our barbershop website rank on Google Maps in our city?',
      a: 'Yes. Every barbershop website is built with local SEO schema, geo-targeted metadata, neighborhood service areas, and direct Google Business Profile synchronization. This ensures local clients searching for "barbershop near me" or walk-ins find your shop, hours, and directions instantly.'
    },
    {
      q: 'Can barbers showcase their own cuts, fades, and Instagram portfolios?',
      a: 'Absolutely. We design dedicated barber chair cards featuring each barber’s bio, specialties (skin fades, beard sculpting, hot towel shaves), Instagram feed or image gallery, and direct individual booking links so returning clients can book their favorite barber in seconds.'
    },
    {
      q: 'How fast can our barbershop website be launched?',
      a: 'Most custom barbershop websites are delivered within 5 to 7 business days from receiving your photos, services menu, and pricing. You also see a full interactive preview before any final commitments.'
    }
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Barbershop Websites with Online Booking',
    serviceType: 'Barbershop Web Design & Local Booking Integration',
    provider: {
      '@type': 'Organization',
      name: 'LevelUp Ecosystem',
      url: 'https://levelup-ecosystem.com'
    },
    description: 'High-performance websites for barbershops with 24/7 online booking, Google Calendar sync, mobile barber profiles, and zero monthly software bloat.'
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  const whatsIncluded = [
    {
      title: '24/7 Online Booking Integration',
      desc: 'Seamless booking flow synced with your calendar or appointment system (Booksy, Square, Acuity) so clients can reserve chairs anytime.'
    },
    {
      title: 'Barber Profiles & Chair Rosters',
      desc: 'Individual cards for each barber with headshot, specialties, direct booking link, and social handles.'
    },
    {
      title: 'Mobile-First Gallery of Cuts',
      desc: 'Fast, responsive gallery showcasing fades, beard sculpting, trims, and hot towel treatments with zero lag.'
    },
    {
      title: 'Clear Service Menu & Pricing',
      desc: 'Transparent pricing list organized by service category (haircuts, beards, combos, kids) so clients know what to expect.'
    },
    {
      title: 'Google Maps & Local SEO Setup',
      desc: 'Structured local business data, address, operating hours, and click-to-navigate buttons for walk-ins.'
    },
    {
      title: 'Security & Speed Optimization',
      desc: 'Built on clean static architecture with HTTPS encryption, deny-by-default security headers, and sub-second mobile page loads.'
    }
  ];

  return (
    <div>
      <SEO
        title="Barbershop Websites | LevelUp Ecosystem"
        description="High-performance websites for barbershops with 24/7 online booking, Google Calendar sync, mobile barber profiles, and zero monthly software bloat."
        canonical="/websites-for/barbershops"
        breadcrumbs={[
          { name: 'Services', url: '/services' },
          { name: 'Barbershop Websites', url: '/websites-for/barbershops' }
        ]}
        jsonLd={[serviceSchema, faqSchema]}
      />

      <Breadcrumbs
        items={[
          { name: 'Services', url: '/services' },
          { name: 'Barbershop Websites', url: '/websites-for/barbershops' }
        ]}
      />

      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-6 text-left" data-reveal>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
              Websites for Barbershops
            </span>
            <span className="text-white/20">•</span>
            <span className="text-xs text-[#A1A1B5]">Built for Chairs & Shops</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Barbershop Websites with Online Booking
          </h1>

          <p className="text-base sm:text-xl text-[#A1A1B5] leading-relaxed max-w-3xl">
            Keep your chairs full without answering phones between fades. We build modern, mobile-first websites for independent barbers and multi-chair barbershops with online appointment scheduling, barber profiles, local SEO, and sub-second load times.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/preview"
              className="px-7 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95"
            >
              Get a free preview
            </Link>
            <Link
              to="/projects/final-stop"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              See our Final Stop barbershop case study (+40% bookings) →
            </Link>
          </div>
        </div>
      </section>

      {/* Overview & Value Proposition (>300 words total) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-reveal-group>
            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                01
              </div>
              <h3 className="text-xl font-bold text-white">Stop Losing Clients to Busy Phone Lines</h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                When you are in the middle of a tight skin fade or beard trim, stopping to answer a phone call breaks your rhythm and delays waiting clients. Over 70% of appointment bookings happen outside regular shop business hours. With an integrated online scheduling system, clients book open chairs directly from their phones at 10 PM without you lifting a finger.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                02
              </div>
              <h3 className="text-xl font-bold text-white">Dominate Local Search & Google Maps</h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Walk-ins and new neighborhood residents search Google Maps for "best barbershop near me" every single day. We optimize your website with localized Schema.org metadata, neighborhood service tags, business hours, and click-to-navigate GPS buttons that convert casual searchers into lifelong regulars in your shop chairs.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                03
              </div>
              <h3 className="text-xl font-bold text-white">Empower Every Barber On Your Team</h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                A great shop is powered by skilled barbers. Each chair member gets their own profile section with high-res cut photography, bio, specialties, working hours, and their personal booking link. Returning clients can book directly with their barber of choice, while walk-ins can choose the first available opening.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                04
              </div>
              <h3 className="text-xl font-bold text-white">Ultra-Fast Mobile Speed & Security</h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Clients book appointments on smartphones on the go. Slow, clunky WordPress templates with 30 outdated plugins frustrate users and get abandoned. Our sites load in under 1 second, consume minimal mobile data, and include strict HTTPS security headers and denial of unauthenticated database access by default.
              </p>
            </div>
          </div>

          {/* What's Included */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-8" data-reveal>
            <div>
              <h2 className="text-2xl font-bold text-white">What&apos;s Included in Every Barbershop Site</h2>
              <p className="text-sm text-[#A1A1B5] mt-1">
                Everything required to establish a strong digital storefront for your shop, with zero hidden surprises.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whatsIncluded.map((item, idx) => (
                <div key={idx} className="space-y-1.5 border-l-2 border-[#7C3AED] pl-4">
                  <h4 className="text-base font-semibold text-white">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Real Barbershop Case Study Highlight */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#14141F] to-[#0B0B14] border border-[#7C3AED]/30 space-y-6" data-reveal>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                  Featured Barbershop Project
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Final Stop Barbershop Case Study</h3>
              </div>
              <Link
                to="/projects/final-stop"
                className="px-5 py-2.5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 hover:bg-[#7C3AED] text-white text-xs font-semibold transition-all shrink-0 text-center"
              >
                Read Case Study →
              </Link>
            </div>
            <p className="text-sm text-[#A1A1B5] leading-relaxed">
              When Final Stop barbershop in San Diego replaced their sluggish template with our custom, mobile-first web setup and direct calendar booking, their monthly appointment booking rate increased by <strong>+40%</strong> within the first 60 days, completely eliminating double-bookings and unanswered telephone calls.
            </p>
          </div>

          {/* FAQ */}
          <div className="space-y-6" data-reveal>
            <h2 className="text-2xl font-bold text-white text-left">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/[0.08] bg-[#14141F] overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                    >
                      <span className="text-sm sm:text-base">{faq.q}</span>
                      <span className="text-[#A78BFA] text-lg font-bold shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="p-5 pt-0 text-sm text-[#A1A1B5] leading-relaxed border-t border-white/[0.04]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#14141F] border border-[#7C3AED]/30 text-center space-y-6" data-reveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Upgrade Your Barbershop&apos;s Online Booking?
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] max-w-xl mx-auto leading-relaxed">
              See a custom mockup of your new barbershop website before you decide. No contracts, no obligation.
            </p>
            <div>
              <Link
                to="/preview"
                className="inline-block px-8 py-4 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] active:scale-95"
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
