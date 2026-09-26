import React from 'react';
import { Link } from './Link';

export interface MobileServiceItem {
  label: string;
  desc: string;
  path: string;
  iconName: string;
}

export const MOBILE_SERVICES: MobileServiceItem[] = [
  {
    label: 'Barbershop Websites',
    desc: '24/7 chair booking & barber rosters',
    path: '/websites-for/barbershops',
    iconName: 'barbershop',
  },
  {
    label: 'Salon & Beauty Websites',
    desc: 'Stylist portfolios & service menus',
    path: '/websites-for/salons',
    iconName: 'salon',
  },
  {
    label: 'Creator Websites',
    desc: 'Profile showcase & media kit',
    path: '/services/creator-websites',
    iconName: 'creators',
  },
  {
    label: 'Small Online Stores',
    desc: 'Fast checkout without platform lock-in',
    path: '/services/online-stores',
    iconName: 'store',
  },
  {
    label: 'Portfolio Websites',
    desc: 'High-res showcase with instant speed',
    path: '/services/portfolio-websites',
    iconName: 'portfolio',
  },
  {
    label: 'Website Security Check',
    desc: 'Plain-English technical audit',
    path: '/services/security-check',
    iconName: 'security',
  },
  {
    label: 'Local Business Sites',
    desc: 'Google Maps rankings & booking',
    path: '/services/local-business-websites',
    iconName: 'booking',
  },
  {
    label: 'Website Care Plans',
    desc: 'Cloud hosting, daily backups & updates',
    path: '/services/care-plans',
    iconName: 'care',
  },
  {
    label: 'Work & Examples Showcase',
    desc: 'Client deployments & live prototypes',
    path: '/projects',
    iconName: 'portfolio',
  },
];

interface MobileServicesMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  isServicesActive: boolean;
  currentPath: string;
}

export default function MobileServicesMenu({
  isOpen,
  onToggle,
  onClose,
  isServicesActive,
  currentPath,
}: MobileServicesMenuProps) {
  const isItemActive = (targetPath: string) => {
    const cleanCurrent = currentPath.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
    const cleanTarget = targetPath.replace(/\/$/, '') || '/';
    return cleanCurrent === cleanTarget;
  };

  return (
    <div className="border-b border-white/[0.08] pb-2 mb-1">
      {/* Header bar: Direct link to /services + chevron button to toggle dropdown */}
      <div className="flex items-center justify-between rounded-xl px-2 py-1 hover:bg-white/[0.04] transition-colors">
        <Link
          to="/services"
          onClick={onClose}
          className={`flex-1 py-1.5 px-1 text-sm font-semibold transition-colors flex items-center gap-2 ${
            isServicesActive ? 'text-white font-bold' : 'text-[#A1A1B5] hover:text-white'
          }`}
        >
          <span>Services</span>
        </Link>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label="Toggle all services list"
          className="p-2 text-[#A78BFA] hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-250 ease-out ${
              isOpen ? 'rotate-180 text-white' : ''
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Expandable sub-list of services */}
      {isOpen && (
        <div className="pl-2 pr-1 pt-2 pb-1 space-y-1.5 animate-in fade-in duration-200">
          <Link
            to="/services"
            onClick={onClose}
            className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-bold text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] transition-colors"
          >
            <span className="text-[#A78BFA]">Explore All Services &amp; Packages</span>
            <span className="text-xs text-[#A78BFA]">→</span>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
            {MOBILE_SERVICES.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-start gap-2.5 py-2 px-2.5 rounded-xl text-xs transition-colors ${
                    active
                      ? 'bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-white font-semibold'
                      : 'text-[#A1A1B5] hover:bg-white/[0.05] hover:text-white border border-transparent'
                  }`}
                >
                  <div className="w-5 h-5 shrink-0 rounded-md bg-[#14141F] border border-white/[0.08] p-0.5 flex items-center justify-center mt-0.5">
                    <img
                      src={`/assets/img/icons/${item.iconName}.png`}
                      alt=""
                      width="16"
                      height="16"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-white font-medium">{item.label}</div>
                    <div className="truncate text-[11px] text-[#71718A]">{item.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
