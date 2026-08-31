import React from 'react';

export const DonaStar = ({ className = "w-6 h-6" }: { className?: string }) => {
  const gradientId = React.useId ? React.useId().replace(/:/g, "_") : "dona_star_grad";
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <linearGradient id={`grad_${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="30%" stopColor="#d8b4fe" />
          <stop offset="65%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
      </defs>
      {/* Solid vibrant purple base path to guarantee 100% full purple opacity across all mobile browsers */}
      <path 
        d="M12 2L14.85 8.35L21.8 9.15L16.65 13.95L18.05 20.85L12 17.45L5.95 20.85L7.35 13.95L2.2 9.15L9.15 8.35L12 2Z" 
        fill="#a855f7"
      />
      {/* Rich gradient layer with crisp stroke */}
      <path 
        d="M12 2L14.85 8.35L21.8 9.15L16.65 13.95L18.05 20.85L12 17.45L5.95 20.85L7.35 13.95L2.2 9.15L9.15 8.35L12 2Z" 
        fill={`url(#grad_${gradientId})`}
        stroke="#f3e8ff"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const LevelMovieLogo = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4V17C5 19.2091 6.79086 21 9 21H20" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 8.35824C10 7.42436 11.0185 6.8488 11.8153 7.33235L17.5855 10.8242C18.3571 11.2915 18.3571 12.4137 17.5855 12.881L11.8153 16.3728C11.0185 16.8564 10 16.2808 10 15.347V8.35824Z" fill={color}/>
  </svg>
);

export const TikTokHomeIcon = ({ className = "w-5 h-5", fill = "currentColor" }: { className?: string; fill?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5L2 11.2H5.2V21.5H10.2V15.2C10.2 14.2 11 13.4 12 13.4C13 13.4 13.8 14.2 13.8 15.2V21.5H18.8V11.2H22L12 2.5Z" />
  </svg>
);

export const WatchPartySVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <polygon points="10 8 15 10 10 12 10 8" fill="currentColor"></polygon>
    <path d="M7 21h10"></path>
    <path d="M12 17v4"></path>
  </svg>
);

export const ChromeLogoSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 2C15.6 2 8 6.7 4 13.8L12.5 28.5C14.3 23 18.7 19 24 19H45.1C41.7 9.2 33.6 2 24 2z"/>
    <path fill="#4CAF50" d="M24 46C32.1 46 39.5 41.7 43.7 35L35.2 20.3C32.3 25.1 26.6 28 20.8 28H1.3C5.1 38.6 13.8 46 24 46z"/>
    <path fill="#FFC107" d="M46 18.9c-.3-1.6-.7-3.2-1.3-4.7L27.6 44.5C36.9 42 44.4 33.8 46 18.9z"/>
    <circle fill="#FFF" cx="24" cy="24" r="11"/>
    <circle fill="#1976D2" cx="24" cy="24" r="9"/>
  </svg>
);

export const copyToClipboardFallback = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try { document.execCommand('copy'); } catch (err) {}
  document.body.removeChild(textArea);
};

export const APP_ID = (typeof (window as any).__app_id !== 'undefined' ? (window as any).__app_id : "level-ia-premium").replace(/\//g, '_');

export const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '027cc951d888c64e5f15dcb853c7347a';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const IMAGE_LOW_RES_URL = 'https://image.tmdb.org/t/p/w185';
export const IMAGE_MEDIUM_RES_URL = 'https://image.tmdb.org/t/p/w300';
export const IMAGE_ORIGINAL = 'https://image.tmdb.org/t/p/original';
export const IMAGE_HERO_LOW = 'https://image.tmdb.org/t/p/w780';

export const isLowDataMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('levelmovie_low_data_mode');
  if (saved !== null) return saved === 'true';
  // Check browser network saveData header hint
  if (typeof navigator !== 'undefined' && (navigator as any).connection?.saveData === true) {
    return true;
  }
  return false;
};

export const setLowDataModeState = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('levelmovie_low_data_mode', String(enabled));
  if (enabled) {
    document.documentElement.classList.add('low-data-mode');
  } else {
    document.documentElement.classList.remove('low-data-mode');
  }
  window.dispatchEvent(new CustomEvent('levelmovie_low_data_change', { detail: { enabled } }));
};

