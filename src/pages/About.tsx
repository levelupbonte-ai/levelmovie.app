import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';

export default function About() {
  return (
    <div>
      <SEO
        title="About LevelUp Ecosystem"
        description="Learn about LevelUp Ecosystem, an independent web design and security studio founded by a cybersecurity student in San Diego."
      />

      {/* Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Independent Studio
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About LevelUp Ecosystem
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            A solo design and security studio dedicated to helping San Diego small businesses, barbers, salons, and creators establish a fast, credible, and protected web presence.
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0B14]">
        <div className="max-w-3xl mx-auto space-y-12 text-left">
          
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why I started LevelUp Ecosystem
            </h2>
            <p className="text-base text-[#A1A1B5] leading-relaxed">
              I am a cybersecurity student living in San Diego. Over the past few years, I noticed that most local barbershops, hair salons, personal trainers, and independent creators were faced with two bad options:
            </p>
            <div className="space-y-4 pl-4 border-l-2 border-[#7C3AED]/40">
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>Option A:</strong> Spend thousands of dollars with a traditional marketing agency that builds on top of fragile, bloated templates that load slowly on phones and take weeks to make minor edits.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>Option B:</strong> Try to build a generic DIY site on their own that lacks proper booking integrations, leaks contact details to spam bots, and doesn't appear when people search nearby on Google Maps.
              </p>
            </div>
            <p className="text-base text-[#A1A1B5] leading-relaxed">
              LevelUp Ecosystem was created to be the third option: a direct, honest partner who builds modern, fast, mobile-friendly websites with 24/7 online booking, transparent pricing, and proactive security hygiene built in from the very beginning.
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/[0.08]">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How I work
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2">
                <h3 className="text-base font-bold text-white">
                  1. You deal with me directly
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed">
                  No account managers, no ticket queues, no sales reps. When you email or call, you talk directly with the person writing your code and configuring your security.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2">
                <h3 className="text-base font-bold text-white">
                  2. Honest technology
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed">
                  I embrace modern AI development tools to lower costs and speed up delivery for local businesses, while personally auditing every line of security configuration before launch.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2">
                <h3 className="text-base font-bold text-white">
                  3. You own everything
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed">
                  You own your domain, code, design, and customer lists. I don't believe in holding client assets hostage.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#14141F] border border-white/[0.08] space-y-2">
                <h3 className="text-base font-bold text-white">
                  4. Free preview before payment
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1B5] leading-relaxed">
                  I believe in proving value upfront. I build an interactive mobile preview within 24 to 48 hours so you can test it on your device before deciding to move forward.
                </p>
              </div>

            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#14141F] border border-[#7C3AED]/30 text-center space-y-4">
            <h3 className="text-xl font-bold text-white">
              Let's talk about your project
            </h3>
            <p className="text-sm text-[#A1A1B5]">
              Whether you need a new booking website, an overhaul of an existing page, or a practical Security Check, I'd love to help.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-block px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all shadow-md shadow-[#7C3AED]/25"
              >
                Get a free preview →
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
