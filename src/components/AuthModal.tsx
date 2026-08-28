import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Key, ArrowLeft, Check, Sparkles, AlertCircle, Eye, EyeOff,
  User, UserPlus, LogOut, ArrowRight, ShieldCheck, Star, Flame, Lock,
  ChevronRight, Camera, Upload, Image as ImageIcon, AtSign, CheckCircle2, X,
  RotateCw
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
  | 'view-main'                   // Choix principal (Google, E-mail, Créer un compte)
  | 'view-login'                  // Connexion par email/mot de passe classique
  | 'view-forgot-password'        // Saisie de l'email pour mot de passe oublié
  | 'view-forgot-password-sent'   // Confirmation d'envoi de l'email de réinitialisation
  | 'view-register-credentials'   // Formulaire d'inscription : Nom, ID Utilisateur, Email, Mot de passe
  | 'view-register-profile'       // Import photo de profil / Avatar avant création et envoi du mail
  | 'view-register-confirm'       // Écran d'attente / confirmation de l'e-mail envoyé
  | 'view-onboarding';            // Finalisation obligatoire du profil (Google OAuth et nouveaux utilisateurs)

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

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Form states - Registration
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAvatar, setRegAvatar] = useState<string>(DEFAULT_AVATARS[0].url);

  // Onboarding states (for Google auth or first-time setup)
  const [onboardUsername, setOnboardUsername] = useState('');
  const [onboardFullName, setOnboardFullName] = useState('');
  const [onboardAvatar, setOnboardAvatar] = useState<string>(DEFAULT_AVATARS[0].url);

  // UI & Loading states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  // Poster Carousel Showcase (right side - dynamic TMDB API powered)
  const [posterIndex, setPosterIndex] = useState(0);
  const [dynamicPosters, setDynamicPosters] = useState<Array<{ title: string; bg: string; rating: string; overview?: string }>>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onboardFileInputRef = useRef<HTMLInputElement>(null);

  const isFr = lang === 'fr';

  const defaultShowcasePosters = [
    {
      title: isFr ? 'L’univers cinéma sans limites' : 'Limitless Cinema Streaming',
      bg: 'https://image.tmdb.org/t/p/w1280/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg',
      rating: '8.9/10',
      overview: 'Découvrez des milliers de films en 4K et organisez des soirées cinéma inoubliables.'
    },
    {
      title: isFr ? 'Animation Japonaise & Shōnen' : 'Japanese Anime & Masterpieces',
      bg: 'https://image.tmdb.org/t/p/w1280/2u0w3w9x7h2UoG9xW6v5i9kG8mC.jpg',
      rating: '9.2/10',
      overview: 'Les meilleurs animes, simulcasts et films d’animation en haute fidélité.'
    },
    {
      title: isFr ? 'Salons Watch Party synchronisés' : 'Synced Live Watch Parties',
      bg: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520QIq.jpg',
      rating: '9.0/10',
      overview: 'Regardez vos films préférés ensemble avec vos amis en temps réel.'
    },
    {
      title: isFr ? 'Science-Fiction & Blockbusters' : 'Sci-Fi & Blockbusters',
      bg: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
      rating: '8.8/10',
      overview: 'Voyagez à travers des univers spectaculaires et des sagas cultes.'
    },
    {
      title: isFr ? 'Thrillers & Grands Classiques' : 'Thrillers & Cult Classics',
      bg: 'https://image.tmdb.org/t/p/w1280/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
      rating: '8.7/10',
      overview: 'Suspense palpitant, réalisation d’exception et acteurs légendaires.'
    },
    {
      title: isFr ? 'Séries TV & Épopées Mondiales' : 'TV Series & Epic Sagas',
      bg: 'https://image.tmdb.org/t/p/w1280/z7BNk13y0eA636uV4j9lB217cK.jpg',
      rating: '9.1/10',
      overview: 'Toutes les saisons et épisodes disponibles en streaming instantané.'
    }
  ];

  // Fetch real TMDB dynamic showcase posters from our server API
  useEffect(() => {
    let isMounted = true;
    fetch('/api/tmdb/showcase')
      .then(res => res.json())
      .then(data => {
        if (isMounted && Array.isArray(data) && data.length >= 5) {
          setDynamicPosters(data);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const showcasePosters = dynamicPosters.length >= 5 ? dynamicPosters : defaultShowcasePosters;

  useEffect(() => {
    const timer = setInterval(() => {
      setPosterIndex((prev) => (prev + 1) % showcasePosters.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [showcasePosters.length]);

  // Synchronize view with props if changed externally
  useEffect(() => {
    if (initialView) {
      setCurrentView(initialView);
    }
  }, [initialView]);

  // Pre-fill onboarding if user passed in
  useEffect(() => {
    if (onboardingUser) {
      setCurrentView('view-onboarding');
      setOnboardFullName(onboardingUser.name || onboardingUser.user_metadata?.full_name || '');
      setOnboardAvatar(onboardingUser.photo || onboardingUser.user_metadata?.avatar_url || DEFAULT_AVATARS[0].url);
      
      const suggestedHandle = (onboardingUser.email || '').split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'cinephile';
      setOnboardUsername(suggestedHandle);
    }
  }, [onboardingUser]);

  // Scroll to top upon view change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  if (!isOpen) return null;

  const formatUsernameInput = (val: string) => {
    return val.toLowerCase().replace(/[^a-z0-9_]/g, '');
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'reg' | 'onboard') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg(isFr ? 'L’image dépasse la limite de 4 Mo.' : 'Image exceeds 4MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === 'reg') {
        setRegAvatar(result);
      } else {
        setOnboardAvatar(result);
      }
      showToast(isFr ? 'Photo de profil importée !' : 'Profile picture uploaded!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Close modal and remove auth url query params
  const handleClose = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      url.searchParams.delete('auth');
      url.searchParams.delete('onboarding');
      window.history.replaceState({}, document.title, url.toString());
    } catch (_) {}
    onClose();
  };

  // 1. Google OAuth Flow
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } else {
        // Fallback simulate Google authentication
        setTimeout(() => {
          setLoading(false);
          const mockUser = {
            id: `google_${Date.now()}`,
            email: 'user@google.com',
            user_metadata: { full_name: 'Grace Bonte', avatar_url: DEFAULT_AVATARS[0].url }
          };
          // Mandatory onboarding for all users!
          setOnboardFullName('Grace Bonte');
          setOnboardUsername('grace_bonte');
          setOnboardAvatar(DEFAULT_AVATARS[0].url);
          setCurrentView('view-onboarding');
        }, 800);
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
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword
        });

        if (error) throw error;

        if (data.user) {
          const userMeta = data.user.user_metadata || {};
          const displayName = userMeta.full_name || data.user.email?.split('@')[0] || 'Cinéphile';
          const displayPhoto = userMeta.avatar_url || DEFAULT_AVATARS[0].url;
          const displayHandle = userMeta.username || data.user.email?.split('@')[0] || 'user';

          // Save local session
          localStorage.setItem('levelmovie_username', displayName);
          localStorage.setItem('levelmovie_user_handle', displayHandle);
          localStorage.setItem('levelmovie_user_photo', displayPhoto);

          onLoginSuccess(data.user, displayName, data.user.email || '', displayPhoto, displayHandle);
          showToast(isFr ? `Ravi de vous revoir, ${displayName} !` : `Welcome back, ${displayName}!`, 'success');
          handleClose();
        }
      } else {
        // Fallback local login simulation
        setTimeout(() => {
          setLoading(false);
          const name = loginEmail.split('@')[0];
          const mockUser = { id: `usr_${Date.now()}`, email: loginEmail };
          localStorage.setItem('levelmovie_username', name);
          localStorage.setItem('levelmovie_user_handle', name.toLowerCase());
          localStorage.setItem('levelmovie_user_photo', DEFAULT_AVATARS[0].url);
          
          onLoginSuccess(mockUser, name, loginEmail, DEFAULT_AVATARS[0].url, name.toLowerCase());
          showToast(isFr ? `Connexion réussie !` : `Signed in successfully!`, 'success');
          handleClose();
        }, 700);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || (isFr ? 'Identifiants incorrects ou utilisateur inexistant.' : 'Invalid credentials or user not found.'));
    }
  };

  // 3. Step 1 of Registration: Credentials Validation
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regFirstName.trim() || !regLastName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setErrorMsg(isFr ? 'Veuillez renseigner tous les champs obligatoires.' : 'Please fill all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg(isFr ? 'Le mot de passe doit comporter au moins 6 caractères.' : 'Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg(isFr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }

    if (regUsername.length < 3) {
      setErrorMsg(isFr ? 'L’ID d’utilisateur doit comporter au moins 3 caractères.' : 'User ID must be at least 3 characters.');
      return;
    }

    // Move to Step 2: Avatar & Profile Picture
    setCurrentView('view-register-profile');
  };

  // 4. Step 2 of Registration: Final Registration & Confirmation Email Trigger
  const handleFinalizeRegistration = async () => {
    setLoading(true);
    setErrorMsg('');

    const fullName = `${regFirstName.trim()} ${regLastName.trim()}`.trim();
    const cleanHandle = formatUsernameInput(regUsername);

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signUp({
          email: regEmail.trim(),
          password: regPassword,
          options: {
            data: {
              full_name: fullName,
              first_name: regFirstName.trim(),
              last_name: regLastName.trim(),
              username: cleanHandle,
              avatar_url: regAvatar
            }
          }
        });

        if (error) throw error;

        // Auto-save local profile cache
        localStorage.setItem('levelmovie_username', fullName);
        localStorage.setItem('levelmovie_user_handle', cleanHandle);
        localStorage.setItem('levelmovie_user_photo', regAvatar);

        setLoading(false);
        setCurrentView('view-register-confirm');
      } else {
        // Fallback simulation
        setTimeout(() => {
          setLoading(false);
          localStorage.setItem('levelmovie_username', fullName);
          localStorage.setItem('levelmovie_user_handle', cleanHandle);
          localStorage.setItem('levelmovie_user_photo', regAvatar);
          setCurrentView('view-register-confirm');
        }, 900);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || (isFr ? 'Impossible de créer le compte pour le moment.' : 'Could not create account at this time.'));
    }
  };

  // 5. Password Reset Request
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail && !regEmail) {
      setErrorMsg(isFr ? 'Veuillez entrer votre adresse e-mail.' : 'Please enter your email.');
      return;
    }

    const emailToReset = (loginEmail || regEmail).trim();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.resetPasswordForEmail(emailToReset, {
          redirectTo: `${window.location.origin}/?reset_password=true`
        });
        if (error) throw error;
      }
      setLoading(false);
      setCurrentView('view-forgot-password-sent');
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || (isFr ? 'Erreur lors de l’envoi de l’e-mail de réinitialisation.' : 'Error sending password reset email.'));
    }
  };

  // 6. Mandatory Onboarding Submission (for Google users or first-time creators)
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = formatUsernameInput(onboardUsername);
    const cleanName = onboardFullName.trim() || 'Cinéphile';

    if (!cleanHandle || cleanHandle.length < 3) {
      setErrorMsg(isFr ? 'Votre ID d’utilisateur doit comporter au moins 3 caractères.' : 'Your User ID must be at least 3 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.auth.updateUser({
            data: {
              username: cleanHandle,
              full_name: cleanName,
              avatar_url: onboardAvatar
            }
          });
        }
      }

      localStorage.setItem('levelmovie_username', cleanName);
      localStorage.setItem('levelmovie_user_handle', cleanHandle);
      localStorage.setItem('levelmovie_user_photo', onboardAvatar);

      setLoading(false);
      onLoginSuccess(
        onboardingUser || { id: `usr_${Date.now()}`, email: 'google_user' },
        cleanName,
        onboardingUser?.email || '',
        onboardAvatar,
        cleanHandle
      );
      showToast(isFr ? `Bienvenue sur LevelMovie, @${cleanHandle} !` : `Welcome to LevelMovie, @${cleanHandle}!`, 'success');
      handleClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || (isFr ? 'Erreur de finalisation.' : 'Error finalizing profile.'));
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
    } else if (currentView === 'view-register-credentials') {
      setCurrentView('view-main');
    } else if (currentView === 'view-register-profile') {
      setCurrentView('view-register-credentials');
    } else if (currentView === 'view-register-confirm') {
      setCurrentView('view-main');
    } else if (currentView === 'view-onboarding') {
      handleClose();
    } else {
      setCurrentView('view-main');
    }
  };

  return (
    <div className="fixed inset-0 z-[9600] w-full h-full bg-[#060609] text-[#e2e2e8] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-200 font-sans overscroll-contain">
      
      {/* ======================================================== */}
      {/* GAUCHE: INTERFACE D'AUTHENTIFICATION SOLIDE 100% OPAQUE  */}
      {/* ======================================================== */}
      <div 
        ref={scrollContainerRef} 
        className="w-full md:w-1/2 h-full flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 pt-6 sm:pt-8 overflow-y-auto overscroll-contain touch-pan-y bg-[#0c0c12] border-r border-[#1a1a26] relative z-20 custom-scrollbar"
      >
        
        {/* Conteneur de Vue Principale */}
        <div className="w-full max-w-md my-auto flex-1 flex flex-col justify-center min-h-[520px]">
          
          <div className="w-full relative py-2">
            
            {/* VUE 1 : CHOIX DE CONNEXION PRINCIPAL */}
            {currentView === 'view-main' && (
              <div className="animate-in fade-in duration-200">
                
                {/* En-tête de bienvenue */}
                <div className="text-center mb-7">
                  <div className="mx-auto mb-3 flex items-center justify-center">
                    <LevelMovieLogo className="w-12 h-12 text-[#a855f7] drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black mb-2 text-white tracking-tight">
                    Level<span className="text-[#a855f7]">Movie</span>
                  </h1>
                  <p className="text-white/60 text-xs sm:text-sm px-2 leading-relaxed max-w-sm mx-auto">
                    {isFr 
                      ? 'Connectez-vous pour débloquer les Salons Watch Party, vos listes de favoris et votre profil cinéphile.' 
                      : 'Sign in to access synchronized Watch Parties, personal favorites, and cinema profiles.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-5 p-4 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs shadow-lg space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-rose-300">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{isFr ? 'Oups ! Connexion indisponible' : 'Oops! Connection unavailable'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setErrorMsg('')}
                        className="text-white/40 hover:text-white text-xs cursor-pointer p-0.5"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-white/80 text-[11px] leading-relaxed">
                      {errorMsg.includes('Failed to fetch') || errorMsg.includes('network') || errorMsg.includes('indisponible')
                        ? (isFr ? 'Impossible d’établir la connexion avec les serveurs sécurisés. Veuillez vérifier votre réseau Internet et essayer de vous reconnecter.' : 'Unable to connect to secure servers. Please check your network and try reconnecting.')
                        : errorMsg}
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg('');
                          handleGoogleAuth();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>{isFr ? 'Essayer de vous connecter' : 'Try reconnecting'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Boutons d'actions principaux 100% solides */}
                <div className="space-y-3">
                  
                  {/* Bouton Google Solide */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3.5 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold transition-all shadow-md cursor-pointer active:scale-95 text-xs sm:text-sm"
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
                    className="w-full flex items-center justify-center px-4 py-3.5 bg-[#161622] hover:bg-[#202030] text-white rounded-xl font-bold transition-all border border-[#2a2a3c] shadow-sm cursor-pointer active:scale-95 text-xs sm:text-sm"
                  >
                    <Mail className="w-4 h-4 mr-3 text-[#a855f7]" />
                    <span>{isFr ? "Se connecter avec l'e-mail" : 'Sign in with email'}</span>
                  </button>

                  {/* Bouton Créer un compte */}
                  <button
                    type="button"
                    onClick={() => { setErrorMsg(''); setCurrentView('view-register-credentials'); }}
                    className="w-full flex items-center justify-center px-4 py-3.5 bg-[#1c122c] hover:bg-[#27183e] text-[#d8b4fe] hover:text-white rounded-xl font-bold transition-all border border-[#a855f7]/50 shadow-sm cursor-pointer active:scale-95 text-xs sm:text-sm"
                  >
                    <UserPlus className="w-4 h-4 mr-3 text-[#c084fc]" />
                    <span>{isFr ? 'Créer un compte' : 'Create an account'}</span>
                  </button>

                </div>

              </div>
            )}

            {/* VUE 2 : CONNEXION PAR E-MAIL */}
            {currentView === 'view-login' && (
              <div className="animate-in fade-in duration-200">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-white">
                    {isFr ? 'Connexion' : 'Sign In'}
                  </h2>
                  <p className="text-xs text-white/50 mt-1">
                    {isFr ? 'Entrez vos identifiants pour vous connecter' : 'Enter your credentials to sign in'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-5 p-4 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs shadow-lg space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-rose-300">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{isFr ? 'Oups ! Connexion indisponible' : 'Oops! Connection unavailable'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setErrorMsg('')}
                        className="text-white/40 hover:text-white text-xs cursor-pointer p-0.5"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-white/80 text-[11px] leading-relaxed">
                      {errorMsg.includes('Failed to fetch') || errorMsg.includes('network') || errorMsg.includes('indisponible')
                        ? (isFr ? 'Impossible d’établir la connexion avec les serveurs sécurisés. Veuillez vérifier votre réseau Internet et essayer de vous reconnecter.' : 'Unable to connect to secure servers. Please check your network and try reconnecting.')
                        : errorMsg}
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg('');
                          handleLoginSubmit({ preventDefault: () => {} } as any);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>{isFr ? 'Essayer de vous connecter' : 'Try reconnecting'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      {isFr ? 'Adresse e-mail' : 'Email address'}
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] outline-none shadow-inner"
                      placeholder="nom@exemple.com"
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
                        onClick={() => { setErrorMsg(''); setCurrentView('view-forgot-password'); }}
                        className="text-xs text-[#c084fc] hover:text-white transition-colors cursor-pointer font-medium"
                      >
                        {isFr ? 'Mot de passe oublié ?' : 'Forgot password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] outline-none pr-10 shadow-inner"
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
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>{isFr ? 'Connexion en cours...' : 'Signing in...'}</span>
                      </>
                    ) : (
                      <span>{isFr ? 'Se connecter' : 'Sign In'}</span>
                    )}
                  </button>
                </form>

                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() => { setErrorMsg(''); setCurrentView('view-register-credentials'); }}
                    className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    {isFr ? (
                      <>Pas encore de compte ? <span className="text-[#c084fc] font-bold underline underline-offset-4">Créer un compte</span></>
                    ) : (
                      <>Don't have an account? <span className="text-[#c084fc] font-bold underline underline-offset-4">Create one</span></>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* VUE 3 : MOT DE PASSE OUBLIÉ */}
            {currentView === 'view-forgot-password' && (
              <div className="animate-in fade-in duration-200">
                <div className="text-center mb-5">
                  <h2 className="text-2xl font-black text-white">
                    {isFr ? 'Mot de passe oublié' : 'Forgot Password'}
                  </h2>
                  <p className="text-white/60 text-xs sm:text-sm mt-1 leading-relaxed">
                    {isFr 
                      ? 'Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.' 
                      : 'Enter your email to receive a password reset link.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 shadow-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      {isFr ? 'Adresse e-mail' : 'Email address'}
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] outline-none shadow-inner"
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-2 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>{isFr ? 'Envoi en cours...' : 'Sending...'}</span>
                      </>
                    ) : (
                      <span>{isFr ? 'Envoyer le lien' : 'Send Reset Link'}</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* VUE 4 : MOT DE PASSE OUBLIÉ - CONFIRMATION ENVOI */}
            {currentView === 'view-forgot-password-sent' && (
              <div className="text-center py-4 animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-[#1c122c] border border-[#a855f7]/60 flex items-center justify-center mx-auto mb-4 text-[#c084fc] shadow-md">
                  <Key className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-black mb-2 text-white">
                  {isFr ? 'E-mail envoyé' : 'Email Sent'}
                </h2>
                <p className="text-white/60 text-xs sm:text-sm mb-6 leading-relaxed">
                  {isFr 
                    ? `Un lien de réinitialisation sécurisé a été transmis à l'adresse indiquée si un compte y est associé.` 
                    : `A secure reset link has been dispatched to your email address if an account exists.`}
                </p>

                <button
                  type="button"
                  onClick={() => { setErrorMsg(''); setCurrentView('view-login'); }}
                  className="w-full py-3.5 bg-white text-gray-900 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors cursor-pointer active:scale-95 shadow-md"
                >
                  {isFr ? 'Retour à la connexion' : 'Back to Sign In'}
                </button>
              </div>
            )}

            {/* VUE 5 : INSCRIPTION ÉTAPE 1 (Identifiants, Prénom, Nom, User ID, Email, Mot de passe) */}
            {currentView === 'view-register-credentials' && (
              <div className="animate-in fade-in duration-200">
                <div className="text-center mb-5">
                  <h2 className="text-2xl font-black text-white">
                    {isFr ? 'Créer un compte' : 'Create an Account'}
                  </h2>
                  <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto">
                    {isFr 
                      ? 'Renseignez vos identifiants pour configurer votre profil LevelMovie.' 
                      : 'Enter your credentials to setup your LevelMovie profile.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 shadow-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCredentialsSubmit} className="space-y-3">
                  
                  {/* Prénom & Nom */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                        {isFr ? 'Prénom' : 'First Name'}
                      </label>
                      <input
                        type="text"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none shadow-inner"
                        placeholder="Grace"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                        {isFr ? 'Nom' : 'Last Name'}
                      </label>
                      <input
                        type="text"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none shadow-inner"
                        placeholder="Bonte"
                        required
                      />
                    </div>
                  </div>

                  {/* ID d'utilisateur unique (@username) */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                        {isFr ? 'ID d’utilisateur' : 'User ID / Username'}
                      </label>
                      <span className="text-[10px] text-[#c084fc] font-mono font-bold">
                        {isFr ? 'Public' : 'Public ID'}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">
                        @
                      </div>
                      <input
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(formatUsernameInput(e.target.value))}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] outline-none font-mono shadow-inner"
                        placeholder="grace_b"
                        maxLength={25}
                        required
                      />
                    </div>
                    <p className="text-[10px] text-white/40 mt-1">
                      {isFr 
                        ? 'C’est avec cet ID que les autres cinéphiles vous verront sur le site.' 
                        : 'This is how other users will recognize you in Watch Parties.'}
                    </p>
                  </div>

                  {/* Adresse email */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                      {isFr ? 'Adresse e-mail' : 'Email address'}
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none shadow-inner"
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>

                  {/* Mot de passe & Confirmation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                        {isFr ? 'Mot de passe' : 'Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none pr-8 shadow-inner"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
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
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none shadow-inner"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-3 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{isFr ? 'Continuer' : 'Continue'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => { setErrorMsg(''); setCurrentView('view-login'); }}
                    className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    {isFr ? (
                      <>Vous avez déjà un compte ? <span className="text-[#c084fc] font-bold underline underline-offset-4">Se connecter</span></>
                    ) : (
                      <>Already have an account? <span className="text-[#c084fc] font-bold underline underline-offset-4">Sign In</span></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* VUE 6 : PHOTO DE PROFIL AVANT CRÉATION ET ENVOI DU MAIL */}
            {currentView === 'view-register-profile' && (
              <div className="animate-in fade-in duration-200">
                <div className="text-center mb-5">
                  <h2 className="text-2xl font-black text-white">
                    {isFr ? 'Photo de profil' : 'Profile Photo'}
                  </h2>
                  <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto">
                    {isFr 
                      ? 'Importez une photo personnalisée pour votre profil ou passez cette étape.' 
                      : 'Upload a custom photo or skip to finalize your account.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 shadow-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-4">
                  
                  {/* Photo de profil Card Solide */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#14141e] border border-[#2a2a3c] shadow-md">
                    <div className="relative shrink-0">
                      <img 
                        src={regAvatar} 
                        alt="Avatar sélectionné" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#a855f7] shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#a855f7] text-white">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>@{regUsername ? formatUsernameInput(regUsername) : 'votre_id'}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#a855f7]/20 text-[#d8b4fe] font-mono font-bold">
                          {isFr ? 'Aperçu' : 'Preview'}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 truncate mt-0.5">
                        {regFirstName} {regLastName}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{isFr ? 'Compte vérifié LevelMovie' : 'Verified LevelMovie Profile'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Bouton d'importation personnalisé */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleCustomImageUpload(e, 'reg')}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 px-4 rounded-xl bg-[#1a1228] hover:bg-[#251838] border border-[#a855f7]/50 text-[#d8b4fe] hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm"
                  >
                    <Upload className="w-4 h-4 text-[#c084fc]" />
                    <span>{isFr ? 'Importer depuis votre appareil (JPG/PNG)' : 'Upload from device (JPG/PNG)'}</span>
                  </button>

                  {/* Avatars par défaut proposés */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2">
                      {isFr ? 'Ou choisir un avatar de cinéma :' : 'Or select a cinema avatar:'}
                    </div>
                    <div className="grid grid-cols-4 gap-2.5">
                      {DEFAULT_AVATARS.map((av: AvatarPreset) => {
                        const isSelected = regAvatar === av.url;
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setRegAvatar(av.url)}
                            className={`relative rounded-xl overflow-hidden p-1 transition-all cursor-pointer bg-[#14141e] ${
                              isSelected
                                ? 'border-2 border-[#a855f7] scale-105 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                                : 'border border-[#2a2a3c] hover:border-white/40'
                            }`}
                          >
                            <img src={av.url} alt={av.name} className="w-full h-12 rounded-lg object-cover" />
                            {isSelected && (
                              <div className="absolute top-1 right-1 p-0.5 bg-[#a855f7] rounded-full text-white">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Finales */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleFinalizeRegistration}
                      disabled={loading}
                      className="w-full py-3.5 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>{isFr ? 'Création...' : 'Creating...'}</span>
                        </>
                      ) : (
                        <span>{isFr ? 'Créer le compte' : 'Create Account'}</span>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* VUE 7 : CONFIRMATION D'INSCRIPTION & ENVOI DU MAIL */}
            {currentView === 'view-register-confirm' && (
              <div className="text-center py-4 animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/60 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <h2 className="text-2xl font-black text-white mb-2">
                  {isFr ? 'Inscription réussie !' : 'Account Created!'}
                </h2>

                <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4">
                  {isFr
                    ? `Un e-mail de confirmation et de bienvenue a été envoyé à `
                    : `A confirmation and verification email was sent to `}
                  <strong className="text-[#d8b4fe]">{regEmail}</strong>.
                </p>

                <div className="p-4 rounded-2xl bg-[#14141e] border border-[#2a2a3c] mb-6 text-left shadow-inner">
                  <div className="flex items-center gap-3">
                    <img src={regAvatar} className="w-12 h-12 rounded-full object-cover border border-[#a855f7]" alt="Avatar" />
                    <div>
                      <h4 className="text-xs font-bold text-white">@{formatUsernameInput(regUsername)}</h4>
                      <p className="text-[11px] text-white/50">{regFirstName} {regLastName}</p>
                      <span className="text-[10px] text-emerald-400 font-semibold">{isFr ? 'Identifiant enregistré' : 'User ID assigned'}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const mockUser = { id: `usr_${Date.now()}`, email: regEmail };
                    onLoginSuccess(mockUser, `${regFirstName} ${regLastName}`, regEmail, regAvatar, formatUsernameInput(regUsername));
                    showToast(isFr ? 'Bienvenue sur LevelMovie !' : 'Welcome to LevelMovie!', 'success');
                    handleClose();
                  }}
                  className="w-full py-3.5 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md"
                >
                  {isFr ? 'Accéder à LevelMovie' : 'Enter LevelMovie'}
                </button>
              </div>
            )}

            {/* VUE 8 : ONBOARDING OBLIGATOIRE (GOOGLE OU PREMIÈRE CONNEXION) */}
            {currentView === 'view-onboarding' && (
              <div className="animate-in fade-in duration-200">
                <div className="text-center mb-5">
                  <div className="inline-flex items-center justify-center p-2 rounded-full bg-[#1c122c] border border-[#a855f7]/40 mb-2">
                    <Sparkles className="w-5 h-5 text-[#c084fc]" />
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    {isFr ? 'Finaliser votre profil' : 'Finalize Your Profile'}
                  </h2>
                  <p className="text-xs text-white/60 mt-1 max-w-xs mx-auto">
                    {isFr 
                      ? 'Tous les nouveaux membres doivent choisir leur ID d’utilisateur unique pour être visibles par les autres.' 
                      : 'Choose your unique User ID so other movie watchers can identify you.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 shadow-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                  
                  {/* Photo de profil pour Google/Onboarding */}
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#14141e] border border-[#2a2a3c] shadow-inner">
                    <img 
                      src={onboardAvatar} 
                      alt="Avatar" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#a855f7]"
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
                        {isFr ? 'Changer la photo de profil' : 'Change profile photo'}
                      </button>
                      <p className="text-[10px] text-white/40 mt-0.5">JPG ou PNG (Max 4Mo)</p>
                    </div>
                  </div>

                  {/* ID d'utilisateur unique */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                      {isFr ? 'ID d’utilisateur unique' : 'Unique User ID'}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">
                        @
                      </div>
                      <input
                        type="text"
                        value={onboardUsername}
                        onChange={(e) => setOnboardUsername(formatUsernameInput(e.target.value))}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] outline-none font-mono shadow-inner"
                        placeholder="grace_bonte"
                        maxLength={25}
                        required
                      />
                    </div>
                    <p className="text-[10px] text-white/40 mt-1">
                      {isFr 
                        ? 'C’est cet ID unique qui apparaîtra dans les Watch Parties et les profils.' 
                        : 'This unique ID is shown in Watch Parties and public profiles.'}
                    </p>
                  </div>

                  {/* Nom complet */}
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
                    className="w-full py-3.5 mt-2 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>{isFr ? 'Finalisation...' : 'Finalizing...'}</span>
                      </>
                    ) : (
                      <span>{isFr ? 'Valider mon profil' : 'Finish & Enter LevelMovie'}</span>
                    )}
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* ======================================================== */}
          {/* BOUTONS DU BAS : RETOUR & SORTIR DÉDIÉ                   */}
          {/* ======================================================== */}
          <div className="w-full flex flex-col gap-2 mt-6 pt-4 border-t border-[#1e1e2e]">
            {currentView !== 'view-main' && (
              <button
                type="button"
                onClick={handleBackNavigation}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#14141e] hover:bg-[#1c1c28] text-white/80 hover:text-white border border-[#28283a] transition-all text-xs font-bold cursor-pointer active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#c084fc]" />
                <span>{isFr ? 'Étape précédente' : 'Back'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#181824] hover:bg-[#222232] text-white border border-[#2d2d42] hover:border-[#a855f7]/60 transition-all text-xs font-black uppercase tracking-wider cursor-pointer active:scale-95 shadow-md"
            >
              <LogOut className="w-4 h-4 text-[#a855f7]" />
              <span>{isFr ? 'Sortir' : 'Exit'}</span>
            </button>
          </div>

        </div>

        {/* Règles d'utilisation & Confidentialité */}
        <div className="mt-auto pt-4 pb-2 border-t border-white/5 text-center space-y-1.5 w-full">
          <div className="flex items-center justify-center gap-3 text-[11px] text-white/50">
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

      {/* MODAL POPUP RÈGLES / POLITIQUES */}
      {legalModal && (
        <div className="fixed inset-0 z-[9800] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#14141e] border border-[#2a2a35] rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[80vh]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#060609] via-[#060609]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c12] via-transparent to-[#060609]/40" />

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
                posterIndex === i ? 'w-10 bg-[#a855f7]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

      </div>

    </div>
  );
};