// =========================================================================
// VIP & ASSIDUITE HEBDOMADAIRE (4 CONNEXIONS PAR SEMAINE = STATUT VIP)
// =========================================================================
export interface VipStatusInfo {
  isVip: boolean;
  weeklyLoginsCount: number;
  targetLogins: number;
  currentWeekKey: string;
  loggedDays: string[]; // YYYY-MM-DD
  weekDays: Array<{
    dateStr: string;
    dayNameFr: string;
    dayNameEn: string;
    dayShortFr: string;
    dayShortEn: string;
    active: boolean;
    isToday: boolean;
  }>;
  progressPercent: number;
  donaDailyLimit: number;
  donaUsedToday: number;
  donaRemainingToday: number;
}

const getMondayDateOfCurrentWeek = (): Date => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1); // Adjust for Sunday (0) -> 6
  const monday = new Date(d);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

export const getCurrentWeekKey = (): string => {
  const monday = getMondayDateOfCurrentWeek();
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const day = String(monday.getDate()).padStart(2, '0');
  return `week_${year}_${month}_${day}`;
};

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getWeeklyVipStatus = (): VipStatusInfo => {
  if (typeof window === 'undefined') {
    return {
      isVip: false,
      weeklyLoginsCount: 1,
      targetLogins: 4,
      currentWeekKey: 'week_default',
      loggedDays: [],
      weekDays: [],
      progressPercent: 25,
      donaDailyLimit: 15,
      donaUsedToday: 0,
      donaRemainingToday: 15,
    };
  }

  const weekKey = getCurrentWeekKey();
  const storageKey = `levelmovie_logins_${weekKey}`;
  let loggedDays: string[] = [];

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      loggedDays = JSON.parse(raw);
    }
  } catch (_) {
    loggedDays = [];
  }

  const todayStr = getTodayDateString();
  const daysFr = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const daysEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shortFr = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const shortEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const monday = getMondayDateOfCurrentWeek();
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    weekDays.push({
      dateStr,
      dayNameFr: daysFr[i],
      dayNameEn: daysEn[i],
      dayShortFr: shortFr[i],
      dayShortEn: shortEn[i],
      active: loggedDays.includes(dateStr),
      isToday: dateStr === todayStr,
    });
  }

  const weeklyLoginsCount = loggedDays.length;
  const targetLogins = 4;
  const isPermanentVip = localStorage.getItem('levelmovie_vip_pass') === 'true';
  const isVip = isPermanentVip || weeklyLoginsCount >= targetLogins;

  // Calculate Dona quotas
  const donaUsedStorageKey = `levelmovie_dona_usage_${todayStr}`;
  let donaUsedToday = 0;
  try {
    donaUsedToday = parseInt(localStorage.getItem(donaUsedStorageKey) || '0', 10);
    if (isNaN(donaUsedToday) || donaUsedToday < 0) donaUsedToday = 0;
  } catch (_) {
    donaUsedToday = 0;
  }

  // Quota VIP = 150 requêtes/jour | Quota Nouveau/Standard = 15 requêtes/jour
  const donaDailyLimit = isVip ? 150 : 15;
  const donaRemainingToday = Math.max(0, donaDailyLimit - donaUsedToday);
  const progressPercent = Math.min(100, Math.round((weeklyLoginsCount / targetLogins) * 100));

  return {
    isVip,
    weeklyLoginsCount,
    targetLogins,
    currentWeekKey: weekKey,
    loggedDays,
    weekDays,
    progressPercent,
    donaDailyLimit,
    donaUsedToday,
    donaRemainingToday,
  };
};

export const recordWeeklyLogin = (): { isNewDay: boolean; isVipNow: boolean; info: VipStatusInfo } => {
  if (typeof window === 'undefined') {
    return { isNewDay: false, isVipNow: false, info: getWeeklyVipStatus() };
  }

  const weekKey = getCurrentWeekKey();
  const storageKey = `levelmovie_logins_${weekKey}`;
  const todayStr = getTodayDateString();
  let loggedDays: string[] = [];

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      loggedDays = JSON.parse(raw);
    }
  } catch (_) {
    loggedDays = [];
  }

  let isNewDay = false;
  if (!loggedDays.includes(todayStr)) {
    loggedDays.push(todayStr);
    localStorage.setItem(storageKey, JSON.stringify(loggedDays));
    isNewDay = true;
  }

  const isVipNow = loggedDays.length >= 4 || localStorage.getItem('levelmovie_vip_pass') === 'true';
  if (isVipNow) {
    localStorage.setItem('levelmovie_vip_pass', 'true');
  }

  const info = getWeeklyVipStatus();
  window.dispatchEvent(new CustomEvent('levelmovie_vip_status_change', { detail: info }));

  return { isNewDay, isVipNow, info };
};

