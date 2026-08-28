import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Home, Search, Library, User, Play, Pause, SkipBack, SkipForward,
  Heart, MoreHorizontal, ChevronDown, X, Plus, ListPlus, ListMusic,
  Share2, Mic2, Volume2, VolumeX, Shuffle, Repeat, Repeat1,
  Music, LogOut, ArrowLeft, Clock, ChevronRight, Globe, ExternalLink,
  Sparkles, Check
} from 'lucide-react';
import { 
  fetchMusicLikesSupabase, 
  syncMusicLikesSupabase, 
  fetchMusicPlaylistsSupabase, 
  createMusicPlaylistSupabase 
} from '../../lib/supabase';

interface LevelMusicAppProps {
  onClose?: () => void;
  lang?: string;
  user?: any;
}

interface Track {
  id: number | string;
  name: string;
  artist: string;
  album?: string;
  image: string;
  imageLg?: string;
  previewUrl: string;
  duration: number;
  trackViewUrl?: string;
  genre?: string;
}

const CATEGORIES = [
  { id: 1, title: "Nouveautés", titleEn: "New Releases", term: "nouveautes 2025", color: "#1d4ed8" },
  { id: 2, title: "Rap Français", titleEn: "French Rap", term: "rap francais", color: "#7c3aed" },
  { id: 3, title: "Hits Mondiaux", titleEn: "Global Hits", term: "top hits mondial", color: "#be185d" },
  { id: 4, title: "Amapiano", titleEn: "Amapiano", term: "amapiano hits", color: "#b45309" },
  { id: 5, title: "Rumba Congolaise", titleEn: "Congolese Rumba", term: "rumba congolaise", color: "#065f46" },
  { id: 6, title: "Afrobeat", titleEn: "Afrobeat", term: "afrobeat", color: "#92400e" },
  { id: 7, title: "Hip-Hop US", titleEn: "US Hip-Hop", term: "us rap hip hop", color: "#1e3a5f" },
  { id: 8, title: "Drill", titleEn: "Drill", term: "drill uk fr", color: "#111827" },
  { id: 9, title: "Coupé-Décalé", titleEn: "Coupé-Décalé", term: "coupe decale", color: "#4c1d95" },
  { id: 10, title: "Phonk", titleEn: "Phonk", term: "phonk music", color: "#7f1d1d" },
  { id: 11, title: "Lo-Fi", titleEn: "Lo-Fi", term: "lofi beats relax", color: "#1e3a5f" },
  { id: 12, title: "R&B & Soul", titleEn: "R&B & Soul", term: "rnb soul hits", color: "#5b21b6" },
  { id: 13, title: "Pop Mondiale", titleEn: "Global Pop", term: "pop hits 2025", color: "#be185d" },
  { id: 14, title: "Reggaeton", titleEn: "Reggaeton", term: "reggaeton latino", color: "#166534" },
  { id: 15, title: "Dancehall", titleEn: "Dancehall", term: "dancehall reggae", color: "#92400e" },
  { id: 16, title: "K-Pop", titleEn: "K-Pop", term: "kpop bts blackpink", color: "#831843" },
  { id: 17, title: "Zouk Love", titleEn: "Zouk Love", term: "zouk love", color: "#1e40af" },
  { id: 18, title: "Électro & Club", titleEn: "Electro & Club", term: "electro club dance", color: "#1d4ed8" },
  { id: 19, title: "Jazz & Blues", titleEn: "Jazz & Blues", term: "jazz blues", color: "#1e3a5f" },
  { id: 20, title: "Rock Classics", titleEn: "Rock Classics", term: "classic rock", color: "#111827" }
];

