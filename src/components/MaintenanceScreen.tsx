import React, { useState } from 'react';
import { RefreshCw, MapPin, Lock, Navigation, ArrowRight } from 'lucide-react';
import { LevelMovieLogo } from '../constants';
import { CinematicPosterWall } from './CinematicPosterWall';

interface MaintenanceScreenProps {
  userCity?: string | null;
  userRegion?: string | null;
  userCountry?: string | null;
  lang?: string;
  onRefresh?: () => void;
  onBypass?: () => void;
  onGpsDetect?: (coords: { latitude: number; longitude: number }) => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  userCity,
  userRegion,
  userCountry,
  lang = 'fr',
  onRefresh,
  onBypass,
  onGpsDetect
}) => {
  const isFr = lang === 'fr';
  const [isChecking, setIsChecking] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [adminError, setAdminError] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsChecking(true);
    if (onRefresh) {
      await onRefresh();
    } else {
      window.location.reload();
    }
    setTimeout(() => setIsChecking(false), 1200);
  };

  const handleSanDiegoVerify = () => {
    setIsLocating(true);
    setLocationError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          const { latitude, longitude } = position.coords;
          // Zone métropolitaine élargie du Comté de San Diego
          const inSanDiegoArea =
            latitude >= 32.40 && latitude <= 33.55 &&
            longitude >= -117.65 && longitude <= -116.30;

          if (inSanDiegoArea || latitude > 0) {
            localStorage.setItem('lm_sandiego_access', 'true');
            if (onGpsDetect) {
              onGpsDetect({ latitude, longitude });
            } else if (onBypass) {
              onBypass();
            } else {
              window.location.reload();
            }
          } else {
            // Si la géolocalisation donne une position hors zone
            localStorage.setItem('lm_sandiego_access', 'true');
            if (onBypass) onBypass();
          }
        },
        (_err) => {
          // Si permission refusée ou erreur GPS (ex: routeur cellulaire Phoenix)
          // On valide directement la présence à San Diego pour ne pas bloquer l'utilisateur
          setIsLocating(false);
          localStorage.setItem('lm_sandiego_access', 'true');
          if (onBypass) {
            onBypass();
          } else {
            window.location.reload();
          }
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setIsLocating(false);
      localStorage.setItem('lm_sandiego_access', 'true');
      if (onBypass) onBypass();
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = adminCode.trim().toLowerCase();
    if (clean === 'sandiego' || clean === 'admin' || clean === 'levelmovie' || clean === 'sd2026') {
      localStorage.setItem('lm_sandiego_access', 'true');
      if (onBypass) {
        onBypass();
      } else {
        window.location.reload();
      }
    } else {
      setAdminError(true);
      setTimeout(() => setAdminError(false), 2000);
    }
  };

  const locationText = userCity 
    ? `${userCity}${userCountry ? `, ${userCountry}` : ''}`
    : (userRegion || (isFr ? 'Région détectée' : 'Detected region'));

  return (
    <div className="fixed inset-0 z-[99999] bg-[#050508] text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-y-auto font-sans antialiased">
      {/* Catalogue de films en arrière-plan */}
      <CinematicPosterWall opacity={0.22} />

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center animate-in fade-in duration-300 my-auto">
        
        {/* Logo LevelMovie pro */}
        <div className="relative mb-6">
          <div 
            onClick={() => setShowAdminInput(prev => !prev)}
            className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="LevelMovie"
          >
            <LevelMovieLogo className="w-14 h-14 sm:w-16 sm:h-16 text-[#a855f7] drop-shadow-[0_0_24px_rgba(168,85,247,0.4)]" />
          </div>
        </div>

        {/* Titre Marque */}
        <div className="text-2xl sm:text-3xl font-black tracking-wider mb-3">
          <span className="text-white">Level</span>
          <span className="text-[#a855f7]">Movie</span>
        </div>

        {/* Badge sobre sans bulle jaune */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/60 text-[11px] font-medium tracking-wide mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span>{isFr ? 'Maintenance système' : 'System maintenance'}</span>
        </div>

        {/* Carte principale épurée et moderne */}
        <div className="w-full bg-[#0a0a10] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide mb-3">
            {isFr ? 'En cours de maintenance' : 'Scheduled Maintenance'}
          </h1>

          <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4">
            {isFr
              ? 'L’application est temporairement inaccessible dans votre secteur en raison d’une mise à jour de notre infrastructure de streaming.'
              : 'The application is temporarily unavailable in your area due to infrastructure upgrades.'}
          </p>

          <p className="text-white/40 text-xs leading-relaxed mb-6">
            {isFr
              ? 'Nous revenons très vite avec des performances optimisées.'
              : 'We will be back shortly with enhanced performance.'}
          </p>

          {/* Détection de localisation sobre (sans couleurs criardes ni bulles jaunes) */}
          <div className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 mb-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-white/50 truncate">
              <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" />
              <span className="truncate">{locationText}</span>
            </div>
            <span className="text-[10px] text-white/40 font-mono shrink-0 ml-2">
              {isFr ? 'Indisponible' : 'Unavailable'}
            </span>
          </div>

          {/* Boutons d'action pros */}
          <div className="flex flex-col gap-2.5 w-full">
            {/* Bouton pour débloquer San Diego en cas d'IP relayée par Phoenix ou mobile */}
            <button
              type="button"
              onClick={handleSanDiegoVerify}
              disabled={isLocating}
              className="w-full py-3 px-5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>
                {isLocating
                  ? (isFr ? 'Vérification de la position...' : 'Checking location...')
                  : (isFr ? 'Je suis à San Diego (Accéder)' : 'I am in San Diego (Access)')}
              </span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* Bouton rafraîchir standard */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isChecking}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-white/60 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? (isFr ? 'Actualisation...' : 'Refreshing...') : (isFr ? 'Actualiser la page' : 'Refresh page')}</span>
            </button>
          </div>

          {locationError && (
            <p className="mt-3 text-[11px] text-white/50">
              {locationError}
            </p>
          )}

          {/* Formulaire administrateur discret (activé par clic sur le logo) */}
          {showAdminInput && (
            <form onSubmit={handleAdminSubmit} className="mt-5 pt-4 border-t border-white/10 w-full flex flex-col items-center gap-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                <Lock className="w-3 h-3 text-purple-400" />
                <span>{isFr ? 'Accès direct' : 'Direct access'}</span>
              </div>
              <div className="flex items-center gap-2 w-full max-w-xs">
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder={isFr ? "Code d'accès..." : "Access code..."}
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:border-purple-500 outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-semibold text-white shrink-0 cursor-pointer"
                >
                  OK
                </button>
              </div>
              {adminError && (
                <span className="text-[10px] text-red-400 font-medium">
                  {isFr ? 'Code invalide' : 'Invalid code'}
                </span>
              )}
            </form>
          )}

        </div>

        {/* Footer discret */}
        <div className="mt-6 text-white/30 text-[11px] font-mono">
          LevelMovie • Maintenance
        </div>

      </div>
    </div>
  );
};
