import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Clapperboard, Play } from 'lucide-react';
import { BASE_URL, IMAGE_BASE_URL, API_KEY, filterMatureContent, seededShuffle } from '../constants';

export function AlgoRow({
  title,
  fetchUrl,
  seed,
  badge,
  countdown,
  onMovieClick,
  parentalFilter
}: {
  key?: React.Key;
  title: string;
  fetchUrl: string;
  seed: number;
  badge?: string;
  countdown?: string;
  onMovieClick: (m: any) => void;
  parentalFilter: boolean;
}) {
  const [movies, setMovies] = useState<any[]>([]);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchM = async () => {
      try {
        const reqs = [1, 2].map(p => fetch(`${BASE_URL}${fetchUrl}&page=${p}`));
        const responses = await Promise.all(reqs);
        const allData = await Promise.all(responses.map(r => r.json()));

        let combined: any[] = [];
        allData.forEach(d => { if (d.results) combined = [...combined, ...d.results]; });

        let unique = Array.from(new Set(combined.map(a => a.id)))
          .map(id => combined.find(a => a.id === id))
          .filter(m => m && m.poster_path && m.backdrop_path);

        unique = unique.filter(m => m.adult !== true);
        unique = filterMatureContent(unique, parentalFilter);
        unique = seededShuffle(unique, seed);

        setMovies(unique.slice(0, 15));
      } catch (e) {}
    };
    fetchM();
  }, [fetchUrl, seed, parentalFilter]);

  const scrollAction = (direction: 'left' | 'right') => {
    if (rowRef.current) rowRef.current.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  if (movies.length === 0) return null;

  return (
    <div className="group relative ml-4 md:ml-12 animate-in fade-in duration-700">
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

      <div
        onClick={() => scrollAction('left')}
        className="absolute left-0 top-16 bottom-0 z-40 w-10 bg-gradient-to-r from-[#060608] via-[#060608]/80 to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-start cursor-pointer transition-opacity duration-300 -ml-4 md:-ml-12 hidden md:flex outline-none"
      >
        <ChevronLeft className="text-white hover:text-[#a855f7] transition-colors w-10 h-10 ml-1 drop-shadow-lg" />
      </div>

      <div ref={rowRef} className="flex overflow-y-hidden overflow-x-scroll py-2 space-x-3 md:space-x-5 no-scrollbar pr-8">
        {movies.map(movie => (
          <div
            key={movie.id}
            className="relative flex-none cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-[#a855f7]/20 bg-[#151520] hover:scale-105 transition-transform w-[240px] md:w-[320px] h-[135px] md:h-[180px]"
            onClick={() => onMovieClick(movie)}
          >
            <img className="object-cover w-full h-full" src={`${IMAGE_BASE_URL}${movie.backdrop_path}`} loading="lazy" draggable="false" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent flex flex-col justify-end p-3">
              <p className="text-white font-black text-[11px] md:text-sm uppercase tracking-wider truncate drop-shadow-md">{movie.title || movie.name}</p>
              <span className="text-[#a855f7] font-bold text-[9px] md:text-[10px] mt-0.5 flex items-center gap-1">
                <Star className="w-3 h-3" /> {movie.vote_average?.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        onClick={() => scrollAction('right')}
        className="absolute right-0 top-16 bottom-0 z-40 w-12 bg-gradient-to-l from-[#060608] via-[#060608]/80 to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-end cursor-pointer transition-opacity duration-300 hidden md:flex outline-none"
      >
        <ChevronRight className="text-white hover:text-[#a855f7] transition-colors w-10 h-10 mr-2 drop-shadow-lg" />
      </div>
    </div>
  );
}

export function TrailerRow({
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

  useEffect(() => {
    let cancelled = false;
    const fetchM = async () => {
      try {
        const res = await fetch(`${BASE_URL}${fetchUrl}&page=1`);
        const data = await res.json();
        let results = (data.results || []).filter((m: any) => m.backdrop_path && m.adult !== true);
        results = filterMatureContent(results, parentalFilter);
        results = seededShuffle(results, seed).slice(0, 8);

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

        if (!cancelled) setItems(withTrailers.filter(Boolean).slice(0, 6));
      } catch (e) {}
    };
    fetchM();
    return () => { cancelled = true; };
  }, [fetchUrl, seed, parentalFilter, lang]);

  if (items.length === 0) return null;

  return (
    <div className="relative ml-4 md:ml-12 animate-in fade-in duration-700">
      <h2 className="text-white/90 text-[13px] md:text-lg font-black mb-3 md:mb-5 uppercase tracking-[0.2em] border-l-4 border-[#ec4899] pl-3 md:pl-4 drop-shadow-sm flex items-center gap-2">
        {title} <Clapperboard className="w-4 h-4 text-[#ec4899]" />
      </h2>
      <div className="flex overflow-x-scroll py-2 space-x-3 md:space-x-5 no-scrollbar pr-8">
        {items.map(m => (
          <div
            key={m.id}
            className="relative flex-none cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-[#ec4899]/20 bg-[#151520] hover:scale-105 transition-transform w-[200px] md:w-[260px] aspect-video group"
            onClick={() => onPlayTrailer(m)}
          >
            <img className="object-cover w-full h-full opacity-70 group-hover:opacity-40 transition-opacity" src={`${IMAGE_BASE_URL}${m.backdrop_path}`} loading="lazy" draggable="false" alt="" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#ec4899]/90 group-hover:border-[#ec4899] transition-all shadow-lg backdrop-blur-sm">
                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
              </div>
            </div>
            <p className="absolute bottom-2 left-2 right-2 text-white font-bold text-[10px] md:text-[11px] truncate drop-shadow-md">{m.title || m.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
