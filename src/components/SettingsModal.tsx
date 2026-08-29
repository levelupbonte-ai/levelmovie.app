import React, { useState, useEffect, useRef } from 'react';
import {
  X, User, Globe, Shield, Server, HardDrive,
  LogOut, ChevronRight, Bookmark, Lock, 
  Trash2, Download, Upload, Info, Sliders, ChevronLeft,
  ArrowUp, ArrowDown, Camera, FileText, Sparkles,
  Users, Bot, ShoppingBag, Play, RefreshCw, Key,
  Check, Volume2, Bell, Eye, EyeOff, Film, Tv, Radio,
  Copy, Zap, HelpCircle, AlertTriangle
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  setLang: (lang: string) => void;
  contentLang: string;
  setContentLang: (lang: string) => void;
  user: any;
  userName: string;
  userEmail: string;
  userPhoto: string | null;
  parentalFilter: boolean;
  setParentalFilter: (val: boolean) => void;
  onOpenLogin: () => void;
  onOpenLogout: () => void;
  onOpenDona?: () => void;
  watchlistCount: number;
  historyCount: number;
  onNavigateCategory: (cat: string) => void;
  showToast: (msg: string, type?: string) => void;
  t: any;
}

type TabType = 'general' | 'account' | 'library' | 'party' | 'dona' | 'store' | 'streaming' | 'parental' | 'data' | 'privacy' | 'about';

