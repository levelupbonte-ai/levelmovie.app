import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';

export default function Pricing() {
  const faqs = [
    {
      q: 'How does the free preview work?',
      a: 'You send me your business name, logo (if you have one), and general ideas. Within 24 to 48 hours, I build a functional, interactive mobile preview of your site. You get to test it on your phone before spending a single dollar. If you like it, we move forward. If not, you owe nothing.'
    },
    {
      q: 'How long does a full website build take?',
      a: 'Most standard small business sites are completed within 1 to 2 weeks once I receive your photos, service details, and content. Because I work independently with a streamlined workflow, projects move quickly without corporate delays.'
    },
    {
      q: 'How does payment work?',
      a: 'For one-time build packages (Starter and Secure), payment is split into two milestones: a 50% deposit to begin full production after you approve your free preview, and the remaining 50% upon final launch on your domain. For the Secure + Care plan, the $75/month maintenance begins 30 days after launch.'
    },
    {
      q: 'What is your role with AI tools?',
      a: 'I use modern AI tools to accelerate repetitive layout drafting and code scaffolding, which allows me to offer fair, accessible rates for small businesses. However, I personally write the architecture, review every database rule, inspect security headers, configure 2FA, and test every button before launch. I never share clients\' private data with AI tools.'
    },
    {
      q: 'Do I own my website and domain?',
      a: 'Yes, 100%. Once final payment is settled, you own all rights to your domain, branding, text, and customer lists. There are no lock-in contracts or hostage fees.'
    },
    {
      q: 'What is included in the Security Check?',
      a: 'I audit your domain registrar and DNS settings, verify SSL HTTPS certificates, audit database permissions, implement two-factor authentication (2FA) on your hosting and business email accounts, install spam bot honeypots, and give you a personal walkthrough on how to spot phishing attempts.'
    }
  ];

  return (
    <div>
      <SEO
        title="Transparent Pricing & Plans"
        description="Simple, upfront pricing for web design and security. Starter from $500, Secure from $900, plus optional maintenance. No hidden fees."
      />

      {/* Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Clear Investment
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            Simple packages tailored to your scale. Every plan includes a free interactive preview before any payment is due.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14] border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Starter */}
            <div className="bg-[#14141F] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-between space-y-8">
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
                to="/contact"
                className="w-full py-3.5 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold text-xs sm:text-sm border border-white/[0.1] text-center transition-all cursor-pointer"
              >
                Get a free preview
              </Link>
            </div>

            {/* Secure (Most Popular) */}
            <div className="bg-[#14141F] border-2 border-[#7C3AED] rounded-3xl p-8 flex flex-col justify-between space-y-8 relative shadow-2xl shadow-[#7C3AED]/20 md:-translate-y-3">
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
                to="/contact"
                className="w-full py-3.5 px-4 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] text-center transition-all cursor-pointer"
              >
                Get a free preview
              </Link>
            </div>

            {/* Secure + Care */}
            <div className="bg-[#14141F] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Secure + Care</h3>
                  <p className="text-xs text-[#A1A1B5] mt-1">Full build plus ongoing hands-off peace of mind</p>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">$900</div>
                  <span className="text-xs text-[#A78BFA]">+ $75 / month</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-[#A1A1B5] border-t border-white/[0.06] pt-6">
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Everything in Secure
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> High-speed cloud hosting included
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Monthly security patches & framework updates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> On-demand photo & text edits
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Daily monitored backups
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#7C3AED] font-bold">✓</span> Direct priority email support with me
                  </li>
                </ul>
              </div>

              <Link
                to="/contact"
                className="w-full py-3.5 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold text-xs sm:text-sm border border-white/[0.1] text-center transition-all cursor-pointer"
              >
                Get a free preview
              </Link>
            </div>

          </div>

          <div className="text-center pt-2">
            <Link
              to="/contact"
              className="text-sm text-[#A78BFA] hover:text-white underline underline-offset-4 transition-colors"
            >
              Need a standalone Security Check or customized platform? Request a custom quote →
            </Link>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-3 text-left"
              >
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {faq.q}
                </h3>
                <p className="text-sm text-[#A1A1B5] leading-relaxed">
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
