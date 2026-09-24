import React from 'react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div>
      <SEO
        title="Page Not Found (404)"
        description="The page you requested could not be found on LevelUp Ecosystem."
      />

      <section className="py-24 sm:py-36 px-4 sm:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-block px-3.5 py-1.5 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-xs text-[#A78BFA] font-mono font-bold">
            ERROR 404
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Page not found
          </h1>

          <p className="text-base sm:text-lg text-[#A1A1B5] leading-relaxed">
            The link you followed might be broken, or the page may have moved.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/"
              className="px-7 py-3 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all shadow-md shadow-[#7C3AED]/25"
            >
              Back to Home →
            </a>
            <a
              href="/contact"
              className="px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold text-sm border border-white/[0.1] transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