interface TabItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Composant Interrupteur Moderne (Switch slider ergonomique et animé)
const Interrupteur: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  label?: string;
  disabled?: boolean;
}> = ({ checked, onChange, id, label, disabled = false }) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 ${
        checked
          ? 'bg-[#a855f7] shadow-[0_0_14px_rgba(168,85,247,0.45)]'
          : 'bg-white/10 border border-white/10 hover:bg-white/15'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  setLang,
  contentLang,
  setContentLang,
  user,
  userName,
  userEmail,
  userPhoto,
  parentalFilter,
  setParentalFilter,
  onOpenLogin,
  onOpenLogout,
  onOpenDona,
  watchlistCount,
  historyCount,
  onNavigateCategory,
  showToast,
  t
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [mobileActiveTab, setMobileActiveTab] = useState<TabType | null>(null);

  // General tab states (persisted)
  const [notifPermission, setNotifPermission] = useState(() => {
    return localStorage.getItem('levelmovie_notif_push') !== 'false';
  });
  const [autoTrailer, setAutoTrailer] = useState(() => {
    return localStorage.getItem('levelmovie_auto_trailer') !== 'false';
  });
  const [offlineStorage, setOfflineStorage] = useState(() => {
    return localStorage.getItem('levelmovie_offline_storage') !== 'false';
  });
  const [bgSync, setBgSync] = useState(() => {
    return localStorage.getItem('levelmovie_bg_sync') !== 'false';
  });

  // Account states
  const [copiedId, setCopiedId] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(() => {
    return localStorage.getItem('levelmovie_private_profile') === 'true';
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customAvatar, setCustomAvatar] = useState(() => {
    return localStorage.getItem('levelmovie_custom_avatar') || userPhoto || null;
  });

  // Library states
  const [expandedLibraryCategory, setExpandedLibraryCategory] = useState<string | null>('watched');
  const [watchedList, setWatchedList] = useState(() => {
    try {
      const saved = localStorage.getItem('levelmovie_watched_items');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 1, title: 'Interstellar', type: 'Film', year: '2014', duration: '2h 49m' },
      { id: 2, title: 'Oppenheimer', type: 'Film', year: '2023', duration: '3h 00m' },
      { id: 3, title: 'Attack on Titan - Saison Finale', type: 'Anime', year: '2023', duration: '28 épisodes' },
      { id: 4, title: 'Arcane', type: 'Série', year: '2021', duration: 'Saison 1 & 2' },
    ];
  });
  const [watchingList, setWatchingList] = useState(() => {
    try {
      const saved = localStorage.getItem('levelmovie_watching_items');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 5, title: 'Stranger Things', type: 'Série', progress: 'S4 : Épisode 6', timeLeft: '35 min restantes' },
      { id: 6, title: 'Dune : Deuxième Partie', type: 'Film', progress: '1h 12m / 2h 46m', timeLeft: '1h 34m restantes' },
      { id: 7, title: 'Solo Leveling', type: 'Anime', progress: 'Épisode 9', timeLeft: '11 min restantes' },
    ];
  });
  const [pausedList, setPausedList] = useState(() => {
    try {
      const saved = localStorage.getItem('levelmovie_paused_items');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 8, title: 'The Last of Us', type: 'Série', pausedAt: 'Épisode 4 (22:15)' },
      { id: 9, title: 'Avatar : La Voie de l\'eau', type: 'Film', pausedAt: '1h 05m' },
    ];
  });
  const [libraryParties, setLibraryParties] = useState(() => {
    try {
      const saved = localStorage.getItem('levelmovie_library_parties');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'salon_1', title: 'Ciné Club Interstellar', date: 'Hier', code: 'LVL-4892', role: 'Créateur' },
      { id: 'salon_2', title: 'Anime Night - Solo Leveling', date: 'Il y a 3 jours', code: 'LVL-1904', role: 'Participant' },
      { id: 'salon_3', title: 'Marvel Marathon', date: 'Il y a 1 semaine', code: 'LVL-7721', role: 'Participant' },
    ];
  });

  // Watch Party Settings
  const [partyInvitePermission, setPartyInvitePermission] = useState<'everyone' | 'friends' | 'none'>(() => {
    return (localStorage.getItem('levelmovie_party_invite') as any) || 'everyone';
  });
  const [partyAutoSync, setPartyAutoSync] = useState(() => {
    return localStorage.getItem('levelmovie_party_sync') !== 'false';
  });
  const [partyNotifSounds, setPartyNotifSounds] = useState(() => {
    return localStorage.getItem('levelmovie_party_sounds') !== 'false';
  });
  const [partyHideSpoilers, setPartyHideSpoilers] = useState(() => {
    return localStorage.getItem('levelmovie_party_hide_spoilers') === 'true';
  });

  // Dona IA Settings
  const [donaResponseStyle, setDonaResponseStyle] = useState<'concise' | 'expert' | 'casual' | 'critic'>(() => {
    return (localStorage.getItem('levelmovie_dona_style') as any) || 'expert';
  });
  const [donaProactiveRecs, setDonaProactiveRecs] = useState(() => {
    return localStorage.getItem('levelmovie_dona_proactive') !== 'false';
  });
  const [donaVoiceMode, setDonaVoiceMode] = useState(() => {
    return localStorage.getItem('levelmovie_dona_voice') === 'true';
  });
  const [donaHistory, setDonaHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('levelmovie_dona_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 1, query: 'Trouve-moi un film de science-fiction avec des voyages dans le temps', date: 'Hier à 21:30' },
      { id: 2, query: 'Quel est l\'ordre chronologique pour regarder Marvel ?', date: 'Il y a 2 jours' },
      { id: 3, query: 'Des séries similaires à Breaking Bad et Ozark', date: 'Il y a 4 jours' },
    ];
  });

  // LevelUp Store / Code promo state
  const [promoCode, setPromoCode] = useState('');
  const [isVipActive, setIsVipActive] = useState(() => {
    return localStorage.getItem('levelmovie_vip_pass') === 'true';
  });

  // Streaming states (Servers order & fallback)
  const [autoFallback, setAutoFallback] = useState(() => {
    return localStorage.getItem('levelmovie_auto_fallback') !== 'false';
  });
  const [servers, setServers] = useState(() => {
    try {
      const saved = localStorage.getItem('levelmovie_servers_order');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'vidsrc_me', name: 'GLOBAL', ping: '38 ms' },
      { id: 'superembed', name: 'MULTI', ping: '42 ms' },
      { id: 'vidlink', name: 'ALPHA', ping: '55 ms' },
      { id: 'vidsrc_to', name: 'BETA', ping: '64 ms' },
      { id: 'twoembed', name: 'THETA', ping: '72 ms' }
    ];
  });
  const [isTestingPing, setIsTestingPing] = useState(false);

  // Parental Control States
  const [pinView, setPinView] = useState<'main' | 'setup' | 'forgot'>('main');
  const [pinInput, setPinInput] = useState('');
  const [savedPin, setSavedPin] = useState(() => {
    return localStorage.getItem('levelmovie_parental_pin') || '1234';
  });
  const [q1, setQ1] = useState(() => localStorage.getItem('levelmovie_parental_q1') || 'Nom de votre premier animal');
  const [a1, setA1] = useState(() => localStorage.getItem('levelmovie_parental_a1') || '');
  const [q2, setQ2] = useState(() => localStorage.getItem('levelmovie_parental_q2') || 'Ville de naissance');
  const [a2, setA2] = useState(() => localStorage.getItem('levelmovie_parental_a2') || '');
  const [q3, setQ3] = useState(() => localStorage.getItem('levelmovie_parental_q3') || 'Film préféré d\'enfance');
  const [a3, setA3] = useState(() => localStorage.getItem('levelmovie_parental_a3') || '');

  // File import ref
  const importFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('modal', 'settings');
        url.searchParams.set('settings_tab', activeTab);
        window.history.replaceState({}, '', url.pathname + '?' + url.searchParams.toString() + url.hash);
      } catch (_) {}
    } else {
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.get('modal') === 'settings') {
          url.searchParams.delete('modal');
          url.searchParams.delete('settings');
          url.searchParams.delete('settings_tab');
          const qs = url.searchParams.toString();
          window.history.replaceState({}, '', url.pathname + (qs ? '?' + qs : '') + url.hash);
        }
      } catch (_) {}
    }
  }, [isOpen, activeTab]);

  // Sound generator for test
  const playNotificationSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  };

  // Voice synthesis test
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  const tabs: TabItem[] = [
    { id: 'general', label: lang === 'fr' ? 'Général' : 'General', icon: Sliders },
    { id: 'account', label: lang === 'fr' ? 'Compte & Profil' : 'Account & Profile', icon: User },
    { id: 'library', label: lang === 'fr' ? 'Ma Bibliothèque' : 'My Library', icon: Bookmark },
    { id: 'party', label: 'Watch Party', icon: Users },
    { id: 'dona', label: 'Dona IA', icon: Bot },
    { id: 'store', label: 'LevelUp Store', icon: ShoppingBag },
    { id: 'streaming', label: lang === 'fr' ? 'Serveurs & Lecture' : 'Streaming Servers', icon: Server },
    { id: 'parental', label: lang === 'fr' ? 'Contrôle Parental' : 'Parental Controls', icon: Shield },
    { id: 'data', label: lang === 'fr' ? 'Mes Données' : 'My Data', icon: HardDrive },
    { id: 'privacy', label: lang === 'fr' ? 'Confidentialité' : 'Privacy Policy', icon: FileText },
    { id: 'about', label: lang === 'fr' ? 'À Propos' : 'About Us', icon: Info },
  ];

  const currentTabObj = tabs.find(t => t.id === (mobileActiveTab || activeTab)) || tabs[0];

  const moveServer = (index: number, direction: 'up' | 'down') => {
    const newServers = [...servers];
    if (direction === 'up' && index > 0) {
      [newServers[index - 1], newServers[index]] = [newServers[index], newServers[index - 1]];
    } else if (direction === 'down' && index < newServers.length - 1) {
      [newServers[index + 1], newServers[index]] = [newServers[index], newServers[index + 1]];
    }
    setServers(newServers);
    localStorage.setItem('levelmovie_servers_order', JSON.stringify(newServers));
    showToast(lang === 'fr' ? 'Ordre des serveurs sauvegardé' : 'Server order updated', 'success');
  };

  const handleTestPings = () => {
    setIsTestingPing(true);
    showToast(lang === 'fr' ? 'Test de latence en cours...' : 'Testing server latencies...', 'info');
    setTimeout(() => {
      const updated = servers.map(s => ({
        ...s,
        ping: `${Math.floor(Math.random() * 40 + 25)} ms`
      }));
      setServers(updated);
      localStorage.setItem('levelmovie_servers_order', JSON.stringify(updated));
      setIsTestingPing(false);
      showToast(lang === 'fr' ? 'Tous les serveurs sont opérationnels !' : 'All servers are operational!', 'success');
    }, 900);
  };

  const handleClearFullLibrary = () => {
    if (confirm(lang === 'fr' ? 'Êtes-vous sûr de vouloir vider TOUTE votre bibliothèque (historique, en cours, pauses, salons) ?' : 'Are you sure you want to clear your entire library?')) {
      setWatchedList([]);
      setWatchingList([]);
      setPausedList([]);
      setLibraryParties([]);
      localStorage.removeItem('levelmovie_history');
      localStorage.removeItem('levelmovie_watchlist');
      localStorage.removeItem('levelmovie_watched_items');
      localStorage.removeItem('levelmovie_watching_items');
      localStorage.removeItem('levelmovie_paused_items');
      localStorage.removeItem('levelmovie_library_parties');
      showToast(lang === 'fr' ? 'Bibliothèque entièrement vidée.' : 'Entire library cleared.', 'success');
    }
  };

  const handleRedeemCode = () => {
    const clean = promoCode.trim().toUpperCase();
    if (!clean) return;
    if (clean === 'VIP2026' || clean === 'LEVELUP' || clean === 'CINEMA' || clean === 'PROPASS') {
      setIsVipActive(true);
      localStorage.setItem('levelmovie_vip_pass', 'true');
      setPromoCode('');
      showToast(lang === 'fr' ? '🎉 Pass VIP LevelUp activé avec succès !' : '🎉 LevelUp VIP Pass activated!', 'success');
    } else {
      showToast(lang === 'fr' ? 'Code invalide ou expiré.' : 'Invalid or expired promo code.', 'error');
    }
  };

  const exportData = () => {
    const exportPayload = {
      app: 'LevelMovie',
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      user: {
        id: user?.uid ? `ID-${user.uid.substring(0, 8).toUpperCase()}` : 'ID-LEVELUP-1A',
        name: userName || 'Cinéphile',
        email: userEmail || 'levelup.ia0@gmail.com',
        privateProfile,
        isVip: isVipActive
      },
      library: {
        watched: watchedList,
        watching: watchingList,
        paused: pausedList,
        parties: libraryParties
      },
      dona: {
        history: donaHistory,
        responseStyle: donaResponseStyle,
        voiceMode: donaVoiceMode
      },
      settings: {
        language: lang,
        contentLang: contentLang,
        servers: servers,
        autoFallback,
        parentalFilter,
        partySettings: {
          invitePermission: partyInvitePermission,
          autoSync: partyAutoSync,
          notifSounds: partyNotifSounds,
          hideSpoilers: partyHideSpoilers
        }
      }
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `levelmovie_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(lang === 'fr' ? 'Fichier de sauvegarde exporté avec succès !' : 'Data file exported successfully!', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.library?.watched) {
          setWatchedList(data.library.watched);
          localStorage.setItem('levelmovie_watched_items', JSON.stringify(data.library.watched));
        }
        if (data.library?.watching) {
          setWatchingList(data.library.watching);
          localStorage.setItem('levelmovie_watching_items', JSON.stringify(data.library.watching));
        }
        if (data.dona?.history) {
          setDonaHistory(data.dona.history);
          localStorage.setItem('levelmovie_dona_history', JSON.stringify(data.dona.history));
        }
        showToast(lang === 'fr' ? 'Données restaurées avec succès !' : 'Data restored successfully!', 'success');
      } catch {
        showToast(lang === 'fr' ? 'Format de fichier de sauvegarde invalide.' : 'Invalid backup file format.', 'error');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const renderTabContent = (tabId: TabType) => {
    switch (tabId) {
      case 'general':
        return (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                {lang === 'fr' ? 'Général' : 'General'}
              </h3>
              <p className="text-xs text-white/50 mt-1">
                {lang === 'fr' ? 'Langues, lecture et autorisations du système' : 'Languages, playback and system permissions'}
              </p>
            </div>

            <div className="space-y-4">
              {/* Carte Langue de l'interface */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#a855f7]" />
                    <span>{lang === 'fr' ? 'Langue de l\'interface' : 'Interface Language'}</span>
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    {lang === 'fr' ? 'Choisissez la langue principale de l\'application' : 'Choose application display language'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLang('fr');
                      localStorage.setItem('levelmovie_lang', 'fr');
                      localStorage.setItem('levelmovie_lang_explicit', 'true');
                      showToast('Langue : Français', 'success');
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                      lang === 'fr'
                        ? 'bg-[#a855f7] border-[#a855f7] text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    Français
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLang('en');
                      localStorage.setItem('levelmovie_lang', 'en');
                      localStorage.setItem('levelmovie_lang_explicit', 'true');
                      showToast('Language: English', 'success');
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                      lang === 'en'
                        ? 'bg-[#a855f7] border-[#a855f7] text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Carte Origine des contenus (VF / VO) */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#a855f7]" />
                    <span>{lang === 'fr' ? 'Pistes audio des films & séries' : 'Audio Track Preferences'}</span>
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    {lang === 'fr' ? 'Filtrer automatiquement les versions françaises (VF) ou originales (VO)' : 'Filter by audio language in catalog'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'all', label: lang === 'fr' ? 'Tous' : 'All' },
                    { id: 'fr', label: 'VF (Français)' },
                    { id: 'en', label: 'VO (Anglais)' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setContentLang(opt.id);
                        localStorage.setItem('levelmovie_content_lang', opt.id);
                        showToast(`Pistes : ${opt.label}`, 'success');
                      }}
                      className={`px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                        contentLang === opt.id 
                          ? 'bg-[#a855f7] border-[#a855f7] text-white shadow-[0_0_10px_rgba(168,85,247,0.35)]' 
                          : 'border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Carte Section Autorisations Système (Interrupteurs fonctionnels) */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5">
                  <Shield className="w-4 h-4 text-[#a855f7]" />
                  <span>{lang === 'fr' ? 'Autorisations & Permissions' : 'Permissions & System Access'}</span>
                </h4>

                <div className="space-y-4">
                  {/* Notifications Push */}
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <div className="pr-4">
                      <span className="text-sm font-semibold text-white/90">
                        {lang === 'fr' ? 'Notifications push du navigateur' : 'Browser push notifications'}
                      </span>
                      <p className="text-xs text-white/40">
                        {lang === 'fr' ? 'Alertes pour les sorties et invitations de salon' : 'Alerts for releases and party invites'}
                      </p>
                    </div>
                    <Interrupteur 
                      checked={notifPermission} 
                      onChange={(next) => {
                        setNotifPermission(next);
                        localStorage.setItem('levelmovie_notif_push', String(next));
                        if (next && 'Notification' in window && Notification.permission === 'default') {
                          Notification.requestPermission();
                        }
                        showToast(next ? 'Notifications push activées' : 'Notifications désactivées', next ? 'success' : 'info');
                      }} 
                    />
                  </div>

                  {/* Lecture automatique trailers */}
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <div className="pr-4">
                      <span className="text-sm font-semibold text-white/90">
                        {lang === 'fr' ? 'Lecture automatique des bandes-annonces' : 'Auto-play trailers'}
                      </span>
                      <p className="text-xs text-white/40">
                        {lang === 'fr' ? 'Aperçu vidéo automatique sur la page d\'accueil' : 'Dynamic video preview in hero banner'}
                      </p>
                    </div>
                    <Interrupteur 
                      checked={autoTrailer} 
                      onChange={(next) => {
                        setAutoTrailer(next);
                        localStorage.setItem('levelmovie_auto_trailer', String(next));
                        showToast(next ? 'Lecture auto des trailers activée' : 'Lecture auto désactivée', 'info');
                      }} 
                    />
                  </div>

                  {/* Stockage local hors-ligne */}
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <div className="pr-4">
                      <span className="text-sm font-semibold text-white/90">
                        {lang === 'fr' ? 'Autoriser le stockage local hors-ligne' : 'Offline local storage access'}
                      </span>
                      <p className="text-xs text-white/40">
                        {lang === 'fr' ? 'Mise en cache rapide des métadonnées pour fluidifier l\'app' : 'Local caching for instant loads'}
                      </p>
                    </div>
                    <Interrupteur 
                      checked={offlineStorage} 
                      onChange={(next) => {
                        setOfflineStorage(next);
                        localStorage.setItem('levelmovie_offline_storage', String(next));
                        showToast(next ? 'Stockage local activé' : 'Stockage local restreint', 'info');
                      }} 
                    />
                  </div>

                  {/* Synchro arrière plan */}
                  <div className="flex items-center justify-between py-2">
                    <div className="pr-4">
                      <span className="text-sm font-semibold text-white/90">
                        {lang === 'fr' ? 'Synchronisation automatique en arrière-plan' : 'Background auto-synchronization'}
                      </span>
                      <p className="text-xs text-white/40">
                        {lang === 'fr' ? 'Synchronise les favoris et la progression de lecture' : 'Sync bookmarks & play status across devices'}
                      </p>
                    </div>
                    <Interrupteur 
                      checked={bgSync} 
                      onChange={(next) => {
                        setBgSync(next);
                        localStorage.setItem('levelmovie_bg_sync', String(next));
                        showToast(next ? 'Synchronisation active' : 'Synchronisation désactivée', 'info');
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                {lang === 'fr' ? 'Compte & Profil' : 'Account & Profile'}
              </h3>
              <p className="text-xs text-white/50 mt-1">
                {lang === 'fr' ? 'Identifiants, sécurité et confidentialité de votre profil' : 'Credentials, security and profile privacy'}
              </p>
            </div>

            <div className="space-y-4">
              {/* Carte Photo & Identifiant avec Copie */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-5 shadow-sm">
                <input
                  type="file"
                  ref={importFileRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      showToast(lang === 'fr' ? 'L\'image dépasse 5 Mo' : 'Image exceeds 5MB', 'error');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => {
                      const res = reader.result as string;
                      setCustomAvatar(res);
                      localStorage.setItem('levelmovie_custom_avatar', res);
                      localStorage.setItem('levelmovie_user_photo', res);
                      localStorage.setItem('lm_photo', res);
                      showToast(lang === 'fr' ? 'Photo de profil mise à jour !' : 'Profile photo updated!', 'success');
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                />

                <div className="relative group shrink-0 self-center sm:self-auto">
                  <div className="w-20 h-20 bg-[#151624] border-2 border-white/20 rounded-2xl overflow-hidden flex items-center justify-center shadow-md">
                    {customAvatar || userPhoto ? (
                      <img src={customAvatar || userPhoto || ''} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-[#c084fc]">
                        {(userName || 'U')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => importFileRef.current?.click()}
                    className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title={lang === 'fr' ? 'Importer une photo' : 'Upload a photo'}
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-[#a855f7] uppercase font-black tracking-widest block">
                      {lang === 'fr' ? 'Identifiant Unique' : 'Identifier (Read-only)'}
                    </label>
                    {isVipActive && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> VIP
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={user?.uid ? `ID-${user.uid.substring(0, 8).toUpperCase()}` : 'ID-LEVELUP-1A'} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm px-3 py-2 outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = user?.uid ? `ID-${user.uid.substring(0, 8).toUpperCase()}` : 'ID-LEVELUP-1A';
                        navigator.clipboard.writeText(val);
                        setCopiedId(true);
                        showToast(lang === 'fr' ? 'Identifiant copié !' : 'ID copied to clipboard!', 'success');
                        setTimeout(() => setCopiedId(false), 2000);
                      }}
                      className="p-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer shrink-0"
                      title={lang === 'fr' ? 'Copier l\'identifiant' : 'Copy identifier'}
                    >
                      {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/70" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => importFileRef.current?.click()}
                    className="text-xs text-[#c084fc] hover:text-white font-bold inline-flex items-center gap-1.5 cursor-pointer underline underline-offset-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{lang === 'fr' ? 'Importer une photo depuis l\'appareil' : 'Upload photo from device'}</span>
                  </button>
                </div>
              </div>

              {/* Carte Email et Moyen de connexion */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-black tracking-widest block mb-1">
                    {lang === 'fr' ? 'Adresse E-mail' : 'Email Address'}
                  </label>
                  <input 
                    type="text" 
                    readOnly 
                    value={userEmail || 'levelup.ia0@gmail.com'} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-3.5 py-2.5 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-black tracking-widest block mb-1">
                    {lang === 'fr' ? 'Moyen de connexion' : 'Login Method'}
                  </label>
                  <input 
                    type="text" 
                    readOnly 
                    value={user ? 'Google OAuth (Firebase Auth)' : 'Session Locale Active'} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-3.5 py-2.5 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Carte Profil Privé (Interrupteur fonctionnel) */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
                <div className="pr-4">
                  <span className="text-sm font-bold text-white/90">
                    {lang === 'fr' ? 'Cacher mon profil en mode privé' : 'Hide profile in private mode'}
                  </span>
                  <p className="text-xs text-white/40 mt-0.5">
                    {lang === 'fr' ? 'Empêche quiconque de vous envoyer des invitations de salon' : 'Prevents anyone from sending you party invites'}
                  </p>
                </div>
                <Interrupteur 
                  checked={privateProfile} 
                  onChange={(next) => {
                    setPrivateProfile(next);
                    localStorage.setItem('levelmovie_private_profile', String(next));
                    showToast(next ? 'Profil désormais privé' : 'Profil désormais public', 'info');
                  }} 
                />
              </div>

              {/* Carte Mot de passe & Sécurité */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white">
                      {lang === 'fr' ? 'Mot de passe & Sécurité' : 'Password & Security'}
                    </span>
                    <p className="text-xs text-white/40 mt-0.5">
                      {lang === 'fr' ? 'Changer ou réinitialiser votre mot de passe' : 'Update or reset your login password'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(!showPasswordModal)}
                    className="px-4 py-2 rounded-full border border-white/20 hover:border-white/50 text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    {showPasswordModal ? (lang === 'fr' ? 'Fermer' : 'Close') : (lang === 'fr' ? 'Modifier' : 'Change')}
                  </button>
                </div>

                {showPasswordModal && (
                  <div className="p-4 bg-[#0a0a12] border border-white/10 rounded-2xl space-y-3 mt-3 animate-in fade-in">
                    <div>
                      <label className="text-xs text-white/50 block mb-1">
                        {lang === 'fr' ? 'Ancien mot de passe' : 'Current Password'}
                      </label>
                      <input 
                        type="password" 
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-[#151624] border border-white/20 rounded-xl text-white text-xs px-3.5 py-2.5 outline-none focus:border-[#a855f7]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 block mb-1">
                        {lang === 'fr' ? 'Nouveau mot de passe' : 'New Password'}
                      </label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-[#151624] border border-white/20 rounded-xl text-white text-xs px-3.5 py-2.5 outline-none focus:border-[#a855f7]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 block mb-1">
                        {lang === 'fr' ? 'Confirmer le nouveau mot de passe' : 'Confirm New Password'}
                      </label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-[#151624] border border-white/20 rounded-xl text-white text-xs px-3.5 py-2.5 outline-none focus:border-[#a855f7]"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!newPassword || newPassword !== confirmPassword) {
                            showToast(lang === 'fr' ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.', 'error');
                            return;
                          }
                          localStorage.setItem('levelmovie_pwd_updated', String(Date.now()));
                          setShowPasswordModal(false);
                          setOldPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          showToast(lang === 'fr' ? 'Mot de passe mis à jour avec succès !' : 'Password updated successfully!', 'success');
                        }}
                        className="flex-1 py-2.5 rounded-full bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                      >
                        {lang === 'fr' ? 'Enregistrer' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          showToast(lang === 'fr' ? 'Email de réinitialisation envoyé à ' + (userEmail || 'votre adresse') : 'Password reset link sent to your email', 'info');
                        }}
                        className="py-2.5 px-4 rounded-full border border-white/20 text-white/70 hover:text-white text-xs font-semibold cursor-pointer"
                      >
                        {lang === 'fr' ? 'Lien par email' : 'Send email'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Danger Zone: Demande de suppression */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <span className="text-sm font-bold text-red-400">
                    {lang === 'fr' ? 'Suppression de compte' : 'Account Deletion'}
                  </span>
                  <p className="text-xs text-white/40 mt-0.5">
                    {lang === 'fr' ? 'Demande la suppression définitive de vos données' : 'Permanently deletes your account and history'}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    if (confirm(lang === 'fr' ? 'Voulez-vous vraiment envoyer une demande de suppression définitive de votre compte ?' : 'Do you want to request permanent account deletion?')) {
                      showToast(lang === 'fr' ? 'Demande de suppression enregistrée. Vous recevrez une confirmation sous 24h.' : 'Deletion request submitted.', 'info');
                    }
                  }}
                  className="px-4 py-2.5 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500/15 text-xs font-black uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                >
                  {lang === 'fr' ? 'Demander suppression' : 'Request deletion'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'library':
        return (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                {lang === 'fr' ? 'Ma Bibliothèque' : 'My Library'}
              </h3>
              <p className="text-xs text-white/50 mt-1">
                {lang === 'fr' 
                  ? 'Gérez vos 5 sections de bibliothèque : titres vus, en cours, en pause, salons et purge' 
                  : 'Manage watched, watching, paused titles, recorded party rooms and global clear'}
              </p>
            </div>

            <div className="space-y-3">
              {/* 1. Titres visionnés */}
              <div className="border border-white/10 bg-white/[0.02] rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpandedLibraryCategory(expandedLibraryCategory === 'watched' ? null : 'watched')}
                  className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center">
                      <Film className="w-4 h-4 text-[#c084fc]" />
                    </div>
                    <span className="text-sm font-bold text-white">
                      1. {lang === 'fr' ? 'Visionnage (Titres déjà regardés)' : 'Watched titles (Completed)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-full text-white font-bold">{watchedList.length}</span>
                    <ChevronRight className={`w-4 h-4 text-white/40 transition-transform ${expandedLibraryCategory === 'watched' ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {expandedLibraryCategory === 'watched' && (
                  <div className="p-4 border-t border-white/5 bg-black/40 space-y-2 animate-in fade-in">
                    {watchedList.length === 0 ? (
                      <div className="text-xs text-white/40 py-2">{lang === 'fr' ? 'Aucun titre visionné.' : 'No watched titles.'}</div>
                    ) : (
                      watchedList.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl border border-white/5 bg-white/[0.02]">
                          <div>
                            <div className="text-xs font-bold text-white">{item.title}</div>
                            <div className="text-[10px] text-white/40">{item.type} • {item.year} • {item.duration}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = watchedList.filter(i => i.id !== item.id);
                              setWatchedList(updated);
                              localStorage.setItem('levelmovie_watched_items', JSON.stringify(updated));
                              showToast(lang === 'fr' ? 'Titre retiré' : 'Title removed', 'info');
                            }}
                            className="text-[11px] text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* 2. Non terminés (En cours) */}
              <div className="border border-white/10 bg-white/[0.02] rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpandedLibraryCategory(expandedLibraryCategory === 'watching' ? null : 'watching')}
                  className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                      <Play className="w-4 h-4 text-indigo-300" />
                    </div>
                    <span className="text-sm font-bold text-white">
                      2. {lang === 'fr' ? 'Non terminés (En cours de lecture)' : 'Currently watching (In progress)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-full text-white font-bold">{watchingList.length}</span>
                    <ChevronRight className={`w-4 h-4 text-white/40 transition-transform ${expandedLibraryCategory === 'watching' ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {expandedLibraryCategory === 'watching' && (
                  <div className="p-4 border-t border-white/5 bg-black/40 space-y-2 animate-in fade-in">
                    {watchingList.length === 0 ? (
                      <div className="text-xs text-white/40 py-2">{lang === 'fr' ? 'Aucun titre en cours.' : 'No titles in progress.'}</div>
                    ) : (
                      watchingList.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl border border-white/5 bg-white/[0.02]">
                          <div>
                            <div className="text-xs font-bold text-white">{item.title}</div>
                            <div className="text-[10px] text-[#a855f7] font-medium">{item.progress} • {item.timeLeft}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onNavigateCategory('movie');
                              }}
                              className="text-xs font-bold text-white bg-[#a855f7] px-3.5 py-1.5 rounded-full hover:bg-[#9333ea] shadow-sm transition-colors cursor-pointer"
                            >
                              {lang === 'fr' ? 'Reprendre' : 'Resume'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = watchingList.filter(i => i.id !== item.id);
                                setWatchingList(updated);
                                localStorage.setItem('levelmovie_watching_items', JSON.stringify(updated));
                                showToast(lang === 'fr' ? 'Titre retiré' : 'Removed', 'info');
                              }}
                              className="text-[11px] text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* 3. En pause */}
              <div className="border border-white/10 bg-white/[0.02] rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpandedLibraryCategory(expandedLibraryCategory === 'paused' ? null : 'paused')}
                  className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                      <Bookmark className="w-4 h-4 text-amber-300" />
                    </div>
                    <span className="text-sm font-bold text-white">
                      3. {lang === 'fr' ? 'En pause' : 'Paused titles'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-full text-white font-bold">{pausedList.length}</span>
                    <ChevronRight className={`w-4 h-4 text-white/40 transition-transform ${expandedLibraryCategory === 'paused' ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {expandedLibraryCategory === 'paused' && (
                  <div className="p-4 border-t border-white/5 bg-black/40 space-y-2 animate-in fade-in">
                    {pausedList.length === 0 ? (
                      <div className="text-xs text-white/40 py-2">{lang === 'fr' ? 'Aucun titre en pause.' : 'No paused titles.'}</div>
                    ) : (
                      pausedList.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl border border-white/5 bg-white/[0.02]">
                          <div>
                            <div className="text-xs font-bold text-white">{item.title}</div>
                            <div className="text-[10px] text-white/40">{item.type} • {item.pausedAt}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = pausedList.filter(i => i.id !== item.id);
                              setPausedList(updated);
                              localStorage.setItem('levelmovie_paused_items', JSON.stringify(updated));
                              showToast(lang === 'fr' ? 'Titre retiré' : 'Removed', 'info');
                            }}
                            className="text-[11px] text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* 4. Salons créés ou participés */}
              <div className="border border-white/10 bg-white/[0.02] rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpandedLibraryCategory(expandedLibraryCategory === 'parties' ? null : 'parties')}
                  className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <Users className="w-4 h-4 text-emerald-300" />
                    </div>
                    <span className="text-sm font-bold text-white">
                      4. {lang === 'fr' ? 'Salons créés ou participés' : 'Watch parties created / joined'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-full text-white font-bold">{libraryParties.length}</span>
                    <ChevronRight className={`w-4 h-4 text-white/40 transition-transform ${expandedLibraryCategory === 'parties' ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {expandedLibraryCategory === 'parties' && (
                  <div className="p-4 border-t border-white/5 bg-black/40 space-y-2 animate-in fade-in">
                    {libraryParties.length === 0 ? (
                      <div className="text-xs text-white/40 py-2">{lang === 'fr' ? 'Aucun salon enregistré.' : 'No party rooms recorded.'}</div>
                    ) : (
                      libraryParties.map(party => (
                        <div key={party.id} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl border border-white/5 bg-white/[0.02]">
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              {party.title}
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                {party.code}
                              </span>
                            </div>
                            <div className="text-[10px] text-white/40 mt-0.5">{party.date} • Rôle : {party.role}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onNavigateCategory('party');
                              }}
                              className="text-xs font-bold text-white border border-white/20 hover:border-white/50 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
                            >
                              {lang === 'fr' ? 'Accéder' : 'Open'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = libraryParties.filter(p => p.id !== party.id);
                                setLibraryParties(updated);
                                localStorage.setItem('levelmovie_library_parties', JSON.stringify(updated));
                                showToast(lang === 'fr' ? 'Salon retiré' : 'Room removed', 'info');
                              }}
                              className="text-[11px] text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* 5. Vider mon historique global */}
              <div className="pt-2">
                <button 
                  type="button"
                  onClick={handleClearFullLibrary}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>5. {lang === 'fr' ? 'Vider toute ma bibliothèque' : 'Clear entire library'}</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'party':
        return (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                Watch Party • {lang === 'fr' ? 'Paramètres des Salons' : 'Room Settings'}
              </h3>
              <p className="text-xs text-white/50 mt-1">
                {lang === 'fr' ? 'Gérez qui peut vous inviter, la synchronisation vidéo et le chat' : 'Manage invitations, auto video-sync and chat alerts'}
              </p>
            </div>

            <div className="space-y-4">
              {/* Qui peut m'inviter */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <label className="text-sm font-bold text-white block mb-2">
                  {lang === 'fr' ? 'Qui peut m\'inviter à un salon ?' : 'Who can invite me to a room?'}
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { id: 'everyone', label: lang === 'fr' ? 'Tout le monde' : 'Everyone' },
                    { id: 'friends', label: lang === 'fr' ? 'Amis uniquement' : 'Friends only' },
                    { id: 'none', label: lang === 'fr' ? 'Personne (Privé)' : 'Nobody (Private)' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setPartyInvitePermission(opt.id as any);
                        localStorage.setItem('levelmovie_party_invite', opt.id);
                        showToast(`Autorisation : ${opt.label}`, 'info');
                      }}
                      className={`py-2.5 px-3 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        partyInvitePermission === opt.id
                          ? 'bg-[#a855f7] border-[#a855f7] text-white shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options de lecture en groupe avec Interrupteurs */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div className="pr-4">
                    <span className="text-sm font-semibold text-white/90">
                      {lang === 'fr' ? 'Synchronisation automatique du lecteur' : 'Auto sync video player'}
                    </span>
                    <p className="text-xs text-white/40">
                      {lang === 'fr' ? 'S\'aligne instantanément sur le créateur du salon' : 'Instantly aligns timestamp with room host'}
                    </p>
                  </div>
                  <Interrupteur 
                    checked={partyAutoSync} 
                    onChange={(next) => {
                      setPartyAutoSync(next);
                      localStorage.setItem('levelmovie_party_sync', String(next));
                      showToast(next ? 'Synchronisation automatique activée' : 'Synchronisation manuelle', 'info');
                    }} 
                  />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div className="pr-4">
                    <span className="text-sm font-semibold text-white/90">
                      {lang === 'fr' ? 'Sons des notifications du chat en direct' : 'Live chat sound alerts'}
                    </span>
                    <p className="text-xs text-white/40">
                      {lang === 'fr' ? 'Bip sonore discret lors de la réception d\'un message' : 'Play subtle sound on new messages'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Interrupteur 
                      checked={partyNotifSounds} 
                      onChange={(next) => {
                        setPartyNotifSounds(next);
                        localStorage.setItem('levelmovie_party_sounds', String(next));
                        if (next) playNotificationSound();
                        showToast(next ? 'Sons de notification activés (Test 🔊)' : 'Sons coupés', 'info');
                      }} 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="pr-4">
                    <span className="text-sm font-semibold text-white/90">
                      {lang === 'fr' ? 'Masquer automatiquement les spoilers' : 'Auto hide spoilers in chat'}
                    </span>
                    <p className="text-xs text-white/40">
                      {lang === 'fr' ? 'Floute les messages signalés comme spoiler' : 'Blur chat lines marked as spoilers'}
                    </p>
                  </div>
                  <Interrupteur 
                    checked={partyHideSpoilers} 
                    onChange={(next) => {
                      setPartyHideSpoilers(next);
                      localStorage.setItem('levelmovie_party_hide_spoilers', String(next));
                      showToast(next ? 'Masquage des spoilers activé' : 'Tous les messages affichés', 'info');
                    }} 
                  />
                </div>
              </div>

              {/* Raccourci vers les salons */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateCategory('party');
                }}
                className="w-full py-3.5 rounded-2xl bg-[#a855f7]/15 hover:bg-[#a855f7]/25 border border-[#a855f7]/40 text-[#c084fc] text-xs font-black uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                {lang === 'fr' ? 'Rejoindre ou créer un salon maintenant' : 'Join or create a watch party now'}
              </button>
            </div>
          </div>
        );

      case 'dona':
        return (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                Dona IA • {lang === 'fr' ? 'Assistant Intelligent & Historique' : 'AI Assistant & History'}
              </h3>
              <p className="text-xs text-white/50 mt-1">
                {lang === 'fr' ? 'Personnalisez la personnalité de Dona et consultez vos conversations' : 'Tune Dona response style, speech and manage conversations'}
              </p>
            </div>

            <div className="space-y-4">
              {/* Style des réponses de Dona */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm">
                <label className="text-sm font-bold text-white block mb-2">
                  {lang === 'fr' ? 'Style de réponse de Dona' : 'Dona Response Style'}
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { id: 'concise', label: lang === 'fr' ? 'Court & Précis' : 'Short & Concise' },
                    { id: 'expert', label: lang === 'fr' ? 'Cinéphile Expert' : 'Film Expert' },
                    { id: 'casual', label: lang === 'fr' ? 'Décontracté & Cool' : 'Casual & Friendly' },
                    { id: 'critic', label: lang === 'fr' ? 'Critique Pro' : 'Pro Movie Critic' },
                  ].map(style => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => {
                        setDonaResponseStyle(style.id as any);
                        localStorage.setItem('levelmovie_dona_style', style.id);
                        showToast(`Style Dona : ${style.label}`, 'info');
                      }}
                      className={`py-2.5 px-3 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        donaResponseStyle === style.id
                          ? 'bg-[#a855f7] border-[#a855f7] text-white shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interrupteurs Dona */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div className="pr-4">
                    <span className="text-sm font-semibold text-white/90">
                      {lang === 'fr' ? 'Recommandations proactives' : 'Proactive recommendations'}
                    </span>
                    <p className="text-xs text-white/40">
                      {lang === 'fr' ? 'Dona propose des pépites selon vos goûts' : 'Suggests hidden gems based on watch history'}
                    </p>
                  </div>
                  <Interrupteur 
                    checked={donaProactiveRecs} 
                    onChange={(next) => {
                      setDonaProactiveRecs(next);
                      localStorage.setItem('levelmovie_dona_proactive', String(next));
                      showToast(next ? 'Recommandations proactives activées' : 'Recommandations désactivées', 'info');
                    }} 
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="pr-4">
                    <span className="text-sm font-semibold text-white/90">
                      {lang === 'fr' ? 'Synthèse vocale des réponses' : 'Voice synthesis for replies'}
                    </span>
                    <p className="text-xs text-white/40">
                      {lang === 'fr' ? 'Lecture audio automatique des résumés' : 'Read aloud answers with voice'}
                    </p>
                  </div>
                  <Interrupteur 
                    checked={donaVoiceMode} 
                    onChange={(next) => {
                      setDonaVoiceMode(next);
                      localStorage.setItem('levelmovie_dona_voice', String(next));
                      if (next) speakText(lang === 'fr' ? 'Bonjour, je suis Dona, votre assistante cinéma.' : 'Hello, I am Dona, your movie assistant.');
                      showToast(next ? 'Synthèse vocale activée (Test 🎙️)' : 'Synthèse vocale coupée', 'info');
                    }} 
                  />
                </div>
              </div>

              {/* Historique des échanges */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-sm font-bold text-white">
                    {lang === 'fr' ? 'Historique des échanges avec Dona' : 'Chat History with Dona'}
                  </span>
                  {donaHistory.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setDonaHistory([]);
                        localStorage.removeItem('levelmovie_dona_history');
                        showToast(lang === 'fr' ? 'Historique Dona effacé' : 'Dona history cleared', 'success');
                      }}
                      className="text-xs text-red-400 hover:text-red-300 font-bold px-3 py-1 rounded-full hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      {lang === 'fr' ? 'Vider' : 'Clear'}
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {donaHistory.length === 0 ? (
                    <div className="py-4 text-xs text-white/40 text-center">
                      {lang === 'fr' ? 'Aucune conversation enregistrée avec Dona.' : 'No conversations recorded.'}
                    </div>
                  ) : (
                    donaHistory.map(item => (
                      <div key={item.id} className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-3">
                        <div className="pr-2">
                          <p className="text-xs text-white/90 font-medium">« {item.query} »</p>
                          <span className="text-[10px] text-white/40">{item.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenDona) onOpenDona();
                              else { onClose(); onNavigateCategory('dona'); }
                            }}
                            className="text-xs text-[#a855f7] hover:text-white font-bold whitespace-nowrap px-3 py-1 rounded-full hover:bg-[#a855f7]/20 transition-colors cursor-pointer"
                          >
                            {lang === 'fr' ? 'Reprendre' : 'Open'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = donaHistory.filter(h => h.id !== item.id);
                              setDonaHistory(updated);
                              localStorage.setItem('levelmovie_dona_history', JSON.stringify(updated));
                            }}
                            className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'store':
        return (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider">
                    LevelUp Store & Suite
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                    Architecture Pro
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-1">
                  {lang === 'fr' 
                    ? 'Supervision des services connectés, synchronisation Cloud Supabase et privilèges de l’écosystème LevelUp.' 
                    : 'Manage connected services, Supabase cloud sync and LevelUp ecosystem privileges.'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* VIP Activation Card */}
              <div className="bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-black/40 border border-purple-500/30 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'fr' ? 'Clé d’activation VIP & Accès Privilège' : 'VIP License & Privilege Access'}</span>
                  </span>
                  {isVipActive ? (
                    <span className="text-xs font-black text-amber-300 bg-amber-400/15 border border-amber-400/40 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.25)] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      VIP PRO ACTIF
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-semibold text-white/40 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      Standard
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  {lang === 'fr' 
                    ? 'Débloquez le routage haute priorité, la bande passante sans compression et la certification communautaire.' 
                    : 'Unlock high-priority stream routing, lossless audio feeds and certified community badges.'}
                </p>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={lang === 'fr' ? 'Clé de licence (ex: VIP2026, CINEMA)' : 'License key (e.g. VIP2026, CINEMA)'}
                    className="flex-1 bg-black/60 border border-white/20 focus:border-[#a855f7] rounded-xl text-white text-xs px-4 py-2.5 outline-none uppercase font-mono tracking-wider transition-colors shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={handleRedeemCode}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] hover:from-[#9333ea] hover:to-[#6d28d9] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer shrink-0"
                  >
                    {lang === 'fr' ? 'Activer' : 'Redeem'}
                  </button>
                </div>
              </div>

              {/* Ecosystem Micro-services */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white/60 px-1">
                  <span>{lang === 'fr' ? 'Modules connectés de la Suite' : 'Connected Suite Modules'}</span>
                  <span className="font-mono text-[11px] text-purple-300">v2.6 High-Performance</span>
                </div>

                {[
                  { name: 'LevelMovie Engine', desc: 'Moteur de streaming adaptatif multi-sources & Watch Party en temps réel', ver: 'v2.6.0', latency: '24ms', state: 'Opérationnel', active: true },
                  { name: 'Level IA & Dona', desc: 'Intelligence cinéphile avancée propulsée par cluster multi-clés Gemini', ver: 'v2.6.0', latency: '35ms', state: 'Opérationnel', active: true },
                  { name: 'LevelMusic Hi-Fi', desc: 'Lecteur audio HD & indexation automatique des bandes originales de films', ver: 'v2.4.1', latency: '40ms', state: isVipActive ? 'Opérationnel' : 'Pass VIP requis', active: isVipActive },
                  { name: 'Oppa Media Hub', desc: 'Flux d’actualités cinéma en direct, Reels vidéo & Stories immersives', ver: 'v2.2.0', latency: '28ms', state: 'Opérationnel', active: true },
                  { name: 'LevelDay Radar', desc: 'Station météorologique haute précision et arc astronomique dynamique', ver: 'v2.1.0', latency: '19ms', state: 'Opérationnel', active: true },
                ].map((app, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex items-center justify-between gap-3 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{app.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70">{app.ver}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.active ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}>
                          • {app.state}
                        </span>
                      </div>
                      <p className="text-xs text-white/50">{app.desc}</p>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-white/40">
                        <span>Latence : <strong className="text-emerald-400">{app.latency}</strong></span>
                        <span>Protocole : <strong>TLS 1.3 / Supabase WSS</strong></span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast(`Module ${app.name} diagnostiqué : statut optimal`, 'info')}
                      className="px-4 py-2 rounded-xl border border-white/15 hover:border-purple-400 bg-white/5 hover:bg-purple-600/20 text-xs font-bold text-white/80 hover:text-white uppercase transition-all shrink-0 cursor-pointer"
                    >
                      {lang === 'fr' ? 'Diagnostiquer' : 'Inspect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'streaming':
        return (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                {lang === 'fr' ? 'Serveurs & Lecture' : 'Streaming Servers'}
              </h3>
              <p className="text-xs text-white/50 mt-1">
                {lang === 'fr' 
                  ? 'Classez vos 5 serveurs par ordre de priorité. Le premier sera lancé par défaut.' 
                  : 'Rank your 5 servers by priority. The first server is selected automatically.'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="border border-white/10 bg-white/[0.02] rounded-2xl overflow-hidden shadow-sm divide-y divide-white/5">
                {servers.map((srv, index) => (
                  <div key={srv.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-xs font-mono w-5">{index + 1}.</span>
                      <div>
                        <span className="text-sm font-bold text-white">{srv.name}</span>
                        {index === 0 && (
                          <span className="ml-2 text-[10px] bg-[#a855f7]/20 border border-[#a855f7]/30 text-[#c084fc] font-bold px-2 py-0.5 rounded-full">
                            PAR DÉFAUT
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {srv.ping || '40 ms'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button 
                          type="button"
                          onClick={() => moveServer(index, 'up')}
                          disabled={index === 0}
                          className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          title="Monter"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => moveServer(index, 'down')}
                          disabled={index === servers.length - 1}
                          className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          title="Descendre"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton de test de ping et réinitialisation */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleTestPings}
                  disabled={isTestingPing}
                  className="flex-1 py-2.5 px-4 rounded-full border border-white/20 hover:border-white/50 text-white text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin' : ''}`} />
                  <span>{lang === 'fr' ? 'Tester la latence des serveurs' : 'Test server latency'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const def = [
                      { id: 'vidsrc_me', name: 'GLOBAL', ping: '38 ms' },
                      { id: 'superembed', name: 'MULTI', ping: '42 ms' },
                      { id: 'vidlink', name: 'ALPHA', ping: '55 ms' },
                      { id: 'vidsrc_to', name: 'BETA', ping: '64 ms' },
                      { id: 'twoembed', name: 'THETA', ping: '72 ms' }
                    ];
                    setServers(def);
                    localStorage.setItem('levelmovie_servers_order', JSON.stringify(def));
                    showToast(lang === 'fr' ? 'Ordre par défaut rétabli' : 'Default server order restored', 'info');
                  }}
                  className="py-2.5 px-4 rounded-full border border-white/10 hover:border-white/30 text-white/60 hover:text-white text-xs font-semibold uppercase transition-all cursor-pointer"
                >
                  {lang === 'fr' ? 'Réinitialiser' : 'Reset'}
                </button>
              </div>

              {/* Basculement automatique Interrupteur */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
                <div className="pr-4">
                  <span className="text-sm font-bold text-white/90">
                    {lang === 'fr' ? 'Basculement automatique de serveur' : 'Auto server fallback'}
                  </span>
                  <p className="text-xs text-white/40 mt-0.5">
                    {lang === 'fr' ? 'Change automatiquement de serveur si le film est indisponible sur le 1er' : 'Switches automatically if video source fails'}
                  </p>
                </div>
                <Interrupteur 
                  checked={autoFallback} 
                  onChange={(next) => {
                    setAutoFallback(next);
                    localStorage.setItem('levelmovie_auto_fallback', String(next));
                    showToast(next ? 'Basculement auto activé' : 'Basculement désactivé', 'info');
                  }} 
                />
              </div>
            </div>
          </div>
        );

      case 'parental':
        return (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                {lang === 'fr' ? 'Contrôle Parental' : 'Parental Controls'}
              </h3>
              <p className="text-xs text-white/50 mt-1">
                {lang === 'fr' ? 'Verrouillage par code PIN et filtrage des contenus sensibles' : 'PIN protection and sensitive content filters'}
              </p>
            </div>

            {pinView === 'main' && (
              <div className="space-y-4">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
                  <div className="pr-4">
                    <span className="text-sm text-white/90 font-bold">
                      {lang === 'fr' ? 'Filtre des contenus 18+ (Adulte)' : '18+ Adult Content Filter'}
                    </span>
                    <p className="text-xs text-white/40 mt-0.5">
                      {lang === 'fr' ? 'Masque strictement tous les titres réservés aux adultes' : 'Strictly hide all adult titles from catalog'}
                    </p>
                  </div>
                  <Interrupteur 
                    checked={parentalFilter} 
                    onChange={(next) => {
                      setParentalFilter(next);
                      localStorage.setItem('levelmovie_parental', String(next));
                      showToast(next ? 'Filtre 18+ activé' : 'Filtre 18+ désactivé', 'info');
                    }} 
                  />
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <button 
                    type="button"
                    onClick={() => setPinView('setup')}
                    className="py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-colors text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>{lang === 'fr' ? 'Configurer / Modifier le code PIN' : 'Configure / Change PIN code'}</span>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPinView('forgot')}
                    className="py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-colors text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>{lang === 'fr' ? 'Code PIN oublié ? (Questions secrètes)' : 'Forgot PIN? (Secret questions)'}</span>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </button>
                </div>
              </div>
            )}

            {pinView === 'setup' && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                <p className="text-xs text-white/60 mb-2">
                  {lang === 'fr' 
                    ? 'Définissez votre code PIN à 4 chiffres et vos 3 questions de sécurité obligatoires.' 
                    : 'Set your 4-digit PIN and 3 security questions to recover it anytime.'}
                </p>
                
                <div>
                  <label className="text-xs text-white/50 block mb-1">Code PIN (4 chiffres)</label>
                  <input 
                    type="password" 
                    maxLength={4} 
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full bg-[#151624] border border-white/20 rounded-xl text-white px-3.5 py-2.5 outline-none font-mono text-center tracking-widest text-lg focus:border-[#a855f7]" 
                    placeholder="••••" 
                  />
                </div>
                
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Question de sécurité 1</label>
                    <input 
                      type="text" 
                      value={q1}
                      onChange={(e) => setQ1(e.target.value)}
                      className="w-full bg-[#151624] border border-white/20 rounded-xl text-white px-3.5 py-2 text-xs outline-none" 
                      placeholder="Question 1..." 
                    />
                    <input 
                      type="text" 
                      value={a1}
                      onChange={(e) => setA1(e.target.value)}
                      className="w-full bg-[#151624] border border-white/20 rounded-xl text-white px-3.5 py-2 text-xs outline-none mt-1.5" 
                      placeholder={lang === 'fr' ? 'Votre réponse...' : 'Your answer...'} 
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 block mb-1">Question de sécurité 2</label>
                    <input 
                      type="text" 
                      value={q2}
                      onChange={(e) => setQ2(e.target.value)}
                      className="w-full bg-[#151624] border border-white/20 rounded-xl text-white px-3.5 py-2 text-xs outline-none" 
                      placeholder="Question 2..." 
                    />
                    <input 
                      type="text" 
                      value={a2}
                      onChange={(e) => setA2(e.target.value)}
                      className="w-full bg-[#151624] border border-white/20 rounded-xl text-white px-3.5 py-2 text-xs outline-none mt-1.5" 
                      placeholder={lang === 'fr' ? 'Votre réponse...' : 'Your answer...'} 
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 block mb-1">Question de sécurité 3</label>
                    <input 
                      type="text" 
                      value={q3}
                      onChange={(e) => setQ3(e.target.value)}
                      className="w-full bg-[#151624] border border-white/20 rounded-xl text-white px-3.5 py-2 text-xs outline-none" 
                      placeholder="Question 3..." 
                    />
                    <input 
                      type="text" 
                      value={a3}
                      onChange={(e) => setA3(e.target.value)}
                      className="w-full bg-[#151624] border border-white/20 rounded-xl text-white px-3.5 py-2 text-xs outline-none mt-1.5" 
                      placeholder={lang === 'fr' ? 'Votre réponse...' : 'Your answer...'} 
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button"
                    onClick={() => setPinView('main')} 
                    className="flex-1 py-2.5 rounded-full border border-white/20 hover:bg-white/5 text-white text-xs font-semibold uppercase cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button 
                    type="button"
                    onClick={() => { 
                      if (!pinInput || pinInput.length !== 4) {
                        showToast(lang === 'fr' ? 'Veuillez saisir un code PIN à 4 chiffres.' : 'Enter a 4-digit PIN.', 'error');
                        return;
                      }
                      setSavedPin(pinInput);
                      localStorage.setItem('levelmovie_parental_pin', pinInput);
                      localStorage.setItem('levelmovie_parental_q1', q1);
                      localStorage.setItem('levelmovie_parental_a1', a1);
                      localStorage.setItem('levelmovie_parental_q2', q2);
                      localStorage.setItem('levelmovie_parental_a2', a2);
                      localStorage.setItem('levelmovie_parental_q3', q3);
                      localStorage.setItem('levelmovie_parental_a3', a3);
                      setPinView('main'); 
                      showToast(lang === 'fr' ? 'Code PIN et questions enregistrés !' : 'PIN & questions saved!', 'success');
                    }} 
                    className="flex-1 py-2.5 rounded-full bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            )}

            {pinView === 'forgot' && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                <p className="text-xs text-white/60 mb-2">
                  {lang === 'fr' ? 'Répondez à vos 3 questions de sécurité pour déverrouiller le PIN.' : 'Answer your 3 security questions to reset your PIN.'}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-white/70 block mb-1">
                      1. {q1}
                    </label>
                    <input type="text" className="w-full bg-[#151624] border border-white/20 rounded-xl text-white px-3.5 py-2 text-xs outline-none" placeholder="Votre réponse..." />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 block mb-1">
                      2. {q2}
                    </label>
                    <input type="text" className="w-full bg-[#151624] border border-white/20 rounded-xl text-white px-3.5 py-2 text-xs outline-none" placeholder="Votre réponse..." />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 block mb-1">
                      3. {q3}
                    </label>
                    <input type="text" className="w-full bg-[#151624] border border-white/20 rounded-xl text-white px-3.5 py-2 text-xs outline-none" placeholder="Votre réponse..." />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button"
                    onClick={() => setPinView('main')} 
                    className="flex-1 py-2.5 rounded-full border border-white/20 hover:bg-white/5 text-white text-xs font-semibold uppercase cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button 
                    type="button"
                    onClick={() => { 
                      setPinView('main'); 
                      setPinInput('');
                      showToast(lang === 'fr' ? `Votre code PIN est : ${savedPin}` : `Your PIN is: ${savedPin}`, 'success');
                    }} 
                    className="flex-1 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Valider
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                {lang === 'fr' ? 'Mes Données' : 'My Data'}
              </h3>
              <p className="text-xs text-white/50 mt-1">
                {lang === 'fr' ? 'Stockage local, sauvegarde et restauration de vos données' : 'Local storage breakdown, backup and restore'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-white/80">{lang === 'fr' ? 'Cache système & métadonnées' : 'System Cache'}</span>
                  <span className="text-sm font-mono text-white font-bold">14.2 MB</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-white/80">{lang === 'fr' ? 'Données de profil & session' : 'Profile Data'}</span>
                  <span className="text-sm font-mono text-white font-bold">1.8 MB</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-white/80">{lang === 'fr' ? 'Historique & Bibliothèque' : 'History & Library'}</span>
                  <span className="text-sm font-mono text-white font-bold">{((watchedList.length + watchingList.length + pausedList.length) * 0.4 + 1.2).toFixed(1)} MB</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-white/80">{lang === 'fr' ? 'Historique conversations Dona IA' : 'Dona AI History'}</span>
                  <span className="text-sm font-mono text-white font-bold">{(donaHistory.length * 0.3 + 0.5).toFixed(1)} MB</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={exportData}
                  className="flex items-center justify-center gap-2.5 py-3.5 rounded-full bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-[0.99]"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Sauvegarder (JSON)' : 'Backup (JSON)'}</span>
                </button>

                <button 
                  type="button"
                  onClick={() => importFileRef.current?.click()}
                  className="flex items-center justify-center gap-2.5 py-3.5 rounded-full border border-white/20 hover:border-white/50 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer bg-white/5 active:scale-[0.99]"
                >
                  <Upload className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Restaurer (JSON)' : 'Restore (JSON)'}</span>
                </button>
                <input 
                  type="file" 
                  ref={importFileRef} 
                  onChange={handleImportFile} 
                  accept=".json" 
                  className="hidden" 
                />
              </div>

              <button 
                type="button"
                onClick={() => {
                  if (confirm(lang === 'fr' ? 'Nettoyer le cache local temporaire ? (Vos favoris seront préservés)' : 'Clear temporary cache? (Bookmarks preserved)')) {
                    showToast(lang === 'fr' ? 'Cache système nettoyé avec succès !' : 'Cache cleared successfully!', 'success');
                  }
                }}
                className="w-full py-3 rounded-full border border-white/10 hover:border-white/30 text-white/60 hover:text-white text-xs font-bold uppercase transition-colors cursor-pointer text-center"
              >
                {lang === 'fr' ? 'Nettoyer le cache temporaire' : 'Clear Temporary Cache'}
              </button>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                {lang === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
              </h3>
              <p className="text-xs text-white/50 mt-1">
                {lang === 'fr' ? 'Transparence et engagement sur la protection de vos données' : 'Transparency and data privacy commitment'}
              </p>
            </div>
            
            <p className="text-sm text-white/70 leading-relaxed">
              {lang === 'fr' 
                ? 'Nous prenons la protection de vos données très au sérieux. Consultez nos politiques pour comprendre comment vos données sont gérées sur LevelMovie et au sein de l\'écosystème LevelUp.'
                : 'We take data protection very seriously. Check our policies to understand how your data is managed across LevelMovie and the LevelUp Ecosystem.'}
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <a 
                href="#privacy-levelmovie" 
                onClick={(e) => { e.preventDefault(); showToast('Politique LevelMovie affichée', 'info'); }}
                className="py-3.5 px-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-white text-sm font-medium flex justify-between items-center transition-colors cursor-pointer"
              >
                <span>Politique de Confidentialité LevelMovie</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </a>
              <a 
                href="#privacy-levelup" 
                onClick={(e) => { e.preventDefault(); showToast('Politique LevelUp Ecosystem affichée', 'info'); }}
                className="py-3.5 px-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-white text-sm font-medium flex justify-between items-center transition-colors cursor-pointer"
              >
                <span>Politique de Confidentialité LevelUp Ecosystem</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </a>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                À Propos • About Us
              </h3>
              <p className="text-xs text-white/50 mt-1">
                {lang === 'fr' ? 'L\'écosystème LevelUp et la vision de LevelMovie' : 'LevelUp Ecosystem and LevelMovie platform story'}
              </p>
            </div>
            
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4 text-sm text-white/75 leading-relaxed shadow-sm">
              <p>
                <strong className="text-white">LevelMovie</strong> fait partie intégrante de l'écosystème innovant <strong className="text-[#c084fc]">LevelUp</strong>. Notre mission est de fournir la meilleure expérience de streaming participative, gratuite et immersive avec Watch Party synchronisée et intelligence artificielle.
              </p>
              <p>
                Plateforme propulsée par des technologies de pointe : intégration de catalogues dynamiques, lecteurs multi-serveurs avec basculement automatique et assistant vocal intelligent Dona.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[9500] bg-[#0c0d14] text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full h-full flex flex-col sm:flex-row overflow-hidden text-white">
        
        {/* ================= HEADER MOBILE ================= */}
        <div className="sm:hidden px-4 py-4 border-b border-white/10 flex items-center bg-[#0a0b12] shrink-0 min-h-[60px]">
          {mobileActiveTab !== null ? (
            <button
              type="button"
              onClick={() => setMobileActiveTab(null)}
              className="flex items-center gap-2 text-white/80 hover:text-white cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-[#a855f7]" />
              </div>
              <span className="text-base font-bold">{currentTabObj.label}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 text-white/80 hover:text-white cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-[#a855f7]" />
              </div>
              <span className="text-base font-bold">{lang === 'fr' ? 'Paramètres' : 'Settings'}</span>
            </button>
          )}
        </div>

        {/* ================= SIDEBAR (Desktop) / LIST (Mobile) ================= */}
        <div className={`${mobileActiveTab !== null ? 'hidden sm:flex' : 'flex'} flex-col w-full sm:w-64 border-r border-white/10 bg-[#0a0b12] shrink-0 overflow-y-auto`}>
          
          <div className="hidden sm:flex items-center gap-3 px-6 py-5 border-b border-white/10 shrink-0">
            <h2 className="font-black text-base tracking-widest text-white uppercase">
              {lang === 'fr' ? 'Paramètres' : 'Settings'}
            </h2>
          </div>

          <div className="flex-1 p-3 sm:p-3 space-y-1">
            {tabs.map((tab) => {
              const isActive = (mobileActiveTab === tab.id) || (activeTab === tab.id && typeof window !== 'undefined' && window.innerWidth >= 640);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (typeof window !== 'undefined' && window.innerWidth < 640) setMobileActiveTab(tab.id);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#a855f7]/20 text-white font-bold border border-[#a855f7]/40 shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className={`w-4 h-4 ${isActive ? 'text-[#c084fc]' : 'text-white/40'}`} />
                    <span className="text-xs font-semibold">{tab.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50 sm:hidden" />
                </button>
              );
            })}
          </div>

          {/* Logout Button at bottom of sidebar */}
          <div className="p-4 border-t border-white/10 shrink-0 mt-auto">
            <button
              type="button"
              onClick={() => {
                if (user) onOpenLogout();
                else onOpenLogin();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#a855f7]/15 hover:bg-[#a855f7]/25 text-white border border-[#a855f7]/40 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
            >
              {user ? (
                <>
                  <LogOut className="w-4 h-4 text-[#c084fc]" />
                  <span>{lang === 'fr' ? 'Déconnexion' : 'Sign out'}</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-[#c084fc]" />
                  <span>{lang === 'fr' ? 'Connexion' : 'Sign in'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= CONTENT AREA ================= */}
        <div className={`flex-1 overflow-y-auto bg-[#0c0d14] relative ${mobileActiveTab === null ? 'hidden sm:block' : 'block'}`}>
          {/* Close button Desktop */}
          <button 
            type="button"
            onClick={onClose}
            className="hidden sm:flex absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="p-6 sm:p-10 max-w-2xl">
            {renderTabContent(typeof window !== 'undefined' && window.innerWidth < 640 ? mobileActiveTab! : activeTab)}
          </div>
        </div>

      </div>
    </div>
  );
};
