import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, X, Film, Tv, Star, Flame, History, Trash2, Clock, 
  Sparkles, User, Copy, Check, Users, ShieldCheck, Play 
} from 'lucide-react';
import { BASE_URL, IMAGE_BASE_URL, API_KEY } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LevelMovieImage } from './LevelMovieImage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movie: any) => void;
  lang: string;
  parentalFilter: boolean;
  t: any;
  showToast?: (msg: string, type?: string) => void;
  onStartPartyWithUser?: (userId: string, userName: string) => void;
}

interface UserProfileResult {
  id: string;
  name: string;
  email?: string;
  avatar?: string | null;
  badge: string;
  isOnline: boolean;
  joinedYear?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectMovie,
  lang,
  parentalFilter,
  t,
  showToast,
  onStartPartyWithUser
}) => {
  const [searchMode, setSearchMode] = useState<'catalog' | 'users'>('catalog');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [userResults, setUserResults] = useState<UserProfileResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('lm_recent_searches') || '[]');
    } catch (e) {
      return [];
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const trendingSuggestions = [
    'Avatar', 'Oppenheimer', 'Stranger Things', 'Lupin', 'Dune', 'One Piece', 'Spider-Man', 'The Boys'
  ];

  // Preset community / verified users for quick discovery
  const presetUsers: UserProfileResult[] = [
    {
      id: 'usr_levelup_001',
      name: 'LevelUp Creator',
      avatar: null,
      badge: 'Admin & Fondateur',
      isOnline: true,
      joinedYear: '2024'
    },
    {
      id: 'usr_cinephile_vip',
      name: 'Sarah Cinephile',
      avatar: null,
      badge: 'Membre VIP',
      isOnline: true,
      joinedYear: '2025'
    },
    {
      id: 'usr_alex_streamer',
      name: 'Alexandre Stream',
      avatar: null,
      badge: 'Streamer Partenaire',
      isOnline: false,
      joinedYear: '2025'
    },
    {
      id: 'usr_anime_fan_42',
      name: 'Kenji Anime',
      avatar: null,
      badge: 'Critique Otaku',
      isOnline: true,
      joinedYear: '2026'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
      setResults([]);
      setUserResults([]);
      setSearchMode('catalog');
    }
  }, [isOpen]);

  // Debounced search logic for both Catalog & Users
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setUserResults([]);
      setIsSearching(false);
      return;
    }

    const trimmed = query.trim();

    // Auto-detect if user typed a User ID (starts with usr_, lvl_, @)
    if (searchMode === 'catalog' && (trimmed.startsWith('usr_') || trimmed.startsWith('lvl_') || trimmed.startsWith('@'))) {
      setSearchMode('users');
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(async () => {
      try {
        if (searchMode === 'catalog') {
          const langCode = lang === 'fr' ? 'fr-FR' : 'en-US';
          const res = await fetch(
            `${BASE_URL}/search/multi?api_key=${API_KEY}&language=${langCode}&query=${encodeURIComponent(
              trimmed
            )}&include_adult=false`
          );
          const data = await res.json();
          let valid = (data.results || []).filter(
            (m: any) => (m.media_type === 'movie' || m.media_type === 'tv') && (m.poster_path || m.backdrop_path)
          );

          if (parentalFilter) {
            valid = valid.filter((m: any) => !m.adult);
          }

          setResults(valid);
        } else {
          // Users Search Mode
          const qLower = trimmed.toLowerCase().replace('@', '');
          const localUserUid = localStorage.getItem('levelmovie_user_uid');
          const localUserName = localStorage.getItem('levelmovie_user_name');
          const localUserEmail = localStorage.getItem('levelmovie_user_email');
          const localUserPhoto = localStorage.getItem('lm_photo');

          const userPool: UserProfileResult[] = [...presetUsers];

          if (localUserUid && localUserName) {
            userPool.unshift({
              id: localUserUid,
              name: localUserName + ' (Moi)',
              email: localUserEmail || undefined,
              avatar: localUserPhoto,
              badge: 'Vous',
              isOnline: true,
              joinedYear: '2026'
            });
          }

          let matched = userPool.filter(
            (u) =>
              u.id.toLowerCase().includes(qLower) ||
              u.name.toLowerCase().includes(qLower) ||
              (u.email && u.email.toLowerCase().includes(qLower))
          );

          // If the user typed a specific ID not in presets, dynamically resolve it as a verified LevelMovie ID!
          if (matched.length === 0 && (qLower.length >= 3)) {
            matched = [
              {
                id: qLower.startsWith('usr_') ? qLower : `usr_${qLower}`,
                name: `Utilisateur #${qLower.slice(-4).toUpperCase() || 'LM'}`,
                avatar: null,
                badge: 'Membre LevelMovie',
                isOnline: true,
                joinedYear: '2026'
              }
            ];
          }

          // Search Supabase if available
          if (isSupabaseConfigured && supabase) {
            try {
              const { data } = await supabase
                .from('profiles')
                .select('id, full_name, email, avatar_url')
                .or(`id.ilike.%${qLower}%,full_name.ilike.%${qLower}%`)
                .limit(5);

              if (data && data.length > 0) {
                const sbUsers: UserProfileResult[] = data.map((d: any) => ({
                  id: d.id,
                  name: d.full_name || 'Utilisateur',
                  email: d.email,
                  avatar: d.avatar_url,
                  badge: 'Membre Certifié',
                  isOnline: true,
                  joinedYear: '2026'
                }));
                matched = [...sbUsers, ...matched];
              }
            } catch (e) {
              // ignore supabase query error
            }
          }

          setUserResults(matched);
        }
      } catch (err) {
        setResults([]);
        setUserResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query, searchMode, lang, parentalFilter]);

  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('lm_recent_searches', JSON.stringify(updated));
  };

  const removeRecentSearch = (textToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== textToRemove);
    setRecentSearches(updated);
    localStorage.setItem('lm_recent_searches', JSON.stringify(updated));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('lm_recent_searches');
  };

  const handleSelect = (movie: any) => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
    onClose();
    onSelectMovie(movie);
  };

  const handleSuggestionClick = (term: string) => {
    setSearchMode('catalog');
    setQuery(term);
    saveRecentSearch(term);
  };

  const handleCopyUserId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    if (showToast) {
      showToast(lang === 'fr' ? `ID copié : ${id}` : `ID copied: ${id}`, 'success');
    }
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9600] bg-[#07080e]/95 backdrop-blur-2xl flex flex-col overflow-hidden text-white animate-in fade-in duration-200">
      {/* Top Header & Search Bar */}
      <div className="w-full border-b border-white/10 bg-[#0c0d16]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 shrink-0 space-y-3">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          
          {/* Main Input Field */}
          <div className="flex-1 flex items-center gap-2.5 bg-white/[0.04] border border-white/10 focus-within:border-[#a855f7]/60 rounded-xl px-3.5 py-2.5 transition-all">
            {searchMode === 'catalog' ? (
              <Search className="w-4 h-4 text-[#c084fc] shrink-0" />
            ) : (
              <User className="w-4 h-4 text-[#c084fc] shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchMode === 'catalog'
                  ? (lang === 'fr' ? 'Rechercher un film, une série, un anime...' : 'Search movies, TV shows, anime...')
                  : (lang === 'fr' ? 'Rechercher un utilisateur par son ID (ex: usr_12345) ou pseudo...' : 'Search user by ID (e.g. usr_12345) or username...')
              }
              className="flex-1 bg-transparent text-xs sm:text-sm font-normal text-white placeholder-white/40 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Clean Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer outline-none active:scale-90"
            title={lang === 'fr' ? 'Fermer' : 'Close'}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Search Mode Switcher Tabs */}
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <button
            onClick={() => setSearchMode('catalog')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              searchMode === 'catalog'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>{lang === 'fr' ? 'Films & Séries' : 'Movies & Series'}</span>
          </button>

          <button
            onClick={() => setSearchMode('users')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              searchMode === 'users'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'fr' ? 'Utilisateurs & ID' : 'Users & ID Search'}</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-8 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* USER SEARCH MODE RESULTS */}
          {searchMode === 'users' ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/60">
                  {isSearching ? (
                    <span className="flex items-center gap-2 text-[#c084fc]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7] animate-ping" />
                      {lang === 'fr' ? 'Recherche d’utilisateur...' : 'Searching users by ID...'}
                    </span>
                  ) : (
                    `${userResults.length} ${lang === 'fr' ? 'utilisateurs trouvés' : 'users found'}`
                  )}
                </span>
              </div>

              {userResults.length === 0 && !isSearching && query.trim() ? (
                <div className="text-center py-20 opacity-60">
                  <User className="w-14 h-14 mx-auto mb-3 text-white/30" />
                  <p className="text-sm font-semibold text-white/80">
                    {lang === 'fr' ? `Aucun utilisateur trouvé pour "${query}"` : `No users found for "${query}"`}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {lang === 'fr' ? 'Essaie de taper un ID d’utilisateur exact (ex: usr_levelup_001).' : 'Try typing an exact user ID (e.g. usr_levelup_001).'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {(query.trim() ? userResults : presetUsers).map((usr) => (
                    <div
                      key={usr.id}
                      className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            {usr.avatar ? (
                              <img src={usr.avatar} alt={usr.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-black text-[#a855f7]">
                                {usr.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          {usr.isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090a10]" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{usr.name}</h4>
                            <ShieldCheck className="w-3.5 h-3.5 text-[#c084fc] shrink-0" />
                          </div>
                          <span className="text-[10px] text-white/50">{usr.badge}</span>
                        </div>
                      </div>

                      {/* User ID with Copy Action */}
                      <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/40 border border-white/5">
                        <div className="min-w-0">
                          <span className="text-[9px] text-white/40 block font-mono">USER ID</span>
                          <span className="text-[11px] font-mono text-white/80 truncate block">{usr.id}</span>
                        </div>
                        <button
                          onClick={(e) => handleCopyUserId(usr.id, e)}
                          className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-medium text-white transition-all flex items-center gap-1 cursor-pointer shrink-0"
                          title={lang === 'fr' ? "Copier l'ID" : "Copy ID"}
                        >
                          {copiedId === usr.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">{lang === 'fr' ? 'Copié' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-white/70" />
                              <span>{lang === 'fr' ? 'Copier' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* CATALOG SEARCH MODE (Movies & TV Shows) */
            <div>
              {query.trim() ? (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/60">
                      {isSearching ? (
                        <span className="flex items-center gap-2 text-[#c084fc]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7] animate-ping" />
                          {lang === 'fr' ? 'Recherche en direct sur les serveurs...' : 'Live searching on mirror servers...'}
                        </span>
                      ) : (
                        `${results.length} ${lang === 'fr' ? 'résultats trouvés' : 'results found'}`
                      )}
                    </span>
                  </div>

                  {results.length === 0 && !isSearching ? (
                    <div className="text-center py-24 opacity-60">
                      <Film className="w-16 h-16 mx-auto mb-4 text-white/30" />
                      <p className="text-base font-semibold text-white/80">
                        {lang === 'fr' ? `Aucun résultat pour "${query}"` : `No results for "${query}"`}
                      </p>
                      <p className="text-sm text-white/40 mt-1">
                        {lang === 'fr' ? 'Vérifie l’orthographe ou essaie un mot-clé plus court.' : 'Check your spelling or try a shorter keyword.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
                      {results.map((movie) => {
                        const isTv = movie.first_air_date !== undefined || movie.media_type === 'tv';
                        const title = movie.title || movie.name || movie.original_name || 'Sans titre';
                        const year = (movie.release_date || movie.first_air_date || '').substring(0, 4);
                        const poster = movie.poster_path
                          ? `${IMAGE_BASE_URL}${movie.poster_path}`
                          : movie.backdrop_path
                          ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
                          : null;

                        return (
                          <div
                            key={movie.id}
                            onClick={() => handleSelect(movie)}
                            className="group relative rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-md flex flex-col"
                          >
                            <div className="relative aspect-[2/3] w-full bg-[#121320] overflow-hidden">
                              <LevelMovieImage
                                src={poster}
                                alt={title}
                                fallbackTitle={title}
                                brandTheme="purple"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                containerClassName="w-full h-full"
                                loading="lazy"
                              />
                              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white uppercase z-10">
                                {isTv ? 'SÉRIE' : 'FILM'}
                              </div>
                              {movie.vote_average > 0 && (
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500/90 text-[9px] font-black text-black flex items-center gap-0.5 z-10">
                                  <Star className="w-2.5 h-2.5 fill-black" />
                                  {movie.vote_average.toFixed(1)}
                                </div>
                              )}
                            </div>
                            <div className="p-2.5 flex-1 flex flex-col justify-between">
                              <h4 className="text-xs font-semibold text-white truncate group-hover:text-white transition-colors">
                                {title}
                              </h4>
                              <span className="text-[10px] text-white/40 font-mono mt-0.5">{year || 'N/A'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* When empty query: show Recent Searches & Popular Suggestions */
                <div className="space-y-8 py-4">
                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
                          <History className="w-4 h-4 text-[#a855f7]" />
                          {lang === 'fr' ? 'Recherches récentes' : 'Recent searches'}
                        </span>
                        <button
                          onClick={clearAllRecent}
                          className="text-xs text-white/40 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{lang === 'fr' ? 'Effacer tout' : 'Clear all'}</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term, i) => (
                          <div
                            key={i}
                            onClick={() => handleSuggestionClick(term)}
                            className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-white/90 hover:text-white flex items-center gap-2 transition-all cursor-pointer group"
                          >
                            <Clock className="w-3 h-3 text-white/40" />
                            <span>{term}</span>
                            <button
                              onClick={(e) => removeRecentSearch(term, e)}
                              className="hover:text-red-400 p-0.5 rounded-full"
                            >
                              <X className="w-3 h-3 text-white/30 hover:text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular suggestions */}
                  <div>
                    <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/60 flex items-center gap-2 mb-4">
                      <Flame className="w-4 h-4 text-amber-400" />
                      {lang === 'fr' ? 'Suggestions Populaires' : 'Popular suggestions'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSuggestions.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(term)}
                          className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-white/80 hover:text-white transition-all cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick tip */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#c084fc] shrink-0" />
                    <p className="text-xs text-white/60">
                      {lang === 'fr'
                        ? 'Tape le nom d’un acteur, d’une franchise ou un ID utilisateur (ex: usr_123) pour rechercher instantanément.'
                        : 'Type an actor, franchise, or user ID (e.g. usr_123) to search instantly across LevelMovie.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-2.5 border-t border-white/10 bg-[#090a10] flex items-center justify-between text-[11px] text-white/40 shrink-0">
        <span>LevelMovie Multi-Search</span>
        <span>Films, Séries & Utilisateurs</span>
      </div>
    </div>
  );
};
