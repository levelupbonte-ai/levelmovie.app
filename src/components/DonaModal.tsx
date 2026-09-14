import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUp, X, Clock, Plus, Play, Trash2, Film, Clapperboard, Users,
  Search, Compass, Bell, Key, Check, ShieldCheck, Bot
} from 'lucide-react';
import { 
  BASE_URL, API_KEY, getWeeklyVipStatus, recordDonaUsage, 
  VipStatusInfo 
} from '../constants';
import { DonaMovieCard } from './DonaMovieCard';
import { DonaApiKeyModal, loadUserApiKeys, UserApiKeyItem } from './DonaApiKeyModal';

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

const STORAGE_KEY = 'levelmovie_dona_saved_chats_v3';
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
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => `session_${Date.now()}`);

  // User Local API Keys Vault
  const [userKeys, setUserKeys] = useState<UserApiKeyItem[]>(() => loadUserApiKeys());
  const activeKey = userKeys.find(k => k.isActive);

  // VIP & Quota State
  const [vipInfo, setVipInfo] = useState<VipStatusInfo>(() => getWeeklyVipStatus());

  const refreshKeys = () => {
    const loaded = loadUserApiKeys();
    setUserKeys(loaded);
  };

  useEffect(() => {
    setVipInfo(getWeeklyVipStatus());

    const handleVipChange = (e: any) => {
      if (e?.detail) setVipInfo(e.detail);
      else setVipInfo(getWeeklyVipStatus());
    };

    const handleQuotaChange = (e: any) => {
      if (e?.detail) {
        setVipInfo(prev => ({
          ...prev,
          donaUsedToday: e.detail.used,
          donaRemainingToday: e.detail.remaining,
          donaDailyLimit: e.detail.limit,
          isVip: e.detail.isVip ?? prev.isVip,
        }));
      }
    };

    const handleKeyChange = () => {
      refreshKeys();
    };

    window.addEventListener('levelmovie_vip_status_change', handleVipChange);
    window.addEventListener('levelmovie_dona_quota_change', handleQuotaChange);
    window.addEventListener('levelmovie_custom_key_updated', handleKeyChange);
    window.addEventListener('storage', handleKeyChange);

    return () => {
      window.removeEventListener('levelmovie_vip_status_change', handleVipChange);
      window.removeEventListener('levelmovie_dona_quota_change', handleQuotaChange);
      window.removeEventListener('levelmovie_custom_key_updated', handleKeyChange);
      window.removeEventListener('storage', handleKeyChange);
    };
  }, [isOpen]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isTyping]);

  // Load saved conversations on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedConversations(parsed);
        }
      }
    } catch (e) {
      console.warn('Error loading Dona history:', e);
    }
  }, []);

  // Triggers from parent
  useEffect(() => {
    if (historyTrigger > 0) {
      setShowHistory(prev => !prev);
    }
  }, [historyTrigger]);

  useEffect(() => {
    if (newChatTrigger > 0) {
      handleNewConversation();
    }
  }, [newChatTrigger]);

  const persistSession = (currentMsgs: Message[], sessionId: string) => {
    if (currentMsgs.length === 0) return;
    try {
      const firstUserMsg = currentMsgs.find(m => m.sender === 'user');
      const title = firstUserMsg 
        ? (firstUserMsg.text.length > 38 ? firstUserMsg.text.substring(0, 38) + '...' : firstUserMsg.text)
        : (isFr ? 'Discussion Dona' : 'Dona Chat');
      
      const now = new Date();
      const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      setSavedConversations(prev => {
        const existingIdx = prev.findIndex(c => c.id === sessionId);
        let updated: SavedConversation[];
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            title,
            messages: currentMsgs
          };
        } else {
          updated = [
            {
              id: sessionId,
              title,
              date: dateStr,
              messages: currentMsgs
            },
            ...prev
          ].slice(0, 40);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.warn('Error saving Dona session:', e);
    }
  };

  const fetchMovieById = async (id: string | number) => {
    try {
      const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=videos,credits`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Error fetching movie details:', e);
    }
    return null;
  };

  const clientSearchMovies = async (searchQuery: string) => {
    try {
      const clean = searchQuery
        .replace(/film|regarder|voir|stream|cherche|trouve|conseille|recommande/gi, '')
        .trim();
      const finalQ = clean.length >= 2 ? clean : searchQuery;

      const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(finalQ)}&page=1&include_adult=false`);
      if (res.ok) {
        const data = await res.json();
        return (data.results || []).slice(0, 4);
      }
    } catch (err) {
      console.warn('Client fallback search failed:', err);
    }
    return [];
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
        badgeStyle = "bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80 shadow-[0_0_12px_rgba(16,185,129,0.25)]";
      } else if (rawType === 'trailer') {
        icon = <Clapperboard className="w-3.5 h-3.5 text-pink-400" />;
        badgeStyle = "bg-pink-950/70 border-pink-500/50 text-pink-300 hover:bg-pink-900/80 shadow-[0_0_12px_rgba(236,72,153,0.25)]";
      } else if (rawType === 'party') {
        icon = <Users className="w-3.5 h-3.5 text-purple-400" />;
        badgeStyle = "bg-purple-950/70 border-purple-500/50 text-purple-200 hover:bg-purple-900/80 shadow-[0_0_12px_rgba(168,85,247,0.25)]";
      } else if (rawType === 'remind') {
        icon = <Bell className="w-3.5 h-3.5 text-amber-400" />;
        badgeStyle = "bg-amber-950/70 border-amber-500/50 text-amber-300 hover:bg-amber-900/80";
      } else if (rawType === 'search') {
        icon = <Search className="w-3.5 h-3.5 text-cyan-400" />;
        badgeStyle = "bg-cyan-950/70 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/80";
      } else if (rawType === 'category') {
        icon = <Compass className="w-3.5 h-3.5 text-blue-400" />;
        badgeStyle = "bg-blue-950/70 border-blue-500/50 text-blue-300 hover:bg-blue-900/80";
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
        </button>
      );

      lastIndex = tagRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const query = (customPrompt || inputVal).trim();
    if (!query || isTyping) return;

    setInputVal('');
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      time: userTime
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    persistSession(newMsgs, currentSessionId);

    // Check user keys and VIP
    const currentKeys = loadUserApiKeys();
    const currentActiveKey = currentKeys.find(k => k.isActive);
    const hasCustomKey = Boolean(currentActiveKey && currentActiveKey.key.length > 8);
    const currentVip = getWeeklyVipStatus();
    
    if (!hasCustomKey && !currentVip.isVip && currentVip.donaRemainingToday <= 0) {
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const limitNoticeMsg: Message = {
        id: `dona_limit_${Date.now()}`,
        sender: 'dona',
        text: isFr
          ? `🔒 **Votre quota gratuit standard pour Dona est atteint aujourd'hui.**\n\nPour continuer sans aucune limite, connectez votre propre clé (Google Gemini, DeepSeek ou OpenAI) via le bouton en haut. Vos clés restent 100% privées dans votre navigateur.`
          : `🔒 **Daily free quota reached.**\n\nTo chat with zero limits, connect your own API key (Gemini, DeepSeek, or OpenAI) at the top. Your keys stay 100% private in your browser.`,
        time: botTime
      };
      const finalMsgs = [...newMsgs, limitNoticeMsg];
      setMessages(finalMsgs);
      persistSession(finalMsgs, currentSessionId);
      if (showToast) {
        showToast(
          isFr ? `Quota atteint. Connectez votre clé pour un accès illimité !` : `Quota reached. Connect your key for unlimited access!`,
          'info'
        );
      }
      return;
    }

    if (!hasCustomKey) {
      recordDonaUsage();
    }
    setIsTyping(true);

    try {
      const response = await fetch('/api/dona/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(currentActiveKey ? {
            'x-user-key': currentActiveKey.key,
            'x-user-provider': currentActiveKey.provider,
            'x-user-model': currentActiveKey.model || '',
            'x-gemini-key': currentActiveKey.provider === 'gemini' ? currentActiveKey.key : '',
          } : {})
        },
        body: JSON.stringify({
          message: query,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          lang: isFr ? 'fr' : 'en',
          userKeys: currentKeys.map(k => ({ provider: k.provider, key: k.key, model: k.model })),
          customApiKey: currentActiveKey?.key,
          customProvider: currentActiveKey?.provider,
          customModel: currentActiveKey?.model,
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
      console.warn('Backend Dona request failed, using cinephile intelligent synthesis:', err);
    }

    // Intelligent cinephile fallback
    try {
      const moviesFound = await clientSearchMovies(query);
      let answerText = '';

      if (moviesFound && moviesFound.length > 0) {
        const primary = moviesFound[0];
        const pTitle = primary.title || primary.name;
        const pYear = primary.release_date || primary.first_air_date ? new Date(primary.release_date || primary.first_air_date).getFullYear() : '2025';
        const pNote = primary.vote_average ? `★ ${Number(primary.vote_average).toFixed(1)}/10` : 'Coup de cœur';

        if (isFr) {
          answerText = `✨ **Sélection Cinéphile Dona pour « ${query} »**\n\nJ'ai analysé notre catalogue et déniché des œuvres adaptées à votre demande.\n\n🏆 **Coup de cœur recommandé** : **${pTitle}** (${pYear}, ${pNote})\n\n👉 Vous pouvez lancer le streaming direct [play:${primary.id}|Lancer ${pTitle}], regarder la bande-annonce [trailer:${primary.id}|Bande-Annonce] ou créer un salon [party:${primary.id}|Watch Party ${pTitle}] !`;
        } else {
          answerText = `✨ **Dona's Curated Cinema for "${query}"**\n\nI scoured our library to find works tailored to your query.\n\n🏆 **Top Spotlight Pick**: **${pTitle}** (${pYear}, ${pNote})\n\n👉 Stream now [play:${primary.id}|Stream ${pTitle}], watch trailer [trailer:${primary.id}|Trailer], or launch [party:${primary.id}|Watch Party ${pTitle}]!`;
        }
      } else {
        answerText = isFr
          ? `🎬 **Dona à votre écoute !**\n\nJ'ai bien reçu votre message : **« ${query} »**.\nPosez-moi n'importe quelle question sur vos films préférés, un réalisateur, une intrigue ou demandez-moi une sélection personnalisée.`
          : `🎬 **Dona at your service!**\n\nI received your prompt: **"${query}"**.\nAsk me anything about cinema, directors, story arcs, or request personalized recommendations.`;
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
            ? "Je suis prête à échanger avec vous. Posez votre question cinématographique !"
            : "I'm ready to chat with you. Ask your cinema question!",
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
    setInputVal('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleLoadConversation = (conv: SavedConversation) => {
    setCurrentSessionId(conv.id);
    setMessages(conv.messages);
    setShowHistory(false);
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

  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#050508] text-white overflow-hidden relative select-none">
      
      {/* Modale Gestionnaire Multi-Clés (Gemini / DeepSeek / OpenAI) */}
      <DonaApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => {
          setShowApiKeyModal(false);
          refreshKeys();
        }}
        isFr={isFr}
        onKeysChanged={() => {
          refreshKeys();
          if (showToast) {
            showToast(isFr ? 'Clés IA synchronisées localement !' : 'AI keys synced locally!', 'success');
          }
        }}
      />

      {/* ======================================================== */}
      {/* CORPS PRINCIPAL : ZONE DE DISCUSSION FLUIDE (HEADER UNIQUE) */}
      {/* ======================================================== */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        
        {/* PANNEAU LATÉRAL HISTORIQUE */}
        {showHistory && (
          <aside className="absolute md:relative inset-y-0 left-0 z-40 w-full sm:w-80 lg:w-84 bg-[#090912] border-r border-white/10 flex flex-col animate-in slide-in-from-left duration-200 shadow-2xl">
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
                <div className="p-8 text-center text-white/40 text-xs">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-white/20" />
                  <p>{isFr ? 'Aucun échange récent.' : 'No recent chats.'}</p>
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
                        <p className="text-xs font-bold truncate">
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

        {/* ZONE DE DISCUSSION CENTRALE */}
        <main className="flex-1 flex flex-col h-full bg-[#050508] relative overflow-hidden min-h-0">
          
          {/* Flux de messages ou Ecran d'accueil épuré */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-12 lg:px-20 py-6 space-y-6 custom-scrollbar overscroll-contain min-h-0"
          >
            
            {/* SI AUCUN MESSAGE : ÉCRAN D'ACCUEIL PROPRE & ÉPURÉ SANS SUGGESTIONS */}
            {messages.length === 0 ? (
              <div className="w-full max-w-xl mx-auto my-auto py-10 sm:py-16 flex flex-col items-center justify-center text-center">
                
                {/* Logo Dona Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#9333ea]/30 via-purple-500/20 to-transparent border border-purple-500/30 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(168,85,247,0.25)]">
                  <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-[#c084fc]" />
                </div>

                {/* Titre & Description Simple */}
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
                  Dona <span className="text-[#c084fc]">AI</span>
                </h2>
                <p className="text-xs sm:text-sm font-medium text-white/60 max-w-md mx-auto leading-relaxed mb-6">
                  {isFr 
                    ? "Votre intelligence cinéphile. Posez vos questions sur le cinéma, analysez une œuvre ou demandez une recommandation sur-mesure."
                    : "Your cinema AI. Ask questions, analyze films, or request tailored recommendations."}
                </p>

                {/* Carte Confidentialité & Clé Privée */}
                <div className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left flex items-start gap-3.5 shadow-lg">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white">
                        {isFr ? 'Stockage 100% Local & Sécurisé' : '100% Local & Private Storage'}
                      </h4>
                      {activeKey && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          {activeKey.provider.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/60 leading-relaxed mt-1">
                      {isFr 
                        ? 'Vos clés API restent stockées uniquement dans votre navigateur. Aucun autre utilisateur ne peut y avoir accès.'
                        : 'Your API keys remain stored solely inside your browser. No other user can ever access them.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowApiKeyModal(true)}
                      className="mt-2 text-xs font-bold text-[#c084fc] hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Key className="w-3 h-3" />
                      <span>{isFr ? 'Gérer vos clés (Gemini, DeepSeek, OpenAI)' : 'Manage keys (Gemini, DeepSeek, OpenAI)'}</span>
                    </button>
                  </div>
                </div>

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
                      /* Message utilisateur : Bulle violette épurée */
                      <div className="max-w-[90%] sm:max-w-[80%]">
                        <div className="bg-gradient-to-r from-[#9333ea] to-[#7c3aed] text-white font-medium text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-tr-xs shadow-lg select-text">
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-white/35 px-1 mt-1 block text-right font-mono">
                          {msg.time}
                        </span>
                      </div>
                    ) : (
                      /* Message Dona : Réponse fluide avec cartes de films si présentes */
                      <div className="flex gap-3 max-w-[98%] sm:max-w-[92%] items-start">
                        <div className="shrink-0 mt-1 select-none flex items-center justify-center">
                          <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-[#c084fc] shadow-md shadow-purple-950/40">
                            <Bot className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm sm:text-base leading-relaxed text-white/95 whitespace-pre-wrap select-text">
                            {renderMessageContent(msg.text)}
                          </div>

                          {/* Affichage des cartes de films cinéphiles professionnelles */}
                          {msg.movies && msg.movies.length > 0 && (
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300/80">
                                <Film className="w-3.5 h-3.5 text-purple-400" />
                                <span>{isFr ? 'Sélection Cinéphile Dona' : 'Dona Curated Cinema'}</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {msg.movies.map((m: any) => (
                                  <DonaMovieCard
                                    key={m.id}
                                    movie={m}
                                    onPlayMovie={(mov) => onSelectMovie(mov, 'play')}
                                    onOpenTrailer={(mov) => onSelectMovie(mov, 'trailer')}
                                    onCreateParty={(mov) => {
                                      if (onCreateParty) onCreateParty(mov);
                                      else onSelectMovie(mov, 'party');
                                    }}
                                    onSelectMovie={(mov) => onSelectMovie(mov, 'info')}
                                    onToggleWatchlist={onToggleWatchlist}
                                    isFr={isFr}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          <span className="text-[10px] text-white/35 mt-2.5 block font-mono">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Indicateur de réflexion discret */}
                {isTyping && (
                  <div className="flex items-center gap-3 text-white/80 py-2 px-1 animate-in fade-in duration-150">
                    <div className="w-7 h-7 rounded-lg bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-[#c084fc] shrink-0 animate-pulse">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#c084fc] tracking-wide">
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
          {/* BARRE INFÉRIEURE : SAISIE ULTRA PROPRE SANS CLUTTER */}
          {/* ======================================================== */}
          <footer className="px-3 sm:px-6 lg:px-14 pt-3 pb-4 sm:pb-6 border-t border-white/10 bg-[#06060c] shrink-0 z-40 relative">
            <div className="max-w-4xl lg:max-w-5xl mx-auto space-y-2">
              
              {/* Formulaire de Saisie Propre */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-center bg-[#0d0d16] border border-white/15 focus-within:border-[#a855f7] rounded-2xl px-4 py-2.5 shadow-2xl transition-all"
              >
                {/* Champ texte principal */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollToBottom('smooth');
                    }, 80);
                  }}
                  placeholder={
                    isFr 
                      ? "Posez une question ou demandez une recommandation cinéma..." 
                      : "Ask a question or request cinema recommendations..."
                  }
                  className="w-full bg-transparent text-sm text-white placeholder-white/35 outline-none pr-3"
                  disabled={isTyping}
                />

                {/* Bouton Envoyer */}
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isTyping}
                  className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                    inputVal.trim() && !isTyping
                      ? 'bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white hover:from-[#9333ea] hover:to-[#6d28d9] active:scale-95 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                  title={isFr ? 'Envoyer' : 'Send'}
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>

              {/* Ligne informative discrète en bas */}
              <div className="flex items-center justify-between text-[10px] text-white/35 px-1">
                <span>
                  {isFr
                    ? "Dona IA • Clés sauvegardées localement dans votre navigateur"
                    : "Dona AI • Keys stored locally in your browser"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(true)}
                  className="text-[#a855f7] hover:underline cursor-pointer"
                >
                  {activeKey ? (isFr ? `Clé ${activeKey.provider} active` : `${activeKey.provider} key active`) : (isFr ? 'Gérer les clés' : 'Manage keys')}
                </button>
              </div>

            </div>
          </footer>

        </main>
      </div>

    </div>
  );
};
