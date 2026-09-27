import React from 'react';
import SEO from '../components/SEO';
import { Link } from '../components/Link';

export default function PreviewHub() {
  return (
    <div className="py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden">
      <SEO
        title="Get a Free Preview | LevelUp Ecosystem"
        description="See your new website before you decide. Choose between an instant interactive prototype or a bespoke custom preview designed by LevelUp."
        noindex={true}
      />

      {/* Subtle ambient lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#7C3AED]/12 blur-[140px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Hero Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-20">
        <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
          Risk-Free Discovery
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Preview your website before you commit
        </h1>
        <p className="text-base sm:text-lg text-[#A1A1B5] max-w-xl mx-auto leading-relaxed">
          Experience your new site's layout, flow, and features before spending a single dollar.
        </p>
      </div>

      {/* Two Choice Cards - Premium Finishes */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Card 1: Instant Prototype */}
        <div className="rounded-3xl bg-gradient-to-b from-[#151524] to-[#0D0D18] border border-white/[0.08] hover:border-white/[0.18] p-8 sm:p-10 flex flex-col justify-between relative transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] group">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1B5] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                Automated Prototype
              </span>
              <span className="text-xs text-[#71717A] font-mono bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.05]">
                5–10 min
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2.5 tracking-tight group-hover:text-white transition-colors">
                Instant Preview
              </h2>
              <p className="text-sm text-[#A1A1B5] leading-relaxed">
                An automated interactive prototype generated in minutes. Perfect for exploring initial structures, colors, and layout rhythm.
              </p>
            </div>

            <ul className="space-y-3.5 pt-2 text-sm text-[#D1D1DF]">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#7C3AED]/20 text-[#A78BFA] flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                  ✓
                </span>
                <span>Immediate interactive draft generated in minutes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#7C3AED]/20 text-[#A78BFA] flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                  ✓
                </span>
                <span>Mobile-responsive layout structured from your business profile</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#7C3AED]/20 text-[#A78BFA] flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                  ✓
                </span>
                <span>Seamless handoff to senior human engineers for final delivery</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              to="/preview/instant"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-sm border border-white/[0.1] transition-all duration-200 cursor-pointer active:scale-[0.99]"
            >
              <span>Launch Instant Prototype</span>
              <span className="text-xs font-mono text-[#A78BFA]">→</span>
            </Link>
          </div>
        </div>

        {/* Card 2: Custom Preview (Studio Flagship / Handcrafted) */}
        <div className="rounded-3xl bg-gradient-to-b from-[#191630] via-[#121124] to-[#0E0D1B] border-2 border-[#7C3AED] ring-1 ring-[#A78BFA]/30 p-8 sm:p-10 flex flex-col justify-between relative shadow-[0_20px_50px_-12px_rgba(124,58,237,0.35)] transition-all duration-300">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#7C3AED]/30">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-white bg-gradient-to-r from-[#7C3AED] to-[#9333EA] shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Studio Crafted</span>
              </div>
              <span className="text-xs text-[#DDD6FE] font-mono bg-[#7C3AED]/20 px-2.5 py-1 rounded-full border border-[#7C3AED]/40">
                24–48h
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2.5 tracking-tight">
                Custom Preview
              </h2>
              <p className="text-sm text-[#DDD6FE]/80 leading-relaxed">
                Handcrafted specifically for your business by our engineering studio. Delivered directly to your private email.
              </p>
            </div>

            <ul className="space-y-3.5 pt-2 text-sm text-[#F4F4F5]">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold shadow-[0_0_10px_rgba(124,58,237,0.5)]">
                  ✓
                </span>
                <span className="font-medium text-white">Delivered in 24 to 48 business hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold shadow-[0_0_10px_rgba(124,58,237,0.5)]">
                  ✓
                </span>
                <span>Custom appointment booking &amp; conversion architecture</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold shadow-[0_0_10px_rgba(124,58,237,0.5)]">
                  ✓
                </span>
                <span>Tailored branding, typography, and interactive walkthrough</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              to="/preview/custom"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#7C3AED] hover:from-[#8B5CF6] hover:to-[#A78BFA] text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-[#7C3AED]/30 hover:shadow-[#7C3AED]/50 cursor-pointer active:scale-[0.99]"
            >
              <span>Request Custom Preview</span>
              <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded-full">→</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Reassurance Note */}
      <div className="max-w-xl mx-auto text-center mt-12">
        <p className="text-xs text-[#71717A] leading-relaxed">
          Zero commitment or card required. Custom mockups are reviewed by LevelUp engineers and governed by our{' '}
          <Link to="/terms" className="text-[#A78BFA] underline hover:text-white">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-[#A78BFA] underline hover:text-white">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </div>
  );
}
