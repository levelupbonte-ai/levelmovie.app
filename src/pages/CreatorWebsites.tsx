import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function CreatorWebsites() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Why should I move away from standard link-in-bio services?',
      a: 'Third-party link tree services lock your audience on their domain, restrict visual branding, display generic URLs, and can change terms or suspend accounts at any time. Having your own custom domain establishes credibility with sponsors, captures emails directly to your mailing list, and gives you total control over analytics.'
    },
    {
      q: 'How does the media kit page work for brand partnerships?',
      a: 'We design a clean, password-optional media kit section displaying your audience demographics, past brand campaigns, engagement metrics, deliverables, and rates. Brands get a polished pitch document directly on your website without messy PDF attachments.'
    },
    {
      q: 'Can I sell digital downloads or merch directly?',
      a: 'Yes. We integrate lightweight Stripe or LemonSqueezy payment buttons for presets, guides, audio samples, or apparel without expensive monthly Shopify subscriptions. See our small online store setup for full retail catalogs.'
    },
    {
      q: 'Can I update links myself from my phone?',
      a: 'Absolutely. We configure a straightforward link management workflow so you can add YouTube videos, podcast episodes, sponsor deals, and event links in seconds right from your mobile device.'
    }
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Website for Creators & Influencers',
    serviceType: 'Creator Web Design & Media Kit Integration',
    provider: {
      '@type': 'Organization',
      name: 'LevelUp Ecosystem',
      url: 'https://levelup-ecosystem.com'
    },
    description: 'A professional link-in-bio page and creator website on your own domain, with a media kit page for brand collaborations.'
  };

  return (
    <div>
      <SEO
        title="Creator & Influencer Websites | LevelUp Ecosystem"
        description="A professional link-in-bio page and creator website on your own domain, with a media kit page for brand collaborations."
        canonical="/services/creator-websites"
        breadcrumbs={[
          { name: 'Services', url: '/services' },
          { name: 'Creator Websites', url: '/services/creator-websites' }
        ]}
        jsonLd={serviceSchema}
      />

      <Breadcrumbs
        items={[
          { name: 'Services', url: '/services' },
          { name: 'Creator Websites', url: '/services/creator-websites' }
        ]}
      />

      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-6 text-left" data-reveal>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
            Creator Economy
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Custom Websites for Creators & Influencers
          </h1>

          <p className="text-base sm:text-xl text-[#A1A1B5] leading-relaxed max-w-3xl">
            Own your audience. Replace disposable multi-link trees with a branded digital headquarters, live media kit for brand partnerships, and direct fan newsletter capture on your own domain.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/preview"
              className="px-7 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95"
            >
              Get a free preview
            </Link>
            <Link
              to="/services/online-stores"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              Add digital store setup →
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
              <h2 className="text-xl font-bold text-white">Custom Domain Authority</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Sending brands and followers to a generic third-party aggregator signals amateur status. Placing your link in bio on your personal domain (yourname.com) builds lasting authority, increases click-through rates, and protects you against algorithmic shadowbans or policy changes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                02
              </div>
              <h2 className="text-xl font-bold text-white">Media Kit for Sponsorships</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Brand marketers want immediate access to your demographic breakdown, past sponsor deliverables, case studies, and partnership packages. We build an interactive media kit page that lets brand representatives review your numbers and request collaborations in one click.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                03
              </div>
              <h2 className="text-xl font-bold text-white">Direct Fan Email Capture</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Social algorithms change constantly, cutting organic reach overnight. Your email list is an asset you fully control. We integrate high-converting newsletter signups with Mailchimp, Substack, ConvertKit, or Beehiiv with automated welcome flows.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                04
              </div>
              <h2 className="text-xl font-bold text-white">Privacy & Account Shielding</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Creators face aggressive phishing, account takeover attempts, and privacy leakage. We hide WHOIS ownership data, protect private email addresses with contact proxies, and assist you in hardening your primary Google and social logins with hardware 2FA keys.
              </p>
            </div>
          </div>

          {/* Deep Content Block */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-6" data-reveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Creators Choose LevelUp
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
              We specialize in lightweight static architectures that load in a fraction of a second. Whether a follower taps your Instagram bio, TikTok profile, or YouTube description during a viral spike, the page never crashes or throttles. No bloatware, no slow tracking scripts, and no monthly platform cuts on your sponsor earnings.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/services/portfolio-websites"
                className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Compare with portfolio website design →
              </Link>
              <Link
                to="/services/security-check"
                className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Check your account security →
              </Link>
            </div>
          </div>

          {/* Related Cross Links */}
          <div className="border-t border-white/[0.08] pt-12 space-y-4" data-reveal>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Explore Related Services
            </h3>
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
              <Link
                to="/services/online-stores"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Small online store setup for merch
              </Link>
              <Link
                to="/services/portfolio-websites"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Portfolio website design
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
                Answers
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
              Launch your creator website on your own domain
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] max-w-xl mx-auto">
              Send us your social handles and links. We will craft a clean working mobile preview within 24 to 48 hours.
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
