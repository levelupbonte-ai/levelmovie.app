import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function OnlineStores() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Which payment processors do you configure for checkout?',
      a: 'We set up Stripe, Apple Pay, Google Pay, and PayPal. All payment transactions and credit card data are handled directly by PCI-compliant payment infrastructure—no customer credit cards ever touch your server.'
    },
    {
      q: 'Can I sell digital products like eBooks, presets, or templates?',
      a: 'Yes. We configure automated fulfillment workflows where paying customers instantly receive a secure, time-expiring download link via email and on their post-purchase order confirmation screen.'
    },
    {
      q: 'Do I have to pay high recurring monthly fees to Shopify or app plugins?',
      a: 'No. For small stores selling up to 25 items or focused merch drops, heavy enterprise platforms with $40–$100/mo base fees and paid plugin subscriptions are unnecessary overhead. We build lean, low-maintenance stores where you only pay standard payment gateway transaction fees.'
    },
    {
      q: 'How do I handle inventory and order alerts?',
      a: 'You receive instant email and mobile notifications for every completed order with customer shipping addresses, selected variants, and receipts automatically generated.'
    }
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Small Online Store Setup',
    serviceType: 'E-commerce Web Design & Payment Setup',
    provider: {
      '@type': 'Organization',
      name: 'LevelUp Ecosystem',
      url: 'https://levelup-ecosystem.com'
    },
    description: 'Simple, secure online stores for products, merch and digital downloads, with checkout handled by trusted payment providers.'
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
        title="Online Store Setup | LevelUp Ecosystem"
        description="Simple, secure online stores for products, merch and digital downloads, with checkout handled by trusted payment providers."
        canonical="/services/online-stores"
        breadcrumbs={[
          { name: 'Services', url: '/services' },
          { name: 'Small Online Stores', url: '/services/online-stores' }
        ]}
        jsonLd={[serviceSchema, faqSchema]}
      />

      <Breadcrumbs
        items={[
          { name: 'Services', url: '/services' },
          { name: 'Small Online Stores', url: '/services/online-stores' }
        ]}
      />

      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-6 text-left" data-reveal>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
            Lean E-Commerce
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Small Online Store Setup for Products & Merch
          </h1>

          <p className="text-base sm:text-xl text-[#A1A1B5] leading-relaxed max-w-3xl">
            Sell physical items, branded apparel, or digital downloads directly to your audience without bloated monthly software overhead. Fast checkout, secure payments, and zero technical hassle.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/preview"
              className="px-7 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95"
            >
              Get a free preview
            </Link>
            <Link
              to="/services/care-plans"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              See monthly store care plans →
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
              <h2 className="text-xl font-bold text-white">Streamlined Mobile Checkout</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Cart abandonment spikes whenever customers face complicated multi-step forms. We build streamlined, single-screen checkouts featuring one-tap Apple Pay and Google Pay to capture impulse sales while shoppers are on their phones.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                02
              </div>
              <h2 className="text-xl font-bold text-white">Industry-Standard Security</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Security is paramount when handling money. We route all payment processing through certified PCI Level 1 providers like Stripe. Customer payment details never reside in your database, safeguarding you and your buyers against data breaches.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                03
              </div>
              <h2 className="text-xl font-bold text-white">Digital Product Fulfillment</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Selling photography presets, PDF meal plans, workout routines, or digital music? We configure instant delivery mechanisms with time-restricted links to protect your files against unauthorized distribution.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                04
              </div>
              <h2 className="text-xl font-bold text-white">No Monthly Platform Bloat</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Typical store builders lock you into recurring monthly plans and charge extra for essential features like currency conversion, custom domains, or review forms. We build lean storefronts that keep your monthly operating costs near zero.
              </p>
            </div>
          </div>

          {/* Deep Content Block */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-6" data-reveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Designed for Boutique Brands & Creators
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
              If your catalog contains hundreds of variations and complex warehouse shipping integrations, you might need a dedicated fulfillment platform. But if you have 1 to 30 curated products, limited merchandise drops, or digital guides, our lean architecture offers faster page loading, higher conversion rates, and vastly simpler daily management.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/services/creator-websites"
                className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Website for creators & influencers →
              </Link>
              <Link
                to="/services/security-check"
                className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Website security check →
              </Link>
            </div>
          </div>

          {/* Related Cross Links */}
          <div className="border-t border-white/[0.08] pt-12 space-y-4" data-reveal>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Related Services & Solutions
            </h3>
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
              <Link
                to="/services/local-business-websites"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Local business websites with booking
              </Link>
              <Link
                to="/services/creator-websites"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Creator website with media kit
              </Link>
              <Link
                to="/services/care-plans"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Website care plans
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
              Launch your online store with ease
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] max-w-xl mx-auto">
              Tell us about your products or merchandise. We will assemble a clean working preview of your catalog and cart for review.
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
