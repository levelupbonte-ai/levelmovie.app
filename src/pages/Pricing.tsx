import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
    <div className="bg-[#0B0B14] min-h-screen text-white relative overflow-hidden">
      <SEO
        title="Website Pricing & Packages | LevelUp Ecosystem"
        description="Transparent, upfront pricing for web design, online booking, and security checks. Free preview before you commit."
        canonical="/pricing"
        breadcrumbs={[
          { name: 'Pricing', url: '/pricing' }
        ]}
        jsonLd={faqSchema}
      />

      {/* Subtle ambient lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#7C3AED]/10 blur-[150px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      <Breadcrumbs
        items={[
          { name: 'Pricing', url: '/pricing' }
        ]}
      />

      {/* Header */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Clear Investment
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Transparent Pricing & Packages
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            Engineered packages tailored to your scale. Every plan includes a free interactive preview before any payment is due.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch" data-reveal-group>
            
            {/* Starter Tier */}
            <div
              className="rounded-3xl bg-gradient-to-b from-[#151526] via-[#10101C] to-[#0A0A12] border border-white/[0.08] hover:border-white/[0.16] p-8 sm:p-9 flex flex-col justify-between space-y-8 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] group"
              data-reveal
            >
              <div className="space-y-6">
                <div className="space-y-1.5 pb-4 border-b border-white/[0.06]">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1B5] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                    Essential Foundation
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Starter</h3>
                  <p className="text-xs text-[#A1A1B5]">For fast mobile presence and direct client contact</p>
                </div>

                <div>
                  <div className="text-4xl font-black text-white tracking-tight">$500</div>
                  <span className="text-xs text-[#A78BFA] font-medium">One-time setup · No platform lock-in</span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-[#D1D1DF] pt-2">
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>Fast mobile-responsive one-page site</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>Direct contact &amp; click-to-call action</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>SSL Certificate (HTTPS) included</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>Clean typography &amp; custom brand palette</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>Local SEO meta tags &amp; OpenGraph</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>Anti-bot honeypot spam protection</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>Zero monthly website builder subscriptions</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/preview"
                className="w-full py-3.5 px-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-xs sm:text-sm border border-white/[0.1] hover:border-white/[0.2] text-center transition-all duration-200 cursor-pointer active:scale-[0.99]"
              >
                Get a free preview
              </Link>
            </div>

            {/* Secure Tier (Flagship / Most Popular) */}
            <div
              className="rounded-3xl bg-gradient-to-b from-[#1C1738] via-[#131126] to-[#0D0C1A] border-2 border-[#7C3AED] ring-1 ring-[#A78BFA]/30 p-8 sm:p-9 flex flex-col justify-between space-y-8 relative shadow-[0_25px_60px_-15px_rgba(124,58,237,0.35)] md:-translate-y-3 transition-all duration-300"
              data-reveal
            >
              {/* Radiant light beam on top border */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C4B5FD] to-transparent pointer-events-none" />

              <div className="space-y-6">
                <div className="space-y-2 pb-4 border-b border-[#7C3AED]/30">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-white bg-gradient-to-r from-[#7C3AED] to-[#9333EA] shadow-[0_0_15px_rgba(124,58,237,0.45)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>Most Popular</span>
                    </div>
                    <span className="text-xs font-mono text-[#DDD6FE] bg-[#7C3AED]/20 px-2.5 py-0.5 rounded-full border border-[#7C3AED]/40">
                      Studio Pick
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Secure</h3>
                  <p className="text-xs text-[#DDD6FE]/80">Complete solution for businesses needing 24/7 booking & protection</p>
                </div>

                <div>
                  <div className="text-4xl font-black text-white tracking-tight">$900</div>
                  <span className="text-xs text-[#A78BFA] font-medium">One-time setup · Full turn-key launch</span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-100 pt-2">
                  <li className="flex items-start gap-2.5 font-medium">
                    <span className="w-4 h-4 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5 shadow-[0_0_8px_rgba(124,58,237,0.6)]">
                      ✓
                    </span>
                    <span>Everything included in Starter</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5 shadow-[0_0_8px_rgba(124,58,237,0.6)]">
                      ✓
                    </span>
                    <span><strong className="text-white">24/7 online appointment booking system</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5 shadow-[0_0_8px_rgba(124,58,237,0.6)]">
                      ✓
                    </span>
                    <span>Secure client database &amp; lead management</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5 shadow-[0_0_8px_rgba(124,58,237,0.6)]">
                      ✓
                    </span>
                    <span>Automated offsite backup routine</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5 shadow-[0_0_8px_rgba(124,58,237,0.6)]">
                      ✓
                    </span>
                    <span>Anti-bot spam defense on forms</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5 shadow-[0_0_8px_rgba(124,58,237,0.6)]">
                      ✓
                    </span>
                    <span>2FA setup on domain &amp; admin accounts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5 shadow-[0_0_8px_rgba(124,58,237,0.6)]">
                      ✓
                    </span>
                    <span>Google Business Profile &amp; Maps synchronization</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/preview"
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#7C3AED] hover:from-[#8B5CF6] hover:to-[#A78BFA] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#7C3AED]/35 hover:shadow-[#7C3AED]/55 text-center transition-all duration-300 cursor-pointer active:scale-[0.99]"
              >
                Get a free preview
              </Link>
            </div>

            {/* Secure + Care Tier */}
            <div
              className="rounded-3xl bg-gradient-to-b from-[#151526] via-[#10101C] to-[#0A0A12] border border-white/[0.08] hover:border-white/[0.16] p-8 sm:p-9 flex flex-col justify-between space-y-8 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] group"
              data-reveal
            >
              <div className="space-y-6">
                <div className="space-y-1.5 pb-4 border-b border-white/[0.06]">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1B5] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                    Hands-Off Maintenance
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Secure + Care</h3>
                  <p className="text-xs text-[#A1A1B5]">Full build plus continuous managed support</p>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    $900 <span className="text-base font-normal text-[#A1A1B5]">+ $75/mo</span>
                  </div>
                  <span className="text-xs text-[#A78BFA] font-medium">Cancel anytime · Dedicated engineering</span>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-[#D1D1DF] pt-2">
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>Everything in Secure tier</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>High-speed cloud hosting included</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>Routine monthly security &amp; library updates</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>Daily automated snapshots &amp; recovery</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>On-demand content edits (hours, prices, menus)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>24/7 uptime &amp; SSL certificate monitoring</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-white/[0.06] text-[#A78BFA] flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      ✓
                    </span>
                    <span>Direct priority developer support</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/preview"
                className="w-full py-3.5 px-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-xs sm:text-sm border border-white/[0.1] hover:border-white/[0.2] text-center transition-all duration-200 cursor-pointer active:scale-[0.99]"
              >
                Get a free preview
              </Link>
            </div>

          </div>

          {/* Standalone Security Check Box */}
          <div
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#151526] to-[#10101E] border border-white/[0.08] hover:border-[#7C3AED]/40 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300"
            data-reveal
          >
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#A78BFA]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                STANDALONE SECURITY AUDIT
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Website Security Check</h3>
              <p className="text-sm text-[#A1A1B5] max-w-xl leading-relaxed">
                Have an existing website? We audit your domain registrar, hosting, database rules, SSL, and admin accounts to fix vulnerabilities before they cause problems.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <div className="text-2xl sm:text-3xl font-black text-white">
                $150 <span className="text-xs font-normal text-[#A1A1B5]">flat fee</span>
              </div>
              <Link
                to="/services/security-check"
                className="px-6 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold transition-all shadow-md shadow-[#7C3AED]/25 hover:shadow-[#7C3AED]/40 active:scale-95"
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

          <div className="space-y-4 max-w-3xl mx-auto" data-reveal>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-[#141424] border-[#7C3AED]/40 shadow-lg shadow-[#7C3AED]/10'
                      : 'bg-[#11111B] border-white/[0.08] hover:border-white/[0.16]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/60"
                  >
                    <span className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                      {faq.q}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xl font-light transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#7C3AED] text-white rotate-90 shadow-md shadow-[#7C3AED]/30'
                          : 'bg-white/[0.06] text-[#A78BFA] hover:bg-white/[0.12] hover:text-white'
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-sm sm:text-base text-[#B3B3C8] leading-relaxed border-t border-white/[0.05] animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </div>
  );
}
