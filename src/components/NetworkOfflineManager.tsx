import React, { useState, useEffect, useCallback } from 'react';
import { WifiOff, Wifi, RefreshCw, Bookmark, Film, AlertTriangle, ShieldCheck, CheckCircle2, CloudOff, Database } from 'lucide-react';
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
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [retryResult, setRetryResult] = useState<'success' | 'failed' | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');

  const isFr = lang === 'fr';

  // Manual or automatic ping to verify real server connectivity
  const checkConnectivity = useCallback(async (manual = false): Promise<boolean> => {
    if (manual) setIsRetrying(true);
    setRetryResult(null);

    try {
      // First quick check: browser reported state
      if (!navigator.onLine) {
        if (manual) {
          setTimeout(() => {
            setIsRetrying(false);
            setRetryResult('failed');
          }, 600);
        }
        setIsOnline(false);
        return false;
      }

      // Real ping to local /api/health with small cache-busting timestamp
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

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
        setIsOnline(true);
        if (manual) {
          setRetryResult('success');
          setTimeout(() => {
            setIsRetrying(false);
            setShowDetailModal(false);
            if (showToast) {
              showToast(isFr ? 'Connexion réseau rétablie avec succès' : 'Network connection restored successfully', 'success');
            }
          }, 800);
        }
        return true;
      } else {
        throw new Error('Health check returned non-200');
      }
    } catch (e) {
      setIsOnline(false);
      if (manual) {
        setTimeout(() => {
          setIsRetrying(false);
          setRetryResult('failed');
        }, 600);
      }
      return false;
    }
  }, [isFr, showToast]);

  useEffect(() => {
    const handleOnline = () => {
      checkConnectivity(false).then((online) => {
        if (online && showToast) {
          showToast(isFr ? 'Connexion Internet rétablie • Données synchronisées' : 'Internet connection restored • Data synced', 'success');
        }
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      const now = new Date().toLocaleTimeString(isFr ? 'fr-FR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setLastCheckTime(now);
      if (showToast) {
        showToast(isFr ? 'Mode hors-ligne activé (Connexion réseau perdue)' : 'Offline mode active (Network connection lost)', 'error');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic heartbeat check every 30 seconds
    const interval = setInterval(() => {
      if (navigator.onLine) {
        checkConnectivity(false);
      } else {
        setIsOnline(false);
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkConnectivity, isFr, showToast]);

  if (isOnline && !showDetailModal) {
    return null;
  }

  return (
    <>
      {/* 1. Flottant Compact en Haut d'Écran quand déconnecté */}
      {!isOnline && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9990] max-w-[92vw] sm:max-w-md w-full animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="bg-[#100a1c]/95 border border-amber-500/40 hover:border-amber-400 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.25)] rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 backdrop-blur-xl transition-all">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <WifiOff className="w-4 h-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white uppercase tracking-wider truncate">
                    {isFr ? 'Mode Hors-ligne Actif' : 'Offline Mode Active'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                </div>
                <p className="text-[10px] text-white/60 truncate">
                  {isFr ? 'Serveurs distants injoignables • Données locales' : 'Remote servers unreachable • Local cache only'}
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
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#a855f7] hover:from-purple-500 hover:to-[#9333ea] text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {isFr ? 'Détails' : 'Diagnose'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Diagnostic & Gestion Hors-Ligne Pro */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0e0f18] border border-[#a855f7]/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute -top-28 -right-28 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 -left-28 w-60 h-60 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* En-tête */}
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shrink-0">
                  <WifiOff className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                      {isFr ? 'Diagnostic Réseau & Cache' : 'Network & Cache Diagnostic'}
                    </h3>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">
                    LevelMovie Engine • Architecture Haute Tolérance
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Statuts Techniques */}
            <div className="space-y-2.5 relative z-10">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CloudOff className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-white/80">
                    {isFr ? 'Accès Internet & Serveurs Miroirs' : 'Internet Access & Mirror Servers'}
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  isOnline 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isOnline ? (isFr ? 'En ligne' : 'Online') : (isFr ? 'Hors-ligne' : 'Offline')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-[#a855f7]" />
                  <span className="text-xs font-semibold text-white/80">
                    {isFr ? 'Base Locale & Données en Cache' : 'Local Storage & Offline Cache'}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isFr ? 'Opérationnel' : 'Active'}
                </span>
              </div>

              {lastCheckTime && (
                <div className="text-[11px] font-mono text-white/40 px-1 text-right">
                  {isFr ? `Dernière vérification : ${lastCheckTime}` : `Last ping: ${lastCheckTime}`}
                </div>
              )}
            </div>

            {/* Note informative */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-white/70 leading-relaxed relative z-10">
              <p>
                {isFr
                  ? 'Pendant la coupure réseau, vos préférences, votre historique récent et votre Watchlist locale restent totalement consultables. Le streaming en direct et la recherche globale reprendront automatiquement dès le retour du signal.'
                  : 'While offline, your preferences, recent watch history and local Watchlist remain available. Live streaming and catalogue searches will resume automatically once connection returns.'}
              </p>
            </div>

            {/* Boutons d'Action */}
            <div className="space-y-3 relative z-10 pt-2">
              <button
                type="button"
                onClick={() => checkConnectivity(true)}
                disabled={isRetrying}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-[#a855f7] to-[#7c3aed] hover:from-purple-500 hover:to-[#6d28d9] text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>
                  {isRetrying
                    ? (isFr ? 'Test de connectivité en cours...' : 'Testing connectivity...')
                    : (isFr ? 'Tester la Reconnexion Immédiate' : 'Test Connection Now')}
                </span>
              </button>

              {retryResult === 'failed' && (
                <div className="text-center text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 py-2 rounded-xl animate-in fade-in">
                  {isFr ? 'Connexion toujours indisponible. Veuillez vérifier votre réseau Wi-Fi ou mobile.' : 'Connection still unavailable. Please check your Wi-Fi or mobile data.'}
                </div>
              )}

              {retryResult === 'success' && (
                <div className="text-center text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-xl animate-in fade-in flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isFr ? 'Connexion rétablie avec succès !' : 'Connection restored successfully!'}</span>
                </div>
              )}

              <div className="flex gap-2">
                {onOpenWatchlist && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowDetailModal(false);
                      onOpenWatchlist();
                    }}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-[#a855f7]" />
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
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isFr ? 'Historique' : 'History'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
