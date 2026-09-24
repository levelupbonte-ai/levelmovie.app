import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0B0B14] pt-16 pb-12 px-4 sm:px-8 border-t border-white/[0.08] mt-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 text-left">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <a href="/" className="inline-block">
              <img
                src="/levelup-logo.svg"
                alt="LevelUp Ecosystem"
                className="h-9 w-auto select-none"
              />
            </a>
            <p className="text-sm text-[#A1A1B5] leading-relaxed">
              Secure websites for San Diego businesses and creators.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2 text-xs font-semibold text-[#A1A1B5]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
              <span>•</span>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                TikTok
              </a>
              <span>•</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-[#A1A1B5]">
              <li>
                <a href="/services" className="hover:text-white transition-colors">
                  Local Business Sites
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition-colors">
                  Creator & Influencer Sites
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition-colors">
                  Portfolios
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition-colors">
                  Security Check
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-[#A1A1B5]">
              <li>
                <a href="/projects" className="hover:text-white transition-colors">
                  Work
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/process" className="hover:text-white transition-colors">
                  How we build
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/preview" className="hover:text-white transition-colors">
                  Free preview
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-[#A1A1B5]">
              <div>
                <a
                  href="mailto:contact@levelup-ecosystem.com"
                  className="text-white hover:text-[#A78BFA] transition-colors font-medium break-all"
                >
                  contact@levelup-ecosystem.com
                </a>
              </div>
              <div className="text-xs text-[#A1A1B5]">
                Serving San Diego & Remote Clients
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/preview"
                className="inline-block px-5 py-2.5 text-xs font-bold rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] active:scale-95 cursor-pointer"
              >
                Get a free preview
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal Links, Built in SD */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A1A1B5]">
          <div>
            © 2026 LevelUp Ecosystem. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:text-white transition-colors underline underline-offset-4">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors underline underline-offset-4">
              Terms of Service
            </a>
          </div>

          <div className="text-slate-400 font-medium">
            Built in San Diego
          </div>
        </div>

      </div>
    </footer>
  );
}
