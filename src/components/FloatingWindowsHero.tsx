import React, { useEffect, useRef, useState } from 'react';
import { Link } from './Link';
import { CalendarCheck, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

/**
 * FloatingWindowsHero:
 * CSS 3D Multi-Layer Scene (No WebGL).
 * - 4 layers with perspective (~1200px):
 *   1. Desktop Screenshot frame (Final Stop Barber Shop)
 *   2. Phone Screenshot frame (Mobile booking flow)
 *   3. Small UI card: Sample Booking Confirmation (HTML/CSS, clearly sample data)
 *   4. Small UI card: Sample Security Checklist (HTML/CSS, clearly sample data)
 * - Pointer-driven tilt & subtle scroll parallax using transform only.
 * - Disabled on touch devices and prefers-reduced-motion.
 */
export default function FloatingWindowsHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardGroupRef = useRef<HTMLDivElement>(null);
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check pointer fine & reduced motion
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      return;
    }

    setCanTilt(true);

    let animFrame: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let scrollOffset = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates: -1 to 1
      const normX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Max tilt ~ 7 degrees
      targetY = Math.max(-1, Math.min(1, normX)) * 7;
      targetX = -Math.max(-1, Math.min(1, normY)) * 6;
    };

    const handleScroll = () => {
      // Subtle scroll parallax: transform only
      const scrollY = window.scrollY || window.pageYOffset;
      scrollOffset = Math.min(40, scrollY * 0.08);
    };

    const updateTilt = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (cardGroupRef.current) {
        cardGroupRef.current.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) translateY(${scrollOffset.toFixed(1)}px)`;
      }

      animFrame = requestAnimationFrame(updateTilt);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    animFrame = requestAnimationFrame(updateTilt);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xl mx-auto select-none"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Transform Group */}
      <div
        ref={cardGroupRef}
        className="relative transition-transform duration-100 ease-out will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ============================================================ */}
        {/* LAYER 1: Desktop Screenshot Frame (Base Layer: translateZ(0)) */}
        {/* ============================================================ */}
        <div
          className="relative rounded-2xl bg-[#14141F] border border-white/[0.14] shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Browser Chrome Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F0F1A] border-b border-white/[0.08]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
            </div>

            {/* URL Bar */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0B0B14] border border-white/[0.08] text-[11px] text-[#A1A1B5]">
              <Lock className="w-3 h-3 text-[#10B981]" />
              <span className="text-white font-medium">finalstop.org</span>
              <span className="text-white/40 hidden sm:inline">• Live Client Site</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#A78BFA] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="hidden sm:inline">Online</span>
            </div>
          </div>

          {/* Desktop Image with <picture> (AVIF, WebP, JPG fallback) */}
          <picture>
            <source
              type="image/avif"
              srcSet="/assets/img/finalstop-desktop.avif"
            />
            <source
              type="image/webp"
              srcSet="/assets/img/finalstop-desktop.webp"
            />
            <img
              src="/assets/img/finalstop-desktop.jpg"
              alt="Final Stop Barber Shop desktop website interface"
              width="1000"
              height="625"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto block object-cover"
            />
          </picture>

          {/* Bottom Bar Info */}
          <div className="px-4 py-2 bg-[#0F0F1A]/90 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#A1A1B5]">
            <span className="text-white font-medium">Final Stop Barber Shop & Salon</span>
            <Link
              to="/projects/final-stop"
              className="text-[#A78BFA] hover:text-white transition-colors font-medium flex items-center gap-1"
            >
              Case Study →
            </Link>
          </div>
        </div>

        {/* ============================================================ */}
        {/* LAYER 2: Phone Screenshot Frame (translateZ(55px))           */}
        {/* ============================================================ */}
        <div
          className="absolute -bottom-6 -right-3 sm:-bottom-8 sm:-right-6 w-36 sm:w-44 rounded-[28px] sm:rounded-[34px] bg-[#0F0F1A] p-1.5 sm:p-2 border-2 border-white/[0.18] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md hidden xs:block"
          style={{ transform: canTilt ? 'translateZ(55px)' : 'none' }}
        >
          {/* Dynamic Island / Speaker */}
          <div className="w-16 h-3 mx-auto bg-black rounded-full mb-1.5 flex items-center justify-end px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]/80" />
          </div>

          {/* Phone Screen Picture */}
          <div className="rounded-[22px] sm:rounded-[26px] overflow-hidden bg-black aspect-[9/18.5]">
            <picture>
              <source
                type="image/avif"
                srcSet="/assets/img/finalstop-mobile.avif"
              />
              <source
                type="image/webp"
                srcSet="/assets/img/finalstop-mobile.webp"
              />
              <img
                src="/assets/img/finalstop-mobile.jpg"
                alt="Final Stop mobile booking interface"
                width="380"
                height="780"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
            </picture>
          </div>

          <div className="mt-1 text-center">
            <span className="text-[10px] text-white/70 font-medium">Mobile Flow</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* LAYER 3: Sample Booking Confirmation Card (translateZ(85px)) */}
        {/* ============================================================ */}
        <div
          className="absolute -top-6 -right-2 sm:-top-8 sm:right-6 bg-[#14141F]/95 backdrop-blur-xl border border-white/[0.15] rounded-xl p-3 sm:p-3.5 shadow-[0_16px_36px_rgba(0,0,0,0.6)] text-left max-w-[210px] sm:max-w-[240px]"
          style={{ transform: canTilt ? 'translateZ(85px)' : 'none' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[#10B981] text-xs font-bold">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Booking Confirmed</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.08] text-[#A1A1B5] font-mono">
              Sample Data
            </span>
          </div>

          <div className="text-xs font-semibold text-white truncate">Skin Fade & Beard Trim</div>
          <div className="text-[11px] text-[#A1A1B5] mt-0.5">Fri, 2:30 PM • 45 min</div>
          
          <div className="mt-2 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px]">
            <span className="text-[#A78BFA] font-medium">Deposit Paid (Stripe)</span>
            <span className="text-[#10B981] font-semibold flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> Synced
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* LAYER 4: Sample Security Checklist Card (translateZ(105px))  */}
        {/* ============================================================ */}
        <div
          className="absolute -bottom-6 -left-3 sm:-bottom-8 sm:-left-6 bg-[#14141F]/95 backdrop-blur-xl border border-white/[0.15] rounded-xl p-3 sm:p-3.5 shadow-[0_16px_36px_rgba(0,0,0,0.6)] text-left max-w-[200px] sm:max-w-[230px]"
          style={{ transform: canTilt ? 'translateZ(105px)' : 'none' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[#A78BFA] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Security Shield</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-mono font-bold">
              100% Passed
            </span>
          </div>

          <ul className="space-y-1 text-[10px] text-white/90">
            <li className="flex items-center gap-1.5">
              <span className="text-[#10B981]">✓</span>
              <span>HTTPS & HSTS Enforced</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[#10B981]">✓</span>
              <span>2FA Admin Auth</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[#10B981]">✓</span>
              <span>Firestore Rules Locked</span>
            </li>
          </ul>

          <div className="mt-2 pt-1.5 border-t border-white/[0.08] text-[9px] text-[#A1A1B5]">
            Protected from Day One • Zero Vulnerabilities
          </div>
        </div>
      </div>
    </div>
  );
}
