import React from 'react';

interface HumanAvatarProps {
  id: string;
  className?: string;
}

export const HumanAvatarSvg: React.FC<HumanAvatarProps> = ({ id, className = 'w-full h-full' }) => {
  switch (id) {
    case 'avatar-angel':
      // Angel: Homme Arabe / Méditerranéen, barbe taillée, cheveux sombres texturés, chaîne discrète
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-angel)" />
          {/* Shoulders & Clothing */}
          <path d="M20 100 C20 75, 34 70, 50 70 C66 70, 80 75, 80 100 Z" fill="#0f172a" />
          <path d="M44 70 L50 82 L56 70 Z" fill="#d4976a" />
          <circle cx="50" cy="80" r="1.8" fill="#fbbf24" />
          {/* Neck */}
          <path d="M42 58 H58 V72 H42 Z" fill="#d4976a" />
          {/* Ears */}
          <ellipse cx="31" cy="49" rx="3.5" ry="6" fill="#be7f52" />
          <ellipse cx="69" cy="49" rx="3.5" ry="6" fill="#be7f52" />
          {/* Head */}
          <ellipse cx="50" cy="48" rx="19" ry="22" fill="#df9f72" />
          {/* Hair Dark Wavy Textured */}
          <path d="M30 40 C30 22, 42 16, 52 16 C63 16, 70 22, 70 34 C68 28, 62 25, 52 25 C42 25, 35 30, 30 40 Z" fill="#171717" />
          <path d="M33 36 C34 26, 44 20, 54 20 C62 20, 68 25, 68 35 C66 31, 60 27, 50 27 C40 27, 34 32, 33 36 Z" fill="#262626" />
          {/* Eyebrows */}
          <path d="M37 40 Q42 37 46 39" stroke="#171717" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M54 39 Q58 37 63 40" stroke="#171717" strokeWidth="2.4" strokeLinecap="round" />
          {/* Almond Shaped Eyes */}
          <ellipse cx="42" cy="46" rx="2.8" ry="2.6" fill="#171717" />
          <circle cx="43" cy="45" r="0.8" fill="#ffffff" />
          <ellipse cx="58" cy="46" rx="2.8" ry="2.6" fill="#171717" />
          <circle cx="59" cy="45" r="0.8" fill="#ffffff" />
          {/* Nose */}
          <path d="M50 44 V52 L47 54 H53" stroke="#b07044" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Sculpted Beard & Mustache */}
          <path d="M33 48 C33 67, 41 71, 50 71 C59 71, 67 67, 67 48 C67 58, 61 67, 50 67 C39 67, 33 58, 33 48 Z" fill="#171717" opacity="0.9" />
          <path d="M43 57 Q50 59 57 57" stroke="#171717" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          {/* Smile */}
          <path d="M46 62 Q50 64 54 62" stroke="#8c4434" strokeWidth="2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-angel" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284c7" />
              <stop offset="1" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-marco':
      // Marco: Homme Noir avec dégradé soigné, chaîne dorée, hoodie vert sombre
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-marco)" />
          {/* Shoulders & Hoodie */}
          <path d="M18 100 C18 73, 32 68, 50 68 C68 68, 82 73, 82 100 Z" fill="#064e3b" />
          <path d="M42 68 L50 82 L58 68 Z" fill="#5c3822" />
          {/* Gold Chain */}
          <path d="M40 73 Q50 86 60 73" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Neck */}
          <path d="M42 56 H58 V70 H42 Z" fill="#5c3822" />
          {/* Ears with gold stud */}
          <ellipse cx="30" cy="48" rx="3.5" ry="5.5" fill="#4a2c1a" />
          <ellipse cx="70" cy="48" rx="3.5" ry="5.5" fill="#4a2c1a" />
          <circle cx="29.5" cy="50" r="1.2" fill="#fbbf24" />
          {/* Head Shape */}
          <ellipse cx="50" cy="47" rx="19.5" ry="21" fill="#6d4227" />
          {/* Fade Haircut (Clean Afro Fade) */}
          <path d="M31 38 C31 20, 42 16, 50 16 C58 16, 69 20, 69 38 C65 31, 58 28, 50 28 C42 28, 35 31, 31 38 Z" fill="#171717" />
          <rect x="33" y="24" width="34" height="6" rx="3" fill="#171717" />
          {/* Eyebrows */}
          <path d="M36 38 Q42 36 46 38" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M54 38 Q58 36 64 38" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
          {/* Expressive Warm Eyes */}
          <ellipse cx="41.5" cy="44" rx="2.8" ry="2.8" fill="#171717" />
          <circle cx="42.5" cy="43" r="0.9" fill="#ffffff" />
          <ellipse cx="58.5" cy="44" rx="2.8" ry="2.8" fill="#171717" />
          <circle cx="59.5" cy="43" r="0.9" fill="#ffffff" />
          {/* Nose */}
          <ellipse cx="50" cy="51" rx="4.5" ry="2.5" fill="#4a2c1a" />
          {/* Neat Goatee */}
          <path d="M44 57 Q50 59 56 57" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <ellipse cx="50" cy="64" rx="3" ry="2.5" fill="#171717" />
          {/* Bright Smile */}
          <path d="M44 60 Q50 65 56 60" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-marco" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" />
              <stop offset="1" stopColor="#064e3b" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-cherubin':
      // Chérubin: Homme Noir avec coiffure afro stylée et lunettes dorées solaires
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-cherubin)" />
          {/* Big Rounded Afro Silhouette */}
          <circle cx="34" cy="36" r="15" fill="#171717" />
          <circle cx="66" cy="36" r="15" fill="#171717" />
          <circle cx="50" cy="27" r="18" fill="#171717" />
          <circle cx="28" cy="48" r="11" fill="#171717" />
          <circle cx="72" cy="48" r="11" fill="#171717" />
          {/* Jacket */}
          <path d="M20 100 C20 74, 34 70, 50 70 C66 70, 80 74, 80 100 Z" fill="#78350f" />
          <path d="M44 70 L50 82 L56 70 Z" fill="#52311c" />
          {/* Neck */}
          <path d="M43 58 H57 V72 H43 Z" fill="#52311c" />
          {/* Face */}
          <ellipse cx="50" cy="50" rx="18.5" ry="20" fill="#663c23" />
          {/* Gold Frame Aviator / Sunglasses */}
          <rect x="33" y="42" width="14" height="11" rx="3" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
          <rect x="53" y="42" width="14" height="11" rx="3" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
          <path d="M47 46 H53" stroke="#f59e0b" strokeWidth="2" />
          <path d="M33 46 L29 45" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M67 46 L71 45" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Gloss Reflection on Glasses */}
          <path d="M35 44 L44 51" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M55 44 L64 51" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          {/* Nose */}
          <ellipse cx="50" cy="56" rx="4" ry="2.2" fill="#422513" />
          {/* Warm Confident Smile */}
          <path d="M44 62 Q50 67 56 62" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-cherubin" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d97706" />
              <stop offset="1" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-sun':
      // Sun: Garçon Asiatique, chevelure noire moderne, regard perçant et veste streetwear
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-sun)" />
          {/* Streetwear Jacket */}
          <path d="M20 100 C20 75, 34 70, 50 70 C66 70, 80 75, 80 100 Z" fill="#0369a1" />
          <path d="M44 70 L50 83 L56 70 Z" fill="#fcd34d" />
          {/* Neck */}
          <path d="M44 58 H56 V71 H44 Z" fill="#f5ce9f" />
          {/* Ears */}
          <ellipse cx="32" cy="48" rx="3" ry="5.5" fill="#eab37e" />
          <ellipse cx="68" cy="48" rx="3" ry="5.5" fill="#eab37e" />
          {/* Head */}
          <ellipse cx="50" cy="47" rx="18" ry="21" fill="#fedcb3" />
          {/* K-Style Layered Hair */}
          <path d="M30 42 C30 20, 42 16, 50 16 C60 16, 70 20, 70 42 C66 32, 58 35, 52 30 C46 36, 38 32, 30 42 Z" fill="#09090b" />
          <path d="M36 32 L40 40 L45 31 L50 41 L55 31 L60 40 L64 32" fill="#09090b" />
          {/* Eyebrows */}
          <path d="M37 39 Q42 37 46 38" stroke="#09090b" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M54 38 Q58 37 63 39" stroke="#09090b" strokeWidth="2.2" strokeLinecap="round" />
          {/* Sharp Almond Eyes */}
          <path d="M37 44 Q42 41 46 44" stroke="#09090b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <ellipse cx="42" cy="45" rx="2.2" ry="2.2" fill="#09090b" />
          <circle cx="42.7" cy="44.3" r="0.7" fill="#ffffff" />
          <path d="M54 44 Q58 41 63 44" stroke="#09090b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <ellipse cx="58" cy="45" rx="2.2" ry="2.2" fill="#09090b" />
          <circle cx="58.7" cy="44.3" r="0.7" fill="#ffffff" />
          {/* Nose */}
          <path d="M50 46 V52 H52" stroke="#d99b66" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Subtle Smile */}
          <path d="M46 59 Q50 62 54 59" stroke="#be5c48" strokeWidth="2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-sun" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0ea5e9" />
              <stop offset="1" stopColor="#0369a1" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-illane':
      // Illane: Femme Noire magnifique, chignon haut tressé, créoles dorées, lèvres soignées
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-illane)" />
          {/* High Braided Bun */}
          <circle cx="50" cy="18" r="14" fill="#171717" />
          <circle cx="50" cy="18" r="13" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
          {/* Dress */}
          <path d="M22 100 C22 76, 34 72, 50 72 C66 72, 78 76, 78 100 Z" fill="#881337" />
          {/* Gold Necklace */}
          <path d="M42 74 Q50 82 58 74" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Long Elegant Neck */}
          <path d="M44 58 H56 V73 H44 Z" fill="#5a341e" />
          {/* Large Gold Hoop Earrings */}
          <circle cx="30" cy="52" r="4.5" stroke="#fbbf24" strokeWidth="1.8" fill="none" />
          <circle cx="70" cy="52" r="4.5" stroke="#fbbf24" strokeWidth="1.8" fill="none" />
          {/* Face */}
          <ellipse cx="50" cy="48" rx="17.5" ry="20" fill="#6d3e24" />
          {/* Sleek Hair Front */}
          <path d="M33 34 C36 24, 64 24, 67 34 C60 30, 50 30, 33 34 Z" fill="#171717" />
          {/* Arched Eyebrows */}
          <path d="M38 41 Q43 37 47 40" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
          <path d="M53 40 Q57 37 62 41" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
          {/* Doe Eyes & Eyelashes */}
          <ellipse cx="43" cy="46" rx="2.8" ry="3.2" fill="#171717" />
          <circle cx="44" cy="45" r="0.9" fill="#ffffff" />
          <path d="M39 43 L37 41" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="57" cy="46" rx="2.8" ry="3.2" fill="#171717" />
          <circle cx="58" cy="45" r="0.9" fill="#ffffff" />
          <path d="M61 43 L63 41" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
          {/* Cute Nose */}
          <ellipse cx="50" cy="52" rx="3.5" ry="2" fill="#4c2915" />
          {/* Radiant Full Glossy Lips */}
          <path d="M44 59 Q50 62 56 59 Q50 67 44 59 Z" fill="#ec4899" />
          <defs>
            <linearGradient id="bg-illane" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ec4899" />
              <stop offset="1" stopColor="#881337" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-lea':
      // Léa: Femme Européenne aux cheveux châtains/blonds ondulés et col chic
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-lea)" />
          {/* Hair Back */}
          <path d="M26 42 C24 64, 28 85, 36 96 H64 C72 85, 76 64, 74 42 Z" fill="#d97706" />
          {/* Chic Knit Collar */}
          <path d="M22 100 C22 76, 34 72, 50 72 C66 72, 78 76, 78 100 Z" fill="#4c1d95" />
          {/* Neck */}
          <path d="M43 60 H57 V73 H43 Z" fill="#fbcfe8" />
          {/* Face */}
          <ellipse cx="50" cy="49" rx="17" ry="20" fill="#fde2e4" />
          {/* Earrings */}
          <circle cx="32" cy="52" r="2.5" fill="#c084fc" />
          <circle cx="68" cy="52" r="2.5" fill="#c084fc" />
          {/* Hair Front Waves */}
          <path d="M32 38 C34 22, 66 22, 68 38 C60 32, 50 35, 32 38 Z" fill="#b45309" />
          {/* Eyebrows */}
          <path d="M38 42 Q43 39 47 41" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M53 41 Q57 39 62 42" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
          {/* Blue / Greenish Eyes */}
          <ellipse cx="43" cy="47" rx="2.5" ry="2.8" fill="#0284c7" />
          <circle cx="43.8" cy="46" r="0.8" fill="#ffffff" />
          <ellipse cx="57" cy="47" rx="2.5" ry="2.8" fill="#0284c7" />
          <circle cx="57.8" cy="46" r="0.8" fill="#ffffff" />
          {/* Rosy Cheeks */}
          <circle cx="37" cy="53" r="3.5" fill="#f43f5e" opacity="0.25" />
          <circle cx="63" cy="53" r="3.5" fill="#f43f5e" opacity="0.25" />
          {/* Nose */}
          <path d="M50 47 V53 H52" stroke="#e0a96d" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Coral Smile */}
          <path d="M45 60 Q50 64 55 60" stroke="#e11d48" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-lea" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#4c1d95" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-lex':
      // Lex: Homme Noir avec dreadlocks courtes stylées et hoodie urbain
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-lex)" />
          {/* Dreadlocks Tips on Top */}
          <circle cx="36" cy="22" r="5" fill="#171717" />
          <circle cx="44" cy="18" r="5.5" fill="#171717" />
          <circle cx="53" cy="17" r="5.5" fill="#171717" />
          <circle cx="62" cy="20" r="5" fill="#171717" />
          <circle cx="30" cy="30" r="5" fill="#171717" />
          <circle cx="70" cy="28" r="5" fill="#171717" />
          {/* Urban Hoodie */}
          <path d="M18 100 C18 73, 32 68, 50 68 C68 68, 82 73, 82 100 Z" fill="#3b0764" />
          <path d="M44 68 L50 82 L56 68 Z" fill="#4e2b17" />
          {/* Neck */}
          <path d="M43 56 H57 V70 H43 Z" fill="#4e2b17" />
          {/* Head */}
          <ellipse cx="50" cy="48" rx="19" ry="21" fill="#62371d" />
          {/* Front Dreadlocks Locks falling */}
          <path d="M32 30 Q34 42 33 46" stroke="#171717" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M68 30 Q66 42 67 46" stroke="#171717" strokeWidth="4.5" strokeLinecap="round" />
          {/* Eyebrows */}
          <path d="M37 38 Q42 36 46 38" stroke="#171717" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M54 38 Q58 36 63 38" stroke="#171717" strokeWidth="2.4" strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="42" cy="44" rx="2.7" ry="2.7" fill="#171717" />
          <circle cx="43" cy="43" r="0.8" fill="#ffffff" />
          <ellipse cx="58" cy="44" rx="2.7" ry="2.7" fill="#171717" />
          <circle cx="59" cy="43" r="0.8" fill="#ffffff" />
          {/* Nose */}
          <ellipse cx="50" cy="51" rx="4.2" ry="2.4" fill="#3f2110" />
          {/* Beard Contour */}
          <path d="M35 52 C35 68, 42 71, 50 71 C58 71, 65 68, 65 52 C65 60, 60 67, 50 67 C40 67, 35 60, 35 52 Z" fill="#171717" opacity="0.8" />
          {/* Smile */}
          <path d="M45 60 Q50 64 55 60" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-lex" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333ea" />
              <stop offset="1" stopColor="#3b0764" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-aben':
      // Aben: Homme Noir au regard intense et élégant, veste bordeaux
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-aben)" />
          {/* Suit / Coat */}
          <path d="M20 100 C20 74, 34 70, 50 70 C66 70, 80 74, 80 100 Z" fill="#7f1d1d" />
          <path d="M44 70 L50 84 L56 70 Z" fill="#3d2012" />
          {/* Gold Pin */}
          <circle cx="34" cy="80" r="2" fill="#fbbf24" />
          {/* Neck */}
          <path d="M43 58 H57 V72 H43 Z" fill="#3d2012" />
          {/* Head */}
          <ellipse cx="50" cy="47" rx="18.5" ry="21" fill="#522b19" />
          {/* Shaved Texture Hair */}
          <path d="M31 36 C31 20, 42 16, 50 16 C58 16, 69 20, 69 36 C65 30, 58 27, 50 27 C42 27, 35 30, 31 36 Z" fill="#171717" />
          {/* Eyebrows */}
          <path d="M37 38 Q42 35 46 37" stroke="#171717" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M54 37 Q58 35 63 38" stroke="#171717" strokeWidth="2.4" strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="42" cy="44" rx="2.8" ry="2.8" fill="#171717" />
          <circle cx="43" cy="43" r="0.9" fill="#ffffff" />
          <ellipse cx="58" cy="44" rx="2.8" ry="2.8" fill="#171717" />
          <circle cx="59" cy="43" r="0.9" fill="#ffffff" />
          {/* Nose */}
          <ellipse cx="50" cy="51" rx="4.5" ry="2.5" fill="#2d160b" />
          {/* Crisp Beard */}
          <path d="M34 50 C34 68, 42 71, 50 71 C58 71, 66 68, 66 50 C66 59, 61 67, 50 67 C39 67, 34 59, 34 50 Z" fill="#171717" opacity="0.9" />
          {/* Mustache */}
          <path d="M43 56 Q50 58 57 56" stroke="#171717" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          {/* Smile */}
          <path d="M45 61 Q50 65 55 61" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-aben" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#dc2626" />
              <stop offset="1" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-mohamed':
      // Mohamed: Homme Arabe / Oriental aux cheveux ondulés soignés, veste saphir
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-mohamed)" />
          {/* Saphir Blazer */}
          <path d="M20 100 C20 74, 34 70, 50 70 C66 70, 80 74, 80 100 Z" fill="#1e293b" />
          <path d="M44 70 L50 84 L56 70 Z" fill="#ffffff" />
          {/* Neck */}
          <path d="M43 58 H57 V72 H43 Z" fill="#cf9568" />
          {/* Ears */}
          <ellipse cx="31" cy="48" rx="3.5" ry="5.5" fill="#ba8053" />
          <ellipse cx="69" cy="48" rx="3.5" ry="5.5" fill="#ba8053" />
          {/* Head */}
          <ellipse cx="50" cy="47" rx="18.5" ry="21" fill="#dfa579" />
          {/* Wavy Pompadour Hair */}
          <path d="M30 38 C30 20, 44 14, 52 14 C62 14, 70 20, 70 34 C68 28, 62 24, 52 24 C40 24, 34 30, 30 38 Z" fill="#1c1917" />
          {/* Eyebrows */}
          <path d="M37 38 Q42 35 46 37" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M54 37 Q58 35 63 38" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" />
          {/* Deep Brown Eyes */}
          <ellipse cx="42" cy="45" rx="2.7" ry="2.7" fill="#1c1917" />
          <circle cx="43" cy="44" r="0.8" fill="#ffffff" />
          <ellipse cx="58" cy="45" rx="2.7" ry="2.7" fill="#1c1917" />
          <circle cx="59" cy="44" r="0.8" fill="#ffffff" />
          {/* Nose */}
          <path d="M50 45 V52 L47 54 H53" stroke="#a76c40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Short Trimmed Stubble */}
          <path d="M34 50 C34 67, 42 70, 50 70 C58 70, 66 67, 66 50 C66 58, 61 66, 50 66 C39 66, 34 58, 34 50 Z" fill="#1c1917" opacity="0.8" />
          <path d="M44 57 Q50 59 56 57" stroke="#1c1917" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* Smile */}
          <path d="M45 61 Q50 64 55 61" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-mohamed" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#1e293b" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-christ':
      // Christ: Homme Noir / Métis, sourire chaleureux, casquette sportive / coupe texturée
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-christ)" />
          {/* Royal Blue Jacket */}
          <path d="M18 100 C18 73, 32 68, 50 68 C68 68, 82 73, 82 100 Z" fill="#1e1b4b" />
          <path d="M44 68 L50 82 L56 68 Z" fill="#8d5b36" />
          {/* Neck */}
          <path d="M43 56 H57 V70 H43 Z" fill="#8d5b36" />
          {/* Head */}
          <ellipse cx="50" cy="48" rx="19" ry="21" fill="#9f673f" />
          {/* Curly Textured Hair */}
          <circle cx="34" cy="30" r="7" fill="#171717" />
          <circle cx="44" cy="24" r="8" fill="#171717" />
          <circle cx="56" cy="24" r="8" fill="#171717" />
          <circle cx="66" cy="30" r="7" fill="#171717" />
          {/* Eyebrows */}
          <path d="M37 38 Q42 36 46 38" stroke="#171717" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M54 38 Q58 36 63 38" stroke="#171717" strokeWidth="2.2" strokeLinecap="round" />
          {/* Smiling Eyes */}
          <ellipse cx="42" cy="44" rx="2.8" ry="2.5" fill="#171717" />
          <circle cx="43" cy="43" r="0.9" fill="#ffffff" />
          <ellipse cx="58" cy="44" rx="2.8" ry="2.5" fill="#171717" />
          <circle cx="59" cy="43" r="0.9" fill="#ffffff" />
          {/* Nose */}
          <ellipse cx="50" cy="51" rx="4" ry="2.2" fill="#754320" />
          {/* Big Warm Tooth Smile */}
          <path d="M43 59 Q50 66 57 59 Z" fill="#ffffff" />
          <path d="M43 59 Q50 66 57 59" stroke="#171717" strokeWidth="1.5" fill="none" />
          <defs>
            <linearGradient id="bg-christ" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4f46e5" />
              <stop offset="1" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-sophie':
      // Sophie: Femme Métisse / Latine aux boucles solaires et rouge à lèvres corail
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-sophie)" />
          {/* Voluminous Curly Hair Back */}
          <circle cx="32" cy="38" r="14" fill="#3b2314" />
          <circle cx="68" cy="38" r="14" fill="#3b2314" />
          <circle cx="50" cy="28" r="16" fill="#3b2314" />
          <circle cx="28" cy="54" r="11" fill="#3b2314" />
          <circle cx="72" cy="54" r="11" fill="#3b2314" />
          {/* Top */}
          <path d="M22 100 C22 76, 34 72, 50 72 C66 72, 78 76, 78 100 Z" fill="#db2777" />
          {/* Neck */}
          <path d="M44 58 H56 V73 H44 Z" fill="#b0754b" />
          {/* Golden Earrings */}
          <circle cx="32" cy="52" r="3.5" stroke="#f59e0b" strokeWidth="1.6" fill="none" />
          <circle cx="68" cy="52" r="3.5" stroke="#f59e0b" strokeWidth="1.6" fill="none" />
          {/* Face */}
          <ellipse cx="50" cy="48" rx="17.5" ry="20" fill="#c98c5f" />
          {/* Hair Front Curls */}
          <path d="M33 34 C36 24, 64 24, 67 34 C60 30, 50 32, 33 34 Z" fill="#29180c" />
          {/* Eyebrows */}
          <path d="M38 41 Q43 38 47 40" stroke="#29180c" strokeWidth="1.9" strokeLinecap="round" />
          <path d="M53 40 Q57 38 62 41" stroke="#29180c" strokeWidth="1.9" strokeLinecap="round" />
          {/* Almond Eyes */}
          <ellipse cx="43" cy="46" rx="2.7" ry="2.9" fill="#1f1f1f" />
          <circle cx="44" cy="45" r="0.8" fill="#ffffff" />
          <ellipse cx="57" cy="46" rx="2.7" ry="2.9" fill="#1f1f1f" />
          <circle cx="58" cy="45" r="0.8" fill="#ffffff" />
          {/* Blush */}
          <circle cx="37" cy="52" r="3" fill="#f43f5e" opacity="0.3" />
          <circle cx="63" cy="52" r="3" fill="#f43f5e" opacity="0.3" />
          {/* Nose */}
          <path d="M50 46 V52 H52" stroke="#9a5a30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Full Lips */}
          <path d="M44 59 Q50 63 56 59 Q50 67 44 59 Z" fill="#f97316" />
          <defs>
            <linearGradient id="bg-sophie" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316" />
              <stop offset="1" stopColor="#9d174d" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'avatar-alexa':
    default:
      // Alexa: Femme Asiatique, coupe au carré moderne, regard stylé néon
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" fill="url(#bg-alexa)" />
          {/* Bob Cut Hair Back */}
          <path d="M26 40 C26 65, 30 75, 35 80 H65 C70 75, 74 65, 74 40 Z" fill="#0f172a" />
          {/* Cyber / Modern High Collar */}
          <path d="M22 100 C22 76, 34 72, 50 72 C66 72, 78 76, 78 100 Z" fill="#0f766e" />
          {/* Neck */}
          <path d="M44 58 H56 V72 H44 Z" fill="#fae8d0" />
          {/* Face */}
          <ellipse cx="50" cy="48" rx="17" ry="20" fill="#feebd7" />
          {/* Geometric Bob Cut Front */}
          <path d="M30 42 C30 22, 42 16, 50 16 C60 16, 70 22, 70 42 C64 34, 56 34, 50 34 C44 34, 36 34, 30 42 Z" fill="#09090b" />
          {/* Straight Fringe */}
          <rect x="34" y="32" width="32" height="6" rx="2" fill="#09090b" />
          {/* Eyebrows */}
          <path d="M38 40 Q43 38 47 39" stroke="#09090b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M53 39 Q57 38 62 40" stroke="#09090b" strokeWidth="1.8" strokeLinecap="round" />
          {/* Cat Eyes */}
          <path d="M38 44 Q43 41 47 44" stroke="#09090b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <ellipse cx="43" cy="45" rx="2.2" ry="2.2" fill="#09090b" />
          <circle cx="43.7" cy="44.2" r="0.7" fill="#ffffff" />
          <path d="M53 44 Q57 41 62 44" stroke="#09090b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <ellipse cx="57" cy="45" rx="2.2" ry="2.2" fill="#09090b" />
          <circle cx="57.7" cy="44.2" r="0.7" fill="#ffffff" />
          {/* Soft Nose */}
          <path d="M50 46 V52 H52" stroke="#d5a880" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Red Lip Tint */}
          <path d="M45 59 Q50 63 55 59" stroke="#e11d48" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <defs>
            <linearGradient id="bg-alexa" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06b6d4" />
              <stop offset="1" stopColor="#0f766e" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
};
