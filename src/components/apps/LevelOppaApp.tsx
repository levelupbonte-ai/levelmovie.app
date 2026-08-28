import React, { useState, useEffect } from 'react';
import {
  Flame, Play, Ticket, Satellite,
  X, RotateCw, Bookmark, Share2, Star,
  Film, Sparkles, Tv, Gamepad2, Wrench, Music, Trophy, Globe,
  TrendingUp, Volume2, Calendar, BookOpen
} from 'lucide-react';
import {
  fetchOppaBookmarksSupabase,
  syncOppaBookmarksSupabase
} from '../../lib/supabase';
import { InAppBrowserModal, InAppBrowserData } from './InAppBrowserModal';

interface LevelOppaAppProps {
  onClose?: () => void;
  lang?: string;
  user?: any;
}

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY || '027cc951d888c64e5f15dcb853c7347a';

export const LevelOppaApp: React.FC<LevelOppaAppProps> = ({ lang = 'fr', user }) => {
  const isFr = lang === 'fr';
  const userId = user?.uid || 'levelmovie_user';

  const [activeTab, setActiveTab] = useState<'actus' | 'moments' | 'shows' | 'radar'>('actus');
  const [newsCategory, setNewsCategory] = useState<string>('all');
  const [momentsCategory, setMomentsCategory] = useState<'all' | 'anime' | 'movies'>('all');
  const [showsCategory, setShowsCategory] = useState<'anime' | 'movies' | 'top_rated'>('anime');

  // Stories
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [currentStorySeq, setCurrentStorySeq] = useState<string>('flash');
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storySequences, setStorySequences] = useState<Record<string, any[]>>({
    flash: [],
    filmJour: [],
    topFilms: [],
    animeNouveaux: [],
    animeTop: []
  });
  const [seenStories, setSeenStories] = useState<Set<string>>(new Set());

  // Feeds data
  const [newsFeed, setNewsFeed] = useState<any[]>([]);
  const [momentsData, setMomentsData] = useState<any[]>([]);
  const [showsData, setShowsData] = useState<any[]>([]);
  const [radarMovies, setRadarMovies] = useState<any[]>([]);
  const [savedBookmarks, setSavedBookmarks] = useState<Set<string>>(new Set());
  const [loadingFeed, setLoadingFeed] = useState(false);

  // Detail / Trailer Modal
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);
  const [activeTrailerTitle, setActiveTrailerTitle] = useState<string>('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // In-App Browser State
  const [inAppBrowserData, setInAppBrowserData] = useState<InAppBrowserData | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Load Bookmarks from Supabase
  useEffect(() => {
    (async () => {
      const bmarks = await fetchOppaBookmarksSupabase(userId);
      if (bmarks && bmarks.length > 0) {
        setSavedBookmarks(new Set(bmarks));
      }
    })();
  }, [userId]);

  // Load News from Backend RSS Multi-Source Endpoint
  const loadNews = async (cat: string) => {
    setLoadingFeed(true);
    try {
      const res = await fetch(`/api/news?category=${cat}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setNewsFeed(data);
          return;
        }
      }
    } catch {
      // fallback
    } finally {
      setLoadingFeed(false);
    }

    // Fallback directly to TMDB trending movies/anime if RSS is cold
    try {
      const tmdbRes = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_KEY}&language=fr-FR`);
      const tmdbData = await tmdbRes.json();
      if (tmdbData.results) {
        const fallback = tmdbData.results.map((m: any) => ({
          title: m.title || m.name,
          link: '#',
          desc: m.overview || 'Disponible en streaming HD sur LevelMovie.',
          date: m.release_date || m.first_air_date || new Date().toISOString(),
          img: m.backdrop_path ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}` : (m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : ''),
          source: 'TMDB Cinema',
          category: 'movies',
          tmdbId: m.id,
          mediaType: m.media_type || (m.first_air_date ? 'tv' : 'movie')
        }));
        setNewsFeed(fallback);
      }
    } catch (e) {
      console.warn('Fallback error:', e);
    }
  };

  // Load Moments Data (Anime + Movies Trailers with Thousands of titles)
  const loadMoments = async (filter: 'all' | 'anime' | 'movies') => {
    try {
      let combined: any[] = [];
      if (filter === 'anime' || filter === 'all') {
        const aRes = await fetch('/api/tmdb/anime?type=popular');
        const aData = await aRes.json();
        if (aData.results) {
          combined = combined.concat(aData.results.map((a: any) => ({
            ...a,
            tag: 'Anime Masterpiece',
            isTv: true
          })));
        }
      }

      if (filter === 'movies' || filter === 'all') {
        const mRes = await fetch('/api/tmdb/catalogue?cat=trending');
        const mData = await mRes.json();
        if (mData.results) {
          combined = combined.concat(mData.results.map((m: any) => ({
            ...m,
            tag: 'Trailer Reel',
            isTv: m.media_type === 'tv'
          })));
        }
      }

      // Shuffle slightly for vibrant feed
      setMomentsData(combined);
    } catch (err) {
      console.warn('Moments load error:', err);
    }
  };

  // Load Shows Catalog
  const loadShows = async (cat: 'anime' | 'movies' | 'top_rated') => {
    try {
      if (cat === 'anime') {
        const res = await fetch('/api/tmdb/anime?type=popular');
        const d = await res.json();
        setShowsData(d.results || []);
      } else if (cat === 'movies') {
        const res = await fetch('/api/tmdb/catalogue?cat=popular');
        const d = await res.json();
        setShowsData(d.results || []);
      } else {
        const res = await fetch('/api/tmdb/catalogue?cat=top_rated');
        const d = await res.json();
        setShowsData(d.results || []);
      }
    } catch (e) {
      console.warn('Shows load error:', e);
    }
  };

  // Initial Stories and Radar setup
  const initStoriesAndRadar = async () => {
    try {
      const [trendRes, upcomingRes, animeRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_KEY}&language=fr-FR`),
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_KEY}&language=fr-FR&page=1`),
        fetch(`/api/tmdb/anime?type=popular`)
      ]);

      const [trendData, upcomingData, animeData] = await Promise.all([
        trendRes.json(), upcomingRes.json(), animeRes.json()
      ]);

      const trending = trendData.results || [];
      const upcoming = upcomingData.results || [];
      const animes = animeData.results || [];

      setRadarMovies(upcoming);

      // Setup Stories
      const flashItems = trending.slice(0, 6).map((m: any, i: number) => ({
        headerTitle: "Flash Cinema",
        title: m.title || m.name,
        contentText: m.overview || "Actualité brûlante en direct du box-office international.",
        contentImg: m.backdrop_path ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}` : `https://image.tmdb.org/t/p/w780${m.poster_path}`,
        time: `Il y a ${(i + 1) * 2} min`,
        tag: 'Flash Info'
      }));

      const randomPick = trending[0] || {};
      const filmJourItem = [{
        headerTitle: "Film du Jour",
        title: randomPick.title || randomPick.name || "Sélection Incontournable",
        contentText: randomPick.overview || "Le film recommandé aujourd'hui par l'algorithme LevelMovie.",
        contentImg: randomPick.backdrop_path ? `https://image.tmdb.org/t/p/w1280${randomPick.backdrop_path}` : `https://image.tmdb.org/t/p/w780${randomPick.poster_path}`,
        time: 'Aujourd\'hui',
        tag: 'Coup de Cœur'
      }];

      const topFilmsItems = trending.slice(0, 6).map((m: any, i: number) => ({
        headerTitle: "Top Box-Office",
        title: m.title || m.name,
        contentText: m.overview || "Production cinématographique acclamée par la critique.",
        contentImg: `https://image.tmdb.org/t/p/w780${m.poster_path}`,
        time: `Note: ${m.vote_average?.toFixed(1)}/10`,
        tag: `#${i + 1} Mondial`
      }));

      const animeItems = animes.slice(0, 6).map((a: any, i: number) => ({
        headerTitle: "Nouveautés Anime",
        title: a.title,
        contentText: a.desc || "Plongez dans les derniers épisodes et films d'animation japonais.",
        contentImg: a.img,
        time: `Note: ${a.rating}/10`,
        tag: `#${i + 1} Otaku`
      }));

      setStorySequences({
        flash: flashItems,
        filmJour: filmJourItem,
        topFilms: topFilmsItems,
        animeNouveaux: animeItems,
        animeTop: animeItems
      });

    } catch (e) {
      console.warn('Stories init error:', e);
    }
  };

  useEffect(() => {
    initStoriesAndRadar();
    loadNews(newsCategory);
    loadMoments(momentsCategory);
    loadShows(showsCategory);
  }, []);

  // Handle Tab Switch / Category Change
  const handleSelectNewsCategory = (cat: string) => {
    setNewsCategory(cat);
    loadNews(cat);
  };

  const handleSelectMomentsCategory = (cat: 'all' | 'anime' | 'movies') => {
    setMomentsCategory(cat);
    loadMoments(cat);
  };

  const handleSelectShowsCategory = (cat: 'anime' | 'movies' | 'top_rated') => {
    setShowsCategory(cat);
    loadShows(cat);
  };

  // Story open handler
  const openStory = (type: string) => {
    setCurrentStorySeq(type);
    setCurrentStoryIndex(0);
    setStoryModalOpen(true);
    setSeenStories(prev => new Set([...prev, type]));
  };

  // Toggle bookmark
  const toggleBookmark = async (articleId: string) => {
    const next = new Set<string>(savedBookmarks);
    if (next.has(articleId)) {
      next.delete(articleId);
      showToast(isFr ? 'Retiré de vos favoris' : 'Removed from bookmarks');
    } else {
      next.add(articleId);
      showToast(isFr ? 'Enregistré dans votre Espace !' : 'Saved to your Space!');
    }
    setSavedBookmarks(next);
    await syncOppaBookmarksSupabase(userId, Array.from(next));
  };

  // Fetch Trailer with YouTube Key & Sound
  const handleFetchTrailer = async (id: number | string, isTv = false, title = '') => {
    try {
      showToast(isFr ? 'Chargement de la bande-annonce HD...' : 'Loading HD trailer...');
      setActiveTrailerTitle(title);
      const res = await fetch(`/api/tmdb/trailer/${id}?type=${isTv ? 'tv' : 'movie'}`);
      if (res.ok) {
        const d = await res.json();
        if (d.key) {
          setActiveTrailerKey(d.key);
          return;
        }
      }
      
      // Fallback direct TMDB
      const direct = await fetch(`https://api.themoviedb.org/3/${isTv ? 'tv' : 'movie'}/${id}/videos?api_key=${TMDB_KEY}&language=fr-FR`);
      const dd = await direct.json();
      let video = dd.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') || dd.results?.[0];
      if (video?.key) {
        setActiveTrailerKey(video.key);
      } else {
        showToast(isFr ? 'Bande-annonce introuvable pour ce titre.' : 'Trailer not found for this title.');
      }
    } catch {
      showToast(isFr ? 'Erreur réseau.' : 'Network error.');
    }
  };

  return (
    <div className="w-full h-full bg-[#050507] text-white flex flex-col overflow-hidden relative font-sans select-none">

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 right-4 z-[9999] bg-[#121218] border border-purple-500/40 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold animate-in fade-in">
          {toastMsg}
        </div>
      )}

      {/* Trailer Modal Player (HD with Full Sound) */}
      {activeTrailerKey && (
        <div className="fixed inset-0 z-[9800] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden border border-white/15 shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col">
            <div className="h-10 px-4 bg-[#0a0a10] border-b border-white/10 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-white/90 truncate flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-red-500 fill-current" />
                <span>{activeTrailerTitle || 'Bande-Annonce HD Officielle'}</span>
              </span>
              <button
                onClick={() => setActiveTrailerKey(null)}
                className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <iframe
              src={`https://www.youtube.com/embed/${activeTrailerKey}?autoplay=1&enablejsapi=1`}
              className="w-full flex-1 border-none"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Story Viewer Modal */}
      {storyModalOpen && storySequences[currentStorySeq] && (
        <div className="fixed inset-0 z-[9500] bg-black flex flex-col justify-between p-4 animate-in fade-in">
          {/* Top Progress Bars */}
          <div className="space-y-3 z-20">
            <div className="flex gap-1.5">
              {storySequences[currentStorySeq].map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: i < currentStoryIndex ? '100%' : i === currentStoryIndex ? '100%' : '0%' }}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-bold text-xs">
                  LVL
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-none">LevelUp Story</div>
                  <span className="text-[10px] text-white/50">{storySequences[currentStorySeq][currentStoryIndex]?.time}</span>
                </div>
              </div>
              <button onClick={() => setStoryModalOpen(false)} className="text-white/70 hover:text-white cursor-pointer p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Story Background Content */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {storySequences[currentStorySeq][currentStoryIndex]?.contentImg && (
              <img
                src={storySequences[currentStorySeq][currentStoryIndex].contentImg}
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70" />
          </div>

          {/* Story Tap areas */}
          <div className="absolute inset-0 z-20 flex">
            <div
              className="w-1/2 h-full cursor-pointer"
              onClick={() => {
                if (currentStoryIndex > 0) setCurrentStoryIndex(currentStoryIndex - 1);
              }}
            />
            <div
              className="w-1/2 h-full cursor-pointer"
              onClick={() => {
                if (currentStoryIndex < storySequences[currentStorySeq].length - 1) {
                  setCurrentStoryIndex(currentStoryIndex + 1);
                } else {
                  setStoryModalOpen(false);
                }
              }}
            />
          </div>

          {/* Bottom Story Card */}
          <div className="relative z-30 p-5 rounded-3xl bg-black/80 backdrop-blur-xl border border-white/10 space-y-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-600/40 text-purple-300 border border-purple-500/30">
              {storySequences[currentStorySeq][currentStoryIndex]?.tag}
            </span>
            <h3 className="text-lg font-bold text-white leading-snug">
              {storySequences[currentStorySeq][currentStoryIndex]?.title}
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              {storySequences[currentStorySeq][currentStoryIndex]?.contentText}
            </p>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-[9700] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img src={zoomedImage} alt="" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
        </div>
      )}

      {/* Top Gradient Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-600 opacity-90 shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.5)]" />

      {/* Main View Area */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar ${activeTab === 'moments' ? 'p-2 sm:p-4 pb-20' : 'p-4 pb-24'}`}>

        {/* ======================================================== */}
        {/* TAB 1: OPPA (ACTUS, MULTI-SOURCES RSS, ANIME & CINEMA)    */}
        {/* ======================================================== */}
        {activeTab === 'actus' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
            
            {/* Story Bar */}
            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
              {[
                { id: 'flash', title: 'Flash Info', icon: Sparkles, color: 'from-purple-500 to-indigo-600' },
                { id: 'filmJour', title: 'Film du Jour', icon: Ticket, color: 'from-fuchsia-500 to-pink-600' },
                { id: 'animeNouveaux', title: 'Nouveautés Anime', icon: Flame, color: 'from-blue-500 to-cyan-600' },
                { id: 'topFilms', title: 'Top Box-Office', icon: Film, color: 'from-red-500 to-rose-600' },
                { id: 'animeTop', title: 'Top Otaku', icon: Star, color: 'from-amber-500 to-orange-600' }
              ].map(st => {
                const isSeen = seenStories.has(st.id);
                return (
                  <div
                    key={st.id}
                    onClick={() => openStory(st.id)}
                    className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                  >
                    <div className={`w-14 h-14 rounded-full p-[2px] ${isSeen ? 'bg-white/20' : `bg-gradient-to-tr ${st.color} shadow-lg`} transition-all group-hover:scale-105`}>
                      <div className="w-full h-full rounded-full bg-[#08080c] border-2 border-black flex items-center justify-center">
                        <st.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-white/70">{st.title}</span>
                  </div>
                );
              })}
            </div>

            {/* News Categories Filters (Gaming, Otaku/Anime, Tools, Movies, Music, Sports, World, Economy) */}
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
              {[
                { id: 'all', label: isFr ? 'Tout le flux' : 'All Feeds', icon: Flame },
                { id: 'otaku', label: 'Anime & Manga', icon: Sparkles },
                { id: 'movies', label: 'Cinéma & Séries', icon: Film },
                { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
                { id: 'tools', label: 'Tech & Geek', icon: Wrench },
                { id: 'music', label: 'Musique', icon: Music },
                { id: 'sports', label: 'Sports', icon: Trophy },
                { id: 'world', label: 'Monde & Actualités', icon: Globe }
              ].map(cat => {
                const Icon = cat.icon;
                const active = newsCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectNewsCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      active
                        ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Loading Indicator */}
            {loadingFeed && (
              <div className="flex items-center justify-center py-10 text-purple-400 gap-2">
                <RotateCw className="w-5 h-5 animate-spin" />
                <span className="text-xs font-bold">{isFr ? 'Actualisation des flux en direct...' : 'Updating live feeds...'}</span>
              </div>
            )}

            {/* Actus Articles Feed */}
            <div className="space-y-4">
              {newsFeed.map((item, idx) => (
                <div key={idx} className="rounded-2xl bg-[#0c0c12] border border-white/5 overflow-hidden shadow-lg space-y-3 group hover:border-purple-500/20 transition-all">
                  
                  {/* Article Source Header */}
                  <div className="p-4 pb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black text-xs">
                        {(item.source || 'LVL').slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{item.source || 'LevelUp News'}</div>
                        <span className="text-[10px] text-white/40">
                          {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.video && (
                        <button
                          onClick={() => {
                            if (item.video?.includes('embed') || item.video?.includes('youtube')) {
                              setActiveTrailerKey(item.video.split('/').pop()?.split('?')[0] || null);
                            } else {
                              window.open(item.video, '_blank');
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" /> Vidéo
                        </button>
                      )}
                      {item.tmdbId && (
                        <button
                          onClick={() => handleFetchTrailer(item.tmdbId, item.mediaType === 'tv', item.title)}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" /> Trailer
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title and Snippet */}
                  <div 
                    className="px-4 cursor-pointer"
                    onClick={() => {
                      if (item.link && item.link !== '#') {
                        setInAppBrowserData({
                          url: item.link,
                          title: item.title,
                          source: item.source,
                          snippet: item.desc,
                          img: item.img,
                          date: item.date
                        });
                      }
                    }}
                  >
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/60 mt-1 line-clamp-3 leading-relaxed">
                      {item.desc?.replace(/<[^>]*>?/gm, '')}
                    </p>
                  </div>

                  {/* Image Backdrop */}
                  {item.img && (
                    <div 
                      onClick={() => setZoomedImage(item.img)}
                      className="relative aspect-video max-h-80 bg-black/50 cursor-pointer overflow-hidden"
                    >
                      <img 
                        src={item.img} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                        onError={(e) => { (e.target as any).style.display = 'none'; }}
                      />
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="p-3 px-4 flex items-center justify-between border-t border-white/5 text-white/60">
                    <button
                      onClick={() => toggleBookmark(item.title)}
                      className={`text-xs flex items-center gap-1.5 cursor-pointer ${
                        savedBookmarks.has(item.title) ? 'text-purple-400 font-bold' : 'hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${savedBookmarks.has(item.title) ? 'fill-current' : ''}`} />
                      <span>{savedBookmarks.has(item.title) ? (isFr ? 'Enregistré' : 'Saved') : (isFr ? 'Sauvegarder' : 'Save')}</span>
                    </button>

                    {item.link && item.link !== '#' && (
                      <button
                        onClick={() => {
                          setInAppBrowserData({
                            url: item.link,
                            title: item.title,
                            source: item.source,
                            snippet: item.desc,
                            img: item.img,
                            date: item.date
                          });
                        }}
                        className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 cursor-pointer bg-purple-600/10 hover:bg-purple-600/20 px-2.5 py-1 rounded-lg border border-purple-500/20 transition-all"
                      >
                        <span>{isFr ? "Lire dans l'app" : "Read in app"}</span>
                        <BookOpen className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MOMENTS (FULLSCREEN TIKTOK / REELS WITH HD SOUND) */}
        {/* ======================================================== */}
        {activeTab === 'moments' && (
          <div className="w-full max-w-2xl mx-auto space-y-4 animate-in fade-in">
            
            {/* Quick Filter Bar */}
            <div className="flex items-center justify-center gap-2 pb-2">
              {[
                { id: 'all', label: isFr ? 'Tout (Anime & Cinéma)' : 'All Trailers' },
                { id: 'anime', label: 'Anime Moments' },
                { id: 'movies', label: 'Films & Blockbusters' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => handleSelectMomentsCategory(f.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    momentsCategory === f.id
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'bg-black/50 text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Video Cards Stream */}
            <div className="space-y-6 snap-y snap-mandatory">
              {momentsData.map((vid, idx) => (
                <div 
                  key={idx} 
                  className="snap-start relative w-full h-[calc(100vh-160px)] min-h-[520px] rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl flex flex-col justify-between p-6 sm:p-8 group"
                >
                  {/* Fullscreen Backdrop Image */}
                  <img 
                    src={vid.img} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
                  
                  {/* Top Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600/40 text-red-300 border border-red-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                      <Play className="w-3 h-3 fill-current" /> {vid.tag || 'Moment Reel'} #{idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> {vid.rating}/10
                    </span>
                  </div>

                  {/* Right Floating Actions */}
                  <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-3">
                    <button
                      onClick={() => toggleBookmark(String(vid.id))}
                      className={`w-12 h-12 rounded-full backdrop-blur-xl border flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90 ${
                        savedBookmarks.has(String(vid.id))
                          ? 'bg-purple-600/90 border-purple-400 text-white'
                          : 'bg-black/60 border-white/15 text-white/80 hover:text-white hover:bg-black/80'
                      }`}
                      title={isFr ? "Sauvegarder" : "Bookmark"}
                    >
                      <Bookmark className={`w-5 h-5 ${savedBookmarks.has(String(vid.id)) ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: vid.title, text: vid.desc, url: window.location.href }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(`${vid.title} - LevelOppa Moment`);
                          showToast(isFr ? 'Lien copié dans le presse-papiers !' : 'Link copied to clipboard!');
                        }
                      }}
                      className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-white/80 hover:text-white hover:bg-black/80 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
                      title={isFr ? "Partager" : "Share"}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Bottom Content & Play Action */}
                  <div className="relative z-10 space-y-3 pr-16">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                      {vid.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 line-clamp-3 leading-relaxed drop-shadow-sm">
                      {vid.desc}
                    </p>
                    
                    <button
                      onClick={() => handleFetchTrailer(vid.id, vid.isTv, vid.title)}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(225,29,72,0.4)] cursor-pointer active:scale-95 transition-all mt-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isFr ? 'Lancer la Bande-Annonce Complète (Son HD)' : 'Watch Full HD Trailer with Sound'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SHOWS (THOUSANDS OF ANIME & CINEMA PRODUCTIONS)    */}
        {/* ======================================================== */}
        {activeTab === 'shows' && (
          <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in">
            
            {/* Catalog Filter Header */}
            <div className="flex items-center justify-between gap-2 bg-[#0c0c14] p-3 rounded-2xl border border-white/5">
              <span className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-purple-400" />
                <span>{isFr ? 'Catalogue Oppa' : 'Oppa Catalog'}</span>
              </span>
              <div className="flex gap-1.5">
                {[
                  { id: 'anime', label: 'Anime Japonais' },
                  { id: 'movies', label: 'Films Populaires' },
                  { id: 'top_rated', label: 'Chefs d’œuvre' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectShowsCategory(c.id as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      showsCategory === c.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Posters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {showsData.map((show, i) => (
                <div
                  key={i}
                  onClick={() => handleFetchTrailer(show.id, show.type === 'tv', show.title)}
                  className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#101018] border border-white/5 cursor-pointer shadow-md hover:border-purple-500/40 transition-all"
                >
                  <img src={show.poster || show.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-3">
                    <div className="text-xs font-bold text-white truncate">{show.title}</div>
                    <div className="text-[10px] font-semibold text-amber-400 flex items-center justify-between mt-1">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> {show.rating}/10
                      </span>
                      <span className="text-[9px] text-purple-300 font-bold bg-purple-900/40 px-1.5 py-0.5 rounded border border-purple-500/30">
                        Trailer HD
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: RADAR (UPCOMING CINEMA & RELEASES)                 */}
        {/* ======================================================== */}
        {activeTab === 'radar' && (
          <div className="space-y-4 max-w-3xl mx-auto animate-in fade-in">
            <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-900/30 to-purple-900/20 border border-white/10 space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Satellite className="w-5 h-5 text-blue-400" />
                <span>Radar Sorties & Séances Mondiales</span>
              </h2>
              <p className="text-xs text-white/60">Les prochains blockbusters et chefs-d'œuvre à venir au cinéma.</p>
            </div>

            <div className="space-y-3">
              {radarMovies.map((m: any) => (
                <div key={m.id} className="p-4 rounded-2xl bg-[#0c0c12] border border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={m.poster_path ? `https://image.tmdb.org/t/p/w185${m.poster_path}` : ''}
                      alt=""
                      className="w-12 h-16 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{m.title}</div>
                      <div className="text-[10px] text-white/40 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-purple-400" />
                        <span>Sortie : {m.release_date || 'Prochainement'}</span>
                      </div>
                      <p className="text-[10px] text-white/50 line-clamp-1 mt-1">{m.overview}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast(`Alerte programmée pour ${m.title} !`)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[10px] font-bold shrink-0 cursor-pointer"
                  >
                    Suivre
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Nav Bar */}
      <nav className="h-14 px-6 bg-[#08080c]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around shrink-0 z-30">
        {[
          { id: 'actus', icon: Flame, label: 'Oppa' },
          { id: 'moments', icon: Play, label: 'Moments' },
          { id: 'shows', icon: Ticket, label: 'Shows' },
          { id: 'radar', icon: Satellite, label: 'Radar' }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                active ? 'text-purple-400 font-bold scale-105' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* In-App Browser Modal */}
      {inAppBrowserData && (
        <InAppBrowserModal
          data={inAppBrowserData}
          onClose={() => setInAppBrowserData(null)}
          lang={lang}
        />
      )}

    </div>
  );
};
