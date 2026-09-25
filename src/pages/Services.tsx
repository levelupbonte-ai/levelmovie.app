import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Services() {
  const serviceIcons: Record<string, string> = {
    'local-business': '/assets/img/icons/local-business.svg',
    creators: '/assets/img/icons/creator-sites.svg',
    portfolios: '/assets/img/icons/portfolios.svg',
    ecommerce: '/assets/img/icons/online-stores.svg',
    'security-check': '/assets/img/icons/security-check.svg',
    'care-plans': '/assets/img/icons/care-plans.svg',
  };

  const serviceCategories = [
    {
      id: 'local-business',
      number: '01',
      title: 'Local Business Sites',
      subtitle: 'Barbers, salons, med spas, gyms, restaurants, local pros',
      pageUrl: '/services/local-business-websites',
      pageAnchor: 'Explore local business websites with booking →',
      description: 'Lightning-fast mobile websites designed to convert local searchers into paying clients. We set up 24/7 direct online appointment booking, digital service menus with clear pricing, and Google Maps integration so customers can find and visit you without friction.',
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
      pageUrl: '/services/creator-websites',
      pageAnchor: 'Explore creator websites with media kit →',
      description: 'Stop relying solely on rented social platforms or clumsy multi-link trees. We create a centralized, custom-branded hub that organizes your content, showcases your follower analytics for brand sponsors, and captures fan emails into a list you own.',
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
      pageUrl: '/services/portfolio-websites',
      pageAnchor: 'Explore portfolio website design →',
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
      pageUrl: '/services/online-stores',
      pageAnchor: 'Explore small online store setup →',
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
      pageUrl: '/preview',
      pageAnchor: 'Request a custom landing page preview →',
      description: 'Single-page websites engineered for one single purpose: conversion. Whether you are validating a new business concept, promoting a workshop, or driving ad traffic, we craft a focused visual journey that turns visitors into leads.',
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
      pageUrl: '/preview',
      pageAnchor: 'Request a community website preview →',
      description: 'Keep your members informed, welcome newcomers, and accept donations online. We build dependable websites with community event calendars, donation integrations, and resources that are simple to navigate.',
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
      subtitle: 'Milestones, celebrations, RSVP coordination',
      pageUrl: '/preview',
      pageAnchor: 'Request an event website preview →',
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
      pageUrl: '/services/security-check',
      pageAnchor: 'Explore website security check service →',
      description: 'A practical cybersecurity service for business owners. We audit your domain registrar, DNS records, website hosting, and staff logins to eliminate vulnerabilities, implement robust two-factor authentication, and educate you on current phishing tactics.',
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
      title: 'Maintenance & Care Plans',
      subtitle: 'High-speed hosting, monthly updates, backups, local SEO',
      pageUrl: '/services/care-plans',
      pageAnchor: 'Explore monthly website care plans →',
      description: 'A hands-off ongoing service for clients who want their site running smoothly without lifting a finger. Includes ultra-fast cloud hosting, automated offsite backups, routine security audits, and on-demand content edits.',
      includes: [
        'High-speed global cloud hosting included',
        'Daily offsite backups with rapid restoration guarantee',
        'Monthly security patches & framework updates',
        'Up to 2 hours of on-demand content updates per month (photos, prices)',
        'Quarterly local SEO health check',
        'Direct email & phone support'
      ]
    }
  ];

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'LevelUp Ecosystem Website Design Services',
    itemListElement: serviceCategories.map((cat, idx) => ({
      '@type': 'Service',
      position: idx + 1,
      name: cat.title,
      description: cat.description,
      provider: {
        '@type': 'Organization',
        name: 'LevelUp Ecosystem',
        url: 'https://levelup-ecosystem.com',
      },
      url: `https://levelup-ecosystem.com${cat.pageUrl}`,
    })),
  };

  return (
    <div>
      <SEO
        title="Website Design Services | LevelUp Ecosystem"
        description="Websites for local businesses, creators, portfolios, stores and events, plus security checks and monthly care plans."
        canonical="/services"
        breadcrumbs={[
          { name: 'Services', url: '/services' }
        ]}
        jsonLd={servicesSchema}
      />

      <Breadcrumbs
        items={[
          { name: 'Services', url: '/services' }
        ]}
      />

      {/* Header Banner */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4" data-reveal>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            What We Do
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Website Design Services & Specialties
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
              data-reveal
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#A78BFA] px-2.5 py-1 rounded bg-[#7C3AED]/10 border border-[#7C3AED]/20">
                      {service.number}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#A1A1B5]">
                      {service.subtitle}
                    </span>
                  </div>
                  {serviceIcons[service.id] && (
                    <div className="w-10 h-10 rounded-xl bg-[#1A1A2E]/80 border border-white/[0.08] p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src={serviceIcons[service.id]}
                        alt=""
                        width="32"
                        height="32"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {service.title}
                </h2>

                <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <Link
                    to={service.pageUrl}
                    className="inline-flex items-center text-sm font-bold text-[#A78BFA] hover:text-white transition-colors"
                  >
                    {service.pageAnchor}
                  </Link>
                  <Link
                    to="/preview"
                    className="inline-flex items-center text-xs font-semibold text-[#A1A1B5] hover:text-white transition-colors"
                  >
                    Request a free preview →
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

      {/* Local Spotlight Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-[#0B0B14] border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#14141F] border border-white/[0.08] p-8 sm:p-12 text-left space-y-4" data-reveal>
          <div className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Local Business Focus
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Looking for Local Web Design in San Diego?
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
            We work directly with local businesses across San Diego County—including barbershops, salons, fitness studios, and local services. We handle Google Maps optimization, local structured schema, and automated booking.
          </p>
          <div className="pt-2">
            <Link
              to="/web-design-san-diego"
              className="inline-flex items-center text-sm font-bold text-[#A78BFA] hover:text-white transition-colors"
            >
              Learn about our San Diego web design services →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 px-4 sm:px-8 bg-[#14141F] border-t border-white/[0.08]">
        <div className="max-w-3xl mx-auto text-center space-y-6" data-reveal>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Have a custom requirement or need an audit?
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1B5]">
            We build tailored solutions for businesses with unique booking systems, inventory rules, or specialized security needs.
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
