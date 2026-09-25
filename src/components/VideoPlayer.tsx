import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  webmSrc: string;
  mp4Src: string;
  posterWebp: string;
  posterJpg: string;
  alt: string;
  caption?: string;
  className?: string;
}

export default function VideoPlayer({
  webmSrc,
  mp4Src,
  posterWebp,
  posterJpg,
  alt,
  caption,
  className = '',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canLoadVideo, setCanLoadVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isIntersectingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check Save-Data and slow connection
    const nav = navigator as unknown as {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
    };

    const isSaveData = Boolean(nav.connection?.saveData);
    const isSlowConnection =
      nav.connection?.effectiveType === 'slow-2g' || nav.connection?.effectiveType === '2g';

    if (prefersReducedMotion || isSaveData || isSlowConnection) {
      setCanLoadVideo(false);
      return;
    }

    setCanLoadVideo(true);
  }, []);

  useEffect(() => {
    if (!canLoadVideo || !containerRef.current) return;

    const video = videoRef.current;
    if (!video) return;

    // IntersectionObserver to only play while visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersectingRef.current = entry.isIntersecting;
          if (entry.isIntersecting && !document.hidden) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                // Autoplay blocked or interrupted
                setIsPlaying(false);
              });
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(containerRef.current);

    // Pause when tab is hidden or minimized
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        setIsPlaying(false);
      } else if (isIntersectingRef.current) {
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [canLoadVideo]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {canLoadVideo ? (
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"
          poster={posterWebp}
          aria-label={alt}
          className="w-full h-full object-cover block"
        >
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src} type="video/mp4" />
          {/* Fallback to poster image if video fails to play */}
          <picture>
            <source srcSet={posterWebp} type="image/webp" />
            <img src={posterJpg} alt={alt} className="w-full h-full object-cover block" />
          </picture>
        </video>
      ) : (
        /* Reduced motion / Save-Data / Slow connection fallback */
        <picture className="w-full h-full block">
          <source srcSet={posterWebp} type="image/webp" />
          <img
            src={posterJpg}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover block"
          />
        </picture>
      )}

      {caption && (
        <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm text-[11px] text-[#A1A1B5] border border-white/[0.08] flex items-center justify-between pointer-events-none">
          <span>{caption}</span>
          {canLoadVideo && (
            <span className="text-[10px] text-[#A78BFA] font-mono">
              {isPlaying ? '● LIVE' : 'PAUSED'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
