import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Process() {
  const steps = [
    {
      number: '01',
      title: 'Discovery',
      subtitle: 'Understanding your business and creating a free preview',
      desc: 'We start with a quick conversation about your business, your target customers, and the specific functionality you need (booking, digital menu, portfolio, or shop). Within 24 to 48 hours, we assemble a functional mobile preview so you can interact with your design before any payment is discussed.'
    },
    {
      number: '02',
      title: 'Build',
      subtitle: 'Modern code scaffolding and responsive design',
      desc: 'Once you approve the initial preview, we build out the entire website. We leverage modern AI development tools to rapidly generate clean boilerplate and component layouts, which keeps production costs accessible for independent local businesses. We then personally hand-tune the typography, spacing, mobile ergonomics, and integrations.'
    },
    {
      number: '03',
      title: 'Review & Security Check',
      subtitle: 'Hands-on auditing and security hardening',
      desc: 'Before any code goes live, we run a security check. We manually verify that database rules are strictly scoped, API keys and credentials are not exposed to the browser, SSL/HTTPS certificates are enforced, and form inputs are protected against spam bots. We also assist you in enabling two-factor authentication (2FA) on your domain registrar and business accounts.'
    },
    {
      number: '04',
      title: 'Launch & Care',
      subtitle: 'Domain mapping, Google setup, and ongoing reliability',
      desc: 'We map your site to your custom domain, register your Google Business Profile for Maps discovery, configure automated offsite backups, and verify that mobile page speed is under 2 seconds. Through our Care plan, we provide ongoing hosting, routine security patches, and text or photo updates whenever you need them.'
    }
  ];

  return (
    <div>
      <SEO
        title="How We Build Websites | LevelUp Ecosystem"
        description="Learn how LevelUp Ecosystem builds fast, secure websites: AI-assisted, human-directed, and security-checked from day one."
        canonical="/process"
        breadcrumbs={[
          { name: 'How We Build', url: '/process' }
        ]}
      />

      <Breadcrumbs
        items={[
          { name: 'How We Build', url: '/process' }
        ]}
      />

      {/* Header */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Our Engineering Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            AI-assisted. Human-directed. Security-checked.
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            We use AI tools to design and build websites faster, which keeps prices fair for small businesses. Every project is planned, reviewed and tested before launch, with security checks on database rules, exposed keys, HTTPS, backups and account protection.
          </p>
        </div>
      </section>

      {/* 4 Steps Timeline */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-12">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-white/[0.08] hover:border-white/[0.16] transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
              data-reveal
            >
              <div className="md:col-span-3 flex md:flex-col items-center md:items-start gap-4">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#A78BFA] px-3.5 py-1.5 rounded-xl bg-[#7C3AED]/15 border border-[#7C3AED]/30">
                  {step.number}
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-white/40">
                  Phase {step.number}
                </span>
              </div>

              <div className="md:col-span-9 space-y-3 text-left">
                <h2 className="text-2xl font-bold text-white">
                  {step.title}
                </h2>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
                  {step.subtitle}
                </div>
                <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed pt-2">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Checklist Highlight */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-[#0B0B14] border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#14141F] border border-[#7C3AED]/30 p-8 sm:p-12 space-y-8 text-left" data-reveal>
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-[#A78BFA] uppercase tracking-wider">
              Verification Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              The LevelUp Pre-Launch Security Checklist
            </h2>
            <p className="text-sm text-[#A1A1B5] leading-relaxed">
              Every website we build passes through these rigorous technical checks before pointing to production traffic:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#A1A1B5]" data-reveal-group>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3" data-reveal>
              <span className="text-[#7C3AED] font-bold text-base">✓</span>
              <div>
                <strong className="text-white block">Strict Database Scoping</strong>
                Verification that anonymous users cannot read or write to private tables.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3" data-reveal>
              <span className="text-[#7C3AED] font-bold text-base">✓</span>
              <div>
                <strong className="text-white block">Secret Key Insulation</strong>
                Ensuring private API credentials and secret keys are never included in front-end bundles.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3" data-reveal>
              <span className="text-[#7C3AED] font-bold text-base">✓</span>
              <div>
                <strong className="text-white block">Mandatory 2FA Enrollment</strong>
                Hands-on configuration of two-factor authentication on domain and hosting accounts.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3" data-reveal>
              <span className="text-[#7C3AED] font-bold text-base">✓</span>
              <div>
                <strong className="text-white block">Spam & Bot Mitigation</strong>
                Zero-captcha honeypot fields on forms to block automated spam without frustrating visitors.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-8 bg-[#14141F] border-t border-white/[0.08]">
        <div className="max-w-3xl mx-auto text-center space-y-6" data-reveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Experience the process firsthand
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1B5]">
            Start with Phase 01: request a free interactive mobile preview of your business website.
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
