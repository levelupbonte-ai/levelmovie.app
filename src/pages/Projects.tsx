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
          <div className="bg-[#14141F] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl hover:border-[#7C3AED]/40 transition-all" data-reveal>
            
            <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden relative border-b border-white/[0.08]">
              <img
                src="/finalstop-preview.jpg"
                alt="Final Stop Barber Shop & Salon live website"
                loading="lazy"
                width="800"
                height="343"
                className="w-full h-full object-cover object-top hover:scale-[1.01] transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white border border-white/[0.12]">
                Active Client Site • Live in Production
              </div>
            </div>

            <div className="p-8 sm:p-10 space-y-6">
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
