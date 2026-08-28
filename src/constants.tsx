import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

export const firebaseConfig = {
  apiKey: "AIzaSyA3JgvNu5p-43037jvm4WRDaJHI9ES7uGM",
  authDomain: "levelup-ecosystem.com",
  projectId: "levelup-ia",
  storageBucket: "levelup-ia.firebasestorage.app",
  messagingSenderId: "229420004282",
  appId: "1:229420004282:web:6735f059a947f0936ae383",
  measurementId: "G-MSRDY2574K"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const APP_ID = (typeof (window as any).__app_id !== 'undefined' ? (window as any).__app_id : "level-ia-premium").replace(/\//g, '_');

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const facebookProvider = new FacebookAuthProvider();

export const VAPID_KEY = 'BPc3w8mDuNONg6Wl5TyU_x-l8KfUAtd_D868u3PaPpgrM7HUBMJ5qmuCCmR_U05YZlzGdYfFHPoQEzCakFaTjGM';
export const NOTIF_PATH = ['artifacts', 'levelup-ecosystem', 'public', 'data', 'notifications'] as const;
export const FCM_TOKEN_PATH = (uid: string) => ['artifacts', 'levelup-ecosystem', 'public', 'data', 'fcm_tokens', uid] as const;

export const API_KEY = '027cc951d888c64e5f15dcb853c7347a';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const IMAGE_ORIGINAL = 'https://image.tmdb.org/t/p/original';

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

export const MATURE_GENRE_IDS = [27, 10752, 80];
export const filterMatureContent = (items: any[], parentalFilterActive: boolean) => {
  if (!parentalFilterActive || !Array.isArray(items)) return items;
  return items.filter(item => {
    const genreIds = item.genre_ids || (item.genres ? item.genres.map((g: any) => g.id) : []);
    return !genreIds.some((id: number) => MATURE_GENRE_IDS.includes(id));
  });
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
  url: string;
  category: string;
}

export const DEFAULT_AVATARS: AvatarPreset[] = [
  {
    id: 'avatar-popcorn',
    name: 'Popcorn VIP',
    url: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=200&q=80',
    category: 'Cinema'
  },
  {
    id: 'avatar-director',
    name: 'Cinéaste / Director',
    url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=200&q=80',
    category: 'Cinema'
  },
  {
    id: 'avatar-cyberpunk',
    name: 'Neon Cyberpunk',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=200&q=80',
    category: 'Sci-Fi'
  },
  {
    id: 'avatar-galaxy',
    name: 'Cosmic Voyager',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80',
    category: 'Sci-Fi'
  },
  {
    id: 'avatar-synthwave',
    name: 'Retro Sunset',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80',
    category: 'Retro'
  },
  {
    id: 'avatar-hero',
    name: 'Dark Hero',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=200&q=80',
    category: 'Hero'
  },
  {
    id: 'avatar-anime',
    name: 'Anime Shinobi',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
    category: 'Anime'
  },
  {
    id: 'avatar-gold',
    name: 'Gold Star VIP',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=200&q=80',
    category: 'VIP'
  }
];
