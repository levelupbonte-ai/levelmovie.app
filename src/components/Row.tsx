import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { BASE_URL, getPosterImageUrl, getBackdropImageUrl, isLowDataMode, filterMatureContent, filterContentByAge } from '../constants';
import { LevelMovieImage } from './LevelMovieImage';

// In-memory cache to prevent re-fetching identical rows when re-rendering
const rowCache = new Map<string, any[]>();

export const Row = React.memo(function Row({
  title,
  fetchUrl,
  isLarge,
  shuffle,
  onMovieClick,
  pageSeed,
  parentalFilter,
  userAge,
  quickAction
}: {
  key?: React.Key;
  title: string;
  fetchUrl: string;
  isLarge: boolean;
  shuffle: boolean;
  onMovieClick: (m: any) => void;
  pageSeed: number;
  parentalFilter: boolean;
  userAge?: number | null;
  quickAction?: { icon: any; label: string; onClick: (m: any) => void };
}) {
  const [movies, setMovies] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Lazy viewport intersection: only fetch & mount when near screen (saves huge CPU/RAM)
  useEffect(() => {
    if (!containerRef.current || isVisible) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '350px 0px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const cacheKey = `${fetchUrl}_${pageSeed}_${parentalFilter}_${userAge || 0}`;
    if (rowCache.has(cacheKey)) {
      setMovies(rowCache.get(cacheKey)!);
      return;
    }

    let isMounted = true;
    const fetchM = async () => {
      try {
        const res = await fetch(`${BASE_URL}${fetchUrl}&page=${pageSeed}`);
        const data = await res.json();

        let list = (data.results || []).filter((m: any) => m && m.poster_path && m.adult !== true);
        list = filterMatureContent(list, parentalFilter);
        list = filterContentByAge(list, userAge);

        if (shuffle) {
          list = [...list].sort(() => Math.random() - 0.5);
        }

        const finalMovies = list.slice(0, 20);
        rowCache.set(cacheKey, finalMovies);

        if (isMounted) {
          setMovies(finalMovies);
        }
      } catch (e) {}
    };

    fetchM();
    return () => { isMounted = false; };
  }, [isVisible, fetchUrl, pageSeed, shuffle, parentalFilter, userAge]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rowRef.current) return;
    isDownRef.current = true;
    startXRef.current = e.pageX - rowRef.current.offsetLeft;
    scrollLeftRef.current = rowRef.current.scrollLeft;
  };
  const handleMouseLeave = () => { isDownRef.current = false; };
  const handleMouseUp = () => { isDownRef.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current || !rowRef.current) return;
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    rowRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const scrollAction = (direction: 'left' | 'right') => {
    const scrollAmt = 400;
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: direction === 'left' ? -scrollAmt : scrollAmt, behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="group relative ml-4 md:ml-12 min-h-[140px] md:min-h-[180px]">
      <h2 className="text-white/90 text-[13px] md:text-lg font-black mb-3 md:mb-5 uppercase tracking-[0.2em] border-l-4 border-[#a855f7] pl-3 md:pl-4 drop-shadow-sm flex items-center gap-3">
        {title} <ChevronRight className="w-4 h-4 text-white/30" />
      </h2>

      {movies.length > 0 && (
        <>
          <div
            onClick={() => scrollAction('left')}
            className="absolute left-0 top-12 bottom-0 z-40 w-10 bg-gradient-to-r from-[#060608] via-[#060608]/80 to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-start cursor-pointer transition-opacity duration-300 -ml-4 md:-ml-12 hidden md:flex outline-none"
          >
            <ChevronLeft className="text-white hover:text-[#a855f7] transition-colors w-10 h-10 ml-1 drop-shadow-lg" />
          </div>

          <div
            ref={rowRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex overflow-y-hidden overflow-x-scroll py-2 md:py-4 space-x-3 md:space-x-5 no-scrollbar pr-8 cursor-grab active:cursor-grabbing"
          >
            {movies.map(movie => {
              const imgClass = isLarge ? 'w-[130px] sm:w-[150px] md:w-[190px] h-[195px] sm:h-[225px] md:h-[285px]' : 'w-[180px] sm:w-[210px] md:w-[250px] h-[100px] sm:h-[118px] md:h-[140px]';
              const imgSrc = isLarge ? getPosterImageUrl(movie.poster_path) : (getBackdropImageUrl(movie.backdrop_path || movie.poster_path));
              const movieTitle = movie.title || movie.name || 'LevelMovie';
              return (
                <div
                  key={movie.id}
                  className="relative flex-none cursor-pointer rounded-xl overflow-hidden shadow-lg border border-white/5 bg-[#12131c] hover:scale-105 transition-transform"
                  onClick={() => onMovieClick(movie)}
                >
                  <LevelMovieImage
                    src={imgSrc}
                    alt={movieTitle}
                    fallbackTitle={movieTitle}
                    brandTheme="purple"
                    className={`object-cover ${imgClass}`}
                    containerClassName={imgClass}
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 md:p-4 pointer-events-none">
                    <p className="text-white font-black text-[10px] md:text-sm uppercase tracking-wider truncate drop-shadow-md">{movieTitle}</p>
                    <div className="flex items-center justify-between gap-2 mt-1 md:mt-2">
                      <span className="text-[#a855f7] font-bold text-[9px] md:text-[10px] flex items-center gap-1">
                        <Star className="w-3 h-3" /> {movie.vote_average?.toFixed(1)}
                      </span>
                      {quickAction && (
                        <button
                          onClick={(e) => { e.stopPropagation(); quickAction.onClick(movie); }}
                          className="pointer-events-auto flex items-center gap-1 bg-[#a855f7] hover:bg-purple-500 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 md:px-2.5 md:py-1.5 rounded-lg shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all active:scale-95 outline-none cursor-pointer"
                        >
                          <quickAction.icon className="w-3 h-3" /> <span className="hidden sm:inline">{quickAction.label}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            onClick={() => scrollAction('right')}
            className="absolute right-0 top-12 bottom-0 z-40 w-12 bg-gradient-to-l from-[#060608] via-[#060608]/80 to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-end cursor-pointer transition-opacity duration-300 hidden md:flex outline-none"
          >
            <ChevronRight className="text-white hover:text-[#a855f7] transition-colors w-10 h-10 mr-2 drop-shadow-lg" />
          </div>
        </>
      )}
    </div>
  );
});

