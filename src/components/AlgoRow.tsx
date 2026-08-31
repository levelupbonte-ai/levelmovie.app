import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Clapperboard, Play } from 'lucide-react';
import { BASE_URL, getPosterImageUrl, getBackdropImageUrl, isLowDataMode, API_KEY, filterMatureContent, filterContentByAge, seededShuffle } from '../constants';
import { LevelMovieImage } from './LevelMovieImage';

const algoCache = new Map<string, any[]>();
const trailerCache = new Map<string, any[]>();

export const AlgoRow = React.memo(function AlgoRow({
  title,
  fetchUrl,
  seed,
  badge,
  countdown,
  onMovieClick,
  parentalFilter,
  userAge
}: {
  key?: React.Key;
  title: string;
  fetchUrl: string;
  seed: number;
  badge?: string;
  countdown?: string;
  onMovieClick: (m: any) => void;
  parentalFilter: boolean;
  userAge?: number | null;
}) {
  const [movies, setMovies] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

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
      { rootMargin: '300px 0px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const cacheKey = `${fetchUrl}_${seed}_${parentalFilter}_${userAge || 0}`;
    if (algoCache.has(cacheKey)) {
      setMovies(algoCache.get(cacheKey)!);
      return;
    }

    let isMounted = true;
    const fetchM = async () => {
      try {
        const res = await fetch(`${BASE_URL}${fetchUrl}&page=1`);
        const data = await res.json();

        let unique = (data.results || []).filter((m: any) => m && m.poster_path && m.backdrop_path && m.adult !== true);
        unique = filterMatureContent(unique, parentalFilter);
        unique = filterContentByAge(unique, userAge);
        unique = seededShuffle(unique, seed);

        const final = unique.slice(0, 15);
        algoCache.set(cacheKey, final);
        if (isMounted) setMovies(final);
      } catch (e) {}
    };
    fetchM();
    return () => { isMounted = false; };
  }, [isVisible, fetchUrl, seed, parentalFilter, userAge]);

  const scrollAction = (direction: 'left' | 'right') => {
    if (rowRef.current) rowRef.current.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="group relative ml-4 md:ml-12 min-h-[140px] md:min-h-[180px]">
      <div className="flex items-center justify-between mb-3 md:mb-5 pr-4 md:pr-12">
        <h2 className="text-white/90 text-[13px] md:text-lg font-black uppercase tracking-[0.2em] border-l-4 border-[#a855f7] pl-3 md:pl-4 drop-shadow-sm flex items-center gap-3">
          {title}
          {badge && (
            <span className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              {badge}
            </span>
          )}
        </h2>
        {countdown && <span className="text-[9px] md:text-[10px] text-white/30 font-bold uppercase tracking-widest shrink-0 hidden sm:inline">{countdown}</span>}
      </div>

      {movies.length > 0 && (
        <>
          <div
            onClick={() => scrollAction('left')}
            className="absolute left-0 top-16 bottom-0 z-40 w-10 bg-gradient-to-r from-[#060608] via-[#060608]/80 to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-start cursor-pointer transition-opacity duration-300 -ml-4 md:-ml-12 hidden md:flex outline-none"
          >
            <ChevronLeft className="text-white hover:text-[#a855f7] transition-colors w-10 h-10 ml-1 drop-shadow-lg" />
          </div>

          <div ref={rowRef} className="flex overflow-y-hidden overflow-x-scroll py-2 space-x-3 md:space-x-5 no-scrollbar pr-8">
            {movies.map(movie => {
              const movieTitle = movie.title || movie.name || 'LevelMovie';
              return (
                <div
                  key={movie.id}
                  className="relative flex-none cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-[#a855f7]/20 bg-[#151520] hover:scale-105 transition-transform w-[220px] sm:w-[260px] md:w-[320px] h-[124px] sm:h-[146px] md:h-[180px]"
                  onClick={() => onMovieClick(movie)}
                >
                  <LevelMovieImage
                    src={getBackdropImageUrl(movie.backdrop_path || movie.poster_path)}
                    alt={movieTitle}
                    fallbackTitle={movieTitle}
                    brandTheme="purple"
                    className="object-cover w-full h-full"
                    containerClassName="w-full h-full"
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent flex flex-col justify-end p-3 pointer-events-none">
                    <p className="text-white font-black text-[11px] md:text-sm uppercase tracking-wider truncate drop-shadow-md">{movieTitle}</p>
                    <span className="text-[#a855f7] font-bold text-[9px] md:text-[10px] mt-0.5 flex items-center gap-1">
                      <Star className="w-3 h-3" /> {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            onClick={() => scrollAction('right')}
            className="absolute right-0 top-16 bottom-0 z-40 w-12 bg-gradient-to-l from-[#060608] via-[#060608]/80 to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-end cursor-pointer transition-opacity duration-300 hidden md:flex outline-none"
          >
            <ChevronRight className="text-white hover:text-[#a855f7] transition-colors w-10 h-10 mr-2 drop-shadow-lg" />
          </div>
        </>
      )}
    </div>
  );
});

export const TrailerRow = React.memo(function TrailerRow({
  title,
  fetchUrl,
  seed,
  onPlayTrailer,
  parentalFilter,
  lang
}: {
  key?: React.Key;
  title: string;
  fetchUrl: string;
  seed: number;
  onPlayTrailer: (m: any) => void;
  parentalFilter: boolean;
  lang: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      { rootMargin: '300px 0px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const cacheKey = `${fetchUrl}_${seed}_${parentalFilter}_${lang}`;
    if (trailerCache.has(cacheKey)) {
      setItems(trailerCache.get(cacheKey)!);
      return;
    }

    let cancelled = false;
    const fetchM = async () => {
      try {
        const res = await fetch(`${BASE_URL}${fetchUrl}&page=1`);
        const data = await res.json();
        let results = (data.results || []).filter((m: any) => m.backdrop_path && m.adult !== true);
        results = filterMatureContent(results, parentalFilter);
        results = seededShuffle(results, seed).slice(0, 6);

        const withTrailers = await Promise.all(
          results.map(async (m: any) => {
            try {
              const mediaType = m.first_air_date !== undefined ? 'tv' : 'movie';
              const vRes = await fetch(`${BASE_URL}/${mediaType}/${m.id}/videos?api_key=${API_KEY}&language=${lang}`);
              const vData = await vRes.json();
              let trailer = vData.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
              if (!trailer) {
                const vResEn = await fetch(`${BASE_URL}/${mediaType}/${m.id}/videos?api_key=${API_KEY}&language=en-US`);
                const vDataEn = await vResEn.json();
                trailer = vDataEn.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
              }
              return trailer ? { ...m, _trailerKey: trailer.key } : null;
            } catch (e) {
              return null;
            }
          })
        );

        const filtered = withTrailers.filter(Boolean).slice(0, 6);
        trailerCache.set(cacheKey, filtered);
        if (!cancelled) setItems(filtered);
      } catch (e) {}
    };
    fetchM();
    return () => { cancelled = true; };
  }, [isVisible, fetchUrl, seed, parentalFilter, lang]);

  return (
    <div ref={containerRef} className="relative ml-4 md:ml-12 min-h-[140px] md:min-h-[180px]">
      <h2 className="text-white/90 text-[13px] md:text-lg font-black mb-3 md:mb-5 uppercase tracking-[0.2em] border-l-4 border-[#ec4899] pl-3 md:pl-4 drop-shadow-sm flex items-center gap-2">
        {title} <Clapperboard className="w-4 h-4 text-[#ec4899]" />
      </h2>
      {items.length > 0 && (
        <div className="flex overflow-x-scroll py-2 space-x-3 md:space-x-5 no-scrollbar pr-8">
          {items.map(m => {
            const itemTitle = m.title || m.name || 'LevelMovie';
            return (
              <div
                key={m.id}
                className="relative flex-none cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-[#ec4899]/20 bg-[#151520] hover:scale-105 transition-transform w-[190px] sm:w-[220px] md:w-[260px] aspect-video group"
                onClick={() => onPlayTrailer(m)}
              >
                <LevelMovieImage
                  src={getBackdropImageUrl(m.backdrop_path || m.poster_path)}
                  alt={itemTitle}
                  fallbackTitle={itemTitle}
                  brandTheme="purple"
                  className="object-cover w-full h-full opacity-70 group-hover:opacity-40 transition-opacity"
                  containerClassName="w-full h-full"
                  loading="lazy"
                  draggable={false}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#ec4899]/90 group-hover:border-[#ec4899] transition-all shadow-lg backdrop-blur-sm">
                    <Play className="w-4 h-4 md:w-5 md:h-5 fill-white text-white ml-0.5" />
                  </div>
                </div>
                <p className="absolute bottom-2 left-2 right-2 text-white font-bold text-[10px] md:text-[11px] truncate drop-shadow-md pointer-events-none">{itemTitle}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

