import React from 'react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="py-16 sm:py-24 px-4 sm:px-8">
      <SEO
        title="Page not found | LevelUp Ecosystem"
        description="The page you're looking for doesn't exist or has moved."
      />

      <div className="max-w-2xl mx-auto text-center space-y-8">
        
        {/* LevelUp Faceted Star with ONE Detached Floating Facet (160px) */}
        <div className="relative inline-flex items-center justify-center">
          {/* Subtle background glow */}
          <div className="absolute w-44 h-44 bg-[#7C3AED]/15 rounded-full blur-2xl pointer-events-none" />

          <svg
            className="w-40 h-40 sm:w-44 sm:h-44 relative z-10 overflow-visible select-none"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
          >
            {/* Ghost outline showing the missing piece vacancy */}
            <path
              d="M 50,50 L 39.42,35.44 L 50,6 Z"
              stroke="#7C3AED"
              strokeWidth="0.9"
              strokeDasharray="2.5 2.5"
              fill="rgba(124, 58, 237, 0.12)"
            />

            {/* Arm 0: Right facet (in place) */}
            <path d="M 50,50 L 50,6 L 60.58,35.44 Z" fill="#8B5CF6" />

            {/* Arm 1: Right */}
            <path d="M 50,50 L 60.58,35.44 L 91.85,36.4 Z" fill="#7C3AED" />
            <path d="M 50,50 L 91.85,36.4 L 67.12,55.56 Z" fill="#581C87" />

            {/* Arm 2: Bottom-Right */}
            <path d="M 50,50 L 67.12,55.56 L 75.86,85.6 Z" fill="#4C1D95" />
            <path d="M 50,50 L 75.86,85.6 L 50,68 Z" fill="#3B0764" />

            {/* Arm 3: Bottom-Left */}
            <path d="M 50,50 L 50,68 L 24.14,85.6 Z" fill="#581C87" />
            <path d="M 50,50 L 24.14,85.6 L 32.88,55.56 Z" fill="#7C3AED" />

            {/* Arm 4: Left */}
            <path d="M 50,50 L 32.88,55.56 L 8.15,36.4 Z" fill="#8B5CF6" />
            <path d="M 50,50 L 8.15,36.4 L 39.42,35.44 Z" fill="#C4B5FD" />

            {/* The single detached, floating facet with subtle animation */}
            <g className="animate-[floatPiece_3.4s_ease-in-out_infinite] origin-[45px_22px]">
              <path
                d="M 50,50 L 39.42,35.44 L 50,6 Z"
                fill="#DDD6FE"
                className="drop-shadow-[0_4px_10px_rgba(124,58,237,0.5)]"
              />
            </g>
          </svg>
        </div>

        {/* 404 Headline & Description */}
        <div className="space-y-3">
          <div className="text-6xl sm:text-7xl font-extrabold text-[#7C3AED] font-mono tracking-tight select-none">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            This page took a wrong turn
          </h1>
          <p className="text-base text-[#A1A1B5] max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has moved.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_24px_rgba(124,58,237,0.45)] active:scale-95 cursor-pointer"
          >
            Back to home
          </a>
        </div>

        {/* Row of Secondary Links */}
        <div className="pt-4 border-t border-white/[0.08] max-w-md mx-auto">
          <p className="text-xs uppercase tracking-wider text-[#A1A1B5]/70 mb-3 font-semibold">
            Or explore these pages
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-[#A1A1B5]">
            <a href="/services" className="hover:text-white transition-colors">
              Services
            </a>
            <span className="text-white/20 select-none">•</span>
            <a href="/projects" className="hover:text-white transition-colors">
              Projects
            </a>
            <span className="text-white/20 select-none">•</span>
            <a href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <span className="text-white/20 select-none">•</span>
            <a href="/preview" className="hover:text-white transition-colors">
              Free preview
            </a>
            <span className="text-white/20 select-none">•</span>
            <a href="/contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
