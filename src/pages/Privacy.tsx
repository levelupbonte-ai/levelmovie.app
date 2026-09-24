import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Privacy() {
  return (
    <div>
      <SEO
        title="Privacy Policy | LevelUp Ecosystem"
        description="Privacy Policy for LevelUp Ecosystem. Learn how your data is handled and protected with zero third-party tracking."
        canonical="/privacy"
        breadcrumbs={[
          { name: 'Privacy Policy', url: '/privacy' }
        ]}
      />

      <Breadcrumbs
        items={[
          { name: 'Privacy Policy', url: '/privacy' }
        ]}
      />

      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4" data-reveal>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Legal & Trust
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1B5]">
            Effective Date: January 1, 2026
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-3xl mx-auto bg-[#14141F] border border-white/[0.08] p-8 sm:p-12 rounded-3xl space-y-8 text-left text-sm sm:text-base text-[#A1A1B5] leading-relaxed" data-reveal>
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">Introduction</h2>
            <p>
              LevelUp Ecosystem is an independent web design and security studio based in San Diego, CA. This Privacy Policy details how we collect, use, and protect your personal and business information when you visit this website or communicate regarding our web design and security services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <p>
              We only collect information that you explicitly and voluntarily submit through our contact form, email communications, or project consultation calls:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Name and contact details (email address, phone number).</li>
              <li>Business details, website URL, and branding assets you share.</li>
              <li>Communication history related to design previews and service inquiries.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. How We Use Your Information</h2>
            <p>
              Your information is used strictly to fulfill your direct requests:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Generating your free interactive mobile website preview.</li>
              <li>Delivering requested security audit reports and proposals.</li>
              <li>Communicating regarding ongoing site builds, launches, and maintenance.</li>
            </ul>
            <p className="text-xs text-[#A78BFA] pt-1">
              We never sell, rent, or trade your contact information to third-party advertisers or data brokers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Third-Party AI Services & Confidentiality</h2>
            <p>
              While we utilize modern AI coding assistants to accelerate boilerplate development, we never input your proprietary client records, private financial numbers, or sensitive credentials into public training datasets. All client credentials and proprietary codebases remain strictly quarantined.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Data Security</h2>
            <p>
              As a studio focused on security, we adhere to fundamental industry defenses: all web traffic is encrypted via HTTPS (TLS), administrative accounts enforce two-factor authentication, and contact endpoints are guarded by honeypot verification.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Contact Us</h2>
            <p>
              If you have any questions regarding this policy or wish to have your submitted data purged from our correspondence archives, please contact:
            </p>
            <p className="font-semibold text-white">
              LevelUp Ecosystem<br />
              San Diego, CA<br />
              Email:{' '}
              <a href="mailto:contact@levelup-ecosystem.com" className="text-[#A78BFA] hover:underline">
                contact@levelup-ecosystem.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
