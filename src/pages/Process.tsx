import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';

export default function Process() {
  const steps = [
    {
      number: '01',
      title: 'Discovery',
      subtitle: 'Understanding your business and creating a free preview',
      desc: 'We start with a quick conversation about your business, your target customers, and the specific functionality you need (booking, digital menu, portfolio, or shop). Within 24 to 48 hours, I assemble a functional mobile preview so you can interact with your design before any payment is discussed.'
    },
    {
      number: '02',
      title: 'Build',
      subtitle: 'Modern code scaffolding and responsive design',
      desc: 'Once you approve the initial preview, I build out the entire website. I leverage modern AI development tools to rapidly generate clean boilerplate and component layouts, which keeps production costs accessible for independent local businesses. I then personally hand-tune the typography, spacing, mobile ergonomics, and integrations.'
    },
    {
      number: '03',
      title: 'Review & Security Check',
      subtitle: 'Hands-on auditing and security hardening',
      desc: 'Before any code goes live, I personally run a security check. As a cybersecurity student, I manually verify that database rules are strictly scoped, API keys and credentials are not exposed to the browser, SSL/HTTPS certificates are enforced, and form inputs are protected against spam bots. I also assist you in enabling two-factor authentication (2FA) on your domain registrar and business accounts.'
    },
    {
      number: '04',
      title: 'Launch & Care',
      subtitle: 'Domain mapping, Google setup, and ongoing reliability',
      desc: 'We map your site to your custom domain, register your Google Business Profile for Maps discovery, configure automated offsite backups, and verify that mobile page speed is under 2 seconds. Through our Care plan, I provide ongoing hosting, routine security patches, and text or photo updates whenever you need them.'
    }
  ];

  return (
    <div>
      <SEO
        title="How We Build | AI-assisted, Human-directed, Security-checked"
        description="Learn how LevelUp Ecosystem uses AI tools to keep web design affordable while personally auditing security, database rules, and account protection."
      />

      {/* Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Our Engineering Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            AI-assisted. Human-directed. Security-checked.
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            I use AI tools to design and build websites faster, which keeps prices fair for small businesses. Every project is planned, reviewed and tested by me before launch, with security checks on database rules, exposed keys, HTTPS, backups and account protection.
          </p>

          <div className="inline-block px-4 py-2 rounded-full bg-[#14141F] border border-white/[0.08] text-xs text-[#A1A1B5]">
            🔒 <strong className="text-white">Privacy Guarantee:</strong> I never share clients' private data with AI tools.
          </div>
        </div>
      </section>

      {/* 4 Steps Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-5xl mx-auto space-y-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-white/[0.08] hover:border-white/[0.16] transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              <div className="md:col-span-3 space-y-2">
                <span className="text-xs font-mono font-bold text-[#A78BFA] px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20">
                  STEP {step.number}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white pt-2">
                  {step.title}
                </h3>
              </div>

              <div className="md:col-span-9 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
                  {step.subtitle}
                </h4>
                <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Honest Security Disclaimer */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-[#14141F] border-t border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto space-y-6 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Honest Security Disclosure
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            What my security check does (and what it doesn't)
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
            I don't claim that any website is "100% hack-proof" or "unbreakable"—any engineer who claims that is lying to you. What I do is apply rigorous, foundational cybersecurity hygiene that stops the vast majority of opportunistic attacks:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#A1A1B5]">
            <div className="p-4 rounded-xl bg-[#0B0B14] border border-white/[0.06] space-y-1">
              <span className="text-white font-bold">✓ Multi-Factor Authentication (2FA)</span>
              <p>Protects your domain registrar and administrative dashboards from credential stuffing.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0B0B14] border border-white/[0.06] space-y-1">
              <span className="text-white font-bold">✓ Scoped Database Rules</span>
              <p>Ensures visitor records cannot be read or overwritten by anonymous internet users.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0B0B14] border border-white/[0.06] space-y-1">
              <span className="text-white font-bold">✓ Zero Exposed API Keys</span>
              <p>Secret credentials remain securely hosted and are never exposed in browser source code.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0B0B14] border border-white/[0.06] space-y-1">
              <span className="text-white font-bold">✓ Automated Offsite Backups</span>
              <p>Ensures that even in a worst-case server outage, your data and site can be restored rapidly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to experience the process?
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1B5]">
            Send your business info and receive a working mobile preview within 24 to 48 hours.
          </p>
          <div>
            <Link
              to="/preview"
              className="inline-block px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all shadow-md shadow-[#7C3AED]/25"
            >
              Get a free preview
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
