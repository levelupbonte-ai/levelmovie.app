import React, { useState, useEffect } from 'react';
import { LevelMovieLogo } from '../constants';

interface LevelMovieImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  containerClassName?: string;
  fallbackTitle?: string;
  brandTheme?: 'purple' | 'red' | 'cyan';
  showLogoBadge?: boolean;
  loading?: 'lazy' | 'eager';
  draggable?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export const LevelMovieImage: React.FC<LevelMovieImageProps> = ({
  src,
  alt = 'LevelMovie',
  className = 'w-full h-full object-cover',
  containerClassName = 'w-full h-full relative overflow-hidden',
  fallbackTitle,
  brandTheme = 'purple',
  showLogoBadge = false,
  loading = 'lazy',
  draggable = false,
  onClick
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Optimize TMDB image resolution dynamically when Low Data Mode is active
  const resolvedSrc = React.useMemo(() => {
    if (!src) return src;
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('low-data-mode')) {
      return src
        .replace('/t/p/w500', '/t/p/w185')
        .replace('/t/p/w300', '/t/p/w185')
        .replace('/t/p/original', '/t/p/w780');
    }
    return src;
  }, [src]);

  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [resolvedSrc]);

  const brandColor = brandTheme === 'red' ? '#ef4444' : brandTheme === 'cyan' ? '#06b6d4' : '#a855f7';
  const shouldShowFallback = !resolvedSrc || hasError;

  if (shouldShowFallback) {
    return (
      <div
        className={`${containerClassName} bg-[#0b0c13] flex items-center justify-center select-none border border-white/5`}
        onClick={onClick}
      >
        <LevelMovieLogo className="w-10 h-10 max-w-[45%] max-h-[45%] opacity-40 transition-opacity duration-300 group-hover:opacity-70" color={brandColor} />
      </div>
    );
  }

  return (
    <div className={containerClassName} onClick={onClick}>
      <img
        src={resolvedSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        draggable={draggable}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#0d0e18] flex items-center justify-center pointer-events-none">
          <LevelMovieLogo className="w-6 h-6 opacity-20" color={brandColor} />
        </div>
      )}
    </div>
  );
};
