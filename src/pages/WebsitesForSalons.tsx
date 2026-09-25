import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function WebsitesForSalons() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Can clients choose specific stylists, estheticians, or colorists?',
      a: 'Yes. The booking flow lets clients select their preferred stylist, service tier (such as Master Colorist or Senior Stylist), and specific add-ons like Olaplex treatments, blowouts, or extensions with real-time chair calendar sync.'
    },
    {
      q: 'How are multi-service appointments and durations handled?',
      a: 'We configure your service catalog so appointment times accurately reflect combined services (for example, balayage + gloss + trim + blowout) so schedules stay accurate and your team never gets overbooked.'
    },
    {
      q: 'Can we showcase client before-and-after transformations and retail products?',
      a: 'Yes. We build responsive transformation galleries and highlight salon-exclusive haircare/skincare retail products, giving your salon an additional revenue channel alongside chair bookings.'
    },
    {
      q: 'Does the website work seamlessly with Instagram and Google Reviews?',
      a: 'Absolutely. We integrate your verified Google Reviews and an aesthetic Instagram grid preview, allowing prospective clients to see your team’s recent styling work and build instant trust.'
    }
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Salon & Beauty Websites with Seamless Booking',
    serviceType: 'Hair Salon, Nail Studio & Beauty Web Design',
    provider: {
      '@type': 'Organization',
      name: 'LevelUp Ecosystem',
      url: 'https://levelup-ecosystem.com'
    },
    description: 'Elegant, fast websites for salons and beauty studios with online booking, stylist portfolios, service menus, Google Maps integration, and client reviews.'
  };

  const whatsIncluded = [
    {
      title: 'Stylist & Colorist Rosters',
      desc: 'Dedicated profile cards for each salon professional showing their bio, styling specialties, certifications, and portfolio.'
    },
    {
      title: 'Real-Time Appointment Scheduling',
      desc: 'Seamless booking integration with platforms like Square Appointments, Vagaro, Boulevard, Fresha, or Mindbody.'
    },
    {
      title: 'Comprehensive Service & Pricing Menu',
      desc: 'Well-organized service tiers for cuts, color, highlights, balayage, treatments, nails, and waxing with clear base pricing.'
    },
    {
      title: 'Before-and-After Transformation Gallery',
      desc: 'High-resolution mobile image showcases that highlight color correction, styling, and texture work without slowing down page load.'
    },
    {
      title: 'Google Reviews & Map Directions',
      desc: 'Live 5-star customer testimonial badges, parking details, salon hours, and integrated Google Maps for local foot traffic.'
    },
    {
      title: 'Enterprise-Grade Security & Speed',
      desc: 'Zero bloated plugins, 100% clean code, SSL certificate encryption, and sub-second load times that keep mobile visitors engaged.'
    }
  ];

  return (
    <div>
      <SEO
        title="Salon & Beauty Websites | LevelUp Ecosystem"
        description="Elegant, fast websites for salons and beauty studios with online booking, stylist portfolios, service menus, Google Maps integration, and client reviews."
        canonical="/websites-for/salons"
        breadcrumbs={[
          { name: 'Services', url: '/services' },
          { name: 'Salon Websites', url: '/websites-for/salons' }
        ]}
        jsonLd={serviceSchema}
      />

      <Breadcrumbs
        items={[
          { name: 'Services', url: '/services' },
          { name: 'Salon Websites', url: '/websites-for/salons' }
        ]}
      />

      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-6 text-left" data-reveal>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
              Websites for Salons
            </span>
            <span className="text-white/20">•</span>
            <span className="text-xs text-[#A1A1B5]">Hair, Nail & Beauty Studios</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Salon & Beauty Websites with Seamless Booking
          </h1>

          <p className="text-base sm:text-xl text-[#A1A1B5] leading-relaxed max-w-3xl">
            Give your hair salon, nail studio, or lash lounge a high-end digital presence that matches the luxury of your craft. Convert Instagram admirers into loyal repeat appointments with automated online scheduling and stylist portfolios.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/preview"
              className="px-7 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95"
            >
              Get a free preview
            </Link>
            <Link
              to="/pricing"
              className="text-xs sm:text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors"
            >
              View transparent pricing packages →
            </Link>
          </div>
        </div>
      </section>

      {/* Main Copy (300+ words) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-reveal-group>
            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                01
              </div>
              <h3 className="text-xl font-bold text-white">Effortless 24/7 Appointment Scheduling</h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Your stylists shouldn’t have to pause foil applications or blowouts to answer front-desk phones or reply to DMs. Modern beauty clients expect to book their balayage, cuts, and touch-ups on their phones late in the evening. Our integrated appointment flows let clients select their exact stylist, service, and time slot smoothly.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                02
              </div>
              <h3 className="text-xl font-bold text-white">Showcase Stylist Talent & Portfolios</h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Clients choose salons based on the personal artistry of individual stylists. We build beautiful profile cards highlighting each team member’s expertise, bio, Instagram links, and specialty services, allowing clients to discover the exact professional who specializes in their hair type and desired aesthetic.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                03
              </div>
              <h3 className="text-xl font-bold text-white">Clear Menus & Transparent Pricing</h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                Avoid booking confusion and mismatched expectations with an intuitive digital service menu. We structure your offerings into clean categories with starting rates, estimated duration, and upgrade options so first-time visitors feel confident booking high-value multi-hour appointments.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-4" data-reveal>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#A78BFA] font-bold text-lg">
                04
              </div>
              <h3 className="text-xl font-bold text-white">Local Neighborhood SEO & Map Visibility</h3>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                When new residents move into your neighborhood and search for "best hair salon" or "nail studio near me", your salon will stand out with optimized local business Schema markup, operating hours, client reviews, and direct directions that direct high-ticket clientele straight to your studio door.
              </p>
            </div>
          </div>

          {/* What's Included */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-8" data-reveal>
            <div>
              <h2 className="text-2xl font-bold text-white">What&apos;s Included in Every Salon Website</h2>
              <p className="text-sm text-[#A1A1B5] mt-1">
                Complete design, technical setup, and booking integration crafted specifically for beauty businesses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whatsIncluded.map((item, idx) => (
                <div key={idx} className="space-y-1.5 border-l-2 border-[#7C3AED] pl-4">
                  <h4 className="text-base font-semibold text-white">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-6" data-reveal>
            <h2 className="text-2xl font-bold text-white text-left">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/[0.08] bg-[#14141F] overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                    >
                      <span className="text-sm sm:text-base">{faq.q}</span>
                      <span className="text-[#A78BFA] text-lg font-bold shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="p-5 pt-0 text-sm text-[#A1A1B5] leading-relaxed border-t border-white/[0.04]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#14141F] border border-[#7C3AED]/30 text-center space-y-6" data-reveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Elevate Your Salon&apos;s Client Experience Today
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] max-w-xl mx-auto leading-relaxed">
              Request a free website preview crafted for your salon brand. See how seamless your booking flow can be before spending a dollar.
            </p>
            <div>
              <Link
                to="/preview"
                className="inline-block px-8 py-4 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] active:scale-95"
              >
                Get a free preview
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
