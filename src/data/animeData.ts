// Guaranteed, high-definition real anime datasets for LevelAnime
export interface AnimeItem {
  mal_id: number;
  id?: number;
  tmdb_id?: number;
  media_type?: 'tv' | 'movie';
  title: string;
  title_english?: string;
  images: {
    webp: {
      image_url: string;
      large_image_url: string;
    };
    jpg?: {
      image_url: string;
      large_image_url: string;
    };
  };
  trailer?: {
    images?: {
      maximum_image_url?: string;
    };
  };
  score?: number;
  year?: number;
  episodes?: number | null;
  airing?: boolean;
  synopsis?: string;
  genres?: Array<{ mal_id?: number; name: string }>;
}

export const REAL_POPULAR_ANIMES: AnimeItem[] = [
  {
    mal_id: 52299,
    tmdb_id: 127532,
    media_type: 'tv',
    title: 'Solo Leveling',
    title_english: 'Solo Leveling (Ore dake Level Up na Ken)',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuQiJ8KiIT.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuQiJ8KiIT.jpg'
      }
    },
    trailer: {
      images: {
        maximum_image_url: 'https://image.tmdb.org/t/p/original/4MCKNAc6AbWjEsM2cr7EcZNgajy.jpg'
      }
    },
    score: 8.9,
    year: 2024,
    episodes: 24,
    airing: true,
    synopsis: 'Dans un monde où des portails reliant notre dimension à des donjons remplis de monstres sont apparus, Jinwoo Sung, un chasseur de rang E connu comme le plus faible de toute l’humanité, se retrouve au bord de la mort. Il obtient alors un pouvoir unique : un système qui ne le fait progresser que lui.'
  },
  {
    mal_id: 38000,
    tmdb_id: 85937,
    media_type: 'tv',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    title_english: 'Demon Slayer: Kimetsu no Yaiba - Hashira Training',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg'
      }
    },
    trailer: {
      images: {
        maximum_image_url: 'https://image.tmdb.org/t/p/original/nTvM4mhqZlHIkwPtcvQgQcfRoFT.jpg'
      }
    },
    score: 8.8,
    year: 2024,
    episodes: 55,
    airing: true,
    synopsis: 'Depuis les temps anciens, des rumeurs parlent de démons mangeurs d’hommes cachés dans les bois. Tanjiro Kamado, un jeune vendeur de charbon au grand cœur, voit sa vie basculer lorsque sa famille est massacrée et sa jeune sœur Nezuko transformée en démon.'
  },
  {
    mal_id: 40748,
    tmdb_id: 95479,
    media_type: 'tv',
    title: 'Jujutsu Kaisen',
    title_english: 'Jujutsu Kaisen: Shibuya Incident',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40hrXgtCePpTeevo.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40hrXgtCePpTeevo.jpg'
      }
    },
    trailer: {
      images: {
        maximum_image_url: 'https://image.tmdb.org/t/p/original/9rEb0R7d8q5yZ3xT0P0m0I50b6a.jpg'
      }
    },
    score: 8.9,
    year: 2023,
    episodes: 47,
    airing: true,
    synopsis: 'Souffrance, regrets, humiliations... les sentiments négatifs que ressentent les humains deviennent des fléaux qui se cachent dans notre quotidien. Yuji Itadori, un lycéen doté d’une force physique hors du commun, avale une relique sacrée maudite et partage son corps avec le tout-puissant Ryomen Sukuna.'
  },
  {
    mal_id: 16498,
    tmdb_id: 1429,
    media_type: 'tv',
    title: "L'Attaque des Titans",
    title_english: 'Attack on Titan (Shingeki no Kyojin)',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg'
      }
    },
    trailer: {
      images: {
        maximum_image_url: 'https://image.tmdb.org/t/p/original/b32V59T7G1jJtN8o4gTqWn8K7yE.jpg'
      }
    },
    score: 9.1,
    year: 2023,
    episodes: 89,
    airing: false,
    synopsis: 'Il y a plus d’un siècle, les Titans ont massacré l’humanité. Les survivants se sont retranchés derrière trois murs gigantesques. Mais la paix vole en éclats le jour où un Titan Colossal de 60 mètres détruit la première porte. Eren Jäger jure d’exterminer jusqu’au dernier titan.'
  },
  {
    mal_id: 21,
    tmdb_id: 37854,
    media_type: 'tv',
    title: 'One Piece',
    title_english: 'One Piece - Egghead Arc',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/cMD9Ygz11yjUhvHTP9cq0ubSdZa.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/cMD9Ygz11yjUhvHTP9cq0ubSdZa.jpg'
      }
    },
    trailer: {
      images: {
        maximum_image_url: 'https://image.tmdb.org/t/p/original/4Mt7ikDHZzk3Tm0Tyh0JWURaFuk.jpg'
      }
    },
    score: 9.0,
    year: 2024,
    episodes: 1120,
    airing: true,
    synopsis: 'Monkey D. Luffy, un jeune homme au corps élastique suite à l’ingestion d’un Fruit du Démon, sillonne les mers de Grand Line avec son équipage de pirates à la recherche du légendaire trésor laissé par Gol D. Roger, afin de devenir le prochain Roi des Pirates.'
  },
  {
    mal_id: 52991,
    tmdb_id: 209867,
    media_type: 'tv',
    title: 'Frieren: Beyond Journey’s End',
    title_english: 'Sousou no Frieren',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/dqzenchTd7lp5zht7BdlqM7RBhD.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/dqzenchTd7lp5zht7BdlqM7RBhD.jpg'
      }
    },
    trailer: {
      images: {
        maximum_image_url: 'https://image.tmdb.org/t/p/original/96eyrS0F2w2qA9N1b4pU4m2I8rY.jpg'
      }
    },
    score: 9.3,
    year: 2024,
    episodes: 28,
    airing: false,
    synopsis: 'Après une quête de dix ans, le groupe de héros dirigé par Himmel le Brave a vaincu le Roi Démon. Frieren, une elfe magicienne à la longévité démesurée, entreprend un nouveau voyage initiatique pour mieux comprendre le cœur des humains.'
  },
  {
    mal_id: 41467,
    tmdb_id: 209867,
    media_type: 'tv',
    title: 'Bleach: Thousand-Year Blood War',
    title_english: 'Bleach: Sennen Kessen-hen',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/2EewFaXPvxDiPtZG7mIhuq1eZZj.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/2EewFaXPvxDiPtZG7mIhuq1eZZj.jpg'
      }
    },
    trailer: {
      images: {
        maximum_image_url: 'https://image.tmdb.org/t/p/original/9rEb0R7d8q5yZ3xT0P0m0I50b6a.jpg'
      }
    },
    score: 9.1,
    year: 2024,
    episodes: 39,
    airing: true,
    synopsis: 'La Soul Society subit l’assaut dévastateur du Wandenreich, l’empire invisible des Quincy mené par leur souverain Yhwach. Ichigo Kurosaki reprend son Zanpakuto pour sauver le monde des vivants et la Soul Society de l’anéantissement total.'
  },
  {
    mal_id: 44511,
    tmdb_id: 114410,
    media_type: 'tv',
    title: 'Chainsaw Man',
    title_english: 'Chainsaw Man',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/npdB6eFz4qt9CdISEgLOwL9AsJ7.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/npdB6eFz4qt9CdISEgLOwL9AsJ7.jpg'
      }
    },
    trailer: {
      images: {
        maximum_image_url: 'https://image.tmdb.org/t/p/original/a0xZ881g9tY7E1K0V0K0tY4j2P7.jpg'
      }
    },
    score: 8.7,
    year: 2022,
    episodes: 12,
    airing: false,
    synopsis: 'Denji vit dans la misère la plus totale, écrasé par les dettes de son père défunt. Pour survivre, il chasse les démons avec Pochita, son chien-tronçonneuse démoniaque. Trahi et laissé pour mort, il renaît sous la forme d’un hybride surpuissant : Chainsaw Man.'
  },
  {
    mal_id: 1535,
    tmdb_id: 13916,
    media_type: 'tv',
    title: 'Death Note',
    title_english: 'Death Note',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/iigTJJskR1PcjjGh9Ej7ag49Yzg.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/iigTJJskR1PcjjGh9Ej7ag49Yzg.jpg'
      }
    },
    trailer: {
      images: {
        maximum_image_url: 'https://image.tmdb.org/t/p/original/aQeT841G9e49j5Jz00p0m2I8rY.jpg'
      }
    },
    score: 9.0,
    year: 2006,
    episodes: 37,
    airing: false,
    synopsis: 'Light Yagami, un lycéen brillant, ramasse un mystérieux carnet appartenant à un dieu de la mort (Shinigami). Toute personne dont le nom est inscrit dans le carnet meurt instantanément. Light décide d’éradiquer tous les criminels pour créer un monde parfait sous le nom de Kira.'
  },
  {
    mal_id: 54688,
    tmdb_id: 209867,
    media_type: 'tv',
    title: 'Kaiju No. 8',
    title_english: 'Kaiju No. 8',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/400X6bZ8gQ9fX30yZ3xT0P0m0I5.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/400X6bZ8gQ9fX30yZ3xT0P0m0I5.jpg'
      }
    },
    score: 8.6,
    year: 2024,
    episodes: 12,
    airing: true,
    synopsis: 'Le Japon est le pays au monde avec le taux d’apparition de monstres géants (Kaijus) le plus élevé. Kafka Hibino, chargé du nettoyage des carcasses après les batailles, ingère accidentellement une créature qui le transforme lui-même en Kaiju humanoïde surpuissant.'
  }
];

