import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <div>
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for LevelUp Ecosystem. Learn how your data is handled and protected."
      />

      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
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
        <div className="max-w-3xl mx-auto bg-[#14141F] border border-white/[0.08] p-8 sm:p-12 rounded-3xl space-y-8 text-left text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
          
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">Introduction</h2>
            <p>
              LevelUp Ecosystem is an independent web design and security studio based in San Diego, CA. This Privacy Policy details how I collect, use, and protect your personal and business information when you visit this website or communicate regarding our web design and security services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <p>
              We only collect information that you explicitly and voluntarily submit through our contact form, email communications, or project consultation calls:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
              <li>Your full name and professional title</li>
              <li>Your business or organization name</li>
              <li>Your email address and phone number</li>
              <li>Project requirements, design preferences, and service menu details</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. How We Use Your Information</h2>
            <p>
              Your information is used strictly to fulfill your request:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300">
              <li>Building your free 24-48 hour mobile preview</li>
              <li>Communicating project scope, quotes, and delivery timelines</li>
              <li>Configuring your website domain, SSL, and booking system</li>
              <li>Providing ongoing support and maintenance if enrolled in the Care plan</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0B14] border border-[#7C3AED]/30 space-y-2">
            <h3 className="text-base font-bold text-white">3. AI Processing & Third-Party Protection</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              When you submit a request for an instant or custom website preview, the business information you provide (such as business name, services offered, and aesthetic preferences) may be processed by an AI provider or AI tooling solely to generate draft website copy, layouts, and preview assets.
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              I never share clients' private data, passwords, customer lists, or financial records with AI training datasets or advertising brokers. Every custom preview is reviewed, tested, and directed by me before delivery.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Data Security</h2>
            <p>
              All traffic to this site is encrypted with standard TLS/HTTPS. I maintain strict access control, multi-factor authentication (2FA) across all administrative tools, and never retain unencrypted credentials.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Your Rights</h2>
            <p>
              You have the right to request a copy of the data I have on file or request immediate deletion of your contact records at any time. Simply email <a href="mailto:contact@levelup-ecosystem.com" className="text-white hover:text-[#A78BFA] underline">contact@levelup-ecosystem.com</a>.
            </p>
          </div>

          <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-[#A1A1B5]">Questions or concerns?</span>
            <Link to="/contact" className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors">
              Contact LevelUp Ecosystem
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
