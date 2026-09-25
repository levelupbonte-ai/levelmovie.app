import React from 'react';
import { Link } from './Link';

interface AudienceCard {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  alt: string;
  benefit: string;
  link: string;
  linkText: string;
}

export default function WhoItsForSection() {
  const cards: AudienceCard[] = [
    {
      id: 'barbershops',
      title: 'Barbershops',
      subtitle: 'Chairs & Grooming Studios',
      iconName: 'barbershop',
      alt: '3D faceted barbershop scissor and comb icon',
      benefit: '24/7 chair appointment booking, individual barber rosters, and zero telephone interruptions while cutting.',
      link: '/websites-for/barbershops',
      linkText: 'Explore barbershop websites',
    },
    {
      id: 'salons',
      title: 'Salons & Spas',
      subtitle: 'Hair, Nails & Esthetics',
      iconName: 'salon',
      alt: '3D faceted salon hairdryer and mirror icon',
      benefit: 'Stylist portfolio showcases, clear service tier pricing, and automated multi-service client scheduling.',
      link: '/websites-for/salons',
      linkText: 'Explore salon websites',
    },
    {
      id: 'creators',
      title: 'Creators & Influencers',
      subtitle: 'Digital Media & Brands',
      iconName: 'creators',
      alt: '3D faceted creator camera with play button icon',
      benefit: 'Own your audience with a branded link-in-bio hub, live collaboration media kit, and direct newsletter capture.',
      link: '/services/creator-websites',
      linkText: 'Explore creator websites',
    },
    {
      id: 'online-stores',
      title: 'Small Online Stores',
      subtitle: 'Merch & Digital Downloads',
      iconName: 'store',
      alt: '3D faceted luxury shopping bag store icon',
      benefit: 'Simple, fast-loading storefront for apparel, physical goods, and digital presets with zero monthly platform tax.',
      link: '/services/online-stores',
      linkText: 'Explore small store setup',
    },
    {
      id: 'portfolios',
      title: 'Portfolio Websites',
      subtitle: 'Designers, Photographers & Pros',
      iconName: 'portfolio',
      alt: '3D faceted portfolio gallery frame icon',
      benefit: 'High-resolution project showcases with sub-second page loads and zero monthly CMS maintenance headaches.',
      link: '/services/portfolio-websites',
      linkText: 'Explore portfolio design',
    },
    {
      id: 'local-businesses',
      title: 'Local Businesses',
      subtitle: 'Service Pros & Clinics',
      iconName: 'booking',
      alt: '3D faceted booking appointment calendar icon',
      benefit: 'Google Business Profile sync, neighborhood map rankings, and click-to-navigate GPS directions for foot traffic.',
      link: '/services/local-business-websites',
      linkText: 'Explore local business sites',
    },
  ];

  // Subtle cursor-follow highlight per card
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-8 bg-black border-b border-white/[0.08] relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-14 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 text-left" data-reveal>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Domain-Specific Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Who It&apos;s Built For
          </h2>
          <p className="text-base sm:text-lg text-[#A1A1B5] leading-relaxed">
            Every trade has different client friction points. We build purposeful features tailored to how your business actually operates.
          </p>
        </div>

        {/* Grid of 6 Cards - Full black, sharp square framing (rounded-none) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" data-reveal-group>
          {cards.map((card) => (
            <Link
              key={card.id}
              to={card.link}
              onMouseMove={handleMouseMove}
              className="group relative p-7 sm:p-8 rounded-none bg-black border border-white/15 hover:border-[#7C3AED]/70 transition-all duration-300 flex flex-col justify-between text-left cursor-pointer overflow-hidden who-card will-change-transform shadow-2xl shadow-black/80"
              data-reveal
            >
              {/* Subtle cursor follow radial highlight on hover */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.08), transparent 80%)',
                }}
              />

              <div className="space-y-6 relative z-10">
                {/* 3D Icon: Clean, borderless, floating directly on pure black background */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center select-none">
                  <picture className="w-full h-full flex items-center justify-center float-gentle who-card-icon transition-transform duration-300 will-change-transform">
                    <source srcSet={`/assets/img/icons/${card.iconName}.avif`} type="image/avif" />
                    <source srcSet={`/assets/img/icons/${card.iconName}.webp`} type="image/webp" />
                    <img
                      src={`/assets/img/icons/${card.iconName}.png`}
                      alt={card.alt}
                      width="96"
                      height="96"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
                    />
                  </picture>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
                    {card.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#DDD6FE] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#A1A1B5] leading-relaxed pt-1">
                    {card.benefit}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between text-xs sm:text-sm font-semibold text-[#A78BFA] group-hover:text-white transition-colors relative z-10">
                <span>{card.linkText}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
