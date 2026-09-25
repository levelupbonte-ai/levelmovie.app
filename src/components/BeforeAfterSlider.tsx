import React, { useState, useRef, useCallback } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  beforeJpg: string;
  beforeAlt: string;
  afterImage: string;
  afterJpg: string;
  afterAlt: string;
  caption: string;
  aspectRatio?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  beforeJpg,
  beforeAlt,
  afterImage,
  afterJpg,
  afterAlt,
  caption,
  aspectRatio = '16/10',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(clampedPercent);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPosition(100);
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        role="slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and after website comparison slider"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className="relative select-none overflow-hidden rounded-2xl border border-white/[0.12] bg-[#14141F] shadow-2xl cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
        style={{ aspectRatio }}
      >
        {/* AFTER IMAGE (Base layer: New LevelUp Build) */}
        <picture className="absolute inset-0 w-full h-full block">
          <source srcSet={afterImage} type="image/webp" />
          <img
            src={afterJpg}
            alt={afterAlt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover block"
          />
        </picture>

        {/* AFTER BADGE */}
        <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-[#10B981]/90 text-black text-[11px] font-extrabold tracking-wide uppercase shadow-lg pointer-events-none">
          After (LevelUp Build)
        </div>

        {/* BEFORE IMAGE (Clipped overlay: Old site) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden will-change-[clip-path]"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          <picture className="absolute inset-0 w-full h-full block">
            <source srcSet={beforeImage} type="image/webp" />
            <img
              src={beforeJpg}
              alt={beforeAlt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover block"
            />
          </picture>

          {/* BEFORE BADGE */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-extrabold tracking-wide uppercase shadow-lg pointer-events-none">
            Before (Old Template)
          </div>
        </div>

        {/* SLIDER DIVIDER LINE */}
        <div
          className="absolute top-0 bottom-0 z-30 w-1 bg-[#7C3AED] shadow-[0_0_12px_rgba(124,58,237,0.8)] pointer-events-none -translate-x-1/2"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* CENTER DRAG HANDLE */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#7C3AED] border-2 border-white shadow-xl flex items-center justify-center text-white pointer-events-none">
            <svg
              className="w-4 h-4 fill-none stroke-current stroke-2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* CAPTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#A1A1B5]">
        <p className="font-normal">{caption}</p>
        <span className="text-[11px] text-[#A78BFA] shrink-0 font-medium">
          Drag slider or use ← / → arrow keys
        </span>
      </div>
    </div>
  );
}
