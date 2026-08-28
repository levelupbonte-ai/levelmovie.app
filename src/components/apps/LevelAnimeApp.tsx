import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Info, Search, X, Star, ChevronLeft, ChevronRight,
  Bookmark, Home, Tv, Clapperboard, Users, Flame, Calendar,
  Plus, CheckCircle, Bell, TrendingUp, Award, Compass,
  Loader2, Eye, Trophy, Heart, AlignLeft, Filter, Sparkles, LayoutGrid,
  BellRing, Mic2, Settings, User, PlayCircle, Subtitles, HardDrive, LogOut,
  ShieldCheck, KeyRound, EyeOff, AlertTriangle, Server, Share2, Film, Check,
  RotateCw
} from 'lucide-react';
import { LevelMovieLogo } from '../../constants';

interface LevelAnimeAppProps {
  lang?: string;
  user?: any;
  userPhoto?: string | null;
  userName?: string;
  userEmail?: string;
  onOpenMovie?: (movie: any, mode?: string) => void;
  showToast?: (msg: string, type?: string) => void;
}

const formatMetric = (num: number) => {
  if (!num) return 'N/A';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const ANIME_GENRES = [
  { id: 1, name: 'Action', icon: '🔥' },
  { id: 2, name: 'Aventure', icon: '🗺️' },
  { id: 4, name: 'Comédie', icon: '😂' },
  { id: 8, name: 'Drame', icon: '🎭' },
  { id: 10, name: 'Fantasy', icon: '✨' },
  { id: 14, name: 'Horreur', icon: '🩸' },
  { id: 22, name: 'Romance', icon: '❤️' },
  { id: 24, name: 'Sci-Fi', icon: '🚀' },
  { id: 30, name: 'Sport', icon: '🏅' },
  { id: 36, name: 'Tranche de vie', icon: '☕' },
  { id: 37, name: 'Surnaturel', icon: '👻' },
  { id: 7, name: 'Mystère', icon: '🔍' },
];

export const LevelAnimeApp: React.FC<LevelAnimeAppProps> = ({
  lang = 'fr',
  user,
  userPhoto,
  userName = 'Membre VIP',
  userEmail = '',
  onOpenMovie,
  showToast
}) => {
  const isFr = lang === 'fr';

  const [currentCategory, setCurrentCategory] = useState<'home' | 'explore' | 'trending' | 'watchlist'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const [heroAnime, setHeroAnime] = useState<any>(null);
  const [trending, setTrending] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [actionAnime, setActionAnime] = useState<any[]>([]);
  const [romanceAnime, setRomanceAnime] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

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

  const [loading, setLoading] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'info' | 'play' | 'trailer'>('info');

  const [showSurprise, setShowSurprise] = useState(false);
  const [surpriseAnime, setSurpriseAnime] = useState<any[]>([]);
  const [loadingSurprise, setLoadingSurprise] = useState(false);

  const [exploreAnime, setExploreAnime] = useState<any[]>([]);
  const [explorePage, setExplorePage] = useState(1);
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [hasMoreExplore, setHasMoreExplore] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const observerTarget = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  // Initial Fetching
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

        try {
          const trendingRes = await fetch('https://api.jikan.moe/v4/seasons/now?limit=25');
          const trendingData = await trendingRes.json();
          if (isMounted && trendingData.data) {
            const validTrending = trendingData.data.filter((a: any) => a.images?.webp?.large_image_url);
            setTrending(validTrending);
            const heroCandidate = validTrending.find((a: any) => a.trailer?.images?.maximum_image_url) || validTrending[0];
            if (heroCandidate) setHeroAnime(heroCandidate);
          }
        } catch {}

        if (isMounted) setLoading(false);
        await delay(800);

        try {
          const popRes = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing&limit=10');
          const popData = await popRes.json();
          if (isMounted && popData.data) setPopular(popData.data);
        } catch {}
        await delay(800);

        try {
          const topRes = await fetch('https://api.jikan.moe/v4/top/anime?limit=15');
          const topData = await topRes.json();
          if (isMounted && topData.data) setTopRated(topData.data);
        } catch {}
        await delay(800);

        try {
          const actRes = await fetch('https://api.jikan.moe/v4/anime?genres=1&order_by=popularity&sort=asc&limit=15');
          const actData = await actRes.json();
          if (isMounted && actData.data) setActionAnime(actData.data);
        } catch {}
        await delay(800);

        try {
          const romRes = await fetch('https://api.jikan.moe/v4/anime?genres=22&order_by=popularity&sort=asc&limit=15');
          const romData = await romRes.json();
          if (isMounted && romData.data) setRomanceAnime(romData.data);
        } catch {}

      } catch {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialData();
    return () => { isMounted = false; };
  }, []);

  // Search anime
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&limit=24`);
        const data = await res.json();
        setSearchResults(data.data || []);
      } catch {}
    }, 600);
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

  const openAnimeModal = (anime: any, mode: 'info' | 'play' | 'trailer' = 'info') => {
    setSelectedAnime(anime);
    setModalMode(mode);

    // Save to history
    const existingHist = history.filter(a => a.mal_id !== anime.mal_id);
    const updatedHistory = [anime, ...existingHist].slice(0, 25);
    setHistory(updatedHistory);
    try {
      localStorage.setItem('levelanime_history', JSON.stringify(updatedHistory));
    } catch {}
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
  // RENDER: HERO BANNER
  // -------------------------------------------------------------
  const renderHeroBanner = () => {
    if (loading || !heroAnime) {
      return (
        <div className="h-[60vh] md:h-[75vh] w-full bg-[#060608] flex items-center justify-center flex-col gap-4">
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
        className="relative h-[65vh] md:h-[80vh] min-h-[480px] text-white transition-all duration-700 bg-[#060608]"
        style={{ backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url("${bgImage}")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#060608] via-[#060608]/80 to-transparent w-full md:w-[75%] z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-[#060608]/40 h-full z-10" />

        <div className="relative z-20 flex flex-col justify-end h-full px-4 md:px-14 pb-12 md:pb-20 max-w-4xl w-full">
          <div className="flex items-center space-x-3 mb-3">
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
            <span>{heroAnime.year || (heroAnime.aired?.prop?.from?.year || '2025/2026')}</span>
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

  // -------------------------------------------------------------
  // RENDER: TOP 10 NETFLIX-STYLE ROW
  // -------------------------------------------------------------
  const renderTop10Row = (title: string, animes: any[]) => {
    const rowRef = useRef<HTMLDivElement | null>(null);
    const scrollAction = (direction: 'left' | 'right') => {
      if (rowRef.current) {
        const scrollAmt = window.innerWidth > 768 ? 600 : 350;
        rowRef.current.scrollBy({ left: direction === 'left' ? -scrollAmt : scrollAmt, behavior: 'smooth' });
      }
    };

    if (!animes || animes.length === 0) return null;

    return (
      <div className="group relative mb-10 mt-6">
        <h2 className="text-white text-sm md:text-lg font-black mb-3 uppercase tracking-[0.2em] border-l-4 border-red-500 ml-4 md:ml-12 pl-3 drop-shadow-sm flex items-center gap-2">
          <span>{title}</span>
          <TrendingUp className="w-4 h-4 text-red-500" />
        </h2>

        <div
          onClick={() => scrollAction('left')}
          className="absolute left-0 top-10 bottom-0 z-30 w-12 bg-gradient-to-r from-[#060608] to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-start cursor-pointer transition-opacity"
        >
          <ChevronLeft className="text-white hover:text-red-400 transition-colors w-8 h-8 ml-2" />
        </div>

        <div
          ref={rowRef}
          className="flex overflow-x-auto py-6 space-x-8 md:space-x-12 no-scrollbar pl-12 md:pl-20 pr-12 scroll-smooth items-end"
        >
          {animes.slice(0, 10).map((anime, index) => (
            <div
              key={`${anime.mal_id}-${index}`}
              className="relative flex-none cursor-pointer group flex items-end w-[130px] md:w-[170px] lg:w-[200px]"
              onClick={() => openAnimeModal(anime, 'info')}
            >
              <span className="text-[90px] md:text-[130px] leading-none font-black absolute -left-8 md:-left-12 -bottom-3 z-20 pointer-events-none drop-shadow-2xl italic tracking-tighter text-transparent [-webkit-text-stroke:2px_#ef4444]">
                {index + 1}
              </span>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#121218] group-hover:scale-105 transition-transform duration-300 w-full aspect-[2/3] z-10">
                <img
                  className="object-cover w-full h-full"
                  src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url}
                  loading="lazy"
                  alt={anime.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                  <h3 className="text-white font-bold text-[10px] md:text-xs uppercase line-clamp-2 leading-tight">
                    {anime.title_english || anime.title}
                  </h3>
                  <div className="text-red-400 font-bold text-[9px] mt-1 flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-red-400" />
                    <span>{anime.score || '8.5'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          onClick={() => scrollAction('right')}
          className="absolute right-0 top-10 bottom-0 z-30 w-12 bg-gradient-to-l from-[#060608] to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-end cursor-pointer transition-opacity"
        >
          <ChevronRight className="text-white hover:text-red-400 transition-colors w-8 h-8 mr-2" />
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // RENDER: STANDARD ANIME ROW
  // -------------------------------------------------------------
  const renderAnimeRow = (title: string, animes: any[]) => {
    const rowRef = useRef<HTMLDivElement | null>(null);
    const scrollAction = (direction: 'left' | 'right') => {
      if (rowRef.current) {
        const scrollAmt = window.innerWidth > 768 ? 500 : 280;
        rowRef.current.scrollBy({ left: direction === 'left' ? -scrollAmt : scrollAmt, behavior: 'smooth' });
      }
    };

    if (!animes || animes.length === 0) return null;

    return (
      <div className="group relative ml-4 md:ml-12 mb-8">
        <h2 className="text-white text-sm md:text-base font-black mb-3 uppercase tracking-[0.2em] border-l-4 border-red-500 pl-3 drop-shadow-sm flex items-center gap-2">
          <span>{title}</span>
        </h2>

        <div
          onClick={() => scrollAction('left')}
          className="absolute left-0 top-8 bottom-0 z-30 w-10 bg-gradient-to-r from-[#060608] to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-start cursor-pointer transition-opacity -ml-4"
        >
          <ChevronLeft className="text-white hover:text-red-400 transition-colors w-8 h-8" />
        </div>

        <div
          ref={rowRef}
          className="flex overflow-x-auto py-2 space-x-3.5 no-scrollbar pr-8 scroll-smooth"
        >
          {animes.map((anime, index) => (
            <div
              key={`${anime.mal_id}-${index}`}
              className="relative flex-none cursor-pointer rounded-xl overflow-hidden shadow-lg border border-white/5 bg-[#121218] hover:scale-105 transition-transform duration-300 w-[130px] md:w-[170px] aspect-[2/3] group"
              onClick={() => openAnimeModal(anime, 'info')}
            >
              <img
                className="object-cover w-full h-full"
                src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url}
                loading="lazy"
                alt={anime.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                <h3 className="text-white font-bold text-[10px] md:text-xs uppercase line-clamp-2 leading-tight">
                  {anime.title_english || anime.title}
                </h3>
                <div className="flex items-center justify-between mt-1 text-[9px] text-white/80">
                  <span className="text-red-400 font-bold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-red-400" /> {anime.score || 'N/A'}
                  </span>
                  <span>{anime.year || ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          onClick={() => scrollAction('right')}
          className="absolute right-0 top-8 bottom-0 z-30 w-10 bg-gradient-to-l from-[#060608] to-transparent opacity-0 md:group-hover:opacity-100 flex items-center justify-end cursor-pointer transition-opacity"
        >
          <ChevronRight className="text-white hover:text-red-400 transition-colors w-8 h-8" />
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // RENDER: ANIME MODAL (PLAYER / INFO / EPISODES)
  // -------------------------------------------------------------
  const renderAnimeModal = () => {
    if (!selectedAnime) return null;

    const [characters, setCharacters] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [localMode, setLocalMode] = useState(modalMode);

    const [tmdbId, setTmdbId] = useState<number | null>(null);
    const [mediaType, setMediaType] = useState<'tv' | 'movie'>('tv');
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [seasons, setSeasons] = useState<any[]>([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [activeEpisode, setActiveEpisode] = useState<{ s: number; e: number } | null>(null);
    const [selectedServer, setSelectedServer] = useState('vidsrc_cc');
    const [iframeLoading, setIframeLoading] = useState(true);

    const TMDB_API_KEY = '027cc951d888c64e5f15dcb853c7347a';

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
      setLocalMode(modalMode);
      setIframeLoading(true);

      // Fetch Characters
      fetch(`https://api.jikan.moe/v4/anime/${selectedAnime.mal_id}/characters`)
        .then(res => res.json())
        .then(data => setCharacters(data.data?.slice(0, 12) || []))
        .catch(() => {});

      // Fetch Recommendations
      fetch(`https://api.jikan.moe/v4/anime/${selectedAnime.mal_id}/recommendations`)
        .then(res => res.json())
        .then(data => setRecommendations(data.data?.slice(0, 8).map((r: any) => r.entry) || []))
        .catch(() => {});

      // Match TMDB for Seasons / Episode Streams
      const fetchTmdb = async () => {
        try {
          const query = selectedAnime.title_english || selectedAnime.title;
          const searchRes = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
          const searchData = await searchRes.json();
          const match = searchData.results?.find((r: any) => r.media_type === 'tv' || r.media_type === 'movie');

          if (match) {
            setTmdbId(match.id);
            setMediaType(match.media_type);

            if (match.media_type === 'tv') {
              const tvRes = await fetch(`https://api.themoviedb.org/3/tv/${match.id}?api_key=${TMDB_API_KEY}&language=fr-FR`);
              const tvData = await tvRes.json();
              if (tvData.seasons) {
                const validSeasons = tvData.seasons.filter((s: any) => s.season_number > 0);
                setSeasons(validSeasons);
                const sNum = validSeasons.length > 0 ? validSeasons[0].season_number : 1;
                setSelectedSeason(sNum);
                fetchEpisodes(match.id, sNum);
              }
            }

            const vidRes = await fetch(`https://api.themoviedb.org/3/${match.media_type}/${match.id}/videos?api_key=${TMDB_API_KEY}&language=fr-FR`);
            const vidData = await vidRes.json();
            let trailer = vidData.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
            if (!trailer) {
              const vidResEn = await fetch(`https://api.themoviedb.org/3/${match.media_type}/${match.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
              const vidDataEn = await vidResEn.json();
              trailer = vidDataEn.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
            }
            if (trailer) setTrailerKey(trailer.key);
          } else if (selectedAnime.trailer?.youtube_id) {
            setTrailerKey(selectedAnime.trailer.youtube_id);
          }
        } catch {
          if (selectedAnime.trailer?.youtube_id) setTrailerKey(selectedAnime.trailer.youtube_id);
        }
      };

      fetchTmdb();
    }, [selectedAnime, modalMode]);

    const fetchEpisodes = async (tId: number, sNum: number) => {
      setSelectedSeason(sNum);
      try {
        const epRes = await fetch(`https://api.themoviedb.org/3/tv/${tId}/season/${sNum}?api_key=${TMDB_API_KEY}&language=fr-FR`);
        const epData = await epRes.json();
        setEpisodes(epData.episodes || []);
      } catch {}
    };

    let iframeSrc = '';
    if (mediaType === 'tv' && activeEpisode) {
      if (selectedServer === 'vidsrc_cc') {
        iframeSrc = `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${activeEpisode.s}/${activeEpisode.e}`;
      } else if (selectedServer === 'vidsrc_me') {
        iframeSrc = `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${activeEpisode.s}&episode=${activeEpisode.e}`;
      } else if (selectedServer === 'autoembed') {
        iframeSrc = `https://autoembed.co/tv/tmdb/${tmdbId}-${activeEpisode.s}-${activeEpisode.e}`;
      } else if (selectedServer === 'superembed') {
        iframeSrc = `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${activeEpisode.s}&e=${activeEpisode.e}`;
      } else if (selectedServer === 'vidlink') {
        iframeSrc = `https://vidlink.pro/tv/${tmdbId}/${activeEpisode.s}/${activeEpisode.e}`;
      } else if (selectedServer === 'vidsrc_to') {
        iframeSrc = `https://vidsrc.to/embed/tv/${tmdbId}/${activeEpisode.s}/${activeEpisode.e}`;
      } else if (selectedServer === 'vidsrc_pro') {
        iframeSrc = `https://vidsrc.pro/embed/tv/${tmdbId}/${activeEpisode.s}/${activeEpisode.e}`;
      } else {
        iframeSrc = `https://player.smashy.stream/tv/${tmdbId}?s=${activeEpisode.s}&e=${activeEpisode.e}`;
      }
    } else {
      if (selectedServer === 'vidsrc_cc') {
        iframeSrc = `https://vidsrc.cc/v2/embed/anime/${selectedAnime.mal_id}`;
      } else if (tmdbId) {
        iframeSrc = `https://vidsrc.me/embed/${mediaType}?tmdb=${tmdbId}`;
      } else {
        iframeSrc = `https://vidsrc.cc/v2/embed/anime/${selectedAnime.mal_id}`;
      }
    }

    return (
      <div className="fixed inset-0 z-[8000] bg-[#07080f] flex flex-col overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
        
        {/* Top bar */}
        <div className="w-full bg-[#0d0f18]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <LevelMovieLogo className="w-5 h-5" color="#ef4444" />
            <span className="text-red-500 font-black text-sm md:text-base tracking-widest uppercase">
              LEVEL<span className="text-white">ANIME</span>
            </span>
          </div>
          <button
            onClick={() => setSelectedAnime(null)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{isFr ? 'Fermer' : 'Close'}</span>
          </button>
        </div>

        {/* Video / Player Stage */}
        <div className="relative aspect-video max-h-[60vh] w-full bg-black flex items-center justify-center border-b border-white/10 overflow-hidden">
          {localMode === 'trailer' && trailerKey ? (
            <iframe
              className="w-full h-full bg-black"
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=1&rel=0`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : localMode === 'play' ? (
            <iframe
              key={iframeSrc}
              className="w-full h-full bg-black"
              src={iframeSrc}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              className="relative w-full h-full cursor-pointer group flex items-center justify-center"
              onClick={() => setLocalMode('play')}
            >
              <img
                src={selectedAnime.trailer?.images?.maximum_image_url || selectedAnime.images?.webp?.large_image_url}
                alt=""
                className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity"
              />
              <div className="absolute flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                  {isFr ? 'Lancer les épisodes' : 'Start Anime Stream'}
                </span>
              </div>
            </div>
          )}
        </div>

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
                {selectedAnime.title_english || selectedAnime.title}
              </h2>
              <div className="flex items-center gap-3 text-xs font-bold text-white/60 flex-wrap">
                <span className="text-green-400 border border-green-400/30 px-2 py-0.5 rounded bg-green-400/10">
                  VF & VOSTFR
                </span>
                <span>{selectedAnime.year || '2025'}</span>
                <span>{selectedAnime.episodes ? `${selectedAnime.episodes} EPS` : 'EN COURS'}</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> {selectedAnime.score || '8.8'}
                </span>
              </div>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed max-w-3xl">
                {selectedAnime.synopsis || "Aucun synopsis disponible."}
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
                onClick={() => setLocalMode('trailer')}
                disabled={!trailerKey}
                className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <Clapperboard className="w-4 h-4" />
                <span>Bande-annonce</span>
              </button>

              <button
                onClick={(e) => toggleWatchlist(selectedAnime, e)}
                className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAddedToWatchlist(selectedAnime.mal_id) ? (
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
                    <img
                      src={c.character?.images?.webp?.image_url}
                      alt=""
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border border-white/10"
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
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">
                {isFr ? 'Titres Recommandés' : 'Recommended'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {recommendations.map(r => (
                  <div
                    key={r.mal_id}
                    onClick={() => openAnimeModal(r, 'info')}
                    className="rounded-xl overflow-hidden border border-white/5 bg-[#121218] hover:scale-105 transition-transform cursor-pointer aspect-[2/3]"
                  >
                    <img
                      src={r.images?.webp?.large_image_url}
                      alt=""
                      className="w-full h-full object-cover"
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
  // MAIN BODY
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col pb-24">

      {/* Sub Header for LevelAnime */}
      <header className="sticky top-0 z-40 bg-[#080910]/95 backdrop-blur-xl border-b border-white/10 px-4 md:px-10 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Branding & Sub-navigation */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => { setCurrentCategory('home'); setSearchQuery(''); }}
            className="flex items-center gap-2 cursor-pointer font-black text-base md:text-lg uppercase tracking-wider group"
          >
            <LevelMovieLogo className="w-6 h-6 transition-transform group-hover:scale-110" color="#ef4444" />
            <span><span className="text-white">LEVEL</span><span className="text-red-500">ANIME</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-white/60">
            <button
              onClick={() => setCurrentCategory('home')}
              className={`hover:text-white transition-colors cursor-pointer ${currentCategory === 'home' ? 'text-red-500' : ''}`}
            >
              {isFr ? 'Accueil' : 'Home'}
            </button>
            <button
              onClick={() => setCurrentCategory('explore')}
              className={`hover:text-white transition-colors cursor-pointer ${currentCategory === 'explore' ? 'text-red-500' : ''}`}
            >
              {isFr ? 'Explorer' : 'Explore'}
            </button>
            <button
              onClick={() => setCurrentCategory('trending')}
              className={`hover:text-white transition-colors cursor-pointer ${currentCategory === 'trending' ? 'text-red-500' : ''}`}
            >
              Simulcasts
            </button>
            <button
              onClick={() => setCurrentCategory('watchlist')}
              className={`hover:text-white transition-colors cursor-pointer ${currentCategory === 'watchlist' ? 'text-red-500' : ''}`}
            >
              {isFr ? 'Ma Liste' : 'My List'}
            </button>
          </nav>
        </div>

        {/* Right: Search Omnibar & Surprise Me */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isFr ? "Rechercher un anime..." : "Search anime..."}
              className="bg-[#12141f] border border-white/10 text-white text-xs pl-9 pr-4 py-1.5 rounded-full outline-none w-44 sm:w-64 focus:border-red-500 transition-colors"
            />
          </div>

          <button
            onClick={handleSurpriseMe}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isFr ? 'Surprends-moi' : 'Surprise'}</span>
          </button>
        </div>

      </header>

      {/* Main Views */}
      {searchQuery.trim().length >= 3 ? (
        <div className="p-6 md:p-12 space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider border-l-4 border-red-500 pl-3">
            {isFr ? `Résultats pour "${searchQuery}"` : `Results for "${searchQuery}"`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {searchResults.map(anime => (
              <div
                key={anime.mal_id}
                onClick={() => openAnimeModal(anime, 'info')}
                className="relative rounded-xl overflow-hidden border border-white/5 bg-[#121218] hover:scale-105 transition-transform cursor-pointer aspect-[2/3]"
              >
                <img
                  src={anime.images?.webp?.large_image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-white text-xs font-bold line-clamp-2">
                    {anime.title_english || anime.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : currentCategory === 'watchlist' ? (
        <div className="p-6 md:p-12 space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider border-l-4 border-red-500 pl-3">
            {isFr ? 'Ma Liste d’Animes' : 'My Anime Watchlist'}
          </h2>
          {watchlist.length === 0 ? (
            <div className="py-24 text-center text-white/40 text-xs uppercase tracking-widest">
              {isFr ? 'Aucun anime enregistré dans vos favoris.' : 'No anime saved in your watchlist.'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchlist.map(anime => (
                <div
                  key={anime.mal_id}
                  onClick={() => openAnimeModal(anime, 'info')}
                  className="relative rounded-xl overflow-hidden border border-white/5 bg-[#121218] hover:scale-105 transition-transform cursor-pointer aspect-[2/3]"
                >
                  <img
                    src={anime.images?.webp?.large_image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-white text-xs font-bold line-clamp-2">
                      {anime.title_english || anime.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : currentCategory === 'explore' ? (
        <div className="p-6 md:p-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold uppercase tracking-wider border-l-4 border-red-500 pl-3">
              {isFr ? 'Explorer le Catalogue' : 'Explore Anime Database'}
            </h2>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors shrink-0 cursor-pointer ${
                  selectedGenre === null
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                Tous
              </button>
              {ANIME_GENRES.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors shrink-0 flex items-center gap-1 cursor-pointer ${
                    selectedGenre === g.id
                      ? 'bg-red-600 text-white'
                      : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{g.icon}</span>
                  <span>{g.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {exploreAnime.map(anime => (
              <div
                key={anime.mal_id}
                onClick={() => openAnimeModal(anime, 'info')}
                className="relative rounded-xl overflow-hidden border border-white/5 bg-[#121218] hover:scale-105 transition-transform cursor-pointer aspect-[2/3]"
              >
                <img
                  src={anime.images?.webp?.large_image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-white text-xs font-bold line-clamp-2">
                    {anime.title_english || anime.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {loadingExplore && (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-red-500" />
            </div>
          )}
        </div>
      ) : (
        <>
          {renderHeroBanner()}

          <main className="space-y-4 pt-6">
            {history.length > 0 && renderAnimeRow(isFr ? 'Reprendre le visionnage' : 'Continue Watching', history)}
            {renderTop10Row(isFr ? 'Top 10 de la Semaine' : 'Top 10 This Week', popular)}
            {renderAnimeRow(isFr ? 'Action & Combats Épiques' : 'Action & Adventure', actionAnime)}
            {renderAnimeRow(isFr ? 'Simulcasts & Nouveautés' : 'Currently Airing', trending)}
            {renderAnimeRow(isFr ? 'Chefs-d’œuvre Mieux Notés' : 'Top Rated Anime', topRated)}
            {renderAnimeRow(isFr ? 'Romance, Drame & Émotions' : 'Romance & Drama', romanceAnime)}
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
      {selectedAnime && renderAnimeModal()}

    </div>
  );
};
