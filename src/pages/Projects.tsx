import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Projects() {
  return (
    <div>
      <SEO
        title="Client Work & Case Studies | LevelUp Ecosystem"
        description="Explore real websites built by LevelUp Ecosystem, including the Final Stop Barber Shop & Salon case study."
        canonical="/projects"
        breadcrumbs={[
          { name: 'Projects', url: '/projects' }
        ]}
      />

      <Breadcrumbs
        items={[
          { name: 'Projects', url: '/projects' }
        ]}
      />

      {/* Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4" data-reveal>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Portfolio & Proof
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Client Work & Case Studies
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            Real websites serving businesses and creators every day. Verified mobile speed, clean booking flows, and robust security.
          </p>
        </div>
      </section>

      {/* Main Showcase */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Project 1 : Final Stop */}
          <div className="bg-[#14141F] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl hover:border-[#7C3AED]/40 transition-all p-6 sm:p-8 space-y-8" data-reveal>
            
            {/* Device Frames Showcase : Desktop + Phone */}
            <div className="relative rounded-2xl bg-[#0F0F1A] border border-white/[0.08] p-4 sm:p-8 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Desktop Device Frame (8 cols) */}
                <div className="lg:col-span-8 rounded-xl bg-[#14141F] border border-white/[0.12] shadow-2xl overflow-hidden">
                  {/* Browser chrome */}
                  <div className="flex items-center justify-between px-3 py-2 bg-[#0B0B14] border-b border-white/[0.08]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                    </div>
                    <div className="text-[11px] font-mono text-[#A1A1B5] bg-[#14141F] px-3 py-0.5 rounded border border-white/[0.06]">
                      https://finalstop.org
                    </div>
                    <span className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Live
                    </span>
                  </div>

                  <picture>
                    <source type="image/avif" srcSet="/assets/img/finalstop-desktop.avif" />
                    <source type="image/webp" srcSet="/assets/img/finalstop-desktop.webp" />
                    <img
                      src="/assets/img/finalstop-desktop.jpg"
                      alt="Final Stop Barber Shop & Salon desktop website screenshot"
                      loading="lazy"
                      decoding="async"
                      width="1000"
                      height="625"
                      className="w-full h-auto object-cover block"
                    />
                  </picture>
                </div>

                {/* Mobile Device Frame (4 cols) */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="w-48 sm:w-56 rounded-[32px] bg-[#0B0B14] p-2.5 border-2 border-white/[0.14] shadow-2xl">
                    <div className="w-20 h-3 mx-auto bg-black rounded-full mb-2 flex items-center justify-end px-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]/70" />
                    </div>
                    <div className="rounded-[24px] overflow-hidden bg-black aspect-[9/18.5]">
                      <picture>
                        <source type="image/avif" srcSet="/assets/img/finalstop-mobile.avif" />
                        <source type="image/webp" srcSet="/assets/img/finalstop-mobile.webp" />
                        <img
                          src="/assets/img/finalstop-mobile.jpg"
                          alt="Final Stop Barber Shop mobile booking flow screenshot"
                          loading="lazy"
                          decoding="async"
                          width="380"
                          height="780"
                          className="w-full h-full object-cover object-top block"
                        />
                      </picture>
                    </div>
                    <div className="mt-2 text-center text-[10px] text-[#A1A1B5] font-mono">
                      Mobile Booking Flow
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#A1A1B5]">
                <span className="text-white font-medium">Real client screenshots inside responsive device frames</span>
                <span className="text-[#A78BFA] font-mono text-[11px]">Desktop &amp; Mobile Responsive</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">
                    Local Business • Barbershop & Braiding Lounge
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Final Stop Barber Shop & Salon
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/projects/final-stop"
                    className="px-5 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#7C3AED]/25"
                  >
                    Read case study
                  </Link>

                  <a
                    href="https://finalstop.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-medium border border-white/[0.1] transition-all"
                  >
                    Visit site ↗
                  </a>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
                Final Stop needed a high-performance web presence that matched their premier grooming experience. We replaced an unmaintained social link tree with a fast, mobile-first website that allows clients to book haircuts, braids, and salon treatments 24/7.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/[0.06] pt-6">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">&lt; 1.8s</div>
                  <div className="text-xs text-[#A78BFA]">Mobile load speed</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">40%+</div>
                  <div className="text-xs text-[#A78BFA]">Online bookings</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-[#A78BFA]">HTTPS encrypted</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">Zero</div>
                  <div className="text-xs text-[#A78BFA]">Spam leaks</div>
                </div>
              </div>
            </div>

          </div>

          {/* More Projects Callout */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#14141F] border border-white/[0.08] text-center space-y-4" data-reveal>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Want to see what your project could look like?
            </h2>
            <p className="text-sm text-[#A1A1B5] max-w-xl mx-auto">
              We create free, interactive mobile previews for serious businesses and creators before any contract or payment.
            </p>
            <div className="pt-2">
              <Link
                to="/preview"
                className="inline-block px-7 py-3 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#7C3AED]/25"
              >
                Request your free preview
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
