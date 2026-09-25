import React, { useEffect, useRef, useState } from 'react';
import { Link } from './Link';

export interface ShowcaseProject {
  id: string;
  isRealClient: boolean;
  statusBadge: 'Live project' | 'Concept' | 'Example build';
  eyebrow: string;
  title: string;
  shortDescription: string;
  tags: string[];
  clientLink?: string;
  caseStudyLink?: string;
  image: {
    avif1400: string;
    webp1400: string;
    avif800?: string;
    webp800?: string;
    fallbackJpg: string;
    alt: string;
    width: number;
    height: number;
  };
  metrics?: { value: string; label: string }[];
  isTall?: boolean;
}

interface WorkShowcaseItemProps {
  key?: React.Key;
  project: ShowcaseProject;
  index: number;
  isEager?: boolean;
}

export default function WorkShowcaseItem({ project, index, isEager = false }: WorkShowcaseItemProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const isEven = index % 2 === 1; // 0 is odd (1st), 1 is even (2nd), etc.

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once in view, we keep it visible for smooth performance
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={`project-${project.id}`}
      className="py-10 sm:py-14 lg:py-16 border-b border-white/[0.06] last:border-b-0 overflow-hidden"
    >
      {/* 5-8% side margins: max-w-[94vw] or 2xl:max-w-[1520px] with responsive px */}
      <div className="w-full max-w-[94vw] 2xl:max-w-[1520px] mx-auto px-2 sm:px-4 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center ${
            isEven ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
          }`}
        >
          {/* Intro Column (Eyebrow, Title, Description, Tags, CTAs) */}
          <div className="lg:col-span-4 xl:col-span-5 space-y-6">
            <div className="space-y-3">
              {/* Eyebrow and Distinction indicator */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    project.isRealClient ? 'text-[#10B981]' : 'text-[#A78BFA]'
                  }`}
                >
                  {project.eyebrow}
                </span>

                <span className="text-white/20 text-xs" aria-hidden="true">
                  •
                </span>

                {/* Status Pill Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
                    project.isRealClient
                      ? 'bg-[#064E3B]/80 text-[#6EE7B7] border border-[#10B981]/40'
                      : 'bg-[#1F1B38]/90 text-[#C4B5FD] border border-[#7C3AED]/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      project.isRealClient ? 'bg-[#10B981] animate-pulse' : 'bg-[#A78BFA]'
                    }`}
                  />
                  {project.statusBadge}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {project.title}
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#A1A1B5] leading-relaxed">
              {project.shortDescription}
            </p>

            {/* Tags list */}
            <div className="flex flex-wrap gap-2 pt-1" aria-label="Project tags">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-md text-xs font-medium text-[#C4B5FD] bg-white/[0.04] border border-white/[0.08]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Metrics if real client */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06]">
                {project.metrics.map((m) => (
                  <div key={m.label} className="space-y-0.5">
                    <div className="text-lg sm:text-xl font-extrabold text-white font-mono tabular-nums">
                      {m.value}
                    </div>
                    <div className="text-[11px] text-[#A78BFA] leading-tight">{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {project.isRealClient ? (
                <>
                  {project.caseStudyLink && (
                    <Link
                      to={project.caseStudyLink}
                      className="px-5 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#7C3AED]/25 whitespace-nowrap"
                    >
                      Read case study
                    </Link>
                  )}
                  {project.clientLink && (
                    <a
                      href={project.clientLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs sm:text-sm font-medium border border-white/[0.1] hover:border-white/[0.2] transition-all whitespace-nowrap"
                    >
                      <span>Visit site</span>
                      <span aria-hidden="true" className="text-xs">↗</span>
                    </a>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/preview"
                    className="px-5 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#7C3AED]/25 whitespace-nowrap"
                  >
                    Request similar preview
                  </Link>
                  <Link
                    to="/contact"
                    className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#A1A1B5] hover:text-white text-xs sm:text-sm font-medium border border-white/[0.08] transition-all whitespace-nowrap"
                  >
                    Discuss this layout
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Image Column: Elevated plane spanning nearly full viewport width */}
          <div className="lg:col-span-8 xl:col-span-7">
            <div
              className={`relative group transition-all duration-700 ease-out will-change-transform ${
                isInView
                  ? 'opacity-100 scale-100 [transform:perspective(1200px)_rotateX(0deg)_rotateY(0deg)]'
                  : isEven
                  ? 'opacity-25 scale-[0.96] translate-y-5 [transform:perspective(1200px)_rotateX(2.5deg)_rotateY(3deg)]'
                  : 'opacity-25 scale-[0.96] translate-y-5 [transform:perspective(1200px)_rotateX(2.5deg)_rotateY(-3deg)]'
              }`}
            >
              {/* Subtle Elevated Plane Container: Soft ambient shadow beneath it, no fake browser frame */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#12121D] border border-white/[0.08] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)] group-hover:border-[#7C3AED]/40 group-hover:shadow-[0_32px_70px_-12px_rgba(124,58,237,0.18),0_0_0_1px_rgba(124,58,237,0.3)] transition-all duration-500">
                {/* Floating pill badge directly on top of image */}
                <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 pointer-events-none">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg ${
                      project.isRealClient
                        ? 'bg-[#064E3B]/90 text-[#6EE7B7] border border-[#10B981]/50'
                        : 'bg-[#121024]/90 text-[#DDD6FE] border border-[#7C3AED]/40'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        project.isRealClient ? 'bg-[#10B981] animate-pulse' : 'bg-[#A78BFA]'
                      }`}
                    />
                    <span>{project.statusBadge}</span>
                  </div>
                </div>

                {/* Subtle top ambient sheen */}
                <div
                  className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10"
                  aria-hidden="true"
                />

                {/* Elevated Image with Gentle Hover Scale */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#0A0A12]">
                  <picture className="w-full h-full block">
                    {/* AVIF responsive */}
                    <source
                      type="image/avif"
                      srcSet={
                        project.image.avif800
                          ? `${project.image.avif800} 800w, ${project.image.avif1400} 1400w`
                          : project.image.avif1400
                      }
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 900px"
                    />
                    {/* WebP responsive */}
                    <source
                      type="image/webp"
                      srcSet={
                        project.image.webp800
                          ? `${project.image.webp800} 800w, ${project.image.webp1400} 1400w`
                          : project.image.webp1400
                      }
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 900px"
                    />
                    {/* Fallback image: lazy load except first */}
                    <img
                      src={project.image.fallbackJpg}
                      alt={project.image.alt}
                      width={project.image.width}
                      height={project.image.height}
                      loading={isEager ? 'eager' : 'lazy'}
                      decoding={isEager ? 'sync' : 'async'}
                      fetchPriority={isEager ? 'high' : 'auto'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />
                  </picture>
                </div>

                {/* Bottom Bar: Title, One-line description, and tags / visit link */}
                <div className="p-4 sm:p-5 bg-[#0E0E18] border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {project.title}
                      </span>
                      <span className="text-[11px] text-white/30 hidden sm:inline" aria-hidden="true">
                        —
                      </span>
                      <span className="text-[11px] text-[#A1A1B5] truncate hidden sm:inline">
                        {project.tags.join(' · ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#A1A1B5] sm:hidden truncate">
                      {project.tags.join(' · ')}
                    </div>
                  </div>

                  {project.isRealClient && project.clientLink ? (
                    <a
                      href={project.clientLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981] hover:text-[#34D399] transition-colors shrink-0"
                    >
                      <span>Visit site</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-[#A78BFA] font-mono shrink-0">
                      Concept Showcase
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
