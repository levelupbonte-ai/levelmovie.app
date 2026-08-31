import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Home, Search, Library, Play, Pause, SkipBack, SkipForward,
  Heart, MoreHorizontal, ChevronDown, X, Plus, ListPlus, ListMusic,
  Share2, Mic2, Volume2, VolumeX, Shuffle, Repeat, Repeat1,
  Music, LogOut, ArrowLeft, Clock, ChevronRight, ExternalLink,
  Sparkles, Check
} from 'lucide-react';
import { 
  fetchMusicLikesSupabase, 
  syncMusicLikesSupabase, 
  fetchMusicPlaylistsSupabase, 
  createMusicPlaylistSupabase 
} from '../../lib/supabase';
import { InAppBrowserModal, InAppBrowserData } from './InAppBrowserModal';

interface LevelMusicAppProps {
  onClose?: () => void;
  lang?: string;
  user?: any;
  onRequireAuth?: () => void;
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
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
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

const fetchMusic = async (term: string, limit = 25): Promise<Track[]> => {
  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((x: any) => ({
      id: x.trackId,
      name: x.trackName,
      artist: x.artistName,
      album: x.collectionName,
      image: x.artworkUrl100,
      imageLg: x.artworkUrl100?.replace('100x100bb', '600x600bb'),
      previewUrl: x.previewUrl,
      duration: 30, // 30s official sample
      trackViewUrl: x.trackViewUrl,
      genre: x.primaryGenreName,
    })).filter((x: Track) => x.previewUrl);
  } catch {
    return [];
  }
};

