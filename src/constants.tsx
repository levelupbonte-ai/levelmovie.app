import React from 'react';

export const LevelUpEcosystemStar = ({ 
  className = "w-5 h-5", 
  color = "currentColor" 
}: { 
  className?: string; 
  color?: string; 
}) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path 
      d="M16 1.5L19.53 10.87C19.78 11.52 20.48 11.96 21.18 11.96H30.5L23.04 17.65C22.48 18.08 22.25 18.82 22.45 19.49L25.3 28.86L17.7 23.33C17.16 22.94 16.42 22.94 15.88 23.33L8.28 28.86L11.13 19.49C11.33 18.82 11.1 18.08 10.54 17.65L3.08 11.96H12.4C13.1 11.96 13.8 11.52 14.05 10.87L16 1.5Z" 
      fill={color}
    />
  </svg>
);

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

export const LevelMovieLogo = ({ 
  className = "w-6 h-6", 
  color,
  useGradient = false 
}: { 
  className?: string; 
  color?: string;
  useGradient?: boolean;
}) => {
  const gradId = "lvl_movie_logo_grad";
  const strokeColor = useGradient ? `url(#${gradId})` : (color || "currentColor");
  const fillColor = useGradient ? `url(#${gradId})` : (color || "currentColor");

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path d="M5 4V17C5 19.2091 6.79086 21 9 21H20" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 8.35824C10 7.42436 11.0185 6.8488 11.8153 7.33235L17.5855 10.8242C18.3571 11.2915 18.3571 12.4137 17.5855 12.881L11.8153 16.3728C11.0185 16.8564 10 16.2808 10 15.347V8.35824Z" fill={fillColor}/>
    </svg>
  );
};

export const LevelMusicLogo = ({ 
  className = "w-6 h-6", 
  color,
  useGradient = true
}: { 
  className?: string; 
  color?: string;
  useGradient?: boolean;
}) => {
  const gradId = "lvl_music_logo_grad";
  const strokeColor = useGradient ? `url(#${gradId})` : (color || "currentColor");
  const fillColor = useGradient ? `url(#${gradId})` : (color || "currentColor");

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <path d="M9 17V8.5L16 6.8V14.5" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7" cy="17" r="2.5" fill={fillColor}/>
      <circle cx="14" cy="14.5" r="2.5" fill={fillColor}/>
    </svg>
  );
};

