import React, { useEffect } from 'react';
import { Play, Info, Star } from 'lucide-react';
import { BASE_URL, getBackdropImageUrl, LevelMovieLogo, filterMatureContent, filterContentByAge } from '../constants';

export function Banner({ url, onPlay, onInfo, setHero, heroMovie, t, pageSeed, parentalFilter, userAge, lowDataMode = false }: {
  url: string;
  onPlay: () => void;
  onInfo: () => void;
  setHero: (m: any) => void;
  heroMovie: any;
  t: any;
  pageSeed: number;
  parentalFilter: boolean;
  userAge?: number | null;
  lowDataMode?: boolean;
}) {
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const req1 = fetch(`${BASE_URL}${url}&page=${pageSeed}`);
        const req2 = fetch(`${BASE_URL}${url}&page=${pageSeed + 1}`);
        const [res1, res2] = await Promise.all([req1, req2]);
        const data1 = await res1.json();
        const data2 = await res2.json();
        const combined = [...(data1.results || []), ...(data2.results || [])];

        let valids = combined.filter((m: any) => m.backdrop_path);
        valids = valids.filter((m: any) => m.adult !== true);
        const filtered = filterMatureContent(valids, parentalFilter);
        const ageFiltered = filterContentByAge(filtered.length > 0 ? filtered : valids, userAge);
        if (ageFiltered.length > 0) valids = ageFiltered;

        setHero(valids[Math.floor(Math.random() * valids.length)]);
      } catch (e) {}
    };
    fetchMovie();
  }, [url, pageSeed, parentalFilter, userAge, setHero]);

  if (!heroMovie) return <div className="h-[80vh] w-full bg-[#060608] animate-pulse"></div>;

  return (
    <header
      className="relative h-[65vh] md:h-[80vh] min-h-[520px] text-white transition-all duration-700 bg-[#060608] flex flex-col justify-end pt-24 md:pt-32"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: '50% 20%',
        backgroundImage: `url("${getBackdropImageUrl(heroMovie.backdrop_path, lowDataMode, true)}")`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#060608] via-[#060608]/75 to-transparent w-full md:w-[80%]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-[#060608]/50 h-full"></div>

      <div className="relative z-10 flex flex-col justify-end h-full px-4 md:px-14 pb-10 md:pb-20 max-w-4xl w-full">
        <div className="flex items-center space-x-3 mb-2 md:mb-3 animate-in slide-in-from-left duration-500">
          <span className="text-white/80 font-black tracking-[0.3em] text-[9px] md:text-[11px] uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10 shadow-sm flex items-center">
            <LevelMovieLogo className="w-3 h-3 text-[#a855f7] inline mr-1" /> {t.featured}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black pb-1.5 tracking-tight text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.9)] leading-tight animate-in slide-in-from-bottom duration-700 line-clamp-2 max-w-3xl">
          {heroMovie.title || heroMovie.name}
        </h1>

        <div className="flex items-center gap-3 mt-1 mb-3 text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest">
          <span className="text-green-400 border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded shadow-sm">{t.match}</span>
          <span>{(heroMovie.release_date || heroMovie.first_air_date || '').substring(0, 4)}</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#a855f7]" /> {heroMovie.vote_average?.toFixed(1)}</span>
        </div>

        <p className="w-full text-[12px] md:text-[15px] text-white/80 font-medium leading-relaxed max-w-2xl text-justify drop-shadow-lg animate-in fade-in duration-1000 delay-300 line-clamp-3 md:line-clamp-4">
          {heroMovie.overview}
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-5 md:mt-6">
          <button
            onClick={onPlay}
            className="flex-1 items-center justify-center flex gap-2 px-6 py-3.5 bg-white text-black rounded-xl text-[11px] md:text-[12px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 outline-none cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" /> <span>{t.play}</span>
          </button>
          <button
            onClick={onInfo}
            className="flex-1 items-center justify-center flex gap-2 px-6 py-3.5 bg-white/10 border border-white/20 rounded-xl text-[11px] md:text-[12px] font-bold text-white uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95 backdrop-blur-md outline-none cursor-pointer"
          >
            <Info className="w-4 h-4" /> <span>{t.details}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
