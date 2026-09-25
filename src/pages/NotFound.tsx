import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { Link } from '../components/Link';

export default function NotFound() {
  const [isReassembling, setIsReassembling] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
    }
  }, []);

  const handleRepairAndNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion) {
      return;
    }
    e.preventDefault();
    setIsReassembling(true);
    setTimeout(() => {
      window.location.href = '/';
    }, 720);
  };

  const handleHoverRepair = () => {
    if (!prefersReducedMotion && !isReassembling) {
      setIsReassembling(true);
    }
  };

  const handleHoverLeave = () => {
    // Keep repaired state for visual satisfaction
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 sm:px-8 bg-[#0B0B14] overflow-hidden">
      <SEO
        title="404: This page shattered | LevelUp Ecosystem"
        description="The page you're looking for doesn't exist or has moved. Let's put things back together."
        noindex={true}
      />

      {/* Subtle deep ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#7C3AED]/12 rounded-full blur-[150px]" />
      </div>

      {/* Embedded 404 Broken-Star Styles */}
      <style>{`
        @keyframes failingLight {
          0%, 100% { opacity: 1; }
          20% { opacity: 0.4; }
          40% { opacity: 0.9; }
          60% { opacity: 0.3; }
          80% { opacity: 0.95; }
        }

        @keyframes starTremble {
          0%, 100% { transform: translate(0, 0); }
          15% { transform: translate(-1.5px, 1px); }
          30% { transform: translate(1.5px, -1px); }
          45% { transform: translate(-1px, -1.5px); }
          60% { transform: translate(1.5px, 1px); }
          75% { transform: translate(-1.5px, 0.5px); }
          90% { transform: translate(1px, -1px); }
        }

        @keyframes chillMascotFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1.5deg);
          }
        }

        @keyframes chillAuraGlow {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.12);
          }
        }

        .chill-star-mascot {
          animation: chillMascotFloat 4.5s ease-in-out infinite;
          filter: drop-shadow(0 18px 35px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 25px rgba(124, 58, 237, 0.45));
        }

        @media (prefers-reduced-motion: reduce) {
          .chill-star-mascot {
            animation: none !important;
          }
        }
      `}</style>

      {/* Open, chill, classy layout without bubble container */}
      <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-7 py-6">

        {/* CHILL COMPLETE INTACT STAR WITH SUNGLASSES (Exact geometry: C = 50, 54.4) */}
        <div className="relative inline-flex items-center justify-center my-3">
          {/* Ambient purple aura glow behind the star */}
          <div
            className="absolute w-56 h-56 rounded-full bg-[#7C3AED]/30 blur-3xl pointer-events-none"
            style={{ animation: 'chillAuraGlow 4s ease-in-out infinite' }}
          />

          <svg
            className="w-48 h-48 sm:w-56 sm:h-56 relative z-10 overflow-visible select-none chill-star-mascot"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
          >
            {/* 10 Facets forming the 100% Complete, Solid 3D LevelUp Star (Center C = 50, 54.4) */}
            {/* Facet 0: k=0 Left */}
            <path
              d="M 50,54.4 L 38.54,38.62 L 50,10 Z"
              fill="#FFFFFF"
            />

            {/* Facet 1: k=0 Right */}
            <path
              d="M 50,54.4 L 50,10 L 61.46,38.62 Z"
              fill="#DDD3FF"
            />

            {/* Facet 2: k=1 Left */}
            <path
              d="M 50,54.4 L 61.46,38.62 L 93.75,40.18 Z"
              fill="#8B5CF6"
            />

            {/* Facet 3: k=1 Right */}
            <path
              d="M 50,54.4 L 93.75,40.18 L 68.55,60.43 Z"
              fill="#6D28D9"
            />

            {/* Facet 4: k=2 Left */}
            <path
              d="M 50,54.4 L 68.55,60.43 L 77.04,91.61 Z"
              fill="#8B5CF6"
            />

            {/* Facet 5: k=2 Right */}
            <path
              d="M 50,54.4 L 77.04,91.61 L 50,73.9 Z"
              fill="#6D28D9"
            />

            {/* Facet 6: k=3 Left */}
            <path
              d="M 50,54.4 L 50,73.9 L 22.96,91.61 Z"
              fill="#8B5CF6"
            />

            {/* Facet 7: k=3 Right */}
            <path
              d="M 50,54.4 L 22.96,91.61 L 31.45,60.43 Z"
              fill="#6D28D9"
            />

            {/* Facet 8: k=4 Left */}
            <path
              d="M 50,54.4 L 31.45,60.43 L 6.25,40.18 Z"
              fill="#8B5CF6"
            />

            {/* Facet 9: k=4 Right */}
            <path
              d="M 50,54.4 L 6.25,40.18 L 38.54,38.62 Z"
              fill="#6D28D9"
            />

            {/* Chill Sunglasses for the complete Star mascot */}
            <g className="star-sunglasses pointer-events-none select-none" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.85))' }}>
              {/* Frame & bridge */}
              <path d="M 32,48 Q 50,44.5 68,48" stroke="#0B0B14" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <line x1="47" y1="47" x2="53" y2="47" stroke="#0B0B14" strokeWidth="3.2" strokeLinecap="round" />
              {/* Left Lens */}
              <path d="M 33.5,49 C 33.5,49 33,58 38.5,59 C 44.5,59.5 47,56 47,49 Z" fill="#0B0B14" stroke="#4C1D95" strokeWidth="1.2" />
              {/* Right Lens */}
              <path d="M 53,49 C 53,49 55.5,56 61.5,59.5 C 67,58 66.5,49 66.5,49 Z" fill="#0B0B14" stroke="#4C1D95" strokeWidth="1.2" />
              {/* Specular sheen reflections */}
              <path d="M 36,51 L 42.5,51 L 39,56.5 Z" fill="#C4B5FD" opacity="0.45" />
              <path d="M 55.5,51 L 62,51 L 58.5,56.5 Z" fill="#C4B5FD" opacity="0.45" />
            </g>
          </svg>
        </div>

        {/* 404 Headline & Clear Description */}
        <div className="space-y-3">
          <div className="text-6xl sm:text-7xl font-extrabold text-[#7C3AED] font-mono tracking-tight select-none drop-shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Lost in space? Keeping it cool.
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1B5] max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has moved. Let's put things back together and get you back on track.
          </p>
        </div>

        {/* Primary Action Button with Repair Interaction */}
        <div className="pt-2">
          <a
            href="/"
            onClick={handleRepairAndNavigate}
            onMouseEnter={handleHoverRepair}
            onFocus={handleHoverRepair}
            onMouseLeave={handleHoverLeave}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm transition-all duration-200 hover:shadow-[0_0_25px_rgba(124,58,237,0.55)] active:scale-95 cursor-pointer shadow-lg shadow-[#7C3AED]/30"
          >
            Back to home
          </a>
        </div>

        {/* Quick Directory Links */}
        <div className="pt-6 border-t border-white/[0.08]">
          <p className="text-[11px] uppercase tracking-wider text-[#A1A1B5]/70 mb-3 font-semibold">
            Or explore these pages
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs sm:text-sm font-medium text-[#A1A1B5]">
            <Link to="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <span className="text-white/20 select-none">•</span>
            <Link to="/projects" className="hover:text-white transition-colors">
              Projects
            </Link>
            <span className="text-white/20 select-none">•</span>
            <Link to="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <span className="text-white/20 select-none">•</span>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
