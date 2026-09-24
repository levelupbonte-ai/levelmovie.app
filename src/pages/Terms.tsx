import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Terms() {
  return (
    <div>
      <SEO
        title="Terms of Service | LevelUp Ecosystem"
        description="Terms of Service for LevelUp Ecosystem. Review service agreements, payment terms, and delivery guidelines."
        canonical="/terms"
        breadcrumbs={[
          { name: 'Terms of Service', url: '/terms' }
        ]}
      />

      <Breadcrumbs
        items={[
          { name: 'Terms of Service', url: '/terms' }
        ]}
      />

      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4" data-reveal>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Legal & Contracts
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1B5]">
            Effective Date: January 1, 2026
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-3xl mx-auto bg-[#14141F] border border-white/[0.08] p-8 sm:p-12 rounded-3xl space-y-8 text-left text-sm sm:text-base text-[#A1A1B5] leading-relaxed" data-reveal>
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Scope of Services</h2>
            <p>
              LevelUp Ecosystem provides custom web design, front-end development, booking integrations, and basic cybersecurity hardening services. Free previews are provided strictly for demonstration and proof-of-concept purposes with no contractual obligation to purchase.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Delivery Timelines</h2>
            <p>
              Interactive previews are typically delivered within 24 to 48 hours of initial consultation. Full website development typically takes 1 to 2 weeks, contingent upon the timely receipt of client assets (such as high-resolution photography, text descriptions, service menus, and third-party login credentials).
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Payments & Milestones</h2>
            <p>
              Project invoices for one-time builds are structured in two equal installments: 50% upon kickoff following preview approval, and the final 50% prior to domain deployment and DNS switchover. Ongoing monthly maintenance care plans are billed month-to-month and can be paused or cancelled at any time without early termination penalties.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Ownership & Intellectual Property</h2>
            <p>
              Upon receipt of final milestone payment, the client retains 100% intellectual property ownership of their domain name, brand assets, custom copy, and visual design. LevelUp Ecosystem does not enforce vendor lock-in or charge exit release fees.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Cybersecurity Disclaimer</h2>
            <p>
              While LevelUp Ecosystem applies rigorous industry security best practices (including multi-factor authentication, database security rules, HTTPS enforcement, and honeypot forms), no web service can claim to be 100% immune from zero-day exploits or credential compromise. Clients remain responsible for preserving strong passwords and safeguarding their administrative access.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Inquiries</h2>
            <p>
              For legal inquiries or service agreement clarifications, contact{' '}
              <a href="mailto:contact@levelup-ecosystem.com" className="text-[#A78BFA] hover:underline">
                contact@levelup-ecosystem.com
              </a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
