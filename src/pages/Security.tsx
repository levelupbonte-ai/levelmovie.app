import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Security() {
  const securityPractices = [
    {
      num: '01',
      title: 'HTTPS & Modern Transport Security',
      description:
        'All traffic is strictly encrypted in transit using modern TLS with HTTP Strict Transport Security (HSTS) and automatic redirection from HTTP to HTTPS.',
    },
    {
      num: '02',
      title: 'Strict HTTP Security Headers',
      description:
        'Every response includes Content-Security-Policy (CSP), X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy, and X-Frame-Options to mitigate cross-site scripting (XSS) and clickjacking.',
    },
    {
      num: '03',
      title: 'Deny-By-Default Database & Storage Rules',
      description:
        'Cloud Firestore and Storage rules deny all access by default. Operations require strict authentication, resource ownership verification, key allowlists, and volumetric bounds.',
    },
    {
      num: '04',
      title: 'Zero Secrets in the Browser',
      description:
        'Client-side bundles contain no private API keys, service credentials, or database secrets. Sensitive workflows and AI processing execute in isolated backend Cloud Functions.',
    },
    {
      num: '05',
      title: 'Backend Input Validation & Rate Limiting',
      description:
        'Public forms and preview pipelines enforce server-side schema validation, honeypot traps, sliding-window rate limits, and App Check verification to prevent abuse.',
    },
    {
      num: '06',
      title: 'Two-Factor Authentication (2FA) & IAM Hygiene',
      description:
        'Infrastructure accounts, domain management, GitHub source repositories, and deployment consoles require hardware or authenticator-based 2FA with least-privilege IAM roles.',
    },
    {
      num: '07',
      title: 'Cloud Audit Logging & Alerting',
      description:
        'Automated monitoring tracks permission denials, unusual traffic spikes, and runtime anomalies via structured audit logs without retaining raw client PII.',
    },
  ];

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-8">
      <SEO
        title="How I Keep Your Site Secure | LevelUp Ecosystem"
        description="Transparent security practices for LevelUp Ecosystem websites: HTTPS, CSP headers, deny-by-default database rules, zero secrets in the browser, and 2FA."
        canonical="https://levelup-ecosystem.com/security"
      />

      <div className="max-w-4xl mx-auto space-y-12">
        <Breadcrumbs
          items={[
            { name: 'Security Practices', url: '/security' },
          ]}
        />

        {/* Header Block */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex items-center justify-start sm:justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
            <span>Engineering Transparency</span>
            <span className="text-[#71717A]" aria-hidden="true">·</span>
            <span>Verified Practices</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How I keep your site secure
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] leading-relaxed max-w-2xl">
            Real-world security is about defense-in-depth, deliberate configuration, and minimizing exposure. Here are the exact engineering practices applied to the LevelUp Ecosystem site and client deployments.
          </p>
        </div>

        {/* Realism & Disclaimer Callout */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] text-xs sm:text-sm text-[#A1A1B5] leading-relaxed space-y-2">
          <div className="font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-[#A78BFA] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Honest Security Commitment</span>
          </div>
          <p>
            No system is "100% hack-proof" and we will never make marketing claims of absolute immunity. We do not claim third-party certifications or enterprise audit badges we do not hold. Instead, we implement verifiable, standard-compliant technical controls that eliminate the most common small-business vulnerabilities.
          </p>
        </div>

        {/* Core Practices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityPractices.map((practice, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.06] hover:border-white/[0.12] transition-colors space-y-3"
            >
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/15 text-[#A78BFA] font-mono text-xs font-bold flex items-center justify-center">
                {practice.num}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">{practice.title}</h3>
              <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed">
                {practice.description}
              </p>
            </div>
          ))}
        </div>

        {/* Vulnerability Disclosure & security.txt Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14141F] border border-[#7C3AED]/30 space-y-4">
          <h2 className="text-xl font-bold text-white">Vulnerability Disclosure & Contact</h2>
          <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed">
            If you discover a potential security issue or vulnerability across our website or services, we appreciate responsible disclosure. Please send full technical details to{' '}
            <a href="mailto:security@levelup-ecosystem.com" className="text-[#A78BFA] underline font-mono">
              security@levelup-ecosystem.com
            </a>.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
            <a
              href="/.well-known/security.txt"
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white transition-colors"
            >
              View /.well-known/security.txt ↗
            </a>
            <Link
              to="/terms"
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
