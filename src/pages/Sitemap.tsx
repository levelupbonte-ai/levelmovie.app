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
        { title: 'Richelieu Bonte (Founder)', href: '/about/richelieu-bonte', desc: 'Background, focus areas, and verified profiles of the studio founder' },
        { title: 'Contact', href: '/contact', desc: 'Get in touch for questions, audits, or collaborations' },
      ],
    },
    {
      category: 'Tools & Studio',
      description: 'Interactive previews, AI generators, and dedicated web studio platform',
      links: [
        { title: 'LevelStudio (Instant AI Generation)', href: '/preview/instant', desc: 'Create a website prototype in seconds before human handoff' },
        { title: 'Free Website Preview Hub', href: '/preview', desc: 'Choose between instant AI draft or custom developer-crafted mockup' },
        { title: 'Custom Preview Request', href: '/preview/custom', desc: 'Handcrafted website mockup delivered within 24-48 business hours' },
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
    <div className="bg-[#0B0B14] min-h-screen text-white">
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

      {/* Header épuré intégré au site */}
      <section className="pt-12 sm:pt-16 pb-10 px-4 sm:px-8 border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto space-y-3 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Site Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            LevelUp Ecosystem Sitemap
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1B5] max-w-2xl leading-relaxed">
            Index complet de toutes les pages, services, outils et documentations de LevelUp Ecosystem.
          </p>
        </div>
      </section>

      {/* Directory sans cartes bulles - structure fluide collée dans la page */}
      <section className="py-12 sm:py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto divide-y divide-white/[0.08]">
          {sitemapGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="py-10 first:pt-0 last:pb-0 space-y-6">
              
              {/* Entête de catégorie */}
              <div className="space-y-1 text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                  <span>{group.category}</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#A1A1B5]">
                  {group.description}
                </p>
              </div>

              {/* Liste de liens fluide et aérée sans boîtes à bulles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 pt-2">
                {group.links.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.href}
                    className="group py-2.5 border-b border-white/[0.04] hover:border-[#7C3AED]/60 transition-all flex flex-col text-left"
                  >
                    <div className="flex items-center justify-between text-sm sm:text-base font-medium text-[#E4E4E7] group-hover:text-white transition-colors">
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.title}
                      </span>
                      <span className="text-[#A78BFA] opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                        →
                      </span>
                    </div>
                    <p className="text-xs text-[#71717A] group-hover:text-[#A1A1B5] transition-colors mt-0.5 leading-relaxed">
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