export const recordDonaUsage = (): { used: number; remaining: number; limit: number; canProceed: boolean } => {
  if (typeof window === 'undefined') return { used: 0, remaining: 15, limit: 15, canProceed: true };
  const todayStr = getTodayDateString();
  const donaUsedStorageKey = `levelmovie_dona_usage_${todayStr}`;
  const vipInfo = getWeeklyVipStatus();

  let currentUsed = 0;
  try {
    currentUsed = parseInt(localStorage.getItem(donaUsedStorageKey) || '0', 10);
    if (isNaN(currentUsed)) currentUsed = 0;
  } catch (_) {
    currentUsed = 0;
  }

  const nextUsed = currentUsed + 1;
  localStorage.setItem(donaUsedStorageKey, String(nextUsed));

  const limit = vipInfo.donaDailyLimit;
  const remaining = Math.max(0, limit - nextUsed);
  const canProceed = currentUsed < limit;

  window.dispatchEvent(new CustomEvent('levelmovie_dona_quota_change', {
    detail: { used: nextUsed, remaining, limit, isVip: vipInfo.isVip }
  }));

  return {
    used: nextUsed,
    remaining,
    limit,
    canProceed,
  };
};

export const getPosterImageUrl = (path?: string | null, lowData: boolean = isLowDataMode()): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${lowData ? IMAGE_LOW_RES_URL : IMAGE_BASE_URL}${path}`;
};

export const getBackdropImageUrl = (path?: string | null, lowData: boolean = isLowDataMode(), isHero: boolean = false): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (isHero) {
    return `${lowData ? IMAGE_HERO_LOW : IMAGE_ORIGINAL}${path}`;
  }
  return `${lowData ? IMAGE_LOW_RES_URL : IMAGE_BASE_URL}${path}`;
};

export const formatTimeEstimate = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}min ${s}s`;
};

export const BAD_WORDS = ['putain', 'merde', 'connard', 'connasse', 'salope', 'fdp', 'ntm', 'tg', 'encule', 'enculé', 'bite', 'couille', 'chier', 'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'slut', 'whore', 'nigger', 'nigga', 'faggot', 'pédé'];
export const censorText = (text: string) => {
  if (!text) return text;
  let censored = text;
  BAD_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    censored = censored.replace(regex, (match) => '*'.repeat(match.length));
  });
  return censored;
};

export const MATURE_GENRE_IDS = [27, 10752, 80]; // Horror (27), War (10752), Crime (80)
export const filterMatureContent = (items: any[], parentalFilterActive: boolean) => {
  if (!parentalFilterActive || !Array.isArray(items)) return items;
  return items.filter(item => {
    const genreIds = item.genre_ids || (item.genres ? item.genres.map((g: any) => g.id) : []);
    return !genreIds.some((id: number) => MATURE_GENRE_IDS.includes(id));
  });
};

/**
 * Filter catalog for minors (< 18 years old):
 * Removes 18+ content, adult flags, horror/gore/extreme violence genres,
 * and provides youth-adapted suggestion lists for 16-17 year olds.
 * 18+ users have full uncensored access.
 */
