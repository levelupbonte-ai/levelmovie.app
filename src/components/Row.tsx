import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { BASE_URL, IMAGE_BASE_URL, filterMatureContent } from '../constants';

export function Row({
  title,
  fetchUrl,
  isLarge,
  shuffle,
  onMovieClick,
  pageSeed,
  parentalFilter,
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
  quickAction?: { icon: any; label: string; onClick: (m: any) => void };
}) {
  const [movies, setMovies] = useState<any[]>([]);
  const rowRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const fetchM = async () => {
      try {
        const reqs = [];
        for (let i = 0; i < 2; i++) {
          reqs.push(fetch(`${BASE_URL}${fetchUrl}&page=${pageSeed + i}`));
        }

        const responses = await Promise.all(reqs);
        const dataPromises = responses.map(r => r.json());
        const allData = await Promise.all(dataPromises);

        let combined: any[] = [];
        allData.forEach(d => {
          if (d.results) combined = [...combined, ...d.results];
        });

        let uniqueMovies = Array.from(new Set(combined.map(a => a.id)))
          .map(id => combined.find(a => a.id === id))
          .filter(m => m && m.poster_path);

        uniqueMovies = uniqueMovies.filter(m => m.adult !== true);
        uniqueMovies = filterMatureContent(uniqueMovies, parentalFilter);

        if (shuffle) {
          uniqueMovies = uniqueMovies.sort(() => Math.random() - 0.5);
        }

        setMovies(uniqueMovies.slice(0, 30));
      } catch (e) {}
    };
    fetchM();
  }, [fetchUrl, pageSeed, shuffle, parentalFilter]);

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

  if (movies.length === 0) return null;

  return (
    <div className="group relative ml-4 md:ml-12 animate-in fade-in duration-700">
      <h2 className="text-white/90 text-[13px] md:text-lg font-black mb-3 md:mb-5 uppercase tracking-[0.2em] border-l-4 border-[#a855f7] pl-3 md:pl-4 drop-shadow-sm flex items-center gap-3">
        {title} <ChevronRight className="w-4 h-4 text-white/30" />
      </h2>

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
          const imgClass = isLarge ? 'w-[140px] md:w-[200px] h-[210px] md:h-[300px]' : 'w-[200px] md:w-[260px] h-[112px] md:h-[146px]';
          const imgSrc = `${IMAGE_BASE_URL}${isLarge ? movie.poster_path : (movie.backdrop_path || movie.poster_path)}`;
          return (
            <div
              key={movie.id}
              className="relative flex-none movie-card-hover cursor-pointer rounded-xl overflow-hidden shadow-lg border border-white/5 bg-[#151520] hover:scale-105 transition-transform"
              onClick={() => onMovieClick(movie)}
            >
              <img className={`object-cover ${imgClass} transition-opacity duration-500`} src={imgSrc} loading="lazy" alt="" draggable="false"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4 pointer-events-none">
                <p className="text-white font-black text-[10px] md:text-sm uppercase tracking-wider truncate drop-shadow-md">{movie.title || movie.name}</p>
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
    </div>
  );
}