export const LevelMusicApp: React.FC<LevelMusicAppProps> = ({ onClose, lang: initialLang = 'fr', user, onRequireAuth }) => {
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

  // Volume with local storage persistence
  const [volume, setVolume] = useState<number>(() => {
    try {
      const v = localStorage.getItem('lm_volume');
      if (v !== null) return parseFloat(v);
    } catch {}
    return 0.85;
  });
  const [isMuted, setIsMuted] = useState(false);
  const prevVolumeRef = useRef(0.85);

  const [shuffleOn, setShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');

  // Audio Refs to prevent recreation of audio on mode changes
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);
  const repeatModeRef = useRef(repeatMode);
  const shuffleOnRef = useRef(shuffleOn);
  const queueRef = useRef<Track[]>([]);
  const queueIdxRef = useRef(0);
  const isPlayingRef = useRef(false);

  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);
  useEffect(() => { shuffleOnRef.current = shuffleOn; }, [shuffleOn]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { queueIdxRef.current = queueIdx; }, [queueIdx]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // UI state
  const [view, setView] = useState<'home' | 'search' | 'library' | 'artist'>('home');
  const [playerOpen, setPlayerOpen] = useState(false);
  const [optionsTrack, setOptionsTrack] = useState<Track | null>(null);
  const [sourcesTrack, setSourcesTrack] = useState<Track | null>(null);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [inAppBrowserData, setInAppBrowserData] = useState<InAppBrowserData | null>(null);
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
  const [prevView, setPrevView] = useState<'home' | 'search' | 'library'>('home');

  const userId = user?.uid || 'levelmovie_user';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Play a track helper
  const internalPlay = useCallback((t: Track, q?: Track[], idx = 0) => {
    setCurrentTrack(t);
    const newQ = q || [t];
    setQueue(newQ);
    setQueueIdx(idx);

    const audio = audioRef.current;
    if (t.previewUrl && audio) {
      audio.src = t.previewUrl;
      const targetVol = isMutedRef.current ? 0 : volumeRef.current;
      audio.volume = targetVol;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    setIsPlaying(true);

    setRecentlyPlayed(prev => {
      const filtered = prev.filter(x => x.id !== t.id);
      const updated = [t, ...filtered].slice(0, 30);
      localStorage.setItem('lm_recent', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Single persistent Audio element (DOES NOT RE-INIT ON REPEAT/SHUFFLE CHANGES)
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTime = () => {
      setCurTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);

        // FADE-OUT EFFECT ON 30-SECOND PREVIEWS (Smoothly attenuates volume in the last 3.5 seconds)
        const fadeDuration = 3.5;
        const timeLeft = audio.duration - audio.currentTime;
        const currentTargetVol = isMutedRef.current ? 0 : volumeRef.current;

        if (timeLeft <= fadeDuration && audio.duration > 5) {
          const fadeFactor = Math.max(0, timeLeft / fadeDuration);
          audio.volume = Math.max(0, Math.min(1, currentTargetVol * fadeFactor));
        } else {
          audio.volume = currentTargetVol;
        }
      }
    };

    const onEnd = () => {
      const mode = repeatModeRef.current;
      const currentQ = queueRef.current;
      const currentIdx = queueIdxRef.current;
      const isShuffle = shuffleOnRef.current;

      if (mode === 'one') {
        // Repeat current track seamlessly
        audio.currentTime = 0;
        audio.volume = isMutedRef.current ? 0 : volumeRef.current;
        audio.play().catch(() => {});
      } else if (isShuffle && currentQ.length > 0) {
        // Pick random track
        const nextIdx = Math.floor(Math.random() * currentQ.length);
        internalPlay(currentQ[nextIdx], currentQ, nextIdx);
      } else if (currentIdx < currentQ.length - 1 || mode === 'all') {
        // Next track in queue (or loop back to start if mode is all)
        if (currentQ.length > 0) {
          const nextIdx = (currentIdx + 1) % currentQ.length;
          internalPlay(currentQ[nextIdx], currentQ, nextIdx);
        } else {
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
    };
  }, [internalPlay]);

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
    internalPlay(t, q || [t], idx);
  }, [internalPlay]);

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack]);

  const playNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!queue.length) return;
    const nextIdx = shuffleOn ? Math.floor(Math.random() * queue.length) : (queueIdx + 1) % queue.length;
    internalPlay(queue[nextIdx], queue, nextIdx);
  }, [queue, queueIdx, shuffleOn, internalPlay]);

  const playPrev = useCallback(() => {
    if (!audioRef.current || !queue.length) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prevIdx = (queueIdx - 1 + queue.length) % queue.length;
    internalPlay(queue[prevIdx], queue, prevIdx);
  }, [queue, queueIdx, internalPlay]);

  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurTime(time);
    if (duration > 0) setProgress((time / duration) * 100);
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    localStorage.setItem('lm_volume', String(newVal));
    if (isMuted && newVal > 0) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = newVal;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      const restored = prevVolumeRef.current || 0.85;
      setIsMuted(false);
      setVolume(restored);
      if (audioRef.current) audioRef.current.volume = restored;
    } else {
      prevVolumeRef.current = volume;
      setIsMuted(true);
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const isLiked = (id: number | string) => liked.some(x => x.id === id);

  const toggleLike = async (t: Track, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Auth Check
    if (!user || user.isGuest) {
      showToast(isFr ? "Connexion requise pour sauvegarder vos favoris." : "Sign in required to save favorites.");
      onRequireAuth?.();
      return;
    }

    const already = isLiked(t.id);
    const updated = already ? liked.filter(x => x.id !== t.id) : [t, ...liked];
    setLiked(updated);
    localStorage.setItem('lm_likes', JSON.stringify(updated));
    showToast(already ? (isFr ? 'Retiré des favoris' : 'Removed from favorites') : (isFr ? 'Ajouté aux favoris ❤️' : 'Added to favorites ❤️'));
    await syncMusicLikesSupabase(userId, updated);
  };

  const handleCreatePlaylist = async () => {
    // Auth Check
    if (!user || user.isGuest) {
      showToast(isFr ? "Connexion requise pour créer des playlists." : "Sign in required to create playlists.");
      onRequireAuth?.();
      return;
    }
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

      {/* Sources Sheet (Version Complète) */}
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
                { name: 'YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(sourcesTrack.artist + ' ' + sourcesTrack.name)}`, color: 'from-red-600 to-red-700', direct: true },
                { name: 'Spotify', url: `https://open.spotify.com/search/${encodeURIComponent(sourcesTrack.artist + ' ' + sourcesTrack.name)}`, color: 'from-emerald-500 to-green-600', direct: true },
                { name: 'Apple Music', url: sourcesTrack.trackViewUrl || `https://music.apple.com/search?term=${encodeURIComponent(sourcesTrack.artist + ' ' + sourcesTrack.name)}`, color: 'from-pink-500 to-red-500', direct: true },
                { name: 'Deezer', url: `https://www.deezer.com/search/${encodeURIComponent(sourcesTrack.artist + ' ' + sourcesTrack.name)}`, color: 'from-purple-500 to-indigo-600', direct: true }
              ].map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSourcesTrack(null);
                    // Open directly in a safe popup or tab to prevent CORS 404 proxy blocks
                    window.open(link.url, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${link.color} flex items-center justify-center font-bold text-xs text-white shadow-md`}>
                      {link.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white">Écouter sur {link.name}</span>
                      <span className="block text-[10px] text-white/40">{isFr ? 'Application / Web' : 'App / Web'}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/40" />
                </button>
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
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2" />
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <img src={optionsTrack.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">{optionsTrack.name}</h4>
                <p className="text-xs text-white/50 truncate">{optionsTrack.artist}</p>
              </div>
            </div>
            <button
              onClick={() => {
                toggleLike(optionsTrack);
                setOptionsTrack(null);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-xs font-semibold text-white/90"
            >
              <Heart className={`w-4 h-4 ${isLiked(optionsTrack.id) ? 'text-blue-500 fill-blue-500' : 'text-white/60'}`} />
              <span>{isLiked(optionsTrack.id) ? (isFr ? 'Retirer des favoris' : 'Remove from favorites') : (isFr ? 'Ajouter aux favoris' : 'Add to favorites')}</span>
            </button>
            <button
              onClick={() => {
                setOptionsTrack(null);
                setSourcesTrack(optionsTrack);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-xs font-semibold text-white/90"
            >
              <ExternalLink className="w-4 h-4 text-white/60" />
              <span>{isFr ? 'Écouter la version complète' : 'Listen full track'}</span>
            </button>
            <button
              onClick={() => {
                openArtist(optionsTrack);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-xs font-semibold text-white/90"
            >
              <Mic2 className="w-4 h-4 text-white/60" />
              <span>{isFr ? "Voir l'artiste" : 'View artist'}</span>
            </button>
            <button
              onClick={() => {
                shareTrack(optionsTrack);
                setOptionsTrack(null);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-xs font-semibold text-white/90"
            >
              <Share2 className="w-4 h-4 text-white/60" />
              <span>{isFr ? 'Partager' : 'Share'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="h-14 px-4 bg-[#07080d]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Music className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
              LevelMusic
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">30s HD</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(!user || user.isGuest) && (
            <button
              onClick={onRequireAuth}
              className="px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold shadow-md cursor-pointer"
            >
              {isFr ? 'Connexion' : 'Sign in'}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-28">

        {/* VIEW 1: HOME */}
        {view === 'home' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Quick Hero Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/40 via-indigo-950/30 to-purple-950/20 border border-blue-500/20 relative overflow-hidden">
              <div className="relative z-10 max-w-md space-y-2">
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                  {isFr ? 'Stream Illimité' : 'Unlimited Stream'}
                </span>
                <h1 className="text-2xl font-black text-white leading-tight">
                  {isFr ? 'Découvrez la musique en extraits HD 30s' : 'Explore music with HD 30s snippets'}
                </h1>
                <p className="text-xs text-white/60">
                  {isFr ? 'Fondu audio intelligent, lecteur continu sans coupure et synchronisation cloud.' : 'Smart audio fade-out, continuous gapless playback, and cloud sync.'}
                </p>
              </div>
            </div>

            {/* Recently Played */}
            {recentlyPlayed.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{isFr ? 'Écoutés Récemment' : 'Recently Played'}</span>
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {recentlyPlayed.slice(0, 10).map((t, idx) => (
                    <div
                      key={t.id}
                      onClick={() => playTrack(t, recentlyPlayed, idx)}
                      className="w-28 shrink-0 space-y-1.5 cursor-pointer group"
                    >
                      <div className="w-28 h-28 rounded-2xl overflow-hidden relative shadow-lg bg-white/5 border border-white/10 group-hover:scale-102 transition-transform">
                        <img src={t.image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>
                      <div className="text-[11px] font-bold text-white truncate">{t.name}</div>
                      <div className="text-[10px] text-white/50 truncate">{t.artist}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Rows */}
            {homeLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-xs text-white/40">{isFr ? 'Chargement des tendances...' : 'Loading hits...'}</span>
              </div>
            ) : (
              homeRows.map(row => (
                <div key={row.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: row.color }} />
                      <span>{isFr ? row.title : row.titleEn}</span>
                    </h3>
                  </div>
                  <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none">
                    {row.data.map((t: Track, idx: number) => (
                      <div
                        key={t.id}
                        onClick={() => playTrack(t, row.data, idx)}
                        className="w-32 shrink-0 space-y-2 cursor-pointer group"
                      >
                        <div className="w-32 h-32 rounded-2xl overflow-hidden relative shadow-lg bg-white/5 border border-white/10 group-hover:scale-102 transition-transform">
                          <img src={t.image} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-7 h-7 text-white fill-white" />
                          </div>
                        </div>
                        <div>
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
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder={isFr ? 'Rechercher un titre, artiste, genre...' : 'Search songs, artists, genres...'}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/40 outline-none focus:border-blue-500/60 transition-colors"
              />
              {searchQ && (
                <button onClick={() => setSearchQ('')} className="absolute right-3 top-3 text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {searching ? (
              <div className="py-16 flex justify-center">
                <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((t, idx) => (
                  <div
                    key={t.id}
                    onClick={() => playTrack(t, searchResults, idx)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={t.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${currentTrack?.id === t.id ? 'text-blue-400' : 'text-white'}`}>{t.name}</div>
                        <div className="text-[10px] text-white/50 truncate">{t.artist}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); toggleLike(t); }}
                        className="p-1.5 text-white/40 hover:text-blue-400"
                      >
                        <Heart className={`w-4 h-4 ${isLiked(t.id) ? 'fill-blue-500 text-blue-500' : ''}`} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setOptionsTrack(t); }}
                        className="p-1.5 text-white/40 hover:text-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQ ? (
              <div className="py-12 text-center text-xs text-white/40">
                {isFr ? 'Aucun résultat trouvé.' : 'No results found.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {CATEGORIES.slice(0, 12).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSearchQ(cat.term)}
                    className="p-4 rounded-2xl text-left font-bold text-xs text-white shadow-md hover:scale-102 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${cat.color}dd, ${cat.color}66)` }}
                  >
                    {isFr ? cat.title : cat.titleEn}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: LIBRARY */}
        {view === 'library' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Auth notice if guest */}
            {(!user || user.isGuest) && (
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between gap-3">
                <div className="text-xs text-blue-200">
                  {isFr ? 'Connectez-vous pour synchroniser vos favoris sur tous vos appareils.' : 'Sign in to sync your library across all devices.'}
                </div>
                <button
                  onClick={onRequireAuth}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 cursor-pointer"
                >
                  {isFr ? 'Se connecter' : 'Sign in'}
                </button>
              </div>
            )}

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
                  className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
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
              className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white cursor-pointer"
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
            <button onClick={() => setPlayerOpen(false)} className="p-2 text-white/70 hover:text-white cursor-pointer">
              <ChevronDown className="w-6 h-6" />
            </button>
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{isFr ? 'EN LECTURE' : 'NOW PLAYING'}</span>
              <div className="text-xs font-bold text-white max-w-[200px] truncate">{currentTrack.album || currentTrack.artist}</div>
            </div>
            <button onClick={() => setOptionsTrack(currentTrack)} className="p-2 text-white/70 hover:text-white cursor-pointer">
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
              <button onClick={() => toggleLike(currentTrack)} className="p-1 cursor-pointer">
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
                onClick={() => setShuffleOn(prev => !prev)}
                className={`p-2 transition-colors cursor-pointer ${shuffleOn ? 'text-blue-500' : 'text-white/40'}`}
                title={shuffleOn ? (isFr ? 'Lecture aléatoire activée' : 'Shuffle on') : (isFr ? 'Lecture aléatoire désactivée' : 'Shuffle off')}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button onClick={playPrev} className="p-2 text-white hover:scale-110 transition-transform cursor-pointer">
                <SkipBack className="w-6 h-6 fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform cursor-pointer"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
              </button>
              <button onClick={playNext} className="p-2 text-white hover:scale-110 transition-transform cursor-pointer">
                <SkipForward className="w-6 h-6 fill-current" />
              </button>
              <button
                onClick={() => setRepeatMode(m => m === 'none' ? 'all' : m === 'all' ? 'one' : 'none')}
                className={`p-2 transition-colors cursor-pointer ${repeatMode !== 'none' ? 'text-blue-500' : 'text-white/40'}`}
                title={repeatMode === 'one' ? (isFr ? 'Répéter ce titre' : 'Repeat 1') : repeatMode === 'all' ? (isFr ? 'Répéter la liste' : 'Repeat all') : (isFr ? 'Pas de répétition' : 'No repeat')}
              >
                {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </button>
            </div>

            {/* Volume control slider + Full track button */}
            <div className="flex items-center justify-between pt-2 gap-4">
              <div className="flex items-center gap-2 flex-1 max-w-[140px]">
                <button onClick={toggleMute} className="p-1 text-white/50 hover:text-white cursor-pointer shrink-0">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none outline-none accent-blue-500 cursor-pointer"
                />
              </div>
              <button
                onClick={() => setSourcesTrack(currentTrack)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors cursor-pointer shrink-0"
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
          { id: 'library', icon: Library, label: isFr ? 'Bibliothèque' : 'Library' }
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

      {/* In-App Browser Modal */}
      {inAppBrowserData && (
        <InAppBrowserModal
          data={inAppBrowserData}
          onClose={() => setInAppBrowserData(null)}
          lang={appLang}
        />
      )}

    </div>
  );
};
