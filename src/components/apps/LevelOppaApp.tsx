import React, { useState, useEffect, useRef } from 'react';
import {
  Flame, Play, Ticket, Satellite, UserCheck, Search, Bell,
  X, RotateCw, Heart, Bookmark, Share2, Star, ShieldCheck,
  Film, Send, Eye, LogOut, ChevronRight, ExternalLink, Calendar,
  Volume2, VolumeX, Sparkles, Plus, Check
} from 'lucide-react';
import {
  fetchNotificationsSupabase,
  createNotificationSupabase,
  fetchOppaBookmarksSupabase,
  syncOppaBookmarksSupabase
} from '../../lib/supabase';

interface LevelOppaAppProps {
  onClose?: () => void;
  lang?: string;
  user?: any;
}

const TMDB_KEY = '027cc951d888c64e5f15dcb853c7347a';

export const LevelOppaApp: React.FC<LevelOppaAppProps> = ({ onClose, lang = 'fr', user }) => {
  const isFr = lang === 'fr';
  const userId = user?.uid || 'user_local_oppa';

  const [activeTab, setActiveTab] = useState<'actus' | 'moments' | 'shows' | 'radar' | 'espace'>('actus');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

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
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Admin Broadcast notification
  const [adminTitle, setAdminTitle] = useState('');
  const [adminBody, setAdminBody] = useState('');
  const [adminType, setAdminType] = useState('info');
  const [sendingPush, setSendingPush] = useState(false);

  // Key login & PIN
  const [userKey, setUserKey] = useState(localStorage.getItem('lvl_oppa_key') || 'LVL-2026-VIP01');
  const [isKeyLoggedIn, setIsKeyLoggedIn] = useState(true);
  const [revealedPin, setRevealedPin] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Load Bookmarks & Notifications from Supabase
  useEffect(() => {
    (async () => {
      const bmarks = await fetchOppaBookmarksSupabase(userId);
      if (bmarks && bmarks.length > 0) {
        setSavedBookmarks(new Set(bmarks));
      }
      const notifs = await fetchNotificationsSupabase();
      if (notifs && notifs.length > 0) {
        setNotifications(notifs);
      } else {
        setNotifications([
          { id: '1', title: 'Bienvenue sur Oppa !', body: 'Découvrez le fil cinéma, les trailers Moments et les sorties Radar.', type: 'new', created_at: new Date().toISOString() },
          { id: '2', title: 'Nouveaux films en direct', body: 'Le catalogue mondial est synchronisé en temps réel.', type: 'info', created_at: new Date().toISOString() }
        ]);
      }
    })();
  }, [userId]);

  // Load TMDB & News Feeds
  const loadFeeds = async () => {
    setLoadingFeed(true);
    try {
      const [trendRes, popRes, yearRes, upcomingRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}&language=fr-FR`),
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&language=fr-FR&sort_by=popularity.desc`),
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&language=fr-FR&primary_release_year=2025&sort_by=vote_average.desc&vote_count.gte=200`),
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_KEY}&language=fr-FR&page=1`)
      ]);

      const [trendData, popData, yearData, upcomingData] = await Promise.all([
        trendRes.json(), popRes.json(), yearRes.json(), upcomingRes.json()
      ]);

      const trendingMovies = trendData.results || [];
      const popMovies = popData.results || [];
      const topYearMovies = yearData.results || [];
      const upcomingMovies = upcomingData.results || [];

      // 1. Stories setup
      const flashItems = trendingMovies.slice(0, 5).map((m: any, i: number) => ({
        headerTitle: "Flash Info",
        title: m.title,
        contentText: m.overview || "Mise à jour en direct depuis le box-office mondial.",
        contentImg: `https://image.tmdb.org/t/p/w780${m.poster_path}`,
        time: `Il y a ${(i + 1) * 3} min`,
        tag: 'Urgent'
      }));

      const randomMovie = trendingMovies[0] || popMovies[0] || {};
      const filmJourItem = [{
        headerTitle: "Film du Jour",
        title: randomMovie.title || "Sélection Cinéma",
        contentText: randomMovie.overview || "Le film incontournable des dernières 24h.",
        contentImg: `https://image.tmdb.org/t/p/w780${randomMovie.poster_path}`,
        time: 'Aujourd\'hui',
        tag: 'Coup de Cœur'
      }];

      const topFilmsItems = topYearMovies.slice(0, 6).map((m: any, i: number) => ({
        headerTitle: "Top Films",
        title: m.title,
        contentText: m.overview || "Chef d'œuvre noté au sommet par les spectateurs.",
        contentImg: `https://image.tmdb.org/t/p/w780${m.poster_path}`,
        time: `Note: ${m.vote_average?.toFixed(1)}/10`,
        tag: `#${i + 1} de l'Année`
      }));

      setStorySequences({
        flash: flashItems,
        filmJour: filmJourItem,
        topFilms: topFilmsItems,
        animeNouveaux: topFilmsItems,
        animeTop: topFilmsItems
      });

      // 2. Actus Feed
      const actusList = popMovies.slice(0, 15).map((m: any) => ({
        id: `movie_${m.id}`,
        title: m.title,
        desc: m.overview || 'Synopsis complet disponible dans LevelMovie.',
        img: m.backdrop_path ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}` : `https://image.tmdb.org/t/p/w780${m.poster_path}`,
        poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
        rating: m.vote_average?.toFixed(1) || '8.0',
        date: m.release_date || '2025',
        label: 'LevelMovie'
      }));
      setNewsFeed(actusList);

      // 3. Moments Feed
      const momentsList = popMovies.slice(0, 10).map((m: any) => ({
        id: m.id,
        title: m.title,
        desc: m.overview || '',
        img: `https://image.tmdb.org/t/p/w780${m.poster_path}`,
        rating: m.vote_average?.toFixed(1) || '7.8',
        likes: m.vote_count || 1240
      }));
      setMomentsData(momentsList);

      // 4. Shows Feed
      const showsList = topYearMovies.slice(0, 12).map((m: any) => ({
        id: m.id,
        title: m.title,
        desc: m.overview || '',
        img: `https://image.tmdb.org/t/p/w1280${m.poster_path || m.backdrop_path}`,
        rating: m.vote_average?.toFixed(1) || '8.5'
      }));
      setShowsData(showsList);

      // 5. Radar
      setRadarMovies(upcomingMovies);

    } catch (err) {
      console.warn('Oppa feed error:', err);
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    loadFeeds();
  }, []);

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
      showToast(isFr ? 'Article retiré des signets' : 'Bookmark removed');
    } else {
      next.add(articleId);
      showToast(isFr ? 'Article enregistré dans votre Espace !' : 'Bookmark saved!');
    }
    setSavedBookmarks(next);
    await syncOppaBookmarksSupabase(userId, Array.from(next));
  };

  // Broadcast push to Supabase
  const handleSendPush = async () => {
    if (!adminTitle.trim() || !adminBody.trim()) {
      showToast(isFr ? 'Veuillez remplir le titre et le message.' : 'Please fill all fields.');
      return;
    }
    setSendingPush(true);
    const success = await createNotificationSupabase({
      title: adminTitle.trim(),
      body: adminBody.trim(),
      type: adminType
    });
    if (success) {
      setNotifications(prev => [
        { id: Date.now().toString(), title: adminTitle.trim(), body: adminBody.trim(), type: adminType, created_at: new Date().toISOString() },
        ...prev
      ]);
      setAdminTitle('');
      setAdminBody('');
      showToast(isFr ? 'Notification diffusée avec succès !' : 'Push notification broadcasted!');
    } else {
      showToast(isFr ? 'Erreur lors de la diffusion.' : 'Broadcast failed.');
    }
    setSendingPush(false);
  };

  const handleFetchTrailer = async (movieId: number) => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_KEY}&language=fr-FR`);
      const d = await res.json();
      let video = d.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') || d.results?.[0];
      if (video?.key) {
        setActiveTrailerKey(video.key);
      } else {
        showToast(isFr ? 'Bande-annonce non disponible.' : 'Trailer not available.');
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

      {/* Trailer Modal */}
      {activeTrailerKey && (
        <div className="fixed inset-0 z-[9800] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${activeTrailerKey}?autoplay=1`}
              className="w-full h-full border-none"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
            <button
              onClick={() => setActiveTrailerKey(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
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

      {/* Notifications Modal */}
      {notifModalOpen && (
        <div 
          className="fixed inset-0 z-[9600] bg-black/80 backdrop-blur-sm flex flex-col justify-end"
          onClick={() => setNotifModalOpen(false)}
        >
          <div 
            className="w-full max-h-[80vh] bg-[#121218] rounded-t-3xl border-t border-white/10 p-6 flex flex-col space-y-4 shadow-2xl animate-in slide-in-from-bottom"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-400" />
                <span>{isFr ? 'Centre de Notifications' : 'Notification Center'}</span>
              </h3>
              <button onClick={() => setNotifModalOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
              {notifications.map((n, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{n.title}</span>
                    <span className="text-[10px] font-mono text-white/40">
                      {new Date(n.created_at || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-white/60">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer Modal */}
      {storyModalOpen && storySequences[currentStorySeq] && (
        <div className="fixed inset-0 z-[9500] bg-black flex flex-col justify-between p-4 animate-in fade-in">
          {/* Top Bars */}
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
              <button onClick={() => setStoryModalOpen(false)} className="text-white/70 hover:text-white">
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

      {/* Top Header */}
      <header className="h-14 px-4 bg-[#08080c]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
          <span className="font-black text-sm tracking-wider">LevelUp <span className="text-purple-400">Oppa</span></span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setNotifModalOpen(true)}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
          </button>
        </div>
      </header>

      {/* Search Sub-bar */}
      {searchOpen && (
        <div className="p-3 bg-[#0e0e14] border-b border-white/10 z-20">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder={isFr ? 'Rechercher une actu, un film...' : 'Search news or movies...'}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-9 pr-8 text-xs text-white outline-none focus:border-purple-500"
            />
            {searchQ && (
              <button onClick={() => setSearchQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-24">

        {/* TAB 1: OPPA (ACTUS & STORIES) */}
        {activeTab === 'actus' && (
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
            {/* Story Bar */}
            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
              {[
                { id: 'flash', title: 'Flash', icon: Sparkles, color: 'from-purple-500 to-indigo-600' },
                { id: 'filmJour', title: 'Film du Jour', icon: Ticket, color: 'from-fuchsia-500 to-pink-600' },
                { id: 'topFilms', title: 'Top Films', icon: Film, color: 'from-red-500 to-rose-600' },
                { id: 'animeNouveaux', title: 'Nouveautés', icon: Flame, color: 'from-blue-500 to-cyan-600' },
                { id: 'animeTop', title: 'Top Anime', icon: Star, color: 'from-amber-500 to-orange-600' }
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

            {/* Actus Cards Feed */}
            <div className="space-y-4">
              {newsFeed.map(item => (
                <div key={item.id} className="rounded-2xl bg-[#0c0c12] border border-white/5 overflow-hidden shadow-lg space-y-3">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                        LVL
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{item.label}</div>
                        <span className="text-[10px] text-white/40">{item.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFetchTrailer(Number(item.id.replace('movie_', '')))}
                      className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" /> Trailer
                    </button>
                  </div>

                  <div className="px-4">
                    <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                    <p className="text-xs text-white/60 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                  </div>

                  {item.img && (
                    <div 
                      onClick={() => setZoomedImage(item.img)}
                      className="relative aspect-video bg-black/50 cursor-pointer group"
                    >
                      <img src={item.img} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-3 px-4 flex items-center justify-between border-t border-white/5 text-white/60">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleBookmark(item.id)}
                        className={`text-xs flex items-center gap-1.5 ${savedBookmarks.has(item.id) ? 'text-purple-400 font-bold' : 'hover:text-white'}`}
                      >
                        <Bookmark className={`w-4 h-4 ${savedBookmarks.has(item.id) ? 'fill-current' : ''}`} />
                        <span>{savedBookmarks.has(item.id) ? (isFr ? 'Enregistré' : 'Saved') : (isFr ? 'Sauvegarder' : 'Save')}</span>
                      </button>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> {item.rating}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MOMENTS (TIKTOK STYLE) */}
        {activeTab === 'moments' && (
          <div className="max-w-md mx-auto space-y-6 animate-in fade-in">
            {momentsData.map((vid, idx) => (
              <div key={idx} className="relative aspect-[9/16] max-h-[70vh] rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl flex flex-col justify-end p-5">
                <img src={vid.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <div className="relative z-10 space-y-3">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-600/30 text-red-400 border border-red-500/30 inline-block">
                    🎬 Trailer Reel
                  </span>
                  <h3 className="text-lg font-black text-white">{vid.title}</h3>
                  <p className="text-xs text-white/70 line-clamp-2">{vid.desc}</p>
                  
                  <button
                    onClick={() => handleFetchTrailer(vid.id)}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Regarder la bande-annonce avec le son
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SHOWS (POSTER GALLERY) */}
        {activeTab === 'shows' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-4xl mx-auto animate-in fade-in">
            {showsData.map((show, i) => (
              <div
                key={i}
                onClick={() => setZoomedImage(show.img)}
                className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#101018] border border-white/5 cursor-pointer shadow-md"
              >
                <img src={show.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-3">
                  <div className="text-xs font-bold text-white truncate">{show.title}</div>
                  <div className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> {show.rating}/10
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: RADAR (UPCOMING CINEMA) */}
        {activeTab === 'radar' && (
          <div className="space-y-4 max-w-3xl mx-auto animate-in fade-in">
            <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-900/30 to-purple-900/20 border border-white/10 space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Satellite className="w-5 h-5 text-blue-400" />
                <span>Radar Sorties & Séances</span>
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
                    className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[10px] font-bold shrink-0"
                  >
                    Suivre
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ESPACE (ACCOUNT & ADMIN PUSH) */}
        {activeTab === 'espace' && (
          <div className="space-y-6 max-w-xl mx-auto animate-in fade-in">
            {/* Account Card */}
            <div className="p-5 rounded-3xl bg-[#0e0e16] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center font-black text-lg">
                    VIP
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{user?.displayName || 'Membre LevelUp'}</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Authentifié via Supabase</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setRevealedPin(!revealedPin)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-purple-300 border border-white/10"
                >
                  {revealedPin ? 'Masquer Clé' : 'Voir Clé'}
                </button>
              </div>

              {revealedPin && (
                <div className="p-3 rounded-xl bg-black/60 border border-purple-500/30 font-mono text-center text-xs text-purple-300 tracking-widest">
                  {userKey}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <div className="text-base font-black text-white">{savedBookmarks.size}</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold">Signets enregistrés</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <div className="text-base font-black text-purple-400">VIP Pro</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold">Statut Écosystème</div>
                </div>
              </div>
            </div>

            {/* Admin Push Broadcast Tool */}
            <div className="p-5 rounded-3xl bg-purple-950/20 border border-purple-500/20 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-purple-400" />
                  <span>Diffuser un Push (Supabase)</span>
                </h3>
                <p className="text-[11px] text-white/50 mt-0.5">Envoie une notification push instantanée à tous les utilisateurs connectés.</p>
              </div>

              <div className="space-y-2.5">
                <input
                  type="text"
                  value={adminTitle}
                  onChange={e => setAdminTitle(e.target.value)}
                  placeholder="Titre de la notification"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                />
                <textarea
                  value={adminBody}
                  onChange={e => setAdminBody(e.target.value)}
                  placeholder="Corps du message..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500 h-16 resize-none"
                />
                <button
                  onClick={handleSendPush}
                  disabled={sendingPush}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingPush ? 'Envoi...' : 'Diffuser vers Supabase'}</span>
                </button>
              </div>
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
          { id: 'radar', icon: Satellite, label: 'Radar' },
          { id: 'espace', icon: UserCheck, label: 'Espace' }
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

    </div>
  );
};
