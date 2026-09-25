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

        @keyframes drawCrack {
          0% { stroke-dashoffset: 50; opacity: 0; }
          20% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }

        @keyframes slowFloatPieceA {
          0%, 100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); }
          50% { transform: translate(calc(var(--dx) - 2px), calc(var(--dy) - 4px)) rotate(calc(var(--rot) - 2deg)); }
        }
        @keyframes slowFloatPieceB {
          0%, 100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); }
          50% { transform: translate(calc(var(--dx) + 3px), calc(var(--dy) + 3px)) rotate(calc(var(--rot) + 2deg)); }
        }

        @keyframes centerGlow {
          0%, 100% { opacity: 0.2; transform: scale(0.95); }
          50% { opacity: 0.45; transform: scale(1.2); }
        }

        @keyframes sparkFlicker {
          0%, 100% { opacity: 0.2; transform: scale(0.6); }
          50% { opacity: 0.95; transform: scale(1.4); }
        }

        .star-shattered-scene {
          animation: failingLight 0.4s ease-out 1, starTremble 0.5s ease-in-out 0.4s 1;
        }

        .shatter-crack {
          stroke: #DDD3FF;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-dasharray: 50;
          animation: drawCrack 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
        }

        .broken-facet {
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), fill 0.7s ease, opacity 0.7s ease, filter 0.7s ease;
          transform-origin: 50px 54.4px;
        }

        .broken-facet.is-broken {
          transform: translate(var(--dx), var(--dy)) rotate(var(--rot));
          animation: slowFloatPieceA 6s ease-in-out 1.6s infinite;
        }
        .broken-facet.is-broken.float-alt {
          animation: slowFloatPieceB 6s ease-in-out 1.6s infinite;
        }

        .broken-facet.is-reassembled {
          transform: translate(0, 0) rotate(0) !important;
          animation: none !important;
          filter: drop-shadow(0 0 16px rgba(124, 58, 237, 0.85));
        }

        @media (prefers-reduced-motion: reduce) {
          .star-shattered-scene,
          .shatter-crack,
          .broken-facet,
          .broken-facet.is-broken {
            animation: none !important;
            transition: none !important;
          }
          .broken-facet.is-broken {
            transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) !important;
          }
        }
      `}</style>

      {/* Main Glassmorphic Card Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto rounded-3xl bg-[#14141F]/80 backdrop-blur-2xl border border-white/[0.1] p-8 sm:p-12 text-center space-y-8 shadow-2xl shadow-black/80">
        
        {/* Top Status Pill */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-[#A78BFA] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>HTTP 404 • Route Not Found</span>
          </div>
        </div>

        {/* BROKEN STAR ANIMATION SCENE (Exact geometry: C = 50, 54.4) */}
        <div className="relative inline-flex items-center justify-center my-2">
          {/* Dim glow where center was */}
          <div
            className={`absolute w-44 h-44 rounded-full blur-2xl pointer-events-none transition-all duration-700 ${
              isReassembling ? 'bg-[#7C3AED]/50 scale-125' : 'bg-[#7C3AED]/20'
            }`}
            style={{ animation: isReassembling ? 'none' : 'centerGlow 4s ease-in-out infinite' }}
          />

          <svg
            className="w-44 h-44 sm:w-52 sm:h-52 relative z-10 overflow-visible select-none star-shattered-scene"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
          >
            {/* Center spark dots */}
            <circle cx="50" cy="54.4" r="2" fill="#DDD3FF" style={{ animation: 'sparkFlicker 2.5s ease-in-out infinite' }} />
            <circle cx="52" cy="50" r="1.5" fill="#A78BFA" style={{ animation: 'sparkFlicker 3.2s ease-in-out 0.8s infinite' }} />
            <circle cx="48" cy="58" r="1.2" fill="#FFFFFF" style={{ animation: 'sparkFlicker 2.8s ease-in-out 1.2s infinite' }} />

            {/* Falling dust & shards */}
            <g className="dust-shards" opacity={isReassembling ? '0' : '0.4'}>
              <polygon points="49,52 51,51 50,54" fill="#DDD3FF" />
              <polygon points="53,46 54,48 52,47" fill="#A78BFA" />
              <polygon points="45,59 47,60 46,62" fill="#8B5CF6" />
            </g>

            {/* Cracks drawing from center to outer points */}
            {!isReassembling && (
              <g className="cracks-group">
                <line x1="50" y1="54.4" x2="50" y2="10" className="shatter-crack" />
                <line x1="50" y1="54.4" x2="93.75" y2="40.18" className="shatter-crack" />
                <line x1="50" y1="54.4" x2="77.04" y2="91.61" className="shatter-crack" />
                <line x1="50" y1="54.4" x2="22.96" y2="91.61" className="shatter-crack" />
                <line x1="50" y1="54.4" x2="6.25" y2="40.18" className="shatter-crack" />
                <line x1="50" y1="54.4" x2="61.46" y2="38.62" className="shatter-crack" strokeDasharray="3,3" />
                <line x1="50" y1="54.4" x2="38.54" y2="38.62" className="shatter-crack" strokeDasharray="3,3" />
                <line x1="50" y1="54.4" x2="68.55" y2="60.43" className="shatter-crack" strokeDasharray="3,3" />
                <line x1="50" y1="54.4" x2="31.45" y2="60.43" className="shatter-crack" strokeDasharray="3,3" />
              </g>
            )}

            {/* 10 Facets (Exact Geometry, drifting outward with rotation) */}
            {/* Facet 0: k=0 Left */}
            <path
              d="M 50,54.4 L 38.54,38.62 L 50,10 Z"
              fill={isReassembling ? '#FFFFFF' : '#B8ACD4'}
              className={`broken-facet ${isReassembling ? 'is-reassembled' : 'is-broken'}`}
              style={{ '--dx': '-14px', '--dy': '-20px', '--rot': '-8deg' } as React.CSSProperties}
            />

            {/* Facet 1: k=0 Right */}
            <path
              d="M 50,54.4 L 50,10 L 61.46,38.62 Z"
              fill={isReassembling ? '#DDD3FF' : '#9E8EBE'}
              className={`broken-facet float-alt ${isReassembling ? 'is-reassembled' : 'is-broken'}`}
              style={{ '--dx': '14px', '--dy': '-20px', '--rot': '8deg' } as React.CSSProperties}
            />

            {/* Facet 2: k=1 Left */}
            <path
              d="M 50,54.4 L 61.46,38.62 L 93.75,40.18 Z"
              fill={isReassembling ? '#8B5CF6' : '#5E3C8A'}
              className={`broken-facet ${isReassembling ? 'is-reassembled' : 'is-broken'}`}
              style={{ '--dx': '30px', '--dy': '-8px', '--rot': '12deg' } as React.CSSProperties}
            />

            {/* Facet 3: k=1 Right */}
            <path
              d="M 50,54.4 L 93.75,40.18 L 68.55,60.43 Z"
              fill={isReassembling ? '#6D28D9' : '#4C2872'}
              className={`broken-facet float-alt ${isReassembling ? 'is-reassembled' : 'is-broken'}`}
              style={{ '--dx': '26px', '--dy': '14px', '--rot': '15deg' } as React.CSSProperties}
            />

            {/* Facet 4: k=2 Left */}
            <path
              d="M 50,54.4 L 68.55,60.43 L 77.04,91.61 Z"
              fill={isReassembling ? '#8B5CF6' : '#5E3C8A'}
              className={`broken-facet ${isReassembling ? 'is-reassembled' : 'is-broken'}`}
              style={{ '--dx': '18px', '--dy': '30px', '--rot': '10deg' } as React.CSSProperties}
            />

            {/* Facet 5: k=2 Right */}
            <path
              d="M 50,54.4 L 77.04,91.61 L 50,73.9 Z"
              fill={isReassembling ? '#6D28D9' : '#421E66'}
              className={`broken-facet float-alt ${isReassembling ? 'is-reassembled' : 'is-broken'}`}
              style={{ '--dx': '6px', '--dy': '34px', '--rot': '5deg' } as React.CSSProperties}
            />

            {/* Facet 6: k=3 Left */}
            <path
              d="M 50,54.4 L 50,73.9 L 22.96,91.61 Z"
              fill={isReassembling ? '#8B5CF6' : '#5E3C8A'}
              className={`broken-facet ${isReassembling ? 'is-reassembled' : 'is-broken'}`}
              style={{ '--dx': '-6px', '--dy': '34px', '--rot': '-5deg' } as React.CSSProperties}
            />

            {/* Facet 7: k=3 Right */}
            <path
              d="M 50,54.4 L 22.96,91.61 L 31.45,60.43 Z"
              fill={isReassembling ? '#6D28D9' : '#421E66'}
              className={`broken-facet float-alt ${isReassembling ? 'is-reassembled' : 'is-broken'}`}
              style={{ '--dx': '-18px', '--dy': '30px', '--rot': '-10deg' } as React.CSSProperties}
            />

            {/* Facet 8: k=4 Left */}
            <path
              d="M 50,54.4 L 31.45,60.43 L 6.25,40.18 Z"
              fill={isReassembling ? '#8B5CF6' : '#5E3C8A'}
              className={`broken-facet ${isReassembling ? 'is-reassembled' : 'is-broken'}`}
              style={{ '--dx': '-26px', '--dy': '14px', '--rot': '-15deg' } as React.CSSProperties}
            />

            {/* Facet 9: k=4 Right */}
            <path
              d="M 50,54.4 L 6.25,40.18 L 38.54,38.62 Z"
              fill={isReassembling ? '#6D28D9' : '#4C2872'}
              className={`broken-facet float-alt ${isReassembling ? 'is-reassembled' : 'is-broken'}`}
              style={{ '--dx': '-30px', '--dy': '-8px', '--rot': '-12deg' } as React.CSSProperties}
            />
          </svg>
        </div>

        {/* 404 Headline & Description with Exact Specified Copy */}
        <div className="space-y-3">
          <div className="text-6xl sm:text-7xl font-extrabold text-[#7C3AED] font-mono tracking-tight select-none drop-shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            This page shattered.
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1B5] max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has moved. Let's put things back together.
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
