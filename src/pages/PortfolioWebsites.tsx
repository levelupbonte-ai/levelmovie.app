import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function PortfolioWebsites() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Who are your portfolio websites designed for?',
      a: 'We design custom portfolios for design and computer science students, creative directors, UX/UI designers, architectural illustrators, commercial photographers, software engineers, and fine artists who need an impressive professional presence for job interviews or client pitches.'
    },
    {
      q: 'How do you handle heavy imagery without slowing down the site?',
      a: 'We implement modern WebP and AVIF image compression, responsive source sets, and lazy loading powered by global edge servers. Your high-resolution photography and design case studies display crystal clear without lagging on cellular data.'
    },
    {
      q: 'Can I include a downloadable resume and project breakdown?',
      a: 'Yes. We include clean case study templates with context, challenges, solutions, and impact metrics, alongside one-click downloadable PDF resumes and direct email inquiry forms.'
    },
    {
      q: 'How do you prevent recruiters or clients from getting stuck behind forms?',
      a: 'We keep contact pathways simple: clean anti-spam contact forms with direct mail routing, links to LinkedIn, GitHub, or Behance, and click-to-copy email buttons so busy hiring managers can reach you instantly.'
    }
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Portfolio Website Design',
    serviceType: 'Portfolio Web Design',
    provider: {
      '@type': 'Organization',
      name: 'LevelUp Ecosystem',
      url: 'https://levelup-ecosystem.com'
    },
    description: 'Clean, fast portfolio websites for students, designers, photographers, developers and artists, on your own domain.'
  };

  return (
    <div>
      <SEO
        title="Portfolio Website Design | LevelUp Ecosystem"
        description="Clean, fast portfolio websites for students, designers, photographers, developers and artists, on your own domain."
        canonical="/services/portfolio-websites"
        breadcrumbs={[
          { name: 'Services', url: '/services' },
          { name: 'Portfolio Websites', url: '/services/portfolio-websites' }
        ]}
        jsonLd={serviceSchema}
      />

      <Breadcrumbs
        items={[
          { name: 'Services', url: '/services' },
          { name: 'Portfolio Websites', url: '/services/portfolio-websites' }
        ]}
      />

      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-6 text-left" data-reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-xs text-[#A78BFA] font-semibold uppercase tracking-wider">
            Creative Portfolios
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Portfolio Website Design for Creators & Pros
          </h1>

          <p className="text-base sm:text-xl text-[#A1A1B5] leading-relaxed max-w-3xl">
            Clean, blazing-fast portfolio websites designed to highlight your work and win interviews, freelance contracts, and gallery opportunities. Custom domain, zero platform lock-in.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/preview"
              className="px-7 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95"
            >
              Get a free preview
            </Link>
            <Link
              to="/projects"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              View our portfolio work →
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
              <h2 className="text-xl font-bold text-white">Your Work Takes Center Stage</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Cluttered templates with busy animations distract hiring teams. We craft restrained, modern visual systems where typography, whitespace, and color palette elevate your projects rather than competing with them.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                02
              </div>
              <h2 className="text-xl font-bold text-white">In-Depth Case Study Layouts</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Design managers and engineering recruiters do not just want to see screenshots—they want to understand your thought process. We structure project pages around problem discovery, strategic execution, iteration sketches, and measured outcomes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                03
              </div>
              <h2 className="text-xl font-bold text-white">Instant Cellular Performance</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                When sending your link over email or LinkedIn, viewers will open it on phones over imperfect wireless signals. Our sites load in under a second, utilizing lightweight code and intelligent responsive image assets to avoid embarrassing bounce rates.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                04
              </div>
              <h2 className="text-xl font-bold text-white">Hassle-Free Custom Domain</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Skip the generic subdomain extensions of free builders. We connect your custom domain name with automatic SSL encryption, clean metadata previews when shared on iMessage, Slack, or Twitter, and zero monthly template fees.
              </p>
            </div>
          </div>

          {/* Value comparison */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-6" data-reveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Built for Professional Career Advancement
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
              Whether you are graduating from a university program or pivoting to independent client consulting, a standalone portfolio website communicates intentionality and technical craftsmanship. We ensure your resume, client testimonials, and contact links are accessible in a single tap on any screen.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/services/creator-websites"
                className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Website for creators & influencers →
              </Link>
              <Link
                to="/pricing"
                className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                See transparent package pricing →
              </Link>
            </div>
          </div>

          {/* Related Cross Links */}
          <div className="border-t border-white/[0.08] pt-12 space-y-4" data-reveal>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Explore More Studio Services
            </h3>
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
              <Link
                to="/services/creator-websites"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Creator website with media kit
              </Link>
              <Link
                to="/services/online-stores"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Small online store setup
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
                Questions
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
              Ready to present your work with confidence?
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] max-w-xl mx-auto">
              Send us your portfolio goals and a sample project link. We will prepare a working mobile layout preview for you to test.
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