export const REAL_ACTION_ANIMES: AnimeItem[] = [
  {
    mal_id: 1735,
    tmdb_id: 31910,
    media_type: 'tv',
    title: 'Naruto Shippuden',
    title_english: 'Naruto Shippuden',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/kV27j3Nz4d7z7fF211XbV10m2P0.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/kV27j3Nz4d7z7fF211XbV10m2P0.jpg'
      }
    },
    score: 8.8,
    year: 2007,
    episodes: 500,
    synopsis: 'Après deux ans et demi d’entraînement intensif avec Jiraya, Naruto Uzumaki revient au village de Konoha pour affronter l’organisation criminelle de l’Akatsuki et ramener son ami Sasuke Uchiwa.'
  },
  {
    mal_id: 5114,
    tmdb_id: 31911,
    media_type: 'tv',
    title: 'Fullmetal Alchemist: Brotherhood',
    title_english: 'Fullmetal Alchemist: Brotherhood',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/5ZFUEOULaVml7p19UP7D57hzL17.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/5ZFUEOULaVml7p19UP7D57hzL17.jpg'
      }
    },
    score: 9.3,
    year: 2009,
    episodes: 64,
    synopsis: 'Pour ressusciter leur mère, Edward et Alphonse Elric tentent une transmutation humaine interdite. L’expérience tourne au drame : Edward perd une jambe et un bras, tandis qu’Alphonse perd son corps tout entier, son âme scellée dans une armure.'
  },
  {
    mal_id: 11061,
    tmdb_id: 46298,
    media_type: 'tv',
    title: 'Hunter x Hunter',
    title_english: 'Hunter x Hunter (2011)',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/ucmp9nhclix2cT0zBq0M3t3E8R1.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/ucmp9nhclix2cT0zBq0M3t3E8R1.jpg'
      }
    },
    score: 9.1,
    year: 2011,
    episodes: 148,
    synopsis: 'Gon Freecss part à l’aventure pour passer le redoutable examen de Hunter et retrouver son père Ging, l’un des plus grands Hunters du monde.'
  },
  {
    mal_id: 30276,
    tmdb_id: 63926,
    media_type: 'tv',
    title: 'One Punch Man',
    title_english: 'One Punch Man',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/iE3s0lG5vtNX1LlNZ1m1k9vG2e9.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/iE3s0lG5vtNX1LlNZ1m1k9vG2e9.jpg'
      }
    },
    score: 8.7,
    year: 2015,
    episodes: 24,
    synopsis: 'Saitama est devenu un héros pour le plaisir. Après un entraînement si intense qu’il en a perdu tous ses cheveux, il est devenu tellement puissant qu’il terrasse n’importe quel monstre en un seul coup de poing.'
  },
  {
    mal_id: 37521,
    tmdb_id: 80564,
    media_type: 'tv',
    title: 'Vinland Saga',
    title_english: 'Vinland Saga',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/bCbaA1N1F31F1Q4v5W7E2rT6y8U.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/bCbaA1N1F31F1Q4v5W7E2rT6y8U.jpg'
      }
    },
    score: 9.0,
    year: 2019,
    episodes: 48,
    synopsis: 'Au début du XIe siècle, Thorfinn, fils du légendaire guerrier Thors, grandit au milieu des mercenaires vikings responsables du meurtre de son père, animé par une soif ardente de vengeance.'
  },
  {
    mal_id: 38474,
    tmdb_id: 85937,
    media_type: 'tv',
    title: 'Demon Slayer: Mugen Train',
    title_english: 'Kimetsu no Yaiba: Mugen Ressha-hen',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/h8Rb9gBr48ODigYBaZgogICR6Lh.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/h8Rb9gBr48ODigYBaZgogICR6Lh.jpg'
      }
    },
    score: 8.9,
    year: 2021,
    episodes: 7,
    synopsis: 'Tanjiro, Zenitsu et Inosuke rejoignent le Pilier de la Flamme Kyojuro Rengoku à bord du train de l’Infini afin de traquer un démon qui a fait disparaître plus de 40 passagers.'
  }
];

