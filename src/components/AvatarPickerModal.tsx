import React, { useState, useMemo, useRef } from 'react';
import {
  X, Check, Sparkles, Upload, Search, Crown, Users, Film, Camera, RefreshCw
} from 'lucide-react';
import { DEFAULT_AVATARS, AvatarPreset } from '../constants';
import { LevelAvatar } from './LevelAvatar';
import { supabase, isSupabaseConfigured, syncUserProfileSupabase } from '../lib/supabase';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string | null;
  userName: string;
  userHandle?: string;
  isVip?: boolean;
  onSelectAvatar: (avatarIdOrUrl: string) => void;
  showToast?: (msg: string, type?: string) => void;
  lang?: string;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  userName = 'Cinéphile',
  userHandle,
  isVip = false,
  onSelectAvatar,
  showToast,
  lang = 'fr'
}) => {
  const isFr = lang === 'fr';
  const [selectedAvatar, setSelectedAvatar] = useState<string>(() => currentAvatar || DEFAULT_AVATARS[0].id);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected avatar when opened
  React.useEffect(() => {
    if (isOpen && currentAvatar) {
      setSelectedAvatar(currentAvatar);
    }
  }, [isOpen, currentAvatar]);

  const categories = [
    { id: 'all', label: isFr ? 'Tous' : 'All', count: DEFAULT_AVATARS.length },
    { id: '3D Homme', label: isFr ? '3D Hommes' : '3D Men', count: DEFAULT_AVATARS.filter(a => a.category === '3D Homme').length },
    { id: '3D Femme', label: isFr ? '3D Femmes' : '3D Women', count: DEFAULT_AVATARS.filter(a => a.category === '3D Femme').length },
    { id: '3D Cinéma', label: isFr ? '3D Cinéma & Héros' : '3D Cinema & Heroes', count: DEFAULT_AVATARS.filter(a => a.category === '3D Cinéma').length },
    { id: '3D VIP', label: isFr ? '3D VIP & Prestige' : '3D VIP & Prestige', count: DEFAULT_AVATARS.filter(a => a.category === '3D VIP').length },
    { id: '3D Futuriste', label: isFr ? '3D Cyber & Futuriste' : '3D Cyber & Futuristic', count: DEFAULT_AVATARS.filter(a => a.category === '3D Futuriste').length },
  ];

  const filteredAvatars = useMemo(() => {
    return DEFAULT_AVATARS.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchQuery = !searchQuery.trim() || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (showToast) showToast(isFr ? 'Image trop lourde (max 5 Mo).' : 'Image exceeds 5MB.', 'error');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedAvatar(result);
      setIsUploading(false);
      if (showToast) showToast(isFr ? 'Photo importée avec succès !' : 'Photo uploaded successfully!', 'success');
    };
    reader.onerror = () => {
      setIsUploading(false);
      if (showToast) showToast(isFr ? 'Erreur lors de la lecture de l\'image.' : 'Failed to read image.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmSave = async () => {
    try {
      // 1. LocalStorage update
      localStorage.setItem('levelmovie_custom_avatar', selectedAvatar);
      localStorage.setItem('levelmovie_user_photo', selectedAvatar);
      localStorage.setItem('lm_photo', selectedAvatar);

      // 2. Dispatch custom event for immediate global propagation
      window.dispatchEvent(new CustomEvent('levelmovie_avatar_change', { detail: { avatar: selectedAvatar } }));

      // 3. Supabase Sync if active
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await syncUserProfileSupabase(user.id, {
              email: user.email || '',
              displayName: userName,
              username: userHandle || '',
              photoURL: selectedAvatar,
              profile_completed: true
            });
          }
        } catch (err) {
          console.warn('Avatar picker supabase sync notice:', err);
        }
      }

      onSelectAvatar(selectedAvatar);
      if (showToast) {
        showToast(isFr ? 'Avatar appliqué partout sur votre profil !' : 'Avatar applied globally to your profile!', 'success');
      }
      onClose();
    } catch (e) {
      console.error('Error saving avatar:', e);
      onSelectAvatar(selectedAvatar);
      onClose();
    }
  };

  if (!isOpen) return null;

  const selectedPreset = DEFAULT_AVATARS.find(a => a.id === selectedAvatar || a.image === selectedAvatar);

  return (
    <div className="fixed inset-0 z-[9950] bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 select-none">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#090a12] border border-[#a855f7]/30 rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh] overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#a855f7] to-[#7e22ce] flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>{isFr ? 'Galerie Avatars 3D Réalistes' : 'Realistic 3D Avatar Gallery'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/40 text-[#d8b4fe] font-mono">
                  {DEFAULT_AVATARS.length}+ Avatars
                </span>
              </h3>
              <p className="text-xs text-white/50">
                {isFr ? 'Choisissez votre avatar 3D. Il sera visible partout (compte, Watch Party, recherche).' : 'Choose your 3D avatar. It will appear across your account, Watch Parties, and search.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-white/40 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aperçu en direct & Simulateur */}
        <div className="py-3 px-4 my-3 bg-gradient-to-r from-[#140f24] via-[#0d0d18] to-[#090912] border border-[#a855f7]/20 rounded-2xl shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative shrink-0">
              <LevelAvatar avatar={selectedAvatar} name={userName} size="lg" isVip={isVip} />
              {isVip && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full border border-black flex items-center justify-center shadow-md">
                  <Crown className="w-3 h-3 text-black fill-black" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white truncate">
                  {userName}
                </span>
                {isVip && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded font-bold uppercase">
                    VIP
                  </span>
                )}
              </div>
              <span className="text-xs text-[#c084fc] font-mono block">
                @{userHandle || 'cinephile'}
              </span>
              <span className="text-[10px] text-white/40 block mt-0.5">
                {selectedPreset ? `${selectedPreset.name} (${selectedPreset.category})` : (isFr ? 'Photo personnalisée' : 'Custom Photo')}
              </span>
            </div>
          </div>

          {/* Simulateur Mini Watch Party / Live */}
          <div className="w-full sm:w-auto flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-2 rounded-xl text-xs text-white/80">
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
              <LevelAvatar avatar={selectedAvatar} name={userName} size="xs" />
            </div>
            <div className="truncate text-[11px]">
              <strong className="text-purple-300 font-bold mr-1">{userName}:</strong>
              <span className="text-white/70">{isFr ? 'Prêt pour la séance ! 🍿' : 'Ready for the movie! 🍿'}</span>
            </div>
          </div>
        </div>

        {/* Barre de Recherche et Catégories */}
        <div className="space-y-2.5 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFr ? "Rechercher un personnage (ex: Alexandre, Neo, Sophia)..." : "Search character..."}
                className="w-full bg-[#12131e] border border-white/10 focus:border-[#a855f7] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Importer sa propre photo */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-purple-500/50 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              title={isFr ? 'Importer votre photo' : 'Upload custom photo'}
            >
              {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" /> : <Upload className="w-3.5 h-3.5 text-purple-400" />}
              <span className="hidden sm:inline">{isFr ? 'Importer' : 'Upload'}</span>
            </button>
          </div>

          {/* Onglets Filtres */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  activeCategory === cat.id
                    ? 'bg-[#a855f7] border-[#c084fc] text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1 text-[10px] opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grille des Avatars 3D Réalistes */}
        <div className="flex-1 overflow-y-auto p-1.5 custom-scrollbar min-h-0">
          {filteredAvatars.length === 0 ? (
            <div className="py-12 text-center text-white/40 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 text-white/20" />
              <p>{isFr ? 'Aucun avatar trouvé pour cette recherche.' : 'No avatars found.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3">
              {filteredAvatars.map((item) => {
                const isSelected = selectedAvatar === item.id || selectedAvatar === item.image;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAvatar(item.id)}
                    className={`group relative p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#24143d] to-[#140b24] border-[#c084fc] shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105 z-10'
                        : 'bg-white/[0.03] border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="relative transition-transform duration-200 group-hover:scale-110">
                      <LevelAvatar avatar={item.id} name={item.name} size="lg" />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#a855f7] rounded-full border-2 border-black flex items-center justify-center text-white text-[10px] font-black shadow-md animate-in zoom-in">
                          ✓
                        </div>
                      )}
                    </div>

                    <span className="text-xs font-bold text-white/90 group-hover:text-white mt-2 truncate w-full">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-white/40 truncate w-full font-mono">
                      {item.category}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 mt-3 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            {isFr ? 'Annuler' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleConfirmSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#9333ea] hover:from-[#9333ea] hover:to-[#7e22ce] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>{isFr ? 'Confirmer & Utiliser cet Avatar' : 'Confirm & Apply Avatar'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
