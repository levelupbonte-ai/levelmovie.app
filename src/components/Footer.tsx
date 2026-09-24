import React, { useState } from 'react';
import { Link } from './Link';

interface FooterColumn {
  id: string;
  title: string;
  links: { label: string; href: string }[];
}

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const columns: FooterColumn[] = [
    {
      id: 'services',
      title: 'Services',
      links: [
        { label: 'Local Business Websites', href: '/services/local-business-websites' },
        { label: 'Creator Websites', href: '/services/creator-websites' },
        { label: 'Portfolio Websites', href: '/services/portfolio-websites' },
        { label: 'Small Online Stores', href: '/services/online-stores' },
        { label: 'Website Security Check', href: '/services/security-check' },
        { label: 'Website Care Plans', href: '/services/care-plans' },
      ],
    },
    {
      id: 'company',
      title: 'Company',
      links: [
        { label: 'Projects & Work', href: '/projects' },
        { label: 'Pricing & Packages', href: '/pricing' },
        { label: 'How We Build', href: '/process' },
        { label: 'About Studio', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      id: 'local',
      title: 'Local',
      links: [
        { label: 'Web Design in San Diego', href: '/web-design-san-diego' },
        { label: 'Local Business Sites', href: '/services/local-business-websites' },
      ],
    },
    {
      id: 'legal',
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Sitemap', href: '/sitemap' },
      ],
    },
  ];

  return (
    <footer
      className="bg-[#0B0B14] pt-14 pb-12 px-4 sm:px-8 border-t border-white/[0.08] mt-auto text-left"
      style={{ paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Brand Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="space-y-3 max-w-lg">
            <Link to="/" className="inline-block">
              <img
                src="/levelup-logo.svg"
                alt="LevelUp Ecosystem"
                className="h-9 w-auto select-none"
                width="160"
                height="36"
              />
            </Link>
            <p className="text-sm text-[#A1A1B5] leading-relaxed">
              Fast, professional websites with online booking and built-in protection. Built in San Diego, CA • Serving clients nationwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 text-xs font-medium text-[#A1A1B5]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="LevelUp Instagram"
              >
                Instagram
              </a>
              <span className="text-white/20">•</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="LevelUp LinkedIn"
              >
                LinkedIn
              </a>
            </div>

            <Link
              to="/preview"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] active:scale-95 text-center shrink-0 w-full sm:w-auto"
            >
              Get a free preview
            </Link>
          </div>
        </div>

        {/* Desktop Columns (md and up: grid) */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 text-left">
          {columns.map((col) => (
            <div key={col.id} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm text-[#A1A1B5]">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="hover:text-white transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Accordion (under 768px: accordion with smooth height transition) */}
        <div className="md:hidden divide-y divide-white/[0.08] border-b border-white/[0.08]">
          {columns.map((col) => {
            const isOpen = openSection === col.id;
            return (
              <div key={col.id} className="py-1">
                <button
                  type="button"
                  onClick={() => toggleSection(col.id)}
                  aria-expanded={isOpen}
                  aria-controls={`footer-accordion-${col.id}`}
                  className="w-full py-3.5 flex items-center justify-between text-left text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-lg"
                >
                  <span className="uppercase tracking-wider text-xs font-bold text-white">
                    {col.title}
                  </span>
                  <svg
                    className={`w-4 h-4 text-[#A78BFA] transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div
                  id={`footer-accordion-${col.id}`}
                  className={`overflow-hidden transition-all duration-200 ease-out ${
                    isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <ul className="space-y-2 text-sm text-[#A1A1B5] pt-1 pl-1">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="hover:text-white transition-colors block py-1"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar: Copyright, Legal Links, Built in San Diego */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A1A1B5]">
          <div>
            © 2026 LevelUp Ecosystem. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors underline underline-offset-4">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="hover:text-white transition-colors underline underline-offset-4">
              Sitemap
            </Link>
          </div>

          <div className="text-slate-400 font-medium">
            Built in San Diego, CA
          </div>
        </div>
      </div>
    </footer>
  );
}
