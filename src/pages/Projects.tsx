import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';

export default function Projects() {
  return (
    <div>
      <SEO
        title="Client Work & Projects"
        description="Featured web design and development projects by LevelUp Ecosystem in San Diego, including Final Stop Barber Shop & Salon."
      />

      {/* Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Portfolio & Proof
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Client Work & Case Studies
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            Real websites serving real San Diego businesses every day. No mockup templates or fake portfolio items.
          </p>
        </div>
      </section>

      {/* Main Showcase */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Project 1 : Final Stop */}
          <div className="bg-[#14141F] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl hover:border-[#7C3AED]/40 transition-all">
            
            <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden relative border-b border-white/[0.08]">
              <img
                src="/finalstop-preview.jpg"
                alt="Final Stop Barber Shop & Salon live website"
                className="w-full h-full object-cover object-top hover:scale-[1.01] transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white border border-white/[0.12]">
                Active Client Site • San Diego, CA
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
                    Read case study →
                  </Link>

                  <a
                    href="https://finalstop.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs sm:text-sm font-medium border border-white/[0.1] transition-all"
                  >
                    Visit site ↗
                  </a>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
                A custom, high-speed website built for a premier unisex barbershop and hair braiding lounge. Features integrated 24/7 online appointment booking, a responsive service menu with transparent pricing, and local Google Maps optimization to capture walk-in and repeat clientele.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/[0.06]">
                <div className="bg-[#0B0B14] p-4 rounded-xl border border-white/[0.06]">
                  <div className="text-xs text-[#A78BFA] font-medium">Service</div>
                  <div className="text-sm font-bold text-white mt-1">Full Build + Booking</div>
                </div>
                <div className="bg-[#0B0B14] p-4 rounded-xl border border-white/[0.06]">
                  <div className="text-xs text-[#A78BFA] font-medium">Location</div>
                  <div className="text-sm font-bold text-white mt-1">San Diego, CA</div>
                </div>
                <div className="bg-[#0B0B14] p-4 rounded-xl border border-white/[0.06]">
                  <div className="text-xs text-[#A78BFA] font-medium">Load Speed</div>
                  <div className="text-sm font-bold text-white mt-1">&lt; 1.8 seconds</div>
                </div>
                <div className="bg-[#0B0B14] p-4 rounded-xl border border-white/[0.06]">
                  <div className="text-xs text-[#A78BFA] font-medium">Status</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">Active & Maintained</div>
                </div>
              </div>
            </div>

          </div>

          {/* Honest Solo Studio Note */}
          <div className="p-8 rounded-3xl bg-[#14141F] border border-white/[0.08] space-y-4 text-left">
            <h3 className="text-lg font-bold text-white">
              An honest note on portfolio size
            </h3>
            <p className="text-sm text-[#A1A1B5] leading-relaxed">
              I am an independent web developer and cybersecurity student in San Diego. Rather than inventing fake clients, displaying template mockups, or claiming corporate partnerships I do not have, I present genuine client work that is live on the internet.
            </p>
            <p className="text-sm text-[#A1A1B5] leading-relaxed">
              Interested in seeing how your business would look? I create custom, interactive mobile previews in 24 to 48 hours before you spend anything.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-block px-6 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#7C3AED]/25"
              >
                Request a preview for your business →
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
