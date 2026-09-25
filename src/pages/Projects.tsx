import React, { useState } from 'react';
import { Link } from '../components/Link';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import WorkShowcaseItem, { ShowcaseProject } from '../components/WorkShowcaseItem';

const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'final-stop',
    isRealClient: true,
    statusBadge: 'Live project',
    eyebrow: 'Live Client Deployment • San Diego, CA',
    title: 'Final Stop Barber Shop & Salon',
    shortDescription:
      'Fast, mobile-first booking platform and web presence for a premier grooming and braiding lounge, replacing an unmaintained social link tree with 24/7 client booking.',
    tags: ['Local Business', 'Online Booking', 'Google Calendar Sync'],
    clientLink: 'https://finalstop.org',
    caseStudyLink: '/projects/final-stop',
    metrics: [
      { value: '< 1.8s', label: 'Mobile speed' },
      { value: '40%+', label: 'Online bookings' },
      { value: '100%', label: 'HTTPS encrypted' },
    ],
    image: {
      avif1400: '/assets/img/finalstop-desktop.avif',
      webp1400: '/assets/img/finalstop-desktop.webp',
      fallbackJpg: '/assets/img/finalstop-desktop.jpg',
      alt: 'Final Stop Barber Shop & Salon live website desktop interface',
      width: 1000,
      height: 625,
    },
  },
  {
    id: 'aura-acoustics',
    isRealClient: false,
    statusBadge: 'Concept',
    eyebrow: 'Example Build • E-Commerce & Hardware',
    title: 'AURA Studio Acoustics',
    shortDescription:
      'Minimalist dark-mode digital storefront engineered for bespoke studio sound monitors and analog audio hardware, featuring clean product grids and instant checkout.',
    tags: ['E-commerce', 'Product Grid', 'Dark UI'],
    image: {
      avif1400: '/assets/img/projects/concept-audio-store-1400.avif',
      webp1400: '/assets/img/projects/concept-audio-store-1400.webp',
      avif800: '/assets/img/projects/concept-audio-store-800.avif',
      webp800: '/assets/img/projects/concept-audio-store-800.webp',
      fallbackJpg: '/assets/img/projects/concept-audio-store.jpg',
      alt: 'AURA Studio Acoustics bespoke audio equipment digital storefront concept',
      width: 1376,
      height: 768,
    },
  },
  {
    id: 'monolith-lighting',
    isRealClient: false,
    statusBadge: 'Example build',
    eyebrow: 'Example Build • Architecture & Spatial Design',
    title: 'Monolith Architectural Lighting',
    shortDescription:
      'Full-bleed editorial portfolio and project catalog for an architectural lighting design studio, pairing dramatic spatial photography with bespoke project intake.',
    tags: ['Portfolio', 'Editorial Layout', 'High Contrast'],
    image: {
      avif1400: '/assets/img/projects/concept-architecture-studio-1400.avif',
      webp1400: '/assets/img/projects/concept-architecture-studio-1400.webp',
      avif800: '/assets/img/projects/concept-architecture-studio-800.avif',
      webp800: '/assets/img/projects/concept-architecture-studio-800.webp',
      fallbackJpg: '/assets/img/projects/concept-architecture-studio.jpg',
      alt: 'Monolith Architectural Lighting design studio portfolio showcase concept',
      width: 1376,
      height: 768,
    },
  },
  {
    id: 'kinetic-recovery',
    isRealClient: false,
    statusBadge: 'Concept',
    eyebrow: 'Example Build • Wellness & Private Membership',
    title: 'Kinetic Recovery Club',
    shortDescription:
      'Modern booking platform and private membership portal for a contrast therapy and cold-plunge sanctuary, featuring dynamic session reservations and tier access.',
    tags: ['Online Booking', 'Membership Flow', 'Dark Theme'],
    image: {
      avif1400: '/assets/img/projects/concept-wellness-booking-1400.avif',
      webp1400: '/assets/img/projects/concept-wellness-booking-1400.webp',
      webp800: '/assets/img/projects/concept-wellness-booking-800.webp',
      fallbackJpg: '/assets/img/projects/concept-wellness-booking-1400.webp',
      alt: 'Kinetic Recovery Club private wellness sanctuary booking concept',
      width: 1376,
      height: 768,
    },
  },
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'concepts'>('all');

  const filteredProjects = SHOWCASE_PROJECTS.filter((item) => {
    if (activeFilter === 'live') return item.isRealClient;
    if (activeFilter === 'concepts') return !item.isRealClient;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0B0B14] text-white">
      <SEO
        title="Work & Examples Showcase | LevelUp Ecosystem"
        description="Explore live client deployments and concept builds designed by LevelUp Ecosystem: online booking, e-commerce, and high-performance dark themes."
        canonical="/projects"
        breadcrumbs={[{ name: 'Projects', url: '/projects' }]}
      />

      <Breadcrumbs items={[{ name: 'Projects', url: '/projects' }]} />

      {/* Hero Header */}
      <section className="pt-14 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-8 border-b border-white/[0.08] bg-[#0B0B14]">
        <div className="max-w-4xl mx-auto text-center space-y-4" data-reveal>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Work &amp; Examples Showcase
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Engineered for Impact.
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1B5] max-w-2xl mx-auto leading-relaxed">
            Full-width showcase of live client websites and tailored concept builds. No bloated page builders, no slow templates — just fast, secure digital architecture.
          </p>

          {/* Distinction & Transparency Notice */}
          <div className="pt-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs text-[#A1A1B5] bg-white/[0.03] border border-white/[0.08]">
              <span className="flex items-center gap-1.5 font-medium text-white">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                Live Project
              </span>
              <span className="text-white/20">vs</span>
              <span className="flex items-center gap-1.5 font-medium text-[#C4B5FD]">
                <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
                Concept Build
              </span>
              <span className="text-white/30 hidden sm:inline">•</span>
              <span className="hidden sm:inline text-[#71717A]">
                Always clearly badged
              </span>
            </div>
          </div>

          {/* Segmented Filter Control */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeFilter === 'all'
                    ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/25'
                    : 'text-[#A1A1B5] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                All Examples ({SHOWCASE_PROJECTS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('live')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === 'live'
                    ? 'bg-[#064E3B] text-[#6EE7B7] border border-[#10B981]/40'
                    : 'text-[#A1A1B5] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Live Client (1)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('concepts')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter === 'concepts'
                    ? 'bg-[#1F1B38] text-[#C4B5FD] border border-[#7C3AED]/40'
                    : 'text-[#A1A1B5] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                Concept Builds (3)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Bleed Showcase Stream */}
      <main className="divide-y divide-white/[0.06]">
        {filteredProjects.map((project, index) => (
          <WorkShowcaseItem
            key={project.id}
            project={project}
            index={index}
            isEager={index === 0 && activeFilter === 'all'}
          />
        ))}
      </main>

      {/* Free Interactive Preview Callout Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 border-t border-white/[0.08] bg-[#0E0E18]">
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
