import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LevelMovieLogo } from '../../constants';
import { LevelMovieImage } from '../LevelMovieImage';
import {
  REAL_POPULAR_ANIMES,
  REAL_ACTION_ANIMES,
  REAL_FANTASY_ANIMES,
  REAL_ANIME_MOVIES
} from '../../data/animeData';
import {
  Play, Info, Search, X, Star, ChevronLeft, ChevronRight,
  Bookmark, Home, Tv, Clapperboard, Users, Flame, Calendar,
  Plus, CheckCircle, Bell, TrendingUp, Award, Compass,
  Loader2, Eye, Trophy, Heart, AlignLeft, Filter, Sparkles, LayoutGrid,
  BellRing, Mic2, Settings, User, PlayCircle, Subtitles, HardDrive, LogOut,
  ShieldCheck, KeyRound, EyeOff, AlertTriangle, Server, Share2, Film, Check,
  RotateCw, Clock, Zap, Radio, Sparkle, Swords, Wand2, Smile, Skull,
  Bot, Coffee, Ghost, Theater, Map, Activity, Crown, Dumbbell, BookOpen, Layers
} from 'lucide-react';

interface LevelAnimeAppProps {
  lang?: string;
  user?: any;
  userPhoto?: string | null;
  userName?: string;
  userEmail?: string;
  userAge?: number | null;
  activeTab?: 'home' | 'explore' | 'releases';
  onTabChange?: (tab: 'home' | 'explore' | 'releases') => void;
  onOpenMovie?: (movie: any, mode?: string) => void;
  showToast?: (msg: string, type?: string) => void;
  onNavigateHome?: () => void;
}

