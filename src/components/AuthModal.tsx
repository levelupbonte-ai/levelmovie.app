import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mail, Key, ArrowLeft, Check, Sparkles, AlertCircle, Eye, EyeOff,
  User, UserPlus, LogOut, ArrowRight, ShieldCheck, Star, Flame, Lock,
  ChevronRight, Camera, Upload, Image as ImageIcon, AtSign, CheckCircle2
} from 'lucide-react';
import { LevelMovieLogo, DEFAULT_AVATARS, AvatarPreset } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any, name: string, email: string, photo?: string | null, handle?: string) => void;
  lang: string;
  showToast: (msg: string, type?: string) => void;
  initialView?: AuthView;
  onboardingUser?: any;
}

// Subviews corresponding to auth steps and mandatory onboarding
export type AuthView = 
  | 'view-main'                 // Choix principal (Google, E-mail, Créer un compte)
  | 'view-login'                // Connexion par email/mot de passe classique
  | 'view-forgot-password'      // Saisie de l'email pour mot de passe oublié
  | 'view-forgot-password-sent' // Confirmation d'envoi de l'email de réinitialisation
  | 'view-register-step1'       // Étape 1 : ID Utilisateur (@username), Prénom/Nom, Photo de profil
  | 'view-register-step2'       // Étape 2 : Email et Mot de passe
  | 'view-register-step3'       // Étape 3 : Validation / Confirmation Email
  | 'view-onboarding';          // Finalisation obligatoire du profil (Google ou nouvel utilisateur)

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

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register multi-step states (including custom User ID & Avatar)
  const [regUsername, setRegUsername] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regAvatar, setRegAvatar] = useState<string>(DEFAULT_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);

  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Onboarding states (for Google auth or first-time setup)
  const [onboardUsername, setOnboardUsername] = useState('');
  const [onboardFullName, setOnboardFullName] = useState('');
  const [onboardAvatar, setOnboardAvatar] = useState<string>(DEFAULT_AVATARS[0].url);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const onboardFileInputRef = useRef<HTMLInputElement | null>(null);

  // Right side dynamic posters showcase (PC view)
  const showcasePosters = [
    { title: 'Dune: Part Two', bg: 'https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', rating: '8.6' },
    { title: 'Oppenheimer', bg: 'https://image.tmdb.org/t/p/w780/ptpr0kGAckfQkJeJIt8st5dglvd.jpg', rating: '8.9' },
    { title: 'Spider-Man: Across the Spider-Verse', bg: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', rating: '8.7' },
    { title: 'Stranger Things', bg: 'https://image.tmdb.org/t/p/w780/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', rating: '8.8' }
  ];

  const [posterIndex, setPosterIndex] = useState(0);

  useEffect(() => {
    if (initialView) {
      setCurrentView(initialView);
    }
  }, [initialView]);

  useEffect(() => {
    if (onboardingUser) {
      const meta = onboardingUser.user_metadata || {};
      const existingName = meta.full_name || meta.name || onboardingUser.email?.split('@')[0] || '';
      setOnboardFullName(existingName);
      
      const suggestedUsername = (meta.username || meta.user_name || existingName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()).slice(0, 20);
      setOnboardUsername(suggestedUsername);

      const existingPhoto = meta.avatar_url || meta.picture || onboardingUser.photoURL || DEFAULT_AVATARS[0].url;
      setOnboardAvatar(existingPhoto);
      setCurrentView('view-onboarding');
    }
  }, [onboardingUser]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setPosterIndex((prev) => (prev + 1) % showcasePosters.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, showcasePosters.length]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  if (!isOpen) return null;

  const isFr = lang === 'fr';

  const formatUsernameInput = (val: string) => {
    return val
      .replace(/^@+/, '')
      .replace(/[\s\t\n]+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .toLowerCase();
  };

  const resetAll = () => {
    setCurrentView('view-main');
    setLoginEmail('');
    setLoginPassword('');
    setRegUsername('');
    setRegFirstName('');
    setRegLastName('');
    setRegAvatar(DEFAULT_AVATARS[0].url);
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
    setForgotEmail('');
    setErrorMsg('');
    setLoading(false);
  };

  const handleClose = () => {
    // Si l'utilisateur est en plein onboarding obligatoire, l'avertir
    if (currentView === 'view-onboarding' && onboardingUser) {
      // Allow closing but inform user
    }
    resetAll();
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'register' | 'onboard') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg(isFr ? 'L’image est trop volumineuse (max 2 Mo).' : 'Image is too large (max 2MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        if (target === 'register') {
          setRegAvatar(dataUrl);
        } else {
          setOnboardAvatar(dataUrl);
        }
        showToast(isFr ? 'Photo chargée avec succès !' : 'Photo loaded successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Google OAuth Auth
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');

    console.group('🚀 [LEVELMOVIE AUTH] Tentative de connexion Google OAuth');
    console.log('📍 Origine du site :', window.location.origin);
    console.log('🌐 Supabase URL :', 'https://epprgkolsywdfouffpmj.supabase.co');
    console.log('🔑 Callback URL OAuth :', 'https://epprgkolsywdfouffpmj.supabase.co/auth/v1/callback');
    console.log('🆔 Google Client ID :', '1003902678826-lf8i7bmm77gjlp7cviate5og0n1s1924.apps.googleusercontent.com');

    if (isSupabaseConfigured && supabase) {
      try {
        const redirectUrl = window.location.origin;
        console.log('⏳ Génération de l’URL d’authentification Google via Supabase...');
        console.log('🔗 Redirect Target URL :', redirectUrl);

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: true,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        });
        if (error) {
          console.error('❌ Erreur renvoyée par Supabase OAuth :', error);
          throw error;
        }
        console.log('✅ URL OAuth générée avec succès :', data?.url);
        
        if (data?.url) {
          const width = 520;
          const height = 650;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2.5;
          const popup = window.open(
            data.url,
            'google_oauth_popup',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=no,toolbar=no,menubar=no`
          );

          if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            if (window.top && window.self !== window.top) {
              window.top.location.href = data.url;
            } else {
              window.location.href = data.url;
            }
          } else {
            popup.focus();
            setLoading(false);
            handleClose();
            showToast(isFr ? 'Veuillez sélectionner votre compte Google dans la fenêtre...' : 'Please select your Google account in the popup...', 'info');
          }
        }
      } catch (err: any) {
        console.error('❌ Exception attrapée lors de la connexion Google :', err);
        setLoading(false);
        setErrorMsg(err.message || (isFr ? 'Erreur lors de la redirection Google.' : 'Error during Google sign-in.'));
      } finally {
        console.groupEnd();
      }
    } else {
      console.warn('⚠️ Supabase n’est pas configuré.');
      console.groupEnd();
      setTimeout(() => {
        setLoading(false);
        setErrorMsg(isFr ? 'Configuration Supabase non détectée.' : 'Supabase configuration not detected.');
      }, 400);
    }
  };

  // Login Email submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg(isFr ? 'Veuillez renseigner votre email et mot de passe.' : 'Please enter your email and password.');
      return;
    }

    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword
        });
        if (error) {
          if (error.message.toLowerCase().includes('email not confirmed')) {
            setErrorMsg(isFr 
              ? 'Votre adresse email n’a pas encore été confirmée. Veuillez cliquer sur le lien d’activation reçu par email avant de vous connecter.' 
              : 'Email not confirmed. Please click the verification link sent to your email address before logging in.');
            return;
          }
          throw error;
        }

        const meta = data.user?.user_metadata || {};
        const name = meta.full_name || loginEmail.split('@')[0];
        const userEmail = data.user?.email || loginEmail;
        const handle = meta.username || meta.user_name || '';
        const photo = meta.avatar_url || null;

        // Si l'utilisateur n'a pas encore configuré son ID utilisateur (@username), on déclenche l'onboarding
        if (!handle) {
          setOnboardFullName(name);
          setOnboardUsername(name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase().slice(0, 20));
          if (photo) setOnboardAvatar(photo);
          setCurrentView('view-onboarding');
          setLoading(false);
          return;
        }

        localStorage.setItem('levelmovie_user_uid', data.user.id);
        localStorage.setItem('levelmovie_user_name', name);
        localStorage.setItem('levelmovie_user_email', userEmail);
        localStorage.setItem('levelmovie_user_handle', handle);
        if (photo) localStorage.setItem('lm_photo', photo);

        onLoginSuccess(data.user, name, userEmail, photo, handle);
        showToast(isFr ? `Bienvenue, @${handle} !` : `Welcome back, @${handle}!`, 'success');
        handleClose();
      } catch (err: any) {
        setErrorMsg(err.message || (isFr ? 'Identifiants invalides.' : 'Invalid credentials.'));
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        const name = loginEmail.split('@')[0];
        const fakeId = 'usr_' + Date.now().toString().slice(-6);
        const handle = name.toLowerCase().replace(/[^a-z0-9_]/g, '');
        const fallbackUser = { id: fakeId, email: loginEmail.trim() };

        localStorage.setItem('levelmovie_user_uid', fakeId);
        localStorage.setItem('levelmovie_user_name', name);
        localStorage.setItem('levelmovie_user_email', loginEmail.trim());
        localStorage.setItem('levelmovie_user_handle', handle);

        onLoginSuccess(fallbackUser, name, loginEmail.trim(), null, handle);
        showToast(isFr ? `Bienvenue, @${handle} !` : `Welcome back, @${handle}!`, 'success');
        handleClose();
      }, 600);
    }
  };

  // Register Step 1 submit (Nom/Prénom + ID Utilisateur + Photo)
  const handleRegisterStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = formatUsernameInput(regUsername);

    if (!cleanUsername || cleanUsername.length < 3) {
      setErrorMsg(isFr ? 'L’identifiant d’utilisateur doit contenir au moins 3 caractères (lettres, chiffres, tirets).' : 'User ID must be at least 3 characters long (letters, numbers, underscores).');
      return;
    }
    if (!regFirstName.trim() || !regLastName.trim()) {
      setErrorMsg(isFr ? 'Veuillez saisir votre prénom et nom.' : 'Please enter your first and last name.');
      return;
    }
    setErrorMsg('');
    setCurrentView('view-register-step2');
  };

  // Register Step 2 submit (Email/Password & SignUp)
  const handleRegisterStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regEmail.trim() || !regPassword) {
      setErrorMsg(isFr ? 'Veuillez renseigner un email et un mot de passe.' : 'Please enter an email and password.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg(isFr ? 'Le mot de passe doit contenir au moins 6 caractères.' : 'Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg(isFr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }

    const cleanUsername = formatUsernameInput(regUsername);
    const fullName = `${regFirstName.trim()} ${regLastName.trim()}`.trim();
    const avatarUrl = regAvatar || DEFAULT_AVATARS[0].url;

    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: regEmail.trim(),
          password: regPassword,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName,
              first_name: regFirstName.trim(),
              last_name: regLastName.trim(),
              username: cleanUsername,
              avatar_url: avatarUrl
            }
          }
        });
        if (error) throw error;

        if (data.session && data.user) {
          localStorage.setItem('levelmovie_user_uid', data.user.id);
          localStorage.setItem('levelmovie_user_name', fullName);
          localStorage.setItem('levelmovie_user_email', regEmail.trim());
          localStorage.setItem('levelmovie_user_handle', cleanUsername);
          localStorage.setItem('lm_photo', avatarUrl);
          onLoginSuccess(data.user, fullName, regEmail.trim(), avatarUrl, cleanUsername);
        }
        
        setCurrentView('view-register-step3');
      } catch (err: any) {
        setErrorMsg(err.message || (isFr ? 'Erreur lors de la création de compte.' : 'Error creating account.'));
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        setCurrentView('view-register-step3');
      }, 600);
    }
  };

  // Finalisation obligatoire du profil (Onboarding pour Google OAuth et nouveaux utilisateurs)
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUsername = formatUsernameInput(onboardUsername);
    if (!cleanUsername || cleanUsername.length < 3) {
      setErrorMsg(isFr ? 'L’identifiant d’utilisateur doit comporter au moins 3 caractères.' : 'User ID must be at least 3 characters.');
      return;
    }
    if (!onboardFullName.trim()) {
      setErrorMsg(isFr ? 'Veuillez saisir votre nom ou pseudo.' : 'Please enter your display name.');
      return;
    }

    setLoading(true);

    const updatedData = {
      username: cleanUsername,
      full_name: onboardFullName.trim(),
      avatar_url: onboardAvatar || DEFAULT_AVATARS[0].url
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.updateUser({
          data: updatedData
        });
        if (error) throw error;

        const updatedUser = data.user || onboardingUser;
        const uid = updatedUser?.id || localStorage.getItem('levelmovie_user_uid') || 'usr_google';
        const email = updatedUser?.email || localStorage.getItem('levelmovie_user_email') || '';

        localStorage.setItem('levelmovie_user_uid', uid);
        localStorage.setItem('levelmovie_user_name', onboardFullName.trim());
        localStorage.setItem('levelmovie_user_email', email);
        localStorage.setItem('levelmovie_user_handle', cleanUsername);
        localStorage.setItem('lm_photo', onboardAvatar);

        onLoginSuccess(updatedUser, onboardFullName.trim(), email, onboardAvatar, cleanUsername);
        showToast(isFr ? `Profil créé avec succès ! Bienvenue @${cleanUsername}` : `Profile created! Welcome @${cleanUsername}`, 'success');
        handleClose();
      } catch (err: any) {
        setErrorMsg(err.message || (isFr ? 'Erreur lors de la mise à jour du profil.' : 'Error updating profile.'));
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        const uid = onboardingUser?.id || 'usr_' + Date.now();
        const email = onboardingUser?.email || 'user@example.com';

        localStorage.setItem('levelmovie_user_uid', uid);
        localStorage.setItem('levelmovie_user_name', onboardFullName.trim());
        localStorage.setItem('levelmovie_user_email', email);
        localStorage.setItem('levelmovie_user_handle', cleanUsername);
        localStorage.setItem('lm_photo', onboardAvatar);

        onLoginSuccess(onboardingUser || { id: uid, email }, onboardFullName.trim(), email, onboardAvatar, cleanUsername);
        showToast(isFr ? `Profil créé ! Bienvenue @${cleanUsername}` : `Profile created! Welcome @${cleanUsername}`, 'success');
        handleClose();
      }, 500);
    }
  };

  // Forgot Password handler
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg(isFr ? 'Veuillez saisir votre adresse e-mail.' : 'Please enter your email address.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
          redirectTo: window.location.origin
        });
        if (error) throw error;
        setCurrentView('view-forgot-password-sent');
      } catch (err: any) {
        setErrorMsg(err.message || (isFr ? 'Erreur lors de la réinitialisation.' : 'Error sending reset email.'));
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        setCurrentView('view-forgot-password-sent');
      }, 500);
    }
  };

  const handleBackNavigation = () => {
    setErrorMsg('');
    if (currentView === 'view-main') {
      handleClose();
    } else if (currentView === 'view-login') {
      setCurrentView('view-main');
    } else if (currentView === 'view-forgot-password' || currentView === 'view-forgot-password-sent') {
      setCurrentView('view-login');
    } else if (currentView === 'view-register-step1') {
      setCurrentView('view-main');
    } else if (currentView === 'view-register-step2') {
      setCurrentView('view-register-step1');
    } else if (currentView === 'view-register-step3') {
      setCurrentView('view-main');
    } else if (currentView === 'view-onboarding') {
      handleClose();
    } else {
      setCurrentView('view-main');
    }
  };

  return (
    <div className="fixed inset-0 z-[9600] w-full h-full bg-[#0f0f13] text-[#e2e2e8] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-300 font-sans overscroll-contain">
      
      {/* ======================================================== */}
      {/* GAUCHE: INTERFACE DÉDIÉE (PLEIN ÉCRAN MOBILE & PC)         */}
      {/* ======================================================== */}
      <div ref={scrollContainerRef} className="w-full md:w-1/2 h-full flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 overflow-y-auto overscroll-contain touch-pan-y bg-[#14141a] relative z-20 custom-scrollbar">
        
        {/* Séparateur vertical à dégradé fluide entre les deux panneaux */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#8b5cf6]/40 via-[#ec4899]/30 to-transparent z-30 pointer-events-none" />

        {/* Conteneur de Vue Principale */}
        <div className="w-full max-w-md my-2 sm:my-4 flex-1 flex flex-col justify-between min-h-full">
          
          <div>
            <div className="w-full relative py-2">
            
            {/* VUE 1 : CHOIX DE CONNEXION PRINCIPAL */}
            {currentView === 'view-main' && (
              <div className="animate-in fade-in duration-300">
                
                {/* En-tête */}
                <div className="text-center mb-6 mt-1">
                  <div className="mx-auto mb-3 flex items-center justify-center">
                    <LevelMovieLogo className="w-12 h-12 text-[#8b5cf6]" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2 text-white">
                    Level<span className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">Movie</span>
                  </h1>
                  <p className="text-[#9ca3af] text-sm px-2 leading-relaxed">
                    {isFr 
                      ? 'Connectez-vous pour débloquer toutes les fonctionnalités (Salons Watch Party, Profils, Favoris).' 
                      : 'Sign in to unlock all features (Watch Parties, User Profiles, Watchlist).'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Bouton Google */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-medium transition-colors mb-3 shadow-sm cursor-pointer active:scale-95 text-sm"
                >
                  <svg className="h-5 w-5 mr-3 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>{isFr ? 'Continuer avec Google' : 'Continue with Google'}</span>
                </button>

                {/* Bouton Se connecter avec l'email */}
                <button
                  type="button"
                  onClick={() => { setErrorMsg(''); setCurrentView('view-login'); }}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#2a2a35] hover:bg-[#3f3f4e] text-white rounded-xl font-medium transition-colors border border-[#2a2a35] mb-3 cursor-pointer active:scale-95 text-sm"
                >
                  <Mail className="w-4 h-4 mr-3 text-[#9ca3af]" />
                  <span>{isFr ? "Se connecter avec l'e-mail" : 'Sign in with email'}</span>
                </button>

                {/* Bouton Créer un compte */}
                <button
                  type="button"
                  onClick={() => { setErrorMsg(''); setCurrentView('view-register-step1'); }}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#a855f7]/10 hover:bg-[#a855f7]/20 text-[#c084fc] hover:text-white rounded-xl font-bold transition-all border border-[#a855f7]/30 cursor-pointer active:scale-95 text-sm"
                >
                  <UserPlus className="w-4 h-4 mr-3 text-[#c084fc]" />
                  <span>{isFr ? 'Créer un compte' : 'Create an account'}</span>
                </button>

              </div>
            )}

            {/* VUE 2 : CONNEXION PAR E-MAIL CLASSIQUE */}
            {currentView === 'view-login' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                  {isFr ? 'Connexion' : 'Sign In'}
                </h2>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1">
                      {isFr ? 'Adresse e-mail' : 'Email address'}
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none"
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-[#9ca3af]">
                        {isFr ? 'Mot de passe' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => { setErrorMsg(''); setCurrentView('view-forgot-password'); }}
                        className="text-xs text-[#8b5cf6] hover:text-[#ec4899] transition-colors cursor-pointer"
                      >
                        {isFr ? 'Mot de passe oublié ?' : 'Forgot password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 mt-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>{isFr ? 'Connexion...' : 'Signing in...'}</span>
                      </>
                    ) : (
                      <span>{isFr ? 'Se connecter' : 'Sign In'}</span>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => { setErrorMsg(''); setCurrentView('view-register-step1'); }}
                    className="text-xs text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
                  >
                    {isFr ? (
                      <>Pas encore de compte ? <span className="text-[#8b5cf6] font-semibold hover:text-[#a78bfa] transition-colors underline underline-offset-4">Créer un compte</span></>
                    ) : (
                      <>Don't have an account? <span className="text-[#8b5cf6] font-semibold hover:text-[#a78bfa] transition-colors underline underline-offset-4">Create one</span></>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* VUE MOT DE PASSE OUBLIÉ (Étape 1 : Saisie de l'email) */}
            {currentView === 'view-forgot-password' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold mb-3 text-center text-white">
                  {isFr ? 'Mot de passe oublié' : 'Forgot Password'}
                </h2>
                <p className="text-[#9ca3af] text-sm text-center mb-6">
                  {isFr 
                    ? 'Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.' 
                    : 'Enter your email address to receive a password reset link.'}
                </p>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1">
                      {isFr ? 'Adresse e-mail' : 'Email address'}
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none"
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 mt-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>{isFr ? 'Envoi...' : 'Sending...'}</span>
                      </>
                    ) : (
                      <span>{isFr ? 'Envoyer le lien' : 'Send Reset Link'}</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* VUE MOT DE PASSE OUBLIÉ (Étape 2 : Confirmation d'envoi) */}
            {currentView === 'view-forgot-password-sent' && (
              <div className="text-center py-6 animate-in fade-in duration-300">
                <div className="mx-auto mb-4 flex items-center justify-center">
                  <Key className="w-12 h-12 text-[#8b5cf6]" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">
                  {isFr ? 'E-mail envoyé' : 'Email Dispatched'}
                </h2>
                <p className="text-[#9ca3af] text-sm mb-6 px-2 leading-relaxed">
                  {isFr 
                    ? 'Si un compte est associé à cette adresse, vous recevrez un lien pour réinitialiser votre mot de passe sous peu.' 
                    : 'If an account is associated with this email, you will receive a reset link shortly.'}
                </p>
              </div>
            )}

            {/* VUE 3 : INSCRIPTION ÉTAPE 1 (ID Utilisateur + Photo de Profil + Prénom/Nom) */}
            {currentView === 'view-register-step1' && (
              <div className="animate-in fade-in duration-300">
                <div className="text-center mb-5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#c084fc] bg-[#8b5cf6]/10 px-2.5 py-1 rounded-full border border-[#8b5cf6]/30">
                    {isFr ? 'Étape 1 / 2 • Création du profil' : 'Step 1 / 2 • Profile Setup'}
                  </span>
                  <h2 className="text-2xl font-black mt-3 text-white">
                    {isFr ? 'Votre identité LevelMovie' : 'Your LevelMovie Identity'}
                  </h2>
                  <p className="text-xs text-[#9ca3af] mt-1 max-w-xs mx-auto">
                    {isFr 
                      ? 'Choisissez votre ID utilisateur et votre photo pour être identifié par les autres cinéphiles.' 
                      : 'Choose your user ID and profile photo so others can recognize you.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterStep1} className="space-y-4">
                  
                  {/* Photo de profil / Avatar Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2">
                      {isFr ? 'Photo de profil (Avatar)' : 'Profile Photo (Avatar)'}
                    </label>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1e1e28] border border-white/10">
                      <div className="relative shrink-0">
                        <img 
                          src={regAvatar} 
                          alt="Avatar sélectionné" 
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        />
                        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#8b5cf6] text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>@{regUsername ? formatUsernameInput(regUsername) : 'votre_id'}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8b5cf6]/20 text-[#c084fc] font-mono">
                            {isFr ? 'Aperçu' : 'Preview'}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 truncate">
                          {regFirstName || regLastName ? `${regFirstName} ${regLastName}`.trim() : (isFr ? 'Votre nom d’affichage' : 'Display name')}
                        </p>
                        
                        <div className="mt-1.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[10px] font-semibold px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-2.5 h-2.5" />
                            <span>{isFr ? 'Importer' : 'Upload'}</span>
                          </button>
                          <input 
                            ref={fileInputRef} 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, 'register')} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preset Avatars Gallery */}
                    <div className="mt-2.5">
                      <div className="text-[11px] text-white/60 mb-1.5">
                        {isFr ? 'Ou choisissez un avatar cinéma :' : 'Or select a cinema avatar:'}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {DEFAULT_AVATARS.map((avatar) => (
                          <button
                            key={avatar.id}
                            type="button"
                            onClick={() => setRegAvatar(avatar.url)}
                            className={`p-1 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer border ${
                              regAvatar === avatar.url 
                                ? 'border-[#8b5cf6] bg-[#8b5cf6]/20 scale-105 shadow-[0_0_10px_rgba(139,92,246,0.4)]' 
                                : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
                            }`}
                          >
                            <img src={avatar.url} alt={avatar.name} className="w-9 h-9 rounded-full object-cover" />
                            <span className="text-[9px] text-white/70 truncate w-full text-center">{avatar.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ID d'utilisateur (@username) */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-[#9ca3af]">
                        {isFr ? 'ID Utilisateur / Pseudo unique' : 'Unique User ID (@username)'}
                      </label>
                      <span className="text-[10px] text-[#c084fc] font-mono">
                        {isFr ? 'Visible par les autres' : 'Public ID'}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">
                        @
                      </div>
                      <input
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(formatUsernameInput(e.target.value))}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none font-mono"
                        placeholder="cine_fan99"
                        maxLength={25}
                        required
                      />
                    </div>
                    <p className="text-[10px] text-white/40 mt-1">
                      {isFr 
                        ? '3-25 caractères (lettres, chiffres, tirets et underscores).' 
                        : '3-25 chars (letters, numbers, hyphens, and underscores).'}
                    </p>
                  </div>

                  {/* Prénom & Nom */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                        {isFr ? 'Prénom' : 'First Name'}
                      </label>
                      <input
                        type="text"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] outline-none"
                        placeholder={isFr ? 'Alex' : 'Alex'}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                        {isFr ? 'Nom' : 'Last Name'}
                      </label>
                      <input
                        type="text"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] outline-none"
                        placeholder={isFr ? 'Dubois' : 'Smith'}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-4 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{isFr ? 'Continuer vers la sécurité' : 'Continue to Security'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* VUE 4 : INSCRIPTION ÉTAPE 2 (Email/Mot de passe) */}
            {currentView === 'view-register-step2' && (
              <div className="animate-in fade-in duration-300">
                <div className="text-center mb-5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#c084fc] bg-[#8b5cf6]/10 px-2.5 py-1 rounded-full border border-[#8b5cf6]/30">
                    {isFr ? 'Étape 2 / 2 • Sécurité' : 'Step 2 / 2 • Security'}
                  </span>
                  <h2 className="text-2xl font-black mt-3 text-white">
                    {isFr ? 'Sécurisez votre compte' : 'Secure your account'}
                  </h2>
                  <p className="text-xs text-[#9ca3af] mt-1">
                    {isFr 
                      ? `Finalisation de l’inscription pour @${formatUsernameInput(regUsername)}` 
                      : `Finalizing registration for @${formatUsernameInput(regUsername)}`}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterStep2} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1">
                      {isFr ? 'Adresse e-mail' : 'Email address'}
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none"
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1">
                      {isFr ? 'Mot de passe' : 'Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1">
                      {isFr ? 'Confirmer le mot de passe' : 'Confirm Password'}
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 mt-4 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>{isFr ? 'Création du compte...' : 'Creating account...'}</span>
                      </>
                    ) : (
                      <span>{isFr ? 'Créer mon compte LevelMovie' : 'Create LevelMovie Account'}</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* VUE 5 : INSCRIPTION ÉTAPE 3 (Validation Email Obligatoire) */}
            {currentView === 'view-register-step3' && (
              <div className="text-center py-6 animate-in fade-in duration-300 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-[#c084fc]">
                  <Mail className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {isFr ? 'Vérifiez votre boîte mail' : 'Check your inbox'}
                  </h2>
                  <p className="text-[#9ca3af] text-xs sm:text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                    {isFr 
                      ? `Un lien d'activation sécurisé a été envoyé à `
                      : `A secure verification link was sent to `}
                    <span className="text-white font-medium underline">{regEmail || 'votre email'}</span>.
                  </p>
                  <p className="text-white/50 text-[11px] mt-2 max-w-xs mx-auto">
                    {isFr 
                      ? 'Pour la sécurité de votre compte, cliquez sur le lien d’activation dans l’e-mail avant de vous connecter.' 
                      : 'For account security, please click the link in your email to activate your account before logging in.'}
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail(regEmail);
                      setCurrentView('view-login');
                    }}
                    className="w-full py-2.5 bg-white text-black rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors cursor-pointer active:scale-95 shadow-sm"
                  >
                    {isFr ? 'Aller à la page de connexion' : 'Go to Sign In'}
                  </button>
                </div>
              </div>
            )}

            {/* VUE 6 : ONBOARDING OBLIGATOIRE (Google OAuth & Nouveaux Utilisateurs) */}
            {currentView === 'view-onboarding' && (
              <div className="animate-in fade-in duration-300">
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8b5cf6] to-[#ec4899] flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    {isFr ? 'Bienvenue sur LevelMovie ! 🎉' : 'Welcome to LevelMovie! 🎉'}
                  </h2>
                  <p className="text-xs text-[#9ca3af] mt-1.5 max-w-sm mx-auto leading-relaxed">
                    {isFr 
                      ? 'Définissez votre identifiant unique et votre photo de profil pour que vos amis et la communauté puissent vous reconnaître.' 
                      : 'Set your unique User ID and profile photo so friends and the community can recognize you.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                  
                  {/* Photo de profil / Avatar */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2">
                      {isFr ? 'Votre Photo de profil (Avatar)' : 'Your Profile Photo (Avatar)'}
                    </label>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1e1e28] border border-white/10">
                      <div className="relative shrink-0">
                        <img 
                          src={onboardAvatar} 
                          alt="Avatar" 
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        />
                        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#8b5cf6] text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>@{onboardUsername ? formatUsernameInput(onboardUsername) : 'votre_id'}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8b5cf6]/20 text-[#c084fc] font-mono">
                            {isFr ? 'Aperçu' : 'Live'}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 truncate">
                          {onboardFullName || (isFr ? 'Votre nom' : 'Your name')}
                        </p>
                        
                        <div className="mt-1.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onboardFileInputRef.current?.click()}
                            className="text-[10px] font-semibold px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-2.5 h-2.5" />
                            <span>{isFr ? 'Changer de photo' : 'Upload photo'}</span>
                          </button>
                          <input 
                            ref={onboardFileInputRef} 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, 'onboard')} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Presets Grid */}
                    <div className="mt-2.5">
                      <div className="text-[11px] text-white/60 mb-1.5">
                        {isFr ? 'Sélectionner un avatar cinéma :' : 'Choose cinema avatar:'}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {DEFAULT_AVATARS.map((avatar) => (
                          <button
                            key={avatar.id}
                            type="button"
                            onClick={() => setOnboardAvatar(avatar.url)}
                            className={`p-1 rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer border ${
                              onboardAvatar === avatar.url 
                                ? 'border-[#8b5cf6] bg-[#8b5cf6]/20 scale-105 shadow-[0_0_10px_rgba(139,92,246,0.4)]' 
                                : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
                            }`}
                          >
                            <img src={avatar.url} alt={avatar.name} className="w-9 h-9 rounded-full object-cover" />
                            <span className="text-[9px] text-white/70 truncate w-full text-center">{avatar.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ID d'utilisateur (@username) */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-[#9ca3af]">
                        {isFr ? 'Identifiant d’utilisateur unique (@username)' : 'Unique User ID (@username)'}
                      </label>
                      <span className="text-[10px] text-[#c084fc] font-mono font-bold">
                        {isFr ? 'Obligatoire' : 'Required'}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">
                        @
                      </div>
                      <input
                        type="text"
                        value={onboardUsername}
                        onChange={(e) => setOnboardUsername(formatUsernameInput(e.target.value))}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none font-mono"
                        placeholder="cinephile99"
                        maxLength={25}
                        required
                      />
                    </div>
                    <p className="text-[10px] text-white/40 mt-1">
                      {isFr 
                        ? 'Ce pseudo sera affiché lors de vos Watch Parties et dans la communauté.' 
                        : 'This ID will be visible in Watch Parties and across the community.'}
                    </p>
                  </div>

                  {/* Nom complet */}
                  <div>
                    <label className="block text-xs font-semibold text-[#9ca3af] mb-1">
                      {isFr ? 'Nom d’affichage / Prénom' : 'Display Name / First Name'}
                    </label>
                    <input
                      type="text"
                      value={onboardFullName}
                      onChange={(e) => setOnboardFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] outline-none"
                      placeholder={isFr ? 'Alex Dupont' : 'Alex Smith'}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 mt-4 bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#ec4899] text-white rounded-xl text-xs font-black tracking-wider uppercase hover:opacity-95 transition-all cursor-pointer active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>{isFr ? 'Enregistrement...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isFr ? 'Valider mon profil & Entrer' : 'Save Profile & Enter'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Bouton de NAVIGATION (Retour contextuel / Accueil) */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 py-1 px-2 hover:underline active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-white/50" />
              <span>
                {currentView === 'view-main'
                  ? (isFr ? "Retour à l'accueil" : 'Return to home')
                  : (isFr ? 'Retour' : 'Back')}
              </span>
            </button>
          </div>
        </div>

        {/* Règles d'utilisation, Confidentialité & Mention Powered by LevelUp */}
        <div className="mt-auto pt-6 pb-2 border-t border-white/5 text-center space-y-2 w-full">
          <div className="flex items-center justify-center gap-3 text-[11px] text-[#9ca3af]">
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              {isFr ? "Conditions d'utilisation" : "Terms of Service"}
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              {isFr ? "Politique de confidentialité" : "Privacy Policy"}
            </button>
          </div>

          <div className="text-[10px] font-mono tracking-wider uppercase text-white/30">
            Powered by LevelUp
          </div>
        </div>

      </div>

      </div>

      {/* MODAL POPUP RÈGLES / POLITIQUES DE CONFIDENTIALITÉ */}
      {legalModal && (
        <div className="fixed inset-0 z-[9800] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#14141a] border border-[#2a2a35] rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {legalModal === 'terms'
                  ? (isFr ? "Conditions d'utilisation" : 'Terms of Service')
                  : (isFr ? 'Politique de confidentialité' : 'Privacy Policy')}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 text-xs text-white/70 space-y-3 overflow-y-auto custom-scrollbar leading-relaxed">
              {legalModal === 'terms' ? (
                <>
                  <p>
                    {isFr
                      ? "Bienvenue sur LevelMovie, propulsé par l'écosystème LevelUp. En accédant à nos services, vous acceptez de respecter ces règles d'utilisation :"
                      : "Welcome to LevelMovie, powered by the LevelUp ecosystem. By accessing our services, you agree to comply with these terms:"}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-white/80">
                    <li>{isFr ? "LevelMovie est un agrégateur et indexeur décentralisé de flux multimédia." : "LevelMovie operates as a decentralized multimedia stream aggregator and indexer."}</li>
                    <li>{isFr ? "L'accès aux salons Watch Party nécessite une clé de compte valide et respectueuse de la communauté." : "Access to Watch Parties requires a valid account key and adherence to community guidelines."}</li>
                    <li>{isFr ? "Aucune donnée personnelle sensible n'est vendue ni transférée à des tiers publicitaires." : "No sensitive personal information is sold or transferred to advertising networks."}</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    {isFr
                      ? "Protection de vos données et respect de votre vie privée au sein de LevelMovie :"
                      : "Protection of your personal data and privacy within LevelMovie:"}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-white/80">
                    <li>{isFr ? "Vos préférences et listes de favoris sont sauvegardées de façon sécurisée." : "Your preferences and watchlists are securely synchronized."}</li>
                    <li>{isFr ? "Les sessions de visionnage partagées sont chiffrées de bout en bout." : "Shared watch sessions are end-to-end encrypted."}</li>
                    <li>{isFr ? "Vous pouvez supprimer vos informations ou vous déconnecter à tout moment." : "You can delete your synchronized profile data at any time."}</li>
                  </ul>
                </>
              )}
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                {isFr ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DROITE: VITRINE CINÉMATOGRAPHIQUE DYNAMIQUE                */}
      {/* ======================================================== */}
      <div className="hidden md:flex md:w-1/2 h-full relative bg-gradient-to-br from-[#120a22] to-[#080911] overflow-hidden flex-col justify-between p-10 lg:p-14">
        
        {/* Animated Background poster art */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35 transition-all duration-1000 scale-105"
          style={{ backgroundImage: `url(${showcasePosters[posterIndex].bg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-[#0f0f13]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14141a] via-transparent to-[#0f0f13]/40" />

        {/* Top badge */}
        <div className="relative z-10 flex items-center justify-end">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-black">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{showcasePosters[posterIndex].rating}</span>
          </div>
        </div>

        {/* Center Poster Title & Highlight */}
        <div className="relative z-10 space-y-3">
          <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {showcasePosters[posterIndex].title}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
            {isFr 
              ? 'Accédez à des milliers de films et séries, organisez vos Watch Parties en direct et profitez d’une expérience cinéma fluide.' 
              : 'Stream thousands of top-rated movies and shows, host live Watch Parties, and sync your favorite cinema hub.'}
          </p>
        </div>

        {/* Bottom indicators */}
        <div className="relative z-10 flex items-center gap-2 pt-4">
          {showcasePosters.map((_, i) => (
            <button
              key={i}
              onClick={() => setPosterIndex(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                posterIndex === i ? 'w-10 bg-[#8b5cf6]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

      </div>

    </div>
  );
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang,
  showToast
}) => {
  const [currentView, setCurrentView] = useState<AuthView>('view-main');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register multi-step states
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Right side dynamic posters showcase (PC view)
  const showcasePosters = [
    { title: 'Dune: Part Two', bg: 'https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', rating: '8.6' },
    { title: 'Oppenheimer', bg: 'https://image.tmdb.org/t/p/w780/ptpr0kGAckfQkJeJIt8st5dglvd.jpg', rating: '8.9' },
    { title: 'Spider-Man: Across the Spider-Verse', bg: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', rating: '8.7' },
    { title: 'Stranger Things', bg: 'https://image.tmdb.org/t/p/w780/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', rating: '8.8' }
  ];

  const [posterIndex, setPosterIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setPosterIndex((prev) => (prev + 1) % showcasePosters.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, showcasePosters.length]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  if (!isOpen) return null;

  const isFr = lang === 'fr';

  const resetAll = () => {
    setCurrentView('view-main');
    setLoginEmail('');
    setLoginPassword('');
    setRegFirstName('');
    setRegLastName('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
    setForgotEmail('');
    setErrorMsg('');
    setLoading(false);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  // Google OAuth Auth
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');

    console.group('🚀 [LEVELMOVIE AUTH] Tentative de connexion Google OAuth');
    console.log('📍 Origine du site :', window.location.origin);
    console.log('🌐 Supabase URL :', 'https://epprgkolsywdfouffpmj.supabase.co');
    console.log('🔑 Callback URL OAuth :', 'https://epprgkolsywdfouffpmj.supabase.co/auth/v1/callback');
    console.log('🆔 Google Client ID :', '1003902678826-lf8i7bmm77gjlp7cviate5og0n1s1924.apps.googleusercontent.com');

    if (isSupabaseConfigured && supabase) {
      try {
        const redirectUrl = window.location.origin;
        console.log('⏳ Génération de l’URL d’authentification Google via Supabase...');
        console.log('🔗 Redirect Target URL :', redirectUrl);

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: true,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        });
        if (error) {
          console.error('❌ Erreur renvoyée par Supabase OAuth :', error);
          throw error;
        }
        console.log('✅ URL OAuth générée avec succès :', data?.url);
        
        if (data?.url) {
          // Google interdit STRICTEMENT d'être chargé dans une iframe (ce qui provoque l'erreur 403 immédiate).
          // On ouvre donc la fenêtre d'authentification Google dans un popup sécurisé ou nouvel onglet.
          const width = 520;
          const height = 650;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2.5;
          const popup = window.open(
            data.url,
            'google_oauth_popup',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=no,toolbar=no,menubar=no`
          );

          if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            // Si le bloqueur de popups bloque, rediriger la fenêtre principale
            if (window.top && window.self !== window.top) {
              window.top.location.href = data.url;
            } else {
              window.location.href = data.url;
            }
          } else {
            popup.focus();
            setLoading(false);
            // Fermer la modale dès que la fenêtre Google est ouverte
            handleClose();
            showToast(isFr ? 'Veuillez sélectionner votre compte Google dans la fenêtre...' : 'Please select your Google account in the popup...', 'info');
          }
        }
      } catch (err: any) {
        console.error('❌ Exception attrapée lors de la connexion Google :', err);
        setLoading(false);
        setErrorMsg(err.message || (isFr ? 'Erreur lors de la redirection Google.' : 'Error during Google sign-in.'));
      } finally {
        console.groupEnd();
      }
    } else {
      console.warn('⚠️ Supabase n’est pas configuré.');
      console.groupEnd();
      setTimeout(() => {
        setLoading(false);
        setErrorMsg(isFr ? 'Configuration Supabase non détectée.' : 'Supabase configuration not detected.');
      }, 400);
    }
  };

  // Login Email submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg(isFr ? 'Veuillez renseigner votre email et mot de passe.' : 'Please enter your email and password.');
      return;
    }

    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword
        });
        if (error) {
          if (error.message.toLowerCase().includes('email not confirmed')) {
            setErrorMsg(isFr 
              ? 'Votre adresse email n’a pas encore été confirmée. Veuillez cliquer sur le lien d’activation reçu par email avant de vous connecter.' 
              : 'Email not confirmed. Please click the verification link sent to your email address before logging in.');
            return;
          }
          throw error;
        }

        const name = data.user?.user_metadata?.full_name || loginEmail.split('@')[0];
        const userEmail = data.user?.email || loginEmail;

        localStorage.setItem('levelmovie_user_uid', data.user.id);
        localStorage.setItem('levelmovie_user_name', name);
        localStorage.setItem('levelmovie_user_email', userEmail);

        onLoginSuccess(data.user, name, userEmail, data.user?.user_metadata?.avatar_url || null);
        showToast(isFr ? `Bienvenue, ${name} !` : `Welcome back, ${name}!`, 'success');
        handleClose();
      } catch (err: any) {
        setErrorMsg(err.message || (isFr ? 'Identifiants invalides.' : 'Invalid credentials.'));
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        const name = loginEmail.split('@')[0];
        const fakeId = 'usr_' + Date.now().toString().slice(-6);
        const fallbackUser = { id: fakeId, email: loginEmail.trim() };

        localStorage.setItem('levelmovie_user_uid', fakeId);
        localStorage.setItem('levelmovie_user_name', name);
        localStorage.setItem('levelmovie_user_email', loginEmail.trim());

        onLoginSuccess(fallbackUser, name, loginEmail.trim(), null);
        showToast(isFr ? `Bienvenue, ${name} !` : `Welcome back, ${name}!`, 'success');
        handleClose();
      }, 600);
    }
  };

  // Register Step 1 submit (Nom/Prénom)
  const handleRegisterStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName.trim() || !regLastName.trim()) {
      setErrorMsg(isFr ? 'Veuillez saisir votre prénom et nom.' : 'Please enter your first and last name.');
      return;
    }
    setErrorMsg('');
    setCurrentView('view-register-step2');
  };

  // Register Step 2 submit (Email/Password)
  const handleRegisterStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regEmail.trim() || !regPassword) {
      setErrorMsg(isFr ? 'Veuillez renseigner un email et un mot de passe.' : 'Please enter an email and password.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg(isFr ? 'Le mot de passe doit contenir au moins 6 caractères.' : 'Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg(isFr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }

    const fullName = `${regFirstName.trim()} ${regLastName.trim()}`.trim();
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: regEmail.trim(),
          password: regPassword,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName,
              first_name: regFirstName.trim(),
              last_name: regLastName.trim()
            }
          }
        });
        if (error) throw error;

        // If Supabase has email confirmation enabled (session is null), require activation
        if (data.session) {
          if (data.user) {
            localStorage.setItem('levelmovie_user_uid', data.user.id);
            localStorage.setItem('levelmovie_user_name', fullName);
            localStorage.setItem('levelmovie_user_email', regEmail.trim());
            onLoginSuccess(data.user, fullName, regEmail.trim(), null);
          }
          setCurrentView('view-register-step3');
        } else {
          // Email activation required
          setCurrentView('view-register-step3');
        }
      } catch (err: any) {
        setErrorMsg(err.message || (isFr ? 'Erreur lors de la création de compte.' : 'Error creating account.'));
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        setCurrentView('view-register-step3');
      }, 600);
    }
  };

  // Forgot Password handler
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg(isFr ? 'Veuillez saisir votre adresse e-mail.' : 'Please enter your email address.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
          redirectTo: window.location.origin
        });
        if (error) throw error;
        setCurrentView('view-forgot-password-sent');
      } catch (err: any) {
        setErrorMsg(err.message || (isFr ? 'Erreur lors de la réinitialisation.' : 'Error sending reset email.'));
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        setCurrentView('view-forgot-password-sent');
      }, 500);
    }
  };

  const handleBackNavigation = () => {
    setErrorMsg('');
    if (currentView === 'view-main') {
      handleClose();
    } else if (currentView === 'view-login') {
      setCurrentView('view-main');
    } else if (currentView === 'view-forgot-password' || currentView === 'view-forgot-password-sent') {
      setCurrentView('view-login');
    } else if (currentView === 'view-register-step1') {
      setCurrentView('view-main');
    } else if (currentView === 'view-register-step2') {
      setCurrentView('view-register-step1');
    } else if (currentView === 'view-register-step3') {
      setCurrentView('view-main');
    } else {
      setCurrentView('view-main');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9600] w-full h-full bg-[#0f0f13] text-[#e2e2e8] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-300 font-sans overscroll-contain">
      
      {/* ======================================================== */}
      {/* GAUCHE: INTERFACE DÉDIÉE (PLEIN ÉCRAN MOBILE & PC)         */}
      {/* ======================================================== */}
      <div ref={scrollContainerRef} className="w-full md:w-1/2 h-full flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 overflow-y-auto overscroll-contain touch-pan-y bg-[#14141a] relative z-20">
        
        {/* Séparateur vertical à dégradé fluide entre les deux panneaux (gauche et droite) */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#8b5cf6]/40 via-[#ec4899]/30 to-transparent z-30 pointer-events-none" />

        {/* Conteneur de Vue Principale */}
        <div className="w-full max-w-md my-2 sm:my-4 flex-1 flex flex-col justify-between min-h-full">
          
          <div>
            <div className="w-full relative py-2">
            
            {/* VUE 1 : CHOIX DE CONNEXION PRINCIPAL */}
            {currentView === 'view-main' && (
              <div className="animate-in fade-in duration-300">
                
                {/* En-tête (Logo dégradé et Titre sans bulle en arrière-plan) */}
                <div className="text-center mb-6 mt-1">
                  <div className="mx-auto mb-3 flex items-center justify-center">
                    <LevelMovieLogo className="w-12 h-12 text-[#8b5cf6]" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2 text-white">
                    Level<span className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">Movie</span>
                  </h1>
                  <p className="text-[#9ca3af] text-sm px-2 leading-relaxed">
                    {isFr 
                      ? 'Connectez-vous pour débloquer cette fonctionnalité (Ma Liste, Watch Parties...).' 
                      : 'Sign in to unlock all features (Watchlist, Watch Parties, Custom Sync...).'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Bouton Google */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-medium transition-colors mb-3 shadow-sm cursor-pointer active:scale-95 text-sm"
                >
                  <svg className="h-5 w-5 mr-3 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>{isFr ? 'Continuer avec Google' : 'Continue with Google'}</span>
                </button>

                {/* Bouton Se connecter avec l'email */}
                <button
                  type="button"
                  onClick={() => { setErrorMsg(''); setCurrentView('view-login'); }}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#2a2a35] hover:bg-[#3f3f4e] text-white rounded-xl font-medium transition-colors border border-[#2a2a35] mb-3 cursor-pointer active:scale-95 text-sm"
                >
                  <Mail className="w-4 h-4 mr-3 text-[#9ca3af]" />
                  <span>{isFr ? "Se connecter avec l'e-mail" : 'Sign in with email'}</span>
                </button>

                {/* Bouton Créer un compte */}
                <button
                  type="button"
                  onClick={() => { setErrorMsg(''); setCurrentView('view-register-step1'); }}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#a855f7]/10 hover:bg-[#a855f7]/20 text-[#c084fc] hover:text-white rounded-xl font-bold transition-all border border-[#a855f7]/30 cursor-pointer active:scale-95 text-sm"
                >
                  <UserPlus className="w-4 h-4 mr-3 text-[#c084fc]" />
                  <span>{isFr ? 'Créer un compte' : 'Create an account'}</span>
                </button>

              </div>
            )}

            {/* VUE 2 : CONNEXION PAR E-MAIL CLASSIQUE */}
            {currentView === 'view-login' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                  {isFr ? 'Connexion' : 'Sign In'}
                </h2>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1">
                      {isFr ? 'Adresse e-mail' : 'Email address'}
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none"
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-[#9ca3af]">
                        {isFr ? 'Mot de passe' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => { setErrorMsg(''); setCurrentView('view-forgot-password'); }}
                        className="text-xs text-[#8b5cf6] hover:text-[#ec4899] transition-colors cursor-pointer"
                      >
                        {isFr ? 'Mot de passe oublié ?' : 'Forgot password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 mt-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>{isFr ? 'Connexion...' : 'Signing in...'}</span>
                      </>
                    ) : (
                      <span>{isFr ? 'Se connecter' : 'Sign In'}</span>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => { setErrorMsg(''); setCurrentView('view-register-step1'); }}
                    className="text-xs text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
                  >
                    {isFr ? (
                      <>Pas encore de compte ? <span className="text-[#8b5cf6] font-semibold hover:text-[#a78bfa] transition-colors underline underline-offset-4">Créer un compte</span></>
                    ) : (
                      <>Don't have an account? <span className="text-[#8b5cf6] font-semibold hover:text-[#a78bfa] transition-colors underline underline-offset-4">Create one</span></>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* VUE MOT DE PASSE OUBLIÉ (Étape 1 : Saisie de l'email) */}
            {currentView === 'view-forgot-password' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold mb-3 text-center text-white">
                  {isFr ? 'Mot de passe oublié' : 'Forgot Password'}
                </h2>
                <p className="text-[#9ca3af] text-sm text-center mb-6">
                  {isFr 
                    ? 'Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.' 
                    : 'Enter your email address to receive a password reset link.'}
                </p>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1">
                      {isFr ? 'Adresse e-mail' : 'Email address'}
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none"
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 mt-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>{isFr ? 'Envoi...' : 'Sending...'}</span>
                      </>
                    ) : (
                      <span>{isFr ? 'Envoyer le lien' : 'Send Reset Link'}</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* VUE MOT DE PASSE OUBLIÉ (Étape 2 : Confirmation d'envoi) */}
            {currentView === 'view-forgot-password-sent' && (
              <div className="text-center py-6 animate-in fade-in duration-300">
                <div className="mx-auto mb-4 flex items-center justify-center">
                  <Key className="w-12 h-12 text-[#8b5cf6]" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">
                  {isFr ? 'E-mail envoyé' : 'Email Dispatched'}
                </h2>
                <p className="text-[#9ca3af] text-sm mb-6 px-2 leading-relaxed">
                  {isFr 
                    ? 'Si un compte est associé à cette adresse, vous recevrez un lien pour réinitialiser votre mot de passe sous peu.' 
                    : 'If an account is associated with this email, you will receive a reset link shortly.'}
                </p>
              </div>
            )}

            {/* VUE 3 : INSCRIPTION ÉTAPE 1 (Nom/Prénom) */}
            {currentView === 'view-register-step1' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                  {isFr ? 'Créer un compte' : 'Create an Account'}
                </h2>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterStep1} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1">
                      {isFr ? 'Prénom' : 'First Name'}
                    </label>
                    <input
                      type="text"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none"
                      placeholder={isFr ? 'Jean' : 'John'}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1">
                      {isFr ? 'Nom' : 'Last Name'}
                    </label>
                    <input
                      type="text"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none"
                      placeholder={isFr ? 'Dupont' : 'Doe'}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-4 bg-white text-black rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors cursor-pointer active:scale-95"
                  >
                    {isFr ? 'Continuer' : 'Continue'}
                  </button>
                </form>
              </div>
            )}

            {/* VUE 4 : INSCRIPTION ÉTAPE 2 (Email/Mot de passe) */}
            {currentView === 'view-register-step2' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                  {isFr ? 'Sécurité du compte' : 'Account Security'}
                </h2>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterStep2} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1">
                      {isFr ? 'Adresse e-mail' : 'Email address'}
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none"
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1">
                      {isFr ? 'Mot de passe' : 'Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-1">
                      {isFr ? 'Confirmer le mot de passe' : 'Confirm Password'}
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm bg-[#2a2a35] border border-[#3f3f4e] text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 mt-4 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>{isFr ? 'Création...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <span>{isFr ? 'Créer mon compte' : 'Create Account'}</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* VUE 5 : INSCRIPTION ÉTAPE 3 (Validation Email Obligatoire) */}
            {currentView === 'view-register-step3' && (
              <div className="text-center py-6 animate-in fade-in duration-300 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-[#c084fc]">
                  <Mail className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {isFr ? 'Vérifiez votre boîte mail' : 'Check your inbox'}
                  </h2>
                  <p className="text-[#9ca3af] text-xs sm:text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                    {isFr 
                      ? `Un lien d'activation sécurisé a été envoyé à `
                      : `A secure verification link was sent to `}
                    <span className="text-white font-medium underline">{regEmail || 'votre email'}</span>.
                  </p>
                  <p className="text-white/50 text-[11px] mt-2 max-w-xs mx-auto">
                    {isFr 
                      ? 'Pour la sécurité de votre compte, cliquez sur le lien d’activation dans l’e-mail avant de vous connecter.' 
                      : 'For account security, please click the link in your email to activate your account before logging in.'}
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail(regEmail);
                      setCurrentView('view-login');
                    }}
                    className="w-full py-2.5 bg-white text-black rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors cursor-pointer active:scale-95 shadow-sm"
                  >
                    {isFr ? 'Aller à la page de connexion' : 'Go to Sign In'}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Bouton de NAVIGATION (Retour contextuel / Accueil - Sans bulle, minimaliste) */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 py-1 px-2 hover:underline active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-white/50" />
              <span>
                {currentView === 'view-main'
                  ? (isFr ? "Retour à l'accueil" : 'Return to home')
                  : (isFr ? 'Retour' : 'Back')}
              </span>
            </button>
          </div>
        </div>

        {/* Règles d'utilisation, Confidentialité & Mention Powered by LevelUp */}
        <div className="mt-auto pt-6 pb-2 border-t border-white/5 text-center space-y-2 w-full">
          <div className="flex items-center justify-center gap-3 text-[11px] text-[#9ca3af]">
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              {isFr ? "Conditions d'utilisation" : "Terms of Service"}
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              {isFr ? "Politique de confidentialité" : "Privacy Policy"}
            </button>
          </div>

          <div className="text-[10px] font-mono tracking-wider uppercase text-white/30">
            Powered by LevelUp
          </div>
        </div>

      </div>

      </div>

      {/* MODAL POPUP RÈGLES / POLITIQUES DE CONFIDENTIALITÉ */}
      {legalModal && (
        <div className="fixed inset-0 z-[9800] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#14141a] border border-[#2a2a35] rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {legalModal === 'terms'
                  ? (isFr ? "Conditions d'utilisation" : 'Terms of Service')
                  : (isFr ? 'Politique de confidentialité' : 'Privacy Policy')}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 text-xs text-white/70 space-y-3 overflow-y-auto custom-scrollbar leading-relaxed">
              {legalModal === 'terms' ? (
                <>
                  <p>
                    {isFr
                      ? "Bienvenue sur LevelMovie, propulsé par l'écosystème LevelUp. En accédant à nos services, vous acceptez de respecter ces règles d'utilisation :"
                      : "Welcome to LevelMovie, powered by the LevelUp ecosystem. By accessing our services, you agree to comply with these terms:"}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-white/80">
                    <li>{isFr ? "LevelMovie est un agrégateur et indexeur décentralisé de flux multimédia." : "LevelMovie operates as a decentralized multimedia stream aggregator and indexer."}</li>
                    <li>{isFr ? "L'accès aux salons Watch Party nécessite une clé de compte valide et respectueuse de la communauté." : "Access to Watch Parties requires a valid account key and adherence to community guidelines."}</li>
                    <li>{isFr ? "Aucune donnée personnelle sensible n'est vendue ni transférée à des tiers publicitaires." : "No sensitive personal information is sold or transferred to advertising networks."}</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    {isFr
                      ? "Protection de vos données et respect de votre vie privée au sein de LevelMovie :"
                      : "Protection of your personal data and privacy within LevelMovie:"}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-white/80">
                    <li>{isFr ? "Vos préférences et listes de favoris sont sauvegardées de façon sécurisée." : "Your preferences and watchlists are securely synchronized."}</li>
                    <li>{isFr ? "Les sessions de visionnage partagées sont chiffrées de bout en bout." : "Shared watch sessions are end-to-end encrypted."}</li>
                    <li>{isFr ? "Vous pouvez supprimer vos informations ou vous déconnecter à tout moment." : "You can delete your synchronized profile data at any time."}</li>
                  </ul>
                </>
              )}
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                {isFr ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DROITE: VITRINE CINÉMATOGRAPHIQUE DYNAMIQUE                */}
      {/* ======================================================== */}
      <div className="hidden md:flex md:w-1/2 h-full relative bg-gradient-to-br from-[#120a22] to-[#080911] overflow-hidden flex-col justify-between p-10 lg:p-14">
        
        {/* Animated Background poster art */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35 transition-all duration-1000 scale-105"
          style={{ backgroundImage: `url(${showcasePosters[posterIndex].bg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-[#0f0f13]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14141a] via-transparent to-[#0f0f13]/40" />

        {/* Top badge */}
        <div className="relative z-10 flex items-center justify-end">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-black">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{showcasePosters[posterIndex].rating}</span>
          </div>
        </div>

        {/* Center Poster Title & Highlight */}
        <div className="relative z-10 space-y-3">
          <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {showcasePosters[posterIndex].title}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
            {isFr 
              ? 'Accédez à des milliers de films et séries, organisez vos Watch Parties en direct et profitez d’une expérience cinéma fluide.' 
              : 'Stream thousands of top-rated movies and shows, host live Watch Parties, and sync your favorite cinema hub.'}
          </p>
        </div>

        {/* Bottom indicators */}
        <div className="relative z-10 flex items-center gap-2 pt-4">
          {showcasePosters.map((_, i) => (
            <button
              key={i}
              onClick={() => setPosterIndex(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                posterIndex === i ? 'w-10 bg-[#8b5cf6]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

      </div>

    </div>
  );
};