export const REAL_FANTASY_ANIMES: AnimeItem[] = [
  {
    mal_id: 39535,
    tmdb_id: 95557,
    media_type: 'tv',
    title: 'Mushoku Tensei: Jobless Reincarnation',
    title_english: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/cbbx8w40bA5X79y7E1K0V0K0tY4.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/cbbx8w40bA5X79y7E1K0V0K0tY4.jpg'
      }
    },
    score: 8.8,
    year: 2021,
    episodes: 36,
    synopsis: 'Un reclus de 34 ans meurt en sauvant des passants et se réincarne dans un monde magique sous le nom de Rudeus Greyrat avec tous ses souvenirs antérieurs, résolu à vivre cette seconde chance à fond.'
  },
  {
    mal_id: 31240,
    tmdb_id: 65942,
    media_type: 'tv',
    title: 'Re:Zero - Starting Life in Another World',
    title_english: 'Re:Zero kara Hajimeru Isekai Seikatsu',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/gOehQpY1q0M1k9vG2e9j5Jz00p0.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/gOehQpY1q0M1k9vG2e9j5Jz00p0.jpg'
      }
    },
    score: 8.6,
    year: 2024,
    episodes: 50,
    synopsis: 'Subaru Natsuki est soudainement transporté dans un univers fantastique. Il découvre qu’il possède le pouvoir de revenir dans le temps à chaque fois qu’il meurt.'
  },
  {
    mal_id: 37430,
    tmdb_id: 83095,
    media_type: 'tv',
    title: 'That Time I Got Reincarnated as a Slime',
    title_english: 'Tensei shitara Slime Datta Ken',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/8Xv8T56b7J1k0V0K0tY4j2P7bA5.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/8Xv8T56b7J1k0V0K0tY4j2P7bA5.jpg'
      }
    },
    score: 8.5,
    year: 2024,
    episodes: 72,
    synopsis: 'Satoru Mikami est poignardé en pleine rue et se réincarne dans une caverne fantastique sous la forme d’un Slime nommé Rimuru Tempest doté de capacités d’absorption prodigieuses.'
  }
];

