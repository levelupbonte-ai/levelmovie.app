import React from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Projects() {
  return (
    <div className="min-h-screen bg-[#0B0B14] text-white">
      <SEO
        title="Projects & Work Showcase | LevelUp Ecosystem"
        description="Explore custom websites and digital solutions built by LevelUp Ecosystem for local businesses, creators, and online brands."
        canonical="/projects"
        breadcrumbs={[{ name: 'Projects', url: '/projects' }]}
      />

      <Breadcrumbs items={[{ name: 'Projects', url: '/projects' }]} />

      {/* Hero Header */}
      <section className="pt-12 pb-12 sm:pt-18 sm:pb-16 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Work &amp; Case Studies
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Our Projects
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            High-performance websites engineered for speed, conversion, and built-in security.
          </p>
        </div>
      </section>

      {/* Clean & Empty Project Space - Ready for new additions */}
      <main className="py-20 sm:py-32 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 mx-auto flex items-center justify-center text-[#A78BFA]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Project Showcase Updating
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
              We are currently curating and uploading our latest client builds and case studies. Check back soon or request a tailored interactive preview for your business today.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/preview"
              className="px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#7C3AED]/30"
            >
              Request a free preview
            </Link>
            <Link
              to="/services"
              className="px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium text-xs sm:text-sm border border-white/[0.1] transition-all"
            >
              Explore services
            </Link>
          </div>
        </div>
      </main>

      {/* Free Interactive Preview Callout Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 border-t border-white/[0.08] bg-[#0E0E18]">
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#14141F] border border-white/[0.08] p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            See Your Brand In Motion
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Want to see what your website could look like?
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1B5] max-w-xl mx-auto leading-relaxed">
            We build free, bespoke mobile and desktop previews before any contracts or deposits. Test-drive your booking flow, service menu, or store layout risk-free.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/preview"
              className="px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#7C3AED]/30 whitespace-nowrap"
            >
              Request your free preview
            </Link>
            <Link
              to="/pricing"
              className="px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium text-xs sm:text-sm border border-white/[0.1] transition-all whitespace-nowrap"
            >
              View pricing packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
