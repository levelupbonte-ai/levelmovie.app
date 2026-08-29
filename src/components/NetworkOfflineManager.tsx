import React, { useState, useEffect, useCallback } from 'react';
import { WifiOff, RefreshCw, Bookmark, Film, CheckCircle2, CloudOff, Database, X } from 'lucide-react';
import { LevelMovieLogo } from '../constants';

interface NetworkOfflineManagerProps {
  lang: string;
  onOpenWatchlist?: () => void;
  onOpenHistory?: () => void;
  showToast?: (msg: string, type?: string) => void;
}

export function NetworkOfflineManager({
  lang,
  onOpenWatchlist,
  onOpenHistory,
  showToast
}: NetworkOfflineManagerProps) {
  // Strict Real Disconnection check: only true if browser is really offline (wifi turned off or zero network)
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });
  
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [retryResult, setRetryResult] = useState<'success' | 'failed' | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');

  const isFr = lang === 'fr';

  // Manual or automatic ping strictly when navigator is offline or user asks
  const checkConnectivity = useCallback(async (manual = false): Promise<boolean> => {
    if (manual) setIsRetrying(true);
    setRetryResult(null);

    // If browser itself reports offline (wifi off)
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
      if (manual) {
        setTimeout(() => {
          setIsRetrying(false);
          setRetryResult('failed');
        }, 500);
      }
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`/api/health?t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const now = new Date().toLocaleTimeString(isFr ? 'fr-FR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setLastCheckTime(now);

      if (res.ok) {
        setIsOffline(false);
        setIsDismissed(false);
        if (manual) {
          setRetryResult('success');
          setTimeout(() => {
            setIsRetrying(false);
            setShowDetailModal(false);
            if (showToast) {
              showToast(isFr ? 'Connexion Internet active et rétablie !' : 'Internet connection active and restored!', 'success');
            }
          }, 600);
        }
        return true;
      } else {
        throw new Error('Health check non-200');
      }
    } catch {
      // If fetch fails and browser is offline
      if (!navigator.onLine) {
        setIsOffline(true);
      }
      if (manual) {
        setTimeout(() => {
          setIsRetrying(false);
          setRetryResult('failed');
        }, 500);
      }
      return false;
    }
  }, [isFr, showToast]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setIsDismissed(false);
      if (showToast) {
        showToast(isFr ? 'Connexion Internet rétablie' : 'Internet connection restored', 'success');
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsDismissed(false);
      const now = new Date().toLocaleTimeString(isFr ? 'fr-FR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setLastCheckTime(now);
      if (showToast) {
        showToast(isFr ? 'Connexion Wi-Fi / Réseau coupée' : 'Network disconnected', 'error');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isFr, showToast]);

  // If online or user explicitly skipped/dismissed banner and modal isn't open
  if (!isOffline && !showDetailModal) {
    return null;
  }

  return (
    <>
      {/* 1. Bandeau discret en haut avec bouton SKIP / FERMER (Uniquement si vrai hors-ligne et non ignoré) */}
      {isOffline && !isDismissed && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9990] max-w-[92vw] sm:max-w-md w-full animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="bg-[#100a1c]/95 border border-amber-500/40 hover:border-amber-400 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.25)] rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 backdrop-blur-xl transition-all">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <WifiOff className="w-4 h-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white uppercase tracking-wider truncate">
                    {isFr ? 'Hors-ligne (Wi-Fi déconnecté)' : 'Offline (No Connection)'}
                  </span>
                </div>
                <p className="text-[10px] text-white/60 truncate">
                  {isFr ? 'Accès aux contenus en cache local' : 'Local cache available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => checkConnectivity(true)}
                disabled={isRetrying}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-50"
                title={isFr ? 'Tester la connexion' : 'Retry connection'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin text-[#a855f7]' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setShowDetailModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#a855f7] hover:from-purple-500 hover:to-[#9333ea] text-white text-[10px] font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {isFr ? 'Détails' : 'Info'}
              </button>
              
              {/* BOUTON SKIP / FERMER POUR NE PAS ÊTRE GÊNÉ */}
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all cursor-pointer"
                title={isFr ? 'Ignorer ce message' : 'Skip & dismiss'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Pop-up Plein Écran Total Net et Sans Flou (Solid Clean Full-Screen Backdrop) */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[9999] bg-[#06060a] flex flex-col justify-between p-4 sm:p-8 overflow-y-auto animate-in fade-in duration-150">
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-between py-6 space-y-6">
            
            {/* Header Plein Écran */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shrink-0">
                  <WifiOff className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                      {isFr ? 'État de la Connexion Réseau' : 'Network Connection Status'}
                    </h3>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">
                    LevelMovie • Mode Hors-Ligne
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
                title={isFr ? 'Fermer' : 'Close'}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Statuts Techniques Clairs et Nets */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#11121c] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CloudOff className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      {isFr ? 'Accès Internet & Wi-Fi' : 'Internet & Wi-Fi Access'}
                    </div>
                    <div className="text-xs text-white/50">
                      {isFr ? 'Vérification du signal réseau' : 'Network signal check'}
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                  !isOffline 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {!isOffline ? (isFr ? 'Connecté' : 'Connected') : (isFr ? 'Wi-Fi Déconnecté' : 'Disconnected')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#11121c] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#a855f7]" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      {isFr ? 'Données Locales & Historique' : 'Local Storage & History'}
                    </div>
                    <div className="text-xs text-white/50">
                      {isFr ? 'Disponibles hors-ligne sans connexion' : 'Available offline'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isFr ? 'Opérationnel' : 'Active'}
                </span>
              </div>

              {lastCheckTime && (
                <div className="text-xs font-mono text-white/40 px-1 text-right">
                  {isFr ? `Dernier test : ${lastCheckTime}` : `Last check: ${lastCheckTime}`}
                </div>
              )}
            </div>

            {/* Note informative */}
            <div className="p-5 rounded-2xl bg-[#151224] border border-purple-500/30 text-xs sm:text-sm text-white/80 leading-relaxed">
              <p>
                {isFr
                  ? 'Vos données sauvegardées (Watchlist, Historique, Paramètres) restent pleinement accessibles sans connexion Internet. Les flux vidéos reprendront dès que vous vous reconnecterez au Wi-Fi.'
                  : 'Your saved data (Watchlist, History, Settings) remain fully accessible without connection. Video streams will resume once you reconnect to Wi-Fi.'}
              </p>
            </div>

            {/* Actions & Bouton Skip */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => checkConnectivity(true)}
                disabled={isRetrying}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-[#a855f7] to-[#7c3aed] hover:from-purple-500 hover:to-[#6d28d9] text-white text-xs font-black uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>
                  {isRetrying
                    ? (isFr ? 'Vérification du signal...' : 'Checking signal...')
                    : (isFr ? 'Tester la Reconnexion' : 'Test Connection')}
                </span>
              </button>

              {retryResult === 'failed' && (
                <div className="text-center text-xs font-bold text-red-400 bg-red-500/15 border border-red-500/30 py-2.5 rounded-xl animate-in fade-in">
                  {isFr ? 'Toujours hors-ligne. Veuillez activer votre Wi-Fi ou vos données mobiles.' : 'Still offline. Please enable Wi-Fi or mobile data.'}
                </div>
              )}

              {retryResult === 'success' && (
                <div className="text-center text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 py-2.5 rounded-xl animate-in fade-in flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isFr ? 'Connexion rétablie avec succès !' : 'Connection restored successfully!'}</span>
                </div>
              )}

              <div className="flex gap-3">
                {onOpenWatchlist && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowDetailModal(false);
                      onOpenWatchlist();
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-[#13141f] hover:bg-[#1a1c2b] border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-[#a855f7]" />
                    <span>{isFr ? 'Ma Watchlist' : 'Watchlist'}</span>
                  </button>
                )}

                {onOpenHistory && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowDetailModal(false);
                      onOpenHistory();
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-[#13141f] hover:bg-[#1a1c2b] border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Film className="w-4 h-4 text-blue-400" />
                    <span>{isFr ? 'Historique' : 'History'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowDetailModal(false);
                    setIsDismissed(true);
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {isFr ? 'Passer / Continuer' : 'Skip & Continue'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
