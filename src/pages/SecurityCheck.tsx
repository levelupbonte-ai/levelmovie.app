import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function SecurityCheck() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Will a security check disrupt my live website or take it offline?',
      a: 'Not at all. Our review is strictly non-destructive. We analyze your public configurations, DNS records, SSL handshakes, HTTP security headers, administrative entry points, and database rule configurations without modifying your active system or causing downtime.'
    },
    {
      q: 'What deliverables do I receive after the security check?',
      a: 'You receive a clear, plain-English PDF report prioritized into Critical, Recommended, and Best Practices. We explain exactly what each issue means, the realistic threat it poses to your business, and provide step-by-step instructions or direct remediation to fix it.'
    },
    {
      q: 'Can you help fix the issues identified in the audit?',
      a: 'Yes. For common vulnerabilities—such as configuring two-factor authentication, enforcing HTTPS redirects, locking down Firebase database security rules, hiding private keys, or installing automated backups—we can implement the remedies directly for you.'
    },
    {
      q: 'Why do small businesses need a website security check?',
      a: 'Automated internet crawlers scan millions of websites daily looking for known vulnerabilities: unauthenticated databases, exposed API credentials in source files, outdated CMS plugins, and domain accounts without two-factor protection. A simple audit prevents costly ransom demands and customer data leaks.'
    }
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Website Security Check',
    serviceType: 'Cybersecurity Assessment & Technical Hardening',
    provider: {
      '@type': 'Organization',
      name: 'LevelUp Ecosystem',
      url: 'https://levelup-ecosystem.com'
    },
    description: "A plain-English review of your website's security basics: database rules, HTTPS, exposed keys, backups and account protection."
  };

  return (
    <div>
      <SEO
        title="Website Security Check | LevelUp Ecosystem"
        description="A plain-English review of your website's security basics: database rules, HTTPS, exposed keys, backups and account protection."
        canonical="/services/security-check"
        breadcrumbs={[
          { name: 'Services', url: '/services' },
          { name: 'Website Security Check', url: '/services/security-check' }
        ]}
        jsonLd={serviceSchema}
      />

      <Breadcrumbs
        items={[
          { name: 'Services', url: '/services' },
          { name: 'Website Security Check', url: '/services/security-check' }
        ]}
      />

      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-6 text-left" data-reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-xs text-[#A78BFA] font-semibold uppercase tracking-wider">
            Technical Hardening
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Website Security Check in Plain English
          </h1>

          <p className="text-base sm:text-xl text-[#A1A1B5] leading-relaxed max-w-3xl">
            A comprehensive, non-destructive audit of your website's essential defenses: database security rules, SSL certificates, exposed API keys, automated backups, and admin account protections.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95"
            >
              Request a security check
            </Link>
            <Link
              to="/services/care-plans"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              Learn about ongoing care plans →
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
              <h2 className="text-xl font-bold text-white">Database Rules & Permissions</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Many modern web apps accidentally leave Firestore, Supabase, or SQL databases open to the public without authentication rules. We inspect your backend permission logic to guarantee only authorized users can read or write client records.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                02
              </div>
              <h2 className="text-xl font-bold text-white">Exposed Keys & Secrets</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Client-side code frequently leaks backend administrative tokens, payment secret keys, or cloud credentials. We thoroughly audit your JavaScript bundles and network requests to ensure sensitive credentials remain safely server-side.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                03
              </div>
              <h2 className="text-xl font-bold text-white">HTTPS & Security Headers</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Modern browsers flag sites missing valid SSL certificates or modern security policies. We verify your HTTPS encryption, Content Security Policy (CSP), anti-clickjacking headers, and DNS records to stop spoofing and eavesdropping.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                04
              </div>
              <h2 className="text-xl font-bold text-white">Account Takeover Defense & 2FA</h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                The most common cyber attack against small businesses is credential stuffing on domain registrars and email accounts. We review your login hygiene, enforce hardware or app-based 2FA, and eliminate single points of failure.
              </p>
            </div>
          </div>

          {/* Deep Content Block */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-6" data-reveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Practical Protection, Not Fear Tactics
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
              We never use scare tactics or push expensive enterprise security subscriptions that small businesses do not need. Our recommendations focus on the real-world vectors attackers actually use: weak passwords, lack of two-factor authentication, unpatched plugins, missing backups, and publicly readable database documents.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/services/care-plans"
                className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Website care plans with monthly monitoring →
              </Link>
              <Link
                to="/process"
                className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
              >
                Learn our 4-step build and review workflow →
              </Link>
            </div>
          </div>

          {/* Related Cross Links */}
          <div className="border-t border-white/[0.08] pt-12 space-y-4" data-reveal>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Related Services
            </h3>
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
              <Link
                to="/services/care-plans"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Website care plans
              </Link>
              <Link
                to="/services/local-business-websites"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Local business websites with booking
              </Link>
              <Link
                to="/pricing"
                className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#7C3AED] text-[#A1A1B5] hover:text-white transition-all"
              >
                Security check flat-rate pricing
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
              Protect your business website today
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] max-w-xl mx-auto">
              Send us your website URL. We will perform a baseline security audit and provide clear findings in plain English within 24 to 48 hours.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all shadow-lg shadow-[#7C3AED]/30"
            >
              Request a security check
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
