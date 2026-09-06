import React, { useState, useEffect } from 'react';
import { isLowDataMode } from '../constants';

interface PosterItem {
  id: string | number;
  title?: string;
  path: string;
}

// Catalogue exhaustif et ultra dense de films cultes, blockbusters, séries et animes (10 colonnes distinctes)
const CURATED_COLUMNS: PosterItem[][] = [
  // Colonne 1 : Grands Blockbusters de Science-Fiction
  [
    { id: 'c1-1', title: 'Dune: Deuxième Partie', path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' },
    { id: 'c1-2', title: 'Interstellar', path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
    { id: 'c1-3', title: 'Inception', path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg' },
    { id: 'c1-4', title: 'Blade Runner 2049', path: '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg' },
    { id: 'c1-5', title: "Avatar: La Voie de l'eau", path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' },
    { id: 'c1-6', title: 'The Matrix', path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { id: 'c1-7', title: 'Dune', path: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg' },
    { id: 'c1-8', title: 'Mad Max: Fury Road', path: '/hA2ple9q4qnwxp3hKVNhroipsir.jpg' },
    { id: 'c1-9', title: 'Tenet', path: '/k68nPLbIST6NP96JmTxmZijEvCA.jpg' },
    { id: 'c1-10', title: 'Edge of Tomorrow', path: '/8QdnipZ1p3v30dGz4X4Y7PZk8eM.jpg' },
  ],
  // Colonne 2 : Marvel, DC & Super-Héros
  [
    { id: 'c2-1', title: 'Oppenheimer', path: '/ptpr0kGAckfQkJeJIt8st5dglvd.jpg' },
    { id: 'c2-2', title: 'The Batman', path: '/74xTEgt7R36Fpooo50r9T25onhq.jpg' },
    { id: 'c2-3', title: 'Spider-Man: Across the Spider-Verse', path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg' },
    { id: 'c2-4', title: 'Deadpool & Wolverine', path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg' },
    { id: 'c2-5', title: 'Avengers: Endgame', path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg' },
    { id: 'c2-6', title: 'The Dark Knight', path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: 'c2-7', title: 'Avengers: Infinity War', path: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg' },
    { id: 'c2-8', title: 'Spider-Man: No Way Home', path: '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg' },
    { id: 'c2-9', title: 'Guardians of the Galaxy Vol. 3', path: '/r2J02Z2OpNTctfOSN2Ydgii51I3.jpg' },
    { id: 'c2-10', title: 'Logan', path: '/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg' },
  ],
  // Colonne 3 : Chefs-d'œuvre du 7ème Art & Drames
  [
    { id: 'c3-1', title: 'Fight Club', path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
    { id: 'c3-2', title: 'Gladiator', path: '/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg' },
    { id: 'c3-3', title: 'Joker', path: '/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
    { id: 'c3-4', title: 'Parasite', path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg' },
    { id: 'c3-5', title: 'Pulp Fiction', path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
    { id: 'c3-6', title: 'Top Gun: Maverick', path: '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg' },
    { id: 'c3-7', title: 'The Shawshank Redemption', path: '/9cqNflsb6uzmzDcTQxPnSdsqqej.jpg' },
    { id: 'c3-8', title: 'The Godfather', path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
    { id: 'c3-9', title: 'The Wolf of Wall Street', path: '/kWYfW2Re0rUDE6IHhydaNoENK2C.jpg' },
    { id: 'c3-10', title: 'Whiplash', path: '/7fn624j5lj3xTme2SgiLCeuedmO.jpg' },
  ],
  // Colonne 4 : Animation & Grands Studios
  [
    { id: 'c4-1', title: 'Vice-Versa 2', path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg' },
    { id: 'c4-2', title: 'Arcane', path: '/fqldX2OBPRQ9f6btq63etDuw0Pt.jpg' },
    { id: 'c4-3', title: 'Le Voyage de Chihiro', path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg' },
    { id: 'c4-4', title: 'Demon Slayer: Mugen Train', path: '/h8Rb9gBr48ODgsgYvD1oKz6e48U.jpg' },
    { id: 'c4-5', title: 'Spider-Man: New Generation', path: '/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg' },
    { id: 'c4-6', title: 'Suzume', path: '/vIeu8WysYBFF8PqL22QdefQ4B3d.jpg' },
    { id: 'c4-7', title: 'Your Name.', path: '/q719jXXEzOoYaps6amxFsSa9jKi.jpg' },
    { id: 'c4-8', title: 'Coco', path: '/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg' },
    { id: 'c4-9', title: 'Wall-E', path: '/9c13w6R7mI9N0vB0hVq6Q34w2oW.jpg' },
    { id: 'c4-10', title: 'Shrek', path: '/iB64vpL3dIObOtMZgX3RqWjOHBM.jpg' },
  ],
  // Colonne 5 : Séries Mondiales Phénomènes
  [
    { id: 'c5-1', title: 'Stranger Things', path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
    { id: 'c5-2', title: 'Breaking Bad', path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
    { id: 'c5-3', title: 'The Last of Us', path: '/uKvVjK1q2BP2msRuEw78Uwtz1Bt.jpg' },
    { id: 'c5-4', title: 'Game of Thrones', path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg' },
    { id: 'c5-5', title: 'Peaky Blinders', path: '/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg' },
    { id: 'c5-6', title: 'House of the Dragon', path: '/1X4h40fcB4WWUmIBK0auT4zRBAV.jpg' },
    { id: 'c5-7', title: 'Better Call Saul', path: '/fC2HDm5t0kHsf727GhOPNdGHT95.jpg' },
    { id: 'c5-8', title: 'The Boys', path: '/2zmGblY5nSzF916q2Qv9G61h4j5.jpg' },
    { id: 'c5-9', title: 'Attack on Titan', path: '/hTP1dtwGFamjfu8WqjnuQdP1n4i.jpg' },
    { id: 'c5-10', title: 'Chernobyl', path: '/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg' },
  ],
  // Colonne 6 : Action Nerveuse & Thrillers
  [
    { id: 'c6-1', title: 'John Wick: Chapitre 4', path: '/vZloFAK7NKnMGKEHvYcnEtENIO2.jpg' },
    { id: 'c6-2', title: 'Everything Everywhere All at Once', path: '/w3LxiVYPqRLexP02LOV29bURiNz.jpg' },
    { id: 'c6-3', title: 'Shutter Island', path: '/kve20tXwUZpu4GUX8l6X7Z4aZ69.jpg' },
    { id: 'c6-4', title: 'Se7en', path: '/6yoghtyTpznpBik8EngEmJskVUO.jpg' },
    { id: 'c6-5', title: 'Django Unchained', path: '/7oWY8vdWW7thTzfq3ZwYRqHpZmm.jpg' },
    { id: 'c6-6', title: 'Inglourious Basterds', path: '/7sfbEnaARXDD5Km0CZ7D7kyBTZ1.jpg' },
    { id: 'c6-7', title: 'The Departed', path: '/nT97ifVT2J1yMQmeq20Qblg61T.jpg' },
    { id: 'c6-8', title: 'Mission: Impossible Dead Reckoning', path: '/NNxYkU70HPurnNCSiCjYAmacwm.jpg' },
    { id: 'c6-9', title: 'Ford v Ferrari', path: '/6ApDtO7xa78wxv7R1p9RAx6TNII.jpg' },
    { id: 'c6-10', title: '1917', path: '/iZf0KyrE25z1sage4SYFLCCrMi9.jpg' },
  ],
  // Colonne 7 : Fantastique & Univers Mythiques
  [
    { id: 'c7-1', title: 'Le Seigneur des Anneaux: La Communauté', path: '/6oom5QYQ2yQTMJIbnvbkBL9cDK6.jpg' },
    { id: 'c7-2', title: 'Le Retour du Roi', path: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg' },
    { id: 'c7-3', title: "Harry Potter à l'école des sorciers", path: '/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg' },
    { id: 'c7-4', title: 'Pirates des Caraïbes', path: '/z8onk7LV9M4Z5S3t4g0mG61C39U.jpg' },
    { id: 'c7-5', title: 'Jurassic Park', path: '/oU7OqIszKiZtBaP4WjH4y2u00vJ.jpg' },
    { id: 'c7-6', title: 'The Prestige', path: '/bdN3gEY4w9P84w6A6j0k1K7z19Q.jpg' },
    { id: 'c7-7', title: 'GoodFellas', path: '/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg' },
    { id: 'c7-8', title: 'Iron Man', path: '/78lPtwv72eTNqFW9COBYI0dWDJa.jpg' },
    { id: 'c7-9', title: 'Captain America: Winter Soldier', path: '/tVFRHFw3x2nhnVxlOpW922hk0Bg.jpg' },
    { id: 'c7-10', title: 'Alien', path: '/vfrQk5IPloGg1v9Rzmu2whMkW4v.jpg' },
  ],
  // Colonne 8 : Mystère, Horreur & Suspense
  [
    { id: 'c8-1', title: 'The Shining', path: '/bRAFR5HwU16Z2kI27eJ9f42lB3.jpg' },
    { id: 'c8-2', title: 'A Quiet Place', path: '/nAU74GmpUk7t5iklEp3bufwDq4n.jpg' },
    { id: 'c8-3', title: 'Hereditary', path: '/lHV8HHlhwv9ekfl8AsPU484B8Bh.jpg' },
    { id: 'c8-4', title: 'Squid Game', path: '/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg' },
    { id: 'c8-5', title: 'No Country for Old Men', path: '/bj1v6YKF8MH1eqQk0D1kM8f5gN4.jpg' },
    { id: 'c8-6', title: 'Fight Club', path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
    { id: 'c8-7', title: 'Dune: Deuxième Partie', path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' },
    { id: 'c8-8', title: 'Oppenheimer', path: '/ptpr0kGAckfQkJeJIt8st5dglvd.jpg' },
    { id: 'c8-9', title: 'The Batman', path: '/74xTEgt7R36Fpooo50r9T25onhq.jpg' },
    { id: 'c8-10', title: 'Interstellar', path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  ],
  // Colonne 9 : Séries & Nouvelles Sorties (Grands Écrans)
  [
    { id: 'c9-1', title: 'Deadpool & Wolverine', path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg' },
    { id: 'c9-2', title: 'Arcane', path: '/fqldX2OBPRQ9f6btq63etDuw0Pt.jpg' },
    { id: 'c9-3', title: 'Stranger Things', path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
    { id: 'c9-4', title: 'Breaking Bad', path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
    { id: 'c9-5', title: 'Spider-Man: Across the Spider-Verse', path: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg' },
    { id: 'c9-6', title: 'Gladiator', path: '/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg' },
    { id: 'c9-7', title: 'Top Gun: Maverick', path: '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg' },
    { id: 'c9-8', title: 'Joker', path: '/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
    { id: 'c9-9', title: 'Pulp Fiction', path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
    { id: 'c9-10', title: 'Inception', path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg' },
  ],
  // Colonne 10 : Sélection Ultime (Plein Écran & Retina)
  [
    { id: 'c10-1', title: 'The Dark Knight', path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: 'c10-2', title: 'Avengers: Endgame', path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg' },
    { id: 'c10-3', title: 'Vice-Versa 2', path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg' },
    { id: 'c10-4', title: 'The Last of Us', path: '/uKvVjK1q2BP2msRuEw78Uwtz1Bt.jpg' },
    { id: 'c10-5', title: 'John Wick: Chapitre 4', path: '/vZloFAK7NKnMGKEHvYcnEtENIO2.jpg' },
    { id: 'c10-6', title: 'Parasite', path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg' },
    { id: 'c10-7', title: 'Blade Runner 2049', path: '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg' },
    { id: 'c10-8', title: "Avatar: La Voie de l'eau", path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' },
    { id: 'c10-9', title: 'Demon Slayer: Mugen Train', path: '/h8Rb9gBr48ODgsgYvD1oKz6e48U.jpg' },
    { id: 'c10-10', title: 'Dune: Deuxième Partie', path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' },
  ]
];

interface CinematicPosterWallProps {
  opacity?: number;
  lowDataMode?: boolean;
}

export const CinematicPosterWall: React.FC<CinematicPosterWallProps> = ({
  opacity = 0.48,
  lowDataMode = isLowDataMode()
}) => {
  const [dynamicColumns, setDynamicColumns] = useState<PosterItem[][]>(CURATED_COLUMNS);

  // Récupération simultanée de plusieurs pages de films & séries en direct pour injecter plus de 50+ affiches live supplémentaires
  useEffect(() => {
    let isMounted = true;
    const loadLiveCatalog = async () => {
      try {
        const apiKey = (import.meta as any).env?.VITE_TMDB_API_KEY || '027cc951d888c64e5f15dcb853c7347a';
        
        // Appels parallèles pour remplir abondamment les colonnes
        const [resMovies1, resMovies2, resTv] = await Promise.allSettled([
          fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=1`),
          fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=2`),
          fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&page=1`)
        ]);

        const allItems: any[] = [];
        if (resMovies1.status === 'fulfilled' && resMovies1.value.ok) {
          const d = await resMovies1.value.json();
          if (d?.results) allItems.push(...d.results);
        }
        if (resMovies2.status === 'fulfilled' && resMovies2.value.ok) {
          const d = await resMovies2.value.json();
          if (d?.results) allItems.push(...d.results);
        }
        if (resTv.status === 'fulfilled' && resTv.value.ok) {
          const d = await resTv.value.json();
          if (d?.results) allItems.push(...d.results);
        }

        if (allItems.length > 20 && isMounted) {
          const livePosters: PosterItem[] = allItems
            .filter((m: any) => m && m.poster_path)
            .map((m: any) => ({
              id: `live-${m.id}`,
              title: m.title || m.name,
              path: m.poster_path
            }));

          // Répartir équitablement dans les 10 colonnes
          const colCount = 10;
          const cols: PosterItem[][] = Array.from({ length: colCount }, () => []);
          
          livePosters.forEach((p, idx) => {
            cols[idx % colCount].push(p);
          });

          // Fusionner avec le catalogue curé garanti pour une densité maximale
          const combined = cols.map((col, idx) => {
            const baseCol = CURATED_COLUMNS[idx] || CURATED_COLUMNS[0];
            return [...col, ...baseCol];
          });

          setDynamicColumns(combined);
        }
      } catch (_) {
        // En cas de coupure réseau, la base dense de 100 films reste active
      }
    };

    if (!lowDataMode) {
      loadLiveCatalog();
    }
    return () => { isMounted = false; };
  }, [lowDataMode]);

  // Si l'utilisateur est en mode faible consommation de données
  if (lowDataMode) {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-0 bg-[#060608]">
        <div className="absolute inset-0 bg-purple-950/10" />
      </div>
    );
  }

  // Vitesses fluides asynchrones pour chacune des 10 colonnes
  const columnConfigs = [
    { anim: 'animate-poster-col-up', duration: '52s' },
    { anim: 'animate-poster-col-down', duration: '64s' },
    { anim: 'animate-poster-col-up-slow', duration: '48s' },
    { anim: 'animate-poster-col-down-slow', duration: '68s' },
    { anim: 'animate-poster-col-up', duration: '56s' },
    { anim: 'animate-poster-col-down', duration: '60s' },
    { anim: 'animate-poster-col-up-slow', duration: '50s' },
    { anim: 'animate-poster-col-down-slow', duration: '66s' },
    { anim: 'animate-poster-col-up', duration: '54s' },
    { anim: 'animate-poster-col-down', duration: '62s' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-[#060608]">
      {/* 
        Mur d'affiches ultra-dense :
        - 5 colonnes sur mobile (cartes compactes, des dizaines visibles d'un coup)
        - 7 colonnes sur tablettes
        - 8 colonnes sur écrans moyens
        - 10 colonnes sur écrans larges / desktop
        - Inclinaison cinéma -3deg et léger zoom pour couvrir tous les bords
      */}
      <div 
        className="absolute -inset-x-8 sm:-inset-x-12 -inset-y-32 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-2.5 md:gap-3.5 -rotate-3 scale-105 transform-gpu transition-opacity duration-700"
        style={{ opacity }}
      >
        {dynamicColumns.map((column, colIdx) => {
          const config = columnConfigs[colIdx % columnConfigs.length];
          // On double la liste de chaque colonne pour un défilement infini sans coupure
          const doubleColumn = [...column, ...column];

          return (
            <div 
              key={`col-${colIdx}`} 
              className={`flex flex-col gap-2 sm:gap-2.5 md:gap-3.5 will-change-transform ${config.anim}`}
              style={{ animationDuration: config.duration }}
            >
              {doubleColumn.map((poster, itemIdx) => (
                <div 
                  key={`poster-${colIdx}-${itemIdx}-${poster.id}`}
                  className="w-full aspect-[2/3] rounded-md sm:rounded-xl overflow-hidden bg-[#0c0c16] border border-white/[0.08] shadow-lg relative group shrink-0"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w342${poster.path}`}
                    alt={poster.title || 'Film'}
                    decoding="async"
                    loading="lazy"
                    className="w-full h-full object-cover grayscale-[20%] contrast-110 brightness-90 transition-all duration-300 transform scale-100"
                  />
                  {/* Reflet de carte cinéma avec nuance violette discrète */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/[0.04]" />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Superposition cinématographique & Dégradés de contraste */}
      {/* 1. Vignette radiale sombre au centre pour garder le logo, titre et barre de chargement ultra nets */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,6,8,0.70)_0%,rgba(6,6,8,0.90)_52%,#060608_100%)]" />

      {/* 2. Fondu haut & bas progressif */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-[#060608]" />

      {/* 3. Fondu latéral gauche et droite pour les bords d'écran */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#060608] via-transparent to-[#060608]" />

      {/* 4. Halo d'ambiance violet signature LevelMovie */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />
    </div>
  );
};