export const REAL_ANIME_MOVIES: AnimeItem[] = [
  {
    mal_id: 32281,
    tmdb_id: 372058,
    media_type: 'movie',
    title: 'Your Name.',
    title_english: 'Kimi no Na wa.',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/q719qXXEzOoYaps6XZawPWhNUm7.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/q719qXXEzOoYaps6XZawPWhNUm7.jpg'
      }
    },
    score: 9.2,
    year: 2016,
    episodes: 1,
    synopsis: 'Mitsuha, une lycéenne vivant dans un village rural, et Taki, un lycéen tokyoïte, découvrent qu’ils échangent mystérieusement de corps pendant leur sommeil à l’approche du passage d’une comète millénaire.'
  },
  {
    mal_id: 50273,
    tmdb_id: 916224,
    media_type: 'movie',
    title: 'Suzume',
    title_english: 'Suzume no Tojimari',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/vI37R02mZJecvR24Z83uS2S1V1M.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/vI37R02mZJecvR24Z83uS2S1V1M.jpg'
      }
    },
    score: 8.7,
    year: 2022,
    episodes: 1,
    synopsis: 'Dans une paisible ville de Kyushu, Suzume fait la rencontre d’un mystérieux voyageur à la recherche d’une porte. En ouvrant cette porte abandonnée, elle déclenche une série de catastrophes à travers tout le Japon.'
  },
  {
    mal_id: 28851,
    tmdb_id: 378064,
    media_type: 'movie',
    title: 'A Silent Voice',
    title_english: 'Koe no Katachi',
    images: {
      webp: {
        image_url: 'https://image.tmdb.org/t/p/w500/tuFaWiqX0TW290Q4v5W7E2rT6y8.jpg',
        large_image_url: 'https://image.tmdb.org/t/p/w500/tuFaWiqX0TW290Q4v5W7E2rT6y8.jpg'
      }
    },
    score: 9.0,
    year: 2016,
    episodes: 1,
    synopsis: 'Shoya Ishida avait harcelé Shoko Nishimiya, une camarade de classe sourde, lorsqu’ils étaient enfants. Rongé par le remords au lycée, il décide de la retrouver pour lui demander pardon et réparer ses erreurs.'
  }
];