export const LevelDayLogo = ({ 
  className = "w-6 h-6", 
  color,
  useGradient = true
}: { 
  className?: string; 
  color?: string;
  useGradient?: boolean;
}) => {
  const gradId = "lvl_day_logo_grad";
  const strokeColor = useGradient ? `url(#${gradId})` : (color || "currentColor");
  const fillColor = useGradient ? `url(#${gradId})` : (color || "currentColor");

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="4.5" fill={fillColor}/>
      <path d="M12 2.5V5M12 19V21.5M2.5 12H5M19 12H21.5M5.28 5.28L7.05 7.05M16.95 16.95L18.72 18.72M5.28 18.72L7.05 16.95M16.95 7.05L18.72 5.28" stroke={strokeColor} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

export const LevelStudioLogo = ({ 
  className = "w-6 h-6", 
  color,
  useGradient = true
}: { 
  className?: string; 
  color?: string;
  useGradient?: boolean;
}) => {
  const gradId = "lvl_studio_logo_grad";
  const strokeColor = useGradient ? `url(#${gradId})` : (color || "currentColor");
  const fillColor = useGradient ? `url(#${gradId})` : (color || "currentColor");

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="13" rx="2" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 8L10 11L7 14" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 14H16" stroke={strokeColor} strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 20H16" stroke={strokeColor} strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 16V20" stroke={strokeColor} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

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
  image?: string;
}

export const DEFAULT_AVATARS: AvatarPreset[] = [
  {
    "id": "avatar-3d-01",
    "name": "Lucas",
    "category": "3D Homme",
    "gradient": "from-[#6366f1] via-[#4f46e5] to-[#1e1b4b]",
    "image": "/avatars/memo_1.png"
  },
  {
    "id": "avatar-3d-02",
    "name": "Malik",
    "category": "3D Homme",
    "gradient": "from-[#059669] via-[#047857] to-[#064e3b]",
    "image": "/avatars/memo_2.png"
  },
  {
    "id": "avatar-3d-03",
    "name": "Tariq",
    "category": "3D Homme",
    "gradient": "from-[#0284c7] via-[#0369a1] to-[#1e3a8a]",
    "image": "/avatars/memo_3.png"
  },
  {
    "id": "avatar-3d-04",
    "name": "Kenji",
    "category": "3D Homme",
    "gradient": "from-[#dc2626] via-[#b91c1c] to-[#7f1d1d]",
    "image": "/avatars/memo_4.png"
  },
  {
    "id": "avatar-3d-05",
    "name": "Jordan",
    "category": "3D Homme",
    "gradient": "from-[#d97706] via-[#b45309] to-[#78350f]",
    "image": "/avatars/memo_5.png"
  },
  {
    "id": "avatar-3d-06",
    "name": "Alexandre",
    "category": "3D Homme",
    "gradient": "from-[#7c3aed] via-[#6d28d9] to-[#3b0764]",
    "image": "/avatars/memo_6.png"
  },
  {
    "id": "avatar-3d-07",
    "name": "Carlos",
    "category": "3D Homme",
    "gradient": "from-[#ea580c] via-[#c2410c] to-[#7c2d12]",
    "image": "/avatars/memo_7.png"
  },
  {
    "id": "avatar-3d-08",
    "name": "Jin",
    "category": "3D Homme",
    "gradient": "from-[#0891b2] via-[#0e7490] to-[#164e63]",
    "image": "/avatars/memo_8.png"
  },
  {
    "id": "avatar-3d-09",
    "name": "Samuel",
    "category": "3D Homme",
    "gradient": "from-[#4f46e5] via-[#4338ca] to-[#1e1b4b]",
    "image": "/avatars/memo_9.png"
  },
  {
    "id": "avatar-3d-10",
    "name": "Enzo",
    "category": "3D Homme",
    "gradient": "from-[#0d9488] via-[#0f766e] to-[#134e4a]",
    "image": "/avatars/memo_10.png"
  },
  {
    "id": "avatar-3d-11",
    "name": "Maxime",
    "category": "3D Homme",
    "gradient": "from-[#3b82f6] via-[#1d4ed8] to-[#172554]",
    "image": "/avatars/memo_11.png"
  },
  {
    "id": "avatar-3d-12",
    "name": "Noah",
    "category": "3D Homme",
    "gradient": "from-[#8b5cf6] via-[#6d28d9] to-[#2e1065]",
    "image": "/avatars/memo_12.png"
  },
  {
    "id": "avatar-3d-13",
    "name": "Diego",
    "category": "3D Homme",
    "gradient": "from-[#10b981] via-[#059669] to-[#064e3b]",
    "image": "/avatars/memo_13.png"
  },
  {
    "id": "avatar-3d-14",
    "name": "Ethan",
    "category": "3D Homme",
    "gradient": "from-[#f59e0b] via-[#d97706] to-[#78350f]",
    "image": "/avatars/memo_14.png"
  },
  {
    "id": "avatar-3d-15",
    "name": "Mohamed",
    "category": "3D Homme",
    "gradient": "from-[#2563eb] via-[#1d4ed8] to-[#0f172a]",
    "image": "/avatars/memo_15.png"
  },
  {
    "id": "avatar-3d-16",
    "name": "Sophia",
    "category": "3D Femme",
    "gradient": "from-[#ec4899] via-[#db2777] to-[#831843]",
    "image": "/avatars/memo_16.png"
  },
  {
    "id": "avatar-3d-17",
    "name": "Amira",
    "category": "3D Femme",
    "gradient": "from-[#fb923c] via-[#ea580c] to-[#7c2d12]",
    "image": "/avatars/memo_17.png"
  },
  {
    "id": "avatar-3d-18",
    "name": "Elena",
    "category": "3D Femme",
    "gradient": "from-[#f59e0b] via-[#d97706] to-[#78350f]",
    "image": "/avatars/memo_18.png"
  },
  {
    "id": "avatar-3d-19",
    "name": "Maya",
    "category": "3D Femme",
    "gradient": "from-[#8b5cf6] via-[#7c3aed] to-[#4c1d95]",
    "image": "/avatars/memo_19.png"
  },
  {
    "id": "avatar-3d-20",
    "name": "Aiko",
    "category": "3D Femme",
    "gradient": "from-[#06b6d4] via-[#0891b2] to-[#164e63]",
    "image": "/avatars/memo_20.png"
  },
  {
    "id": "avatar-3d-21",
    "name": "Chloe",
    "category": "3D Femme",
    "gradient": "from-[#10b981] via-[#059669] to-[#064e3b]",
    "image": "/avatars/memo_21.png"
  },
  {
    "id": "avatar-3d-22",
    "name": "Camille",
    "category": "3D Femme",
    "gradient": "from-[#f43f5e] via-[#e11d48] to-[#881337]",
    "image": "/avatars/memo_22.png"
  },
  {
    "id": "avatar-3d-23",
    "name": "Inès",
    "category": "3D Femme",
    "gradient": "from-[#3b82f6] via-[#2563eb] to-[#1e3a8a]",
    "image": "/avatars/memo_23.png"
  },
  {
    "id": "avatar-3d-24",
    "name": "Zara",
    "category": "3D Femme",
    "gradient": "from-[#a855f7] via-[#9333ea] to-[#581c87]",
    "image": "/avatars/memo_24.png"
  },
  {
    "id": "avatar-3d-25",
    "name": "Léa",
    "category": "3D Femme",
    "gradient": "from-[#c084fc] via-[#a855f7] to-[#6b21a8]",
    "image": "/avatars/memo_25.png"
  },
  {
    "id": "avatar-3d-26",
    "name": "Astrid",
    "category": "3D Femme",
    "gradient": "from-[#d946ef] via-[#c026d3] to-[#701a75]",
    "image": "/avatars/memo_26.png"
  },
  {
    "id": "avatar-3d-27",
    "name": "Sora",
    "category": "3D Femme",
    "gradient": "from-[#14b8a6] via-[#0d9488] to-[#115e59]",
    "image": "/avatars/memo_27.png"
  },
  {
    "id": "avatar-3d-28",
    "name": "Sophie",
    "category": "3D Femme",
    "gradient": "from-[#f97316] via-[#ea580c] to-[#9d174d]",
    "image": "/avatars/memo_28.png"
  },
  {
    "id": "avatar-3d-29",
    "name": "Yasmine",
    "category": "3D Femme",
    "gradient": "from-[#0ea5e9] via-[#0284c7] to-[#0369a1]",
    "image": "/avatars/memo_29.png"
  },
  {
    "id": "avatar-3d-30",
    "name": "Olivia",
    "category": "3D Femme",
    "gradient": "from-[#ec4899] via-[#be123c] to-[#4c0519]",
    "image": "/avatars/memo_30.png"
  },
  {
    "id": "avatar-3d-31",
    "name": "Neo",
    "category": "3D Cinéma",
    "gradient": "from-[#1e293b] via-[#0f172a] to-[#020617]",
    "image": "/avatars/memo_31.png"
  },
  {
    "id": "avatar-3d-32",
    "name": "Titan",
    "category": "3D Cinéma",
    "gradient": "from-[#dc2626] via-[#b91c1c] to-[#450a0a]",
    "image": "/avatars/memo_32.png"
  },
  {
    "id": "avatar-3d-33",
    "name": "Ronin",
    "category": "3D Cinéma",
    "gradient": "from-[#059669] via-[#047857] to-[#022c22]",
    "image": "/avatars/memo_33.png"
  },
  {
    "id": "avatar-3d-34",
    "name": "Phoenix",
    "category": "3D Cinéma",
    "gradient": "from-[#f97316] via-[#ea580c] to-[#7c2d12]",
    "image": "/avatars/memo_34.png"
  },
  {
    "id": "avatar-3d-35",
    "name": "Specter",
    "category": "3D Cinéma",
    "gradient": "from-[#475569] via-[#334155] to-[#0f172a]",
    "image": "/avatars/memo_35.png"
  },
  {
    "id": "avatar-3d-36",
    "name": "Cyber Alpha",
    "category": "3D Futuriste",
    "gradient": "from-[#06b6d4] via-[#3b82f6] to-[#6d28d9]",
    "image": "/avatars/3d_1.png"
  },
  {
    "id": "avatar-3d-37",
    "name": "Neon Nexus",
    "category": "3D Futuriste",
    "gradient": "from-[#38bdf8] via-[#818cf8] to-[#312e81]",
    "image": "/avatars/3d_2.png"
  },
  {
    "id": "avatar-3d-38",
    "name": "Astro 3D",
    "category": "3D Futuriste",
    "gradient": "from-[#ec4899] via-[#8b5cf6] to-[#1e1b4b]",
    "image": "/avatars/3d_3.png"
  },
  {
    "id": "avatar-3d-39",
    "name": "Quantum VR",
    "category": "3D Futuriste",
    "gradient": "from-[#10b981] via-[#06b6d4] to-[#1e3a8a]",
    "image": "/avatars/3d_4.png"
  },
  {
    "id": "avatar-3d-40",
    "name": "Mecha VIP",
    "category": "3D Futuriste",
    "gradient": "from-[#a855f7] via-[#ec4899] to-[#4c0519]",
    "image": "/avatars/3d_5.png"
  }
];


