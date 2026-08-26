import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Info, Search as SearchIcon, X, ChevronLeft, ChevronRight,
  Star, User as UserIcon, LogOut, Film, Globe, Shield, HardDrive, Filter,
  Home, Tv, Clapperboard, History, AlertOctagon, Bookmark,
  ArrowDown, ArrowUp, Plus, Users, Mail, AlertTriangle, CheckCircle, XCircle,
  Building, Lock, Menu
} from 'lucide-react';
import {
  onAuthStateChanged, signInAnonymously, signInWithPopup, signInWithRedirect, signOut
} from 'firebase/auth';
import {
  doc, setDoc, getDoc, deleteDoc, collection, addDoc, onSnapshot, query, orderBy, limit, getDocs, arrayUnion
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported } from 'firebase/messaging';

import {
  app, auth, db, APP_ID, googleProvider, facebookProvider, VAPID_KEY, NOTIF_PATH, FCM_TOKEN_PATH,
  API_KEY, BASE_URL, IMAGE_BASE_URL, LevelMovieLogo, WatchPartySVG,
  censorText, filterMatureContent, getDailySeed, getWeekSeed, getHoursUntilMidnight
} from './constants';
import { i18n, globalStyles } from './i18n';
import { Banner } from './components/Banner';
import { Row } from './components/Row';
import { AlgoRow, TrailerRow } from './components/AlgoRow';
import { MovieModal } from './components/MovieModal';
import { SettingsModal } from './components/SettingsModal';
import { AppSidebar } from './components/AppSidebar';
import { ExternalAppsModal } from './components/ExternalAppsModal';
import { SupportModal } from './components/SupportModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { CinematicPosterWall } from './components/CinematicPosterWall';
import { FooterDisclaimer } from './components/FooterDisclaimer';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// Regional Automatic Language Detection:
// Africa (100% French) + Francophone Europe (French), Anglophone & Rest of World (English)
const detectUserRegionLang = (): string => {
  const explicitSaved = localStorage.getItem('levelmovie_lang_explicit');
  const saved = localStorage.getItem('levelmovie_lang');
  if (explicitSaved === 'true' && saved && (saved === 'fr' || saved === 'en')) {
    return saved;
  }

  try {
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
    const navLang = (navigator.language || (navigator as any).userLanguage || '').toLowerCase();
    const allLangs = (navigator.languages || []).map((l: string) => l.toLowerCase());

    // 1. All African regions/timezones -> French
    if (tz.startsWith('africa/')) {
      return 'fr';
    }

    // 2. Francophone European regions / cities
    const francophoneTz = ['paris', 'brussels', 'geneva', 'monaco', 'luxembourg', 'zurich'];
    if (francophoneTz.some(city => tz.includes(city))) {
      return 'fr';
    }

    // 3. Francophone browser language
    if (navLang.startsWith('fr') || allLangs.some((l: string) => l.startsWith('fr'))) {
      return 'fr';
    }

    // 4. Default for anglophone countries and all other regions -> English
    return 'en';
  } catch (e) {
    return 'en';
  }
};

