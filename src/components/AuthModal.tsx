import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Key, ArrowLeft, Check, Sparkles, AlertCircle, Eye, EyeOff,
  User, UserPlus, LogOut, ArrowRight, ShieldCheck, Star, Flame, Lock,
  ChevronRight
} from 'lucide-react';
import { LevelMovieLogo } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any, name: string, email: string, photo?: string | null) => void;
  lang: string;
  showToast: (msg: string, type?: string) => void;
}

// Subviews corresponding exactly to the requested HTML UI design
type AuthView = 
  | 'view-main'                 // Choix principal (Google, E-mail, Créer un compte)
  | 'view-login'                // Connexion par email/mot de passe classique
  | 'view-forgot-password'      // Saisie de l'email pour mot de passe oublié
  | 'view-forgot-password-sent' // Confirmation d'envoi de l'email de réinitialisation
  | 'view-register-step1'       // Étape 1 : Prénom et Nom
  | 'view-register-step2'       // Étape 2 : Email et Mot de passe
  | 'view-register-step3';      // Étape 3 : Validation / Confirmation

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

  // Right side dynamic posters showcase (PC view)
  const showcasePosters = [
    { title: 'Dune: Part Two', bg: 'https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', rating: '8.6', tag: 'Ultra HD 4K' },
    { title: 'Oppenheimer', bg: 'https://image.tmdb.org/t/p/w780/ptpr0kGAckfQkJeJIt8st5dglvd.jpg', rating: '8.9', tag: 'Masterclass' },
    { title: 'Spider-Man: Across the Spider-Verse', bg: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', rating: '8.7', tag: 'Top Animation' },
    { title: 'Stranger Things', bg: 'https://image.tmdb.org/t/p/w780/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', rating: '8.8', tag: 'Série Culte' }
  ];

  const [posterIndex, setPosterIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setPosterIndex((prev) => (prev + 1) % showcasePosters.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, showcasePosters.length]);

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

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } catch (err: any) {
        setLoading(false);
        setErrorMsg(err.message || (isFr ? 'Erreur lors de la connexion Google.' : 'Error during Google sign-in.'));
      }
    } else {
      setTimeout(() => {
        const demoUser = {
          id: 'usr_google_' + Date.now().toString().slice(-6),
          email: 'google.member@levelmovie.app',
          user_metadata: {
            full_name: 'Membre Google VIP'
          }
        };
        localStorage.setItem('levelmovie_user_uid', demoUser.id);
        localStorage.setItem('levelmovie_user_name', 'Membre Google VIP');
        localStorage.setItem('levelmovie_user_email', demoUser.email);
        onLoginSuccess(demoUser, 'Membre Google VIP', demoUser.email, null);
        showToast(isFr ? 'Connecté avec succès via Google' : 'Signed in with Google', 'success');
        handleClose();
      }, 700);
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
        if (error) throw error;

        const name = data.user?.user_metadata?.full_name || loginEmail.split('@')[0];
        const userEmail = data.user?.email || loginEmail;

        localStorage.setItem('levelmovie_user_uid', data.user.id);
        localStorage.setItem('levelmovie_user_name', name);
        localStorage.setItem('levelmovie_user_email', userEmail);

        onLoginSuccess(data.user, name, userEmail, data.user?.user_metadata?.avatar_url || null);
        showToast(isFr ? `Bienvenue, ${name} !` : `Welcome back, ${name}!`, 'success');
        handleClose();
      } catch (err: any) {
        setErrorMsg(err.message || (isFr ? 'Identifiants ou connexion invalides.' : 'Invalid credentials.'));
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
            data: {
              full_name: fullName,
              first_name: regFirstName.trim(),
              last_name: regLastName.trim()
            }
          }
        });
        if (error) throw error;

        if (data.user) {
          localStorage.setItem('levelmovie_user_uid', data.user.id);
          localStorage.setItem('levelmovie_user_name', fullName);
          localStorage.setItem('levelmovie_user_email', regEmail.trim());

          onLoginSuccess(data.user, fullName, regEmail.trim(), null);
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
        const fakeId = 'usr_' + Date.now().toString().slice(-6);
        const fallbackUser = { id: fakeId, email: regEmail.trim() };

        localStorage.setItem('levelmovie_user_uid', fakeId);
        localStorage.setItem('levelmovie_user_name', fullName);
        localStorage.setItem('levelmovie_user_email', regEmail.trim());

        onLoginSuccess(fallbackUser, fullName, regEmail.trim(), null);
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

  return (
    <div className="fixed inset-0 z-[9600] w-screen h-screen bg-[#0f0f13] text-[#e2e2e8] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-300 font-sans">
      
      {/* ======================================================== */}
      {/* GAUCHE: INTERFACE DÉDIÉE (PLEIN ÉCRAN MOBILE & PC)         */}
      {/* ======================================================== */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-start items-center p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 overflow-y-auto custom-scrollbar bg-[#14141a] relative z-20">
        
        {/* Séparateur vertical à dégradé fluide entre les deux panneaux (gauche et droite) */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#8b5cf6]/40 via-[#ec4899]/30 to-transparent z-30 pointer-events-none" />

        {/* Conteneur de Vue Principale (Compact et bien calé vers le haut sans zone vide / blanc inutile) */}
        <div className="w-full max-w-md my-2 sm:my-4">
          
          <div className="bg-[#1e1e24] border border-[#2a2a35] rounded-2xl shadow-2xl w-full p-5 sm:p-7 relative">
            
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
                  className="w-full flex items-center justify-center px-4 py-3 bg-transparent hover:bg-[#2a2a35] text-white rounded-xl font-medium transition-colors border border-[#2a2a35] cursor-pointer active:scale-95 text-sm"
                >
                  <UserPlus className="w-4 h-4 mr-3 text-[#9ca3af]" />
                  <span>{isFr ? 'Créer un compte' : 'Create an account'}</span>
                </button>

              </div>
            )}

            {/* VUE 2 : CONNEXION PAR E-MAIL CLASSIQUE */}
            {currentView === 'view-login' && (
              <div className="animate-in fade-in duration-300">
                <button
                  onClick={() => { setErrorMsg(''); setCurrentView('view-main'); }}
                  className="text-xs text-[#9ca3af] hover:text-white flex items-center gap-1.5 mb-4 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isFr ? 'Retour' : 'Back'}</span>
                </button>

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
                    onClick={() => { setErrorMsg(''); setCurrentView('view-register-step1'); }}
                    className="text-xs text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
                  >
                    {isFr ? "Pas encore de compte ? Créer un compte" : "Don't have an account? Create one"}
                  </button>
                </div>

              </div>
            )}

            {/* VUE MOT DE PASSE OUBLIÉ (Étape 1 : Saisie de l'email) */}
            {currentView === 'view-forgot-password' && (
              <div className="animate-in fade-in duration-300">
                <button
                  onClick={() => { setErrorMsg(''); setCurrentView('view-login'); }}
                  className="text-xs text-[#9ca3af] hover:text-white flex items-center gap-1.5 mb-4 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isFr ? 'Retour à la connexion' : 'Back to login'}</span>
                </button>

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

                <button
                  type="button"
                  onClick={() => { setErrorMsg(''); setCurrentView('view-main'); }}
                  className="w-full py-2.5 bg-[#2a2a35] hover:bg-[#3f3f4e] text-white rounded-xl text-xs font-semibold border border-[#2a2a35] transition-colors cursor-pointer"
                >
                  {isFr ? 'Terminer' : 'Done'}
                </button>
              </div>
            )}

            {/* VUE 3 : INSCRIPTION ÉTAPE 1 (Nom/Prénom) */}
            {currentView === 'view-register-step1' && (
              <div className="animate-in fade-in duration-300">
                <button
                  onClick={() => { setErrorMsg(''); setCurrentView('view-main'); }}
                  className="text-xs text-[#9ca3af] hover:text-white flex items-center gap-1.5 mb-4 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isFr ? 'Retour' : 'Back'}</span>
                </button>

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
                <button
                  onClick={() => { setErrorMsg(''); setCurrentView('view-register-step1'); }}
                  className="text-xs text-[#9ca3af] hover:text-white flex items-center gap-1.5 mb-4 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isFr ? 'Retour' : 'Back'}</span>
                </button>

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

            {/* VUE 5 : INSCRIPTION ÉTAPE 3 (Validation Email) */}
            {currentView === 'view-register-step3' && (
              <div className="text-center py-6 animate-in fade-in duration-300">
                <div className="mx-auto mb-4 flex items-center justify-center">
                  <Mail className="w-12 h-12 text-[#8b5cf6]" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">
                  {isFr ? 'Vérification' : 'Verification'}
                </h2>
                <p className="text-[#9ca3af] text-sm mb-6 px-2 leading-relaxed">
                  {isFr 
                    ? 'Un lien de validation a été envoyé à votre adresse e-mail. Veuillez cliquer sur ce lien pour activer votre compte.' 
                    : 'A verification link has been sent to your email address. Please click it to complete registration.'}
                </p>

                <button
                  type="button"
                  onClick={() => { setErrorMsg(''); setCurrentView('view-main'); }}
                  className="w-full py-2.5 bg-[#2a2a35] hover:bg-[#3f3f4e] text-white rounded-xl text-xs font-semibold border border-[#2a2a35] transition-colors cursor-pointer"
                >
                  {isFr ? 'Terminer' : 'Done'}
                </button>
              </div>
            )}

          </div>

          {/* Bouton SORTIR sous forme de lien épuré */}
          <div className="mt-4 text-center">
            <button
              onClick={handleClose}
              className="text-xs text-[#9ca3af] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 py-1 px-3"
            >
              <LogOut className="w-3.5 h-3.5 rotate-180 text-[#9ca3af]" />
              <span>{isFr ? 'Sortir et retourner au film' : 'Exit and return to player'}</span>
            </button>
          </div>

        </div>

      </div>

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
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white/90 flex items-center gap-2 shadow-sm">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{showcasePosters[posterIndex].tag}</span>
          </span>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-black">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{showcasePosters[posterIndex].rating}</span>
          </div>
        </div>

        {/* Center Poster Title & Highlight */}
        <div className="relative z-10 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8b5cf6] font-bold">
            {isFr ? 'ÉCOSYSTÈME LEVELMOVIE' : 'LEVELMOVIE ECOSYSTEM'}
          </span>
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

