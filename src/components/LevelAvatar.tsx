import React from 'react';
import { 
  Clapperboard, 
  Film, 
  Popcorn, 
  Crown, 
  Sparkles, 
  Shield, 
  Bot, 
  Ghost, 
  Flame, 
  Gamepad2, 
  Sword, 
  Camera 
} from 'lucide-react';
import { DEFAULT_AVATARS } from '../constants';

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
  'from-[#e50914] to-[#991b1b]',
  'from-[#8b5cf6] to-[#6366f1]',
  'from-[#ec4899] to-[#8b5cf6]',
  'from-[#2563eb] to-[#0284c7]',
  'from-[#059669] to-[#0d9488]',
  'from-[#d97706] to-[#b45309]',
  'from-[#dc2626] to-[#f97316]',
  'from-[#334155] to-[#0f172a]',
];

export const getAvatarIcon = (iconName: string, iconSizeClass: string = 'w-5 h-5') => {
  switch (iconName) {
    case 'clapper':
      return <Clapperboard className={iconSizeClass} />;
    case 'popcorn':
      return <Popcorn className={iconSizeClass} />;
    case 'crown':
      return <Crown className={iconSizeClass} />;
    case 'sparkles':
      return <Sparkles className={iconSizeClass} />;
    case 'shield':
      return <Shield className={iconSizeClass} />;
    case 'bot':
      return <Bot className={iconSizeClass} />;
    case 'skull':
      return <Ghost className={iconSizeClass} />;
    case 'flame':
      return <Flame className={iconSizeClass} />;
    case 'gamepad':
      return <Gamepad2 className={iconSizeClass} />;
    case 'sword':
      return <Sword className={iconSizeClass} />;
    case 'film':
      return <Film className={iconSizeClass} />;
    case 'camera':
      return <Camera className={iconSizeClass} />;
    default:
      return <Clapperboard className={iconSizeClass} />;
  }
};

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

  // Check if avatar ID matches a preset
  const preset = DEFAULT_AVATARS.find(p => p.id === avatar);

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

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10',
    '2xl': 'w-12 h-12',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} font-black text-white shadow-md select-none border-2 border-white/20 shrink-0 transition-transform active:scale-95 ${sizeClasses} ${onClick ? 'cursor-pointer hover:scale-105 hover:border-white/50' : ''} ${className}`}
      title={preset?.name || safeName}
    >
      {/* Glossy inner glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 via-transparent to-black/30 pointer-events-none" />

      {/* SVG Avatar Icon or Fallback Initial */}
      {preset ? (
        <div className="relative z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center">
          {getAvatarIcon(preset.iconName, iconSizes)}
        </div>
      ) : (
        <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] font-black tracking-tight uppercase">
          {initial}
        </span>
      )}

      {/* VIP Crown Badge */}
      {isVip && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full border border-black flex items-center justify-center text-[9px] text-black font-black shadow-md">
          ★
        </div>
      )}
    </div>
  );
};