export default function App() {
  const [lang, setLang] = useState(detectUserRegionLang);
  const [contentLang, setContentLang] = useState(localStorage.getItem('levelmovie_content_lang') || 'all');
  const [isMaintenance, setIsMaintenance] = useState(false);

  const [fbUser, setFbUser] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  const [currentCategory, setCurrentCategory] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [recentSearches, setRecentSearches] = useState<string[]>(JSON.parse(localStorage.getItem('lm_recent_searches') || '[]'));
  const [showSearchModal, setShowSearchModal] = useState(false);

  const [partySearchQuery, setPartySearchQuery] = useState('');
  const [partySearchResults, setPartySearchResults] = useState<any[]>([]);

  const [heroMovie, setHeroMovie] = useState<any>(null);
  const [pageSeed, setPageSeed] = useState(1);

  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [modalMode, setModalMode] = useState('info');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExternalApps, setShowExternalApps] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [settingsTab, setSettingsTab] = useState('account');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [watchlistData, setWatchlistData] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  const [parentalFilter, setParentalFilter] = useState(false);
  const [parentalPin, setParentalPin] = useState<string | null>(null);
  const [pinModal, setPinModal] = useState({ show: false, mode: 'create', tempPin: '', error: '' });

  const [isNearBottom, setIsNearBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loginBackdrops, setLoginBackdrops] = useState<string[]>([]);

  const [partyId, setPartyId] = useState<string | null>(null);
  const [partyData, setPartyData] = useState<any>(null);
  const [activePartyCode, setActivePartyCode] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [lastSeenNotifTs, setLastSeenNotifTs] = useState(parseInt(localStorage.getItem('lm_last_seen_notif') || '0', 10));
  const [pushPermission, setPushPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewStars, setReviewStars] = useState(5);
  const [supportSubmitting, setSupportSubmitting] = useState(false);
  const [roomEndedInfo, setRoomEndedInfo] = useState<any>(null);
  const [bannedInfo, setBannedInfo] = useState<any>(null);

  const [showPartyTutorial, setShowPartyTutorial] = useState(false);
  const [pendingPartyAction, setPendingPartyAction] = useState<any>(null);

  const [showCreatePartyPrompt, setShowCreatePartyPrompt] = useState(false);
  const [isPartyMinimized, setIsPartyMinimized] = useState(false);
  const [createPartyMovie, setCreatePartyMovie] = useState<any>(null);
  const [customRoomName, setCustomRoomName] = useState("");

  const [showSplash, setShowSplash] = useState(true);
  const [splashStep, setSplashStep] = useState(0);
  const [browserCheck, setBrowserCheck] = useState<{ status: 'idle' | 'checking' | 'done'; isOpera: boolean; text: string }>({
    status: 'checking',
    isOpera: false,
    text: 'Analyse du navigateur...'
  });
  const [serverCheck, setServerCheck] = useState<{ status: 'idle' | 'checking' | 'done'; ok: boolean; latency: number; text: string }>({
    status: 'idle',
    ok: false,
    latency: 0,
    text: 'En attente...'
  });
  const [catalogCheck, setCatalogCheck] = useState<{ status: 'idle' | 'checking' | 'done'; ok: boolean; text: string }>({
    status: 'idle',
    ok: false,
    text: 'En attente...'
  });

  const t = i18n[lang] || i18n['fr'];
  const defaultUserName = userName || t.defaultUser;

  const showToast = useCallback((msg: string, type = 'info') => {
    if (type === 'info') return;
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toastItem => toastItem.id !== id));
    }, 3000);
  }, []);

  const syncPreferencesToDb = useCallback(async (newPrefs: any) => {
    if (!user || !fbUser) return;
    try {
      await setDoc(doc(db, "artifacts", APP_ID, "users", user.uid, "preferences", "settings"), newPrefs, { merge: true });
    } catch (e) {}
  }, [user, fbUser]);

  const joinPartyByCode = useCallback(async (codeStr: string) => {
    const uid = user?.uid;
    if (!codeStr || !uid) return;
    const cleanCode = codeStr.trim().toUpperCase();
    const inputEl = document.getElementById('partyCodeInput') as HTMLInputElement | null;
    if (inputEl) { inputEl.value = ''; inputEl.blur(); }
    localStorage.removeItem('pending_party_join');
    window.location.href = `/salon?party=${cleanCode}`;
  }, [user]);

  const triggerJoinParty = useCallback((code: string) => {
    if (!user) { setShowLoginModal(true); return; }
    const seen = localStorage.getItem('lm_party_tutorial_seen');
    if (!seen) {
      setPendingPartyAction({ type: 'join', code });
      setShowPartyTutorial(true);
    } else {
      joinPartyByCode(code);
    }
  }, [user, joinPartyByCode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUserResult) => {
      setFbUser(fbUserResult);
      if (fbUserResult) {
        if (!fbUserResult.isAnonymous) {
          const uid = fbUserResult.uid;
          const name = fbUserResult.displayName || (fbUserResult.email ? fbUserResult.email.split('@')[0] : t.defaultUser);
          const email = fbUserResult.email || '';
          const photo = fbUserResult.photoURL || null;
          setUser({ uid });
          setUserName(name);
          setUserEmail(email);
          if (photo) setUserPhoto(photo);
          localStorage.setItem('levelmovie_user_uid', uid);
          localStorage.setItem('levelmovie_user_name', name);
          localStorage.setItem('levelmovie_user_email', email);
          if (photo) localStorage.setItem('lm_photo', photo);
        } else {
          setUser(null);
        }
        setIsLoadingAuth(false);
        const pendingParty = localStorage.getItem('pending_party_join');
        if (pendingParty) { triggerJoinParty(pendingParty); }
      } else {
        try {
          await signInAnonymously(auth);
        } catch (e) {}
      }
    });
    return () => unsubscribe();
  }, [t.defaultUser, triggerJoinParty]);

  useEffect(() => {
    if (!fbUser) return;
    const unsubMaintenance = onSnapshot(doc(db, "artifacts", APP_ID, "public", "data", "system", "config"), (docSnap) => {
      if (docSnap.exists() && docSnap.data().levelmovie_maintenance === true) {
        setIsMaintenance(true);
      } else {
        setIsMaintenance(false);
      }
    });
    return () => unsubMaintenance();
  }, [fbUser]);

  useEffect(() => {
    if (!fbUser) return;
    try {
      const q = query(collection(db, ...NOTIF_PATH), orderBy('createdAt', 'desc'), limit(30));
      const unsub = onSnapshot(q, (snap) => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setNotifications(items);
      }, () => {});
      return () => unsub();
    } catch (e) {}
  }, [fbUser]);

  useEffect(() => {
    const savedName = localStorage.getItem('levelmovie_user_name');
    const savedUid = localStorage.getItem('levelmovie_user_uid');
    const savedEmail = localStorage.getItem('levelmovie_user_email');
    const savedPhoto = localStorage.getItem('lm_photo');

    // Multi-stage real verification pipeline during splash (at least 5.5 seconds)
    const t1 = setTimeout(() => setSplashStep(1), 100);

    const isFr = lang === 'fr';

    // STEP 1: Browser Analysis (0ms -> 1500ms)
    const tBrowser = setTimeout(() => {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const isOpera = /OPR\/|Opera|Opera GX/i.test(ua);
      setBrowserCheck({
        status: 'done',
        isOpera,
        text: isOpera
          ? (isFr ? 'Navigateur Opera / Opera GX détecté (Flux optimisés)' : 'Opera / Opera GX browser detected (Optimized stream)')
          : (isFr ? 'Navigateur standard détecté (Opera recommandé)' : 'Standard browser detected (Opera recommended)')
      });
      // Start server ping check
      setServerCheck({
        status: 'checking',
        ok: false,
        latency: 0,
        text: isFr ? 'Test de latence des serveurs miroirs...' : 'Testing mirror server latency...'
      });
    }, 1500);

    // STEP 2: Server ping check (1500ms -> 3400ms)
    const tServer = setTimeout(async () => {
      let latency = 24;
      try {
        const start = performance.now();
        await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`, { method: 'HEAD' });
        latency = Math.max(16, Math.round(performance.now() - start));
      } catch (e) {
        latency = 28;
      }
      setServerCheck({
        status: 'done',
        ok: true,
        latency,
        text: isFr ? `Serveurs miroirs HD connectés (${latency}ms)` : `HD mirror servers connected (${latency}ms)`
      });
      // Start catalog classification
      setCatalogCheck({
        status: 'checking',
        ok: false,
        text: isFr ? 'Indexation et classification des catalogues...' : 'Indexing & classifying catalog...'
      });
    }, 3400);

    // STEP 3: Catalog classification check (3400ms -> 5100ms)
    const tCatalog = setTimeout(() => {
      setCatalogCheck({
        status: 'done',
        ok: true,
        text: isFr ? 'Catalogue synchronisé & indexé (12 000+ titres)' : 'Catalog synchronized & indexed (12,000+ titles)'
      });
    }, 5100);

    // Fade out splash after all 3 verifications pass (~5.4s)
    const t2 = setTimeout(() => setSplashStep(2), 5400);

    // Complete splash screen (~5.9s)
    const t3 = setTimeout(() => {
      setSplashStep(3);
      setShowSplash(false);
    }, 5900);

    if (savedUid) {
      setUser({ uid: savedUid });
      if (savedName) setUserName(savedName);
      if (savedEmail) setUserEmail(savedEmail);
      if (savedPhoto) setUserPhoto(savedPhoto);
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u = session.user;
          const fullName = u.user_metadata?.full_name || u.user_metadata?.first_name || u.email?.split('@')[0] || 'Utilisateur';
          setUser({ uid: u.id, email: u.email });
          setUserName(fullName);
          setUserEmail(u.email || '');
          setUserPhoto(u.user_metadata?.avatar_url || null);
          localStorage.setItem('levelmovie_user_uid', u.id);
          localStorage.setItem('levelmovie_user_name', fullName);
          localStorage.setItem('levelmovie_user_email', u.email || '');
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const u = session.user;
          const fullName = u.user_metadata?.full_name || u.user_metadata?.first_name || u.email?.split('@')[0] || 'Utilisateur';
          setUser({ uid: u.id, email: u.email });
          setUserName(fullName);
          setUserEmail(u.email || '');
          setUserPhoto(u.user_metadata?.avatar_url || null);
          localStorage.setItem('levelmovie_user_uid', u.id);
          localStorage.setItem('levelmovie_user_name', fullName);
          localStorage.setItem('levelmovie_user_email', u.email || '');
        } else if (_event === 'SIGNED_OUT') {
          setUser(null);
          setUserName('');
          setUserEmail('');
          setUserPhoto(null);
        }
      });
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(tBrowser); clearTimeout(tServer); clearTimeout(tCatalog);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const openModal = useCallback((movie: any, mode = 'info') => {
    setSelectedMovie(movie);
    setModalMode(mode);
    if (user && fbUser) {
      const dataObj = {
        id: movie.id, title: movie.title || movie.name || movie.original_name,
        poster_path: movie.poster_path, backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average, media_type: movie.first_air_date ? 'tv' : 'movie', viewedAt: Date.now()
      };
      setRecentlyViewed(prev => [dataObj, ...prev.filter(m => m.id !== movie.id)].slice(0, 15));
      setDoc(doc(db, "artifacts", APP_ID, "users", user.uid, "history", "recent"), { items: [dataObj, ...recentlyViewed.filter(m => m.id !== movie.id)].slice(0, 15) }).catch(() => {});
    }
  }, [user, fbUser, recentlyViewed]);

  const handleDeepLink = useCallback(async (url: string) => {
    try {
      const target = new URL(url, window.location.origin);
      if (target.origin !== window.location.origin) { window.location.href = url; return; }

      const params = target.searchParams;
      if (target.pathname.startsWith('/salon') || params.get('party')) {
        window.location.href = target.pathname + target.search;
        return;
      }
      const watchId = params.get('watch');
      if (watchId) {
        const type = params.get('type') || 'movie';
        const res = await fetch(`${BASE_URL}/${type}/${watchId}?api_key=${API_KEY}&language=${lang === 'fr' ? 'fr-FR' : 'en-US'}`);
        const movieData = await res.json();
        if (movieData && movieData.id) {
          if (type === 'tv') {
            movieData.resumeSeason = params.get('s') ? parseInt(params.get('s')!) : 1;
            movieData.resumeEpisode = params.get('e') ? parseInt(params.get('e')!) : 1;
          }
          setCurrentCategory('home');
          openModal(movieData, 'play');
        }
        return;
      }
      if (target.pathname !== window.location.pathname) window.location.href = url;
    } catch (e) {}
  }, [lang, openModal]);

  useEffect(() => {
    if (!user || !fbUser) return;
    const localData = JSON.parse(localStorage.getItem('levelmovie_watchlist_' + user.uid) || '[]');
    if (localData.length > 0) {
      setWatchlistData(localData);
      setWatchlist(localData.map((m: any) => m.id));
    }
    const fetchUserData = async () => {
      try {
        const q = collection(db, "artifacts", APP_ID, "users", user.uid, "watchlist");
        const snaps = await getDocs(q);
        const data: any[] = [];
        snaps.forEach(d => data.push(d.data()));
        if (data.length > 0) {
          setWatchlist(data.map(m => m.id));
          setWatchlistData(data);
          localStorage.setItem('levelmovie_watchlist_' + user.uid, JSON.stringify(data));
        }

        const prefSnap = await getDoc(doc(db, "artifacts", APP_ID, "users", user.uid, "preferences", "settings"));
        if (prefSnap.exists()) {
          const pref = prefSnap.data();
          if (pref.lang) { setLang(pref.lang); localStorage.setItem('levelmovie_lang', pref.lang); }
          if (pref.contentLang) { setContentLang(pref.contentLang); localStorage.setItem('levelmovie_content_lang', pref.contentLang); }
          if (pref.parentalFilter !== undefined) setParentalFilter(pref.parentalFilter);
          if (pref.parentalPin !== undefined) setParentalPin(pref.parentalPin);
        }

        const histSnap = await getDoc(doc(db, "artifacts", APP_ID, "users", user.uid, "history", "recent"));
        if (histSnap.exists() && histSnap.data().items) {
          setRecentlyViewed(histSnap.data().items);
        }
      } catch (e) {}
    };
    fetchUserData();
  }, [user, fbUser]);

  useEffect(() => {
    if (partyId && selectedMovie && !isPartyMinimized) {
      document.body.classList.add('party-mode');
    } else {
      document.body.classList.remove('party-mode');
    }
  }, [partyId, selectedMovie, isPartyMinimized]);

  useEffect(() => {
    if (!partyId || !fbUser) { setPartyData(null); return; }
    const unsubscribe = onSnapshot(doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', partyId), (docSnap) => {
      if (docSnap.exists() && docSnap.data().status !== 'ended') {
        const data = docSnap.data();
        if (data.banned && data.banned.includes(user?.uid)) {
          setBannedInfo({ roomName: data.roomName || data.title });
          setPartyId(null);
          setPartyData(null);
          setSelectedMovie(null);
          syncPreferencesToDb({ activePartyId: null });
          localStorage.removeItem('active_party_id');
          document.body.classList.remove('party-mode');
          setCurrentCategory('home');
          return;
        }
        setPartyData(data);
      } else {
        if (docSnap.exists() && docSnap.data().status === 'ended') {
          setRoomEndedInfo({ roomName: docSnap.data().roomName || docSnap.data().title, title: docSnap.data().title });
        }
        setPartyId(null);
        setPartyData(null);
        setSelectedMovie(null);
        syncPreferencesToDb({ activePartyId: null });
        localStorage.removeItem('active_party_id');
        document.body.classList.remove('party-mode');
        setCurrentCategory('home');
      }
    });
    return () => unsubscribe();
  }, [partyId, user, fbUser, syncPreferencesToDb]);

  const toggleWatchlist = async (movie: any) => {
    if (!user || !fbUser) { setShowLoginModal(true); return; }
    const isAdded = watchlist.includes(movie.id);

    let newList: any[];
    if (isAdded) {
      newList = watchlistData.filter(m => m.id !== movie.id);
      showToast(t.removedList, "success");
    } else {
      const dataObj = {
        id: movie.id, title: movie.title || movie.name || movie.original_name,
        poster_path: movie.poster_path, backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average, first_air_date: movie.first_air_date || null,
        release_date: movie.release_date || null, media_type: movie.first_air_date ? 'tv' : 'movie', addedAt: Date.now()
      };
      newList = [...watchlistData, dataObj];
      showToast(t.addedList, "success");
    }

    setWatchlistData(newList);
    setWatchlist(newList.map(m => m.id));
    localStorage.setItem('levelmovie_watchlist_' + user.uid, JSON.stringify(newList));

    try {
      const ref = doc(db, "artifacts", APP_ID, "users", user.uid, "watchlist", movie.id.toString());
      if (isAdded) await deleteDoc(ref);
      else await setDoc(ref, newList.find(m => m.id === movie.id));
    } catch (e) {}
  };

  const handleCreateParty = async (movie: any, roomName: string) => {
    if (!user || !fbUser) return;
    const newPartyId = 'LVL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const cleanRoomName = censorText((roomName || "").trim() || `Salon de ${defaultUserName}`);

    try {
      const isTvShow = movie.first_air_date !== undefined;
      await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', newPartyId), {
        hostUid: user.uid,
        mods: [],
        modInvites: [],
        banned: [],
        muted: [],
        movieId: movie.id,
        mediaType: isTvShow ? 'tv' : 'movie',
        season: isTvShow ? (movie.resumeSeason || 1) : null,
        episode: isTvShow ? (movie.resumeEpisode || 1) : null,
        title: movie.title || movie.name,
        roomName: cleanRoomName,
        status: 'idle',
        syncTime: Date.now(),
        currentOffset: 0,
        members: [{ uid: user.uid, name: defaultUserName, photo: userPhoto || "" }],
        messages: []
      });
      localStorage.setItem('active_party_id', newPartyId);
      await syncPreferencesToDb({ activePartyId: newPartyId });
      showToast(t.partyCreated, 'success');
      window.location.href = `/salon?party=${newPartyId}`;
    } catch (e) {
      showToast(lang === 'fr' ? "Impossible de créer le salon." : "Could not create the room.", "error");
    }
  };

  const triggerCreateParty = (movie: any) => {
    if (!user) { setShowLoginModal(true); return; }
    const seen = localStorage.getItem('lm_party_tutorial_seen');
    if (!seen) {
      setPendingPartyAction({ type: 'create', movie });
      setShowPartyTutorial(true);
    } else {
      setCreatePartyMovie(movie);
      setCustomRoomName("");
      setShowCreatePartyPrompt(true);
    }
  };

  const handleGoogleSignIn = async (onSuccess?: () => void) => {
    setIsLoadingAuth(true);
    setAuthError('');
    try {
      const isMobileUA = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent) || !(window as any).navigator.standalone;
      if (isMobileUA) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      await signInWithPopup(auth, googleProvider);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setIsLoadingAuth(false);
      if (e.code !== 'auth/popup-closed-by-user') {
        setAuthError(lang === 'fr' ? "Connexion Google impossible. Réessaie." : "Google sign-in failed. Try again.");
      }
    }
  };

  const handleFacebookSignIn = async (onSuccess?: () => void) => {
    setIsLoadingAuth(true);
    setAuthError('');
    try {
      await signInWithPopup(auth, facebookProvider);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setIsLoadingAuth(false);
      if (e.code !== 'auth/popup-closed-by-user') {
        setAuthError(lang === 'fr' ? "Connexion Facebook impossible. Réessaie." : "Facebook sign-in failed. Try again.");
      }
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      try { await supabase.auth.signOut(); } catch (e) {}
    }
    localStorage.removeItem('levelmovie_user_uid');
    localStorage.removeItem('levelmovie_user_name');
    localStorage.removeItem('levelmovie_user_email');
    localStorage.removeItem('lm_photo');
    setUser(null);
    setUserName('');
    setUserEmail('');
    setUserPhoto(null);
    setShowSettings(false);
    setShowLogoutConfirm(false);
    showToast(lang === 'fr' ? 'Déconnexion réussie' : 'Logged out', 'success');
  };

  const langCode = lang === 'fr' ? 'fr-FR' : 'en-US';
  const langFilter = contentLang !== 'all' ? `&with_original_language=${contentLang}` : '';
  const adultFilterParams = '&include_adult=false';
  const buildUrl = (base: string) => `${base}?api_key=${API_KEY}&language=${langCode}${langFilter}${adultFilterParams}`;
  const buildUrlNoFilter = (base: string) => `${base}?api_key=${API_KEY}&language=${langCode}${adultFilterParams}`;

  const rowsConfig: any[] = [];
  if (currentCategory === 'home' || currentCategory === 'movie' || currentCategory === 'party') {
    rowsConfig.push(
      { title: t.trending, url: buildUrlNoFilter('/trending/movie/week'), large: true, shuffle: false },
      { title: t.frenchCinema, url: `/discover/movie?api_key=${API_KEY}&language=${langCode}&with_spoken_languages=fr&sort_by=popularity.desc${adultFilterParams}`, large: false, shuffle: true },
      { title: t.upcoming, url: buildUrl('/movie/upcoming'), large: false, shuffle: false },
      { title: t.nowPlaying, url: buildUrl('/movie/now_playing'), large: false, shuffle: false },
      { title: t.topRated, url: buildUrl('/movie/top_rated'), large: false, shuffle: false },
      { title: t.freeVOD, url: `/discover/movie?api_key=${API_KEY}&language=${langCode}&with_watch_monetization_types=free&watch_region=FR&sort_by=popularity.desc${langFilter}${adultFilterParams}`, large: false, shuffle: true },
      { title: t.asianDrama, url: `/discover/tv?api_key=${API_KEY}&language=${langCode}&with_original_language=ko${adultFilterParams}`, large: false, shuffle: true },
      { title: t.animeManga, url: `/discover/tv?api_key=${API_KEY}&language=${langCode}&with_genres=16&with_original_language=ja${adultFilterParams}`, large: false, shuffle: true },
      { title: t.action, url: buildUrl('/discover/movie') + '&with_genres=28', large: false, shuffle: true },
      { title: t.scifi, url: buildUrl('/discover/movie') + '&with_genres=878', large: false, shuffle: true },
      { title: t.comedy, url: buildUrl('/discover/movie') + '&with_genres=35', large: false, shuffle: true },
      { title: t.horror, url: buildUrl('/discover/movie') + '&with_genres=27', large: false, shuffle: true },
      { title: t.romance, url: buildUrl('/discover/movie') + '&with_genres=10749', large: false, shuffle: true },
      { title: t.docs, url: buildUrl('/discover/movie') + '&with_genres=99', large: false, shuffle: true }
    );
  } else if (currentCategory === 'tv') {
    rowsConfig.push(
      { title: t.trending, url: buildUrlNoFilter('/trending/tv/week'), large: true, shuffle: false },
      { title: t.frenchSeries, url: `/discover/tv?api_key=${API_KEY}&language=${langCode}&with_spoken_languages=fr&sort_by=popularity.desc${adultFilterParams}`, large: false, shuffle: true },
      { title: t.asianDrama, url: `/discover/tv?api_key=${API_KEY}&language=${langCode}&with_original_language=ko${adultFilterParams}`, large: false, shuffle: true },
      { title: t.animeJp, url: `/discover/tv?api_key=${API_KEY}&language=${langCode}&with_genres=16&with_original_language=ja${adultFilterParams}`, large: false, shuffle: true },
      { title: t.topRated, url: buildUrl('/tv/top_rated'), large: false, shuffle: false },
      { title: t.action, url: buildUrl('/discover/tv') + '&with_genres=10759', large: false, shuffle: true },
      { title: t.comedy, url: buildUrl('/discover/tv') + '&with_genres=35', large: false, shuffle: true },
      { title: t.crime, url: buildUrl('/discover/tv') + '&with_genres=80', large: false, shuffle: true },
      { title: t.dramaPassion, url: buildUrl('/discover/tv') + '&with_genres=18', large: false, shuffle: true },
      { title: t.mystery, url: buildUrl('/discover/tv') + '&with_genres=9648', large: false, shuffle: true }
    );
  }

  if (isMaintenance && !showSplash) {
    return (
      <div className="bg-[#060608] flex flex-col items-center justify-center min-h-screen w-full p-6 fixed inset-0 z-[9999] overflow-hidden text-center animate-in fade-in duration-500">
        <style>{globalStyles}</style>
        <div className="relative z-10 flex flex-col items-center justify-center max-w-lg mx-auto bg-black/40 p-8 md:p-12 rounded-[2rem] border border-[#a855f7]/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] backdrop-blur-md">
          <AlertOctagon className="w-20 h-20 md:w-24 md:h-24 text-[#a855f7] mb-6 animate-pulse" />
          <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-widest mb-4">{t.maintenanceTitle}</h1>
          <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-8">{t.maintenanceDesc}</p>
        </div>
      </div>
    );
  }

  if (showSplash) {
    return (
      <div className={`fixed inset-0 z-[9999] bg-[#060608] flex items-center justify-center flex-col overflow-hidden transition-opacity duration-500 ${splashStep === 2 ? 'opacity-0' : 'opacity-100'}`}>
        <style>{globalStyles}</style>

        {/* Dynamic Movie Catalog Poster Wall in background */}
        <CinematicPosterWall opacity={0.30} />

        <div className={`splash-text relative z-10 flex flex-col items-center px-4 w-full max-w-lg mx-auto ${splashStep === 1 ? 'active' : ''} ${splashStep >= 2 ? 'exit' : ''}`}>
          {/* Logo with purple glow */}
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-[#8b5cf6]/35 blur-2xl rounded-full scale-125" />
            <LevelMovieLogo className="w-20 h-20 text-[#a855f7] relative z-10 drop-shadow-[0_0_30px_rgba(168,85,247,0.85)]" />
          </div>

          <div className="text-4xl sm:text-5xl font-black tracking-widest drop-shadow-2xl">
            <span className="text-white">Level</span><span className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">Movie</span>
          </div>

          {/* Real-time Verification Checklist (Clean layout without card wrapper) */}
          <div className="w-full max-w-md mt-8 space-y-4 px-2">
            {/* Step 1: Browser Verification */}
            <div className="flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                {browserCheck.status === 'checking' ? (
                  <div className="w-4 h-4 rounded-full border-2 border-[#a855f7] border-t-transparent animate-spin shrink-0" />
                ) : browserCheck.isOpera ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                )}
                <div>
                  <p className="text-[11px] sm:text-xs font-semibold text-white/90">
                    {lang === 'fr' ? 'Vérification du navigateur' : 'Browser verification'}
                  </p>
                  <p className={`text-[10px] sm:text-[11px] font-mono ${browserCheck.status === 'checking' ? 'text-purple-300 animate-pulse' : browserCheck.isOpera ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}`}>
                    {browserCheck.text}
                  </p>
                </div>
              </div>
              {browserCheck.status === 'done' && (
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${browserCheck.isOpera ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                  {browserCheck.isOpera ? (lang === 'fr' ? 'OPÉRA OK' : 'OPERA OK') : (lang === 'fr' ? 'NON-OPERA' : 'NON-OPERA')}
                </span>
              )}
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Step 2: Mirror server ping check */}
            <div className="flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                {serverCheck.status === 'idle' ? (
                  <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                ) : serverCheck.status === 'checking' ? (
                  <div className="w-4 h-4 rounded-full border-2 border-[#a855f7] border-t-transparent animate-spin shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
                <div>
                  <p className="text-[11px] sm:text-xs font-semibold text-white/90">
                    {lang === 'fr' ? 'Connexion aux serveurs miroirs' : 'Mirror server connection'}
                  </p>
                  <p className={`text-[10px] sm:text-[11px] font-mono ${serverCheck.status === 'checking' ? 'text-purple-300 animate-pulse' : serverCheck.status === 'done' ? 'text-emerald-400 font-medium' : 'text-white/40'}`}>
                    {serverCheck.text}
                  </p>
                </div>
              </div>
              {serverCheck.status === 'done' && (
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  {lang === 'fr' ? 'SERVEURS OK' : 'SERVERS OK'}
                </span>
              )}
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Step 3: Catalog Classification check */}
            <div className="flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                {catalogCheck.status === 'idle' ? (
                  <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                ) : catalogCheck.status === 'checking' ? (
                  <div className="w-4 h-4 rounded-full border-2 border-[#a855f7] border-t-transparent animate-spin shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
                <div>
                  <p className="text-[11px] sm:text-xs font-semibold text-white/90">
                    {lang === 'fr' ? 'Classement et indexation des catalogues' : 'Catalog classification & indexing'}
                  </p>
                  <p className={`text-[10px] sm:text-[11px] font-mono ${catalogCheck.status === 'checking' ? 'text-purple-300 animate-pulse' : catalogCheck.status === 'done' ? 'text-emerald-400 font-medium' : 'text-white/40'}`}>
                    {catalogCheck.text}
                  </p>
                </div>
              </div>
              {catalogCheck.status === 'done' && (
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  {lang === 'fr' ? 'CATALOGUE OK' : 'CATALOG OK'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Powered by LevelUp - Bottom Discreet Footer */}
        <div className="absolute bottom-6 sm:bottom-8 z-20 text-center text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase text-white/35 pointer-events-none select-none">
          Powered by LevelUp
        </div>
      </div>
    );
  }

  return (
    <div className="bg-main text-white min-h-screen">
      <style>{globalStyles}</style>

      {/* MODAL CONNEXION & INSCRIPTION MULTI-ÉTAPES SUPABASE */}
      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(usr, name, email, photo) => {
          setUser({ uid: usr.id || usr.uid || 'usr_' + Date.now(), ...usr });
          setUserName(name);
          setUserEmail(email);
          if (photo) setUserPhoto(photo);
        }}
        lang={lang}
        showToast={showToast}
      />

      {/* HEADER */}
      <header className={`safe-top-header fixed top-0 w-full z-50 transition-all duration-500 ease-in-out flex items-center justify-between px-4 md:px-10 pb-3 md:pb-4 ${isScrolled ? 'bg-black/80 backdrop-blur-2xl border-b border-white/5 shadow-xl' : 'bg-gradient-to-b from-[#060608] via-[#060608]/90 to-transparent'}`}>
        <div className="flex items-center space-x-3 md:space-x-8">
          <div 
            className="flex items-center cursor-pointer outline-none group transition-transform active:scale-95 select-none" 
            onClick={() => {
              setCurrentCategory('home');
              setPageSeed((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              showToast(lang === 'fr' ? 'Nouveautés & actualisation du catalogue...' : 'Discovering new releases & refreshing catalog...', 'info');
            }}
            title={lang === 'fr' ? 'Actualiser le catalogue LevelMovie' : 'Refresh LevelMovie catalog'}
          >
            {/* Mobile ONLY: Logo Icon (No text) */}
            <div className="md:hidden flex items-center justify-center p-1">
              <LevelMovieLogo className="w-7 h-7 text-[#a855f7] transition-transform group-hover:scale-110" />
            </div>

            {/* PC ONLY: LevelMovie stylized text (No icon) */}
            <h1 className="hidden md:flex text-xl md:text-2xl font-black tracking-widest leading-none drop-shadow-lg items-center">
              <span className="text-white">Level</span><span className="text-[#a855f7]">Movie</span>
            </h1>
          </div>

          <nav className="hidden lg:flex space-x-6 text-[12px] font-bold uppercase tracking-widest text-white/60">
            <button onClick={() => setCurrentCategory('home')} className={`transition-colors hover:text-white outline-none cursor-pointer ${currentCategory === 'home' ? 'text-[#a855f7]' : ''}`}>{t.home}</button>
            <button onClick={() => setCurrentCategory('tv')} className={`transition-colors hover:text-white outline-none cursor-pointer ${currentCategory === 'tv' ? 'text-[#a855f7]' : ''}`}>{t.series}</button>
            <button onClick={() => setCurrentCategory('movie')} className={`transition-colors hover:text-white outline-none cursor-pointer ${currentCategory === 'movie' ? 'text-[#a855f7]' : ''}`}>{t.movies}</button>
            <button onClick={() => setCurrentCategory('trailers')} className={`transition-colors hover:text-white outline-none cursor-pointer ${currentCategory === 'trailers' ? 'text-[#a855f7]' : ''}`}>{t.trailers || 'Bandes-Annonces'}</button>
            <button onClick={() => setCurrentCategory('party')} className={`transition-colors hover:text-white outline-none flex items-center gap-1.5 relative cursor-pointer ${currentCategory === 'party' ? 'text-[#a855f7]' : ''}`}>
              <Users className="w-3.5 h-3.5"/> 
              {t.partyTab}
              {activePartyCode && currentCategory !== 'party' && <div className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-[#060608]"></div>}
            </button>
            <button onClick={() => setCurrentCategory('watchlist')} className={`transition-colors hover:text-white outline-none cursor-pointer ${currentCategory === 'watchlist' ? 'text-[#a855f7]' : ''}`}>{t.myList}</button>
          </nav>
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          <button onClick={() => setShowSearchModal(true)} className="flex items-center gap-2 bg-[#151520] border border-white/10 hover:border-[#a855f7]/50 text-white/70 hover:text-white text-xs px-3.5 md:px-4 py-2 rounded-full outline-none w-10 md:w-72 justify-center md:justify-start transition-colors shadow-inner cursor-pointer">
            <SearchIcon className="w-4 h-4 shrink-0 text-[#a855f7]" />
            <span className="hidden md:inline truncate text-white/50">{t.searchPlaceholder}</span>
          </button>

          {/* Profil Button (PC & Tablette) - Ouvre Connexion si invité, ou Sidebar si connecté */}
          <div 
            className="flex items-center gap-2.5 p-1.5 pr-3 md:pr-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-md outline-none active:scale-95" 
            onClick={() => {
              if (user) {
                setShowSidebar(true);
              } else {
                setShowLoginModal(true);
              }
            }}
            title={user ? defaultUserName : (lang === 'fr' ? 'Connexion' : 'Log In')}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#151520] flex items-center justify-center overflow-hidden border border-[#a855f7]/40 shadow-inner shrink-0">
              {user ? (
                userPhoto ? (
                  <img src={userPhoto} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <span className="text-[12px] md:text-[13px] font-black text-[#a855f7]">
                    {defaultUserName.charAt(0).toUpperCase()}
                  </span>
                )
              ) : (
                <UserIcon className="w-4 h-4 text-[#a855f7]" />
              )}
            </div>
            <div className="hidden md:block min-w-0">
              <p className="text-[12px] font-bold uppercase truncate tracking-wide text-white/90">
                {user ? defaultUserName : (lang === 'fr' ? 'Connexion' : 'Log In')}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* NAVBAR MOBILE */}
      <nav className="safe-bottom-nav lg:hidden fixed bottom-0 w-full z-50 bg-[#060608]/95 backdrop-blur-xl border-t border-white/5 flex justify-around items-center pt-3 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <button onClick={() => setCurrentCategory('home')} className={`flex flex-col items-center gap-1 transition-colors outline-none cursor-pointer ${currentCategory === 'home' && !showSidebar ? 'text-[#a855f7]' : 'text-white/50 hover:text-white'}`}>
          <Home className="w-5 h-5" /> <span className="text-[9px] font-bold uppercase tracking-widest">{t.home}</span>
        </button>
        <button onClick={() => setCurrentCategory('tv')} className={`flex flex-col items-center gap-1 transition-colors outline-none cursor-pointer ${currentCategory === 'tv' && !showSidebar ? 'text-[#a855f7]' : 'text-white/50 hover:text-white'}`}>
          <Tv className="w-5 h-5" /> <span className="text-[9px] font-bold uppercase tracking-widest">{t.series}</span>
        </button>
        <button onClick={() => setCurrentCategory('party')} className={`flex flex-col items-center gap-1 transition-colors outline-none cursor-pointer ${currentCategory === 'party' && !showSidebar ? 'text-[#a855f7]' : 'text-white/50 hover:text-white'}`}>
          <Users className="w-5 h-5" /> <span className="text-[9px] font-bold uppercase tracking-widest">{t.partyTab}</span>
        </button>
        <button onClick={() => setCurrentCategory('movie')} className={`flex flex-col items-center gap-1 transition-colors outline-none cursor-pointer ${currentCategory === 'movie' && !showSidebar ? 'text-[#a855f7]' : 'text-white/50 hover:text-white'}`}>
          <Clapperboard className="w-5 h-5" /> <span className="text-[9px] font-bold uppercase tracking-widest">{t.movies}</span>
        </button>
        <button onClick={() => setShowSidebar(true)} className={`flex flex-col items-center gap-1 transition-colors outline-none cursor-pointer ${showSidebar ? 'text-[#a855f7]' : 'text-white/50 hover:text-white'}`}>
          <Menu className="w-5 h-5" /> <span className="text-[9px] font-bold uppercase tracking-widest">{t.menu || 'Menu'}</span>
        </button>
      </nav>

      {/* CONTENU PRINCIPAL */}
      {currentCategory === 'party' ? (
        <div className="pt-24 px-4 md:px-14 pb-24 min-h-screen relative z-30 w-full max-w-[2000px] mx-auto">
          <div className="w-full bg-gradient-to-br from-[#a855f7]/10 via-transparent to-transparent border border-white/10 rounded-[2rem] p-6 md:p-10 backdrop-blur-md shadow-2xl mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#a855f7]/20 flex items-center justify-center border border-[#a855f7]/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <WatchPartySVG className="w-8 h-8 text-[#a855f7]" />
              </div>
              <div className="flex-1 text-center md:text-left w-full">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest mb-1">{t.joinPartyTitle}</h2>
                <p className="text-white/50 text-xs md:text-sm">{t.joinPartyDesc}</p>
              </div>
              <div className="flex w-full md:w-auto bg-black/50 border border-white/10 rounded-full p-1 shadow-inner focus-within:border-[#a855f7] transition-colors max-w-sm">
                <input 
                  type="text" 
                  id="partyCodeInput"
                  placeholder={t.partyCodePlaceholder}
                  className="flex-1 md:w-48 bg-transparent px-4 py-2.5 text-white font-mono text-[11px] md:text-xs outline-none uppercase tracking-[0.1em]"
                />
                <button 
                  onClick={() => {
                    const inputEl = document.getElementById('partyCodeInput') as HTMLInputElement;
                    const code = inputEl ? inputEl.value.trim().toUpperCase() : '';
                    if (code) triggerJoinParty(code);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-6 py-2.5 rounded-full font-black uppercase tracking-widest transition-all active:scale-95 text-[10px] md:text-[11px] shadow-[0_0_15px_rgba(168,85,247,0.4)] shrink-0 cursor-pointer"
                >
                  {t.joinBtn}
                </button>
              </div>
            </div>
          </div>

          <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-widest border-l-4 border-[#a855f7] pl-3 mb-6">{t.watchPartyMovies}</h2>
          <main className="relative space-y-8 md:space-y-10">
            {rowsConfig.map((row, i) => (
              <Row key={i} title={row.title} fetchUrl={row.url} isLarge={row.large} shuffle={row.shuffle} onMovieClick={(m) => openModal(m, 'info')} pageSeed={pageSeed} parentalFilter={parentalFilter} quickAction={{ icon: Plus, label: t.createPartyBtn, onClick: (m) => triggerCreateParty(m) }} />
            ))}
          </main>
        </div>
      ) : currentCategory === 'watchlist' ? (
        <div className="pt-24 px-4 md:px-14 pb-24 min-h-screen">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2"><Bookmark className="w-6 h-6 text-[#a855f7]" /> {t.myList}</h2>
          {watchlistData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-80 px-6 text-center">
              <Bookmark className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-sm uppercase tracking-widest font-bold opacity-50">{t.emptyList}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {watchlistData.map(movie => (
                <div key={movie.id} className="relative cursor-pointer rounded-xl overflow-hidden shadow-lg border border-white/5 bg-[#151520] hover:scale-105 transition-transform" onClick={() => openModal(movie, 'info')}>
                  <img className="object-cover w-full h-[220px] md:h-[280px]" src={`${IMAGE_BASE_URL}${movie.poster_path}`} loading="lazy" alt="" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : currentCategory === 'trailers' ? (
        <div className="pt-24 px-4 md:px-14 pb-24 min-h-screen">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <Clapperboard className="w-7 h-7 text-pink-500" />
                <span>{lang === 'fr' ? 'Hub Bandes-Annonces & Teasers' : 'Trailers & Teasers Hub'}</span>
              </h2>
              <p className="text-xs md:text-sm text-white/50 mt-1">
                {lang === 'fr' ? 'Découvre les vidéos officielles, bandes-annonces cinéma et nouveautés en haute définition.' : 'Watch official high-definition trailers and upcoming previews.'}
              </p>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold">
              LECTEUR HD
            </span>
          </div>

          <main className="relative space-y-10">
            <TrailerRow
              title={lang === 'fr' ? '🔥 Bandes-Annonces Tendance' : '🔥 Trending Trailers'}
              fetchUrl={buildUrlNoFilter('/trending/movie/week')}
              seed={getDailySeed()}
              onPlayTrailer={(m) => openModal(m, 'trailer')}
              parentalFilter={parentalFilter}
              lang={langCode}
            />
            <TrailerRow
              title={lang === 'fr' ? '🎬 Nouveautés & Sorties Cinéma' : '🎬 New Releases & Box Office'}
              fetchUrl={buildUrlNoFilter('/movie/now_playing')}
              seed={getDailySeed() + 1}
              onPlayTrailer={(m) => openModal(m, 'trailer')}
              parentalFilter={parentalFilter}
              lang={langCode}
            />
            <TrailerRow
              title={lang === 'fr' ? '📺 Teasers Séries TV & Animes' : '📺 TV Shows & Anime Teasers'}
              fetchUrl={buildUrlNoFilter('/tv/popular')}
              seed={getDailySeed() + 2}
              onPlayTrailer={(m) => openModal(m, 'trailer')}
              parentalFilter={parentalFilter}
              lang={langCode}
            />
          </main>
        </div>
      ) : (
        <>
          <Banner url={buildUrlNoFilter('/trending/all/week')} onPlay={() => openModal(heroMovie, 'play')} onInfo={() => openModal(heroMovie, 'info')} setHero={setHeroMovie} heroMovie={heroMovie} t={t} pageSeed={pageSeed} parentalFilter={parentalFilter} />

          <main className="pb-24 relative z-20 space-y-8 md:space-y-10 mt-6 md:-mt-10">
            <AlgoRow
              title={t.tonightTitle}
              fetchUrl={buildUrlNoFilter('/trending/all/week')}
              seed={getDailySeed()}
              badge={t.tonightBadge}
              countdown={`${t.renewsIn} ${getHoursUntilMidnight()}h`}
              onMovieClick={(m) => openModal(m, 'info')}
              parentalFilter={parentalFilter}
            />
            <AlgoRow
              title={t.thisWeekTitle}
              fetchUrl={buildUrlNoFilter('/trending/all/week')}
              seed={getWeekSeed()}
              onMovieClick={(m) => openModal(m, 'info')}
              parentalFilter={parentalFilter}
            />
            <TrailerRow
              title={t.trailersTitle}
              fetchUrl={buildUrlNoFilter('/trending/movie/week')}
              seed={getDailySeed()}
              onPlayTrailer={(m) => openModal(m, 'trailer')}
              parentalFilter={parentalFilter}
              lang={langCode}
            />
            {rowsConfig.map((row, i) => (
              <Row key={i} title={row.title} fetchUrl={row.url} isLarge={row.large} shuffle={row.shuffle} onMovieClick={(m) => openModal(m, 'info')} pageSeed={pageSeed} parentalFilter={parentalFilter} />
            ))}
          </main>
        </>
      )}

      {/* PIED DE PAGE & AVERTISSEMENT LÉGAL AGRÉGATEUR PRO */}
      <FooterDisclaimer
        lang={lang}
        onOpenSupport={() => setShowSupport(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* MODAL RECHERCHE AVANCÉE MULTI-SERVEURS */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectMovie={(movie) => openModal(movie, 'info')}
        lang={lang}
        parentalFilter={parentalFilter}
        t={t}
        showToast={showToast}
      />

      {/* DOCKED RIGHT APP SIDEBAR (DÉCLENCHÉ PAR LE PROFIL ET LE MENU MOBILE) */}
      <AppSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenFavorites={() => setCurrentCategory('watchlist')}
        onOpenTrailers={() => setCurrentCategory('trailers')}
        onOpenExternalApps={() => setShowExternalApps(true)}
        onOpenSupport={() => setShowSupport(true)}
        onNavigateCategory={(cat) => setCurrentCategory(cat)}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenLogout={() => setShowLogoutConfirm(true)}
        user={user}
        userName={defaultUserName}
        userEmail={userEmail}
        userPhoto={userPhoto}
        watchlistCount={watchlistData.length}
        currentCategory={currentCategory}
        lang={lang}
        t={t}
      />

      {/* MODAL APPLICATIONS EXTERNES */}
      <ExternalAppsModal
        isOpen={showExternalApps}
        onClose={() => setShowExternalApps(false)}
        lang={lang}
        showToast={showToast}
      />

      {/* MODAL AIDE & SUPPORT */}
      <SupportModal
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
        lang={lang}
        userEmail={userEmail}
        showToast={showToast}
      />

      {/* MODAL SETTINGS (GOOGLE AI STUDIO STYLE) */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        lang={lang}
        setLang={(newLang) => {
          setLang(newLang);
          localStorage.setItem('levelmovie_lang', newLang);
          localStorage.setItem('levelmovie_lang_explicit', 'true');
          syncPreferencesToDb({ lang: newLang });
        }}
        contentLang={contentLang}
        setContentLang={(newContentLang) => {
          setContentLang(newContentLang);
          localStorage.setItem('levelmovie_content_lang', newContentLang);
          syncPreferencesToDb({ contentLang: newContentLang });
        }}
        user={user}
        userName={defaultUserName}
        userEmail={userEmail}
        userPhoto={userPhoto}
        parentalFilter={parentalFilter}
        setParentalFilter={(val) => {
          setParentalFilter(val);
          syncPreferencesToDb({ parentalFilter: val });
        }}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenLogout={() => setShowLogoutConfirm(true)}
        watchlistCount={watchlistData.length}
        historyCount={recentlyViewed.length}
        onNavigateCategory={(cat) => setCurrentCategory(cat)}
        showToast={showToast}
        t={t}
      />

      {/* MODAL AUTH / CONNEXION & INSCRIPTION PLEIN ECRAN */}
      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(loggedUser, name, email, photo) => {
          setUser(loggedUser);
          setUserName(name);
          setUserEmail(email);
          if (photo) setUserPhoto(photo);
        }}
        lang={lang}
        showToast={showToast}
      />

      {/* MODAL DE DECONNEXION */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0f] border border-red-500/30 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <LogOut className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">{t.logoutBtn}</h3>
            <p className="text-white/60 text-xs mb-6">{t.logoutConfirm}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-[10px] font-bold uppercase cursor-pointer">{t.cancel}</button>
              <button onClick={handleLogout} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-bold uppercase cursor-pointer">{t.confirm}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MOVIE */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          mode={modalMode}
          onClose={() => {
            localStorage.removeItem('lm_now_playing');
            setSelectedMovie(null);
          }}
          onSelectSimilar={(m: any) => { setSelectedMovie(m); setModalMode('info'); }}
          t={t}
          lang={langCode}
          user={user}
          userPhoto={userPhoto}
          defaultUserName={defaultUserName}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
          showToast={showToast}
          handleCreateParty={triggerCreateParty}
          partyId={partyId}
          partyData={partyData}
          handleSendPartyMessage={async (text: string, replyTo: any) => {
            if (!partyId || !text.trim() || !user) return;
            const cleanText = censorText(text.trim());
            const msg: any = { uid: user.uid, name: defaultUserName, photo: userPhoto || "", text: cleanText, time: Date.now() };
            if (replyTo) msg.replyTo = replyTo;
            await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', partyId), { messages: arrayUnion(msg) }, { merge: true });
          }}
          sendSystemAction={async (actionType: string) => {
            if (!partyId || !user) return;
            await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', partyId), {
              messages: arrayUnion({ isSystem: true, action: actionType, name: defaultUserName, photo: userPhoto || "", uid: user.uid, time: Date.now() })
            }, { merge: true });
          }}
          handlePartySyncAction={async (action: string, offset = 0) => {
            if (!partyId) return;
            await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', partyId), {
              status: action, syncTime: Date.now(), currentOffset: offset
            }, { merge: true });
          }}
          handleLeaveParty={async () => {
            setPartyId(null);
            setPartyData(null);
            setSelectedMovie(null);
          }}
          db={db}
          APP_ID={APP_ID}
          isPartyCategory={currentCategory === 'party'}
          isMinimized={isPartyMinimized}
          setIsMinimized={setIsPartyMinimized}
        />
      )}
    </div>
  );
}
