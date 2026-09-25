import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function CarePlans() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'What types of edits are included under the monthly care plan?',
      a: 'Included edits cover text updates, price changes, adding new team members or services, swapping photos, updating announcements, and embedding new video or social links. Larger redesigns or new bespoke feature builds are quoted separately at a preferred client rate.'
    },
    {
      q: 'How fast are requested website changes turned around?',
      a: 'Routine text and image updates are typically published within 24 to 48 business hours. Urgent hotfixes (such as broken links or booking schedule conflicts) receive same-day priority.'
    },
    {
      q: 'Am I locked into an annual contract?',
      a: 'No. Care plans are billed month-to-month with no long-term lock-in or cancellation penalties. You can pause or cancel anytime with simple advance notice.'
    },
    {
      q: 'What happens if my website encounters an issue or goes down?',
      a: 'We maintain continuous automated uptime checks and daily offsite backups. If an outage or failure occurs, our monitoring alerts us immediately, and we restore the site from the latest clean backup.'
    }
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Website Care Plans',
    serviceType: 'Website Maintenance, Hosting & Monitoring',
    provider: {
      '@type': 'Organization',
      name: 'LevelUp Ecosystem',
      url: 'https://levelup-ecosystem.com'
    },
    description: 'Hosting, backups, quick edits and basic security monitoring to keep your website updated and running.'
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
        title="Website Care Plans | LevelUp Ecosystem"
        description="Hosting, backups, quick edits and basic security monitoring to keep your website updated and running."
        canonical="/services/care-plans"
        breadcrumbs={[
          { name: 'Services', url: '/services' },
          { name: 'Website Care Plans', url: '/services/care-plans' }
        ]}
        jsonLd={[serviceSchema, faqSchema]}
      />

      <Breadcrumbs
        items={[
          { name: 'Services', url: '/services' },
          { name: 'Website Care Plans', url: '/services/care-plans' }
        ]}
      />

      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-6 text-left" data-reveal>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
            Ongoing Maintenance
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Monthly Website Care Plans
          </h1>

          <p className="text-base sm:text-xl text-[#A1A1B5] leading-relaxed max-w-3xl">
            Never worry about website updates, broken plugins, or hosting outages again. Fast cloud hosting, automated daily backups, monthly security audits, and on-demand content edits.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/preview"
              className="px-7 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95"
            >
              Get a free preview
            </Link>
            <Link
              to="/pricing"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              View care plan pricing ($49/mo) →
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
              <h2 className="text-xl font-bold text-white">High-Speed Cloud Hosting</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Your site is hosted on enterprise-grade edge servers with global distribution. Pages load with sub-second speeds for customers everywhere, backed by automatic SSL certificate renewals and 99.9% uptime reliability.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                02
              </div>
              <h2 className="text-xl font-bold text-white">Daily Offsite Backups</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                If an unexpected mistake occurs or a file gets corrupted, your website can be restored in minutes. We store multiple automated snapshots in secure offsite cloud storage for full operational peace of mind.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                03
              </div>
              <h2 className="text-xl font-bold text-white">Quick On-Demand Edits</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Updating menu items, seasonal hours, staff photos, or promotional banners shouldn't consume your weekend. Email or text us your requested updates and we publish them promptly so your business always looks fresh.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                04
              </div>
              <h2 className="text-xl font-bold text-white">Proactive Security Monitoring</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                We continuously scan your domain DNS health, SSL expiration dates, dependency updates, and contact form spam logs. Issues are remediated quietly in the background before they ever impact your clients.
              </p>
            </div>
          </div>

          {/* Deep Content Block */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-6" data-reveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Business Owners Outsource Maintenance
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
              When business owners attempt to manage self-hosted CMS platforms themselves, sites often languish without updates for months. Vulnerabilities go unpatched, backups fail silently, and small formatting mistakes ruin mobile layouts. Our care plan turns your website into a turnkey asset managed by an experienced technical partner.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/services/security-check"
                className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Website security check for existing sites →
              </Link>
              <Link
                to="/pricing"
                className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Explore all pricing options →
              </Link>
            </div>
          </div>

          {/* Related Cross Links */}
          <div className="border-t border-white/[0.08] pt-12 space-y-4" data-reveal>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Related Services & Resources
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
                to="/web-design-san-diego"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Web design in San Diego
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-6" data-reveal>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                FAQ
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
              Keep your website fast, fresh, and protected
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] max-w-xl mx-auto">
              Enroll your new or existing website in our monthly care plan. Simple flat pricing, zero lock-in contracts.
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
