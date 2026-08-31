import React from 'react';

interface HumanAvatarProps {
  id: string;
  className?: string;
}

export const HumanAvatarSvg: React.FC<HumanAvatarProps> = ({ id, className = 'w-full h-full' }) => {
  switch (id) {
    case 'avatar-hugo':
      // Hugo: Homme moderne barbe courte, t-shirt noir
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background circle gradient */}
          <circle cx="50" cy="50" r="50" fill="url(#bg-hugo)" />
          {/* Shoulders & Clothing */}
          <path d="M22 100 C22 76, 34 72, 50 72 C66 72, 78 76, 78 100 Z" fill="#181824" />
          <path d="M42 72 L50 82 L58 72 Z" fill="#e0a97a" />
          {/* Neck */}
          <path d="M42 60 H58 V73 H42 Z" fill="#e0a97a" />
          {/* Head & Ears */}
          <ellipse cx="32" cy="50" rx="3.5" ry="6" fill="#d29668" />
          <ellipse cx="68" cy="50" rx="3.5" ry="6" fill="#d29668" />
          <ellipse cx="50" cy="49" rx="19" ry="22" fill="#eeb386" />
          {/* Hair */}
          <path d="M31 43 C31 27, 43 21, 52 21 C62 21, 69 26, 69 36 C69 41, 66 43, 64 43 C62 36, 56 32, 50 32 C43 32, 36 36, 31 43 Z" fill="#3b2314" />
          <path d="M31 38 C32 28, 42 22, 55 23 C64 24, 70 29, 69 38 C67 33, 62 30, 52 29 C40 28, 33 34, 31 38 Z" fill="#26150b" />
          {/* Eyebrows */}
          <path d="M37 42 Q42 39 46 41" stroke="#26150b" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M54 41 Q58 39 63 42" stroke="#26150b" strokeWidth="2.2" strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="42" cy="47" rx="2.5" ry="2.8" fill="#1f1f1f" />
          <circle cx="43" cy="46" r="0.8" fill="#ffffff" />
          <ellipse cx="58" cy="47" rx="2.5" ry="2.8" fill="#1f1f1f" />
          <circle cx="59" cy="46" r="0.8" fill="#ffffff" />
          {/* Nose */}
          <path d="M50 46 V53 L47 55 H53" stroke="#cb8c5d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Beard & Mustache */}
          <path d="M34 50 C34 68, 42 71, 50 71 C58 71, 66 68, 66 50 C66 58, 62 67, 50 67 C38 67, 34 58, 34 50 Z" fill="#2d1a0e" opacity="0.85" />
          <path d="M43 59 Q50 61 57 59" stroke="#26150b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Mouth Smile */}
          <path d="M46 63 Q50 65 54 63" stroke="#b05844" strokeWidth="2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-hugo" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#312e81" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-camille':
      // Camille: Femme cheveux bouclés, boucles d'oreilles dorées
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-camille)" />
          {/* Hair Back */}
          <circle cx="34" cy="38" r="14" fill="#2c1a0e" />
          <circle cx="66" cy="38" r="14" fill="#2c1a0e" />
          <circle cx="50" cy="30" r="16" fill="#2c1a0e" />
          <circle cx="30" cy="52" r="12" fill="#2c1a0e" />
          <circle cx="70" cy="52" r="12" fill="#2c1a0e" />
          {/* Clothes */}
          <path d="M22 100 C22 78, 34 74, 50 74 C66 74, 78 78, 78 100 Z" fill="#be185d" />
          {/* Neck */}
          <path d="M43 62 H57 V75 H43 Z" fill="#c68a5c" />
          <circle cx="50" cy="74" r="2.5" fill="#fbbf24" />
          {/* Face */}
          <ellipse cx="50" cy="50" rx="17" ry="20" fill="#df9b6d" />
          {/* Gold Earrings */}
          <circle cx="32" cy="54" r="3.5" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
          <circle cx="68" cy="54" r="3.5" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
          {/* Hair Front Curls */}
          <path d="M33 36 C35 24, 65 24, 67 36 C61 32, 55 36, 50 33 C45 36, 39 32, 33 36 Z" fill="#1e1008" />
          <circle cx="36" cy="34" r="6" fill="#1e1008" />
          <circle cx="64" cy="34" r="6" fill="#1e1008" />
          {/* Eyebrows */}
          <path d="M38 43 Q43 40 47 42" stroke="#1e1008" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M53 42 Q57 40 62 43" stroke="#1e1008" strokeWidth="1.8" strokeLinecap="round" />
          {/* Eyes & Lashes */}
          <ellipse cx="43" cy="48" rx="2.5" ry="3" fill="#1f1f1f" />
          <circle cx="44" cy="47" r="0.9" fill="#ffffff" />
          <path d="M40 45 L38 43" stroke="#1e1008" strokeWidth="1.2" strokeLinecap="round" />
          <ellipse cx="57" cy="48" rx="2.5" ry="3" fill="#1f1f1f" />
          <circle cx="58" cy="47" r="0.9" fill="#ffffff" />
          <path d="M60 45 L62 43" stroke="#1e1008" strokeWidth="1.2" strokeLinecap="round" />
          {/* Blush */}
          <circle cx="37" cy="54" r="3.5" fill="#f43f5e" opacity="0.25" />
          <circle cx="63" cy="54" r="3.5" fill="#f43f5e" opacity="0.25" />
          {/* Nose */}
          <path d="M50 48 V54 H52" stroke="#ad6d42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Lips */}
          <path d="M45 61 Q50 64 55 61 Q50 67 45 61 Z" fill="#e11d48" />
          <defs>
            <linearGradient id="bg-camille" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f43f5e" />
              <stop offset="1" stopColor="#881337" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-alexandre':
      // Alexandre: Homme élégant lunettes fines, costume VIP
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-alexandre)" />
          {/* Suit */}
          <path d="M20 100 C20 74, 32 70, 50 70 C68 70, 80 74, 80 100 Z" fill="#0f172a" />
          <path d="M42 70 L50 86 L58 70 Z" fill="#ffffff" />
          <path d="M48 76 L50 85 L52 76 Z" fill="#e11d48" />
          {/* Neck */}
          <path d="M43 58 H57 V71 H43 Z" fill="#e5ab82" />
          {/* Head */}
          <ellipse cx="32" cy="49" rx="3.5" ry="5.5" fill="#d49265" />
          <ellipse cx="68" cy="49" rx="3.5" ry="5.5" fill="#d49265" />
          <ellipse cx="50" cy="48" rx="18.5" ry="21" fill="#f0b890" />
          {/* Hair Sleek */}
          <path d="M31 40 C31 22, 45 18, 55 19 C66 20, 70 26, 69 36 C65 31, 57 28, 48 29 C38 30, 33 35, 31 40 Z" fill="#18181b" />
          {/* Glasses */}
          <rect x="36" y="42" width="11" height="9" rx="2.5" stroke="#f59e0b" strokeWidth="1.8" fill="#ffffff" fillOpacity="0.15" />
          <rect x="53" y="42" width="11" height="9" rx="2.5" stroke="#f59e0b" strokeWidth="1.8" fill="#ffffff" fillOpacity="0.15" />
          <path d="M47 46 H53" stroke="#f59e0b" strokeWidth="1.8" />
          <path d="M36 45 L32 44" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M64 45 L68 44" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Eyes behind glasses */}
          <ellipse cx="41.5" cy="46.5" rx="2.2" ry="2.2" fill="#18181b" />
          <circle cx="42" cy="46" r="0.7" fill="#ffffff" />
          <ellipse cx="58.5" cy="46.5" rx="2.2" ry="2.2" fill="#18181b" />
          <circle cx="59" cy="46" r="0.7" fill="#ffffff" />
          {/* Nose */}
          <path d="M50 47 V53 H52" stroke="#c58457" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Confident Smile */}
          <path d="M45 60 Q50 63 55 60" stroke="#92400e" strokeWidth="2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-alexandre" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d97706" />
              <stop offset="1" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-sarah':
      // Sarah: Cheveux roux casquette urbaine
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-sarah)" />
          {/* Long Ginger Hair Behind */}
          <path d="M26 45 C24 65, 28 85, 34 95 H66 C72 85, 76 65, 74 45 Z" fill="#c2410c" />
          {/* Clothes */}
          <path d="M22 100 C22 76, 34 72, 50 72 C66 72, 78 76, 78 100 Z" fill="#047857" />
          {/* Neck */}
          <path d="M43 60 H57 V74 H43 Z" fill="#fbcfe8" />
          {/* Head */}
          <ellipse cx="50" cy="51" rx="17.5" ry="19.5" fill="#fed7aa" />
          {/* Cap Backwards */}
          <path d="M31 38 C31 23, 44 19, 50 19 C56 19, 69 23, 69 38 H31 Z" fill="#0f172a" />
          <path d="M27 38 C27 38, 50 34, 73 38 C73 40, 69 42, 50 42 C31 42, 27 40, 27 38 Z" fill="#1e293b" />
          <circle cx="50" cy="19" r="2" fill="#38bdf8" />
          {/* Eyebrows */}
          <path d="M38 45 Q42 43 46 44" stroke="#9a3412" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M54 44 Q58 43 62 45" stroke="#9a3412" strokeWidth="1.8" strokeLinecap="round" />
          {/* Eyes Greenish */}
          <ellipse cx="42" cy="49" rx="2.5" ry="2.8" fill="#15803d" />
          <circle cx="43" cy="48" r="0.8" fill="#ffffff" />
          <ellipse cx="58" cy="49" rx="2.5" ry="2.8" fill="#15803d" />
          <circle cx="59" cy="48" r="0.8" fill="#ffffff" />
          {/* Freckles */}
          <circle cx="39" cy="54" r="0.8" fill="#c2410c" opacity="0.6" />
          <circle cx="42" cy="55" r="0.8" fill="#c2410c" opacity="0.6" />
          <circle cx="58" cy="55" r="0.8" fill="#c2410c" opacity="0.6" />
          <circle cx="61" cy="54" r="0.8" fill="#c2410c" opacity="0.6" />
          {/* Nose */}
          <path d="M50 49 V54 H52" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Lips */}
          <path d="M45 61 Q50 65 55 61" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-sarah" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" />
              <stop offset="1" stopColor="#064e3b" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-marcus':
      // Marcus: Homme noir dreadlocks courtes, hoodie violet
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-marcus)" />
          {/* Dreads Silhouette */}
          <circle cx="32" cy="30" r="7" fill="#171717" />
          <circle cx="44" cy="22" r="7" fill="#171717" />
          <circle cx="56" cy="22" r="7" fill="#171717" />
          <circle cx="68" cy="30" r="7" fill="#171717" />
          <circle cx="28" cy="42" r="6" fill="#171717" />
          <circle cx="72" cy="42" r="6" fill="#171717" />
          {/* Hoodie */}
          <path d="M20 100 C20 74, 32 70, 50 70 C68 70, 80 74, 80 100 Z" fill="#581c87" />
          <path d="M40 70 Q50 82 60 70" stroke="#a855f7" strokeWidth="3" fill="none" />
          {/* Neck */}
          <path d="M42 58 H58 V72 H42 Z" fill="#6c4428" />
          {/* Head & Ears */}
          <ellipse cx="31" cy="50" rx="3.5" ry="5.5" fill="#58341c" />
          <ellipse cx="69" cy="50" rx="3.5" ry="5.5" fill="#58341c" />
          <ellipse cx="50" cy="49" rx="19" ry="21" fill="#78492c" />
          {/* Eyebrows */}
          <path d="M37 42 Q42 39 46 41" stroke="#171717" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M54 41 Q58 39 63 42" stroke="#171717" strokeWidth="2.4" strokeLinecap="round" />
          {/* Eyes Dark Brown */}
          <ellipse cx="42" cy="47" rx="2.6" ry="2.8" fill="#171717" />
          <circle cx="43" cy="46" r="0.8" fill="#ffffff" />
          <ellipse cx="58" cy="47" rx="2.6" ry="2.8" fill="#171717" />
          <circle cx="59" cy="46" r="0.8" fill="#ffffff" />
          {/* Nose */}
          <path d="M46 54 Q50 56 54 54" stroke="#4a2a16" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* Goatee / Mustache */}
          <path d="M44 59 Q50 61 56 59" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="50" cy="67" rx="3" ry="2" fill="#171717" />
          {/* Smile */}
          <path d="M45 63 Q50 67 55 63" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-marcus" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333ea" />
              <stop offset="1" stopColor="#4c1d95" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-lea':
      // Léa: Blonde avec chignon chic, col roulé
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-lea)" />
          {/* Top Bun */}
          <circle cx="50" cy="18" r="10" fill="#eab308" />
          <circle cx="50" cy="18" r="8" fill="#ca8a04" />
          {/* High Collar Black */}
          <path d="M22 100 C22 78, 34 74, 50 74 C66 74, 78 78, 78 100 Z" fill="#09090b" />
          <path d="M41 64 H59 V76 H41 Z" fill="#18181b" />
          {/* Head & Neck */}
          <ellipse cx="50" cy="50" rx="17" ry="20" fill="#fde047" opacity="0.2" />
          <ellipse cx="50" cy="49" rx="17" ry="20" fill="#ffedd5" />
          {/* Hair Front */}
          <path d="M33 36 C33 24, 46 22, 50 22 C54 22, 67 24, 67 36 C62 31, 56 31, 50 31 C44 31, 38 31, 33 36 Z" fill="#eab308" />
          {/* Gold Stud Earrings */}
          <circle cx="32" cy="52" r="2.5" fill="#f59e0b" />
          <circle cx="68" cy="52" r="2.5" fill="#f59e0b" />
          {/* Eyebrows */}
          <path d="M38 42 Q42 39 46 41" stroke="#a16207" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M54 41 Q58 39 62 42" stroke="#a16207" strokeWidth="1.7" strokeLinecap="round" />
          {/* Blue Eyes */}
          <ellipse cx="42" cy="47" rx="2.5" ry="2.8" fill="#0284c7" />
          <circle cx="43" cy="46" r="0.8" fill="#ffffff" />
          <ellipse cx="58" cy="47" rx="2.5" ry="2.8" fill="#0284c7" />
          <circle cx="59" cy="46" r="0.8" fill="#ffffff" />
          {/* Nose */}
          <path d="M50 48 V53 H52" stroke="#ea580c" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />
          {/* Red Lipstick Smile */}
          <path d="M45 60 Q50 64 55 60" stroke="#be123c" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-lea" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-lucas':
      // Lucas: Jeune aventurier veste denim
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-lucas)" />
          {/* Denim Jacket */}
          <path d="M20 100 C20 74, 32 70, 50 70 C68 70, 80 74, 80 100 Z" fill="#1d4ed8" />
          <path d="M42 70 L50 82 L58 70 Z" fill="#ffffff" />
          {/* Neck */}
          <path d="M43 58 H57 V72 H43 Z" fill="#fed7aa" />
          {/* Head */}
          <ellipse cx="32" cy="49" rx="3.5" ry="5.5" fill="#fba968" />
          <ellipse cx="68" cy="49" rx="3.5" ry="5.5" fill="#fba968" />
          <ellipse cx="50" cy="48" rx="18.5" ry="21" fill="#fed7aa" />
          {/* Messy Brown Hair */}
          <path d="M30 38 C30 22, 42 16, 52 16 C64 16, 71 22, 70 34 C66 28, 62 26, 56 26 C48 26, 42 30, 36 34 L30 38 Z" fill="#451a03" />
          <path d="M48 16 L54 12 L56 18 Z" fill="#451a03" />
          <path d="M38 18 L42 13 L45 19 Z" fill="#451a03" />
          {/* Eyebrows */}
          <path d="M37 42 Q42 39 46 41" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
          <path d="M54 41 Q58 39 63 42" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="42" cy="47" rx="2.5" ry="2.8" fill="#18181b" />
          <circle cx="43" cy="46" r="0.8" fill="#ffffff" />
          <ellipse cx="58" cy="47" rx="2.5" ry="2.8" fill="#18181b" />
          <circle cx="59" cy="46" r="0.8" fill="#ffffff" />
          {/* Nose */}
          <path d="M50 47 V53 H52" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          {/* Wide Smile */}
          <path d="M44 60 Q50 66 56 60" stroke="#b45309" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-lucas" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0ea5e9" />
              <stop offset="1" stopColor="#0369a1" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-ines':
      // Inès: Carré court moderne et lunettes rétro
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-ines)" />
          {/* Bob Hair Cut Back */}
          <path d="M28 35 C28 55, 30 70, 36 75 H64 C70 70, 72 55, 72 35 Z" fill="#18181b" />
          {/* Clothes */}
          <path d="M22 100 C22 78, 34 74, 50 74 C66 74, 78 78, 78 100 Z" fill="#ea580c" />
          {/* Neck */}
          <path d="M43 60 H57 V75 H43 Z" fill="#fdba74" />
          {/* Head */}
          <ellipse cx="50" cy="50" rx="17.5" ry="19.5" fill="#ffedd5" />
          {/* Bangs */}
          <path d="M30 38 C32 25, 45 22, 50 22 C55 22, 68 25, 70 38 C65 34, 55 35, 50 35 C45 35, 35 34, 30 38 Z" fill="#18181b" />
          {/* Retro Sunglasses */}
          <rect x="35" y="44" width="12" height="8" rx="4" fill="#09090b" stroke="#f59e0b" strokeWidth="1.2" />
          <rect x="53" y="44" width="12" height="8" rx="4" fill="#09090b" stroke="#f59e0b" strokeWidth="1.2" />
          <path d="M47 48 H53" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M38 46 L42 47" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
          <path d="M56 46 L60 47" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
          {/* Red Lips */}
          <path d="M45 62 Q50 66 55 62 Q50 64 45 62 Z" fill="#dc2626" />
          <defs>
            <linearGradient id="bg-ines" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316" />
              <stop offset="1" stopColor="#9a3412" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-yanis':
      // Yanis: Bonnet réalisateur (Beanie), lunettes rondes
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-yanis)" />
          {/* Jacket */}
          <path d="M20 100 C20 74, 32 70, 50 70 C68 70, 80 74, 80 100 Z" fill="#1f2937" />
          <path d="M42 70 L50 82 L58 70 Z" fill="#e5e7eb" />
          {/* Neck */}
          <path d="M42 58 H58 V72 H42 Z" fill="#e5a87b" />
          {/* Head & Ears */}
          <ellipse cx="31" cy="50" rx="3.5" ry="5.5" fill="#d29367" />
          <ellipse cx="69" cy="50" rx="3.5" ry="5.5" fill="#d29367" />
          <ellipse cx="50" cy="49" rx="19" ry="21" fill="#f4be95" />
          {/* Beanie Hat */}
          <path d="M30 36 C30 20, 44 14, 50 14 C56 14, 70 20, 70 36 H30 Z" fill="#dc2626" />
          <rect x="28" y="34" width="44" height="6" rx="2" fill="#b91c1c" />
          {/* Round Glasses */}
          <circle cx="41" cy="47" r="5.5" stroke="#18181b" strokeWidth="1.8" fill="#ffffff" fillOpacity="0.2" />
          <circle cx="59" cy="47" r="5.5" stroke="#18181b" strokeWidth="1.8" fill="#ffffff" fillOpacity="0.2" />
          <path d="M46.5 47 H53.5" stroke="#18181b" strokeWidth="1.8" />
          {/* Eyes */}
          <circle cx="41" cy="47" r="2.2" fill="#18181b" />
          <circle cx="41.5" cy="46.5" r="0.7" fill="#ffffff" />
          <circle cx="59" cy="47" r="2.2" fill="#18181b" />
          <circle cx="59.5" cy="46.5" r="0.7" fill="#ffffff" />
          {/* Stubble Beard */}
          <path d="M34 52 C34 68, 42 71, 50 71 C58 71, 66 68, 66 52 C66 58, 62 67, 50 67 C38 67, 34 58, 34 52 Z" fill="#522f18" opacity="0.6" />
          {/* Smile */}
          <path d="M45 61 Q50 64 55 61" stroke="#9a3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-yanis" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#065f46" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-chloe':
      // Chloé: Queue de cheval haute, dynamique
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-chloe)" />
          {/* High Ponytail Tail */}
          <path d="M60 22 C75 22, 82 35, 78 50 C76 40, 70 30, 60 26 Z" fill="#29180c" />
          {/* Top Tie */}
          <circle cx="60" cy="22" r="3" fill="#f43f5e" />
          {/* Clothes */}
          <path d="M22 100 C22 78, 34 74, 50 74 C66 74, 78 78, 78 100 Z" fill="#0284c7" />
          {/* Neck */}
          <path d="M43 60 H57 V75 H43 Z" fill="#fcd34d" opacity="0.3" />
          <path d="M43 60 H57 V75 H43 Z" fill="#fed7aa" />
          {/* Head */}
          <ellipse cx="50" cy="49" rx="17.5" ry="19.5" fill="#ffedd5" />
          {/* Hair Front */}
          <path d="M33 36 C33 24, 46 22, 58 22 C64 22, 68 28, 67 36 C62 31, 54 31, 48 31 C40 31, 35 34, 33 36 Z" fill="#29180c" />
          {/* Wireless Earbuds */}
          <ellipse cx="32" cy="51" rx="2" ry="3.5" fill="#ffffff" />
          <ellipse cx="68" cy="51" rx="2" ry="3.5" fill="#ffffff" />
          {/* Eyes */}
          <ellipse cx="42" cy="47" rx="2.5" ry="2.8" fill="#18181b" />
          <circle cx="43" cy="46" r="0.8" fill="#ffffff" />
          <ellipse cx="58" cy="47" rx="2.5" ry="2.8" fill="#18181b" />
          <circle cx="59" cy="46" r="0.8" fill="#ffffff" />
          {/* Nose */}
          <path d="M50 48 V53 H52" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
          {/* Bright Smile */}
          <path d="M44 60 Q50 65 56 60" stroke="#e11d48" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-chloe" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ec4899" />
              <stop offset="1" stopColor="#9d174d" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-david':
      // David: Homme mûr poivre et sel, blazer Pro
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-david)" />
          {/* Blazer */}
          <path d="M20 100 C20 74, 32 70, 50 70 C68 70, 80 74, 80 100 Z" fill="#1e293b" />
          <path d="M42 70 L50 84 L58 70 Z" fill="#0284c7" />
          {/* Neck */}
          <path d="M42 58 H58 V72 H42 Z" fill="#e8af87" />
          {/* Head & Ears */}
          <ellipse cx="31" cy="50" rx="3.5" ry="5.5" fill="#d29668" />
          <ellipse cx="69" cy="50" rx="3.5" ry="5.5" fill="#d29668" />
          <ellipse cx="50" cy="49" rx="19" ry="21" fill="#f0be97" />
          {/* Salt & Pepper Hair */}
          <path d="M31 38 C31 22, 44 18, 52 18 C64 18, 69 24, 69 36 C65 30, 58 28, 50 28 C42 28, 36 32, 31 38 Z" fill="#475569" />
          <path d="M34 32 C38 24, 46 22, 54 22 C60 22, 65 25, 67 31" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
          {/* Salt & Pepper Beard */}
          <path d="M34 50 C34 68, 42 71, 50 71 C58 71, 66 68, 66 50 C66 58, 62 67, 50 67 C38 67, 34 58, 34 50 Z" fill="#475569" opacity="0.9" />
          <path d="M43 60 Q50 62 57 60" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          {/* Eyebrows */}
          <path d="M37 42 Q42 40 46 41" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M54 41 Q58 40 63 42" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="42" cy="47" rx="2.5" ry="2.6" fill="#18181b" />
          <circle cx="43" cy="46" r="0.8" fill="#ffffff" />
          <ellipse cx="58" cy="47" rx="2.5" ry="2.6" fill="#18181b" />
          <circle cx="59" cy="46" r="0.8" fill="#ffffff" />
          {/* Mouth */}
          <path d="M46 64 Q50 66 54 64" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-david" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#334155" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-emma':
      // Emma: Artiste créative mèches lumineuses
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-emma)" />
          {/* Purple Hair Behind */}
          <path d="M26 40 C24 60, 28 80, 34 90 H66 C72 80, 76 60, 74 40 Z" fill="#8b5cf6" />
          {/* Clothes */}
          <path d="M22 100 C22 76, 34 72, 50 72 C66 72, 78 76, 78 100 Z" fill="#18181b" />
          <circle cx="50" cy="74" r="3" fill="#a855f7" />
          {/* Neck */}
          <path d="M43 60 H57 V74 H43 Z" fill="#fed7aa" />
          {/* Head */}
          <ellipse cx="50" cy="50" rx="17.5" ry="19.5" fill="#fff1f2" />
          {/* Hair Bangs Pastel */}
          <path d="M31 36 C31 23, 44 20, 50 20 C56 20, 69 23, 69 36 C64 32, 56 32, 50 32 C44 32, 36 32, 31 36 Z" fill="#a855f7" />
          <path d="M34 36 L36 48 L40 34" fill="#c084fc" />
          {/* Star sticker under eye */}
          <path d="M63 53 L63.6 54.5 L65.2 54.5 L64 55.4 L64.4 57 L63 56 L61.6 57 L62 55.4 L60.8 54.5 L62.4 54.5 Z" fill="#e879f9" />
          {/* Eyes */}
          <ellipse cx="42" cy="47" rx="2.5" ry="2.8" fill="#701a75" />
          <circle cx="43" cy="46" r="0.8" fill="#ffffff" />
          <ellipse cx="58" cy="47" rx="2.5" ry="2.8" fill="#701a75" />
          <circle cx="59" cy="46" r="0.8" fill="#ffffff" />
          {/* Nose */}
          <path d="M50 48 V53 H52" stroke="#f43f5e" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />
          {/* Purple Pink Lips */}
          <path d="M45 61 Q50 65 55 61" stroke="#d946ef" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-emma" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#4c1d95" />
            </linearGradient>
          </defs>
        </svg>
      );

    default:
      // Fallback Hugo
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-fallback)" />
          <path d="M22 100 C22 76, 34 72, 50 72 C66 72, 78 76, 78 100 Z" fill="#181824" />
          <ellipse cx="50" cy="49" rx="19" ry="22" fill="#eeb386" />
          <path d="M31 43 C31 27, 43 21, 52 21 C62 21, 69 26, 69 36 Z" fill="#3b2314" />
          <ellipse cx="42" cy="47" rx="2.5" ry="2.8" fill="#1f1f1f" />
          <ellipse cx="58" cy="47" rx="2.5" ry="2.8" fill="#1f1f1f" />
          <path d="M46 63 Q50 65 54 63" stroke="#b05844" strokeWidth="2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-fallback" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333ea" />
              <stop offset="1" stopColor="#4c1d95" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
};
