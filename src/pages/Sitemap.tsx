import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Sitemap() {
  const sitemapGroups = [
    {
      category: 'Services',
      description: 'Web development, e-commerce, and cybersecurity services',
      links: [
        { title: 'Services Overview', href: '/services', desc: 'Summary of our web design and maintenance services' },
        { title: 'Barbershop Websites with Online Booking', href: '/websites-for/barbershops', desc: 'Mobile-first websites with 24/7 chair booking and Google Maps' },
        { title: 'Salon & Beauty Websites with Booking', href: '/websites-for/salons', desc: 'Stylist portfolios, service menus, and calendar booking' },
        { title: 'Local Business Websites with Booking', href: '/services/local-business-websites', desc: 'Fast websites with 24/7 online booking and Google Maps' },
        { title: 'Website for Creators & Influencers', href: '/services/creator-websites', desc: 'Custom link-in-bio hub and media kit page for sponsorships' },
        { title: 'Portfolio Website Design', href: '/services/portfolio-websites', desc: 'Fast, clean portfolios for students, designers, and pros' },
        { title: 'Small Online Store Setup', href: '/services/online-stores', desc: 'Simple storefronts for merch and digital downloads' },
        { title: 'Website Security Check', href: '/services/security-check', desc: 'Plain-English security reviews and vulnerability remediation' },
        { title: 'Website Care Plans', href: '/services/care-plans', desc: 'Hosting, offsite backups, updates, and on-demand edits' },
      ],
    },
    {
      category: 'Company & Process',
      description: 'Our philosophy, pricing structure, and workflow',
      links: [
        { title: 'Projects & Work', href: '/projects', desc: 'Showcase of selected client websites and design work' },
        { title: 'Final Stop Barber Shop Case Study', href: '/projects/final-stop', desc: 'Deep-dive on booking system and performance results' },
        { title: 'Pricing & Packages', href: '/pricing', desc: 'Transparent upfront pricing and monthly care plans' },
        { title: 'How We Build (Process)', href: '/process', desc: '4-step workflow from discovery preview to launch' },
        { title: 'About LevelUp', href: '/about', desc: 'Our studio background, mission, and craftsmanship' },
        { title: 'Contact', href: '/contact', desc: 'Get in touch for questions, audits, or collaborations' },
      ],
    },
    {
      category: 'Local Presence',
      description: 'Focused service areas and regional spotlight',
      links: [
        { title: 'Web Design in San Diego', href: '/web-design-san-diego', desc: 'Dedicated web services for San Diego businesses and creators' },
      ],
    },
    {
      category: 'Legal & Policies',
      description: 'Privacy protections and terms of service',
      links: [
        { title: 'Privacy Policy', href: '/privacy', desc: 'How we collect, protect, and handle client information' },
        { title: 'Terms of Service', href: '/terms', desc: 'Our service agreements, rights, and responsibilities' },
        { title: 'Security Practices', href: '/security', desc: 'Technical security standards, encryption, and protection' },
        { title: 'XML Sitemap', href: '/sitemap.xml', desc: 'Machine-readable search engine index' },
      ],
    },
  ];

  return (
    <div>
      <SEO
        title="Sitemap | LevelUp Ecosystem"
        description="Explore all pages, services, and resources on LevelUp Ecosystem: web design, online booking, care plans, and security audits."
        canonical="/sitemap"
        breadcrumbs={[
          { name: 'Sitemap', url: '/sitemap' }
        ]}
      />

      <Breadcrumbs
        items={[
          { name: 'Sitemap', url: '/sitemap' }
        ]}
      />

      {/* Header */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-4 text-left" data-reveal>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Site Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            LevelUp Ecosystem Sitemap
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] leading-relaxed">
            A complete human-readable directory of every section, keyword service page, and resource across our website.
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-5xl mx-auto space-y-12">
          {sitemapGroups.map((group, groupIdx) => (
            <div
              key={groupIdx}
              className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-6"
              data-reveal
            >
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">
                  {group.category}
                </h2>
                <p className="text-sm text-[#A1A1B5]">
                  {group.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {group.links.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.href}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#7C3AED]/50 hover:bg-white/[0.06] transition-all group block text-left"
                  >
                    <div className="text-sm font-semibold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                      <span>{link.title}</span>
                      <span className="text-white/30 group-hover:text-[#A78BFA] transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                    <p className="text-xs text-[#A1A1B5] mt-1 leading-normal">
                      {link.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
