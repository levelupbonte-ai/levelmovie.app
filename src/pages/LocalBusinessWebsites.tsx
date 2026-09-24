import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function LocalBusinessWebsites() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Which online booking tools can you connect to my site?',
      a: 'We integrate with your existing booking software, including Square Appointments, Acuity, Calendly, Fresha, Vagaro, Jane App, or custom Google Calendar booking forms. Your clients can select services and book times in seconds without phone tag.'
    },
    {
      q: 'Do you help with my Google Business Profile and Maps listing?',
      a: 'Yes. We configure your structured business data, ensure your phone number and address are formatted correctly for search engines, and link your Google Maps pin directly to high-converting actions like appointment booking and driving directions.'
    },
    {
      q: 'How fast will my website load on mobile devices?',
      a: 'Every local business website is engineered for sub-2-second load times on 4G cellular connections. We compress images, eliminate slow plugins, and host your assets on a global content delivery network so prospective customers never bounce due to lag.'
    },
    {
      q: 'What basic security is included from day one?',
      a: 'We enforce full HTTPS encryption, configure spam honeypots on contact forms to stop bot junk, set up two-factor authentication on administrative portals, and ensure customer booking data flows through secure, compliant payment gateways.'
    }
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Local Business Websites with Booking',
    serviceType: 'Web Design & Booking Integration',
    provider: {
      '@type': 'Organization',
      name: 'LevelUp Ecosystem',
      url: 'https://levelup-ecosystem.com'
    },
    description: 'Modern, mobile-friendly websites with online booking, Google Business setup and security basics for barbershops, salons, gyms and more.'
  };

  return (
    <div>
      <SEO
        title="Local Business Websites with Booking | LevelUp Ecosystem"
        description="Modern, mobile-friendly websites with online booking, Google Business setup and security basics for barbershops, salons, gyms and more."
        canonical="/services/local-business-websites"
        breadcrumbs={[
          { name: 'Services', url: '/services' },
          { name: 'Local Business Websites', url: '/services/local-business-websites' }
        ]}
        jsonLd={serviceSchema}
      />

      <Breadcrumbs
        items={[
          { name: 'Services', url: '/services' },
          { name: 'Local Business Websites', url: '/services/local-business-websites' }
        ]}
      />

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14] relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 text-left" data-reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-xs text-[#A78BFA] font-semibold uppercase tracking-wider">
            Service Specialty
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Local Business Websites with Online Booking
          </h1>

          <p className="text-base sm:text-xl text-[#A1A1B5] leading-relaxed max-w-3xl">
            Turn local searchers into confirmed appointments. Fast, modern websites built for barbershops, salons, wellness clinics, personal trainers, and neighborhood storefronts.
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
              See our barbershop case study →
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Body (300+ words) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Key Value Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-reveal-group>
            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                01
              </div>
              <h2 className="text-xl font-bold text-white">24/7 Frictionless Booking</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Most appointment bookings happen after business hours when owners are resting or busy with customers. We embed smooth scheduling workflows into your site so customers can book haircuts, therapy sessions, or consults directly on their phones without calling.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                02
              </div>
              <h2 className="text-xl font-bold text-white">Google Maps & Local Search Setup</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                When someone searches nearby for a service provider, your site must provide accurate hours, location data, and instant directions. We structure your local Schema data and synchronize your links to strengthen your visibility on Google Maps and search results.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                03
              </div>
              <h2 className="text-xl font-bold text-white">Mobile-First Experience</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Over 80% of local service inquiries originate on smartphones. We design layout hierarchies with thumb-friendly tap targets, legible menus, transparent pricing lists, and single-tap phone dialers to make contacting you effortless.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                04
              </div>
              <h2 className="text-xl font-bold text-white">Security & Spam Shield</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Small business websites are frequently targeted by spam bots and fake form submissions. We include HTTPS encryption, clean form honeypots, and enforce secure account access so your inbox stays clean and your site stays protected.
              </p>
            </div>
          </div>

          {/* Real Work Highlight */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-6" data-reveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs font-mono font-bold text-[#A78BFA] uppercase tracking-wider">
                Proof of Execution
              </span>
              <span className="text-xs text-[#A1A1B5]">
                Real Client Results
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              See How Final Stop Increased Bookings by 40%
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
              When we built the custom site for Final Stop Barber Shop & Salon, the primary goal was replacing phone interruptions with direct calendar bookings. Within 60 days of launch, over 40% of their weekly client schedule was filled through self-service web bookings.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/projects/final-stop"
                className="px-6 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold transition-all"
              >
                Read Final Stop case study
              </Link>
              <Link
                to="/services/care-plans"
                className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Explore ongoing care plans →
              </Link>
            </div>
          </div>

          {/* Related Cross Links */}
          <div className="border-t border-white/[0.08] pt-12 space-y-4" data-reveal>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Related Web Solutions
            </h3>
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
              <Link
                to="/services/security-check"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Website security check for existing sites
              </Link>
              <Link
                to="/services/care-plans"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Monthly website care plans
              </Link>
              <Link
                to="/web-design-san-diego"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Web design in San Diego
              </Link>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-6" data-reveal>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                Common Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-4">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between text-left text-sm sm:text-base font-semibold text-white focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <span className="text-[#A78BFA] text-lg font-mono ml-4 shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-sm text-[#A1A1B5] leading-relaxed pr-8">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Single Focused CTA */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#14141F] border border-[#7C3AED]/30 text-center space-y-6 shadow-2xl" data-reveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Preview your new booking website before deciding
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] max-w-xl mx-auto">
              Share your business name and services. We build a working mobile preview for you to experience firsthand with zero obligation.
            </p>
            <Link
              to="/preview"
              className="inline-block px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all shadow-lg shadow-[#7C3AED]/30"
            >
              Get a free preview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
