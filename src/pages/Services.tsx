import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';

export default function Services() {
  const serviceCategories = [
    {
      id: 'local-business',
      number: '01',
      title: 'Local Business Sites',
      subtitle: 'Barbers, salons, med spas, gyms, restaurants, local pros',
      description: 'Lightning-fast mobile websites designed to convert local searchers into paying clients. I set up 24/7 direct online appointment booking, digital service menus with clear pricing, and Google Maps integration so customers can find and visit you without friction.',
      includes: [
        'Mobile-first responsive design',
        '24/7 automated online booking integration',
        'Digital service menu & price list',
        'Google Business Profile & Maps optimization',
        'Direct click-to-call and direction buttons',
        'HTTPS security and anti-spam protection'
      ]
    },
    {
      id: 'creators',
      number: '02',
      title: 'Creator & Influencer Sites',
      subtitle: 'Link in bio, creator hubs, media kits, newsletters',
      description: 'Stop relying solely on rented social platforms or clumsy multi-link trees. I create a centralized, custom-branded hub that organizes your content, showcases your follower analytics for brand sponsors, and captures fan emails into a list you own.',
      includes: [
        'Custom link-in-bio hub with fast mobile load',
        'Downloadable media kit for brand deals',
        'Newsletter & email capture form setup',
        'Direct links to YouTube, TikTok, Spotify & storefronts',
        'Custom domain setup for brand authority',
        'Analytics tracking without invasive cookies'
      ]
    },
    {
      id: 'portfolios',
      number: '03',
      title: 'Portfolios',
      subtitle: 'Students, emerging pros, artists, photographers, musicians',
      description: 'A clean, high-impact portfolio that lets your work speak for itself. Designed specifically for job interviews, freelance inquiries, and gallery submissions with crisp media presentations and easy contact pathways.',
      includes: [
        'Curated case study & project galleries',
        'Downloadable PDF resume integration',
        'Optimized high-resolution image compression',
        'Direct inquiry form to prevent public email scraping',
        'Clean typography that looks great on laptops and phones',
        'Fast CDN delivery for instant image rendering'
      ]
    },
    {
      id: 'ecommerce',
      number: '04',
      title: 'Online Stores',
      subtitle: 'Mini boutiques, branded merch, digital products',
      description: 'Simple, frictionless e-commerce without the bloated monthly overhead of enterprise platforms. Sell physical items, artist merch, or downloadable digital goods with secure payment gateways and automatic confirmation receipts.',
      includes: [
        'Streamlined product catalog & checkout',
        'Credit card & Apple Pay / Google Pay setup via Stripe',
        'Automated digital file delivery for downloads',
        'Inventory tracking & order notification alerts',
        'Encrypted transactions & PCI compliance standards',
        'Zero bloated plugins or unnecessary monthly app subscriptions'
      ]
    },
    {
      id: 'landing-pages',
      number: '05',
      title: 'Landing Pages',
      subtitle: 'Product launches, upcoming events, seasonal promotions',
      description: 'Single-page websites engineered for one single purpose: conversion. Whether you are validating a new business concept, promoting a workshop, or driving paid ad traffic, I craft a focused visual journey that turns visitors into leads.',
      includes: [
        'Laser-focused conversion-oriented architecture',
        'Clear call-to-action hierarchy',
        'Lead capture form with instant notifications to your phone',
        'Sub-second mobile loading speeds to minimize bounce rates',
        'A/B test ready layout structure',
        'Built-in spam bot filter'
      ]
    },
    {
      id: 'community',
      number: '06',
      title: 'Community & Non-Profits',
      subtitle: 'Clubs, faith communities, student organizations, charities',
      description: 'Keep your members informed, welcome newcomers, and accept donations online. I build dependable websites with community event calendars, donation integrations, and resources that are simple to navigate.',
      includes: [
        'Upcoming event schedule & announcements',
        'Secure online donation & membership dues processing',
        'Volunteer signup forms',
        'Resource & document downloads',
        'Mobile accessibility for all age demographics',
        'Zero maintenance headaches'
      ]
    },
    {
      id: 'events',
      number: '07',
      title: 'Events & Gatherings',
      subtitle: 'Weddings, milestone birthdays, celebrations with RSVP',
      description: 'Interactive, memorable websites for personal or professional events. Replace paper chaos with live digital RSVP tracking, interactive venue directions, dietary preference forms, and photo gallery sharing.',
      includes: [
        'Live RSVP management with automated spreadsheet syncing',
        'Venue directions, parking info, and itinerary schedule',
        'Dietary preference and plus-one tracking',
        'Gift registry and cash fund links',
        'Post-event photo gallery link sharing',
        'Password protection option for private gatherings'
      ]
    },
    {
      id: 'security-check',
      number: '08',
      title: 'Security Check',
      subtitle: 'Security audit, 2FA implementation, anti-phishing hygiene',
      description: 'A practical cybersecurity service for business owners. I audit your domain registrar, DNS records, website hosting, and staff logins to eliminate vulnerabilities, implement robust two-factor authentication, and educate you on current phishing tactics.',
      includes: [
        'Comprehensive audit of domain registrar & DNS configuration',
        'Enforcement of mandatory 2FA on hosting & business email accounts',
        'Review of database permissions and exposed API keys',
        'Verification of HTTPS certificates and security headers',
        'Honeypot anti-spam defense on contact and booking endpoints',
        'Personal 1-on-1 walkthrough of anti-phishing defense best practices'
      ]
    },
    {
      id: 'maintenance',
      number: '09',
      title: 'Maintenance & Care',
      subtitle: 'High-speed hosting, monthly updates, backups, local SEO',
      description: 'A hands-off ongoing service for clients who want their site running smoothly without lifting a finger. Includes ultra-fast cloud hosting, automated offsite backups, routine security audits, and on-demand content edits.',
      includes: [
        'High-speed global cloud hosting included',
        'Daily offsite backups with rapid restoration guarantee',
        'Monthly security patches & framework updates',
        'Up to 2 hours of on-demand content updates per month (photos, prices)',
        'Quarterly local SEO health check',
        'Direct email & phone support with me'
      ]
    }
  ];

  return (
    <div>
      <SEO
        title="Web Design & Security Services"
        description="Comprehensive web design and security services for San Diego businesses, creators, and professionals. 24/7 online booking, portfolios, and practical security audits."
      />

      {/* Header Banner */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            What I Do
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Services & Specialties
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            Every website is custom built, mobile-optimized, and configured with genuine security best practices from day one.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-6xl mx-auto space-y-12">
          {serviceCategories.map((service) => (
            <div
              key={service.id}
              id={service.id}
              className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-white/[0.08] hover:border-white/[0.16] transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24"
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#A78BFA] px-2.5 py-1 rounded bg-[#7C3AED]/10 border border-[#7C3AED]/20">
                    {service.number}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#A1A1B5]">
                    {service.subtitle}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {service.title}
                </h2>

                <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-2">
                  <Link
                    to="/contact"
                    className="inline-flex items-center text-sm font-bold text-[#A78BFA] hover:text-white transition-colors"
                  >
                    Request a free preview for {service.title} →
                  </Link>
                </div>
              </div>

              {/* What's included checklist */}
              <div className="lg:col-span-5 bg-[#0B0B14] p-6 rounded-2xl border border-white/[0.06] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  What's included:
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#A1A1B5]">
                  {service.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#7C3AED] font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 px-4 sm:px-8 bg-[#14141F] border-t border-white/[0.08]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Have a custom requirement or need an audit?
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1B5]">
            I build tailored solutions for businesses with unique booking systems, inventory rules, or specialized security needs.
          </p>
          <div>
            <Link
              to="/contact"
              className="inline-block px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all shadow-md shadow-[#7C3AED]/25"
            >
              Get in touch for a free preview →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
