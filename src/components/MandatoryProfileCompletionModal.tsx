import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Camera, Upload, Check, AlertCircle,
  User, CheckCircle2, RefreshCw, ArrowRight,
  ArrowLeft, Calendar, ShieldAlert
} from 'lucide-react';
import { DEFAULT_AVATARS, AvatarPreset, LevelMovieLogo } from '../constants';
import { supabase, isSupabaseConfigured, syncUserProfileSupabase } from '../lib/supabase';

export interface MandatoryProfileCompletionProps {
  isOpen: boolean;
  user: any;
  lang: string;
  showToast: (msg: string, type?: string) => void;
  onComplete: (profile: { name: string; handle: string; photo: string; email: string; age: number }) => void;
  onCancelSignOut?: () => void;
}

const RESERVED_HANDLES = [
  'admin', 'administrator', 'levelmovie', 'levelup', 'moderator',
  'system', 'support', 'dona', 'dona_ai', 'help', 'root', 'staff',
  'official', 'bot', 'security', 'vip', 'premium'
];

export const MandatoryProfileCompletionModal: React.FC<MandatoryProfileCompletionProps> = ({
  isOpen,
  user,
  lang,
  showToast,
  onComplete,
  onCancelSignOut
}) => {
  const isFr = lang === 'fr';

  const userMeta = user?.user_metadata || {};
  const initialName = userMeta.full_name || userMeta.name || user?.email?.split('@')[0] || '';
  const initialEmail = user?.email || userMeta.email || '';
  const initialPhoto = userMeta.avatar_url || userMeta.picture || user?.photoURL || DEFAULT_AVATARS[0].url;

  const deriveHandle = (raw: string) => {
    return raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 18);
  };

  const defaultSuggestedHandle = deriveHandle(userMeta.username || initialEmail.split('@')[0] || initialName || 'cinephile');

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [username, setUsername] = useState(defaultSuggestedHandle || 'cinephile');
  const [age, setAge] = useState<string>('18');
  const [fullName, setFullName] = useState(initialName || 'Cinéphile');
  const [avatarUrl, setAvatarUrl] = useState<string>(initialPhoto);
  const [isCustomUploaded, setIsCustomUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [idStatus, setIdStatus] = useState<{ valid: boolean; message: string }>({ valid: true, message: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestions = React.useMemo(() => {
    const base = deriveHandle(initialEmail.split('@')[0] || initialName || 'fan');
    return [
      base,
      `${base}_cinema`,
      `${base}_hd`,
      `vip_${base}`,
      `${base}_${Math.floor(10 + Math.random() * 89)}`
    ].filter((v, i, a) => a.indexOf(v) === i && v.length >= 3 && v.length <= 20);
  }, [initialEmail, initialName]);

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      const name = meta.full_name || meta.name || user.email?.split('@')[0] || 'Cinéphile';
      const email = user.email || meta.email || '';
      const photo = meta.avatar_url || meta.picture || user.photoURL || DEFAULT_AVATARS[0].url;
      const handle = deriveHandle(meta.username || email.split('@')[0] || name || 'cinephile');
      const userAge = meta.age ? String(meta.age) : '18';

      setFullName(name);
      setAvatarUrl(photo);
      setUsername(handle);
      setAge(userAge);
    }
  }, [user]);

  useEffect(() => {
    const cleaned = username.trim().toLowerCase();
    if (!cleaned) {
      setIdStatus({
        valid: false,
        message: isFr ? 'L’identifiant unique est requis.' : 'Unique ID is required.'
      });
      return;
    }
    if (cleaned.length < 3) {
      setIdStatus({
        valid: false,
        message: isFr ? 'Minimum 3 caractères requis.' : 'Minimum 3 characters required.'
      });
      return;
    }
    if (cleaned.length > 20) {
      setIdStatus({
        valid: false,
        message: isFr ? 'Maximum 20 caractères.' : 'Maximum 20 characters.'
      });
      return;
    }
    if (!/^[a-z0-9_]+$/.test(cleaned)) {
      setIdStatus({
        valid: false,
        message: isFr ? 'Lettres minuscules, chiffres et _ uniquement.' : 'Only lowercase letters, numbers, and _ allowed.'
      });
      return;
    }
    if (RESERVED_HANDLES.includes(cleaned)) {
      setIdStatus({
        valid: false,
        message: isFr ? 'Cet identifiant est réservé.' : 'This ID is reserved.'
      });
      return;
    }

    setIdStatus({
      valid: true,
      message: isFr ? 'Identifiant disponible' : 'Handle available'
    });
  }, [username, isFr]);

  const handleCustomImageUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(isFr ? 'L’image dépasse 5 Mo.' : 'Image exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
      setIsCustomUploaded(true);
      setErrorMsg('');
      showToast(isFr ? 'Photo importée !' : 'Photo uploaded!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleCustomImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleCustomImageUpload(file);
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!idStatus.valid) {
      setErrorMsg(idStatus.message);
      return;
    }
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 16) {
      setErrorMsg(isFr ? 'Accès réservé aux personnes de 16 ans et plus.' : 'Access reserved for 16+ users.');
      return;
    }
    setStep(3);
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanFullName = fullName.trim() || 'Cinéphile';
    const ageNum = parseInt(age, 10) || 18;

    setLoading(true);

    try {
      if (isSupabaseConfigured() && supabase) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            username: cleanUsername,
            full_name: cleanFullName,
            avatar_url: avatarUrl,
            age: ageNum,
            terms_accepted: true,
            profile_completed: true
          }
        });

        if (updateError) {
          console.warn('Supabase notice:', updateError);
        }

        const uid = user?.id || user?.uid || `usr_${Date.now()}`;
        const email = user?.email || initialEmail || '';

        await syncUserProfileSupabase(uid, {
          email,
          displayName: cleanFullName,
          photoURL: avatarUrl,
          username: cleanUsername,
          age: ageNum,
          profile_completed: true
        });
      }

      const uid = user?.id || user?.uid || `usr_${Date.now()}`;
      localStorage.setItem(`lm_profile_completed_${uid}`, 'true');
      localStorage.setItem('levelmovie_username', cleanFullName);
      localStorage.setItem('levelmovie_user_name', cleanFullName);
      localStorage.setItem('levelmovie_user_handle', cleanUsername);
      localStorage.setItem('levelmovie_user_photo', avatarUrl);
      localStorage.setItem('lm_photo', avatarUrl);
      localStorage.setItem('levelmovie_user_age', String(ageNum));

      setLoading(false);
      showToast(isFr ? `Bienvenue sur LevelMovie, @${cleanUsername} !` : `Welcome to LevelMovie, @${cleanUsername}!`, 'success');

      onComplete({
        name: cleanFullName,
        handle: cleanUsername,
        photo: avatarUrl,
        email: user?.email || initialEmail,
        age: ageNum
      });
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || (isFr ? 'Erreur lors de la configuration.' : 'Configuration failed.'));
    }
  };

  const handleSmartBack = () => {
    setErrorMsg('');
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else {
      if (onCancelSignOut) {
        onCancelSignOut();
      }
    }
  };

  if (!isOpen) return null;

  const isAgeRefused = parseInt(age, 10) < 16;

  return (
    <div className="fixed inset-0 z-[9900] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-[#0d0d14] border border-[#2a2a3c] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto">
        
        {/* En-tête */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-[#1c122c] border border-[#a855f7]/50 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <LevelMovieLogo className="w-6 h-6 text-[#a855f7]" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isFr ? 'Finaliser votre profil' : 'Complete Profile'}
          </h2>
          
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === s 
                    ? 'w-8 bg-[#a855f7]' 
                    : step > s 
                    ? 'w-4 bg-emerald-400' 
                    : 'w-4 bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ÉTAPE 1 : IDENTIFIANT */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                {isFr ? 'Identifiant unique' : 'Unique ID'} <span className="text-rose-400">*</span>
              </label>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">
                  @
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="cinephile_pro"
                  maxLength={20}
                  className={`w-full pl-8 pr-10 py-3 rounded-xl text-sm bg-[#14141e] border text-white placeholder-white/30 outline-none font-mono shadow-inner ${
                    idStatus.valid ? 'border-[#2a2a3c] focus:border-[#a855f7]' : 'border-rose-500 text-rose-300'
                  }`}
                  autoFocus
                  required
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {idStatus.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <span className="text-[10px] text-white/40">{isFr ? 'Suggestions :' : 'Ideas:'}</span>
                {suggestions.slice(0, 3).map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setUsername(sug)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-[#a855f7]/20 text-white/70 hover:text-[#d8b4fe] border border-white/10 transition-colors cursor-pointer"
                  >
                    @{sug}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!idStatus.valid}
              className="w-full py-3.5 mt-2 bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              <span>{isFr ? 'Continuer' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ÉTAPE 2 : ÂGE */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                {isFr ? 'Votre Âge' : 'Your Age'} <span className="text-rose-400">*</span>
              </label>

              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
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

              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                {['16', '17', '18', '21', '25', '30'].map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAge(a)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      age === a 
                        ? 'bg-[#a855f7] text-white shadow-sm' 
                        : 'bg-white/5 hover:bg-white/10 text-white/60'
                    }`}
                  >
                    {a} {isFr ? 'ans' : 'yo'}
                  </button>
                ))}
              </div>

              {isAgeRefused ? (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{isFr ? 'Accès refusé (< 16 ans)' : 'Access denied (< 16 yo)'}</span>
                </div>
              ) : (
                <div className="mt-2 text-[11px] text-white/50">
                  {parseInt(age, 10) < 18 
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

        {/* ÉTAPE 3 : PHOTO & NOM -> VALIDATION DIRECTE */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                {isFr ? 'Nom d’affichage' : 'Display Name'} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alexandre Dupont"
                className="w-full px-4 py-3 rounded-xl text-sm bg-[#14141e] border border-[#2a2a3c] text-white placeholder-white/30 focus:border-[#a855f7] outline-none shadow-inner"
                autoFocus
                required
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#14141e] border border-white/10 space-y-3 shadow-inner">
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#c084fc]" />
                <span>{isFr ? 'Photo de profil personnelle' : 'Profile Picture'}</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Zone d'importation épurée */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer group ${
                  isDragging
                    ? 'border-[#a855f7] bg-[#a855f7]/10'
                    : 'border-[#2a2a3c] hover:border-[#a855f7] bg-white/[0.02]'
                }`}
              >
                {avatarUrl ? (
                  <div className="relative">
                    <img 
                      src={avatarUrl} 
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
                    {avatarUrl 
                      ? (isFr ? 'Cliquez ou glissez pour changer de photo' : 'Click or drop to change photo')
                      : (isFr ? 'Importer votre photo' : 'Upload your photo')}
                  </span>
                  <span className="text-[10px] text-white/40 mt-0.5 block">
                    {isFr ? 'PNG, JPG ou WEBP (max 5 Mo)' : 'PNG, JPG or WEBP (up to 5MB)'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isFr ? 'Enregistrement...' : 'Finalizing...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isFr ? 'Valider et accéder à LevelMovie' : 'Save & Enter LevelMovie'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Bouton Retour Intelligent */}
        <div className="w-full flex flex-col gap-2 mt-4 pt-3 border-t border-[#1e1e2e]">
          <button
            type="button"
            onClick={handleSmartBack}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#14141e] hover:bg-[#1c1c28] text-white/80 hover:text-white border border-[#28283a] transition-all text-xs font-bold cursor-pointer active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#c084fc]" />
            <span>{isFr ? 'Retour' : 'Back'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
