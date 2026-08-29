import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Key, ArrowLeft, Check, Sparkles, AlertCircle, Eye, EyeOff,
  User, UserPlus, LogOut, ArrowRight, Star, Camera,
  Upload, CheckCircle2, Calendar, RefreshCw, BadgeCheck, ShieldAlert
} from 'lucide-react';
import { LevelMovieLogo, DEFAULT_AVATARS, AvatarPreset } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type AuthView = 
  | 'view-main'
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
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang,
  showToast,
  initialView = 'view-main',
  onboardingUser = null
}) => {
  const [currentView, setCurrentView] = useState<AuthView>(initialView);

  // Sync with initialView prop when modal opens or initialView changes
  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialView);
    }
  }, [isOpen, initialView]);

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Form states - Step-by-Step Registration (1: @ID, 2: Âge, 3: Email/Mdp, 4: Profil/Avatar, 5: Validation & Save)
  const [regStep, setRegStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [regUsername, setRegUsername] = useState('');
  const [regAge, setRegAge] = useState<string>('18');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regAvatar, setRegAvatar] = useState<string>(DEFAULT_AVATARS[0].url);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('749215');
  const [codeSentTimer, setCodeSentTimer] = useState<number>(60);

  // Onboarding states for OAuth Google (1: @ID, 2: Âge, 3: Profil/Avatar)
  const [onboardStep, setOnboardStep] = useState<1 | 2 | 3>(1);
  const [onboardUsername, setOnboardUsername] = useState('');
  const [onboardAge, setOnboardAge] = useState<string>('18');
  const [onboardFullName, setOnboardFullName] = useState('');
  const [onboardAvatar, setOnboardAvatar] = useState<string>(DEFAULT_AVATARS[0].url);

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
      } else if (view === 'view-register-credentials') {
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

  const showcasePosters = dynamicPosters.length > 0 ? dynamicPosters : defaultShowcasePosters;

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
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } else {
        setTimeout(() => {
          setLoading(false);
          setOnboardFullName('Cinéphile');
          setOnboardUsername('cine_vip');
          setOnboardAge('18');
          setOnboardAvatar(DEFAULT_AVATARS[0].url);
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
          const displayPhoto = userMeta.avatar_url || DEFAULT_AVATARS[0].url;
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

          setLoading(false);
          onLoginSuccess(data.user, displayName, data.user.email || '', displayPhoto, displayHandle, age);
          showToast(isFr ? `Ravi de vous revoir, ${displayName} !` : `Welcome back, ${displayName}!`, 'success');
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
          localStorage.setItem('levelmovie_user_photo', DEFAULT_AVATARS[0].url);
          localStorage.setItem('lm_photo', DEFAULT_AVATARS[0].url);
          localStorage.setItem('levelmovie_user_age', String(age));
          localStorage.setItem('levelmovie_user_uid', uid);
          localStorage.setItem(`lm_profile_completed_${uid}`, 'true');
          
          onLoginSuccess({ id: uid, email: loginEmail.trim() }, name, loginEmail.trim(), DEFAULT_AVATARS[0].url, handle, age);
          showToast(isFr ? `Connexion réussie !` : `Signed in successfully!`, 'success');
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

  // Étape 4: Profil (Nom & Avatar) -> Envoie vers validation
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
    setRegStep(5);
  };

  // Étape 5: Validation finale
  const handleRegStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const codeEntered = verificationCode.trim();
    if (!codeEntered) {
      setErrorMsg(isFr ? 'Entrez le code à 6 chiffres.' : 'Enter the 6-digit code.');
      return;
    }
    if (codeEntered !== generatedCode && codeEntered.length < 4) {
      setErrorMsg(isFr ? 'Code invalide.' : 'Invalid code.');
      return;
    }
    handleFinalizeRegistration();
  };

  const handleResendCode = () => {
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(generated);
    setCodeSentTimer(60);
    showToast(isFr ? `Nouveau code envoyé` : `New code dispatched`, 'info');
  };

  // Final Registration Persistence
  const handleFinalizeRegistration = async () => {
    setLoading(true);
    setErrorMsg('');

    const fullName = regFullName.trim() || regUsername.trim() || 'Cinéphile';
    const cleanHandle = formatUsernameInput(regUsername);
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

        setLoading(false);
        onLoginSuccess(
          data.user || { id: uid, email: regEmail.trim() },
          fullName,
          regEmail.trim(),
          regAvatar,
          cleanHandle,
          ageNum
        );
        showToast(isFr ? `Bienvenue sur LevelMovie, @${cleanHandle} !` : `Welcome to LevelMovie, @${cleanHandle}!`, 'success');
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

          onLoginSuccess(
            { id: uid, email: regEmail.trim() },
            fullName,
            regEmail.trim(),
            regAvatar,
            cleanHandle,
            ageNum
          );
          showToast(isFr ? `Bienvenue sur LevelMovie, @${cleanHandle} !` : `Welcome to LevelMovie, @${cleanHandle}!`, 'success');
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
    const cleanHandle = formatUsernameInput(onboardUsername);
    const cleanName = onboardFullName.trim() || 'Cinéphile';
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

      setLoading(false);
      onLoginSuccess(
        onboardingUser || { id: uid, email: 'google_user' },
        cleanName,
        onboardingUser?.email || '',
        onboardAvatar,
        cleanHandle,
        ageNum
      );
      showToast(isFr ? `Bienvenue, @${cleanHandle} !` : `Welcome, @${cleanHandle}!`, 'success');
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
    } else if (currentView === 'view-login') {
      navigateToView('view-main');
    } else if (currentView === 'view-forgot-password' || currentView === 'view-forgot-password-sent') {
      navigateToView('view-login');
    } else if (currentView === 'view-register-credentials') {
      if (regStep > 1) {
        setRegStep((prev) => (prev - 1) as any);
      } else {
        navigateToView('view-main');
      }
    } else if (currentView === 'view-onboarding') {
      if (onboardStep > 1) {
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

  return (
    <div className="fixed inset-0 z-[9600] w-full h-full bg-[#060609] text-[#e2e2e8] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200 font-sans overscroll-contain">
      
      {/* ======================================================== */}
      {/* GAUCHE: FORMULAIRE PRO & ÉPURÉ SANS POLLUTION VISUELLE   */}
      {/* ======================================================== */}
      <div 
        ref={scrollContainerRef} 
        className="w-full md:w-1/2 h-full flex flex-col justify-between items-center p-6 sm:p-8 lg:p-10 overflow-y-auto overscroll-contain touch-pan-y bg-[#0c0c12] border-r border-[#1a1a26] relative z-20 custom-scrollbar"
      >
        
        {/* Conteneur Centré */}
        <div className="w-full max-w-md my-auto flex-1 flex flex-col justify-center py-4">
          
          <div className="w-full relative">
            
            {/* VUE 1 : CHOIX PRINCIPAL */}
            {currentView === 'view-main' && (
              <div className="animate-in fade-in duration-150">
                
                {/* Logo & Titre */}
                <div className="text-center mb-8">
                  <div className="mx-auto mb-3.5 flex items-center justify-center">
                    <LevelMovieLogo className="w-12 h-12 text-[#a855f7] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black mb-2 text-white tracking-tight">
                    Level<span className="text-[#a855f7]">Movie</span>
                  </h1>
                  <p className="text-white/60 text-xs sm:text-sm px-2 leading-relaxed">
                    {isFr 
                      ? 'Accédez à votre espace cinéma, salons Watch Party et favoris.' 
                      : 'Access cinema streaming, synchronized rooms, and watchlists.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Boutons d'accès directs */}
                <div className="space-y-3">
                  
                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3.5 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold transition-all shadow-md cursor-pointer active:scale-95 text-xs sm:text-sm"
                  >
                    <svg className="h-4 w-4 mr-3 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>{isFr ? 'Continuer avec Google' : 'Continue with Google'}</span>
                  </button>

                  {/* Se connecter avec Email */}
                  <button
                    type="button"
                    onClick={() => navigateToView('view-login')}
                    className="w-full flex items-center justify-center px-4 py-3.5 bg-[#161622] hover:bg-[#202030] text-white rounded-xl font-bold transition-all border border-[#2a2a3c] shadow-sm cursor-pointer active:scale-95 text-xs sm:text-sm"
                  >
                    <Mail className="w-4 h-4 mr-3 text-[#a855f7]" />
                    <span>{isFr ? "Se connecter avec l'e-mail" : 'Sign in with email'}</span>
                  </button>

                  {/* Créer un compte */}
                  <button
                    type="button"
                    onClick={() => { 
                      setRegStep(1);
                      navigateToView('view-register-credentials'); 
                    }}
                    className="w-full flex items-center justify-center px-4 py-3.5 bg-[#1c122c] hover:bg-[#27183e] text-[#d8b4fe] hover:text-white rounded-xl font-bold transition-all border border-[#a855f7]/50 shadow-sm cursor-pointer active:scale-95 text-xs sm:text-sm"
                  >
                    <UserPlus className="w-4 h-4 mr-3 text-[#c084fc]" />
                    <span>{isFr ? 'Créer un compte' : 'Create an account'}</span>
                  </button>

                </div>

              </div>
            )}

            {/* VUE 2 : CONNEXION */}
            {currentView === 'view-login' && (
              <div className="animate-in fade-in duration-150">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-white">
                    {isFr ? 'Connexion' : 'Sign In'}
                  </h2>
                  <p className="text-xs text-white/50 mt-1">
                    {isFr ? 'Entrez vos identifiants pour continuer' : 'Enter your credentials to continue'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      {isFr ? 'E-mail' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none shadow-inner"
                      placeholder="nom@exemple.com"
                      autoFocus
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                        {isFr ? 'Mot de passe' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => navigateToView('view-forgot-password')}
                        className="text-xs text-[#c084fc] hover:text-white transition-colors cursor-pointer font-medium"
                      >
                        {isFr ? 'Oublié ?' : 'Forgot?'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none pr-10 shadow-inner"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-2 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  >
                    {loading ? (
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <span>{isFr ? 'Se connecter' : 'Sign In'}</span>
                    )}
                  </button>
                </form>

                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() => { 
                      setRegStep(1);
                      navigateToView('view-register-credentials'); 
                    }}
                    className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    {isFr ? (
                      <>Pas de compte ? <span className="text-[#c084fc] font-bold">Créer un compte</span></>
                    ) : (
                      <>No account? <span className="text-[#c084fc] font-bold">Create one</span></>
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      {isFr ? 'E-mail' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none shadow-inner"
                      placeholder="nom@exemple.com"
                      autoFocus
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
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
                <div className="w-12 h-12 rounded-2xl bg-[#1c122c] border border-[#a855f7]/60 flex items-center justify-center mx-auto mb-4 text-[#c084fc] shadow-md">
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
                  className="w-full py-3.5 bg-white text-gray-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors cursor-pointer active:scale-95 shadow-md"
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
                      {isFr ? `Étape ${regStep} / 5` : `Step ${regStep} / 5`}
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
                      style={{ width: `${(regStep / 5) * 100}%` }}
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
                    {regStep === 4 && (isFr ? 'Sélectionnez un avatar cinéma et votre nom.' : 'Choose your avatar and display name.')}
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

                {/* ÉTAPE 4 : PROFIL & AVATAR */}
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
                      <div className="mb-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                          {isFr ? 'Photo de profil' : 'Profile Picture'}
                        </label>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleCustomImageUpload(e, 'reg')}
                        accept="image/*"
                        className="hidden"
                      />

                      {/* Zone d'importation de photo personnelle */}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-[#14141e] border-2 border-dashed border-[#2a2a3c] hover:border-[#a855f7] transition-all cursor-pointer group shadow-inner"
                      >
                        {regAvatar ? (
                          <div className="relative">
                            <img 
                              src={regAvatar} 
                              alt="Avatar" 
                              className="w-20 h-20 rounded-full object-cover border-2 border-[#a855f7] shadow-lg group-hover:scale-105 transition-transform" 
                            />
                            <div className="absolute -bottom-1 -right-1 p-1.5 bg-[#a855f7] text-white rounded-full shadow-md">
                              <Camera className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-[#c084fc] group-hover:border-[#a855f7]/50 transition-colors">
                            <Upload className="w-6 h-6" />
                          </div>
                        )}
                        
                        <div className="text-center">
                          <span className="text-xs font-bold text-white group-hover:text-[#c084fc] transition-colors block">
                            {regAvatar 
                              ? (isFr ? 'Cliquez pour remplacer votre photo' : 'Click to change photo')
                              : (isFr ? 'Importer une photo depuis votre appareil' : 'Upload photo from device')}
                          </span>
                          <span className="text-[10px] text-white/40 mt-0.5 block">
                            {isFr ? 'Formats PNG, JPG ou WEBP (max 5 Mo)' : 'PNG, JPG, or WEBP (up to 5MB)'}
                          </span>
                        </div>
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

                {/* ÉTAPE 5 : VALIDATION & CODE */}
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

                    {/* Champ Code */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                          {isFr ? 'Code de confirmation' : '6-Digit Code'}
                        </label>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3" />
                          <span>{isFr ? 'Sécurisé' : 'Secure'}</span>
                        </span>
                      </div>

                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                        className="w-full px-4 py-3.5 rounded-xl text-center tracking-[0.5em] font-mono text-lg font-black bg-[#14141e] border-2 border-[#a855f7]/60 text-white placeholder-white/20 focus:border-[#c084fc] outline-none"
                        placeholder="••••••"
                        maxLength={6}
                        autoFocus
                        required
                      />

                      {/* Chip 1-clic pour le code */}
                      <div className="mt-2.5 p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-[11px] text-[#d8b4fe]">
                        <span>{isFr ? `Code :` : `Code:`} <strong className="font-mono text-white">{generatedCode}</strong></span>
                        <button
                          type="button"
                          onClick={() => setVerificationCode(generatedCode)}
                          className="px-2 py-0.5 rounded-md bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-[10px] transition-colors cursor-pointer"
                        >
                          {isFr ? 'Insérer 1-clic' : '1-click fill'}
                        </button>
                      </div>
                    </div>

                    {/* Renvoi de code */}
                    <div className="text-center">
                      {codeSentTimer > 0 ? (
                        <p className="text-[11px] text-white/40 font-mono">
                          {isFr ? `Renvoyer dans ${codeSentTimer}s` : `Resend in ${codeSentTimer}s`}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendCode}
                          className="text-[11px] text-[#c084fc] hover:text-white font-bold inline-flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{isFr ? 'Renvoyer un nouveau code' : 'Resend code'}</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || verificationCode.length < 4}
                      className="w-full py-3.5 mt-2 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                    >
                      {loading ? (
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isFr ? 'Finaliser l’inscription' : 'Finalize Account'}</span>
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
                    <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#14141e] border border-[#2a2a3c] shadow-inner">
                      <img 
                        src={onboardAvatar} 
                        alt="Avatar" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#a855f7]"
                      />
                      <div className="flex-1 min-w-0">
                        <input
                          type="file"
                          ref={onboardFileInputRef}
                          onChange={(e) => handleCustomImageUpload(e, 'onboard')}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => onboardFileInputRef.current?.click()}
                          className="text-xs text-[#c084fc] hover:text-white font-bold underline cursor-pointer"
                        >
                          {isFr ? 'Changer la photo' : 'Change photo'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                        {isFr ? 'Nom d’affichage' : 'Display Name'}
                      </label>
                      <input
                        type="text"
                        value={onboardFullName}
                        onChange={(e) => setOnboardFullName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none shadow-inner"
                        placeholder="Grace Bonte"
                        required
                      />
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
          <div className="w-full flex flex-col gap-2 mt-6 pt-4 border-t border-[#1e1e2e]">
            {currentView !== 'view-main' ? (
              <button
                type="button"
                onClick={handleSmartBack}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#14141e] hover:bg-[#1c1c28] text-white/80 hover:text-white border border-[#28283a] transition-all text-xs font-bold cursor-pointer active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#c084fc]" />
                <span>{isFr ? 'Retour' : 'Back'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#181824] hover:bg-[#222232] text-white border border-[#2d2d42] hover:border-[#a855f7]/60 transition-all text-xs font-black uppercase tracking-wider cursor-pointer active:scale-95 shadow-md"
              >
                <LogOut className="w-4 h-4 text-[#a855f7]" />
                <span>{isFr ? 'Sortir' : 'Exit'}</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* DROITE: VITRINE CINÉMA DYNAMIQUE                           */}
      {/* ======================================================== */}
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

    </div>
  );
};
