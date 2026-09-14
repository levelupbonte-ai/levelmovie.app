import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Key, ArrowLeft, Check, Sparkles, AlertCircle, Eye, EyeOff,
  User, UserPlus, LogOut, LogIn, ArrowRight, Star, Camera,
  Upload, CheckCircle2, Calendar, RefreshCw, BadgeCheck, ShieldAlert, Crown
} from 'lucide-react';
import { LevelMovieLogo, LevelMusicLogo, LevelDayLogo, LevelStudioLogo, DEFAULT_AVATARS, AvatarPreset, recordWeeklyLogin, LevelUpEcosystemStar } from '../constants';
import { LevelAvatar } from './LevelAvatar';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type AuthView = 
  | 'view-main'
  | 'view-register-choice'
  | 'view-login'
  | 'view-forgot-password'
  | 'view-forgot-password-sent'
  | 'view-register-credentials'
  | 'view-onboarding';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any, name: string, email: string, photo?: string | null, handle?: string, age?: number | null) => void;
  lang: string;
  showToast: (msg: string, type?: string) => void;
  initialView?: AuthView;
  onboardingUser?: any;
  hideUsername?: boolean;
  appName?: string;
  subtitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang,
  showToast,
  initialView = 'view-main',
  onboardingUser = null,
  hideUsername = false,
  appName = 'LevelMovie',
  subtitle
}) => {
  const [currentView, setCurrentView] = useState<AuthView>(initialView);

  // Sync with initialView prop when modal opens or initialView changes
  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialView);
      if (hideUsername) {
        setRegStep(3);
        setOnboardStep(3);
      }
    }
  }, [isOpen, initialView, hideUsername]);

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Form states - Step-by-Step Registration (1: @ID, 2: Âge, 3: Email/Mdp, 4: Profil/Avatar, 5: Validation & Save)
  const [regStep, setRegStep] = useState<1 | 2 | 3 | 4 | 5>(hideUsername ? 3 : 1);
  const [regUsername, setRegUsername] = useState('');
  const [regAge, setRegAge] = useState<string>('18');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regAvatar, setRegAvatar] = useState<string>(DEFAULT_AVATARS[0].id);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('749215');
  const [codeSentTimer, setCodeSentTimer] = useState<number>(60);

  // Onboarding states for OAuth Google (1: @ID, 2: Âge, 3: Profil/Avatar)
  const [onboardStep, setOnboardStep] = useState<1 | 2 | 3>(1);
  const [onboardUsername, setOnboardUsername] = useState('');
  const [onboardAge, setOnboardAge] = useState<string>('18');
  const [onboardFullName, setOnboardFullName] = useState('');
  const [onboardAvatar, setOnboardAvatar] = useState<string>(DEFAULT_AVATARS[0].id);

  // UI & Loading states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Poster Carousel Showcase (right side - dynamic TMDB API powered)
  const [posterIndex, setPosterIndex] = useState(0);
  const [dynamicPosters, setDynamicPosters] = useState<Array<{ title: string; bg: string; rating: string; overview?: string }>>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onboardFileInputRef = useRef<HTMLInputElement>(null);

  const isFr = lang === 'fr';

  // Synchronize URL search params with active auth view
  const updateAuthUrl = (view: AuthView) => {
    try {
      const url = new URL(window.location.href);
      if (view === 'view-login') {
        url.searchParams.set('auth', 'login');
      } else if (view === 'view-register-choice' || view === 'view-register-credentials') {
        url.searchParams.set('auth', 'register');
      } else if (view === 'view-forgot-password' || view === 'view-forgot-password-sent') {
        url.searchParams.set('auth', 'forgot-password');
      } else if (view === 'view-onboarding') {
        url.searchParams.set('auth', 'onboarding');
      } else {
        url.searchParams.set('auth', 'main');
      }
      window.history.replaceState({}, '', url.pathname + '?' + url.searchParams.toString() + url.hash);
    } catch (_) {}
  };

  const navigateToView = (view: AuthView) => {
    setErrorMsg('');
    setCurrentView(view);
    updateAuthUrl(view);
  };

  // On open or view change, sync URL
  useEffect(() => {
    if (isOpen) {
      updateAuthUrl(currentView);
    }
  }, [isOpen, currentView]);

  const defaultShowcasePosters = [
    {
      title: isFr ? 'L’univers cinéma sans limites' : 'Limitless Cinema Streaming',
      bg: 'https://image.tmdb.org/t/p/w1280/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg',
      rating: '8.9/10',
      overview: isFr ? 'Des milliers de films en 4K et des salons Watch Party synchronisés.' : 'Thousands of 4K films and synchronized live Watch Parties.'
    },
    {
      title: isFr ? 'Animation Japonaise & Séries' : 'Japanese Anime & Series',
      bg: 'https://image.tmdb.org/t/p/w1280/2u0w3w9x7h2UoG9xW6v5i9kG8mC.jpg',
      rating: '9.2/10',
      overview: isFr ? 'Les dernières sorties et animes en haute fidélité.' : 'The latest releases and animes in pristine quality.'
    },
    {
      title: isFr ? 'Salons Watch Party synchronisés' : 'Synced Live Watch Parties',
      bg: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520QIq.jpg',
      rating: '9.0/10',
      overview: isFr ? 'Regardez vos films préférés en direct avec vos amis.' : 'Watch together in real-time with friends.'
    }
  ];

  const ecosystemShowcasePosters = [
    {
      title: isFr ? 'LevelUp Ecosystem • Compte Membre Unique' : 'LevelUp Ecosystem • Unified Member Account',
      bg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1280&q=80',
      rating: 'Ecosystem Hub',
      overview: isFr ? 'Un compte unique pour vos projets web sur-mesure, vos services cloud et toutes les applications LevelUp.' : 'A single unified account for your bespoke web projects, cloud services, and all LevelUp applications.'
    },
    {
      title: isFr ? 'LevelMovie • Cinéma 4K & Salons Synchronisés' : 'LevelMovie • 4K Cinema & Synced Watch Parties',
      bg: 'https://image.tmdb.org/t/p/w1280/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg',
      rating: isFr ? 'Inclus dans votre compte' : 'Included in your account',
      overview: isFr ? 'Streaming haute définition, salons Watch Party en direct et synchronisation instantanée sans réinscription.' : 'High-definition streaming, live Watch Parties and synchronized rooms with no duplicate signups.'
    },
    {
      title: isFr ? 'Zéro Acompte Initial • Développé avant validation' : 'Zero Upfront Deposit • Built Before Payment',
      bg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1280&q=80',
      rating: isFr ? 'Garantie Totale' : 'Satisfaction Guaranteed',
      overview: isFr ? 'Nous concevons vos sites web et applications sur-mesure. Vous inspectez chaque détail avant le moindre paiement.' : 'We engineer your bespoke websites and apps. You inspect every single detail before any payment.'
    },
    {
      title: isFr ? 'LevelMusic & LevelDay • Utilitaires Cloud Inclus' : 'LevelMusic & LevelDay • Free Cloud Utilities',
      bg: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1280&q=80',
      rating: 'Ecosystem Suite',
      overview: isFr ? 'Lecteur audio haute fidélité et météo dynamique connectés directement à votre profil LevelUp.' : 'High fidelity music player and live weather connected directly to your LevelUp profile.'
    }
  ];

  const showcasePosters = (appName === 'LevelUp Ecosystem')
    ? ecosystemShowcasePosters
    : (dynamicPosters.length > 0 ? dynamicPosters : defaultShowcasePosters);

  // Auto carousel cycling
  useEffect(() => {
    const timer = setInterval(() => {
      setPosterIndex((prev) => (prev + 1) % showcasePosters.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [showcasePosters.length]);

  // Verification code countdown timer
  useEffect(() => {
    let interval: any = null;
    if (currentView === 'view-register-credentials' && regStep === 5 && codeSentTimer > 0) {
      interval = setInterval(() => {
        setCodeSentTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentView, regStep, codeSentTimer]);

  // Fetch dynamic posters from TMDB
  useEffect(() => {
    let isMounted = true;
    const fetchTrendingPosters = async () => {
      try {
        const apiKey = (import.meta as any).env?.VITE_TMDB_API_KEY || '027cc951d888c64e5f15dcb853c7347a';
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=${lang === 'fr' ? 'fr-FR' : 'en-US'}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.results && data.results.length > 0 && isMounted) {
          const formatted = data.results.slice(0, 5).map((m: any) => ({
            title: m.title || m.name,
            bg: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : (m.poster_path ? `https://image.tmdb.org/t/p/w1280${m.poster_path}` : defaultShowcasePosters[0].bg),
            rating: m.vote_average ? `${m.vote_average.toFixed(1)}/10` : '8.8/10',
            overview: m.overview ? (m.overview.slice(0, 110) + '...') : undefined
          }));
          setDynamicPosters(formatted);
        }
      } catch (_) {}
    };

    fetchTrendingPosters();
    return () => { isMounted = false; };
  }, [lang]);

  // Format and sanitize username (@handle)
  const formatUsernameInput = (val: string) => {
    return val.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24);
  };

  // Custom Image Upload handler
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>, mode: 'reg' | 'onboard') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(isFr ? 'L’image dépasse 5 Mo.' : 'Image exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (mode === 'reg') {
        setRegAvatar(result);
      } else {
        setOnboardAvatar(result);
      }
      showToast(isFr ? 'Photo importée !' : 'Photo uploaded!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Close modal and clean url query params
  const handleClose = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      url.searchParams.delete('auth');
      url.searchParams.delete('onboarding');
      url.searchParams.delete('signup');
      url.searchParams.delete('register');
      const cleanUrl = url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '') + url.hash;
      window.history.replaceState({}, '', cleanUrl);
    } catch (_) {}
    onClose();
  };

  // 1. Google OAuth Flow
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (isSupabaseConfigured() && supabase) {
        const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

        if (isInIframe) {
          // Google blocks OAuth inside iframes (403 / X-Frame-Options: SAMEORIGIN)
          // We request the OAuth URL and open it in a top-level window or popup
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin,
              skipBrowserRedirect: true
            }
          });
          if (error) throw error;
          
          if (data?.url) {
            const popup = window.open(data.url, '_blank');
            if (!popup || popup.closed || typeof popup.closed === 'undefined') {
              try {
                window.top!.location.href = data.url;
              } catch (_) {
                window.location.href = data.url;
              }
            }
          }
        } else {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin
            }
          });
          if (error) throw error;
        }
      } else {
        setTimeout(() => {
          setLoading(false);
          setOnboardFullName('Cinéphile');
          setOnboardUsername('cine_vip');
          setOnboardAge('18');
          setOnboardAvatar(DEFAULT_AVATARS[0].id);
          setOnboardStep(1);
          navigateToView('view-onboarding');
        }, 400);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || (isFr ? 'Échec de la connexion Google.' : 'Google sign-in failed.'));
    }
  };

  // 2. Email Sign In
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg(isFr ? 'Veuillez remplir tous les champs.' : 'Please fill all fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword
        });

        if (error) throw error;

        if (data.user) {
          const userMeta = data.user.user_metadata || {};
          const displayName = userMeta.full_name || userMeta.first_name || data.user.email?.split('@')[0] || 'Cinéphile';
          const displayPhoto = userMeta.avatar_url || DEFAULT_AVATARS[0].id;
          const displayHandle = userMeta.username || data.user.email?.split('@')[0] || 'user';
          const age = userMeta.age ? parseInt(userMeta.age, 10) : 18;
          const uid = data.user.id;

          localStorage.setItem('levelmovie_username', displayName);
          localStorage.setItem('levelmovie_user_name', displayName);
          localStorage.setItem('levelmovie_user_email', data.user.email || '');
          localStorage.setItem('levelmovie_user_handle', displayHandle);
          localStorage.setItem('levelmovie_user_photo', displayPhoto);
          localStorage.setItem('lm_photo', displayPhoto);
          localStorage.setItem('levelmovie_user_age', String(age));
          localStorage.setItem('levelmovie_user_uid', uid);
          localStorage.setItem(`lm_profile_completed_${uid}`, 'true');

          // Record weekly activity for VIP loyalty
          const vip = recordWeeklyLogin();

          setLoading(false);
          const userObj = { name: displayName, email: data.user.email || '', photo: displayPhoto, uid, handle: displayHandle };
          window.dispatchEvent(new CustomEvent('levelup_auth_state_change', {
            detail: { user: userObj }
          }));
          window.dispatchEvent(new CustomEvent('levelmovie_profile_change', {
            detail: { name: displayName, photo: displayPhoto, email: data.user.email || '', uid, handle: displayHandle }
          }));
          onLoginSuccess(data.user, displayName, data.user.email || '', displayPhoto, displayHandle, age);
          if (vip.isVipNow || vip.info.isVip) {
            showToast(isFr ? `👑 Bienvenue, ${displayName} ! Statut VIP Actif (${vip.info.weeklyLoginsCount}/4j)` : `👑 Welcome back, ${displayName}! VIP Active (${vip.info.weeklyLoginsCount}/4d)`, 'success');
          } else {
            showToast(isFr ? `Ravi de vous revoir, ${displayName} ! (${vip.info.weeklyLoginsCount}/4j connectés cette semaine)` : `Welcome back, ${displayName}! (${vip.info.weeklyLoginsCount}/4 days logged in this week)`, 'success');
          }
          handleClose();
        }
      } else {
        setTimeout(() => {
          setLoading(false);
          const name = loginEmail.split('@')[0];
          const uid = `usr_${Date.now()}`;
          const handle = name.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user';
          const age = 18;
          localStorage.setItem('levelmovie_username', name);
          localStorage.setItem('levelmovie_user_name', name);
          localStorage.setItem('levelmovie_user_email', loginEmail.trim());
          localStorage.setItem('levelmovie_user_handle', handle);
          localStorage.setItem('levelmovie_user_photo', DEFAULT_AVATARS[0].id);
          localStorage.setItem('lm_photo', DEFAULT_AVATARS[0].id);
          localStorage.setItem('levelmovie_user_age', String(age));
          localStorage.setItem('levelmovie_user_uid', uid);
          localStorage.setItem(`lm_profile_completed_${uid}`, 'true');
          
          // Record weekly activity for VIP loyalty
          const vip = recordWeeklyLogin();

          const userObj = { name, email: loginEmail.trim(), photo: DEFAULT_AVATARS[0].id, uid, handle };
          window.dispatchEvent(new CustomEvent('levelup_auth_state_change', {
            detail: { user: userObj }
          }));
          window.dispatchEvent(new CustomEvent('levelmovie_profile_change', {
            detail: { name, photo: DEFAULT_AVATARS[0].id, email: loginEmail.trim(), uid, handle }
          }));
          onLoginSuccess({ id: uid, email: loginEmail.trim() }, name, loginEmail.trim(), DEFAULT_AVATARS[0].id, handle, age);
          if (vip.isVipNow || vip.info.isVip) {
            showToast(isFr ? `👑 Connexion réussie ! Statut VIP Actif (${vip.info.weeklyLoginsCount}/4j)` : `👑 Signed in! VIP Active (${vip.info.weeklyLoginsCount}/4d)`, 'success');
          } else {
            showToast(isFr ? `Connexion réussie ! (${vip.info.weeklyLoginsCount}/4j connectés cette semaine)` : `Signed in successfully! (${vip.info.weeklyLoginsCount}/4 days this week)`, 'success');
          }
          handleClose();
        }, 300);
      }

    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || (isFr ? 'Identifiants incorrects.' : 'Invalid credentials.'));
    }
  };

  // STEP NAVIGATION & VALIDATION (Atomic DB write at step 5)
  
  // Étape 1: @ID
  const handleRegStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanHandle = formatUsernameInput(regUsername);
    if (!cleanHandle || cleanHandle.length < 3) {
      setErrorMsg(isFr ? 'L’identifiant doit contenir au moins 3 caractères.' : 'Username must be at least 3 characters.');
      return;
    }
    setRegStep(2);
  };

  // Étape 2: Âge (>= 16 ans)
  const handleRegStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const ageNum = parseInt(regAge, 10);
    if (isNaN(ageNum) || ageNum < 16) {
      setErrorMsg(isFr ? 'Accès réservé aux personnes de 16 ans et plus.' : 'Access reserved for 16+ users.');
      return;
    }
    if (ageNum > 120) {
      setErrorMsg(isFr ? 'Âge invalide.' : 'Invalid age.');
      return;
    }
    setRegStep(3);
  };

  // Étape 3: E-mail & Mot de passe
  const handleRegStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regEmail.trim() || !regEmail.includes('@') || !regEmail.includes('.')) {
      setErrorMsg(isFr ? 'Adresse e-mail invalide.' : 'Invalid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg(isFr ? 'Le mot de passe doit contenir 6 caractères minimum.' : 'Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg(isFr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }
    setRegStep(4);
  };

  // Dispatch verification email via Resend API
  const sendOtpEmail = async (codeToSend: string) => {
    try {
      const targetEmail = regEmail.trim();
      const name = regFullName.trim() || regUsername.trim() || 'Cinéphile';
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          code: codeToSend,
          username: name
        })
      });
      const data = await res.json();
      if (!data.success && data.error) {
        console.warn('[OTP Notice]:', data.error);
      }
    } catch (err) {
      console.warn('[OTP Notice]: Network warning', err);
    }
  };

  // Étape 4: Profil (Nom & Avatar) -> Envoie le code par Resend vers validation
  const handleRegStep4 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const name = regFullName.trim() || regUsername.trim() || 'Cinéphile';
    if (!name) {
      setErrorMsg(isFr ? 'Veuillez indiquer un nom d’affichage.' : 'Please enter a display name.');
      return;
    }

    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(generated);
    setVerificationCode('');
    setCodeSentTimer(60);
    sendOtpEmail(generated);
    showToast(isFr ? `Code de vérification envoyé à ${regEmail.trim()}` : `Verification code dispatched to ${regEmail.trim()}`, 'info');
    setRegStep(5);
  };

  // Étape 5: Validation finale
  const handleRegStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const codeEntered = verificationCode.trim();
    if (!codeEntered || codeEntered.length !== 6) {
      setErrorMsg(isFr ? 'Veuillez saisir les 6 chiffres du code.' : 'Please enter all 6 digits of the code.');
      return;
    }
    if (codeEntered !== generatedCode) {
      setErrorMsg(isFr ? 'Code de confirmation incorrect.' : 'Incorrect confirmation code.');
      return;
    }
    handleFinalizeRegistration();
  };

  const handleResendCode = () => {
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(generated);
    setCodeSentTimer(60);
    sendOtpEmail(generated);
    showToast(isFr ? `Nouveau code envoyé à ${regEmail.trim()}` : `New code dispatched to ${regEmail.trim()}`, 'info');
  };


  // Final Registration Persistence
  const handleFinalizeRegistration = async () => {
    setLoading(true);
    setErrorMsg('');

    const autoHandle = regEmail.trim().split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') || 'membre';
    const cleanHandle = formatUsernameInput(hideUsername ? autoHandle : (regUsername || autoHandle));
    const fullName = regFullName.trim() || cleanHandle || 'Membre';
    const ageNum = parseInt(regAge, 10) || 18;

    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: regEmail.trim(),
          password: regPassword,
          options: {
            data: {
              full_name: fullName,
              username: cleanHandle,
              avatar_url: regAvatar,
              age: ageNum,
              terms_accepted: true,
              profile_completed: true
            }
          }
        });

        if (error) throw error;

        const uid = data.user?.id || `usr_${Date.now()}`;

        localStorage.setItem('levelmovie_username', fullName);
        localStorage.setItem('levelmovie_user_name', fullName);
        localStorage.setItem('levelmovie_user_email', regEmail.trim());
        localStorage.setItem('levelmovie_user_handle', cleanHandle);
        localStorage.setItem('levelmovie_user_photo', regAvatar);
        localStorage.setItem('lm_photo', regAvatar);
        localStorage.setItem('levelmovie_user_age', String(ageNum));
        localStorage.setItem('levelmovie_user_uid', uid);
        localStorage.setItem(`lm_profile_completed_${uid}`, 'true');

        // Record weekly activity
        recordWeeklyLogin();

        setLoading(false);
        const userObj = { name: fullName, email: regEmail.trim(), photo: regAvatar, uid, handle: cleanHandle };
        window.dispatchEvent(new CustomEvent('levelup_auth_state_change', {
          detail: { user: userObj }
        }));
        window.dispatchEvent(new CustomEvent('levelmovie_profile_change', {
          detail: { name: fullName, photo: regAvatar, email: regEmail.trim(), uid, handle: cleanHandle }
        }));
        onLoginSuccess(
          data.user || { id: uid, email: regEmail.trim() },
          fullName,
          regEmail.trim(),
          regAvatar,
          cleanHandle,
          ageNum
        );
        showToast(
          isFr 
            ? (appName ? `Bienvenue sur ${appName}, ${fullName} !` : `Bienvenue sur LevelMovie, @${cleanHandle} !`) 
            : (appName ? `Welcome to ${appName}, ${fullName}!` : `Welcome to LevelMovie, @${cleanHandle}!`), 
          'success'
        );
        handleClose();
      } else {
        setTimeout(() => {
          setLoading(false);
          const uid = `usr_${Date.now()}`;
          localStorage.setItem('levelmovie_username', fullName);
          localStorage.setItem('levelmovie_user_name', fullName);
          localStorage.setItem('levelmovie_user_email', regEmail.trim());
          localStorage.setItem('levelmovie_user_handle', cleanHandle);
          localStorage.setItem('levelmovie_user_photo', regAvatar);
          localStorage.setItem('lm_photo', regAvatar);
          localStorage.setItem('levelmovie_user_age', String(ageNum));
          localStorage.setItem('levelmovie_user_uid', uid);
          localStorage.setItem(`lm_profile_completed_${uid}`, 'true');

          // Record weekly activity
          recordWeeklyLogin();

          const userObj = { name: fullName, email: regEmail.trim(), photo: regAvatar, uid, handle: cleanHandle };
          window.dispatchEvent(new CustomEvent('levelup_auth_state_change', {
            detail: { user: userObj }
          }));
          window.dispatchEvent(new CustomEvent('levelmovie_profile_change', {
            detail: { name: fullName, photo: regAvatar, email: regEmail.trim(), uid, handle: cleanHandle }
          }));
          onLoginSuccess(
            { id: uid, email: regEmail.trim() },
            fullName,
            regEmail.trim(),
            regAvatar,
            cleanHandle,
            ageNum
          );
          showToast(
            isFr 
              ? (appName ? `Bienvenue sur ${appName}, ${fullName} !` : `Bienvenue sur LevelMovie, @${cleanHandle} !`) 
              : (appName ? `Welcome to ${appName}, ${fullName}!` : `Welcome to LevelMovie, @${cleanHandle}!`), 
            'success'
          );
          handleClose();
        }, 400);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || (isFr ? 'Erreur lors de la création du compte.' : 'Account creation failed.'));
    }
  };

  // 5. Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail && !regEmail) {
      setErrorMsg(isFr ? 'Veuillez renseigner votre adresse e-mail.' : 'Please enter your email.');
      return;
    }

    const emailToReset = (loginEmail || regEmail).trim();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(emailToReset, {
          redirectTo: `${window.location.origin}/?reset_password=true`
        });
        if (error) throw error;
      }
      setLoading(false);
      navigateToView('view-forgot-password-sent');
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || (isFr ? 'Erreur lors de la demande.' : 'Request failed.'));
    }
  };

  // 6. Mandatory Google Onboarding (Step 1: @ID, Step 2: Âge, Step 3: Profil)
  const handleOnboardStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanHandle = formatUsernameInput(onboardUsername);
    if (!cleanHandle || cleanHandle.length < 3) {
      setErrorMsg(isFr ? 'L’identifiant doit comporter au moins 3 caractères.' : 'Username must be at least 3 characters.');
      return;
    }
    setOnboardStep(2);
  };

  const handleOnboardStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const ageNum = parseInt(onboardAge, 10);
    if (isNaN(ageNum) || ageNum < 16) {
      setErrorMsg(isFr ? 'Accès réservé aux personnes de 16 ans et plus.' : 'Access reserved for 16+ users.');
      return;
    }
    setOnboardStep(3);
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const autoHandle = (onboardFullName.trim() || 'user').toLowerCase().replace(/[^a-z0-9_]/g, '') || 'membre';
    const cleanHandle = formatUsernameInput(hideUsername ? autoHandle : (onboardUsername || autoHandle));
    const cleanName = onboardFullName.trim() || (hideUsername ? 'Membre' : 'Cinéphile');
    const ageNum = parseInt(onboardAge, 10) || 18;

    setLoading(true);

    try {
      if (isSupabaseConfigured() && supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.auth.updateUser({
            data: {
              username: cleanHandle,
              full_name: cleanName,
              avatar_url: onboardAvatar,
              age: ageNum,
              terms_accepted: true,
              profile_completed: true
            }
          });
        }
      }

      const uid = onboardingUser?.id || onboardingUser?.uid || `usr_${Date.now()}`;
      localStorage.setItem('levelmovie_username', cleanName);
      localStorage.setItem('levelmovie_user_name', cleanName);
      localStorage.setItem('levelmovie_user_handle', cleanHandle);
      localStorage.setItem('levelmovie_user_photo', onboardAvatar);
      localStorage.setItem('lm_photo', onboardAvatar);
      localStorage.setItem('levelmovie_user_age', String(ageNum));
      localStorage.setItem(`lm_profile_completed_${uid}`, 'true');

      // Record weekly activity
      recordWeeklyLogin();

      setLoading(false);
      onLoginSuccess(
        onboardingUser || { id: uid, email: 'google_user' },
        cleanName,
        onboardingUser?.email || '',
        onboardAvatar,
        cleanHandle,
        ageNum
      );
      showToast(
        isFr 
          ? (appName ? `Bienvenue sur ${appName}, ${cleanName} !` : `Bienvenue, @${cleanHandle} !`) 
          : (appName ? `Welcome to ${appName}, ${cleanName}!` : `Welcome, @${cleanHandle}!`), 
        'success'
      );
      handleClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || (isFr ? 'Erreur de finalisation.' : 'Error finalizing profile.'));
    }
  };

  // SINGLE SMART BACK NAVIGATION
  const handleSmartBack = () => {
    setErrorMsg('');
    if (currentView === 'view-main') {
      handleClose();
    } else if (currentView === 'view-register-choice') {
      navigateToView('view-main');
    } else if (currentView === 'view-login') {
      navigateToView('view-main');
    } else if (currentView === 'view-forgot-password' || currentView === 'view-forgot-password-sent') {
      navigateToView('view-login');
    } else if (currentView === 'view-register-credentials') {
      if (hideUsername) {
        if (regStep === 5) {
          setRegStep(4);
        } else if (regStep === 4) {
          setRegStep(3);
        } else {
          navigateToView('view-register-choice');
        }
      } else {
        if (regStep > 1) {
          setRegStep((prev) => (prev - 1) as any);
        } else {
          navigateToView('view-register-choice');
        }
      }
    } else if (currentView === 'view-onboarding') {
      if (hideUsername) {
        if (isSupabaseConfigured() && supabase) {
          supabase.auth.signOut().catch(() => {});
        }
        handleClose();
      } else if (onboardStep > 1) {
        setOnboardStep((prev) => (prev - 1) as any);
      } else {
        if (isSupabaseConfigured() && supabase) {
          supabase.auth.signOut().catch(() => {});
        }
        handleClose();
      }
    } else {
      navigateToView('view-main');
    }
  };

  if (!isOpen) return null;

  const isAgeRefused = parseInt(regAge, 10) < 16;
  const isOnboardAgeRefused = parseInt(onboardAge, 10) < 16;
  const isEcosystem = appName === 'LevelUp Ecosystem';

  return (
    <div className="fixed inset-0 z-[9600] w-full h-full flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200 font-sans overscroll-contain bg-[#0a0b12] text-[#e2e2e8]">
      
      {/* ======================================================== */}
      {/* GAUCHE: FORMULAIRE PRO & ÉPURÉ SANS POLLUTION VISUELLE   */}
      {/* ======================================================== */}
      <div 
        ref={scrollContainerRef} 
        className="w-full md:w-1/2 h-full flex flex-col justify-between items-center p-6 sm:p-8 lg:p-10 overflow-y-auto overscroll-contain touch-pan-y relative z-20 custom-scrollbar bg-[#0f1019] border-r border-[#1c1d2e] text-[#e2e2e8]"
      >
        
        {/* Conteneur Centré */}
        <div className="w-full max-w-md my-auto flex-1 flex flex-col justify-center py-4">
          
          <div className="w-full relative">
            
            {/* VUE 1 : ACCUEIL - EXACTEMENT 3 BOUTONS */}
            {currentView === 'view-main' && (
              <div className="animate-in fade-in duration-150">
                
                {/* Logo & Titre */}
                <div className="text-center mb-8">
                  {appName === 'LevelUp Ecosystem' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7c3aed]/15 border border-[#a855f7]/30 text-[#c084fc] text-[11px] font-bold mb-3 shadow-inner">
                      <LevelUpEcosystemStar className="w-3.5 h-3.5 text-[#a855f7]" color="currentColor" />
                      <span>{isFr ? 'Compte Unique Écosystème' : 'Unified Ecosystem Account'}</span>
                    </div>
                  )}
                  <div className="mx-auto mb-3.5 flex items-center justify-center">
                    {appName === 'LevelUp Ecosystem' ? (
                      <LevelUpEcosystemStar className="w-12 h-12 text-[#a855f7]" color="currentColor" />
                    ) : (
                      <LevelMovieLogo className="w-12 h-12 text-[#a855f7] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight text-white">
                    {appName === 'LevelUp Ecosystem' ? (
                      <>LevelUp <span className="text-[#a855f7]">Ecosystem</span></>
                    ) : (
                      <>Level<span className="text-[#a855f7]">Movie</span></>
                    )}
                  </h1>
                  <p className="text-white/60 text-xs sm:text-sm px-2 leading-relaxed">
                    {subtitle || (isFr 
                      ? (appName === 'LevelUp Ecosystem' ? 'Accédez à votre espace, vos projets et l’ensemble des services LevelUp.' : 'Accédez à votre espace cinéma, salons Watch Party et favoris.') 
                      : (appName === 'LevelUp Ecosystem' ? 'Access your unified account, projects and LevelUp services.' : 'Access cinema streaming, synchronized rooms, and watchlists.'))}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 3 BOUTONS PRO ACCUEIL */}
                <div className="space-y-3">
                  
                  {/* BOUTON 1: CRÉER UN COMPTE */}
                  <button
                    type="button"
                    onClick={() => navigateToView('view-register-choice')}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.99] cursor-pointer text-sm"
                  >
                    <UserPlus className="w-4 h-4 shrink-0" />
                    <span>{isFr ? 'Créer un compte' : 'Create an account'}</span>
                  </button>

                  {/* BOUTON 2: CONNEXION */}
                  <button
                    type="button"
                    onClick={() => navigateToView('view-login')}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold transition-all active:scale-[0.99] cursor-pointer text-sm bg-[#161726] hover:bg-[#1f2034] text-white border border-[#2b2d42] hover:border-[#a855f7]/50"
                  >
                    {appName === 'LevelUp Ecosystem' ? (
                      <LevelUpEcosystemStar className="w-4 h-4 text-[#a855f7] shrink-0" color="currentColor" />
                    ) : (
                      <LogIn className="w-4 h-4 text-[#c084fc] shrink-0" />
                    )}
                    <span>{isFr ? 'Se connecter' : 'Sign in'}</span>
                  </button>

                  {/* BOUTON 3: SORTIR */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all text-xs cursor-pointer bg-transparent hover:bg-white/5 text-white/50 hover:text-white"
                  >
                    <LogOut className="w-3.5 h-3.5 text-white/40" />
                    <span>{isFr ? 'Sortir' : 'Exit'}</span>
                  </button>

                </div>

              </div>
            )}

            {/* VUE 1.5 : CHOIX DU MOYEN DE CRÉATION DE COMPTE */}
            {currentView === 'view-register-choice' && (
              <div className="animate-in fade-in duration-150">
                
                {/* En-tête */}
                <div className="text-center mb-6">
                  {appName === 'LevelUp Ecosystem' && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7c3aed]/15 border border-[#a855f7]/30 text-[#c084fc] text-[11px] font-bold mb-2.5">
                      <LevelUpEcosystemStar className="w-3 h-3 text-[#a855f7]" color="currentColor" />
                      <span>{isFr ? 'Compte Unique LevelUp Ecosystem' : 'Unified LevelUp Ecosystem Account'}</span>
                    </div>
                  )}
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {isFr ? 'Créer un compte' : 'Create Account'}
                  </h2>
                  <p className="text-xs mt-1 max-w-xs mx-auto text-white/60">
                    {isFr 
                      ? (appName === 'LevelUp Ecosystem' ? 'Votre compte est automatiquement valable sur LevelMovie et toute la suite LevelUp.' : 'Choisissez votre méthode d’inscription :') 
                      : (appName === 'LevelUp Ecosystem' ? 'Your account is automatically valid on LevelMovie and the entire LevelUp suite.' : 'Choose your preferred signup method:')}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-3">
                  
                  {/* OPTION 1 : GOOGLE */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold transition-all shadow-sm active:scale-[0.99] cursor-pointer text-xs sm:text-sm bg-white hover:bg-neutral-100 text-neutral-900 border border-white"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>{isFr ? 'Continuer avec Google' : 'Continue with Google'}</span>
                  </button>

                  {/* OPTION 2 : ADRESSE E-MAIL */}
                  <button
                    type="button"
                    onClick={() => {
                      setRegStep(hideUsername ? 3 : 1);
                      navigateToView('view-register-credentials');
                    }}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold transition-all active:scale-[0.99] cursor-pointer text-xs sm:text-sm bg-[#161726] hover:bg-[#1f2034] text-white border border-[#2b2d42] hover:border-[#a855f7]/60"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-[#c084fc]" />
                    <span>{isFr ? 'S’inscrire avec une adresse e-mail' : 'Sign up with email'}</span>
                  </button>

                </div>

                {/* Lien connexion */}
                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() => navigateToView('view-login')}
                    className="text-xs transition-colors cursor-pointer text-white/60 hover:text-white"
                  >
                    {isFr ? (
                      <>Vous avez déjà un compte ? <span className="text-[#c084fc] font-bold">Se connecter</span></>
                    ) : (
                      <>Already have an account? <span className="text-[#c084fc] font-bold">Sign in</span></>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* VUE 2 : CONNEXION (2 SYSTÈMES : GOOGLE OU EMAIL) */}
            {currentView === 'view-login' && (
              <div className="animate-in fade-in duration-150">
                <div className="text-center mb-6">
                  {appName === 'LevelUp Ecosystem' && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7c3aed]/15 border border-[#a855f7]/30 text-[#c084fc] text-[11px] font-bold mb-2.5">
                      <LevelUpEcosystemStar className="w-3 h-3 text-[#a855f7]" color="currentColor" />
                      <span>{isFr ? 'Compte Unique LevelUp Ecosystem' : 'Unified LevelUp Ecosystem Account'}</span>
                    </div>
                  )}
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {appName === 'LevelUp Ecosystem' ? (isFr ? 'Connexion Ecosystem' : 'Ecosystem Sign In') : (isFr ? 'Connexion' : 'Sign In')}
                  </h2>
                  <p className="text-xs mt-1 text-white/50">
                    {isFr 
                      ? (appName === 'LevelUp Ecosystem' ? 'Un seul compte pour LevelMovie, vos Watch Parties et tout l\'écosystème :' : 'Identifiez-vous pour accéder à vos contenus :')
                      : (appName === 'LevelUp Ecosystem' ? 'One unified account for LevelMovie, Watch Parties and all ecosystem services:' : 'Sign in to access your contents:')}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* SYSTÈME 1 : GOOGLE */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3 rounded-xl font-bold transition-all shadow-sm cursor-pointer active:scale-[0.99] text-xs sm:text-sm bg-white hover:bg-neutral-100 text-neutral-900 border border-white"
                  >
                    <svg className="h-4 w-4 mr-2.5 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>{isFr ? 'Continuer avec Google' : 'Continue with Google'}</span>
                  </button>
                </div>

                {/* SÉPARATEUR */}
                <div className="relative my-4 flex items-center justify-center">
                  <div className="w-full border-t border-white/10" />
                  <span className="absolute px-3 bg-[#0f1019] text-white/40 text-[10px] font-bold uppercase tracking-wider">
                    {isFr ? 'ou avec identifiants e-mail' : 'or with email credentials'}
                  </span>
                </div>

                {/* SYSTÈME 2 : FORMULAIRE E-MAIL */}
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-white/70">
                      {isFr ? 'E-mail' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm outline-none transition-all bg-[#161726] border border-[#2b2d42] text-white placeholder-white/30 focus:border-[#a855f7] shadow-inner"
                      placeholder="nom@exemple.com"
                      autoFocus
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                        {isFr ? 'Mot de passe' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => navigateToView('view-forgot-password')}
                        className="text-xs font-medium cursor-pointer transition-colors text-[#c084fc] hover:text-white"
                      >
                        {isFr ? 'Oublié ?' : 'Forgot?'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm outline-none pr-10 transition-all bg-[#161726] border border-[#2b2d42] text-white placeholder-white/30 focus:border-[#a855f7] shadow-inner"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-white/40 hover:text-white"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  >
                    {loading ? (
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        {appName === 'LevelUp Ecosystem' && (
                          <LevelUpEcosystemStar className="w-4 h-4 text-white shrink-0" color="currentColor" />
                        )}
                        <span>{isFr ? 'Se connecter' : 'Sign In'}</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Lien Créer un compte */}
                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() => navigateToView('view-register-choice')}
                    className="text-xs transition-colors cursor-pointer text-white/60 hover:text-white"
                  >
                    {isFr ? (
                      <>{appName === 'LevelUp Ecosystem' ? 'Nouveau sur l’Ecosystem ?' : 'Nouveau sur LevelMovie ?'} <span className="text-[#c084fc] font-bold">Créer un compte</span></>
                    ) : (
                      <>{appName === 'LevelUp Ecosystem' ? 'New to Ecosystem?' : 'New to LevelMovie?' } <span className="text-[#c084fc] font-bold">Create account</span></>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* VUE 3 : MOT DE PASSE OUBLIÉ */}
            {currentView === 'view-forgot-password' && (
              <div className="animate-in fade-in duration-150">
                <div className="text-center mb-5">
                  <h2 className="text-2xl font-black text-white">
                    {isFr ? 'Mot de passe oublié' : 'Reset Password'}
                  </h2>
                  <p className="text-white/60 text-xs sm:text-sm mt-1">
                    {isFr 
                      ? 'Entrez votre e-mail pour recevoir le lien de réinitialisation.' 
                      : 'Enter your email to receive a password reset link.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-white/70">
                      {isFr ? 'E-mail' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm outline-none transition-all bg-[#161726] border border-[#2b2d42] text-white placeholder-white/30 focus:border-[#a855f7] shadow-inner"
                      placeholder="nom@exemple.com"
                      autoFocus
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  >
                    {loading ? (
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <span>{isFr ? 'Envoyer le lien' : 'Send Link'}</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* VUE 4 : MOT DE PASSE OUBLIÉ - ENVOYÉ */}
            {currentView === 'view-forgot-password-sent' && (
              <div className="text-center py-4 animate-in fade-in duration-150">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md bg-[#1c122c] border border-[#a855f7]/60 text-[#c084fc]">
                  <Key className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black mb-2 text-white">
                  {isFr ? 'E-mail transmis' : 'Email Dispatched'}
                </h2>
                <p className="text-white/60 text-xs sm:text-sm mb-6 leading-relaxed">
                  {isFr 
                    ? 'Un lien de réinitialisation sécurisé a été envoyé à votre adresse.' 
                    : 'A secure reset link has been dispatched to your email.'}
                </p>

                <button
                  type="button"
                  onClick={() => navigateToView('view-login')}
                  className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer active:scale-95 shadow-md bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                >
                  {isFr ? 'Retour à la connexion' : 'Back to Sign In'}
                </button>
              </div>
            )}

            {/* VUE 5 : CRÉATION DU COMPTE (5 ÉTAPES FLUIDES & ÉPURÉES) */}
            {currentView === 'view-register-credentials' && (
              <div className="animate-in fade-in duration-150">
                
                {/* Indicateur d'étape minimaliste */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-white/50 mb-2">
                    <span className="text-[#c084fc] font-mono">
                      {hideUsername 
                        ? (isFr ? `Étape ${regStep === 3 ? 1 : regStep === 4 ? 2 : 3} / 3` : `Step ${regStep === 3 ? 1 : regStep === 4 ? 2 : 3} / 3`)
                        : (isFr ? `Étape ${regStep} / 5` : `Step ${regStep} / 5`)}
                    </span>
                    <span className="text-white/80 font-medium">
                      {regStep === 1 && (isFr ? 'Identifiant' : 'Username')}
                      {regStep === 2 && (isFr ? 'Âge' : 'Age')}
                      {regStep === 3 && (isFr ? 'Identifiants' : 'Credentials')}
                      {regStep === 4 && (isFr ? 'Profil' : 'Profile')}
                      {regStep === 5 && (isFr ? 'Validation' : 'Security')}
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] transition-all duration-300 rounded-full"
                      style={{ 
                        width: hideUsername
                          ? `${((regStep === 3 ? 1 : regStep === 4 ? 2 : 3) / 3) * 100}%`
                          : `${(regStep / 5) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Titre sobre */}
                <div className="text-center mb-5">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {regStep === 1 && (isFr ? 'Identifiant unique' : 'Choose Username')}
                    {regStep === 2 && (isFr ? 'Votre âge' : 'Your Age')}
                    {regStep === 3 && (isFr ? 'Coordonnées' : 'Account Details')}
                    {regStep === 4 && (isFr ? 'Votre profil' : 'Profile Setup')}
                    {regStep === 5 && (isFr ? 'Confirmation' : 'Verification')}
                  </h2>
                  <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto">
                    {regStep === 1 && (isFr ? 'Définissez votre pseudonyme public.' : 'Set your unique @handle.')}
                    {regStep === 2 && (isFr ? '16 ans minimum requis pour accéder à la plateforme.' : '16+ minimum age required.')}
                    {regStep === 3 && (isFr ? 'Renseignez votre e-mail et un mot de passe.' : 'Enter your email and password.')}
                    {regStep === 4 && (isFr ? 'Sélectionnez un avatar et votre nom d’affichage.' : 'Choose your avatar and display name.')}
                    {regStep === 5 && (isFr ? `Saisissez le code transmis à ${regEmail}.` : `Enter the code sent to ${regEmail}.`)}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* ÉTAPE 1 : IDENTIFIANT */}
                {regStep === 1 && (
                  <form onSubmit={handleRegStep1} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                        {isFr ? 'Identifiant' : 'Username'}
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 font-bold">
                          @
                        </div>
                        <input
                          type="text"
                          value={regUsername}
                          onChange={(e) => setRegUsername(formatUsernameInput(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 rounded-xl text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none font-mono shadow-inner"
                          placeholder="mon_pseudo"
                          maxLength={24}
                          autoFocus
                          required
                        />
                      </div>

                      {/* Suggestions d'identifiants */}
                      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                        <span className="text-[10px] text-white/40">{isFr ? 'Exemples :' : 'Ideas:'}</span>
                        {['cine_fan', 'movie_vip', 'alex_cine', 'stream_hd'].map((sug, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setRegUsername(sug)}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-[#a855f7]/20 text-white/70 hover:text-[#d8b4fe] border border-white/10 transition-colors cursor-pointer"
                          >
                            @{sug}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={formatUsernameInput(regUsername).length < 3}
                      className="w-full py-3.5 mt-2 bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{isFr ? 'Continuer' : 'Continue'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* ÉTAPE 2 : ÂGE */}
                {regStep === 2 && (
                  <form onSubmit={handleRegStep2} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                        {isFr ? 'Âge' : 'Age'}
                      </label>
                      
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={regAge}
                          onChange={(e) => setRegAge(e.target.value)}
                          className={`w-full pl-10 pr-12 py-3 rounded-xl text-sm bg-[#14141e] border text-white placeholder-white/30 outline-none shadow-inner ${
                            isAgeRefused ? 'border-rose-500 text-rose-300' : 'border-[#2a2a3c] focus:border-[#a855f7]'
                          }`}
                          placeholder="18"
                          autoFocus
                          required
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 font-bold">
                          {isFr ? 'ans' : 'years'}
                        </span>
                      </div>

                      {/* Raccourcis */}
                      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                        {['16', '17', '18', '21', '25', '30'].map((a) => (
                          <button
                            key={a}
                            type="button"
                            onClick={() => setRegAge(a)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                              regAge === a 
                                ? 'bg-[#a855f7] text-white shadow-sm' 
                                : 'bg-white/5 hover:bg-white/10 text-white/60'
                            }`}
                          >
                            {a} {isFr ? 'ans' : 'yo'}
                          </button>
                        ))}
                      </div>

                      {isAgeRefused ? (
                        <div className="mt-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>{isFr ? 'Accès refusé (< 16 ans)' : 'Access denied (< 16 yo)'}</span>
                        </div>
                      ) : (
                        <div className="mt-2.5 text-[11px] text-white/50">
                          {parseInt(regAge, 10) < 18 
                            ? (isFr ? '🔒 Filtre 16-17 ans activé automatiquement.' : '🔒 16-17 safety filter enabled.')
                            : (isFr ? '🔓 Accès complet au catalogue.' : '🔓 Full catalog access.')}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isAgeRefused}
                      className="w-full py-3.5 mt-2 bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{isFr ? 'Continuer' : 'Continue'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* ÉTAPE 3 : COORDONNÉES */}
                {regStep === 3 && (
                  <form onSubmit={handleRegStep3} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                        {isFr ? 'Adresse e-mail' : 'Email'}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none shadow-inner"
                          placeholder="nom@exemple.com"
                          autoFocus
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                        {isFr ? 'Mot de passe' : 'Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full px-3.5 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none pr-10 shadow-inner"
                          placeholder="••••••••"
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                        {isFr ? 'Confirmer' : 'Confirm'}
                      </label>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none shadow-inner"
                        placeholder="••••••••"
                        minLength={6}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 mt-2 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{isFr ? 'Continuer' : 'Continue'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* ÉTAPE 4 : PROFIL & AVATAR EMOJI NETFLIX */}
                {regStep === 4 && (
                  <form onSubmit={handleRegStep4} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                        {isFr ? 'Nom d’affichage' : 'Display Name'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="text"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none shadow-inner"
                          placeholder={isFr ? "Grace Bonte" : "Grace Bonte"}
                          autoFocus
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                          {isFr ? 'Choisis ton avatar cinéma' : 'Choose your avatar'}
                        </label>
                        <span className="text-[10px] text-[#c084fc] font-bold">
                          {DEFAULT_AVATARS.find(a => a.id === regAvatar)?.name || (isFr ? 'Personnalisé' : 'Custom')}
                        </span>
                      </div>

                      {/* Aperçu du profil sélectionné */}
                      <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#14141e] border border-[#2a2a3c] shadow-inner mb-3">
                        <LevelAvatar 
                          avatar={regAvatar} 
                          name={regFullName || regUsername || 'Cinéphile'} 
                          size="lg" 
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-black text-white block truncate">
                            {regFullName || regUsername || 'Cinéphile'}
                          </span>
                          <span className="text-xs text-[#d8b4fe] font-mono">
                            @{regUsername || 'cinephile'}
                          </span>
                        </div>
                      </div>

                      {/* Grille Avatars SVG Pro */}
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-[190px] overflow-y-auto p-1 custom-scrollbar">
                        {DEFAULT_AVATARS.map((item) => {
                          const isSelected = regAvatar === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setRegAvatar(item.id)}
                              className={`relative group flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#22163b] border-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.35)] scale-105'
                                  : 'bg-[#14141e] border-[#222232] hover:border-white/30 hover:bg-[#1a1a28]'
                              }`}
                              title={item.name}
                            >
                              <div className="transform transition-transform group-hover:scale-110">
                                <LevelAvatar avatar={item.id} name={item.name} size="md" />
                              </div>
                              <span className="text-[9px] font-bold text-white/80 mt-1.5 truncate max-w-full text-center">
                                {item.name}
                              </span>
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#a855f7] text-white flex items-center justify-center text-[9px] font-black shadow-sm">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 mt-3 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{isFr ? 'Valider et continuer' : 'Validate & Continue'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* ÉTAPE 5 : VALIDATION & CODE VIA RESEND */}
                {regStep === 5 && (
                  <form onSubmit={handleRegStep5Submit} className="space-y-4">
                    
                    {/* Badge récapitulatif e-mail */}
                    <div className="p-3 rounded-xl bg-[#14141e] border border-[#a855f7]/30 flex items-center justify-between gap-3 shadow-inner">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center text-[#c084fc] shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] text-white/50">{isFr ? 'Code envoyé à :' : 'Code sent to:'}</div>
                          <div className="text-xs font-bold text-[#d8b4fe] truncate">{regEmail}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRegStep(3)}
                        className="text-[10px] text-white/50 hover:text-white underline cursor-pointer shrink-0"
                      >
                        {isFr ? 'Modifier' : 'Edit'}
                      </button>
                    </div>

                    {/* Champ Code 6 chiffres avec 6 cases distinctes */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                          {isFr ? 'Code de confirmation (6 chiffres)' : 'Confirmation Code (6 digits)'}
                        </label>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3" />
                          <span>{isFr ? 'E-mail Sécurisé' : 'Secure Email'}</span>
                        </span>
                      </div>

                      {/* 6 Discrete Input Boxes */}
                      <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                        {[0, 1, 2, 3, 4, 5].map((index) => {
                          const digit = verificationCode[index] || '';
                          return (
                            <input
                              key={index}
                              id={`otp-input-${index}`}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={digit}
                              autoFocus={index === 0}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                if (!val) {
                                  const arr = verificationCode.split('');
                                  arr[index] = '';
                                  setVerificationCode(arr.join(''));
                                  return;
                                }
                                const char = val.charAt(val.length - 1);
                                const arr = (verificationCode.padEnd(6, ' ')).split('');
                                arr[index] = char;
                                const newCode = arr.join('').trimEnd();
                                setVerificationCode(newCode.slice(0, 6));

                                if (index < 5) {
                                  const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement | null;
                                  nextInput?.focus();
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace') {
                                  if (!verificationCode[index] && index > 0) {
                                    const prevInput = document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement | null;
                                    prevInput?.focus();
                                  }
                                } else if (e.key === 'ArrowLeft' && index > 0) {
                                  const prevInput = document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement | null;
                                  prevInput?.focus();
                                } else if (e.key === 'ArrowRight' && index < 5) {
                                  const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement | null;
                                  nextInput?.focus();
                                }
                              }}
                              onPaste={(e) => {
                                e.preventDefault();
                                const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                                if (pasted) {
                                  setVerificationCode(pasted);
                                  const lastIndex = Math.min(pasted.length, 5);
                                  const targetInput = document.getElementById(`otp-input-${lastIndex}`) as HTMLInputElement | null;
                                  targetInput?.focus();
                                }
                              }}
                              className={`w-full aspect-square text-center font-mono text-lg sm:text-xl font-black rounded-xl border-2 transition-all outline-none ${
                                digit
                                  ? 'bg-[#1e1b38] border-[#c084fc] text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                                  : 'bg-[#14141e] border-white/10 text-white/40 focus:border-[#a855f7]/80 focus:bg-white/[0.04]'
                              }`}
                            />
                          );
                        })}
                      </div>

                      <p className="text-[11px] text-white/40 text-center mt-2.5">
                        {isFr ? 'Vérifie ta boîte de réception ou tes spams.' : 'Check your inbox or spam folder.'}
                      </p>
                    </div>

                    {/* Renvoi de code */}
                    <div className="text-center pt-1">
                      {codeSentTimer > 0 ? (
                        <p className="text-[11px] text-white/40 font-mono">
                          {isFr ? `Renvoyer le code dans ${codeSentTimer}s` : `Resend code in ${codeSentTimer}s`}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendCode}
                          className="text-xs text-[#c084fc] hover:text-white font-bold cursor-pointer transition-colors inline-flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{isFr ? 'Renvoyer un nouveau code' : 'Resend new code'}</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || verificationCode.length !== 6}
                      className="w-full py-4 mt-2 bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isFr ? 'Valider et créer mon compte' : 'Confirm & Create Account'}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

              </div>
            )}

            {/* VUE 6 : ONBOARDING GOOGLE SIMPLIFIÉ (3 ÉTAPES) */}
            {currentView === 'view-onboarding' && (
              <div className="animate-in fade-in duration-150">
                <div className="text-center mb-5">
                  <div className="inline-flex items-center justify-center p-2 rounded-full bg-[#1c122c] border border-[#a855f7]/40 mb-2">
                    <Sparkles className="w-5 h-5 text-[#c084fc]" />
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    {isFr ? 'Profil utilisateur' : 'Complete Profile'}
                  </h2>
                  <p className="text-xs text-white/60 mt-1 max-w-xs mx-auto">
                    {onboardStep === 1 && (isFr ? 'Choisissez votre identifiant unique @' : 'Choose unique @handle')}
                    {onboardStep === 2 && (isFr ? 'Indiquez votre âge' : 'Enter your age')}
                    {onboardStep === 3 && (isFr ? 'Vérifiez vos informations' : 'Confirm profile details')}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 shadow-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Onboard 1: ID */}
                {onboardStep === 1 && (
                  <form onSubmit={handleOnboardStep1} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                        {isFr ? 'Identifiant unique' : 'Unique ID'}
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">
                          @
                        </div>
                        <input
                          type="text"
                          value={onboardUsername}
                          onChange={(e) => setOnboardUsername(formatUsernameInput(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none font-mono shadow-inner"
                          placeholder="mon_pseudo"
                          maxLength={25}
                          autoFocus
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={formatUsernameInput(onboardUsername).length < 3}
                      className="w-full py-3.5 bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{isFr ? 'Continuer' : 'Continue'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* Onboard 2: Âge */}
                {onboardStep === 2 && (
                  <form onSubmit={handleOnboardStep2} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                        {isFr ? 'Âge' : 'Age'}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={onboardAge}
                          onChange={(e) => setOnboardAge(e.target.value)}
                          className={`w-full pl-10 pr-12 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border text-white placeholder-white/30 outline-none shadow-inner ${
                            isOnboardAgeRefused ? 'border-rose-500 text-rose-300' : 'border-[#2a2a3c] focus:border-[#a855f7]'
                          }`}
                          placeholder="18"
                          autoFocus
                          required
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 font-bold">
                          {isFr ? 'ans' : 'years'}
                        </span>
                      </div>

                      {isOnboardAgeRefused && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>{isFr ? '16 ans minimum requis.' : '16+ minimum required.'}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isOnboardAgeRefused}
                      className="w-full py-3.5 bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{isFr ? 'Continuer' : 'Continue'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* Onboard 3: Profil & Finalisation */}
                {onboardStep === 3 && (
                  <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                        {isFr ? 'Nom d’affichage' : 'Display Name'}
                      </label>
                      <input
                        type="text"
                        value={onboardFullName}
                        onChange={(e) => setOnboardFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none shadow-inner"
                        placeholder="Grace Bonte"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                          {isFr ? 'Choisis ton avatar profil' : 'Choose your avatar'}
                        </label>
                        <span className="text-[10px] text-[#c084fc] font-bold">
                          {DEFAULT_AVATARS.find(a => a.id === onboardAvatar)?.name || (isFr ? 'Profil Cinéma' : 'Movie Profile')}
                        </span>
                      </div>

                      {/* Aperçu du profil sélectionné */}
                      <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#14141e] border border-[#2a2a3c] shadow-inner mb-3">
                        <LevelAvatar 
                          avatar={onboardAvatar} 
                          name={onboardFullName || onboardUsername || 'Cinéphile'} 
                          size="lg" 
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-black text-white block truncate">
                            {onboardFullName || (hideUsername ? 'Membre' : (onboardUsername || 'Cinéphile'))}
                          </span>
                          {!hideUsername && (
                            <span className="text-xs text-[#d8b4fe] font-mono">
                              @{onboardUsername || 'cinephile'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Grille Avatars SVG Pro */}
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-[180px] overflow-y-auto p-1 custom-scrollbar">
                        {DEFAULT_AVATARS.map((item) => {
                          const isSelected = onboardAvatar === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setOnboardAvatar(item.id)}
                              className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#2b1842] border-[#a855f7] ring-1 ring-[#a855f7]/60 shadow-[0_0_12px_rgba(168,85,247,0.35)] scale-105'
                                  : 'bg-[#12121c] border-[#222232] hover:border-white/30 hover:bg-[#1a1a28]'
                              }`}
                              title={item.name}
                            >
                              <div className="transform transition-transform group-hover:scale-110">
                                <LevelAvatar avatar={item.id} name={item.name} size="md" />
                              </div>
                              <span className="text-[9px] font-bold text-white/70 mt-1.5 truncate max-w-full text-center">
                                {item.name}
                              </span>
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#a855f7] flex items-center justify-center text-white text-[9px] shadow-sm">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <span>{isFr ? 'Accéder à LevelMovie' : 'Enter LevelMovie'}</span>
                      )}
                    </button>
                  </form>
                )}

              </div>
            )}

          </div>

          {/* ======================================================== */}
          {/* BOUTON RETOUR INTELLIGENT UNIQUE EN BAS                   */}
          {/* ======================================================== */}
          {currentView !== 'view-main' && (
            <div className="w-full flex flex-col gap-2 mt-6 pt-4 border-t border-[#1e2030]">
              <button
                type="button"
                onClick={handleSmartBack}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all text-xs font-bold cursor-pointer active:scale-95 shadow-sm bg-[#161726] hover:bg-[#1f2034] text-white/80 hover:text-white border border-[#28293d]"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#c084fc]" />
                <span>{isFr ? 'Retour' : 'Back'}</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* ======================================================== */}
      {/* DROITE: VITRINE CINÉMA OU ECOSYSTEM                      */}
      {/* ======================================================== */}
      {isEcosystem ? (
        <div className="hidden md:flex md:w-1/2 h-full relative bg-gradient-to-br from-[#151426] via-[#0f101a] to-[#080910] border-l border-[#1c1d2e] overflow-hidden flex-col justify-between p-8 lg:p-12 text-white">
          
          {/* Top branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <LevelUpEcosystemStar className="w-5 h-5 text-[#a855f7]" color="currentColor" />
              <span className="text-sm font-black tracking-tight text-white">LevelUp <span className="text-[#a855f7]">Ecosystem</span></span>
            </div>
          </div>

          {/* Center Showcase */}
          <div className="space-y-4 my-auto py-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                Un compte unique pour l’ensemble de vos applications.
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-2 leading-relaxed">
                Connectez-vous en continu à vos services streaming, salons synchronisés, audio et assistant climatique quotidien.
              </p>
            </div>

            {/* Apps preview cards with REAL logos (sans bulles) */}
            <div className="grid grid-cols-1 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#a855f7]/50 transition-colors flex items-center gap-3.5 shadow-sm">
                <LevelMovieLogo className="w-7 h-7 shrink-0 text-[#c084fc]" useGradient={true} />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white">LevelMovie</div>
                  <div className="text-[11px] text-white/50 truncate">Cinéma Ultra-HD 4K & Salons synchronisés</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-indigo-500/50 transition-colors flex items-center gap-3.5 shadow-sm">
                <LevelMusicLogo className="w-7 h-7 shrink-0" useGradient={true} />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white">LevelMusic</div>
                  <div className="text-[11px] text-white/50 truncate">Audio haute fidélité & Salons d’écoute partagés</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-500/50 transition-colors flex items-center gap-3.5 shadow-sm">
                <LevelDayLogo className="w-7 h-7 shrink-0" useGradient={true} />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white">LevelDay</div>
                  <div className="text-[11px] text-white/50 truncate">Météo en direct & assistant climatique quotidien</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-sky-500/50 transition-colors flex items-center gap-3.5 shadow-sm">
                <LevelStudioLogo className="w-7 h-7 shrink-0" useGradient={true} />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white">LevelStudio</div>
                  <div className="text-[11px] text-white/50 truncate">Création de sites web professionnels & Studio créatif (dès $560)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom info */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-medium">
            <span>LevelUp Ecosystem</span>
            <span>Suite Applicative Intégrée</span>
          </div>

        </div>
      ) : (
        <div className="hidden md:flex md:w-1/2 h-full relative bg-gradient-to-br from-[#120a22] to-[#080911] overflow-hidden flex-col justify-between p-10 lg:p-14">
          
          {/* Animated Background poster */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-35 transition-all duration-1000 scale-105"
            style={{ backgroundImage: `url(${showcasePosters[posterIndex].bg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060609] via-[#060609]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c12] via-transparent to-[#060609]/40" />

          {/* Top badge */}
          <div className="relative z-10 flex items-center justify-end">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-black">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{showcasePosters[posterIndex].rating}</span>
            </div>
          </div>

          {/* Center Poster Title */}
          <div className="relative z-10 space-y-3">
            <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {showcasePosters[posterIndex].title}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
              {showcasePosters[posterIndex].overview || (isFr 
                ? 'Accédez à des milliers de films et séries, organisez vos Watch Parties en direct.' 
                : 'Stream thousands of movies and host synchronized Watch Parties.')}
            </p>
          </div>

          {/* Bottom indicators */}
          <div className="relative z-10 flex items-center gap-2 pt-4">
            {showcasePosters.map((_, i) => (
              <button
                key={i}
                onClick={() => setPosterIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  posterIndex === i ? 'w-10 bg-[#a855f7]' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
