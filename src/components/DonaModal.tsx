import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ArrowUp, X, Clock, Plus, Play, Star, 
  Trash2, ChevronRight, Film, Popcorn, Flame, Shuffle, Clapperboard, Users,
  Search, Compass, Bell
} from 'lucide-react';
import { BASE_URL, API_KEY, DonaStar } from '../constants';

interface DonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movie: any, mode?: string) => void;
  onCreateParty?: (movie: any, roomName?: string) => void;
  onNavigateCategory?: (category: string) => void;
  onOpenSearch?: (query?: string) => void;
  onOpenSettings?: () => void;
  onOpenSupport?: () => void;
  onToggleWatchlist?: (movie: any) => void;
  showToast?: (msg: string, type?: string) => void;
  lang?: string;
  historyTrigger?: number;
  newChatTrigger?: number;
}

interface Message {
  id: string;
  sender: 'dona' | 'user';
  text: string;
  movies?: any[];
  time: string;
}

interface SavedConversation {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

const STORAGE_KEY = 'levelmovie_dona_saved_chats_v2';
const REMINDERS_KEY = 'levelmovie_dona_reminders';

export const DonaModal: React.FC<DonaModalProps> = ({
  isOpen,
  onClose,
  onSelectMovie,
  onCreateParty,
  onNavigateCategory,
  onOpenSearch,
  onOpenSettings,
  onOpenSupport,
  onToggleWatchlist,
  showToast,
  lang = 'fr',
  historyTrigger = 0,
  newChatTrigger = 0
}) => {
  const isFr = lang === 'fr';
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => `session_${Date.now()}`);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);

  // Close plus menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
        setShowPlusMenu(false);
      }
    };
    if (showPlusMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPlusMenu]);

  // Toggle history drawer on trigger change
  useEffect(() => {
    if (historyTrigger > 0) {
      setShowHistory(prev => !prev);
    }
  }, [historyTrigger]);

  // Start new conversation on trigger change
  useEffect(() => {
    if (newChatTrigger > 0) {
      handleNewConversation();
    }
  }, [newChatTrigger]);

  // Load saved history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedConversations(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load Dona chat history:', e);
    }
  }, []);

  const persistSession = (sessionMsgs: Message[], sessId: string) => {
    if (sessionMsgs.length === 0) return;
    try {
      const firstUserMsg = sessionMsgs.find(m => m.sender === 'user');
      const title = firstUserMsg 
        ? firstUserMsg.text.slice(0, 32) + (firstUserMsg.text.length > 32 ? '...' : '')
        : (isFr ? 'Discussion Cinéma' : 'Cinema Chat');

      const nowStr = new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      setSavedConversations(prev => {
        const filtered = prev.filter(c => c.id !== sessId);
        const updated: SavedConversation[] = [
          {
            id: sessId,
            title,
            date: nowStr,
            messages: sessionMsgs
          },
          ...filtered
        ].slice(0, 30);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.warn('Failed to persist Dona session:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const clientSearchMovies = async (queryText: string) => {
    try {
      const cleanQ = encodeURIComponent(queryText.trim());
      const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=${isFr ? 'fr-FR' : 'en-US'}&query=${cleanQ}&page=1&include_adult=false`);
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        return data.results.filter((m: any) => m.poster_path && (m.media_type === 'movie' || m.media_type === 'tv' || !m.media_type)).slice(0, 5);
      }
    } catch (e) {
      console.warn('Dona client search error:', e);
    }
    try {
      const fallbackRes = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${isFr ? 'fr-FR' : 'en-US'}&page=1`);
      const fallbackData = await fallbackRes.json();
      return (fallbackData.results || []).slice(0, 5);
    } catch (_) {
      return [];
    }
  };

  const fetchMovieById = async (id: number | string, type = 'movie') => {
    try {
      const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=${isFr ? 'fr-FR' : 'en-US'}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to fetch movie by ID:', e);
    }
    return null;
  };

  const handleTagAction = async (actionType: string, param: string, label?: string) => {
    switch (actionType) {
      case 'movie': {
        const m = await fetchMovieById(param);
        if (m) {
          onSelectMovie(m, 'info');
        } else if (onOpenSearch) {
          onOpenSearch(label || param);
        }
        break;
      }
      case 'play': {
        const m = await fetchMovieById(param);
        if (m) {
          onSelectMovie(m, 'play');
        }
        break;
      }
      case 'trailer': {
        const m = await fetchMovieById(param);
        if (m) {
          onSelectMovie(m, 'trailer');
        }
        break;
      }
      case 'party': {
        const m = await fetchMovieById(param);
        if (m && onCreateParty) {
          onCreateParty(m, label && label !== m.title ? label : undefined);
        } else if (onNavigateCategory) {
          onNavigateCategory('party');
        }
        break;
      }
      case 'remind': {
        try {
          const reminders = JSON.parse(localStorage.getItem(REMINDERS_KEY) || '[]');
          reminders.push({ id: param, title: label || param, date: Date.now() });
          localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
          if (showToast) {
            showToast(isFr ? `🔔 Rappel activé pour « ${label || param} » !` : `🔔 Reminder set for "${label || param}"!`, 'info');
          }
        } catch (_) {}
        break;
      }
      case 'watchlist': {
        const m = await fetchMovieById(param);
        if (m && onToggleWatchlist) {
          onToggleWatchlist(m);
        } else if (onNavigateCategory) {
          onNavigateCategory('watchlist');
        }
        break;
      }
      case 'category': {
        if (onNavigateCategory) {
          onNavigateCategory(param);
        }
        break;
      }
      case 'search': {
        if (onOpenSearch) {
          onOpenSearch(param);
        }
        break;
      }
      case 'settings': {
        if (onOpenSettings) onOpenSettings();
        break;
      }
      case 'support': {
        if (onOpenSupport) onOpenSupport();
        break;
      }
      default:
        break;
    }
  };

  const renderMessageContent = (text: string) => {
    const tagRegex = /\[(action:[a-z]+|play|trailer|party|category):([^\]|]+)(?:\|([^\]]+))?\]/gi;
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tagRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      let rawType = match[1].toLowerCase();
      if (rawType.startsWith('action:')) {
        rawType = rawType.replace('action:', '');
      }
      const param = match[2];
      const label = match[3] || param;

      let icon = <Film className="w-3.5 h-3.5" />;
      let badgeStyle = "bg-purple-600/20 border-purple-500/30 text-purple-200 hover:bg-purple-600/40";

      if (rawType === 'play') {
        icon = <Play className="w-3 h-3 fill-current text-emerald-400" />;
        badgeStyle = "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80 shadow-[0_0_12px_rgba(16,185,129,0.2)]";
      } else if (rawType === 'trailer') {
        icon = <Clapperboard className="w-3.5 h-3.5 text-pink-400" />;
        badgeStyle = "bg-pink-950/60 border-pink-500/50 text-pink-300 hover:bg-pink-900/80 shadow-[0_0_12px_rgba(236,72,153,0.2)]";
      } else if (rawType === 'party') {
        icon = <Users className="w-3.5 h-3.5 text-amber-400" />;
        badgeStyle = "bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/80 shadow-[0_0_12px_rgba(245,158,11,0.2)]";
      } else if (rawType === 'remind') {
        icon = <Bell className="w-3.5 h-3.5 text-yellow-400" />;
        badgeStyle = "bg-yellow-950/60 border-yellow-500/50 text-yellow-300 hover:bg-yellow-900/80";
      } else if (rawType === 'search') {
        icon = <Search className="w-3.5 h-3.5 text-cyan-400" />;
        badgeStyle = "bg-cyan-950/60 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/80";
      } else if (rawType === 'category') {
        icon = <Compass className="w-3.5 h-3.5 text-blue-400" />;
        badgeStyle = "bg-blue-950/60 border-blue-500/50 text-blue-300 hover:bg-blue-900/80";
      }

      parts.push(
        <button
          key={`tag_${matchIndex}`}
          type="button"
          onClick={() => handleTagAction(rawType, param, label)}
          className={`inline-flex items-center gap-1.5 mx-1 my-0.5 px-3 py-1.5 rounded-xl border text-xs font-bold tracking-wide transition-all duration-150 cursor-pointer shadow-md active:scale-95 ${badgeStyle}`}
          title={`Action : ${label}`}
        >
          {icon}
          <span>{label}</span>
          <ChevronRight className="w-3 h-3 opacity-70" />
        </button>
      );

      lastIndex = matchIndex + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isTyping) return;

    setShowPlusMenu(false);
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      time: userTime
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/dona/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          lang: isFr ? 'fr' : 'en'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const botMsg: Message = {
          id: `dona_${Date.now()}`,
          sender: 'dona',
          text: data.text || (isFr ? 'Voici ce que j\'ai préparé pour vous :' : 'Here is what I prepared for you:'),
          movies: data.movies || [],
          time: botTime
        };

        const finalMsgs = [...newMsgs, botMsg];
        setMessages(finalMsgs);
        setIsTyping(false);
        persistSession(finalMsgs, currentSessionId);
        return;
      }
    } catch (err) {
      console.warn('Backend Dona request failed, using client fallback:', err);
    }

    try {
      const moviesFound = await clientSearchMovies(query);
      let answerText = '';
      if (moviesFound && moviesFound.length > 0) {
        const topTitles = moviesFound.map((m: any) => `« ${m.title || m.name} »`).join(', ');
        answerText = isFr
          ? `Voici d'excellentes pépites trouvées pour « ${query} » : ${topTitles}.\n\nClique directement ci-dessous pour lancer le film [play:${moviesFound[0].id}|${moviesFound[0].title || moviesFound[0].name}], visionner sa bande-annonce [trailer:${moviesFound[0].id}|${moviesFound[0].title || moviesFound[0].name}] ou démarrer une Watch Party [party:${moviesFound[0].id}|${moviesFound[0].title || moviesFound[0].name}] :`
          : `Here are great recommendations for "${query}": ${topTitles}.\n\nClick below to stream [play:${moviesFound[0].id}|${moviesFound[0].title || moviesFound[0].name}], watch trailers [trailer:${moviesFound[0].id}|${moviesFound[0].title || moviesFound[0].name}], or launch a Watch Party [party:${moviesFound[0].id}|${moviesFound[0].title || moviesFound[0].name}]:`;
      } else {
        answerText = isFr
          ? `Je suis prête à exécuter toutes vos demandes sur LevelMovie : lancer des Watch Parties, jouer des films, mettre des rappels de sortie ou chercher dans tout le catalogue !`
          : `I am ready to manage everything for you on LevelMovie: start Watch Parties, stream titles, set release reminders, or browse the entire catalog!`;
      }

      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const botMsg: Message = {
        id: `dona_${Date.now()}`,
        sender: 'dona',
        text: answerText,
        movies: moviesFound,
        time: botTime
      };
      const finalMsgs = [...newMsgs, botMsg];
      setMessages(finalMsgs);
      setIsTyping(false);
      persistSession(finalMsgs, currentSessionId);
    } catch (e) {
      setIsTyping(false);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const errMsgs = [
        ...newMsgs,
        {
          id: `dona_err_${Date.now()}`,
          sender: 'dona' as const,
          text: isFr 
            ? "Oups, je rencontre une petite difficulté avec le catalogue. Peux-tu reformuler ta recherche cinéma ?"
            : "Oops, I had a brief issue querying titles. Could you rephrase your request?",
          time: botTime
        }
      ];
      setMessages(errMsgs);
      persistSession(errMsgs, currentSessionId);
    }
  };

  const handleNewConversation = () => {
    if (messages.length > 0) {
      persistSession(messages, currentSessionId);
    }
    const newId = `session_${Date.now()}`;
    setCurrentSessionId(newId);
    setMessages([]);
    setShowHistory(false);
    setShowPlusMenu(false);
    setInputVal('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleLoadConversation = (conv: SavedConversation) => {
    setCurrentSessionId(conv.id);
    setMessages(conv.messages);
    setShowHistory(false);
    setShowPlusMenu(false);
  };

  const handleDeleteConversation = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedConversations.filter(c => c.id !== idToDelete);
    setSavedConversations(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}
  };

  const handleClearAllHistory = () => {
    setSavedConversations([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  };

  const plusShortcuts = isFr ? [
    {
      icon: <Users className="w-4 h-4 text-purple-400" />,
      label: "Créer une Watch Party",
      prompt: "Crée une Watch Party pour un super film d'action ou de science-fiction avec salon en direct."
    },
    {
      icon: <Bell className="w-4 h-4 text-amber-400" />,
      label: "Rappels & Sorties 2025",
      prompt: "Rappelle-moi les prochaines grandes sorties cinéma très attendues cette année."
    },
    {
      icon: <Popcorn className="w-4 h-4 text-amber-400" />,
      label: "Quoi regarder ce soir ?",
      prompt: "Que me conseilles-tu de regarder ce soir pour une soirée cinéma parfaite ?"
    },
    {
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      label: "Pépites SF & Thriller",
      prompt: "Recommande-moi les meilleurs thrillers psychologiques ou films de science-fiction récents."
    },
    {
      icon: <Clapperboard className="w-4 h-4 text-pink-400" />,
      label: "Bandes-annonces officielles",
      prompt: "Quelles sont les dernières bandes-annonces cinéma officielles sorties cette semaine ?"
    },
    {
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      label: "Top 10 films les mieux notés",
      prompt: "Quels sont les 10 films les mieux notés de tous les temps disponibles sur la plateforme ?"
    }
  ] : [
    {
      icon: <Users className="w-4 h-4 text-purple-400" />,
      label: "Create a Watch Party",
      prompt: "Create a Watch Party for a great sci-fi or action movie with sync live room."
    },
    {
      icon: <Bell className="w-4 h-4 text-amber-400" />,
      label: "Release Reminders",
      prompt: "Set reminders for the most anticipated upcoming movies this year."
    },
    {
      icon: <Popcorn className="w-4 h-4 text-amber-400" />,
      label: "What to watch tonight?",
      prompt: "What should I watch tonight for a perfect movie night?"
    },
    {
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      label: "Sci-Fi & Thriller Gems",
      prompt: "Recommend the best recent sci-fi or psychological thrillers."
    },
    {
      icon: <Clapperboard className="w-4 h-4 text-pink-400" />,
      label: "Trending Trailers",
      prompt: "What are the latest official trailers released this week?"
    },
    {
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      label: "Top 10 Highest Rated Movies",
      prompt: "What are the top 10 highest-rated movies of all time on the platform?"
    }
  ];

  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#020202] text-white overflow-hidden shadow-2xl relative">
      
      {/* ======================================================== */}
      {/* BARRE D'ACTIONS PC AVEC ÉTOILE DE DONA & LEVEL IA */}
      {/* ======================================================== */}
      <div className="hidden md:flex h-12 px-6 lg:px-10 bg-[#07070d]/95 border-b border-white/5 items-center justify-between shrink-0 z-30 backdrop-blur-md">
        
        {/* Titre avec DonaStar */}
        <div className="flex items-center gap-2.5">
          <DonaStar className="w-5 h-5 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]" />
          <span className="text-[13px] font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#e9d5ff] via-[#c084fc] to-[#a855f7]">
            Dona
          </span>
        </div>

        {/* Boutons d'actions : Horloge (Historique) & Nouveau (+) */}
        <div className="flex items-center gap-2.5">
          {/* BOUTON 1 : Historique (Horloge) */}
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
              showHistory 
                ? 'bg-[#a855f7] text-white border-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.5)]' 
                : 'bg-white/5 text-white/80 hover:text-white hover:bg-white/10 border-white/10'
            }`}
            title={isFr ? 'Historique des conversations' : 'Chat History'}
          >
            <Clock className="w-3.5 h-3.5 text-[#c084fc]" />
            <span>{isFr ? 'Historique' : 'History'}</span>
            {savedConversations.length > 0 && (
              <span className="text-[9px] px-1.5 bg-[#a855f7]/40 rounded font-mono font-bold text-white">
                {savedConversations.length}
              </span>
            )}
          </button>

          {/* BOUTON 2 : Nouvelle conversation (+) */}
          <button
            type="button"
            onClick={handleNewConversation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 hover:bg-[#a855f7]/20 text-white/90 hover:text-white border border-white/10 hover:border-[#a855f7]/60 rounded-xl text-[11px] font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
            title={isFr ? 'Nouvelle discussion' : 'New conversation'}
          >
            <Plus className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>{isFr ? 'Nouveau' : 'New'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CORPS PRINCIPAL : ESPACE SPACIEUX PC / EXPANDED VIEW */}
      {/* ======================================================== */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* PANNEAU LATÉRAL HISTORIQUE */}
        {showHistory && (
          <aside className="absolute md:relative inset-y-0 left-0 z-40 w-full sm:w-80 lg:w-88 bg-[#09090f] border-r border-white/10 flex flex-col animate-in slide-in-from-left duration-200 shadow-2xl">
            <div className="p-3.5 bg-[#0f0f18] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#a855f7]" />
                <span className="text-[12px] font-black uppercase tracking-wider text-white">
                  {isFr ? 'Historique des échanges' : 'Chat History'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {savedConversations.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="p-1.5 text-white/40 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title={isFr ? 'Effacer tout' : 'Clear all'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowHistory(false)}
                  className="p-1.5 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
              {savedConversations.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-[12px]">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-white/20" />
                  <p>{isFr ? 'Aucun échange récent enregistré.' : 'No recent saved chats.'}</p>
                </div>
              ) : (
                savedConversations.map((conv) => {
                  const isCurrent = conv.id === currentSessionId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleLoadConversation(conv)}
                      className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-left ${
                        isCurrent
                          ? 'bg-[#1c122e] border-[#a855f7] text-white shadow-md'
                          : 'bg-white/[0.02] border-white/5 hover:border-[#a855f7]/50 text-white/80 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-[12px] font-bold truncate">
                          {conv.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/40 mt-1 font-mono">
                          <span>{conv.date}</span>
                          <span>•</span>
                          <span>{conv.messages.length} msg</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-white/40 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-all shrink-0 cursor-pointer"
                        title={isFr ? 'Supprimer' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-[#0b0b12] border-t border-white/10">
              <button
                type="button"
                onClick={handleNewConversation}
                className="w-full py-2.5 px-3 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{isFr ? 'Nouvelle discussion' : 'New chat'}</span>
              </button>
            </div>
          </aside>
        )}

        {/* ZONE DE DISCUSSION CENTRALE PLEIN ÉCRAN / SPACIEUSE */}
        <main className="flex-1 flex flex-col h-full bg-[#020202] relative overflow-hidden">
          
          {/* Flux de messages ou Ecran d'accueil initial */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 py-6 space-y-6 custom-scrollbar">
            
            {/* SI AUCUN MESSAGE : ÉCRAN D'ACCUEIL ÉPURÉ */}
            {messages.length === 0 ? (
              <div className="w-full max-w-2xl mx-auto my-auto py-12 flex flex-col items-center justify-center text-center transition-all duration-300">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-[0.12em] mb-2">
                  Dona
                </h2>
                <p className="text-lg sm:text-xl font-bold text-[#c084fc] tracking-wide mb-2">
                  {isFr ? "Comment puis-je vous aider ?" : "How can I help you today?"}
                </p>
                <p className="text-white/45 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  {isFr 
                    ? "Je peux créer vos Watch Parties, programmer des rappels de sortie, lancer vos films ou chercher dans tout le catalogue."
                    : "I can create Watch Parties, set movie release reminders, stream titles, or search the entire catalog for you."}
                </p>
              </div>
            ) : (
              /* AFFICHAGE DES MESSAGES */
              <div className="max-w-4xl lg:max-w-5xl mx-auto space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
                  >
                    {msg.sender === 'user' ? (
                      /* Message utilisateur : Bulle violette épurée SANS icône */
                      <div className="max-w-[85%] sm:max-w-[75%]">
                        <div className="bg-[#9333ea] text-white font-medium text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-tr-xs shadow-md select-text">
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-white/35 px-1 mt-1 block text-right font-mono">
                          {msg.time}
                        </span>
                      </div>
                    ) : (
                      /* Message Dona : Réponse fluide sans bulle encadrée */
                      <div className="flex gap-3 max-w-[95%] sm:max-w-[90%] items-start">
                        {/* Avatar Dona : Logo pur sans bulle ni boîte de fond */}
                        <div className="shrink-0 mt-1 select-none flex items-center justify-center">
                          <DonaStar className="w-5 h-5 drop-shadow-[0_0_10px_rgba(168,85,247,0.9)]" />
                        </div>

                        {/* Contenu Dona sans bulle / sans boîte de contour */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm leading-relaxed text-white/95 whitespace-pre-wrap select-text">
                            {renderMessageContent(msg.text)}
                          </div>

                          {/* Affichage des cartes de films suggérés avec boutons d'action */}
                          {msg.movies && msg.movies.length > 0 && (
                            <div className="mt-3.5">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                {msg.movies.map((m: any) => (
                                  <div
                                    key={m.id}
                                    className="group bg-[#151522] border border-white/10 hover:border-[#a855f7] rounded-xl p-2.5 flex gap-3 items-center transition-all shadow-md hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                  >
                                    {m.poster_path ? (
                                      <img
                                        src={`https://image.tmdb.org/t/p/w185${m.poster_path}`}
                                        alt={m.title || m.name}
                                        className="w-12 h-16 object-cover rounded-lg shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
                                        onClick={() => onSelectMovie(m, 'info')}
                                      />
                                    ) : (
                                      <div className="w-12 h-16 bg-[#252535] rounded-lg flex items-center justify-center text-xs text-white/40 shrink-0">
                                        🎬
                                      </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                      <h5 
                                        className="text-xs font-bold text-white truncate cursor-pointer group-hover:text-[#c084fc] transition-colors"
                                        onClick={() => onSelectMovie(m, 'info')}
                                      >
                                        {m.title || m.name}
                                      </h5>
                                      <div className="flex items-center gap-2 text-[10px] text-white/50 mt-0.5 font-mono">
                                        <span>{m.release_date || m.first_air_date ? new Date(m.release_date || m.first_air_date).getFullYear() : '2025'}</span>
                                        {m.vote_average > 0 && (
                                          <span className="text-amber-400 font-bold flex items-center gap-0.5">
                                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                                            {m.vote_average.toFixed(1)}
                                          </span>
                                        )}
                                      </div>

                                      {/* Actions directes : Lancer / Bande-Annonce / Watch Party */}
                                      <div className="flex items-center gap-1.5 mt-2">
                                        <button
                                          type="button"
                                          onClick={() => onSelectMovie(m, 'play')}
                                          className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                                          title={isFr ? 'Lancer le film' : 'Play movie'}
                                        >
                                          <Play className="w-2.5 h-2.5 fill-current text-emerald-400" />
                                          <span>Lire</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => onSelectMovie(m, 'trailer')}
                                          className="px-2 py-1 bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                                          title={isFr ? 'Bande-annonce' : 'Trailer'}
                                        >
                                          <Clapperboard className="w-2.5 h-2.5 text-pink-400" />
                                          <span>Trailer</span>
                                        </button>
                                        {onCreateParty && (
                                          <button
                                            type="button"
                                            onClick={() => onCreateParty(m)}
                                            className="px-2 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                                            title={isFr ? 'Lancer une Watch Party' : 'Start Watch Party'}
                                          >
                                            <Users className="w-2.5 h-2.5 text-purple-400" />
                                            <span>Salon</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <span className="text-[10px] text-white/35 mt-2 block font-mono">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Indicateur de réflexion simple et discret */}
                {isTyping && (
                  <div className="flex items-center gap-3 text-white/80 py-2 px-1 animate-in fade-in duration-150">
                    <div className="shrink-0 animate-pulse">
                      <DonaStar className="w-4 h-4 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#c084fc]/90 tracking-wide">
                        {isFr ? "Dona réfléchit..." : "Dona is thinking..."}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            )}

          </div>

          {/* ======================================================== */}
          {/* BARRE INFÉRIEURE : CHAMP DE SAISIE AVEC BOUTON "+" */}
          {/* ======================================================== */}
          <footer className="px-4 sm:px-8 lg:px-12 pt-3 pb-4 sm:pb-5 border-t border-white/5 bg-[#020202]/95 backdrop-blur-3xl shrink-0 z-50 relative">
            <div className="max-w-4xl lg:max-w-5xl mx-auto relative">
              
              {/* Menu Popover déclenché par le bouton "+" */}
              {showPlusMenu && (
                <div 
                  ref={plusMenuRef}
                  className="absolute bottom-16 left-2 sm:left-4 z-50 w-72 sm:w-80 bg-[#0d0d16] border border-[#a855f7]/40 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-150"
                >
                  <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#c084fc] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {isFr ? 'Commandes & Raccourcis' : 'Commands & Shortcuts'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPlusMenu(false)}
                      className="p-1 text-white/40 hover:text-white rounded-md cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-1 space-y-1">
                    {plusShortcuts.map((shortcut, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(shortcut.prompt)}
                        className="w-full p-2.5 rounded-xl hover:bg-white/5 flex items-center gap-2.5 text-left text-xs font-semibold text-white/90 hover:text-white transition-colors cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-[#a855f7]/20 transition-colors">
                          {shortcut.icon}
                        </div>
                        <span className="flex-1 truncate">{shortcut.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#c084fc] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulaire de Saisie avec bouton "+" et Bouton Envoyer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-center bg-[#0d0d14] border border-white/10 focus-within:border-[#a855f7]/70 rounded-2xl px-3 sm:px-4 py-2.5 shadow-2xl transition-all"
              >
                {/* Bouton Plus (+) pur sans bulle */}
                <button
                  type="button"
                  onClick={() => setShowPlusMenu(!showPlusMenu)}
                  className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 mr-1 ${
                    showPlusMenu 
                      ? 'bg-[#a855f7] text-white rotate-45' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  title={isFr ? 'Actions et Raccourcis' : 'Actions & Shortcuts'}
                >
                  <Plus className="w-5 h-5 transition-transform" />
                </button>

                {/* Champ texte principal */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    isFr 
                      ? "Pose une question à Dona" 
                      : "Ask Dona a question"
                  }
                  className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none px-2 py-1.5"
                  disabled={isTyping}
                />

                {/* Bouton Envoyer */}
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isTyping}
                  className={`p-2.5 rounded-xl transition-all shrink-0 ml-1 cursor-pointer ${
                    inputVal.trim() && !isTyping
                      ? 'bg-[#a855f7] text-white hover:bg-[#9333ea] active:scale-95 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                  title={isFr ? 'Envoyer' : 'Send'}
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>

              <div className="text-center mt-2.5">
                <p className="text-[10px] sm:text-[11px] font-medium text-white/35 tracking-wide">
                  {isFr
                    ? "Dona peut faire des erreurs. Pensez à vérifier les informations importantes."
                    : "Dona can make mistakes. Consider checking important information."}
                </p>
              </div>

            </div>
          </footer>

        </main>
      </div>

    </div>
  );
};
