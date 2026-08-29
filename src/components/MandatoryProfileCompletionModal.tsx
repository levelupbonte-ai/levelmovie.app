import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Camera, Upload, Check, AlertCircle, ShieldCheck,
  User, CheckCircle2, RefreshCw, X, LogOut, ArrowRight, Star,
  ImageIcon, Lock, Heart, Film
} from 'lucide-react';
import { DEFAULT_AVATARS, AvatarPreset, LevelMovieLogo } from '../constants';
import { supabase, isSupabaseConfigured, syncUserProfileSupabase } from '../lib/supabase';

export interface MandatoryProfileCompletionProps {
  isOpen: boolean;
  user: any;
  lang: string;
  showToast: (msg: string, type?: string) => void;
  onComplete: (profile: { name: string; handle: string; photo: string; email: string }) => void;
  onCancelSignOut?: () => void;
}

// Reserved system handles that cannot be registered
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

  // Extract initial values from user metadata
  const userMeta = user?.user_metadata || {};
  const initialName = userMeta.full_name || userMeta.name || user?.email?.split('@')[0] || '';
  const initialEmail = user?.email || userMeta.email || '';
  const initialPhoto = userMeta.avatar_url || userMeta.picture || user?.photoURL || DEFAULT_AVATARS[0].url;

  // Derive initial handle from email or name
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

  const [username, setUsername] = useState(defaultSuggestedHandle || 'cinephile');
  const [fullName, setFullName] = useState(initialName || 'Cinéphile');
  const [avatarUrl, setAvatarUrl] = useState<string>(initialPhoto);
  const [isCustomUploaded, setIsCustomUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [idStatus, setIdStatus] = useState<{ valid: boolean; message: string }>({ valid: true, message: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suggestions chips generator
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

  // Update fields when user prop changes
  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      const name = meta.full_name || meta.name || user.email?.split('@')[0] || 'Cinéphile';
      const email = user.email || meta.email || '';
      const photo = meta.avatar_url || meta.picture || user.photoURL || DEFAULT_AVATARS[0].url;
      const handle = deriveHandle(meta.username || email.split('@')[0] || name || 'cinephile');

      setFullName(name);
      setAvatarUrl(photo);
      setUsername(handle);
    }
  }, [user]);

  // Validate ID / Handle whenever it changes
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
        message: isFr ? 'Cet identifiant est réservé par le système.' : 'This ID is reserved by the system.'
      });
      return;
    }

    setIdStatus({
      valid: true,
      message: isFr ? 'Identifiant unique disponible' : 'Unique ID available'
    });
  }, [username, isFr]);

  if (!isOpen) return null;

  // Process uploaded image file
  const processImageFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(isFr ? 'Format non supporté. Veuillez sélectionner une image (JPG, PNG, WebP).' : 'Unsupported format. Please choose an image (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(isFr ? 'L’image dépasse la limite de 5 Mo.' : 'Image exceeds the 5MB limit.');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
      setIsCustomUploaded(true);
      showToast(isFr ? 'Photo personnalisée importée avec succès !' : 'Custom photo uploaded successfully!', 'success');
    };
    reader.onerror = () => {
      setErrorMsg(isFr ? 'Erreur lors de la lecture du fichier.' : 'Error reading the file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = username.trim().toLowerCase();
    const cleanName = fullName.trim() || 'Cinéphile';

    if (!idStatus.valid || !cleanHandle) {
      setErrorMsg(idStatus.message || (isFr ? 'Veuillez saisir un identifiant valide.' : 'Please enter a valid ID.'));
      return;
    }

    if (!cleanName) {
      setErrorMsg(isFr ? 'Veuillez renseigner votre nom d’affichage.' : 'Please enter your display name.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const userId = user?.id || user?.uid || `oauth_${Date.now()}`;
      const email = initialEmail || user?.email || '';

      // 1. Update Supabase Auth User Metadata
      if (isSupabaseConfigured() && supabase) {
        try {
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              username: cleanHandle,
              full_name: cleanName,
              avatar_url: avatarUrl,
              profile_completed: true,
              completed_at: new Date().toISOString()
            }
          });
          if (updateError) {
            console.warn('Supabase updateUser notice:', updateError.message);
          }
        } catch (e) {
          console.warn('Supabase auth update fallback:', e);
        }

        // 2. Sync to Supabase profiles table
        await syncUserProfileSupabase(userId, {
          name: cleanName,
          email: email,
          photo: avatarUrl,
          preferences: {
            username: cleanHandle,
            profile_completed: true
          }
        });
      }

      // 3. Update localStorage profile keys
      localStorage.setItem('levelmovie_username', cleanName);
      localStorage.setItem('levelmovie_user_name', cleanName);
      localStorage.setItem('levelmovie_user_handle', cleanHandle);
      localStorage.setItem('levelmovie_user_photo', avatarUrl);
      localStorage.setItem('lm_photo', avatarUrl);
      localStorage.setItem(`lm_profile_completed_${userId}`, 'true');
      localStorage.setItem('levelmovie_user_uid', userId);

      setLoading(false);

      showToast(
        isFr ? `Bienvenue sur LevelMovie, @${cleanHandle} !` : `Welcome to LevelMovie, @${cleanHandle}!`,
        'success'
      );

      // 4. Callback to unlock application
      onComplete({
        name: cleanName,
        handle: cleanHandle,
        photo: avatarUrl,
        email: email
      });
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || (isFr ? 'Une erreur est survenue lors de l’enregistrement.' : 'An error occurred while saving.'));
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans select-none animate-in fade-in duration-300">
      
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#a855f7]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Form Container */}
      <div className="relative w-full max-w-xl bg-[#0d0e17] border border-white/15 rounded-3xl p-5 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-10 overflow-hidden my-auto">
        
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-emerald-400" />

        {/* Header Badge & Title */}
        <div className="text-center mb-6 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/40 text-[#d8b4fe] text-[11px] font-black uppercase tracking-wider mb-2.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#c084fc]" />
            <span>{isFr ? 'Connexion Réussie • Étape Obligatoire' : 'OAuth Verified • Mandatory Step'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isFr ? 'Finalisez votre profil LevelMovie' : 'Complete Your LevelMovie Profile'}
          </h2>
          <p className="text-xs text-white/60 mt-1 max-w-md mx-auto leading-relaxed">
            {isFr 
              ? 'Choisissez votre identifiant unique et personnalisez votre photo de profil pour rejoindre la communauté et participer aux salons Watch Party.'
              : 'Choose your unique ID and customize your profile photo to access synced Watch Parties and high-definition streaming.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in shadow-md">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* ========================================================================= */}
          {/* 1. PHOTO DE PROFIL PERSONNALISÉE (UPLOAD + AVATARS)                      */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl bg-[#12131f] border border-white/10 space-y-3.5 shadow-inner">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#c084fc]" />
                <span>{isFr ? 'Photo de profil' : 'Profile Photo'}</span>
              </label>
              {isCustomUploaded && (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{isFr ? 'Photo personnalisée' : 'Custom photo'}</span>
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Live Circular Avatar Preview */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.35)] bg-black/60">
                  <img
                    src={avatarUrl}
                    alt="Preview Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                  title={isFr ? 'Changer la photo' : 'Change photo'}
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span>{isFr ? 'Modifier' : 'Edit'}</span>
                </button>
              </div>

              {/* Upload Dropzone & Button */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 w-full p-3.5 rounded-xl border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1 ${
                  isDragging
                    ? 'border-[#a855f7] bg-[#a855f7]/15 scale-[1.01]'
                    : 'border-white/20 bg-black/30 hover:border-[#a855f7]/60 hover:bg-[#181826]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Upload className="w-4 h-4 text-[#c084fc]" />
                  <span>{isFr ? 'Glisser-déposer ou cliquer pour importer' : 'Drag & drop or click to upload'}</span>
                </div>
                <p className="text-[10px] text-white/40">
                  {isFr ? 'JPG, PNG, WebP ou GIF (Max 5 Mo)' : 'JPG, PNG, WebP or GIF (Max 5MB)'}
                </p>
              </div>
            </div>

            {/* Quick Preset Selector */}
            <div className="pt-2 border-t border-white/5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                {isFr ? 'Ou choisir un avatar de cinéma LevelMovie :' : 'Or select a cinema avatar:'}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {DEFAULT_AVATARS.map((preset: AvatarPreset) => {
                  const isSelected = avatarUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setAvatarUrl(preset.url);
                        setIsCustomUploaded(false);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-square transition-all cursor-pointer bg-[#14141e] ${
                        isSelected
                          ? 'border-2 border-[#a855f7] scale-105 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                          : 'border border-white/10 hover:border-white/40 opacity-70 hover:opacity-100'
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
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
          </div>

          {/* ========================================================================= */}
          {/* 2. IDENTIFIANT UNIQUE OBLIGATOIRE (@username)                              */}
          {/* ========================================================================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                {isFr ? 'Identifiant unique (ID Utilisateur)' : 'Unique User ID (Handle)'}
              </label>
              {username.length > 0 && (
                <span className={`text-[10px] font-bold flex items-center gap-1 ${idStatus.valid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {idStatus.valid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  <span>{idStatus.message}</span>
                </span>
              )}
            </div>

            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c084fc] font-mono font-bold text-sm select-none">
                @
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(deriveHandle(e.target.value))}
                placeholder="mon_pseudo_cine"
                maxLength={20}
                className={`w-full pl-8 pr-4 py-3 rounded-xl text-sm font-mono bg-[#12131f] border text-white placeholder-white/30 outline-none transition-all shadow-inner ${
                  idStatus.valid 
                    ? 'border-white/15 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7]'
                    : 'border-rose-500/60 focus:border-rose-400'
                }`}
                required
              />
            </div>

            {/* Suggestions Chips */}
            {suggestions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-white/40">{isFr ? 'Suggestions :' : 'Suggestions:'}</span>
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setUsername(sug)}
                    className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-[#a855f7]/20 border border-white/10 hover:border-[#a855f7]/40 text-[10px] font-mono text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    @{sug}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 3. NOM D'AFFICHAGE (DISPLAY NAME)                                         */}
          {/* ========================================================================= */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              {isFr ? 'Nom d’affichage' : 'Display Name'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alexandre Dupont"
                maxLength={40}
                className="w-full px-4 py-3 rounded-xl text-sm bg-[#12131f] border border-white/15 text-white placeholder-white/30 focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] outline-none transition-all shadow-inner"
                required
              />
            </div>
            <p className="text-[10px] text-white/40">
              {isFr ? 'Nom visible sur vos avis et dans la barre de profil.' : 'Name shown on your reviews and profile bar.'}
            </p>
          </div>

          {/* ========================================================================= */}
          {/* 4. ACTIONS & CONFIRMATION                                                 */}
          {/* ========================================================================= */}
          <div className="pt-3 space-y-2.5">
            <button
              type="submit"
              disabled={loading || !idStatus.valid}
              className="w-full py-4 bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#ec4899] hover:opacity-95 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isFr ? 'Enregistrement de votre profil...' : 'Finalizing profile...'}</span>
                </>
              ) : (
                <>
                  <span>{isFr ? 'Valider et accéder à LevelMovie' : 'Save & Enter LevelMovie'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {onCancelSignOut && (
              <button
                type="button"
                onClick={onCancelSignOut}
                className="w-full py-2.5 bg-transparent hover:bg-white/5 text-white/40 hover:text-white/80 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isFr ? 'Annuler et se déconnecter' : 'Cancel and Sign Out'}</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
