import React from 'react';
import { DEFAULT_AVATARS } from '../constants';
import { HumanAvatarSvg } from './HumanAvatars';

interface LevelAvatarProps {
  name?: string;
  avatar?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  isVip?: boolean;
  onClick?: () => void;
}

// Deterministic gradients
const BG_PALETTES = [
  'from-[#6366f1] to-[#312e81]',
  'from-[#f43f5e] to-[#881337]',
  'from-[#d97706] to-[#78350f]',
  'from-[#059669] to-[#064e3b]',
  'from-[#9333ea] to-[#4c1d95]',
  'from-[#3b82f6] to-[#1e3a8a]',
  'from-[#0ea5e9] to-[#0369a1]',
  'from-[#f97316] to-[#9a3412]',
  'from-[#10b981] to-[#065f46]',
  'from-[#ec4899] to-[#9d174d]',
  'from-[#334155] to-[#0f172a]',
  'from-[#8b5cf6] to-[#4c1d95]',
];

export const LevelAvatar: React.FC<LevelAvatarProps> = ({
  name = 'Cinéphile',
  avatar,
  size = 'md',
  className = '',
  isVip = false,
  onClick,
}) => {
  const safeName = (name || 'C').trim();
  const initial = safeName.charAt(0).toUpperCase();

  // Check if avatar ID matches a preset or is a human avatar ID
  const preset = DEFAULT_AVATARS.find(p => p.id === avatar);
  const isCustomImage = avatar && (avatar.startsWith('data:') || avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('blob:'));
  const isPresetId = avatar && (preset !== undefined || avatar.startsWith('avatar-'));
  const resolvedAvatarId = preset ? preset.id : (avatar && avatar.startsWith('avatar-') ? avatar : 'avatar-angel');

  // Pick deterministic gradient
  const charCode = safeName.charCodeAt(0) || 0;
  const gradient = preset?.gradient || BG_PALETTES[charCode % BG_PALETTES.length];

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-24 h-24 text-3xl',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden font-black text-white shadow-md select-none border border-white/20 shrink-0 transition-transform active:scale-95 ${sizeClasses} ${onClick ? 'cursor-pointer hover:scale-105 hover:border-white/50' : ''} ${className}`}
      title={preset?.name || safeName}
    >
      {/* 1. Custom uploaded photo */}
      {isCustomImage ? (
        <img
          src={avatar!}
          alt={safeName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full"
        />
      ) : isPresetId ? (
        /* 2. Stylized Human Vector Portrait */
        <HumanAvatarSvg id={resolvedAvatarId} className="w-full h-full object-cover" />
      ) : (
        /* 3. Gradient + Initial fallback */
        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient}`}>
          <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] font-black tracking-tight uppercase">
            {initial}
          </span>
        </div>
      )}

      {/* VIP Crown Badge */}
      {isVip && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full border border-black flex items-center justify-center text-[9px] text-black font-black shadow-md z-20">
          ★
        </div>
      )}
    </div>
  );
};
