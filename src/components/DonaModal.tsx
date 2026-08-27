import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ArrowUp, X, Clock, Plus, LogOut, Play, Star, 
  Trash2, ChevronRight, Check, Film, Tv
} from 'lucide-react';
import { BASE_URL, API_KEY, DonaStar } from '../constants';

interface DonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movie: any) => void;
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

const STORAGE_KEY = 'levelmovie_dona_saved_chats_v1';

export const DonaModal: React.FC<DonaModalProps> = ({
  isOpen,
  onClose,
  onSelectMovie,
  lang = 'fr',
  historyTrigger = 0,
  newChatTrigger = 0
}) => {
  const isFr = lang === 'fr';
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => `session_${Date.now()}`);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Save conversation session to localStorage
  const persistSession = (sessionMsgs: Message[], sessId: string) => {
    if (!sessionMsgs || sessionMsgs.length <= 1) return;
    try {
      const firstUserMsg = sessionMsgs.find(m => m.sender === 'user');
      const title = firstUserMsg ? firstUserMsg.text.slice(0, 45) : (isFr ? 'Discussion Cinéma' : 'Cinema Chat');
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
        ].slice(0, 30); // Keep last 30 chats

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

  const searchMoviesFromQuery = async (queryText: string) => {
    try {
      const cleanQ = encodeURIComponent(queryText.trim());
      const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=${isFr ? 'fr-FR' : 'en-US'}&query=${cleanQ}&page=1&include_adult=false`);
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        return data.results.filter((m: any) => m.poster_path && (m.media_type === 'movie' || m.media_type === 'tv' || !m.media_type)).slice(0, 4);
      }
    } catch (e) {
      console.warn('Dona search error:', e);
    }
    // Fallback: fetch popular/top rated
    try {
      const fallbackRes = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${isFr ? 'fr-FR' : 'en-US'}&page=1`);
      const fallbackData = await fallbackRes.json();
      return (fallbackData.results || []).slice(0, 4);
    } catch (_) {
      return [];
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isTyping) return;

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
      const moviesFound = await searchMoviesFromQuery(query);
      
      let answerText = '';
      if (moviesFound && moviesFound.length > 0) {
        const topTitles = moviesFound.map((m: any) => `« ${m.title || m.name} »`).join(', ');
        answerText = isFr
          ? `Voici mes suggestions pour « ${query} » ! J'ai sélectionné pour vous ${topTitles}. Cliquez sur une affiche pour lancer le film ou afficher ses détails :`
          : `Here are my top recommendations for "${query}"! I selected ${topTitles}. Click on any poster below to start streaming or view details:`;
      } else {
        answerText = isFr
          ? `Je n'ai pas trouvé de correspondance exacte pour cette recherche, mais voici quelques incontournables du moment sur LevelMovie :`
          : `I could not find an exact match for this query, but here are some popular titles on LevelMovie:`;
      }

      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setTimeout(() => {
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
      }, 600);

    } catch (e) {
      setIsTyping(false);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const errMsgs = [
        ...newMsgs,
        {
          id: `dona_err_${Date.now()}`,
          sender: 'dona' as const,
          text: isFr 
            ? "Oups, je rencontre une petite difficulté avec le catalogue. Peux-tu reformuler ta recherche ?"
            : "Oops, I had a brief issue querying titles. Could you rephrase your request?",
          time: botTime
        }
      ];
      setMessages(errMsgs);
      persistSession(errMsgs, currentSessionId);
    }
  };

  // 1. New Conversation
  const handleNewConversation = () => {
    // Save previous if valid
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

  // 2. Load Conversation from history
  const handleLoadConversation = (conv: SavedConversation) => {
    setCurrentSessionId(conv.id);
    setMessages(conv.messages);
    setShowHistory(false);
  };

  // 3. Delete Conversation from history
  const handleDeleteConversation = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedConversations.filter(c => c.id !== idToDelete);
    setSavedConversations(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}
  };

  // 4. Clear all history
  const handleClearAllHistory = () => {
    setSavedConversations([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#020202] text-white overflow-hidden shadow-2xl relative">
      
      {/* ======================================================== */}
      {/* BARRE D'ACTIONS COMPACTE SUR PC (HORLOGE HISTORIQUE & NOUVEAU +) */}
      {/* Masquée sur mobile car le header principal LevelMovie gère les 3 boutons */}
      {/* ======================================================== */}
      <div className="hidden md:flex h-11 px-4 md:px-8 bg-[#0a0a12]/90 border-b border-white/5 items-center justify-between shrink-0 z-30 backdrop-blur-sm">
        
        {/* Indicateur de statut subtil */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
            {isFr ? 'IA Cinéma active' : 'Cinema AI active'}
          </span>
        </div>

        {/* Boutons d'actions : Horloge (Historique) & Nouveau (+) */}
        <div className="flex items-center gap-2">
          
          {/* BOUTON 1 : Historique (Horloge) */}
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
              showHistory 
                ? 'bg-[#a855f7] text-white border-[#c084fc] shadow-[0_0_10px_rgba(168,85,247,0.5)]' 
                : 'bg-white/5 text-white/80 hover:text-white hover:bg-white/10 border-white/10'
            }`}
            title={isFr ? 'Historique des conversations' : 'Chat History'}
          >
            <Clock className="w-3.5 h-3.5 text-[#c084fc]" />
            <span>{isFr ? 'Historique' : 'History'}</span>
            {savedConversations.length > 0 && (
              <span className="text-[9px] px-1 bg-[#a855f7]/40 rounded font-mono font-bold text-white">
                {savedConversations.length}
              </span>
            )}
          </button>

          {/* BOUTON 2 : Nouvelle conversation (+) */}
          <button
            type="button"
            onClick={handleNewConversation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-[#a855f7]/20 text-white/90 hover:text-white border border-white/10 hover:border-[#a855f7]/60 rounded-xl text-[11px] font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
            title={isFr ? 'Nouvelle conversation' : 'New conversation'}
          >
            <Plus className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>{isFr ? 'Nouveau' : 'New'}</span>
          </button>

        </div>
      </div>

      {/* ======================================================== */}
      {/* CORPS PRINCIPAL : PLEIN ÉCRAN TOTAL AVEC TIROIR HISTORIQUE */}
      {/* ======================================================== */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* PANNEAU LATÉRAL HISTORIQUE (Slide-in ou Desktop Drawer) */}
        {showHistory && (
          <aside className="absolute md:relative inset-y-0 left-0 z-40 w-full sm:w-80 bg-[#09090f] border-r border-white/10 flex flex-col animate-in slide-in-from-left duration-200 shadow-2xl">
            <div className="p-3.5 bg-[#0f0f18] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#a855f7]" />
                <span className="text-[12px] font-black uppercase tracking-wider text-white">
                  {isFr ? 'Historique' : 'History'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {savedConversations.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="p-1 text-white/40 hover:text-rose-400 rounded hover:bg-rose-950/30 transition-colors"
                    title={isFr ? 'Effacer tout' : 'Clear all'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowHistory(false)}
                  className="p-1 text-white/50 hover:text-white rounded hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
              {savedConversations.length === 0 ? (
                <div className="p-6 text-center text-white/40 text-[12px]">
                  <Clock className="w-7 h-7 mx-auto mb-2 text-white/20" />
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
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-white/40 hover:text-rose-400 rounded hover:bg-rose-950/40 transition-all shrink-0"
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

        {/* ZONE DE DISCUSSION CENTRALE PLEIN ÉCRAN */}
        <main className="flex-1 flex flex-col h-full bg-[#020202] relative overflow-hidden">
          
          {/* Flux de messages ou Ecran d'accueil initial */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4 custom-scrollbar">
            
            {/* SI AUCUN MESSAGE : ÉCRAN D'ACCUEIL PLEIN ÉCRAN ÉPURÉ */}
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[55vh] transition-opacity duration-500 w-full max-w-3xl mx-auto my-auto text-center px-4">
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-[0.2em] mb-2 drop-shadow-lg">
                  Dona
                </h2>
                <p className="text-white/50 text-[12px] sm:text-[13px] uppercase tracking-widest font-semibold">
                  {isFr ? "Comment puis-je vous aider aujourd'hui ?" : "How can I help you today?"}
                </p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto w-full space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3 max-w-[96%] sm:max-w-[85%]">
                      
                      {msg.sender === 'dona' && (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#180f2b] border border-[#a855f7]/60 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                          <DonaStar className="w-4 h-4" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        {/* Bulle de Message */}
                        <div
                          className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[14px] leading-relaxed shadow-sm ${
                            msg.sender === 'user'
                              ? 'bg-[#7e22ce] text-white rounded-tr-none font-medium'
                              : 'bg-white/[0.04] text-[#ededf5] border border-white/10 rounded-tl-none'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>

                          {/* Cartes des films recommandés */}
                          {msg.movies && msg.movies.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5 pt-3.5 border-t border-white/10">
                              {msg.movies.map((m: any) => (
                                <div
                                  key={m.id}
                                  onClick={() => {
                                    onClose();
                                    onSelectMovie(m);
                                  }}
                                  className="group relative bg-[#09090f] hover:bg-[#181026] border border-white/10 hover:border-[#a855f7] rounded-xl p-2.5 transition-all cursor-pointer flex gap-3 items-center hover:scale-[1.01] shadow-md"
                                >
                                  <img
                                    src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                                    alt={m.title || m.name}
                                    className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg object-cover shrink-0 shadow"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-[#c084fc] transition-colors truncate">
                                      {m.title || m.name}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-[10px] text-white/50 mt-1">
                                      <span className="flex items-center text-amber-400 font-bold">
                                        <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" />
                                        {m.vote_average ? m.vote_average.toFixed(1) : 'N/A'}
                                      </span>
                                      <span>•</span>
                                      <span>{(m.release_date || m.first_air_date || '').slice(0, 4)}</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#c084fc] font-bold group-hover:translate-x-0.5 transition-transform">
                                      <Play className="w-3 h-3 fill-current" />
                                      <span>{isFr ? 'Voir le film' : 'Watch movie'}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <span className="text-[9px] text-white/40 px-1 mt-1 block font-mono">
                          {msg.time}
                        </span>
                      </div>

                    </div>
                  </div>
                ))}

                {/* Indicateur de réflexion */}
                {isTyping && (
                  <div className="flex items-center gap-2.5 text-white/70 text-xs py-2 px-1 animate-pulse">
                    <div className="w-7 h-7 rounded-xl bg-[#180f2b] border border-[#a855f7]/50 flex items-center justify-center">
                      <DonaStar className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-[#c084fc]">
                      {isFr ? 'Dona réfléchit et cherche pour vous...' : 'Dona is analyzing titles for you...'}
                    </span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            )}

          </div>

          {/* ======================================================== */}
          {/* BARRE INFÉRIEURE : CHAMP DE SAISIE ÉLÉGANT STYLE MODERNE */}
          {/* ======================================================== */}
          <footer className="px-3 sm:px-6 pt-3 pb-3 sm:pb-4 border-t border-white/5 bg-[#020202]/90 backdrop-blur-3xl shrink-0 z-50 relative">
            <div className="max-w-3xl md:max-w-4xl mx-auto relative">
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="rounded-3xl p-1.5 sm:p-2 flex items-center gap-2 bg-white/[0.03] border border-white/10 backdrop-blur-2xl focus-within:border-[#a855f7]/50 transition-all shadow-2xl"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    isFr
                      ? 'Poser une question à Dona...'
                      : 'Ask Dona a question...'
                  }
                  className="flex-1 bg-transparent border-none text-white placeholder-white/40 text-[14px] sm:text-[15px] px-3 py-2 outline-none font-medium"
                />
                
                {inputVal.trim() && (
                  <button
                    type="button"
                    onClick={() => setInputVal('')}
                    className="text-white/40 hover:text-white p-1.5 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!inputVal.trim() || isTyping}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#a855f7] hover:text-white active:scale-90 transition-all duration-150 shadow-md shrink-0 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black cursor-pointer"
                  title={isFr ? 'Envoyer' : 'Send'}
                >
                  <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                </button>
              </form>

              <div className="text-center mt-2">
                <p className="text-[10px] font-semibold text-white/30 tracking-wide">
                  {isFr
                    ? "Vérifiez les réponses de Dona, car elle peut se tromper."
                    : "Verify Dona's answers, as she can make mistakes."}
                </p>
              </div>

            </div>
          </footer>

        </main>
      </div>
    </div>
  );
};
