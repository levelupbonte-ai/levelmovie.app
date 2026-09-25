import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function WebDesignSanDiego() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Do you work in-person with San Diego business owners?',
      a: 'Yes. We are based right here in San Diego, CA. We regularly meet with local business owners in person or over video to review design previews, discuss booking workflows, and conduct hands-on staff walkthroughs.'
    },
    {
      q: 'Which San Diego neighborhoods and industries do you serve?',
      a: 'We work across San Diego County—including Downtown, North Park, Hillcrest, Pacific Beach, La Jolla, Chula Vista, and East County. Our clients include barbershops, boutique salons, fitness gyms, health practitioners, independent creators, and specialized local contractors.'
    },
    {
      q: 'Can you help our business rank higher on Google Maps in San Diego?',
      a: 'Yes. Local visibility requires coordinated website data and a verified Google Business Profile. We format your name, phone number, and service areas to match your Google listing, insert local business Schema.org structured data, and optimize page load speeds so mobile searchers convert into appointments.'
    },
    {
      q: 'How long does a website take to build and launch?',
      a: 'We generate an interactive mobile preview within 24 to 48 hours. Once you review and approve the design, full development, booking configuration, security hardening, and domain launch typically take 7 to 10 days.'
    }
  ];

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'LevelUp Ecosystem',
    description: 'Websites for San Diego businesses and creators: online booking, Google Business setup and security basics.',
    url: 'https://levelup-ecosystem.com/web-design-san-diego',
    areaServed: 'San Diego, CA',
    priceRange: '$$',
    email: 'contact@levelup-ecosystem.com',
    serviceType: [
      'Web Design',
      'Local Business Websites',
      'Appointment Booking Integration',
      'Website Security Check'
    ]
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

  return (
    <div>
      <SEO
        title="Web Design in San Diego | LevelUp Ecosystem"
        description="Websites for San Diego businesses and creators: online booking, Google Business setup and security basics. See our recent work."
        canonical="/web-design-san-diego"
        breadcrumbs={[
          { name: 'Web Design in San Diego', url: '/web-design-san-diego' }
        ]}
        jsonLd={[professionalServiceSchema, faqSchema]}
      />

      <Breadcrumbs
        items={[
          { name: 'Web Design in San Diego', url: '/web-design-san-diego' }
        ]}
      />

      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-6 text-left" data-reveal>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
            San Diego Local Web Studio
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Web Design in San Diego for Businesses & Creators
          </h1>

          <p className="text-base sm:text-xl text-[#A1A1B5] leading-relaxed max-w-3xl">
            Custom websites built for San Diego local businesses and independent creators. Fast cellular load times, 24/7 online booking, Google Business setup, and fundamental security protections.
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
              Explore our San Diego case study →
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Body (300+ words) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-reveal-group>
            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                01
              </div>
              <h2 className="text-xl font-bold text-white">Local San Diego Partner</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                When you partner with LevelUp Ecosystem, you work directly with a local San Diego developer, not an anonymous offshore ticket queue. We understand the competitive local landscape across neighborhoods from Pacific Beach to Chula Vista.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                02
              </div>
              <h2 className="text-xl font-bold text-white">24/7 Mobile Booking Integration</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                San Diego consumers search and book services on their smartphones while on the go. We configure friction-free online booking that automatically fills your calendar without back-and-forth texting or phone tag during your busy workday.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                03
              </div>
              <h2 className="text-xl font-bold text-white">Google Business & Local SEO</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                A gorgeous website is useless if local clients cannot find it. We integrate Schema.org location tags, structure your NAP (Name, Address, Phone) consistency, and align your site with Google Maps to drive nearby foot traffic.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                04
              </div>
              <h2 className="text-xl font-bold text-white">Security & Spam Shield</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Every website includes modern HTTPS encryption, clean contact form bot filters, two-factor authentication safeguards, and regular cloud snapshots so your client appointments and payment transactions remain safe.
              </p>
            </div>
          </div>

          {/* Featured San Diego Client: Final Stop */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-6" data-reveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs font-mono font-bold text-[#A78BFA] uppercase tracking-wider">
                San Diego Client Spotlight
              </span>
              <span className="text-xs text-[#A1A1B5]">
                Final Stop Barber Shop & Salon
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Case Study: Final Stop Barber Shop & Salon
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
              Final Stop Barber Shop & Salon needed a premier digital storefront to match their high-end barbershop and braiding services. We engineered a rapid, mobile-first website with automated appointment booking and Google Maps routing. In the months following release, over 40% of their total appointments transitioned seamlessly to online self-service.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/projects/final-stop"
                className="px-6 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold transition-all"
              >
                Read Final Stop case study
              </Link>
              <a
                href="https://finalstop.org"
                target="_blank"
                rel="noreferrer"
                className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Visit live finalstop.org →
              </a>
            </div>
          </div>

          {/* Related Cross Links */}
          <div className="border-t border-white/[0.08] pt-12 space-y-4" data-reveal>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Browse Specialized Solutions
            </h3>
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
              <Link
                to="/services/local-business-websites"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Local business websites with booking
              </Link>
              <Link
                to="/services/security-check"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Website security check
              </Link>
              <Link
                to="/services/care-plans"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Monthly website care plans
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-6" data-reveal>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                Local FAQ
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
              Preview your San Diego website before you decide
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] max-w-xl mx-auto">
              Share your business details or current link. We will build a free, mobile-optimized preview for your San Diego business in 24 to 48 hours.
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
