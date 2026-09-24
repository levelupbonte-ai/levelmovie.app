import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';

export default function Terms() {
  return (
    <div>
      <SEO
        title="Terms of Service"
        description="Terms of Service for LevelUp Ecosystem. Review service agreements, payment terms, and delivery guidelines."
      />

      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
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
        <div className="max-w-3xl mx-auto bg-[#14141F] border border-white/[0.08] p-8 sm:p-12 rounded-3xl space-y-8 text-left text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
          
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
            <h2 className="text-xl font-bold text-white">3. Payment Terms & Milestone Billing</h2>
            <p>
              For project-based pricing (Starter at $500, Secure at $900):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
              <li>A 50% non-refundable deposit is due upon approval of the project scope and commencement of development.</li>
              <li>The remaining 50% balance is due upon project completion, prior to live domain deployment and credential handover.</li>
              <li>Care and maintenance subscriptions ($75/month) are billed monthly on a recurring schedule and can be cancelled with 30 days written notice.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0B14] border border-[#7C3AED]/30 space-y-2">
            <h3 className="text-base font-bold text-white">4. Security Check & Auditing Disclosures</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              While our Security Check services implement recognized industry best practices (enforcing 2FA, SSL encryption, honeypot bot prevention, DNS records, and scoped database access), <strong>no website or internet-connected system is 100% hack-proof or invulnerable</strong>. LevelUp Ecosystem does not warrant absolute immunity against zero-day exploits, hardware vulnerabilities, or compromised third-party vendor platforms.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Client Ownership & Intellectual Property</h2>
            <p>
              Upon settlement of all outstanding invoices, the client retains full and sole ownership of all custom website source code, published design layouts, registered domains, and branding materials produced specifically for the project.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.
            </p>
          </div>

          <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-[#A1A1B5]">Need clarification on terms?</span>
            <Link to="/contact" className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors">
              Contact LevelUp Ecosystem →
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
