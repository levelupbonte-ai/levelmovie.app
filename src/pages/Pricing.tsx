import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Pricing() {
  const faqs = [
    {
      q: 'How does the free preview work?',
      a: 'You send us your business name, logo (if you have one), and general ideas. Within 24 to 48 hours, we build a functional, interactive mobile preview of your site. You get to test it on your phone before spending a single dollar. If you like it, we move forward. If not, you owe nothing.'
    },
    {
      q: 'How long does a full website build take?',
      a: 'Most standard small business sites are completed within 1 to 2 weeks once we receive your photos, service details, and content. Because we work with a streamlined workflow, projects move quickly without agency delays.'
    },
    {
      q: 'How does payment work?',
      a: 'For one-time build packages (Starter and Secure), payment is split into two milestones: a 50% deposit to begin full production after you approve your free preview, and the remaining 50% upon final launch on your domain. For the monthly care plan, billing begins 30 days after launch.'
    },
    {
      q: 'What is your role with AI tools?',
      a: 'We use modern AI tools to accelerate repetitive layout drafting and code scaffolding, which allows us to offer fair, accessible rates for small businesses. However, we personally write the architecture, review every database rule, inspect security headers, configure 2FA, and test every button before launch. We never share clients\' private data with AI tools.'
    },
    {
      q: 'Do I own my website and domain?',
      a: 'Yes, 100%. Once final payment is settled, you own all rights to your domain, branding, text, and customer lists. There are no lock-in contracts or hostage fees.'
    },
    {
      q: 'What is included in the Security Check?',
      a: 'We audit your domain registrar and DNS settings, verify SSL HTTPS certificates, audit database permissions, implement two-factor authentication (2FA) on your hosting and business email accounts, install spam bot honeypots, and give you a personal walkthrough on how to spot phishing attempts.'
    }
  ];

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
        title="Website Pricing & Packages | LevelUp Ecosystem"
        description="Transparent, upfront pricing for web design, online booking, and security checks. Free preview before you commit."
        canonical="/pricing"
        breadcrumbs={[
          { name: 'Pricing', url: '/pricing' }
        ]}
        jsonLd={faqSchema}
      />

      <Breadcrumbs
        items={[
          { name: 'Pricing', url: '/pricing' }
        ]}
      />

      {/* Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4" data-reveal>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Clear Investment
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Transparent Pricing & Packages
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            Simple packages tailored to your scale. Every plan includes a free interactive preview before any payment is due.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14] border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch" data-reveal-group>
            
            {/* Starter */}
            <div className="bg-[#14141F] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-between space-y-8" data-reveal>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Starter</h3>
                  <p className="text-xs text-[#A1A1B5] mt-1">For simple presence and direct contact</p>
                </div>

                <div>
                  <div className="text-4xl font-extrabold text-white">$500</div>
                  <span className="text-xs text-[#A78BFA]">one-time setup fee</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-[#A1A1B5] border-t border-white/[0.06] pt-6">
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Fast mobile-responsive one-page site
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Direct contact & click-to-call action
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> SSL Certificate (HTTPS) included
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Clean typography & brand colors
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Basic local SEO meta tags
                  </li>
                </ul>
              </div>

              <Link
                to="/preview"
                className="w-full py-3.5 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold text-xs sm:text-sm border border-white/[0.1] text-center transition-all cursor-pointer"
              >
                Get a free preview
              </Link>
            </div>

            {/* Secure (Most Popular) */}
            <div className="bg-[#14141F] border-2 border-[#7C3AED] rounded-3xl p-8 flex flex-col justify-between space-y-8 relative shadow-2xl shadow-[#7C3AED]/20 md:-translate-y-3" data-reveal>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow">
                Most Popular
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Secure</h3>
                  <p className="text-xs text-[#A1A1B5] mt-1">For businesses requiring booking & protection</p>
                </div>

                <div>
                  <div className="text-4xl font-extrabold text-white">$900</div>
                  <span className="text-xs text-[#A78BFA]">one-time setup fee</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-200 border-t border-white/[0.06] pt-6">
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Everything in Starter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> <strong>24/7 online appointment booking</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Secure customer database configuration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Automated offsite backup routine
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Anti-bot spam defense on forms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> 2FA setup on domain & email accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Google Business Profile & Maps setup
                  </li>
                </ul>
              </div>

              <Link
                to="/preview"
                className="w-full py-3.5 px-4 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] text-center transition-all cursor-pointer"
              >
                Get a free preview
              </Link>
            </div>

            {/* Secure + Care */}
            <div className="bg-[#14141F] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-between space-y-8" data-reveal>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Secure + Care</h3>
                  <p className="text-xs text-[#A1A1B5] mt-1">Full build plus ongoing hands-off peace of mind</p>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">$900</div>
                  <span className="text-xs text-[#A78BFA]">+ $75/mo (cancel anytime)</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-[#A1A1B5] border-t border-white/[0.06] pt-6">
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Everything in Secure
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> High-speed cloud hosting included
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Routine monthly security updates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Daily automated snapshots & backups
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> On-demand content updates (hours, prices)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Priority support
                  </li>
                </ul>
              </div>

              <Link
                to="/preview"
                className="w-full py-3.5 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold text-xs sm:text-sm border border-white/[0.1] text-center transition-all cursor-pointer"
              >
                Get a free preview
              </Link>
            </div>

          </div>

          {/* Standalone Security Check Box */}
          <div className="p-8 rounded-3xl bg-[#14141F] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6" data-reveal>
            <div className="space-y-2 text-left">
              <div className="text-xs font-mono font-bold text-[#A78BFA]">STANDALONE AUDIT</div>
              <h3 className="text-xl font-bold text-white">Website Security Check</h3>
              <p className="text-sm text-[#A1A1B5] max-w-xl">
                Have an existing website? We audit your domain registrar, hosting, database rules, SSL, and admin accounts to fix vulnerabilities before they cause problems.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <div className="text-2xl font-bold text-white">$150 <span className="text-xs font-normal text-[#A1A1B5]">flat fee</span></div>
              <Link
                to="/services/security-check"
                className="px-6 py-3 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold transition-all shadow-md shadow-[#7C3AED]/20"
              >
                Learn more
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2" data-reveal>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
              Questions Answered
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-reveal-group>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2 text-left"
                data-reveal
              >
                <h3 className="text-base font-bold text-white">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