export const filterContentByAge = (items: any[], userAge: number | null | undefined) => {
  if (!Array.isArray(items)) return items;
  // If user is 18 or older, or age is undefined (guest default), pass all safe standard items
  if (userAge !== null && userAge !== undefined && userAge >= 18) {
    return items;
  }
  // If user is under 18 (16-17 years old):
  if (userAge !== null && userAge !== undefined && userAge < 18) {
    return items.filter(item => {
      if (!item) return false;
      // Strictly exclude any content flagged as adult or 18+
      if (item.adult === true || item.is_adult === true) return false;
      const genreIds = item.genre_ids || (item.genres ? item.genres.map((g: any) => typeof g === 'object' ? g.id : g) : []);
      // Strictly exclude Horror (27), War/Extreme Gore (10752)
      if (genreIds.includes(27) || genreIds.includes(10752)) return false;
      // Filter out mature anime genres and titles with NSFW/Ecchi/Erotic keywords
      const title = (item.title || item.name || item.original_title || item.original_name || '').toLowerCase();
      const overview = (item.overview || item.synopsis || '').toLowerCase();
      const matureKeywords = ['hentai', 'ecchi', 'erotic', 'gore', 'slasher', 'massacre', '18+', 'nsfw', 'explicit'];
      if (matureKeywords.some(kw => title.includes(kw) || overview.includes(kw))) {
        return false;
      }
      return true;
    });
  }
  return items.filter(item => item && item.adult !== true);
};

export const seededRandom = (seed: number) => {
  return function() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const seededShuffle = (array: any[], seed: number) => {
  const rand = seededRandom(seed);
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const getDailySeed = () => {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
};

export const getWeekSeed = () => {
  const d = new Date();
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const weekNumber = 1 + Math.round(((target.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
  return target.getFullYear() * 100 + weekNumber;
};

export const getHoursUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(1, Math.round((midnight.getTime() - now.getTime()) / 3600000));
};

export interface AvatarPreset {
  id: string;
  name: string;
  category: string;
  gradient: string;
  iconName: 'clapper' | 'film' | 'popcorn' | 'crown' | 'sparkles' | 'shield' | 'bot' | 'skull' | 'flame' | 'gamepad' | 'sword' | 'camera';
}

export const DEFAULT_AVATARS: AvatarPreset[] = [
  {
    id: 'avatar-director',
    name: 'Cinéaste Pro',
    category: 'Cinema',
    gradient: 'from-[#e50914] to-[#991b1b]',
    iconName: 'clapper'
  },
  {
    id: 'avatar-popcorn',
    name: 'Master Popcorn',
    category: 'Cinema',
    gradient: 'from-[#f59e0b] to-[#ea580c]',
    iconName: 'popcorn'
  },
  {
    id: 'avatar-crown',
    name: 'Souverain VIP',
    category: 'VIP',
    gradient: 'from-[#d97706] to-[#b45309]',
    iconName: 'crown'
  },
  {
    id: 'avatar-sparkles',
    name: 'Star Lumière',
    category: 'Action',
    gradient: 'from-[#9333ea] to-[#6366f1]',
    iconName: 'sparkles'
  },
  {
    id: 'avatar-shield',
    name: 'Gardien Cosmique',
    category: 'Action',
    gradient: 'from-[#2563eb] to-[#0284c7]',
    iconName: 'shield'
  },
  {
    id: 'avatar-bot',
    name: 'Cyber Cyborg',
    category: 'Sci-Fi',
    gradient: 'from-[#059669] to-[#0d9488]',
    iconName: 'bot'
  },
  {
    id: 'avatar-skull',
    name: 'Ombre Mystique',
    category: 'Horror',
    gradient: 'from-[#4c1d95] to-[#1e1b4b]',
    iconName: 'skull'
  },
  {
    id: 'avatar-flame',
    name: 'Flamme Phénix',
    category: 'Fantasy',
    gradient: 'from-[#dc2626] to-[#f97316]',
    iconName: 'flame'
  },
  {
    id: 'avatar-gamepad',
    name: 'Pixel Gamer',
    category: 'Gaming',
    gradient: 'from-[#7c3aed] to-[#db2777]',
    iconName: 'gamepad'
  },
  {
    id: 'avatar-sword',
    name: 'Guerrier Épique',
    category: 'Fantasy',
    gradient: 'from-[#0284c7] to-[#4f46e5]',
    iconName: 'sword'
  },
  {
    id: 'avatar-film',
    name: 'Studio Archive',
    category: 'Cinema',
    gradient: 'from-[#334155] to-[#0f172a]',
    iconName: 'film'
  },
  {
    id: 'avatar-camera',
    name: 'Cadreur 4K',
    category: 'Cinema',
    gradient: 'from-[#0f766e] to-[#0369a1]',
    iconName: 'camera'
  }
];

