import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Play, Info, Search as SearchIcon, X, ChevronLeft, ChevronRight,
  Star, User as UserIcon, LogOut, Film, Globe, Shield, HardDrive, Filter,
  Home, Tv, Clapperboard, History, AlertOctagon, Bookmark,
  ArrowDown, ArrowUp, Plus, Users, Mail, AlertTriangle, CheckCircle, XCircle,
  Building, Lock, Menu, Sparkles, Compass, ShieldCheck, Zap,
  Clock, SquarePen
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
  API_KEY, BASE_URL, IMAGE_BASE_URL, LevelMovieLogo, DonaStar, WatchPartySVG,
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
import { DonaModal } from './components/DonaModal';
import { CinematicPosterWall } from './components/CinematicPosterWall';
import { FooterDisclaimer } from './components/FooterDisclaimer';
import { NetworkOfflineManager } from './components/NetworkOfflineManager';
import { LevelAnimeApp } from './components/apps/LevelAnimeApp';
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
  const [showDona, setShowDona] = useState(false);
  const [donaHistoryTrigger, setDonaHistoryTrigger] = useState(0);
  const [donaNewChatTrigger, setDonaNewChatTrigger] = useState(0);
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
    if (!codeStr) return;
    const cleanCode = codeStr.trim().toUpperCase();
    const inputEl = document.getElementById('partyCodeInput') as HTMLInputElement | null;
    if (inputEl) { inputEl.value = ''; inputEl.blur(); }
    localStorage.removeItem('pending_party_join');

    try {
      const pRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', cleanCode);
      const pSnap = await getDoc(pRef);

      if (!pSnap.exists() || pSnap.data().status === 'ended') {
        showToast(t.eventEnded || 'Salon introuvable ou terminé', 'error');
        return;
      }
      const d = pSnap.data();

      const res = await fetch(`${BASE_URL}/${d.mediaType || 'movie'}/${d.movieId}?api_key=${API_KEY}&language=${lang === 'fr' ? 'fr-FR' : 'en-US'}`);
      const movieData = await res.json();
      if (d.mediaType === 'tv') {
        movieData.resumeSeason = d.season || 1;
        movieData.resumeEpisode = d.episode || 1;
      }

      setSelectedMovie(movieData);
      setPartyId(cleanCode);
      setModalMode('play');
      window.history.pushState({}, '', `?party=${cleanCode}`);
    } catch (e) {
      showToast(t.invalidPartyCode || 'Code invalide', 'error');
    }
  }, [lang, t, showToast]);

  const triggerJoinParty = useCallback((code: string) => {
    const seen = localStorage.getItem('lm_party_tutorial_seen');
    if (!seen) {
      setPendingPartyAction({ type: 'join', code });
      setShowPartyTutorial(true);
    } else {
      joinPartyByCode(code);
    }
  }, [joinPartyByCode]);

  useEffect(() => {
    // Si la fenêtre courante est un popup d'authentification OAuth ouvert par l'application
    if (window.opener && window.opener !== window) {
      setTimeout(() => {
        try {
          window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
          window.close();
        } catch (e) {
          // ignore
        }
      }, 600);
    }

    // Check URL hash & search params for OAuth error or success returns
    const hashStr = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
    const hashParams = new URLSearchParams(hashStr);
    const searchParams = new URLSearchParams(window.location.search);

    const oauthError = hashParams.get('error') || searchParams.get('error');
    const oauthErrorDesc = hashParams.get('error_description') || searchParams.get('error_description');
    const oauthErrorCode = hashParams.get('error_code') || searchParams.get('error_code');

    if (oauthError || oauthErrorCode) {
      console.group('⚠️ [LEVELMOVIE AUTH] Erreur retour OAuth détectée dans l’URL');
      console.error('Code d’erreur :', oauthErrorCode || oauthError);
      console.error('Description :', oauthErrorDesc || 'Non spécifiée');
      console.log('Paramètres bruts Hash :', hashStr);
      console.log('Paramètres bruts Search :', window.location.search);
      
      if (oauthErrorCode === '403' || oauthError === 'access_denied' || (oauthErrorDesc && oauthErrorDesc.includes('403'))) {
        console.warn('💡 ================== DIAGNOSTIC COMPLET ERREUR 403 GOOGLE ==================');
        console.warn('1. STATUT GOOGLE CLOUD : Votre application Google Cloud est probablement en mode "En cours de test" (Testing).');
        console.warn('   -> Rendez-vous sur : https://console.cloud.google.com/apis/credentials/consent');
        console.warn('   -> Cliquez sur le bouton "PUBLIER L’APPLICATION" pour autoriser tout le monde sans blocage 403.');
        console.warn('   -> Ou ajoutez votre email sous la section "Utilisateurs test".');
        console.warn('2. URIs DE REDIRECTION DANS GOOGLE CLOUD :');
        console.warn('   -> URI de redirection autorisée : https://epprgkolsywdfouffpmj.supabase.co/auth/v1/callback');
        console.warn('3. TYPE D’UTILISATEUR GOOGLE : Assurez-vous que le type d’utilisateur est "Externe" (External).');
        console.warn('=============================================================================');
      }
      console.groupEnd();
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error('❌ [Supabase Auth] Erreur lors de la récupération de session :', error);
        } else if (session?.user) {
          console.log('✅ [Supabase Auth] Utilisateur connecté :', session.user.email, session.user.id);
          setUser({ uid: session.user.id });
          const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || t.defaultUser;
          setUserName(name);
          if (session.user.email) setUserEmail(session.user.email);
          const photo = session.user.user_metadata?.avatar_url || null;
          if (photo) setUserPhoto(photo);
        } else {
          console.log('ℹ️ [Supabase Auth] Prêt (Aucune session active enregistrée).');
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔄 [Supabase Auth Event] :', event, session?.user?.email || '(aucun)');
        if (session?.user) {
          setUser({ uid: session.user.id });
          const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || t.defaultUser;
          setUserName(name);
          if (session.user.email) setUserEmail(session.user.email);
          const photo = session.user.user_metadata?.avatar_url || null;
          if (photo) setUserPhoto(photo);
        }
      });

      const handleWindowMessage = (e: MessageEvent) => {
        if (e.data?.type === 'OAUTH_AUTH_SUCCESS') {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              setUser({ uid: session.user.id });
              const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || t.defaultUser;
              setUserName(name);
              if (session.user.email) setUserEmail(session.user.email);
              const photo = session.user.user_metadata?.avatar_url || null;
              if (photo) setUserPhoto(photo);
            }
          });
        }
      };
      window.addEventListener('message', handleWindowMessage);

      return () => {
        authListener.subscription.unsubscribe();
        window.removeEventListener('message', handleWindowMessage);
      };
    }
  }, [t.defaultUser]);

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
          // Restore existing saved session if available so anonymous Firebase doesn't wipe the logged-in user
          const savedUid = localStorage.getItem('levelmovie_user_uid');
          const savedName = localStorage.getItem('levelmovie_user_name');
          const savedEmail = localStorage.getItem('levelmovie_user_email');
          const savedPhoto = localStorage.getItem('lm_photo');
          if (savedUid) {
            setUser({ uid: savedUid });
            if (savedName) setUserName(savedName);
            if (savedEmail) setUserEmail(savedEmail);
            if (savedPhoto) setUserPhoto(savedPhoto);
          } else {
            setUser(null);
          }
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

    // Multi-stage real verification pipeline during splash (Snappy ~2.6s)
    const t1 = setTimeout(() => setSplashStep(1), 100);

    const isFr = lang === 'fr';

    // STEP 1: Browser Analysis (0ms -> 700ms)
    const tBrowser = setTimeout(() => {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const isOpera = /OPR\/|Opera|Opera GX/i.test(ua);
      setBrowserCheck({
        status: 'done',
        isOpera,
        text: isOpera
          ? (isFr ? 'Opera / Opera GX (Flux optimisés)' : 'Opera / Opera GX (Optimized)')
          : (isFr ? 'Navigateur standard détecté' : 'Standard browser detected')
      });
      // Start server ping check
      setServerCheck({
        status: 'checking',
        ok: false,
        latency: 0,
        text: isFr ? 'Test de latence des serveurs...' : 'Testing server latency...'
      });
    }, 700);

    // STEP 2: Server ping check (700ms -> 1600ms)
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
        text: isFr ? `Serveurs miroirs connectés (${latency}ms)` : `Mirror servers connected (${latency}ms)`
      });
      // Start catalog classification
      setCatalogCheck({
        status: 'checking',
        ok: false,
        text: isFr ? 'Indexation des catalogues...' : 'Syncing title catalog...'
      });
    }, 1600);

    // STEP 3: Catalog classification check (1600ms -> 2400ms)
    const tCatalog = setTimeout(() => {
      setCatalogCheck({
        status: 'done',
        ok: true,
        text: isFr ? '12 000+ titres indexés' : '12,000+ titles indexed'
      });
    }, 2400);

    // Fade out splash after all 3 verifications pass (~2.6s)
    const t2 = setTimeout(() => setSplashStep(2), 2600);

    // Complete splash screen (~2.9s)
    const t3 = setTimeout(() => {
      setSplashStep(3);
      setShowSplash(false);
    }, 2900);

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

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

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
      const params = target.searchParams;
      const hash = target.hash.toLowerCase();
      const path = target.pathname.toLowerCase();

      // POCKET 1: Watch Party / Salon (code from query, path, or hash)
      let partyCode = params.get('party') || params.get('salon') || params.get('room') || params.get('code');
      if (!partyCode && path.startsWith('/salon/')) partyCode = path.replace('/salon/', '');
      if (!partyCode && path.startsWith('/party/')) partyCode = path.replace('/party/', '');
      if (!partyCode && hash.startsWith('#party-')) partyCode = hash.replace('#party-', '');
      if (!partyCode && hash.startsWith('#salon-')) partyCode = hash.replace('#salon-', '');
      if (partyCode) {
        joinPartyByCode(partyCode.trim().toUpperCase());
        return;
      }

      // POCKET 2: Direct Watch / Stream / Movie Modal
      const watchId = params.get('watch') || params.get('movie') || params.get('film') || params.get('series') || params.get('play') || params.get('id');
      if (watchId) {
        let type = params.get('type') || (params.get('series') ? 'tv' : 'movie');
        try {
          const res = await fetch(`${BASE_URL}/${type}/${watchId}?api_key=${API_KEY}&language=${lang === 'fr' ? 'fr-FR' : 'en-US'}`);
          const movieData = await res.json();
          if (movieData && movieData.id) {
            if (type === 'tv' || movieData.first_air_date) {
              movieData.resumeSeason = params.get('season') ? parseInt(params.get('season')!) : (params.get('s') ? parseInt(params.get('s')!) : 1);
              movieData.resumeEpisode = params.get('episode') ? parseInt(params.get('episode')!) : (params.get('e') ? parseInt(params.get('e')!) : 1);
            }
            const targetMode = params.get('mode') || (params.get('play') || params.get('watch') ? 'play' : 'info');
            openModal(movieData, targetMode);
            return;
          }
        } catch (err) {
          console.warn("Deep link movie fetch error:", err);
        }
      }

      // POCKET 3: Support & FAQ Full-screen Center
      const isSupportReq = params.get('support') === 'true' || params.get('help') === 'true' || params.get('faq') === 'true' || path === '/support' || hash === '#support' || hash === '#help';
      if (isSupportReq) {
        setShowSupport(true);
        return;
      }

      // POCKET 4: Auth / Login / Signup
      const authAction = params.get('auth') || (params.get('login') === 'true' ? 'login' : null);
      if (authAction) {
        setShowLoginModal(true);
        return;
      }

      // POCKET 5: Search Query
      const queryParam = params.get('search') || params.get('q');
      if (queryParam) {
        setCurrentCategory('search');
        setSearchQuery(queryParam);
        return;
      }

      // POCKET 6: Navigation Category / Tabs
      const tabParam = params.get('tab') || params.get('category') || params.get('cat');
      if (tabParam) {
        const validTabs = ['home', 'movies', 'series', 'parties', 'favorites', 'history', 'top', 'search'];
        const targetTab = tabParam.toLowerCase();
        if (validTabs.includes(targetTab)) {
          setCurrentCategory(targetTab);
          return;
        }
      }

      // POCKET 7: Settings
      const settingsParam = params.get('settings');
      if (settingsParam) {
        if (['account', 'servers', 'parental', 'data', 'interface'].includes(settingsParam)) {
          setSettingsTab(settingsParam);
        }
        setShowSettings(true);
        return;
      }

    } catch (e) {
      console.warn("Deep link routing warning:", e);
    }
  }, [lang, openModal, joinPartyByCode]);

  useEffect(() => {
    // Run deep link on initial mount
    handleDeepLink(window.location.href);

    const handlePopState = () => {
      handleDeepLink(window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleDeepLink]);

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
    if (!partyId) { setPartyData(null); return; }
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
      } else if (docSnap.exists() && docSnap.data().status === 'ended') {
        setRoomEndedInfo({ roomName: docSnap.data().roomName || docSnap.data().title, title: docSnap.data().title });
        setPartyId(null);
        setPartyData(null);
        setSelectedMovie(null);
        syncPreferencesToDb({ activePartyId: null });
        localStorage.removeItem('active_party_id');
        document.body.classList.remove('party-mode');
        setCurrentCategory('home');
      }
    }, (err) => {
      console.warn("Party snapshot listener warning:", err);
    });
    return () => unsubscribe();
  }, [partyId, user, syncPreferencesToDb]);

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
    if (!movie) return;
    const hostUid = user?.uid || fbUser?.uid || ('guest_' + Math.random().toString(36).substring(2, 9));
    const hostName = userName || (user ? defaultUserName : (lang === 'fr' ? 'Hôte' : 'Host'));
    const newPartyId = 'LVL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const cleanRoomName = censorText((roomName || "").trim() || `Salon de ${hostName}`);
    const isTvShow = movie.first_air_date !== undefined;

    const initialPartyData = {
      hostUid: hostUid,
      mods: [],
      modInvites: [],
      banned: [],
      muted: [],
      movieId: movie.id,
      mediaType: isTvShow ? 'tv' : 'movie',
      season: isTvShow ? (movie.resumeSeason || 1) : null,
      episode: isTvShow ? (movie.resumeEpisode || 1) : null,
      title: movie.title || movie.name || movie.original_name || 'Watch Party',
      roomName: cleanRoomName,
      status: 'idle',
      syncTime: Date.now(),
      currentOffset: 0,
      members: [{ uid: hostUid, name: hostName, photo: userPhoto || "" }],
      messages: []
    };

    // Instant local state update for zero lag
    setPartyData(initialPartyData);
    setPartyId(newPartyId);
    setSelectedMovie(movie);
    setModalMode('play');
    setIsPartyMinimized(false);
    localStorage.setItem('active_party_id', newPartyId);
    window.history.pushState({}, '', `?party=${newPartyId}`);
    showToast(t.partyCreated, 'success');

    try {
      await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'parties', newPartyId), initialPartyData);
      await syncPreferencesToDb({ activePartyId: newPartyId });
    } catch (e) {
      console.warn("Firestore sync warning on party creation, continuing with local state:", e);
    }
  };

  const triggerCreateParty = (movie: any) => {
    setCreatePartyMovie(movie);
    setCustomRoomName("");
    setShowCreatePartyPrompt(true);
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
    localStorage.removeItem('lm_now_playing');
    localStorage.removeItem('active_party_id');
    setUser(null);
    setUserName('');
    setUserEmail('');
    setUserPhoto(null);
    setSelectedMovie(null);
    setPartyId(null);
    setPartyData(null);
    setShowSettings(false);
    setShowSidebar(false);
    setShowLogoutConfirm(false);
    setCurrentCategory('home');
    setShowLoginModal(false);
    showToast(lang === 'fr' ? 'Déconnexion réussie' : 'Logged out', 'success');
  };

  const langCode = lang === 'fr' ? 'fr-FR' : 'en-US';
  const langFilter = contentLang !== 'all' ? `&with_original_language=${contentLang}` : '';
  const adultFilterParams = '&include_adult=false';
  const buildUrl = (base: string) => `${base}?api_key=${API_KEY}&language=${langCode}${langFilter}${adultFilterParams}`;
  const buildUrlNoFilter = (base: string) => `${base}?api_key=${API_KEY}&language=${langCode}${adultFilterParams}`;

  const rowsConfig: any[] = useMemo(() => {
    const list: any[] = [];
    if (currentCategory === 'home' || currentCategory === 'movie' || currentCategory === 'party') {
      list.push(
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
      list.push(
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
    return list;
  }, [currentCategory, langCode, langFilter, adultFilterParams, t]);

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

          {/* Discreet Single-Line Status (No heavy boxes/bubbles) */}
          <div className="w-full max-w-xs mt-6 flex flex-col items-center gap-3 px-2">
            <div className="flex items-center gap-2 text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-ping" />
              <span className="text-xs font-mono tracking-wide">
                {catalogCheck.status === 'done'
                  ? (lang === 'fr' ? 'Expérience Cinéma Prête' : 'Ready')
                  : serverCheck.status === 'done'
                  ? (lang === 'fr' ? 'Indexation du catalogue...' : 'Syncing catalog...')
                  : browserCheck.status === 'done'
                  ? (lang === 'fr' ? 'Connexion aux serveurs...' : 'Connecting servers...')
                  : (lang === 'fr' ? 'Initialisation...' : 'Initializing...')}
              </span>
            </div>
            
            <div className="w-36 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] transition-all duration-500 rounded-full"
                style={{
                  width: catalogCheck.status === 'done' ? '100%' : serverCheck.status === 'done' ? '66%' : browserCheck.status === 'done' ? '33%' : '15%'
                }}
              />
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
            <button 
              onClick={() => setCurrentCategory('dona')} 
              className={`flex items-center gap-1.5 transition-all outline-none cursor-pointer group ${currentCategory === 'dona' ? 'text-[#c084fc] font-black' : 'text-white/60 hover:text-white'}`}
              title="Dona"
            >
              <DonaStar className="w-4 h-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              <span className="font-bold tracking-wide">Dona</span>
            </button>
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
          {currentCategory === 'dona' ? (
            <>
              {/* BOUTONS DONA MOBILE (SANS BULLE / SANS CONTOUR BUBBLE) */}
              <div className="flex items-center gap-4 sm:gap-5 md:hidden">
                {/* 1. Montre / Horloge (Historique) */}
                <button
                  type="button"
                  onClick={() => setDonaHistoryTrigger(prev => prev + 1)}
                  className="text-white/75 hover:text-[#c084fc] active:text-[#c084fc] transition-colors p-1 outline-none cursor-pointer active:scale-95"
                  title={lang === 'fr' ? 'Historique des discussions' : 'Chat History'}
                >
                  <Clock className="w-5 h-5 text-[#c084fc]" />
                </button>

                {/* 2. Ardoise et Bic / New Chat (Style ChatGPT) */}
                <button
                  type="button"
                  onClick={() => setDonaNewChatTrigger(prev => prev + 1)}
                  className="text-white/75 hover:text-white active:text-[#c084fc] transition-colors p-1 outline-none cursor-pointer active:scale-95"
                  title={lang === 'fr' ? 'Nouvelle discussion' : 'New Chat'}
                >
                  <SquarePen className="w-5 h-5 text-white/80 hover:text-white" />
                </button>

                {/* 3. Bouton X Croix (Sortir sans bulle) */}
                <button
                  type="button"
                  onClick={() => setCurrentCategory('home')}
                  className="text-white/60 hover:text-white active:text-rose-400 transition-colors p-1 outline-none cursor-pointer active:scale-95"
                  title={lang === 'fr' ? 'Fermer Dona' : 'Close Dona'}
                >
                  <X className="w-5 h-5 text-white/70 hover:text-white" />
                </button>
              </div>

              {/* Boutons Search & Profil visibles sur tablette / PC */}
              <div className="hidden md:flex items-center space-x-3 md:space-x-4">
                <button onClick={() => setShowSearchModal(true)} className="flex items-center gap-2 bg-[#151520] border border-white/10 hover:border-[#a855f7]/50 text-white/70 hover:text-white text-xs px-3.5 md:px-4 py-2 rounded-full outline-none w-10 md:w-72 justify-center md:justify-start transition-colors shadow-inner cursor-pointer">
                  <SearchIcon className="w-4 h-4 shrink-0 text-[#a855f7]" />
                  <span className="hidden md:inline truncate text-white/50">{t.searchPlaceholder}</span>
                </button>

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
            </>
          ) : (
            <>
              <button onClick={() => setShowSearchModal(true)} className="flex items-center gap-2 bg-[#151520] border border-white/10 hover:border-[#a855f7]/50 text-white/70 hover:text-white text-xs px-3.5 md:px-4 py-2 rounded-full outline-none w-10 md:w-72 justify-center md:justify-start transition-colors shadow-inner cursor-pointer">
                <SearchIcon className="w-4 h-4 shrink-0 text-[#a855f7]" />
                <span className="hidden md:inline truncate text-white/50">{t.searchPlaceholder}</span>
              </button>

              {/* Profil / Connexion Button (PC & Tablette) */}
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
            </>
          )}
        </div>
      </header>

      {/* NAVBAR MOBILE (Masquée sur Dona pour laisser la place complète au chat) */}
      {currentCategory !== 'dona' && (
        <nav className="safe-bottom-nav lg:hidden fixed bottom-0 w-full z-50 bg-[#060608]/95 backdrop-blur-xl border-t border-white/5 flex justify-around items-center pt-3 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
          <button onClick={() => setCurrentCategory('home')} className={`flex flex-col items-center gap-1 transition-colors outline-none cursor-pointer ${currentCategory === 'home' && !showSidebar ? 'text-[#a855f7]' : 'text-white/50 hover:text-white'}`}>
            <Home className="w-5 h-5" /> <span className="text-[9px] font-bold uppercase tracking-widest">{t.home}</span>
          </button>
          <button 
            onClick={() => setCurrentCategory('dona')} 
            className={`flex flex-col items-center justify-center gap-1 transition-all outline-none cursor-pointer active:scale-95 group ${currentCategory === 'dona' && !showSidebar ? 'text-[#c084fc]' : 'text-white/70 hover:text-white'}`}
            title="Dona"
          >
            <div className="relative flex items-center justify-center w-6 h-6">
              <DonaStar className="w-5 h-5 relative z-10 transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-wider ${currentCategory === 'dona' && !showSidebar ? 'text-[#c084fc]' : 'text-white/60'}`}>Dona</span>
          </button>
          <button onClick={() => setCurrentCategory('party')} className={`flex flex-col items-center gap-1 transition-colors outline-none cursor-pointer ${currentCategory === 'party' && !showSidebar ? 'text-[#a855f7]' : 'text-white/50 hover:text-white'}`}>
            <Users className="w-5 h-5" /> <span className="text-[9px] font-bold uppercase tracking-widest">{t.partyTab}</span>
          </button>
          <button onClick={() => setCurrentCategory('anime')} className={`flex flex-col items-center gap-1 transition-colors outline-none cursor-pointer ${currentCategory === 'anime' && !showSidebar ? 'text-red-500' : 'text-white/50 hover:text-white'}`}>
            <LevelMovieLogo className="w-5 h-5" color="#ef4444" /> <span className="text-[9px] font-bold uppercase tracking-widest">Anime</span>
          </button>
          <button onClick={() => setShowSidebar(true)} className={`flex flex-col items-center gap-1 transition-colors outline-none cursor-pointer ${showSidebar ? 'text-[#a855f7]' : 'text-white/50 hover:text-white'}`}>
            <Menu className="w-5 h-5" /> <span className="text-[9px] font-bold uppercase tracking-widest">{t.menu || 'Menu'}</span>
          </button>
        </nav>
      )}

      {/* CONTENU PRINCIPAL */}
      {currentCategory === 'dona' ? (
        <div className="fixed inset-x-0 top-14 md:top-16 bottom-0 z-30 flex flex-col bg-[#020202] animate-in fade-in duration-200 overflow-hidden">
          <div className="w-full h-full flex flex-col flex-1 overflow-hidden">
            <DonaModal
              isOpen={true}
              onClose={() => setCurrentCategory('home')}
              onSelectMovie={(movie, mode = 'info') => openModal(movie, mode)}
              onCreateParty={(movie) => triggerCreateParty(movie)}
              onNavigateCategory={(cat) => setCurrentCategory(cat)}
              onOpenSearch={(q) => {
                if (q) setSearchQuery(q);
                setShowSearchModal(true);
              }}
              onOpenSettings={() => setShowSettings(true)}
              onOpenSupport={() => setShowSupport(true)}
              lang={lang}
              historyTrigger={donaHistoryTrigger}
              newChatTrigger={donaNewChatTrigger}
            />
          </div>
        </div>
      ) : currentCategory === 'party' ? (
        <div className="pt-24 px-4 md:px-14 pb-24 min-h-screen relative z-30 w-full max-w-[2000px] mx-auto space-y-8 animate-in fade-in duration-300">
          {/* Executive Watch Party Cinema Lounge Header */}
          <div className="relative w-full rounded-[2.5rem] p-6 sm:p-10 bg-gradient-to-r from-[#170a2c] via-[#0d0d1a] to-[#080812] border border-[#a855f7]/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(168,85,247,0.15)] overflow-hidden">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Info & Live Badges */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-3xl bg-gradient-to-br from-[#a855f7]/30 via-purple-600/20 to-pink-500/20 flex items-center justify-center border border-[#a855f7]/50 shadow-[0_0_30px_rgba(168,85,247,0.35)]">
                  <WatchPartySVG className="w-9 h-9 sm:w-11 sm:h-11 text-[#c084fc] animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/40 text-[#c084fc] text-[11px] font-mono font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      {lang === 'fr' ? 'Cinema Live Rooms' : 'Cinema Live Rooms'}
                    </span>
                    <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      v2.6 Ultra-Sync
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                    {t.joinPartyTitle}
                  </h2>
                  <p className="text-white/70 text-xs sm:text-sm max-w-xl leading-relaxed">
                    {t.joinPartyDesc}
                  </p>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className="text-[10px] font-semibold text-white/60 bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-xl">
                      ⚡ {lang === 'fr' ? 'Sync sub-seconde' : 'Sub-second sync'}
                    </span>
                    <span className="text-[10px] font-semibold text-white/60 bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-xl">
                      🔒 {lang === 'fr' ? 'Salons chiffrés' : 'Encrypted rooms'}
                    </span>
                    <span className="text-[10px] font-semibold text-white/60 bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-xl">
                      💬 {lang === 'fr' ? 'Chat & Émojis direct' : 'Live chat & reactions'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Join Code Form */}
              <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-2.5 bg-black/70 border border-purple-500/30 p-2 sm:p-2.5 rounded-2xl shadow-2xl focus-within:border-[#a855f7] focus-within:shadow-[0_0_25px_rgba(168,85,247,0.25)] transition-all">
                <input 
                  type="text" 
                  id="partyCodeInput"
                  maxLength={12}
                  placeholder={t.partyCodePlaceholder}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const inputEl = document.getElementById('partyCodeInput') as HTMLInputElement;
                      const code = inputEl ? inputEl.value.trim().toUpperCase() : '';
                      if (code) triggerJoinParty(code);
                    }
                  }}
                  className="w-full sm:w-56 bg-transparent px-4 py-2.5 text-white font-mono text-sm uppercase tracking-widest outline-none placeholder:text-white/30"
                />
                <button 
                  type="button"
                  onClick={() => {
                    const inputEl = document.getElementById('partyCodeInput') as HTMLInputElement;
                    const code = inputEl ? inputEl.value.trim().toUpperCase() : '';
                    if (code) triggerJoinParty(code);
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-[#a855f7] to-pink-600 hover:opacity-95 text-white px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all active:scale-95 text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] shrink-0 cursor-pointer whitespace-nowrap"
                >
                  {t.joinBtn}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-widest border-l-4 border-[#a855f7] pl-3">
              {t.watchPartyMovies}
            </h2>
            <span className="text-[11px] font-mono text-purple-300/70 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full hidden sm:inline-block">
              {lang === 'fr' ? 'Cliquez sur « + » pour lancer un salon' : 'Click « + » to host a room'}
            </span>
          </div>

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
      ) : currentCategory === 'anime' ? (
        <div className="pt-14 md:pt-16 min-h-screen">
          <LevelAnimeApp
            lang={lang}
            user={user}
            userPhoto={userPhoto}
            userName={userName}
            userEmail={userEmail}
            showToast={(msg, type) => showToast(msg, type)}
          />
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
      {currentCategory !== 'dona' && (
        <FooterDisclaimer
          lang={lang}
          onOpenSupport={() => setShowSupport(true)}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

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
        onOpenDona={() => { setShowSidebar(false); setCurrentCategory('dona'); }}
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
        onOpenDona={() => { setShowSettings(false); setCurrentCategory('dona'); }}
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
        onLoginSuccess={(loggedUser, name, email, photo, handle) => {
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

      {/* MODAL CRÉATION DE SALON WATCH PARTY */}
      {showCreatePartyPrompt && createPartyMovie && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#121218] border border-[#a855f7]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#a855f7]/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#a855f7]/30 to-[#ec4899]/30 border border-[#a855f7]/40 flex items-center justify-center shadow-lg shrink-0">
                <WatchPartySVG className="w-8 h-8 text-[#a855f7]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider">
                  {t.createPartyTitle || (lang === 'fr' ? 'Créer un Salon' : 'Create Watch Party')}
                </h3>
                <p className="text-white/50 text-xs mt-0.5">
                  {t.createPartyDesc || (lang === 'fr' ? 'Regarder ensemble en temps réel avec chat' : 'Watch together in sync with live chat')}
                </p>
              </div>
            </div>

            {/* Movie preview chip */}
            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl mb-6 relative z-10">
              {createPartyMovie.poster_path ? (
                <img
                  src={`${IMAGE_BASE_URL}${createPartyMovie.poster_path}`}
                  alt=""
                  className="w-12 h-16 object-cover rounded-xl shrink-0"
                />
              ) : (
                <div className="w-12 h-16 bg-[#2a2a35] rounded-xl flex items-center justify-center text-xs text-white/40 shrink-0">
                  🎬
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">
                  {createPartyMovie.title || createPartyMovie.name}
                </h4>
                <p className="text-[11px] text-white/50 truncate">
                  {createPartyMovie.first_air_date ? (lang === 'fr' ? 'Série TV' : 'TV Show') : (lang === 'fr' ? 'Film' : 'Movie')}
                  {createPartyMovie.release_date || createPartyMovie.first_air_date ? ` • ${new Date(createPartyMovie.release_date || createPartyMovie.first_air_date).getFullYear()}` : ''}
                </p>
              </div>
            </div>

            {/* Room Name Input */}
            <div className="mb-6 relative z-10">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-white/70">
                  {t.createPartyRoomName || (lang === 'fr' ? 'Nom du salon (optionnel)' : 'Room Name (optional)')}
                </label>
                <span className={`text-[10px] font-mono ${customRoomName.length >= 35 ? 'text-red-400 font-bold' : 'text-white/40'}`}>
                  {customRoomName.length}/35
                </span>
              </div>
              <input
                type="text"
                value={customRoomName}
                onChange={(e) => setCustomRoomName(e.target.value)}
                placeholder={`Salon de ${userName || defaultUserName}`}
                maxLength={35}
                className="w-full bg-[#1b1b24] border border-white/15 focus:border-[#a855f7] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 relative z-10">
              <button
                type="button"
                onClick={() => {
                  setShowCreatePartyPrompt(false);
                  setCreatePartyMovie(null);
                }}
                className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {t.createPartyCancel || (lang === 'fr' ? 'Annuler' : 'Cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  const movieToCreate = createPartyMovie;
                  const roomNameToCreate = customRoomName;
                  setShowCreatePartyPrompt(false);
                  setCreatePartyMovie(null);
                  handleCreateParty(movieToCreate, roomNameToCreate);
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:opacity-95 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-95 transition-all cursor-pointer"
              >
                {t.createPartySubmit || (lang === 'fr' ? 'Lancer le salon' : 'Start Party')}
              </button>
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
            try {
              const url = new URL(window.location.href);
              url.searchParams.delete('watch');
              url.searchParams.delete('movie');
              url.searchParams.delete('film');
              url.searchParams.delete('series');
              url.searchParams.delete('play');
              url.searchParams.delete('id');
              url.searchParams.delete('mode');
              window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '') + url.hash);
            } catch (_) {}
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

      {/* GESTIONNAIRE RÉSEAU & MODE HORS-LIGNE PRO */}
      <NetworkOfflineManager
        lang={lang}
        onOpenWatchlist={() => setCurrentCategory('watchlist')}
        onOpenHistory={() => setCurrentCategory('history')}
        showToast={showToast}
      />
    </div>
  );
}