const fmt = (s: number) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
};

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const fetchMusic = async (term: string, limit = 20): Promise<Track[]> => {
  try {
    const t = term.replace(/[^\w\s\-]/g, ' ');
    const r = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(t)}&entity=song&limit=${limit}`);
    if (!r.ok) return [];
    const d = await r.json();
    return (d.results || []).map((x: any) => ({
      id: x.trackId,
      name: x.trackName,
      artist: x.artistName,
      album: x.collectionName,
      image: x.artworkUrl100?.replace('100x100bb', '600x600bb') || '',
      imageLg: x.artworkUrl100?.replace('100x100bb', '1000x1000bb') || '',
      previewUrl: x.previewUrl,
      duration: x.trackTimeMillis ? x.trackTimeMillis / 1000 : 30,
      trackViewUrl: x.trackViewUrl,
      genre: x.primaryGenreName,
    })).filter((x: Track) => x.previewUrl);
  } catch {
    return [];
  }
};

export const LevelMusicApp: React.FC<LevelMusicAppProps> = ({ onClose, lang: initialLang = 'fr', user }) => {
  const [appLang, setAppLang] = useState<string>(localStorage.getItem('lm_lang') || initialLang);
  const isFr = appLang === 'fr';

  // Audio Engine State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIdx, setQueueIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [curTime, setCurTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolume] = useState(0.85);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');

  // UI state
  const [view, setView] = useState<'home' | 'search' | 'library' | 'artist' | 'profile'>('home');
  const [playerOpen, setPlayerOpen] = useState(false);
  const [optionsTrack, setOptionsTrack] = useState<Track | null>(null);
  const [sourcesTrack, setSourcesTrack] = useState<Track | null>(null);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Data
  const [liked, setLiked] = useState<Track[]>(() => {
    try {
      const s = localStorage.getItem('lm_likes');
      if (s) return JSON.parse(s);
    } catch {}
    return [];
  });
  const [playlists, setPlaylists] = useState<any[]>(() => {
    try {
      const s = localStorage.getItem('lm_playlists');
      if (s) return JSON.parse(s);
    } catch {}
    return [];
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>(() => {
    try {
      const s = localStorage.getItem('lm_recent');
      if (s) return JSON.parse(s);
    } catch {}
    return [];
  });

  const [homeRows, setHomeRows] = useState<any[]>([]);
  const [homeLoading, setHomeLoading] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [searching, setSearching] = useState(false);

  const [artistName, setArtistName] = useState('');
  const [artistTracks, setArtistTracks] = useState<Track[]>([]);
  const [artistLoading, setArtistLoading] = useState(false);
  const [prevView, setPrevView] = useState<'home' | 'search' | 'library' | 'profile'>('home');

  const userId = user?.uid || 'user_local_levelmusic';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Init Audio Element
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const onTime = () => {
      setCurTime(audio.currentTime);
      if (audio.duration) {
        setDuration(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onEnd = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        setIsPlaying(false);
        playNext();
      }
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
    };
  }, [repeatMode]);

  // Load from Supabase on start
  useEffect(() => {
    (async () => {
      const dbLikes = await fetchMusicLikesSupabase(userId);
      if (dbLikes && dbLikes.length > 0) {
        setLiked(dbLikes);
        localStorage.setItem('lm_likes', JSON.stringify(dbLikes));
      }
      const dbPlaylists = await fetchMusicPlaylistsSupabase(userId);
      if (dbPlaylists && dbPlaylists.length > 0) {
        setPlaylists(dbPlaylists);
        localStorage.setItem('lm_playlists', JSON.stringify(dbPlaylists));
      }
    })();
  }, [userId]);

  // Load Catalog categories
  useEffect(() => {
    let mounted = true;
    (async () => {
      setHomeLoading(true);
      const rows: any[] = [];
      const shuffled = shuffle(CATEGORIES).slice(0, 6);
      for (const cat of shuffled) {
        if (!mounted) break;
        const tracks = await fetchMusic(cat.term, 15);
        if (tracks.length > 0) {
          rows.push({ ...cat, data: tracks });
        }
      }
      if (mounted) {
        setHomeRows(rows);
        setHomeLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Search effect
  useEffect(() => {
    if (!searchQ.trim()) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      const res = await fetchMusic(searchQ, 40);
      setSearchResults(res);
      setSearching(false);
    }, 450);
    return () => clearTimeout(t);
  }, [searchQ]);

  // Playback handlers
  const playTrack = useCallback((t: Track, q: Track[] | null = null, idx = 0) => {
    setCurrentTrack(t);
    const newQ = q || [t];
    setQueue(newQ);
    setQueueIdx(idx);
    if (t.previewUrl && audioRef.current) {
      audioRef.current.src = t.previewUrl;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(true);
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(x => x.id !== t.id);
      const updated = [t, ...filtered].slice(0, 30);
      localStorage.setItem('lm_recent', JSON.stringify(updated));
      return updated;
    });
  }, [volume]);

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(p => !p);
  }, [isPlaying, currentTrack]);

  const playNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!queue.length) return;
    const nextIdx = shuffleOn ? Math.floor(Math.random() * queue.length) : (queueIdx + 1) % queue.length;
    playTrack(queue[nextIdx], queue, nextIdx);
  }, [queue, queueIdx, shuffleOn, playTrack]);

  const playPrev = useCallback(() => {
    if (!audioRef.current || !queue.length) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prevIdx = (queueIdx - 1 + queue.length) % queue.length;
    playTrack(queue[prevIdx], queue, prevIdx);
  }, [queue, queueIdx, playTrack]);

  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurTime(time);
    if (duration > 0) setProgress((time / duration) * 100);
  };

  const isLiked = (id: number | string) => liked.some(x => x.id === id);

  const toggleLike = async (t: Track, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const already = isLiked(t.id);
    const updated = already ? liked.filter(x => x.id !== t.id) : [t, ...liked];
    setLiked(updated);
    localStorage.setItem('lm_likes', JSON.stringify(updated));
    showToast(already ? (isFr ? 'Retiré des favoris' : 'Removed from favorites') : (isFr ? 'Ajouté aux favoris ❤️' : 'Added to favorites ❤️'));
    await syncMusicLikesSupabase(userId, updated);
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    const pl = { id: Date.now().toString(), name: newPlaylistName.trim(), tracks: optionsTrack ? [optionsTrack] : [] };
    const updated = [...playlists, pl];
    setPlaylists(updated);
    localStorage.setItem('lm_playlists', JSON.stringify(updated));
    await createMusicPlaylistSupabase(userId, pl);
    setNewPlaylistName('');
    setPlaylistModal(false);
    showToast(isFr ? 'Playlist créée !' : 'Playlist created!');
  };

  const openArtist = async (t: Track) => {
    setPrevView(view as any);
    setArtistName(t.artist || t.name);
    setView('artist');
    setArtistLoading(true);
    setPlayerOpen(false);
    setOptionsTrack(null);
    const results = await fetchMusic(t.artist || t.name, 40);
    setArtistTracks(results);
    setArtistLoading(false);
  };

  const shareTrack = (t: Track) => {
    const url = t.trackViewUrl || `https://music.apple.com/search?term=${encodeURIComponent(t.name)}`;
    if (navigator.share) {
      navigator.share({ title: t.name, text: `Écoute "${t.name}" sur LevelMusic !`, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      showToast(isFr ? 'Lien copié dans le presse-papier !' : 'Link copied!');
    }
  };

  return (
    <div className="w-full h-full bg-[#07080d] text-white flex flex-col overflow-hidden relative font-sans select-none">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-16 right-4 z-[9999] bg-black/90 border border-blue-500/40 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold animate-in fade-in">
          {toastMsg}
        </div>
      )}

      {/* Playlist Modal */}
      {playlistModal && (
        <div className="fixed inset-0 z-[9900] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl p-6 bg-[#14151f] border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">{isFr ? 'Nouvelle Playlist' : 'New Playlist'}</h3>
            <input
              type="text"
              autoFocus
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreatePlaylist()}
              placeholder={isFr ? 'Nom de la playlist...' : 'Playlist name...'}
              className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setPlaylistModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/70"
              >
                {isFr ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={handleCreatePlaylist}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg"
              >
                {isFr ? 'Créer' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sources Sheet */}
      {sourcesTrack && (
        <div 
          className="fixed inset-0 z-[9800] flex items-end justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSourcesTrack(null)}
        >
          <div 
            className="w-full max-w-md bg-[#161722] rounded-3xl p-6 border border-white/10 shadow-2xl space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2" />
            <h4 className="text-base font-bold text-white mb-1">
              {isFr ? 'Écouter la version complète' : 'Listen Full Version'}
            </h4>
            <p className="text-xs text-white/50 mb-3">{sourcesTrack.name} — {sourcesTrack.artist}</p>
            <div className="space-y-2">
              {[
                { name: 'Apple Music', url: sourcesTrack.trackViewUrl, color: 'from-pink-500 to-red-500' },
                { name: 'YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(sourcesTrack.artist + ' ' + sourcesTrack.name)}`, color: 'from-red-600 to-red-700' },
                { name: 'Spotify', url: `https://open.spotify.com/search/${encodeURIComponent(sourcesTrack.artist + ' ' + sourcesTrack.name)}`, color: 'from-emerald-500 to-green-600' },
                { name: 'Deezer', url: `https://www.deezer.com/search/${encodeURIComponent(sourcesTrack.artist + ' ' + sourcesTrack.name)}`, color: 'from-purple-500 to-indigo-600' }
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${link.color} flex items-center justify-center font-bold text-xs text-white shadow-md`}>
                      {link.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-white">Ouvrir dans {link.name}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/40" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Options Sheet */}
      {optionsTrack && (
        <div 
          className="fixed inset-0 z-[9700] flex items-end justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setOptionsTrack(null)}
        >
          <div 
            className="w-full max-w-md bg-[#161722] rounded-3xl p-6 border border-white/10 shadow-2xl space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <img src={optionsTrack.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">{optionsTrack.name}</div>
                <div className="text-xs text-blue-400 truncate">{optionsTrack.artist}</div>
              </div>
            </div>
            <div className="space-y-1 pt-1">
              <button
                onClick={() => { toggleLike(optionsTrack); setOptionsTrack(null); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-xs font-semibold transition-colors"
              >
                <Heart className={`w-4 h-4 ${isLiked(optionsTrack.id) ? 'fill-blue-500 text-blue-500' : 'text-white/70'}`} />
                <span>{isLiked(optionsTrack.id) ? (isFr ? 'Retirer des favoris' : 'Remove from favorites') : (isFr ? 'Ajouter aux favoris' : 'Add to favorites')}</span>
              </button>
              <button
                onClick={() => { setPlaylistModal(true); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-xs font-semibold transition-colors"
              >
                <ListPlus className="w-4 h-4 text-white/70" />
                <span>{isFr ? 'Ajouter à une playlist' : 'Add to playlist'}</span>
              </button>
              <button
                onClick={() => { openArtist(optionsTrack); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-xs font-semibold transition-colors"
              >
                <Mic2 className="w-4 h-4 text-white/70" />
                <span>{isFr ? "Voir l'artiste" : 'View artist'}</span>
              </button>
              <button
                onClick={() => { shareTrack(optionsTrack); setOptionsTrack(null); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-xs font-semibold transition-colors text-blue-400"
              >
                <Share2 className="w-4 h-4" />
                <span>{isFr ? 'Partager le titre' : 'Share track'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <header className="h-14 px-4 sm:px-6 bg-[#07080d]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Music className="w-4 h-4" />
          </div>
          <span className="font-black text-sm tracking-wider">
            Level<span className="text-blue-500">Music</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView(view === 'profile' ? 'home' : 'profile')}
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs shadow-md border border-blue-400/40"
          >
            {(user?.displayName || 'U')[0].toUpperCase()}
          </button>
        </div>
      </header>

      {/* Main Scrollable View Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-28">
        
        {/* VIEW 1: HOME */}
        {view === 'home' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
            <div>
              <h1 className="text-2xl font-black text-white">
                {isFr ? 'Qu’écoute-t-on aujourd’hui ?' : 'What are we listening to today?'}
              </h1>
              <p className="text-xs text-white/50 mt-0.5">
                {isFr ? 'Exploration musicale et hits mondiaux en streaming' : 'Explore worldwide releases and playlists'}
              </p>
            </div>

            {/* Recently Played */}
            {recentlyPlayed.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>{isFr ? 'Écoutés récemment' : 'Recently Played'}</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {recentlyPlayed.slice(0, 6).map((t, idx) => (
                    <div
                      key={t.id}
                      onClick={() => playTrack(t, recentlyPlayed, idx)}
                      className="group p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer space-y-2"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40">
                        <img src={t.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{t.name}</div>
                        <div className="text-[10px] text-white/50 truncate">{t.artist}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Catalog Categories */}
            {homeLoading && homeRows.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-7 h-7 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                <span className="text-xs text-white/50 font-semibold">{isFr ? 'Chargement du catalogue...' : 'Loading catalog...'}</span>
              </div>
            ) : (
              homeRows.map((cat) => (
                <div key={cat.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{isFr ? cat.title : cat.titleEn}</h3>
                    <button
                      onClick={() => { setSearchQ(cat.term); setView('search'); }}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300"
                    >
                      {isFr ? 'Voir tout' : 'See all'}
                    </button>
                  </div>
                  <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                    {cat.data.map((t: Track, idx: number) => (
                      <div
                        key={t.id}
                        onClick={() => playTrack(t, cat.data, idx)}
                        className="w-36 shrink-0 group p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer space-y-2"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40">
                          <img src={t.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">{t.name}</div>
                          <div className="text-[10px] text-white/50 truncate">{t.artist}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

          </div>
        )}

        {/* VIEW 2: SEARCH */}
        {view === 'search' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder={isFr ? 'Artistes, titres, albums...' : 'Artists, tracks, albums...'}
                className="w-full bg-[#13141f] border border-white/10 rounded-2xl py-3.5 pl-11 pr-10 text-sm text-white outline-none focus:border-blue-500 transition-colors"
              />
              {searchQ && (
                <button
                  onClick={() => setSearchQ('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {!searchQ && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider">
                  {isFr ? 'Parcourir par genre' : 'Browse by genre'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSearchQ(c.term)}
                      style={{ backgroundColor: c.color }}
                      className="p-4 rounded-2xl font-bold text-xs text-white text-left shadow-md hover:scale-102 transition-transform cursor-pointer"
                    >
                      {isFr ? c.title : c.titleEn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchQ && (
              <div className="space-y-3">
                {searching ? (
                  <div className="py-16 flex justify-center">
                    <div className="w-7 h-7 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((t, idx) => (
                    <div
                      key={t.id}
                      onClick={() => playTrack(t, searchResults, idx)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={t.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <div className={`text-xs font-bold truncate ${currentTrack?.id === t.id ? 'text-blue-400' : 'text-white'}`}>
                            {t.name}
                          </div>
                          <div className="text-[10px] text-white/50 truncate">{t.artist}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-white/40">{fmt(t.duration)}</span>
                        <button
                          onClick={e => { e.stopPropagation(); setOptionsTrack(t); }}
                          className="p-1.5 rounded-full text-white/40 hover:text-white"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center text-white/40 text-xs font-semibold">
                    {isFr ? 'Aucun résultat trouvé.' : 'No results found.'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: LIBRARY */}
        {view === 'library' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
            <h1 className="text-2xl font-black text-white">{isFr ? 'Ma Bibliothèque' : 'My Library'}</h1>

            {/* Liked songs */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-blue-500 fill-blue-500" />
                <span>{isFr ? 'Titres Favoris' : 'Favorite Tracks'} ({liked.length})</span>
              </h3>
              {liked.length === 0 ? (
                <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] text-center text-xs text-white/40">
                  {isFr ? 'Appuyez sur ♥ pour ajouter des morceaux à vos favoris.' : 'Press ♥ to add tracks to your favorites.'}
                </div>
              ) : (
                <div className="space-y-1">
                  {liked.map((t, idx) => (
                    <div
                      key={t.id}
                      onClick={() => playTrack(t, liked, idx)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={t.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <div className={`text-xs font-bold truncate ${currentTrack?.id === t.id ? 'text-blue-400' : 'text-white'}`}>{t.name}</div>
                          <div className="text-[10px] text-white/50 truncate">{t.artist}</div>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); toggleLike(t); }}
                        className="p-2 text-blue-500"
                      >
                        <Heart className="w-4 h-4 fill-blue-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Playlists */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ListMusic className="w-4 h-4 text-blue-500" />
                  <span>Playlists</span>
                </h3>
                <button
                  onClick={() => setPlaylistModal(true)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Créer' : 'Create'}</span>
                </button>
              </div>
              {playlists.length === 0 ? (
                <button
                  onClick={() => setPlaylistModal(true)}
                  className="w-full p-6 rounded-2xl border border-dashed border-white/10 hover:border-blue-500/40 text-center flex flex-col items-center gap-2 cursor-pointer transition-colors"
                >
                  <Plus className="w-5 h-5 text-white/40" />
                  <span className="text-xs font-bold text-white/70">{isFr ? 'Créer une nouvelle playlist' : 'Create a new playlist'}</span>
                </button>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {playlists.map(p => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                          <ListMusic className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{p.name}</div>
                          <div className="text-[10px] text-white/40">{(p.tracks || []).length} {isFr ? 'titre(s)' : 'track(s)'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 4: ARTIST */}
        {view === 'artist' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
            <button
              onClick={() => setView(prevView)}
              className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isFr ? 'Retour' : 'Back'}</span>
            </button>
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 to-indigo-900/20 border border-white/10 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-2xl text-white shadow-xl">
                {artistName[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{artistName}</h2>
                <p className="text-xs text-blue-300 font-semibold">{artistTracks.length} {isFr ? 'morceaux disponibles' : 'available tracks'}</p>
              </div>
            </div>
            {artistLoading ? (
              <div className="py-16 flex justify-center">
                <div className="w-7 h-7 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-1">
                {artistTracks.map((t, idx) => (
                  <div
                    key={t.id}
                    onClick={() => playTrack(t, artistTracks, idx)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={t.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${currentTrack?.id === t.id ? 'text-blue-400' : 'text-white'}`}>{t.name}</div>
                        <div className="text-[10px] text-white/50 truncate">{t.album || t.artist}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-white/40">{fmt(t.duration)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: PROFILE */}
        {view === 'profile' && (
          <div className="space-y-6 max-w-xl mx-auto animate-in fade-in">
            <h1 className="text-2xl font-black text-white">{isFr ? 'Profil & Réglages' : 'Profile & Settings'}</h1>
            <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-md">
                {(user?.displayName || 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-white truncate">{user?.displayName || 'Utilisateur LevelUp'}</div>
                <div className="text-xs text-white/40 truncate">{user?.email || 'Synchronisé via Supabase'}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-white">{isFr ? 'Langue' : 'Language'}</span>
              </div>
              <button
                onClick={() => {
                  const next = isFr ? 'en' : 'fr';
                  setAppLang(next);
                  localStorage.setItem('lm_lang', next);
                }}
                className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold text-white hover:bg-white/20"
              >
                {isFr ? 'Passer en English' : 'Passer en Français'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Mini Player */}
      {currentTrack && !playerOpen && (
        <div 
          onClick={() => setPlayerOpen(true)}
          className="fixed bottom-14 left-3 right-3 h-14 rounded-2xl bg-[#141522]/95 backdrop-blur-xl border border-white/10 flex items-center justify-between px-3 gap-3 shadow-2xl z-30 cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img src={currentTrack.image} alt="" className="w-9 h-9 rounded-xl object-cover" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{currentTrack.name}</div>
              <div className="text-[10px] text-white/50 truncate">{currentTrack.artist}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={e => { e.stopPropagation(); toggleLike(currentTrack); }} className="p-1.5">
              <Heart className={`w-4 h-4 ${isLiked(currentTrack.id) ? 'fill-blue-500 text-blue-500' : 'text-white/50'}`} />
            </button>
            <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
            <button onClick={playNext} className="p-1.5 text-white/70 hover:text-white">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Full Player Modal */}
      {currentTrack && playerOpen && (
        <div className="fixed inset-0 z-[9500] bg-[#07080d] flex flex-col p-6 overflow-hidden animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between">
            <button onClick={() => setPlayerOpen(false)} className="p-2 text-white/70 hover:text-white">
              <ChevronDown className="w-6 h-6" />
            </button>
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{isFr ? 'EN LECTURE' : 'NOW PLAYING'}</span>
              <div className="text-xs font-bold text-white max-w-[200px] truncate">{currentTrack.album || currentTrack.artist}</div>
            </div>
            <button onClick={() => setOptionsTrack(currentTrack)} className="p-2 text-white/70 hover:text-white">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-64 sm:w-72 aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img src={currentTrack.imageLg || currentTrack.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="w-full max-w-sm mt-6 flex items-start justify-between">
              <div className="min-w-0 pr-4">
                <h2 className="text-xl font-bold text-white truncate">{currentTrack.name}</h2>
                <p className="text-xs font-semibold text-blue-400 mt-0.5">{currentTrack.artist}</p>
              </div>
              <button onClick={() => toggleLike(currentTrack)} className="p-1">
                <Heart className={`w-6 h-6 ${isLiked(currentTrack.id) ? 'fill-blue-500 text-blue-500' : 'text-white/40'}`} />
              </button>
            </div>
          </div>

          <div className="w-full max-w-sm mx-auto space-y-4 pb-6">
            {/* Progress bar */}
            <div>
              <input
                type="range"
                min="0"
                max={duration || 30}
                step="0.1"
                value={curTime}
                onChange={e => handleSeek(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-full appearance-none outline-none accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                <span>{fmt(curTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShuffleOn(!shuffleOn)}
                className={`p-2 transition-colors ${shuffleOn ? 'text-blue-500' : 'text-white/40'}`}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button onClick={playPrev} className="p-2 text-white hover:scale-110 transition-transform">
                <SkipBack className="w-6 h-6 fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
              </button>
              <button onClick={playNext} className="p-2 text-white hover:scale-110 transition-transform">
                <SkipForward className="w-6 h-6 fill-current" />
              </button>
              <button
                onClick={() => setRepeatMode(m => m === 'none' ? 'all' : m === 'all' ? 'one' : 'none')}
                className={`p-2 transition-colors ${repeatMode !== 'none' ? 'text-blue-500' : 'text-white/40'}`}
              >
                {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 w-28">
                <Volume2 className="w-4 h-4 text-white/40" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (audioRef.current) audioRef.current.volume = v;
                  }}
                  className="w-full h-1 bg-white/20 rounded-full appearance-none outline-none accent-white cursor-pointer"
                />
              </div>
              <button
                onClick={() => setSourcesTrack(currentTrack)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isFr ? 'Version Complète' : 'Listen Full'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <nav className="h-14 px-6 bg-[#07080d]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around shrink-0 z-20">
        {[
          { id: 'home', icon: Home, label: isFr ? 'Accueil' : 'Home' },
          { id: 'search', icon: Search, label: isFr ? 'Recherche' : 'Search' },
          { id: 'library', icon: Library, label: isFr ? 'Bibliothèque' : 'Library' },
          { id: 'profile', icon: User, label: isFr ? 'Profil' : 'Profile' }
        ].map(tab => {
          const Icon = tab.icon;
          const active = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                active ? 'text-blue-500 font-bold' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
};