const formatMetric = (num: number) => {
  if (!num) return 'N/A';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Clean SVG Icon mapping for genres
const ANIME_GENRES = [
  { id: 1, name: 'Combats & Action', iconKey: 'swords', color: 'text-red-400' },
  { id: 10, name: 'Fantasy & Isekai', iconKey: 'wand2', color: 'text-amber-400' },
  { id: 2, name: 'Aventure & Quêtes', iconKey: 'compass', color: 'text-emerald-400' },
  { id: 14, name: 'Dark Fantasy & Horreur', iconKey: 'skull', color: 'text-rose-400' },
  { id: 37, name: 'Surnaturel & Magie', iconKey: 'zap', color: 'text-purple-400' },
  { id: 24, name: 'Sci-Fi & Mecha', iconKey: 'bot', color: 'text-cyan-400' },
  { id: 22, name: 'Romance & Drame', iconKey: 'heart', color: 'text-pink-400' },
  { id: 30, name: 'Sports & Tournois', iconKey: 'trophy', color: 'text-yellow-400' },
  { id: 7, name: 'Mystère & Thriller', iconKey: 'search', color: 'text-blue-400' },
  { id: 4, name: 'Comédie & Humour', iconKey: 'smile', color: 'text-orange-400' },
  { id: 36, name: 'Tranche de vie', iconKey: 'coffee', color: 'text-teal-400' },
  { id: 8, name: 'Psychologique', iconKey: 'theater', color: 'text-indigo-400' },
];

const renderGenreSvg = (key: string, className = "w-4 h-4") => {
  switch (key) {
    case 'swords': return <Swords className={className} />;
    case 'wand2': return <Wand2 className={className} />;
    case 'compass': return <Compass className={className} />;
    case 'skull': return <Skull className={className} />;
    case 'zap': return <Zap className={className} />;
    case 'bot': return <Bot className={className} />;
    case 'heart': return <Heart className={className} />;
    case 'trophy': return <Trophy className={className} />;
    case 'search': return <Search className={className} />;
    case 'smile': return <Smile className={className} />;
    case 'coffee': return <Coffee className={className} />;
    case 'theater': return <Theater className={className} />;
    default: return <Sparkles className={className} />;
  }
};

const getDayKeyFromDate = (date: Date): string => {
  const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[dayIndex];
};

const WEEK_DAYS = [
  { id: 'monday', label: 'Lundi', labelEn: 'Monday', short: 'LUN', num: 1 },
  { id: 'tuesday', label: 'Mardi', labelEn: 'Tuesday', short: 'MAR', num: 2 },
  { id: 'wednesday', label: 'Mercredi', labelEn: 'Wednesday', short: 'MER', num: 3 },
  { id: 'thursday', label: 'Jeudi', labelEn: 'Thursday', short: 'JEU', num: 4 },
  { id: 'friday', label: 'Vendredi', labelEn: 'Friday', short: 'VEN', num: 5 },
  { id: 'saturday', label: 'Samedi', labelEn: 'Saturday', short: 'SAM', num: 6 },
  { id: 'sunday', label: 'Dimanche', labelEn: 'Sunday', short: 'DIM', num: 0 }
];

// -------------------------------------------------------------
// STANDALONE SUB-COMPONENT: ANIME CARD
// -------------------------------------------------------------
interface AnimeCardProps {
  anime: any;
  onOpenAnime: (anime: any, mode?: 'info' | 'play' | 'trailer') => void;
  onToggleWatchlist?: (anime: any, e?: React.MouseEvent) => void;
  isWatchlisted?: boolean;
  className?: string;
  aspectClass?: string;
}

const AnimeCard: React.FC<AnimeCardProps> = React.memo(({
  anime,
  onOpenAnime,
  onToggleWatchlist,
  isWatchlisted = false,
  className = "w-[135px] sm:w-[155px] md:w-[180px] lg:w-[200px]",
  aspectClass = "aspect-[2/3]"
}) => {
  const imageUrl = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || anime.images?.webp?.image_url;
  const title = anime.title_english || anime.title || 'Anime';
  const score = anime.score ? anime.score.toFixed(1) : null;
  const year = anime.year || (anime.aired?.prop?.from?.year) || '';
  const episodes = anime.episodes ? `${anime.episodes} EPS` : (anime.airing ? 'SIMULCAST' : 'HD');

  return (
    <div
      onClick={() => onOpenAnime(anime, 'info')}
      className={`group relative flex-none cursor-pointer rounded-xl overflow-hidden shadow-xl border border-white/5 bg-[#121218] hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-950/30 transition-all duration-300 ${className}`}
    >
      <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#0d0d14]`}>
        <LevelMovieImage
          src={imageUrl}
          alt={title}
          fallbackTitle={title}
          brandTheme="red"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          containerClassName="w-full h-full"
          loading="lazy"
          draggable={false}
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
          <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-green-400 text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow">
            VF / VOSTFR
          </span>
          {score && (
            <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-amber-400 text-[8px] sm:text-[9px] font-bold flex items-center gap-0.5 shadow">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>{score}</span>
            </span>
          )}
        </div>

        {/* Hover / Active Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 sm:p-3 z-20">
          <div className="flex items-center gap-1.5 text-[9px] text-white/70 font-mono mb-1">
            <span className="px-1.5 py-0.2 rounded bg-red-600/80 text-white font-black text-[8px] uppercase">
              {episodes}
            </span>
            {year && <span>{year}</span>}
          </div>

          <h3 className="text-white font-bold text-[11px] sm:text-xs uppercase line-clamp-2 leading-tight drop-shadow-md mb-2">
            {title}
          </h3>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onOpenAnime(anime, 'play')}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Play className="w-2.5 h-2.5 fill-white" />
              <span>Voir</span>
            </button>

            <button
              onClick={() => onOpenAnime(anime, 'info')}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Détails"
            >
              <Info className="w-3 h-3" />
            </button>

            {onToggleWatchlist && (
              <button
                onClick={(e) => onToggleWatchlist(anime, e)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isWatchlisted
                    ? 'bg-red-600/20 border-red-500 text-red-400'
                    : 'bg-white/10 hover:bg-white/20 border-white/10 text-white/70 hover:text-white'
                }`}
                title="Favoris"
              >
                <Bookmark className={`w-3 h-3 ${isWatchlisted ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// -------------------------------------------------------------
// STANDALONE SUB-COMPONENT: TOP 10 ROW
// -------------------------------------------------------------
interface Top10RowProps {
  title: string;
  animes: any[];
  onOpenAnime: (anime: any, mode?: 'info' | 'play' | 'trailer') => void;
  onToggleWatchlist?: (anime: any, e?: React.MouseEvent) => void;
  isAddedToWatchlist?: (id: number) => boolean;
}

const Top10Row: React.FC<Top10RowProps> = ({ title, animes, onOpenAnime, onToggleWatchlist, isAddedToWatchlist }) => {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const scrollAction = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmt = window.innerWidth > 768 ? 600 : 350;
      rowRef.current.scrollBy({ left: direction === 'left' ? -scrollAmt : scrollAmt, behavior: 'smooth' });
    }
  };

  if (!animes || animes.length === 0) return null;

  return (
    <div className="group relative mb-10 mt-6 ml-4 md:ml-12">
      <div className="flex items-center justify-between mr-4 md:mr-12 mb-3">
        <h2 className="text-white text-sm md:text-lg font-black uppercase tracking-[0.2em] border-l-4 border-red-500 pl-3 drop-shadow-sm flex items-center gap-2.5">
          <span>{title}</span>
          <TrendingUp className="w-4 h-4 text-red-500" />
        </h2>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600/10 border border-red-500/20 text-red-400">
          TOP 10 POPULAIRE
        </span>
      </div>

      <div
        onClick={() => scrollAction('left')}
        className="absolute left-0 top-12 bottom-0 z-30 w-12 bg-gradient-to-r from-[#060608] via-[#060608]/90 to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-start cursor-pointer transition-opacity -ml-4 md:-ml-12 hidden md:flex outline-none"
      >
        <ChevronLeft className="text-white hover:text-red-400 transition-colors w-8 h-8 ml-2" />
      </div>

      <div
        ref={rowRef}
        className="flex overflow-x-auto py-6 space-x-8 md:space-x-12 no-scrollbar pl-8 md:pl-16 pr-12 scroll-smooth items-end cursor-grab active:cursor-grabbing"
      >
        {animes.slice(0, 10).map((anime, index) => (
          <div
            key={`top10-${anime.mal_id}-${index}`}
            className="relative flex-none cursor-pointer group flex items-end w-[135px] sm:w-[155px] md:w-[180px] lg:w-[200px]"
          >
            <span className="text-[85px] sm:text-[105px] md:text-[130px] leading-none font-black absolute -left-7 md:-left-12 -bottom-2.5 z-20 pointer-events-none drop-shadow-2xl italic tracking-tighter text-transparent [-webkit-text-stroke:2px_#ef4444]">
              {index + 1}
            </span>
            <div className="w-full z-10">
              <AnimeCard
                anime={anime}
                onOpenAnime={onOpenAnime}
                onToggleWatchlist={onToggleWatchlist}
                isWatchlisted={isAddedToWatchlist ? isAddedToWatchlist(anime.mal_id) : false}
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>

      <div
        onClick={() => scrollAction('right')}
        className="absolute right-0 top-12 bottom-0 z-30 w-12 bg-gradient-to-l from-[#060608] via-[#060608]/90 to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-end cursor-pointer transition-opacity hidden md:flex outline-none"
      >
        <ChevronRight className="text-white hover:text-red-400 transition-colors w-8 h-8 mr-2" />
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// STANDALONE SUB-COMPONENT: ANIME SCROLL ROW
// -------------------------------------------------------------
interface AnimeRowProps {
  title: string;
  animes: any[];
  icon?: React.ReactNode;
  badge?: string;
  onOpenAnime: (anime: any, mode?: 'info' | 'play' | 'trailer') => void;
  onToggleWatchlist?: (anime: any, e?: React.MouseEvent) => void;
  isAddedToWatchlist?: (id: number) => boolean;
}

const AnimeRow: React.FC<AnimeRowProps> = ({
  title,
  animes,
  icon,
  badge,
  onOpenAnime,
  onToggleWatchlist,
  isAddedToWatchlist
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const scrollAction = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmt = window.innerWidth > 768 ? 550 : 280;
      rowRef.current.scrollBy({ left: direction === 'left' ? -scrollAmt : scrollAmt, behavior: 'smooth' });
    }
  };

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

  if (!animes || animes.length === 0) return null;

  return (
    <div className="group relative ml-4 md:ml-12 mb-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mr-4 md:mr-12 mb-3">
        <h2 className="text-white text-sm md:text-base font-black uppercase tracking-[0.18em] border-l-4 border-red-500 pl-3 drop-shadow-sm flex items-center gap-2.5">
          {icon && <span className="inline-flex items-center justify-center shrink-0">{icon}</span>}
          <span>{title}</span>
        </h2>
        {badge && (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
            {badge}
          </span>
        )}
      </div>

      <div
        onClick={() => scrollAction('left')}
        className="absolute left-0 top-10 bottom-0 z-30 w-10 bg-gradient-to-r from-[#060608] via-[#060608]/90 to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-start cursor-pointer transition-opacity -ml-4 md:-ml-12 hidden md:flex outline-none"
      >
        <ChevronLeft className="text-white hover:text-red-400 transition-colors w-8 h-8 ml-2" />
      </div>

      <div
        ref={rowRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex overflow-x-auto py-2 space-x-3.5 md:space-x-5 no-scrollbar pr-8 scroll-smooth cursor-grab active:cursor-grabbing"
      >
        {animes.map((anime, index) => (
          <AnimeCard
            key={`row-${anime.mal_id}-${index}`}
            anime={anime}
            onOpenAnime={onOpenAnime}
            onToggleWatchlist={onToggleWatchlist}
            isWatchlisted={isAddedToWatchlist ? isAddedToWatchlist(anime.mal_id) : false}
          />
        ))}
      </div>

      <div
        onClick={() => scrollAction('right')}
        className="absolute right-0 top-10 bottom-0 z-30 w-10 bg-gradient-to-l from-[#060608] via-[#060608]/90 to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-end cursor-pointer transition-opacity hidden md:flex outline-none"
      >
        <ChevronRight className="text-white hover:text-red-400 transition-colors w-8 h-8 mr-2" />
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// STANDALONE SUB-COMPONENT: ANIME MODAL
// -------------------------------------------------------------
interface AnimeModalProps {
  anime: any;
  initialMode: 'info' | 'play' | 'trailer';
  isFr: boolean;
  onClose: () => void;
  isAddedToWatchlist: (id: number) => boolean;
  toggleWatchlist: (anime: any, e?: React.MouseEvent) => void;
  onSelectAnotherAnime: (anime: any, mode?: 'info' | 'play' | 'trailer') => void;
}

const AnimeModal: React.FC<AnimeModalProps> = ({
  anime,
  initialMode,
  isFr,
  onClose,
  isAddedToWatchlist,
  toggleWatchlist,
  onSelectAnotherAnime
}) => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [localMode, setLocalMode] = useState(initialMode);

  const [tmdbId, setTmdbId] = useState<number | null>(null);
  const [mediaType, setMediaType] = useState<'tv' | 'movie'>('tv');
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [activeEpisode, setActiveEpisode] = useState<{ s: number; e: number } | null>(null);
  const [selectedServer, setSelectedServer] = useState('vidsrc_cc');
  const [iframeLoading, setIframeLoading] = useState(true);

  const TMDB_API_KEY = (import.meta as any).env?.VITE_TMDB_API_KEY || '027cc951d888c64e5f15dcb853c7347a';

  const AVAILABLE_SERVERS = [
    { id: 'vidsrc_cc', name: '1. ANIME DIRECT (VF/VOSTFR)' },
    { id: 'vidsrc_me', name: '2. GLOBAL (VF/VOSTFR)' },
    { id: 'autoembed', name: '3. OMEGA (MULTI-LANGUES)' },
    { id: 'superembed', name: '4. MULTI (VO/VOSTFR)' },
    { id: 'vidlink', name: '5. ALPHA (VOSTFR)' },
    { id: 'vidsrc_to', name: '6. BETA (VOSTFR)' },
    { id: 'vidsrc_pro', name: '7. GAMMA (VOSTFR)' },
    { id: 'smashy', name: '8. DELTA (VOSTFR)' }
  ];

  useEffect(() => {
    setLocalMode(initialMode);
    setIframeLoading(true);

    // Fetch Characters
    fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/characters`)
      .then(res => res.json())
      .then(data => setCharacters(data.data?.slice(0, 12) || []))
      .catch(() => {});

    // Fetch Recommendations
    fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/recommendations`)
      .then(res => res.json())
      .then(data => setRecommendations(data.data?.slice(0, 8).map((r: any) => r.entry) || []))
      .catch(() => {});

    // Match TMDB for Seasons / Episode Streams
    const fetchTmdb = async () => {
      try {
        const query = anime.title_english || anime.title;
        const searchRes = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
        const searchData = await searchRes.json();
        const match = searchData.results?.find((r: any) => r.media_type === 'tv' || r.media_type === 'movie');

        if (match) {
          setTmdbId(match.id);
          setMediaType(match.media_type);

          // Fetch Trailer
          const vidRes = await fetch(`https://api.themoviedb.org/3/${match.media_type}/${match.id}/videos?api_key=${TMDB_API_KEY}`);
          const vidData = await vidRes.json();
          const trailer = vidData.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || vidData.results?.[0];
          if (trailer) setTrailerKey(trailer.key);

          // If TV, fetch seasons
          if (match.media_type === 'tv') {
            const tvRes = await fetch(`https://api.themoviedb.org/3/tv/${match.id}?api_key=${TMDB_API_KEY}&language=fr-FR`);
            const tvData = await tvRes.json();
            if (tvData.seasons) {
              const validSeasons = tvData.seasons.filter((s: any) => s.season_number > 0);
              setSeasons(validSeasons);
              if (validSeasons.length > 0) {
                fetchEpisodes(match.id, validSeasons[0].season_number);
              }
            }
          }
        }
      } catch {}
    };

    fetchTmdb();
  }, [anime, initialMode]);

  const fetchEpisodes = async (tId: number, seasonNum: number) => {
    setSelectedSeason(seasonNum);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${tId}/season/${seasonNum}?api_key=${TMDB_API_KEY}&language=fr-FR`);
      const data = await res.json();
      setEpisodes(data.episodes || []);
      if (data.episodes && data.episodes.length > 0 && !activeEpisode) {
        setActiveEpisode({ s: seasonNum, e: 1 });
      }
    } catch {}
  };

  const getStreamUrl = () => {
    const s = activeEpisode?.s || 1;
    const e = activeEpisode?.e || 1;
    const id = tmdbId || 1000;

    if (mediaType === 'movie') {
      if (selectedServer === 'vidsrc_cc') return `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=true`;
      if (selectedServer === 'vidsrc_me') return `https://vidsrc.me/embed/movie?tmdb=${id}`;
      if (selectedServer === 'autoembed') return `https://player.autoembed.cc/embed/movie/${id}`;
      if (selectedServer === 'superembed') return `https://multiembed.mov/?video_id=${id}&tmdb=1`;
      if (selectedServer === 'vidlink') return `https://vidlink.pro/movie/${id}?autoplay=true`;
      if (selectedServer === 'vidsrc_to') return `https://vidsrc.to/embed/movie/${id}`;
      if (selectedServer === 'vidsrc_pro') return `https://vidsrc.pro/embed/movie/${id}`;
      return `https://embed.smashystream.com/playere.php?tmdb=${id}`;
    } else {
      if (selectedServer === 'vidsrc_cc') return `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}?autoPlay=true`;
      if (selectedServer === 'vidsrc_me') return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`;
      if (selectedServer === 'autoembed') return `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`;
      if (selectedServer === 'superembed') return `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`;
      if (selectedServer === 'vidlink') return `https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=true`;
      if (selectedServer === 'vidsrc_to') return `https://vidsrc.to/embed/tv/${id}/${s}/${e}`;
      if (selectedServer === 'vidsrc_pro') return `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`;
      return `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${s}&episode=${e}`;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex flex-col overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
      
      {/* Top Floating Close Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-[#080910]/95 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded bg-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>LevelAnime HD</span>
          </span>
          <h2 className="text-white font-bold text-sm md:text-base truncate max-w-xs md:max-w-xl">
            {anime.title_english || anime.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Video Player or Backdrop */}
      {localMode === 'play' ? (
        <div className="relative w-full aspect-video max-h-[70vh] bg-black">
          {iframeLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
            </div>
          )}
          <iframe
            src={getStreamUrl()}
            onLoad={() => setIframeLoading(false)}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        </div>
      ) : localMode === 'trailer' && trailerKey ? (
        <div className="relative w-full aspect-video max-h-[70vh] bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        </div>
      ) : (
        <div className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
          <LevelMovieImage
            src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url}
            alt=""
            brandTheme="red"
            showLogoBadge={false}
            className="w-full h-full object-cover blur-sm scale-105 opacity-40"
            containerClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080910] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="flex gap-6 items-center max-w-4xl">
              <LevelMovieImage
                src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url}
                alt={anime.title_english || anime.title}
                fallbackTitle={anime.title_english || anime.title}
                brandTheme="red"
                className="w-full h-full object-cover"
                containerClassName="w-36 md:w-52 aspect-[2/3] rounded-2xl shadow-2xl border border-white/20 shrink-0 overflow-hidden"
              />
              <div className="space-y-3">
                <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                  {anime.title_english || anime.title}
                </h1>
                <p className="text-xs md:text-sm text-white/70 line-clamp-3">
                  {anime.synopsis}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setLocalMode('play')}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{isFr ? 'Lancer le streaming' : 'Play Stream'}</span>
                  </button>
                  {trailerKey && (
                    <button
                      onClick={() => setLocalMode('trailer')}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                    >
                      <Clapperboard className="w-4 h-4" />
                      <span>Bande-annonce</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Server selector (if in play mode) */}
      {localMode === 'play' && (
        <div className="bg-[#0b0d14] px-4 py-2.5 border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Server className="w-3 h-3 text-red-500" />
            <span>Flux :</span>
          </span>
          {AVAILABLE_SERVERS.map(srv => (
            <button
              key={srv.id}
              onClick={() => setSelectedServer(srv.id)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-colors shrink-0 cursor-pointer ${
                selectedServer === srv.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
              }`}
            >
              {srv.name}
            </button>
          ))}
        </div>
      )}

      {/* Anime Details Body */}
      <div className="p-5 md:p-10 max-w-6xl mx-auto space-y-8 flex-1 w-full">
        
        {/* Seasons & Episodes Selector */}
        {localMode === 'play' && mediaType === 'tv' && seasons.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold uppercase tracking-wider border-l-4 border-red-500 pl-3">
              {isFr ? 'Saisons & Épisodes' : 'Seasons & Episodes'}
            </h3>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {seasons.map(s => (
                <button
                  key={s.season_number}
                  onClick={() => tmdbId && fetchEpisodes(tmdbId, s.season_number)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer shrink-0 ${
                    selectedSeason === s.season_number
                      ? 'bg-red-600 text-white'
                      : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  Saison {s.season_number}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {episodes.map(ep => {
                const isActive = activeEpisode?.s === selectedSeason && activeEpisode?.e === ep.episode_number;
                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setActiveEpisode({ s: selectedSeason, e: ep.episode_number });
                      setLocalMode('play');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-red-600/20 border-red-500 text-white'
                        : 'bg-[#10121a] border-white/5 hover:border-white/20 text-white/80'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-red-400 uppercase">
                      Épisode {ep.episode_number}
                    </div>
                    <div className="text-xs font-semibold truncate mt-0.5">{ep.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Title & Info */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="space-y-3 flex-1">
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
              {anime.title_english || anime.title}
            </h2>
            <div className="flex items-center gap-3 text-xs font-bold text-white/60 flex-wrap">
              <span className="text-green-400 border border-green-400/30 px-2 py-0.5 rounded bg-green-400/10">
                VF & VOSTFR
              </span>
              <span>{anime.year || '2025'}</span>
              <span>{anime.episodes ? `${anime.episodes} EPS` : 'EN COURS'}</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" /> {anime.score || '8.8'}
              </span>
            </div>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed max-w-3xl">
              {anime.synopsis || "Aucun synopsis disponible."}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={() => setLocalMode(localMode === 'play' ? 'info' : 'play')}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{localMode === 'play' ? (isFr ? 'Mode Détails' : 'Details Mode') : (isFr ? 'Regarder' : 'Stream Now')}</span>
            </button>

            <button
              onClick={(e) => toggleWatchlist(anime, e)}
              className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAddedToWatchlist(anime.mal_id) ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span>{isFr ? 'Dans ma liste' : 'In My List'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{isFr ? 'Ajouter aux favoris' : 'Add to List'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cast / Characters */}
        {characters.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-white/10">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">
              {isFr ? 'Personnages Principaux' : 'Characters'}
            </h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
              {characters.map(c => (
                <div key={c.character?.mal_id} className="flex flex-col items-center gap-1.5 shrink-0 w-16 md:w-20 text-center">
                  <LevelMovieImage
                    src={c.character?.images?.webp?.image_url}
                    alt={c.character?.name}
                    fallbackTitle={c.character?.name}
                    brandTheme="red"
                    showLogoBadge={false}
                    className="w-full h-full rounded-full object-cover"
                    containerClassName="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 overflow-hidden"
                  />
                  <span className="text-[10px] font-bold text-white/90 line-clamp-1">{c.character?.name}</span>
                  <span className="text-[9px] text-red-400">{c.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-white/10">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-red-400" />
              <span>{isFr ? 'Titres Recommandés' : 'Recommended'}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {recommendations.map(r => (
                <div
                  key={r.mal_id}
                  onClick={() => onSelectAnotherAnime(r, 'info')}
                  className="rounded-xl overflow-hidden border border-white/5 bg-[#121218] hover:scale-105 transition-transform cursor-pointer aspect-[2/3]"
                >
                  <LevelMovieImage
                    src={r.images?.webp?.large_image_url}
                    alt={r.title}
                    fallbackTitle={r.title}
                    brandTheme="red"
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

// -------------------------------------------------------------
// MAIN LEVEL ANIME APP COMPONENT
// -------------------------------------------------------------
export const LevelAnimeApp: React.FC<LevelAnimeAppProps> = ({
  lang = 'fr',
  user,
  userPhoto,
  userName = 'Membre VIP',
  userEmail = '',
  userAge = null,
  activeTab = 'home',
  onTabChange,
  onOpenMovie,
  showToast,
  onNavigateHome
}) => {
  const isFr = lang === 'fr';

  const [currentCategory, setCurrentCategory] = useState<'home' | 'explore' | 'releases'>(activeTab);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (activeTab && activeTab !== currentCategory) {
      setCurrentCategory(activeTab);
    }
  }, [activeTab]);

  // Anime Data Collections (Pre-seeded with real anime for zero-blank experience)
  const [heroAnime, setHeroAnime] = useState<any>(REAL_POPULAR_ANIMES[0]);
  const [trending, setTrending] = useState<any[]>(REAL_POPULAR_ANIMES);
  const [popular, setPopular] = useState<any[]>(REAL_POPULAR_ANIMES);
  
  // Categorized & Genre Collections
  const [actionAnime, setActionAnime] = useState<any[]>(REAL_ACTION_ANIMES);
  const [fantasyAnime, setFantasyAnime] = useState<any[]>(REAL_FANTASY_ANIMES);
  const [martialArtsAnime, setMartialArtsAnime] = useState<any[]>(REAL_ACTION_ANIMES);
  const [supernaturalAnime, setSupernaturalAnime] = useState<any[]>(REAL_POPULAR_ANIMES);
  const [topRated, setTopRated] = useState<any[]>(REAL_POPULAR_ANIMES);
  const [romanceAnime, setRomanceAnime] = useState<any[]>([]);
  const [horrorAnime, setHorrorAnime] = useState<any[]>([]);
  const [scifiAnime, setScifiAnime] = useState<any[]>([]);
  const [sportsAnime, setSportsAnime] = useState<any[]>([]);
  const [comedyAnime, setComedyAnime] = useState<any[]>([]);
  const [mysteryAnime, setMysteryAnime] = useState<any[]>([]);
  const [animeMovies, setAnimeMovies] = useState<any[]>(REAL_ANIME_MOVIES);
  const [upcomingAnime, setUpcomingAnime] = useState<any[]>([]);

  // Search and Explore
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [exploreAnime, setExploreAnime] = useState<any[]>([]);
  const [explorePage, setExplorePage] = useState(1);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [hasMoreExplore, setHasMoreExplore] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  // Releases Schedule
  const [selectedScheduleDay, setSelectedScheduleDay] = useState<string>(() => getDayKeyFromDate(new Date()));
  const [scheduleAnime, setScheduleAnime] = useState<any[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'airing' | 'popular'>('all');
  const [scheduleLangFilter, setScheduleLangFilter] = useState<'all' | 'vf' | 'vostfr'>('all');

  // Watchlist & History
  const [watchlist, setWatchlist] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('levelanime_watchlist') || '[]');
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('levelanime_history') || '[]');
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'info' | 'play' | 'trailer'>('info');

  const [showSurprise, setShowSurprise] = useState(false);
  const [surpriseAnime, setSurpriseAnime] = useState<any[]>([]);
  const [loadingSurprise, setLoadingSurprise] = useState(false);

  const isFetchingRef = useRef(false);

  // Helper to normalize TMDB anime objects to LevelAnime anime interface
  const normalizeTmdbAnimeList = useCallback((items: any[]) => {
    if (!items || !Array.isArray(items)) return [];
    return items.map((item: any) => {
      const isMovie = item.media_type === 'movie' || (!item.first_air_date && item.release_date);
      const title = item.name || item.title || item.original_name || item.original_title || 'Anime';
      const posterPath = item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : 'https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuQiJ8KiIT.jpg';
      const backdropPath = item.backdrop_path
        ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
        : posterPath;
      const year = (item.first_air_date || item.release_date || '').slice(0, 4);

      return {
        mal_id: item.id,
        id: item.id,
        tmdb_id: item.id,
        media_type: isMovie ? 'movie' : 'tv',
        title: title,
        title_english: item.name || item.title || title,
        images: {
          webp: {
            image_url: posterPath,
            large_image_url: posterPath,
          },
          jpg: {
            image_url: posterPath,
            large_image_url: posterPath,
          }
        },
        trailer: {
          images: {
            maximum_image_url: backdropPath
          }
        },
        score: item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.5,
        year: year ? parseInt(year) : 2024,
        episodes: isMovie ? 1 : null,
        airing: true,
        synopsis: item.overview || 'Disponible en streaming HD VF et VOSTFR sans coupure sur LevelAnime.',
        genres: [{ name: 'Anime' }]
      };
    });
  }, []);

  // Initial Fetching of Real Anime Collections via TMDB & Jikan
  useEffect(() => {
    let isMounted = true;
    const TMDB_API_KEY = (import.meta as any).env?.VITE_TMDB_API_KEY || '027cc951d888c64e5f15dcb853c7347a';

    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch primary categories in parallel via TMDB for ultra-fast, 100% reliable real anime
        const [
          trendingRes,
          topRatedRes,
          actionRes,
          fantasyRes,
          comedyRes,
          mysteryRes,
          moviesRes
        ] = await Promise.allSettled([
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=1`),
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&sort_by=vote_average.desc&vote_count.gte=200&page=1`),
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16,10759&with_original_language=ja&sort_by=popularity.desc&page=1`),
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16,10765&with_original_language=ja&sort_by=popularity.desc&page=1`),
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16,35&with_original_language=ja&sort_by=popularity.desc&page=1`),
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16,9648&with_original_language=ja&sort_by=popularity.desc&page=1`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=1`)
        ]);

        if (isMounted) {
          if (trendingRes.status === 'fulfilled') {
            const data = await trendingRes.value.json();
            if (data.results && data.results.length > 0) {
              const normalized = normalizeTmdbAnimeList(data.results);
              setTrending(normalized);
              setPopular(normalized.slice(0, 10));
              if (normalized[0]) setHeroAnime(normalized[0]);
            }
          }

          if (topRatedRes.status === 'fulfilled') {
            const data = await topRatedRes.value.json();
            if (data.results && data.results.length > 0) {
              setTopRated(normalizeTmdbAnimeList(data.results));
            }
          }

          if (actionRes.status === 'fulfilled') {
            const data = await actionRes.value.json();
            if (data.results && data.results.length > 0) {
              const normalized = normalizeTmdbAnimeList(data.results);
              setActionAnime(normalized);
              setMartialArtsAnime(normalized.slice(4));
            }
          }

          if (fantasyRes.status === 'fulfilled') {
            const data = await fantasyRes.value.json();
            if (data.results && data.results.length > 0) {
              const normalized = normalizeTmdbAnimeList(data.results);
              setFantasyAnime(normalized);
              setSupernaturalAnime(normalized.slice(3));
              setScifiAnime(normalized.slice(6));
            }
          }

          if (comedyRes.status === 'fulfilled') {
            const data = await comedyRes.value.json();
            if (data.results && data.results.length > 0) {
              const normalized = normalizeTmdbAnimeList(data.results);
              setComedyAnime(normalized);
              setRomanceAnime(normalized.slice(3));
            }
          }

          if (mysteryRes.status === 'fulfilled') {
            const data = await mysteryRes.value.json();
            if (data.results && data.results.length > 0) {
              const normalized = normalizeTmdbAnimeList(data.results);
              setMysteryAnime(normalized);
              setHorrorAnime(normalized.slice(3));
            }
          }

          if (moviesRes.status === 'fulfilled') {
            const data = await moviesRes.value.json();
            if (data.results && data.results.length > 0) {
              setAnimeMovies(normalizeTmdbAnimeList(data.results));
            }
          }
        }
      } catch (err) {
        console.warn('Initial anime fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialData();
    return () => { isMounted = false; };
  }, [normalizeTmdbAnimeList]);

  // Deduplicated Rows Engine (guarantees zero card duplicates across rows)
  const deduplicatedRows = React.useMemo(() => {
    const seen = new Set<number>();
    if (heroAnime?.mal_id) seen.add(heroAnime.mal_id);

    const getUnique = (list: any[], max: number = 20) => {
      const result: any[] = [];
      for (const item of list) {
        if (!item || !item.mal_id) continue;
        if (!seen.has(item.mal_id)) {
          seen.add(item.mal_id);
          result.push(item);
          if (result.length >= max) break;
        }
      }
      return result;
    };

    return {
      cleanPopular: getUnique(popular.length > 0 ? popular : REAL_POPULAR_ANIMES, 10),
      cleanTrending: getUnique(trending.length > 0 ? trending : REAL_POPULAR_ANIMES, 18),
      cleanAction: getUnique(actionAnime.length > 0 ? actionAnime : REAL_ACTION_ANIMES, 18),
      cleanFantasy: getUnique(fantasyAnime.length > 0 ? fantasyAnime : REAL_FANTASY_ANIMES, 18),
      cleanMartial: getUnique(martialArtsAnime.length > 0 ? martialArtsAnime : REAL_ACTION_ANIMES, 18),
      cleanSupernatural: getUnique(supernaturalAnime.length > 0 ? supernaturalAnime : REAL_POPULAR_ANIMES, 18),
      cleanTopRated: getUnique(topRated.length > 0 ? topRated : REAL_POPULAR_ANIMES, 18),
      cleanHorror: getUnique(horrorAnime.length > 0 ? horrorAnime : REAL_ACTION_ANIMES, 18),
      cleanRomance: getUnique(romanceAnime.length > 0 ? romanceAnime : REAL_FANTASY_ANIMES, 18),
      cleanScifi: getUnique(scifiAnime.length > 0 ? scifiAnime : REAL_ACTION_ANIMES, 18),
      cleanSports: getUnique(sportsAnime.length > 0 ? sportsAnime : REAL_ACTION_ANIMES, 18),
      cleanComedy: getUnique(comedyAnime.length > 0 ? comedyAnime : REAL_POPULAR_ANIMES, 18),
      cleanMystery: getUnique(mysteryAnime.length > 0 ? mysteryAnime : REAL_POPULAR_ANIMES, 18),
      cleanMovies: getUnique(animeMovies.length > 0 ? animeMovies : REAL_ANIME_MOVIES, 18),
      cleanUpcoming: getUnique(upcomingAnime.length > 0 ? upcomingAnime : REAL_POPULAR_ANIMES, 18),
    };
  }, [
    heroAnime, popular, trending, actionAnime, fantasyAnime, martialArtsAnime,
    supernaturalAnime, topRated, horrorAnime, romanceAnime, scifiAnime,
    sportsAnime, comedyAnime, mysteryAnime, animeMovies, upcomingAnime
  ]);

  // Search anime
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&limit=24`);
        const data = await res.json();
        setSearchResults(data.data || []);
      } catch {} finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Explore Anime Infinite Fetching
  const fetchExploreAnime = useCallback(async (pageToLoad: number, genreId: number | null = selectedGenre) => {
    if (isFetchingRef.current || (!hasMoreExplore && pageToLoad !== 1)) return;
    isFetchingRef.current = true;
    setLoadingExplore(true);
    try {
      const genreQuery = genreId ? `&genres=${genreId}` : '';
      const res = await fetch(`https://api.jikan.moe/v4/anime?page=${pageToLoad}&limit=24&order_by=popularity&sort=asc${genreQuery}`);
      const data = await res.json();

      if (data.data && data.data.length > 0) {
        setExploreAnime(prev => {
          if (pageToLoad === 1) return data.data;
          const newAnimes = data.data.filter((newAnime: any) => !prev.some((existingAnime: any) => existingAnime.mal_id === newAnime.mal_id));
          return [...prev, ...newAnimes];
        });
        setExplorePage(pageToLoad);
        setHasMoreExplore(data.pagination?.has_next_page || false);
      } else {
        setHasMoreExplore(false);
        if (pageToLoad === 1) setExploreAnime([]);
      }
    } catch {
      // error
    } finally {
      isFetchingRef.current = false;
      setLoadingExplore(false);
    }
  }, [hasMoreExplore, selectedGenre]);

  useEffect(() => {
    if (currentCategory === 'explore') {
      setExploreAnime([]);
      setHasMoreExplore(true);
      fetchExploreAnime(1, selectedGenre);
    }
  }, [currentCategory, selectedGenre, fetchExploreAnime]);

  // Fetch Releases / Schedule
  useEffect(() => {
    if (currentCategory === 'releases') {
      const fetchSchedule = async () => {
        setLoadingSchedule(true);
        try {
          const res = await fetch(`https://api.jikan.moe/v4/schedules?filter=${selectedScheduleDay}&limit=24`);
          const data = await res.json();
          setScheduleAnime(data.data || []);
        } catch {
          setScheduleAnime([]);
        } finally {
          setLoadingSchedule(false);
        }
      };
      fetchSchedule();
    }
  }, [currentCategory, selectedScheduleDay]);

  const openAnimeModal = async (anime: any, mode: 'info' | 'play' | 'trailer' = 'info') => {
    // Save to history
    const existingHist = history.filter(a => a.mal_id !== anime.mal_id);
    const updatedHistory = [anime, ...existingHist].slice(0, 25);
    setHistory(updatedHistory);
    try {
      localStorage.setItem('levelanime_history', JSON.stringify(updatedHistory));
    } catch {}

    if (onOpenMovie) {
      if (showToast) showToast(isFr ? 'Recherche sur le lecteur principal...' : 'Loading main player...');
      try {
        const query = anime.title_english || anime.title;
        const TMDB_API_KEY = (import.meta as any).env?.VITE_TMDB_API_KEY || '027cc951d888c64e5f15dcb853c7347a';
        const searchRes = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
        const searchData = await searchRes.json();
        const match = searchData.results?.find((r: any) => r.media_type === 'tv' || r.media_type === 'movie');
        if (match) {
          onOpenMovie(match, mode);
          return;
        }
      } catch (e) {
        console.warn('TMDB lookup failed', e);
      }
    }

    // Fallback to local anime modal
    setSelectedAnime(anime);
    setModalMode(mode);
  };

  const toggleWatchlist = (anime: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isAdded = watchlist.some(a => a.mal_id === anime.mal_id);
    let newWatchlist: any[] = [];
    if (isAdded) {
      newWatchlist = watchlist.filter(a => a.mal_id !== anime.mal_id);
      if (showToast) showToast(isFr ? 'Retiré de vos favoris Anime' : 'Removed from Anime Watchlist');
    } else {
      newWatchlist = [anime, ...watchlist];
      if (showToast) showToast(isFr ? 'Ajouté à vos favoris Anime' : 'Added to Anime Watchlist');
    }
    setWatchlist(newWatchlist);
    try {
      localStorage.setItem('levelanime_watchlist', JSON.stringify(newWatchlist));
    } catch {}
  };

  const isAddedToWatchlist = (id: number) => watchlist.some(a => a.mal_id === id);

  const handleSurpriseMe = async () => {
    setShowSurprise(true);
    if (surpriseAnime.length === 0) {
      setLoadingSurprise(true);
      try {
        const res = await fetch('https://api.jikan.moe/v4/top/anime?filter=favorite&limit=12');
        const data = await res.json();
        setSurpriseAnime(data.data || []);
      } catch {} finally {
        setLoadingSurprise(false);
      }
    }
  };

  // -------------------------------------------------------------
  // HERO BANNER
  // -------------------------------------------------------------
  const renderHeroBanner = () => {
    if (loading || !heroAnime) {
      return (
        <div className="h-[55vh] md:h-[70vh] w-full bg-[#060608] flex items-center justify-center flex-col gap-4">
          <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
          <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
            {isFr ? 'Connexion au catalogue anime...' : 'Loading anime stream hub...'}
          </span>
        </div>
      );
    }

    const bgImage = heroAnime.trailer?.images?.maximum_image_url || heroAnime.trailer?.images?.large_image_url || heroAnime.images?.webp?.large_image_url;

    return (
      <header
        className="relative h-[65vh] md:h-[78vh] min-h-[460px] text-white transition-all duration-700 bg-[#060608]"
        style={{ backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url("${bgImage}")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#060608] via-[#060608]/85 to-transparent w-full md:w-[75%] z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-[#060608]/30 h-full z-10" />

        <div className="relative z-20 flex flex-col justify-end h-full px-4 md:px-14 pb-10 md:pb-16 max-w-4xl w-full">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-white/90 font-black tracking-[0.25em] text-[10px] uppercase bg-red-600/20 border border-red-500/30 px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>{isFr ? 'EN COURS DE DIFFUSION' : 'AIRING NOW'}</span>
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black pb-2 tracking-tighter text-white uppercase drop-shadow-[0_0_30px_rgba(0,0,0,0.9)] leading-tight line-clamp-2">
            {heroAnime.title_english || heroAnime.title}
          </h1>

          <div className="flex items-center gap-3 mt-1 mb-3 text-[11px] md:text-xs font-bold text-white/70 uppercase tracking-widest flex-wrap">
            <span className="text-green-400 border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
              <Mic2 className="w-3 h-3" /> VF & VOSTFR
            </span>
            <span>{heroAnime.year || (heroAnime.aired?.prop?.from?.year || '2025')}</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" /> {heroAnime.score || '8.8'}
            </span>
            <span className="border-l border-white/20 pl-3">
              {heroAnime.episodes ? `${heroAnime.episodes} EPS` : 'SIMULCAST'}
            </span>
            <span className="border-l border-white/20 pl-3 flex items-center gap-1 text-red-400">
              <Eye className="w-3 h-3" /> {formatMetric(heroAnime.members)} VUES
            </span>
          </div>

          <p className="w-full text-xs md:text-sm text-white/75 font-medium leading-relaxed max-w-2xl text-justify drop-shadow-lg line-clamp-3 md:line-clamp-4">
            {heroAnime.synopsis || "Suivez les aventures et découvrez les derniers épisodes diffusés en haute définition."}
          </p>

          <div className="flex items-center gap-3 mt-5 flex-wrap">
            <button
              onClick={() => openAnimeModal(heroAnime, 'play')}
              className="flex items-center gap-2 px-7 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(239,68,68,0.4)] active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isFr ? 'Lecture Épisodes' : 'Watch Stream'}</span>
            </button>

            <button
              onClick={() => openAnimeModal(heroAnime, 'info')}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white uppercase tracking-widest transition-all active:scale-95 backdrop-blur-md cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>{isFr ? "Détails & Saisons" : 'Details'}</span>
            </button>

            <button
              onClick={(e) => toggleWatchlist(heroAnime, e)}
              className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all cursor-pointer"
              title={isFr ? "Ajouter à ma liste" : "Add to list"}
            >
              {isAddedToWatchlist(heroAnime.mal_id) ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>
    );
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col pb-20">
      {/* Main Content Rendered by Category */}
      {searchQuery.trim().length >= 2 ? (
        <div className="p-6 md:p-12 space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold uppercase tracking-wider border-l-4 border-red-500 pl-3">
              {isFr ? `Résultats pour "${searchQuery}"` : `Results for "${searchQuery}"`}
            </h2>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-white/60 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Effacer la recherche</span>
            </button>
          </div>

          {isSearching ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-20 text-center text-white/40 text-xs uppercase tracking-widest">
              {isFr ? 'Aucun résultat trouvé pour cette recherche.' : 'No anime found matching your query.'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {searchResults.map(anime => {
                const animeTitle = anime.title_english || anime.title || 'Anime';
                return (
                  <div
                    key={anime.mal_id}
                    onClick={() => openAnimeModal(anime, 'info')}
                    className="relative rounded-xl overflow-hidden border border-white/5 bg-[#121218] hover:scale-105 transition-transform cursor-pointer aspect-[2/3] group shadow-lg"
                  >
                    <LevelMovieImage
                      src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url}
                      alt={animeTitle}
                      fallbackTitle={animeTitle}
                      brandTheme="red"
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-2.5 pointer-events-none">
                      <span className="text-white text-xs font-bold line-clamp-2">
                        {animeTitle}
                      </span>
                      <span className="text-red-400 text-[10px] font-bold mt-0.5 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-red-400" /> {anime.score || '8.5'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : currentCategory === 'explore' ? (
        /* EXPLORER VIEW */
        <div className="p-4 sm:p-6 md:p-12 space-y-6 pt-6 max-w-[2000px] mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider border-l-4 border-red-500 pl-3 flex items-center gap-2">
                <Compass className="w-6 h-6 text-red-500" />
                <span>{isFr ? 'Explorer le Catalogue Complet' : 'Explore All Anime'}</span>
              </h2>
              <p className="text-xs text-white/50 pl-3 mt-1">
                {isFr ? 'Filtrez par genres, découvrez les univers shōnen, fantasy, isekai et chefs-d’œuvre.' : 'Filter by genres, discover shonen, fantasy, isekai, and top rated masterworks.'}
              </p>
            </div>

            <button
              onClick={handleSurpriseMe}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 w-fit"
            >
              <Sparkles className="w-4 h-4" />
              <span>Surprends-moi</span>
            </button>
          </div>

          {/* Genre Filters with SVGs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedGenre === null
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tous les genres</span>
            </button>
            {ANIME_GENRES.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  selectedGenre === g.id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                <span className={selectedGenre === g.id ? 'text-white' : g.color}>
                  {renderGenreSvg(g.iconKey, "w-3.5 h-3.5")}
                </span>
                <span>{g.name}</span>
              </button>
            ))}
          </div>

          {/* Explore Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {exploreAnime.map((anime, idx) => {
              const animeTitle = anime.title_english || anime.title || 'Anime';
              return (
                <div
                  key={`${anime.mal_id}-${idx}`}
                  onClick={() => openAnimeModal(anime, 'info')}
                  className="relative rounded-xl overflow-hidden border border-white/5 bg-[#121218] hover:scale-105 transition-transform duration-300 cursor-pointer aspect-[2/3] group shadow-lg"
                >
                  <LevelMovieImage
                    src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url}
                    alt={animeTitle}
                    fallbackTitle={animeTitle}
                    brandTheme="red"
                    loading="lazy"
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 pointer-events-none">
                    <span className="text-white text-xs font-bold line-clamp-2 leading-tight">
                      {animeTitle}
                    </span>
                    <div className="flex items-center justify-between mt-1 text-[9px] text-white/80">
                      <span className="text-red-400 font-bold flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-red-400" /> {anime.score || '8.5'}
                      </span>
                      <span>{anime.episodes ? `${anime.episodes} EPS` : 'EN COURS'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {loadingExplore && (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
          )}

          {!loadingExplore && hasMoreExplore && (
            <div className="flex justify-center pt-4 pb-8">
              <button
                onClick={() => fetchExploreAnime(explorePage + 1, selectedGenre)}
                className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Charger plus d'animes
              </button>
            </div>
          )}
        </div>
      ) : currentCategory === 'releases' ? (
        /* SORTIES / RELEASES VIEW */
        <div className="p-4 sm:p-6 md:p-12 space-y-8 pt-6 max-w-[2000px] mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
                  {isFr ? 'Planning Hebdomadaire' : 'Weekly Schedule'}
                </span>
                <span className="text-white/40 text-xs">
                  {new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-wider border-l-4 border-red-500 pl-3 flex items-center gap-2.5">
                <Calendar className="w-6 h-6 text-red-500" />
                <span>{isFr ? 'Calendrier des Sorties & Simulcasts' : '7-Day Anime Release Calendar'}</span>
              </h2>
              <p className="text-xs text-white/50 pl-3 mt-1.5 max-w-2xl">
                {isFr 
                  ? 'Retrouvez vos animés préférés classés par jour de diffusion en direct du Japon avec les nouveaux épisodes en VF & VOSTFR H+1.'
                  : 'Track your favorite anime scheduled by day of broadcast live from Japan with new episodes in Sub & Dub within 1 hour.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-red-600/10 border border-red-500/30 px-3.5 py-1.5 rounded-full text-red-400 text-xs font-mono font-bold shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span>SIMULCAST H+1 JAPON</span>
              </div>
            </div>
          </div>

          {/* Interactive 7-Day Week Strip */}
          <div className="bg-[#121218]/90 border border-white/10 rounded-2xl p-2.5 sm:p-3 shadow-xl backdrop-blur-md">
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {WEEK_DAYS.map((day) => {
                const todayKey = getDayKeyFromDate(new Date());
                const isToday = day.id === todayKey;
                const isSelected = selectedScheduleDay === day.id;

                return (
                  <button
                    key={day.id}
                    onClick={() => setSelectedScheduleDay(day.id)}
                    className={`relative flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-1 sm:px-3 rounded-xl transition-all cursor-pointer select-none text-center ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400/50 scale-[1.02]'
                        : isToday
                        ? 'bg-white/10 text-white border border-red-500/40 hover:bg-white/15'
                        : 'bg-[#181822]/60 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {isToday && (
                      <span className={`absolute -top-2 px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-tighter shadow-md ${
                        isSelected ? 'bg-white text-red-600' : 'bg-red-600 text-white animate-pulse'
                      }`}>
                        {isFr ? "Aujourd'hui" : 'Today'}
                      </span>
                    )}
                    <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider">
                      {day.short}
                    </span>
                    <span className="text-xs sm:text-sm font-bold mt-0.5 truncate max-w-full">
                      {isFr ? day.label : day.labelEn}
                    </span>
                    <div className="mt-1 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : isToday ? 'bg-red-400' : 'bg-white/20'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter & Options Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0a10] border border-white/5 p-3 rounded-xl">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-white/50 uppercase tracking-wider mr-1">
                {isFr ? 'Filtres :' : 'Filters:'}
              </span>
              <button
                onClick={() => setScheduleFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  scheduleFilter === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {isFr ? 'Tous les animes' : 'All Animes'}
              </button>
              <button
                onClick={() => setScheduleFilter('airing')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  scheduleFilter === 'airing'
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {isFr ? 'En cours (En cours de diffusion)' : 'Currently Airing'}
              </button>
              <button
                onClick={() => setScheduleFilter('popular')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  scheduleFilter === 'popular'
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>{isFr ? 'Mieux Notés' : 'Top Rated'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
                Audio :
              </span>
              <button
                onClick={() => setScheduleLangFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase transition-all cursor-pointer ${
                  scheduleLangFilter === 'all'
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {isFr ? 'Tous' : 'All'}
              </button>
              <button
                onClick={() => setScheduleLangFilter('vf')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase transition-all cursor-pointer ${
                  scheduleLangFilter === 'vf'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                VF
              </button>
              <button
                onClick={() => setScheduleLangFilter('vostfr')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase transition-all cursor-pointer ${
                  scheduleLangFilter === 'vostfr'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                VOSTFR
              </button>
            </div>
          </div>

          {/* Schedule List / Grid */}
          {loadingSchedule ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-9 h-9 animate-spin text-red-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                {isFr ? 'Chargement des simulcasts...' : 'Loading simulcast episodes...'}
              </p>
            </div>
          ) : scheduleAnime.length === 0 ? (
            <div className="py-20 text-center bg-[#121218]/40 border border-white/5 rounded-2xl p-8">
              <p className="text-white/40 text-sm font-bold uppercase tracking-wider">
                {isFr ? 'Aucun épisode programmé pour ce jour.' : 'No anime scheduled for this day.'}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
                  {scheduleAnime.length} {isFr ? 'épisodes au programme' : 'scheduled episodes'}
                </span>
                <span className="text-[11px] text-white/40 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-red-400" />
                  {isFr ? 'Heures locales estimées' : 'Estimated local air times'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {scheduleAnime
                  .filter(anime => {
                    if (scheduleFilter === 'airing') return anime.airing !== false;
                    if (scheduleFilter === 'popular') return (anime.score || 0) >= 7.5;
                    return true;
                  })
                  .map((anime, idx) => (
                    <div
                      key={`${anime.mal_id}-${idx}`}
                      className="group bg-[#121218] border border-white/10 hover:border-red-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/20 flex flex-col justify-between"
                    >
                      {/* Top Thumbnail & Badges */}
                      <div 
                        onClick={() => openAnimeModal(anime, 'info')}
                        className="relative aspect-video w-full overflow-hidden cursor-pointer bg-black/40"
                      >
                        <LevelMovieImage
                          src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url}
                          alt={anime.title_english || anime.title}
                          fallbackTitle={anime.title_english || anime.title}
                          brandTheme="red"
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          containerClassName="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-black/60 pointer-events-none" />

                        {/* Top Left: Broadcast Hour */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-red-600/90 backdrop-blur-md px-2 py-0.5 rounded-md text-white text-[10px] font-mono font-black uppercase tracking-wider shadow">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{anime.broadcast?.time || '18:00 JST'}</span>
                        </div>

                        {/* Top Right: Status / Score */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-yellow-400 text-[10px] font-bold border border-white/10">
                          <Star className="w-2.5 h-2.5 fill-yellow-400" />
                          <span>{anime.score ? anime.score.toFixed(1) : '8.2'}</span>
                        </div>

                        {/* Bottom Thumbnail Overlay: Title & Ep */}
                        <div className="absolute bottom-2 left-2.5 right-2.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="px-1.5 py-0.2 rounded bg-white/20 text-white text-[9px] font-black uppercase tracking-wider">
                              {anime.episodes ? `ÉPISODE ${anime.episodes}` : 'NOUVEL ÉPISODE'}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-green-600/80 text-white text-[9px] font-black uppercase tracking-wider">
                              VF / VOSTFR
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Info & Metadata */}
                      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
                        <div>
                          <h3 
                            onClick={() => openAnimeModal(anime, 'info')}
                            className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-400 transition-colors cursor-pointer"
                            title={anime.title_english || anime.title}
                          >
                            {anime.title_english || anime.title}
                          </h3>

                          {anime.title_japanese && (
                            <p className="text-[10px] text-white/40 truncate font-mono mt-0.5">
                              {anime.title_japanese}
                            </p>
                          )}

                          {/* Genres */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {anime.genres?.slice(0, 3).map((g: any) => (
                              <span
                                key={g.mal_id}
                                className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-white/60 font-medium"
                              >
                                {g.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => openAnimeModal(anime, 'play')}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-red-600/30 cursor-pointer active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{isFr ? 'Regarder' : 'Watch'}</span>
                          </button>

                          <button
                            onClick={() => openAnimeModal(anime, 'info')}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                            title={isFr ? "Détails de l'animé" : "Anime Details"}
                          >
                            <Info className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => toggleWatchlist(anime, e)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              isAddedToWatchlist(anime.mal_id)
                                ? 'bg-red-600/20 border-red-500 text-red-400'
                                : 'bg-white/5 hover:bg-white/15 border-white/10 text-white/50 hover:text-white'
                            }`}
                            title={isFr ? "Ajouter à ma liste" : "Add to list"}
                          >
                            <Bookmark className={`w-4 h-4 ${isAddedToWatchlist(anime.mal_id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Upcoming Season Anticipations Row */}
          {upcomingAnime.length > 0 && (
            <div className="pt-8 border-t border-white/10">
              <AnimeRow
                title={isFr ? 'Sorties Attendues & Prochaines Saisons' : 'Upcoming Next Season'}
                animes={upcomingAnime}
                icon={<Clock className="w-4 h-4 text-amber-400" />}
                onOpenAnime={openAnimeModal}
              />
            </div>
          )}
        </div>
      ) : (
        /* ACCUEIL / HOME VIEW (Rich rows with SVGs & extra genre collections) */
        <>
          {renderHeroBanner()}

          <main className="space-y-4 pt-4 md:pt-6">
            {/* History / Continue Watching */}
            {history.length > 0 && (
              <AnimeRow
                title={isFr ? 'Reprendre le visionnage' : 'Continue Watching'}
                animes={history}
                icon={<Play className="w-4 h-4 text-red-500 fill-red-500" />}
                badge={isFr ? 'En cours' : 'Watching'}
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* Top 10 Populaire */}
            {deduplicatedRows.cleanPopular.length > 0 && (
              <Top10Row
                title={isFr ? 'Top 10 de la Semaine' : 'Top 10 This Week'}
                animes={deduplicatedRows.cleanPopular}
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 1. Nouveautés & Simulcasts */}
            {deduplicatedRows.cleanTrending.length > 0 && (
              <AnimeRow
                title={isFr ? 'Nouveautés & Simulcasts en Direct' : 'Currently Airing Simulcasts'}
                animes={deduplicatedRows.cleanTrending}
                icon={<Flame className="w-4 h-4 text-orange-500" />}
                badge="Simulcast H+1"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 2. Shōnen, Action & Combats Épiques */}
            {deduplicatedRows.cleanAction.length > 0 && (
              <AnimeRow
                title={isFr ? 'Combats Épiques, Shōnen & Tournois' : 'Epic Battles & Shonen'}
                animes={deduplicatedRows.cleanAction}
                icon={<Swords className="w-4 h-4 text-red-500" />}
                badge="Action pure"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 3. Fantasy & Univers Isekai */}
            {deduplicatedRows.cleanFantasy.length > 0 && (
              <AnimeRow
                title={isFr ? 'Fantasy, Magie & Mondes Isekai' : 'Fantasy Worlds & Isekai'}
                animes={deduplicatedRows.cleanFantasy}
                icon={<Wand2 className="w-4 h-4 text-amber-400" />}
                badge="Magie & Aventure"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 4. Arts Martiaux & Dépassement */}
            {deduplicatedRows.cleanMartial.length > 0 && (
              <AnimeRow
                title={isFr ? 'Arts Martiaux, Duels & Confrontations' : 'Martial Arts & Duels'}
                animes={deduplicatedRows.cleanMartial}
                icon={<Dumbbell className="w-4 h-4 text-red-400" />}
                badge="Combats rapprochés"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 5. Surnaturel, Démons & Pouvoirs */}
            {deduplicatedRows.cleanSupernatural.length > 0 && (
              <AnimeRow
                title={isFr ? 'Surnaturel, Pouvoirs Psychiques & Démons' : 'Supernatural & Powers'}
                animes={deduplicatedRows.cleanSupernatural}
                icon={<Zap className="w-4 h-4 text-purple-400" />}
                badge="Surnaturel"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 6. Chefs-d’œuvre Mieux Notés */}
            {deduplicatedRows.cleanTopRated.length > 0 && (
              <AnimeRow
                title={isFr ? 'Chefs-d’œuvre & Légendes Incontournables' : 'Masterpieces & Top Rated'}
                animes={deduplicatedRows.cleanTopRated}
                icon={<Crown className="w-4 h-4 text-yellow-400" />}
                badge="★ 8.8+"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 7. Dark Fantasy & Horreur (Réservé aux 18 ans et plus) */}
            {(userAge === null || userAge === undefined || userAge >= 18) && deduplicatedRows.cleanHorror.length > 0 && (
              <AnimeRow
                title={isFr ? 'Dark Fantasy, Horreur & Psychologique (+18)' : 'Dark Fantasy & Horror (18+)'}
                animes={deduplicatedRows.cleanHorror}
                icon={<Skull className="w-4 h-4 text-rose-500" />}
                badge={isFr ? "Public averti" : "Mature"}
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 8. Romance & Émotions */}
            {deduplicatedRows.cleanRomance.length > 0 && (
              <AnimeRow
                title={isFr ? 'Romance, Sentiments & Tranche de Vie' : 'Romance & Feelings'}
                animes={deduplicatedRows.cleanRomance}
                icon={<Heart className="w-4 h-4 text-pink-400" />}
                badge="Émotions"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 9. Sci-Fi & Mecha */}
            {deduplicatedRows.cleanScifi.length > 0 && (
              <AnimeRow
                title={isFr ? 'Sci-Fi, Cyberpunk & Mecha' : 'Sci-Fi & Cyberpunk'}
                animes={deduplicatedRows.cleanScifi}
                icon={<Bot className="w-4 h-4 text-cyan-400" />}
                badge="Futuriste"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 10. Sports & Compétitions */}
            {deduplicatedRows.cleanSports.length > 0 && (
              <AnimeRow
                title={isFr ? 'Sports, Esprit d’Équipe & Victoires' : 'Sports & Tournaments'}
                animes={deduplicatedRows.cleanSports}
                icon={<Trophy className="w-4 h-4 text-amber-500" />}
                badge="Compétition"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 11. Comédies & Détente */}
            {deduplicatedRows.cleanComedy.length > 0 && (
              <AnimeRow
                title={isFr ? 'Comédie, Amitié & Bonne Humeur' : 'Comedy & Slice of Life'}
                animes={deduplicatedRows.cleanComedy}
                icon={<Smile className="w-4 h-4 text-orange-400" />}
                badge="Feel Good"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 12. Mystère & Thrillers */}
            {deduplicatedRows.cleanMystery.length > 0 && (
              <AnimeRow
                title={isFr ? 'Mystère, Enquêtes & Suspense' : 'Mystery & Thrillers'}
                animes={deduplicatedRows.cleanMystery}
                icon={<Search className="w-4 h-4 text-blue-400" />}
                badge="Intrigue"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 13. Longs-Métrages */}
            {deduplicatedRows.cleanMovies.length > 0 && (
              <AnimeRow
                title={isFr ? 'Longs-Métrages & Films d’Animation' : 'Anime Feature Films'}
                animes={deduplicatedRows.cleanMovies}
                icon={<Film className="w-4 h-4 text-purple-400" />}
                badge="Films HD"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}

            {/* 14. Prochaines Sorties */}
            {deduplicatedRows.cleanUpcoming.length > 0 && (
              <AnimeRow
                title={isFr ? 'Prochaines Sorties & Anticipations' : 'Upcoming Releases'}
                animes={deduplicatedRows.cleanUpcoming}
                icon={<Clock className="w-4 h-4 text-teal-400" />}
                badge="À venir"
                onOpenAnime={openAnimeModal}
                onToggleWatchlist={toggleWatchlist}
                isAddedToWatchlist={isAddedToWatchlist}
              />
            )}
          </main>
        </>
      )}

      {/* Modal Surprise Me */}
      {showSurprise && (
        <div className="fixed inset-0 z-[9000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e101a] border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-500" />
                <span>Sélection Spéciale LevelAnime</span>
              </h3>
              <button onClick={() => setShowSurprise(false)} className="text-white/50 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
              {surpriseAnime.map(anime => (
                <div
                  key={anime.mal_id}
                  onClick={() => {
                    setShowSurprise(false);
                    openAnimeModal(anime, 'info');
                  }}
                  className="rounded-xl overflow-hidden border border-white/10 bg-[#151722] hover:scale-105 transition-transform cursor-pointer aspect-[2/3]"
                >
                  <img src={anime.images?.webp?.large_image_url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Anime Modal */}
      {selectedAnime && (
        <AnimeModal
          anime={selectedAnime}
          initialMode={modalMode}
          isFr={isFr}
          onClose={() => setSelectedAnime(null)}
          isAddedToWatchlist={isAddedToWatchlist}
          toggleWatchlist={toggleWatchlist}
          onSelectAnotherAnime={(a, mode) => openAnimeModal(a, mode || 'info')}
        />
      )}

    </div>
  );
};
