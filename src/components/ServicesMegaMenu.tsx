import React from 'react';
import { Link } from './Link';

interface ServicesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function ServicesMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: ServicesMegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      role="menu"
      aria-orientation="vertical"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="pointer-events-auto hidden md:block absolute top-full left-0 right-0 z-50 w-full bg-[#0B0B14] border-t border-b border-white/[0.12] shadow-[0_30px_70px_rgba(0,0,0,0.98)] animate-in fade-in slide-in-from-top-1 duration-200 text-left"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8 space-y-8">
        {/* Top Header Row with Direct Link to /services */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.10]">
          <Link
            to="/services"
            onClick={onClose}
            className="group inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#A78BFA] transition-colors"
          >
            <span>Explore All Services &amp; Packages</span>
            <span className="text-xs text-[#A78BFA] transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to="/services"
            onClick={onClose}
            className="text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors"
          >
            Full Services Overview →
          </Link>
        </div>

        {/* 3 Clean Typographic Columns */}
        <div className="grid grid-cols-3 gap-10 xl:gap-14">
          {/* Column 1: CRÉATION & SHOWCASE */}
          <div className="space-y-5">
            <div className="text-xs font-bold uppercase tracking-widest text-[#DDD6FE] pb-2 border-b border-white/[0.12] flex items-center justify-between">
              <span>CRÉATION &amp; SHOWCASE</span>
              <span className="text-[10px] text-[#71717A] font-mono">01</span>
            </div>
            <div className="space-y-5">
              <Link
                to="/services/portfolio-websites"
                onClick={onClose}
                className="group block space-y-1"
              >
                <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                  <span>Portfolio Websites</span>
                  <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </h4>
                <p className="text-xs text-[#A1A1B5] leading-relaxed">
                  Clean, high-resolution visual showcases with sub-second load times on your domain.
                </p>
              </Link>

              <Link
                to="/services/creator-websites"
                onClick={onClose}
                className="group block space-y-1"
              >
                <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                  <span>Creator Websites</span>
                  <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </h4>
                <p className="text-xs text-[#A1A1B5] leading-relaxed">
                  Independent link-in-bio hub, brand collaboration media kit, and direct fan contact.
                </p>
              </Link>

              <Link
                to="/projects"
                onClick={onClose}
                className="group block space-y-1"
              >
                <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                  <span>Work &amp; Examples Showcase</span>
                  <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </h4>
                <p className="text-xs text-[#A1A1B5] leading-relaxed">
                  Explore live client deployments and concept prototypes built with speed and security.
                </p>
              </Link>
            </div>
          </div>

          {/* Column 2: BUSINESS & BOOKING */}
          <div className="space-y-5">
            <div className="text-xs font-bold uppercase tracking-widest text-[#DDD6FE] pb-2 border-b border-white/[0.12] flex items-center justify-between">
              <span>BUSINESS &amp; BOOKING</span>
              <span className="text-[10px] text-[#71717A] font-mono">02</span>
            </div>
            <div className="space-y-5">
              <Link
                to="/websites-for/barbershops"
                onClick={onClose}
                className="group block space-y-1"
              >
                <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                  <span>Barbershop Websites</span>
                  <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </h4>
                <p className="text-xs text-[#A1A1B5] leading-relaxed">
                  24/7 chair booking, barber profiles, and Google Calendar real-time sync.
                </p>
              </Link>

              <Link
                to="/websites-for/salons"
                onClick={onClose}
                className="group block space-y-1"
              >
                <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                  <span>Salon &amp; Beauty Websites</span>
                  <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </h4>
                <p className="text-xs text-[#A1A1B5] leading-relaxed">
                  Stylist portfolios, tiered service menus, and multi-service appointment scheduling.
                </p>
              </Link>

              <Link
                to="/services/online-stores"
                onClick={onClose}
                className="group block space-y-1"
              >
                <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                  <span>Small Online Stores</span>
                  <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </h4>
                <p className="text-xs text-[#A1A1B5] leading-relaxed">
                  Fast, lightweight checkout for products, merch, and digital downloads without platform lock-in.
                </p>
              </Link>
            </div>
          </div>

          {/* Column 3: CARE & PROTECTION */}
          <div className="space-y-5">
            <div className="text-xs font-bold uppercase tracking-widest text-[#DDD6FE] pb-2 border-b border-white/[0.12] flex items-center justify-between">
              <span>CARE &amp; PROTECTION</span>
              <span className="text-[10px] text-[#71717A] font-mono">03</span>
            </div>
            <div className="space-y-5">
              <Link
                to="/services/care-plans"
                onClick={onClose}
                className="group block space-y-1"
              >
                <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                  <span>Website Care Plans</span>
                  <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </h4>
                <p className="text-xs text-[#A1A1B5] leading-relaxed">
                  Cloud hosting, daily automated backups, uptime monitoring, and fast on-demand edits.
                </p>
              </Link>

              <Link
                to="/services/security-check"
                onClick={onClose}
                className="group block space-y-1"
              >
                <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                  <span>Website Security Check</span>
                  <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </h4>
                <p className="text-xs text-[#A1A1B5] leading-relaxed">
                  Plain-English audit of database rules, CSP headers, exposed keys, and account hygiene.
                </p>
              </Link>

              <Link
                to="/services/local-business-websites"
                onClick={onClose}
                className="group block space-y-1"
              >
                <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors flex items-center justify-between">
                  <span>Local Business Websites</span>
                  <span className="text-xs text-[#A78BFA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </h4>
                <p className="text-xs text-[#A1A1B5] leading-relaxed">
                  Google Business Profile sync, neighborhood rankings, and automated online booking.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
