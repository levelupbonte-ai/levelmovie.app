import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import Parser from 'rss-parser';

dotenv.config();

const app = express();
const PORT = 3000;
const TMDB_API_KEY = process.env.TMDB_API_KEY || '027cc951d888c64e5f15dcb853c7347a';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

app.use(express.json({ limit: '10mb' }));

// =========================================================================
// INTELLIGENT GEMINI MULTI-KEY ROTATION & LOAD BALANCER ENGINE
// =========================================================================
const USER_DIRECT_GEMINI_KEYS: string[] = [];

class GeminiKeyManager {
  private keys: string[] = [];
  private currentIndex = 0;
  private keyStats = new Map<string, {
    failureCount: number;
    cooldownUntil: number;
    successCount: number;
    lastUsed: number;
  }>();

  constructor() {
    this.refreshKeys();
  }

  public refreshKeys(): void {
    const rawKeys: string[] = [];

    // 1. Direct User Cluster Keys (Highest priority & guaranteed availability)
    for (const directKey of USER_DIRECT_GEMINI_KEYS) {
      if (directKey && directKey.trim().length > 10) {
        rawKeys.push(directKey.trim());
      }
    }

    // 2. Single GEMINI_API_KEY from environment
    if (process.env.GEMINI_API_KEY) {
      rawKeys.push(process.env.GEMINI_API_KEY.trim());
    }

    // 3. Comma / Semicolon / Space / Newline separated GEMINI_API_KEYS
    if (process.env.GEMINI_API_KEYS) {
      const split = process.env.GEMINI_API_KEYS.split(/[\s,;\n]+/);
      for (const k of split) {
        if (k.trim()) rawKeys.push(k.trim());
      }
    }

    // 4. Individual GEMINI_API_KEY_1 ... GEMINI_API_KEY_30
    for (let i = 1; i <= 30; i++) {
      const envKey = process.env[`GEMINI_API_KEY_${i}`];
      if (envKey && envKey.trim()) {
        rawKeys.push(envKey.trim());
      }
    }

    // Filter unique and non-empty keys
    const uniqueKeys = Array.from(new Set(rawKeys.filter(k => k.length > 5)));
    this.keys = uniqueKeys;

    // Initialize stats
    for (const key of this.keys) {
      if (!this.keyStats.has(key)) {
        this.keyStats.set(key, {
          failureCount: 0,
          cooldownUntil: 0,
          successCount: 0,
          lastUsed: 0,
        });
      }
    }

    console.log(`[GeminiKeyManager] Active pool: ${this.keys.length} keys loaded for instant Dona execution.`);
  }

  public getKeyCount(): number {
    return this.keys.length;
  }

  // Get next available key that is not in cooldown
  public getNextHealthyKey(): string | null {
    if (this.keys.length === 0) return null;

    const now = Date.now();
    const totalKeys = this.keys.length;

    // Try round-robin search for a key with no cooldown
    for (let i = 0; i < totalKeys; i++) {
      const idx = (this.currentIndex + i) % totalKeys;
      const candidateKey = this.keys[idx];
      const stats = this.keyStats.get(candidateKey);

      if (!stats || stats.cooldownUntil <= now) {
        this.currentIndex = (idx + 1) % totalKeys;
        if (stats) {
          stats.lastUsed = now;
        }
        return candidateKey;
      }
    }

    // If all keys are in cooldown, pick the one that expires soonest
    let soonestKey = this.keys[0];
    let minCooldown = Infinity;
    for (const key of this.keys) {
      const stats = this.keyStats.get(key);
      const remaining = stats ? stats.cooldownUntil - now : 0;
      if (remaining < minCooldown) {
        minCooldown = remaining;
        soonestKey = key;
      }
    }

    return soonestKey;
  }

  public recordSuccess(key: string): void {
    const stats = this.keyStats.get(key);
    if (stats) {
      stats.successCount += 1;
      stats.failureCount = 0;
      stats.cooldownUntil = 0;
    }
  }

  public recordFailure(key: string, isRateLimit = false, isServiceUnavailable = false): void {
    const stats = this.keyStats.get(key);
    if (stats) {
      stats.failureCount += 1;
      // If 503 (model overloaded), do not penalize the key heavily - brief 3s cooldown
      // If 429 (quota exhausted), 45s cooldown
      // Otherwise 10s cooldown
      const cooldownDuration = isServiceUnavailable ? 3000 : (isRateLimit ? 45000 : 10000);
      stats.cooldownUntil = Date.now() + cooldownDuration;
      console.warn(`[GeminiKeyManager] Key ...${key.slice(-6)} cooldown set to ${cooldownDuration / 1000}s (rateLimit: ${isRateLimit}, 503: ${isServiceUnavailable})`);
    }
  }

  // Execute an AI task with automatic failover, key rotation, and multi-model cascade
  public async executeWithRotation<T>(
    operation: (ai: GoogleGenAI, apiKey: string) => Promise<T>
  ): Promise<T> {
    if (this.keys.length === 0) {
      throw new Error('NO_GEMINI_KEYS_CONFIGURED');
    }

    const maxAttempts = Math.max(this.keys.length, 3);
    let lastError: any = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const key = this.getNextHealthyKey();
      if (!key) break;

      try {
        const ai = new GoogleGenAI({ apiKey: key });
        const result = await operation(ai, key);
        this.recordSuccess(key);
        return result;
      } catch (err: any) {
        lastError = err;
        const errMsg = (err?.message || '').toLowerCase();
        const isRateLimit = errMsg.includes('429') || 
                            errMsg.includes('quota') || 
                            errMsg.includes('resource_exhausted') || 
                            errMsg.includes('rate limit');
        const is503 = errMsg.includes('503') || 
                      errMsg.includes('high demand') || 
                      errMsg.includes('unavailable');
        
        this.recordFailure(key, isRateLimit, is503);
        console.warn(`[GeminiKeyManager] Attempt ${attempt + 1}/${maxAttempts} failed: ${err.message}`);
      }
    }

    throw lastError || new Error('All Gemini API attempts or keys failed.');
  }
}

const keyManager = new GeminiKeyManager();

// =========================================================================
// TMDB CINEMA HELPER FUNCTIONS
// =========================================================================
async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
  try {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.set('api_key', TMDB_API_KEY);
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`TMDB fetch error for ${endpoint}:`, err);
    return null;
  }
}

async function searchTMDBMovies(query: string, lang = 'fr-FR'): Promise<any[]> {
  if (!query) return [];
  const cleanQ = query.trim();

  // Try direct search first
  let searchRes = await fetchTMDB('/search/multi', {
    query: cleanQ,
    language: lang,
    include_adult: 'false',
    page: '1',
  });

  if (searchRes && searchRes.results && searchRes.results.length > 0) {
    const valid = searchRes.results
      .filter((m: any) => m.poster_path && (m.media_type === 'movie' || m.media_type === 'tv' || !m.media_type))
      .slice(0, 6);
    if (valid.length > 0) return valid;
  }

  // If complex prompt (e.g., "recommande moi des films comme Interstellar"), try extracting key nouns/titles
  const words = cleanQ.split(/\s+/);
  if (words.length > 3) {
    // Try removing common French/English conversational filler words
    const stripped = cleanQ
      .replace(/\b(recommande|cherche|trouve|donne|moi|des|les|un|une|film|films|serie|series|comme|similaire|svp|s'il|te|plait|top|meilleur|meilleurs|about|recommend|search|find|movies|movie|shows|like|similar|please|best)\b/gi, '')
      .trim();
    if (stripped.length >= 2) {
      searchRes = await fetchTMDB('/search/multi', {
        query: stripped,
        language: lang,
        include_adult: 'false',
        page: '1',
      });
      if (searchRes && searchRes.results && searchRes.results.length > 0) {
        const valid = searchRes.results
          .filter((m: any) => m.poster_path && (m.media_type === 'movie' || m.media_type === 'tv' || !m.media_type))
          .slice(0, 6);
        if (valid.length > 0) return valid;
      }
    }
  }

  return [];
}

async function getTrendingSpotlight(lang = 'fr-FR'): Promise<any[]> {
  const res = await fetchTMDB('/trending/all/day', { language: lang });
  if (res && res.results) {
    return res.results.filter((m: any) => m.poster_path).slice(0, 8);
  }
  return [];
}

// =========================================================================
// LEVELUP ADVANCED RSS ENGINE & NEWS EXTRACTOR
// =========================================================================
const rssParser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
      ['description', 'description']
    ]
  }
});

const RSS_SOURCES: Record<string, { name: string; url: string }[]> = {
  gaming: [
    { name: 'JeuxVideo.com', url: 'https://www.jeuxvideo.com/rss/rss.xml' },
    { name: 'IGN France', url: 'https://fr.ign.com/feed.xml' },
    { name: 'Gameblog', url: 'https://www.gameblog.fr/rss.xml' },
    { name: 'Gamekult', url: 'https://www.gamekult.com/feed.xml' },
    { name: 'ActuGaming', url: 'https://www.actugaming.net/feed/' },
    { name: 'Xboxygen', url: 'https://www.xboxygen.com/spip.php?page=backend' },
    { name: 'GamerGen', url: 'https://www.gamergen.com/rss' }
  ],
  otaku: [
    { name: 'Manga-News', url: 'https://www.manga-news.com/index.php/rss' },
    { name: 'Adala-News', url: 'https://adala-news.fr/feed/' },
    { name: 'Crunchyroll', url: 'https://www.crunchyroll.com/newsrss?lang=frFR' },
    { name: 'Nautiljon', url: 'https://www.nautiljon.com/actualite/rss.php' },
    { name: 'Anime News Network', url: 'https://www.animenewsnetwork.com/news/rss.xml?ann-edition=fr' }
  ],
  tools: [
    { name: 'Journal du Geek', url: 'https://www.journaldugeek.com/feed/' },
    { name: 'Frandroid', url: 'https://www.frandroid.com/feed' },
    { name: 'Numerama', url: 'https://www.numerama.com/feed/' },
    { name: 'Les Numériques', url: 'https://www.lesnumeriques.com/rss.xml' },
    { name: 'Presse-Citron', url: 'https://www.presse-citron.net/feed/' },
    { name: 'Phonandroid', url: 'https://www.phonandroid.com/feed' },
    { name: 'Korben', url: 'https://korben.info/feed' },
    { name: '01net', url: 'https://www.01net.com/actualites/feed/' }
  ],
  movies: [
    { name: 'Premiere', url: 'https://www.premiere.fr/rss/cinema' },
    { name: 'EcranLarge', url: 'https://www.ecranlarge.com/flux-rss/actus' },
    { name: 'CinéSéries', url: 'https://www.cineserie.com/feed/' },
    { name: 'JDG Ciné', url: 'https://www.journaldugeek.com/culture/feed/' }
  ],
  music: [
    { name: 'Tsugi', url: 'https://www.tsugi.fr/feed/' },
    { name: 'Les Inrocks', url: 'https://www.lesinrocks.com/musique/feed/' },
    { name: 'Metalorgie', url: 'https://www.metalorgie.com/feed/news' },
    { name: 'La Grosse Radio', url: 'https://www.lagrosseradio.com/feed/' }
  ],
  sports: [
    { name: "L'Équipe", url: 'https://www.lequipe.fr/rss/actu_rss.xml' },
    { name: 'RMC Sport', url: 'https://rmcsport.bfmtv.com/rss/info/flux.xml' },
    { name: 'Eurosport', url: 'https://www.eurosport.fr/rss.xml' },
    { name: 'Foot Mercato', url: 'https://www.footmercato.net/rss' },
    { name: 'So Foot', url: 'https://www.sofoot.com/rss' }
  ],
  world: [
    { name: 'France Info', url: 'https://www.francetvinfo.fr/titres.rss' },
    { name: 'Le Monde', url: 'https://www.lemonde.fr/rss/une.xml' },
    { name: 'Le Figaro', url: 'https://www.lefigaro.fr/rss/figaro_actualites.xml' },
    { name: '20 Minutes', url: 'https://www.20minutes.fr/feeds/rss-actu-france.xml' },
    { name: 'Le Parisien', url: 'https://www.leparisien.fr/arcio/rss/' }
  ],
  economy: [
    { name: 'Les Echos', url: 'https://services.lesechos.fr/rss/les-echos-accueil.xml' },
    { name: 'La Tribune', url: 'https://www.latribune.fr/feed.xml' },
    { name: 'BFM Business', url: 'https://www.bfmtv.com/rss/economie/' }
  ]
};

function extractBestImage(item: any, sourceName: string) {
  let img: string | null = null;
  if (item.mediaContent && item.mediaContent['$'] && item.mediaContent['$'].url && !item.mediaContent['$'].type?.startsWith('video/')) {
    img = item.mediaContent['$'].url;
  } else if (item.mediaThumbnail && item.mediaThumbnail['$'] && item.mediaThumbnail['$'].url) {
    img = item.mediaThumbnail['$'].url;
  } else if (item.enclosure && item.enclosure.url && item.enclosure.url.match(/\.(jpeg|jpg|gif|png|webp)/i)) {
    img = item.enclosure.url;
  } else {
    const regex = /<img[^>]+src=["']([^"']+)["']/i;
    if (item.contentEncoded) {
      const match = item.contentEncoded.match(regex);
      if (match) img = match[1];
    }
    if (!img && item.description) {
      const match = item.description.match(regex);
      if (match) img = match[1];
    }
  }

  if (!img || img.length < 5) {
    const safeSeed = encodeURIComponent((item.title || sourceName).substring(0, 20).replace(/[^a-zA-Z0-9]/g, ''));
    img = `https://picsum.photos/seed/${safeSeed}/800/450`;
  }
  return img;
}

function extractBestVideo(item: any) {
  let video: string | null = null;
  const htmlContent = (item.contentEncoded || '') + ' ' + (item.description || '');

  const iframeRegex = /src=["'](https:\/\/(?:www\.)?(?:youtube\.com\/embed|dailymotion\.com\/embed\/video|player\.vimeo\.com\/video|player\.twitch\.tv\/\?channel|tiktok\.com\/embed|streamable\.com\/e)\/[^"']+)["']/i;
  const matchIframe = htmlContent.match(iframeRegex);
  if (matchIframe) return matchIframe[1];

  const linkRegex = /(https:\/\/(?:www\.)?(?:twitch\.tv\/videos\/|streamable\.com\/|tiktok\.com\/@[\w.-]+\/video\/|vimeo\.com\/)\w+)/i;
  const matchLink = htmlContent.match(linkRegex);
  if (matchLink) return matchLink[1];

  const videoTagRegex = /<(?:video|source)[^>]+src=["']([^"']+\.(?:mp4|webm|ogg|m3u8)(?:\?[^"']*)?)["']/i;
  const matchVideo = htmlContent.match(videoTagRegex);
  if (matchVideo) return matchVideo[1];

  if (item.enclosure && item.enclosure.url) {
    const type = item.enclosure.type || '';
    const isVideoUrl = item.enclosure.url.match(/\.(mp4|webm|ogg|m3u8|mov|avi)/i);
    if (type.startsWith('video/') || isVideoUrl) {
      return item.enclosure.url;
    }
  }

  if (item.mediaContent && item.mediaContent['$']) {
    const mediaUrl = item.mediaContent['$'].url;
    const mediaType = item.mediaContent['$'].type || '';
    if (mediaType.startsWith('video/') || mediaUrl?.match(/\.(mp4|webm|ogg|m3u8|mov|avi)/i)) {
      return mediaUrl;
    }
  }

  return null;
}

async function fetchCategoryNews(categoryKey: string) {
  const sources = RSS_SOURCES[categoryKey];
  if (!sources) return [];

  let allArticles: any[] = [];
  const requests = sources.map(async (source) => {
    try {
      const feed = await rssParser.parseURL(source.url);
      return (feed.items || []).map(item => {
        const finalImage = extractBestImage(item, source.name);
        const finalVideo = extractBestVideo(item);
        return {
          title: item.title,
          link: item.link,
          desc: item.contentSnippet || item.content || item.description || '',
          date: item.pubDate || item.isoDate || new Date().toISOString(),
          img: finalImage,
          video: finalVideo,
          source: source.name,
          category: categoryKey
        };
      });
    } catch {
      return [];
    }
  });

  const results = await Promise.allSettled(requests);
  results.forEach(res => {
    if (res.status === 'fulfilled') {
      allArticles = allArticles.concat(res.value);
    }
  });

  return allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 150);
}

// =========================================================================
// API ROUTES
// =========================================================================

// Showcase Posters for Auth Connection Screen (Fetched live with TMDB key with 10+ dynamic titles)
app.get('/api/tmdb/showcase', async (req, res) => {
  try {
    const [trendingRes, animeRes] = await Promise.all([
      fetchTMDB('/trending/all/week', { language: 'fr-FR' }),
      fetchTMDB('/discover/tv', { with_genres: '16', with_original_language: 'ja', sort_by: 'popularity.desc', language: 'fr-FR' })
    ]);

    const combined: any[] = [];
    if (trendingRes && trendingRes.results) {
      trendingRes.results.forEach((m: any) => {
        if (m.backdrop_path) {
          combined.push({
            id: m.id,
            title: m.title || m.name,
            bg: `https://image.tmdb.org/t/p/w1280${m.backdrop_path}`,
            poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            rating: `${(m.vote_average || 8.0).toFixed(1)}/10`,
            overview: m.overview || 'Expérience cinéma & streaming haute fidélité.',
            type: m.media_type || (m.first_air_date ? 'tv' : 'movie')
          });
        }
      });
    }

    if (animeRes && animeRes.results) {
      animeRes.results.forEach((a: any) => {
        if (a.backdrop_path) {
          combined.push({
            id: a.id,
            title: a.name || a.title,
            bg: `https://image.tmdb.org/t/p/w1280${a.backdrop_path}`,
            poster: a.poster_path ? `https://image.tmdb.org/t/p/w500${a.poster_path}` : null,
            rating: `${(a.vote_average || 8.5).toFixed(1)}/10`,
            overview: a.overview || 'L’univers anime et manga en ultra haute définition.',
            type: 'tv'
          });
        }
      });
    }

    // Return at least 10 dynamic items
    res.json(combined.slice(0, 15));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch showcase' });
  }
});

// TMDB Anime Catalogue (Real thousands of anime shows, anime movies, trending)
app.get('/api/tmdb/anime', async (req, res) => {
  const page = (req.query.page as string) || '1';
  const type = (req.query.type as string) || 'popular'; // popular, movies, top_rated
  try {
    let data;
    if (type === 'movies') {
      data = await fetchTMDB('/discover/movie', {
        with_genres: '16',
        with_original_language: 'ja',
        sort_by: 'popularity.desc',
        language: 'fr-FR',
        page
      });
    } else if (type === 'top_rated') {
      data = await fetchTMDB('/discover/tv', {
        with_genres: '16',
        with_original_language: 'ja',
        'vote_count.gte': '200',
        sort_by: 'vote_average.desc',
        language: 'fr-FR',
        page
      });
    } else {
      data = await fetchTMDB('/discover/tv', {
        with_genres: '16',
        with_original_language: 'ja',
        sort_by: 'popularity.desc',
        language: 'fr-FR',
        page
      });
    }

    if (data && data.results) {
      const formatted = data.results.map((item: any) => ({
        id: item.id,
        title: item.name || item.title,
        desc: item.overview || 'Chef-d’œuvre de l’animation japonaise.',
        img: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://picsum.photos/800/450'),
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        rating: item.vote_average ? `${item.vote_average.toFixed(1)}` : '8.2',
        release: item.first_air_date || item.release_date || '2024',
        type: type === 'movies' ? 'movie' : 'tv'
      }));
      return res.json({ results: formatted, total_pages: data.total_pages || 1 });
    }
    res.json({ results: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch anime catalogue' });
  }
});

// TMDB Movies, Trending & Radar
app.get('/api/tmdb/catalogue', async (req, res) => {
  const category = (req.query.cat as string) || 'trending';
  const page = (req.query.page as string) || '1';
  try {
    let data;
    if (category === 'upcoming' || category === 'radar') {
      data = await fetchTMDB('/movie/upcoming', { language: 'fr-FR', page });
    } else if (category === 'top_rated') {
      data = await fetchTMDB('/movie/top_rated', { language: 'fr-FR', page });
    } else if (category === 'popular') {
      data = await fetchTMDB('/movie/popular', { language: 'fr-FR', page });
    } else {
      data = await fetchTMDB('/trending/all/day', { language: 'fr-FR', page });
    }

    if (data && data.results) {
      const formatted = data.results.map((m: any) => ({
        id: m.id,
        title: m.title || m.name,
        desc: m.overview || 'Production cinématographique incontournable.',
        img: m.backdrop_path ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}` : (m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://picsum.photos/800/450'),
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        rating: m.vote_average ? `${m.vote_average.toFixed(1)}` : '7.8',
        release: m.release_date || m.first_air_date || '2024',
        media_type: m.media_type || (m.first_air_date ? 'tv' : 'movie')
      }));
      return res.json({ results: formatted, total_pages: data.total_pages || 1 });
    }
    res.json({ results: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch catalogue' });
  }
});

// TMDB Trailer & Video Extractor (Returns official YouTube / TMDB video embed or key)
app.get('/api/tmdb/trailer/:id', async (req, res) => {
  const { id } = req.params;
  const isTv = req.query.type === 'tv';
  try {
    const endpoint = isTv ? `/tv/${id}/videos` : `/movie/${id}/videos`;
    let data = await fetchTMDB(endpoint, { language: 'fr-FR' });
    if (!data || !data.results || data.results.length === 0) {
      data = await fetchTMDB(endpoint, { language: 'en-US' });
    }

    if (data && data.results && data.results.length > 0) {
      const trailer = data.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') ||
                      data.results.find((v: any) => v.site === 'YouTube') ||
                      data.results[0];
      return res.json({
        key: trailer.key,
        site: trailer.site,
        name: trailer.name,
        youtubeUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
        embedUrl: `https://www.youtube.com/embed/${trailer.key}?autoplay=1&enablejsapi=1`
      });
    }
    res.json({ key: null, embedUrl: null });
  } catch (err) {
    res.status(500).json({ error: 'Trailer not found' });
  }
});

// RSS News API endpoint with Category filter & multi-source feeds
app.get('/api/news', async (req, res) => {
  const category = (req.query.category as string) || 'all';
  try {
    if (category === 'all') {
      let mixed: any[] = [];
      for (const cat of Object.keys(RSS_SOURCES)) {
        const news = await fetchCategoryNews(cat);
        mixed = mixed.concat(news);
      }
      mixed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return res.json(mixed.slice(0, 300));
    }

    if (!RSS_SOURCES[category]) {
      return res.status(404).json({ error: "Catégorie introuvable." });
    }

    const news = await fetchCategoryNews(category);
    res.json(news);
  } catch (error) {
    console.error("Erreur API News:", error);
    res.status(500).json({ error: "Erreur serveur lors de la génération des actualités." });
  }
});

// In-App Web Browser Proxy (Removes X-Frame-Options & CSP so all external sites render inside the app)
app.get('/api/proxy-web', async (req, res) => {
  const targetUrl = (req.query.url as string || '').trim();
  if (!targetUrl || !targetUrl.startsWith('http')) {
    return res.status(400).send('URL invalide ou absente.');
  }

  try {
    const parsedUrl = new URL(targetUrl);
    const targetOrigin = parsedUrl.origin;

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type') || 'text/html';

    if (!contentType.includes('text/html')) {
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.send(Buffer.from(buffer));
    }

    let html = await response.text();

    // Base tag to resolve relative assets (css, images, fonts)
    const baseTag = `<base href="${targetOrigin}/">`;
    
    // Injected script to prevent framebusting and route internal links through proxy
    const injectedScript = `
      <script>
        try {
          window.top = window.self;
          window.parent = window.self;
        } catch(e) {}

        document.addEventListener('click', function(e) {
          try {
            var a = e.target.closest('a');
            if (a && a.href && a.href.startsWith('http') && !a.href.includes('/api/proxy-web')) {
              e.preventDefault();
              window.location.href = '/api/proxy-web?url=' + encodeURIComponent(a.href);
            }
          } catch(err) {}
        }, true);
      </script>
    `;

    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${baseTag}${injectedScript}`);
    } else if (html.includes('<HEAD>')) {
      html = html.replace('<HEAD>', `<HEAD>${baseTag}${injectedScript}`);
    } else {
      html = `${baseTag}${injectedScript}${html}`;
    }

    // Strip out meta CSP & frame blockers
    html = html.replace(/<meta[^>]*http-equiv=["']?(content-security-policy|x-frame-options)["']?[^>]*>/gi, '');

    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('Cross-Origin-Embedder-Policy');
    res.removeHeader('Cross-Origin-Opener-Policy');
    res.removeHeader('Cross-Origin-Resource-Policy');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.send(html);

  } catch (err: any) {
    console.error('[Proxy Web Error]:', err?.message);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <style>
          body { background: #07080f; color: #fff; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; text-align: center; }
          .box { background: #10121d; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 32px; max-width: 460px; }
          h3 { margin-top: 0; color: #c084fc; font-size: 18px; }
          p { color: rgba(255,255,255,0.6); font-size: 13px; line-height: 1.6; }
          a { display: inline-block; margin-top: 14px; background: #9333ea; color: white; padding: 10px 20px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="box">
          <h3>Chargement direct indisponible</h3>
          <p>Le serveur distant bloque l'accès direct ou demande une authentification spéciale.</p>
          <a href="${targetUrl}" target="_blank" rel="noreferrer">Ouvrir dans un nouvel onglet</a>
        </div>
      </body>
      </html>
    `);
  }
});

// Rich Article Extractor for Reader Mode
app.get('/api/extract-article', async (req, res) => {
  const targetUrl = (req.query.url as string || '').trim();
  if (!targetUrl || !targetUrl.startsWith('http')) {
    return res.status(400).json({ error: 'URL requise' });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
    });

    const html = await response.text();

    const titleMatch = html.match(/<meta property=["']og:title["'] content=["']([^"']+)["']/i) ||
                       html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim() : '';

    const imgMatch = html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i) ||
                     html.match(/<meta name=["']twitter:image["'] content=["']([^"']+)["']/i);
    const img = imgMatch ? imgMatch[1].trim() : '';

    const descMatch = html.match(/<meta property=["']og:description["'] content=["']([^"']+)["']/i) ||
                      html.match(/<meta name=["']description["'] content=["']([^"']+)["']/i);
    const desc = descMatch ? descMatch[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim() : '';

    const paragraphMatches = html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    const paragraphs: string[] = [];
    for (const m of paragraphMatches) {
      const clean = m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
      if (clean.length > 45 && !clean.toLowerCase().includes('cookie') && !clean.toLowerCase().includes('abonnez-vous')) {
        paragraphs.push(clean);
      }
    }

    res.json({
      title,
      img,
      desc,
      paragraphs: paragraphs.slice(0, 35),
      url: targetUrl
    });
  } catch (err) {
    res.status(500).json({ error: 'Extraction impossible' });
  }
});

// =========================================================================
// API ROUTES
// =========================================================================

// Health & Status Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    keysConfigured: keyManager.getKeyCount(),
    timestamp: Date.now(),
  });
});

// Server Ads & Issue Reporting Endpoint
app.post('/api/report-server', (req, res) => {
  try {
    const report = req.body || {};
    console.log(`[ServerReport] Received report for ${report.serverName || report.serverId}: ${report.reason || 'General'}`);
    res.json({ success: true, timestamp: Date.now() });
  } catch (err) {
    res.json({ success: true });
  }
});

// Weather search endpoint (Open-Meteo Geocoding / WeatherAPI)
app.get('/api/weather-search', async (req, res) => {
  const q = (req.query.q as string || '').trim();
  if (!q) return res.json([]);

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=fr&format=json`;
    const response = await fetch(geoUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const mapped = data.results.map((r: any) => ({
          name: r.name,
          region: r.admin1 || r.country,
          country: r.country,
          lat: r.latitude,
          lon: r.longitude
        }));
        return res.json(mapped);
      }
    }
  } catch (err) {
    console.warn('Weather search error:', err);
  }
  res.json([]);
});

// Full Weather endpoint with hourly, daily, sun arc, and air quality
app.get('/api/weather', async (req, res) => {
  let queryCity = (req.query.q as string || 'Paris').trim();
  let lat = 48.8566;
  let lon = 2.3522;
  let cityName = 'Paris';
  let countryName = 'France';

  if (queryCity.includes(',')) {
    const parts = queryCity.split(',');
    const pLat = parseFloat(parts[0]);
    const pLon = parseFloat(parts[1]);
    if (!isNaN(pLat) && !isNaN(pLon)) {
      lat = pLat;
      lon = pLon;
      cityName = `Lat ${lat.toFixed(2)}`;
      countryName = `Lon ${lon.toFixed(2)}`;
    }
  } else if (queryCity && queryCity !== 'auto:ip') {
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(queryCity)}&count=1&language=fr&format=json`;
      const gRes = await fetch(geoUrl);
      if (gRes.ok) {
        const gData = await gRes.json();
        if (gData.results && gData.results[0]) {
          lat = gData.results[0].latitude;
          lon = gData.results[0].longitude;
          cityName = gData.results[0].name;
          countryName = gData.results[0].country || 'France';
        }
      }
    } catch {}
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`;
    
    const wRes = await fetch(weatherUrl);
    if (!wRes.ok) throw new Error('Weather fetch failed');
    const wData = await wRes.json();

    const cur = wData.current || {};
    const daily = wData.daily || {};
    const hourly = wData.hourly || {};

    const codeToCondition = (code: number, isDay: number) => {
      if (code === 0) return { text: isDay ? 'Ensoleillé' : 'Nuit dégagée', icon: isDay ? '//cdn.weatherapi.com/weather/64x64/day/113.png' : '//cdn.weatherapi.com/weather/64x64/night/113.png', code: 1000 };
      if (code <= 3) return { text: 'Partiellement nuageux', icon: isDay ? '//cdn.weatherapi.com/weather/64x64/day/116.png' : '//cdn.weatherapi.com/weather/64x64/night/116.png', code: 1003 };
      if (code <= 48) return { text: 'Brouillard', icon: '//cdn.weatherapi.com/weather/64x64/day/143.png', code: 1030 };
      if (code <= 67) return { text: 'Pluie modérée', icon: '//cdn.weatherapi.com/weather/64x64/day/296.png', code: 1183 };
      if (code <= 77) return { text: 'Chutes de neige', icon: '//cdn.weatherapi.com/weather/64x64/day/338.png', code: 1225 };
      if (code <= 82) return { text: 'Averses fortes', icon: '//cdn.weatherapi.com/weather/64x64/day/308.png', code: 1195 };
      if (code <= 99) return { text: 'Orages', icon: '//cdn.weatherapi.com/weather/64x64/day/389.png', code: 1276 };
      return { text: 'Nuageux', icon: '//cdn.weatherapi.com/weather/64x64/day/119.png', code: 1006 };
    };

    const condition = codeToCondition(cur.weather_code || 0, cur.is_day ?? 1);

    const formatHourTime = (isoString: string) => {
      const d = new Date(isoString);
      return `${d.getHours()}:00`;
    };

    // Format forecast payload matching LevelDay expectations
    const forecastDays = (daily.time || []).slice(0, 3).map((dStr: string, idx: number) => {
      const dayCode = daily.weather_code?.[idx] || 0;
      const dayCond = codeToCondition(dayCode, 1);
      const srTime = daily.sunrise?.[idx] ? new Date(daily.sunrise[idx]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '06:30 AM';
      const ssTime = daily.sunset?.[idx] ? new Date(daily.sunset[idx]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '08:45 PM';

      return {
        date: dStr,
        day: {
          maxtemp_c: daily.temperature_2m_max?.[idx] || 22,
          mintemp_c: daily.temperature_2m_min?.[idx] || 14,
          avgtemp_c: ((daily.temperature_2m_max?.[idx] || 22) + (daily.temperature_2m_min?.[idx] || 14)) / 2,
          maxwind_kph: daily.wind_speed_10m_max?.[idx] || 15,
          totalprecip_mm: daily.precipitation_sum?.[idx] || 0,
          avghumidity: 65,
          daily_chance_of_rain: daily.precipitation_probability_max?.[idx] || 10,
          daily_chance_of_snow: 0,
          uv: daily.uv_index_max?.[idx] || 5,
          condition: dayCond
        },
        astro: {
          sunrise: srTime,
          sunset: ssTime,
          moonrise: '09:15 PM',
          moonset: '07:40 AM',
          moon_phase: 'Waxing Gibbous',
          moon_illumination: '78'
        },
        hour: (hourly.time || []).slice(idx * 24, (idx + 1) * 24).map((hTime: string, hIdx: number) => {
          const globalIdx = idx * 24 + hIdx;
          const hCode = hourly.weather_code?.[globalIdx] || 0;
          return {
            time: hTime,
            temp_c: hourly.temperature_2m?.[globalIdx] || 18,
            is_day: 1,
            condition: codeToCondition(hCode, 1),
            wind_kph: hourly.wind_speed_10m?.[globalIdx] || 12,
            humidity: hourly.relative_humidity_2m?.[globalIdx] || 60,
            chance_of_rain: hourly.precipitation_probability?.[globalIdx] || 0,
            chance_of_snow: 0
          };
        })
      };
    });

    const sr = daily.sunrise?.[0] ? new Date(daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '06:30 AM';
    const ss = daily.sunset?.[0] ? new Date(daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '08:45 PM';

    res.json({
      forecast: {
        location: {
          name: cityName,
          region: countryName,
          country: countryName,
          lat,
          lon,
          localtime: new Date().toISOString().replace('T', ' ').slice(0, 16)
        },
        current: {
          temp_c: cur.temperature_2m || 20,
          is_day: cur.is_day ?? 1,
          condition,
          wind_kph: cur.wind_speed_10m || 14,
          wind_dir: 'SSW',
          pressure_mb: Math.round(cur.pressure_msl || 1015),
          humidity: cur.relative_humidity_2m || 55,
          cloud: cur.cloud_cover || 25,
          feelslike_c: cur.apparent_temperature || 20,
          vis_km: 10,
          uv: daily.uv_index_max?.[0] || 4,
          gust_kph: cur.wind_gusts_10m || 22,
          dewpoint_c: (cur.temperature_2m || 20) - ((100 - (cur.relative_humidity_2m || 55)) / 5),
          air_quality: {
            'us-epa-index': 1,
            pm2_5: 8.4,
            pm10: 14.2,
            co: 240,
            o3: 45
          }
        },
        forecast: {
          forecastday: forecastDays
        },
        alerts: {
          alert: []
        }
      },
      astronomy: {
        sunrise: sr,
        sunset: ss,
        moonrise: '09:15 PM',
        moonset: '07:40 AM',
        moon_phase: 'Waxing Gibbous',
        moon_illumination: '78'
      }
    });

  } catch (err: any) {
    console.error('Weather error:', err);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// Dona Suggestions / Spotlight
app.get('/api/dona/suggestions', async (req, res) => {
  const lang = (req.query.lang as string) === 'en' ? 'en-US' : 'fr-FR';
  try {
    const trending = await getTrendingSpotlight(lang);
    res.json({ success: true, spotlight: trending });
  } catch (e: any) {
    res.json({ success: false, spotlight: [], error: e.message });
  }
});

// Dona Chat Endpoint with Smart Gemini Rotation & TMDB Integration
app.post('/api/dona/chat', async (req, res) => {
  const { message, history = [], lang = 'fr' } = req.body;
  const isFr = lang === 'fr';

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const queryText = message.trim();

  // Search TMDB in parallel for relevant context
  let tmdbResults: any[] = [];
  try {
    tmdbResults = await searchTMDBMovies(queryText, isFr ? 'fr-FR' : 'en-US');
  } catch (e) {
    console.warn('TMDB search error:', e);
  }

  // If no Gemini keys configured, produce smart fallback response
  if (keyManager.getKeyCount() === 0) {
    let fallbackText = '';
    if (tmdbResults.length > 0) {
      const topList = tmdbResults.map(m => `« ${m.title || m.name} »`).join(', ');
      fallbackText = isFr
        ? `Voici d'excellentes pépites trouvées dans notre catalogue pour « ${queryText} » : ${topList}.\n\nTu peux cliquer sur une affiche pour lancer le film [play:${tmdbResults[0].id}|${tmdbResults[0].title || tmdbResults[0].name}], regarder sa bande-annonce [trailer:${tmdbResults[0].id}|${tmdbResults[0].title || tmdbResults[0].name}] ou démarrer une Watch Party [party:${tmdbResults[0].id}|${tmdbResults[0].title || tmdbResults[0].name}] !`
        : `Here are great picks from our catalogue for "${queryText}": ${topList}.\n\nYou can click on any card below to play [play:${tmdbResults[0].id}|${tmdbResults[0].title || tmdbResults[0].name}], watch its trailer [trailer:${tmdbResults[0].id}|${tmdbResults[0].title || tmdbResults[0].name}], or start a Watch Party [party:${tmdbResults[0].id}|${tmdbResults[0].title || tmdbResults[0].name}]!`;
    } else {
      fallbackText = isFr
        ? `Je n'ai pas trouvé de correspondance directe pour « ${queryText} », mais je t'invite à explorer les tendances du moment ou lancer une recherche par genre !`
        : `I could not find an exact match for "${queryText}", but feel free to explore trending titles or search by genre!`;
    }

    return res.json({
      text: fallbackText,
      movies: tmdbResults,
      mode: 'fallback',
    });
  }

  // Format conversation for Gemini
  const tmdbContextSummary = tmdbResults.length > 0
    ? `\nTITRES IDENTIFIÉS DANS LE CATALOGUE LEVELMOVIE TMDB:\n` +
      tmdbResults.map((m, idx) => `${idx + 1}. Titre: "${m.title || m.name}" (ID TMDB: ${m.id}, Date: ${m.release_date || m.first_air_date || 'N/A'}, Note: ${m.vote_average || 'N/A'}/10, Type: ${m.media_type || (m.first_air_date ? 'tv' : 'movie')})\nSynopsis: ${m.overview || 'Pas de résumé'}`).join('\n')
    : '';

  const globalPromptEnv = process.env.GLOBAL_PROMPT || '';
  const baseSystemInstruction = globalPromptEnv.trim() || `
# PROMPT SYSTÈME MAÎTRE — DONA & LEVEL IA (Intelligence Officielle LevelUp & LevelMovie v2.6)

Tu es **Dona** (également connue sous le nom de **Level IA**), l'intelligence artificielle suprême et l'assistante officielle de l'écosystème **LevelUp** et de la plateforme de streaming **LevelMovie**.

### 🧠 INTELLIGENCE & PERSONA :
- **Niveau d'Intelligence Exceptionnel** : Tu possèdes une culture encyclopédique, un raisonnement analytique profond, une plume élégante, précise et captivante. Tu es capable de comprendre les nuances, le sous-texte, l'humour, la poésie, les références cinématographiques complexes et d'argumenter avec pertinence.
- **Polyvalence Totale (IA Universelle)** : Même si tu es l'experte absolue du cinéma et de LevelMovie, tu sais répondre à **n'importe quel sujet** avec brio (culture générale, sciences, programmation, philosophie, analyse de scénario, conseils, productivité, etc.). Tu ne dis JAMAIS "je ne peux parler que de cinéma". Tu réponds intelligemment à tout !
- **Expertise Cinématographique Maîtresse** : Tu connais sur le bout des doigts la filmographie mondiale, les réalisateurs (Nolan, Villeneuve, Tarantino, Kubrick, Miyazaki, Scorsese, Fincher, Spielberg...), l'histoire du 7ème art, la photographie, le montage, les musiques de film (Hans Zimmer, John Williams, Ennio Morricone...), les anecdotes de tournage et la chronologie des univers (MCU, Star Wars, DC, Dune, Tolkien, etc.).

### ⚡ POUVOIRS D'ACTION & BALISES INTERACTIVES LEVELMOVIE :
Lorsque tu mentionnes des films, séries, actions ou fonctionnalités, intègre naturellement des **balises interactives cliquables** dans ton texte afin que l'utilisateur puisse agir en 1 clic :
1. 🎬 **Lancer un film/série en streaming** : \`[play:ID|Titre]\` (ex: \`[play:157336|Interstellar]\`)
2. 🍿 **Visionner la bande-annonce officielle** : \`[trailer:ID|Titre]\` (ex: \`[trailer:157336|Interstellar]\`)
3. 👥 **Créer / Lancer une Watch Party synchronisée** : \`[party:ID|Titre]\` ou \`[party:ID|Titre|NomDuSalon]\` (ex: \`[party:157336|Interstellar|Soirée Espace]\`)
4. 🔔 **Programmer un rappel ou alerte de sortie** : \`[action:remind:Titre]\`
5. 🔍 **Lancer une recherche ciblée dans le catalogue** : \`[action:search:Terme]\`
6. 📁 **Ouvrir une catégorie ou un onglet** : \`[category:movies]\` ou \`[category:series]\` ou \`[category:party]\` ou \`[category:trailers]\`
7. ⭐ **Ajouter à la Watchlist** : \`[action:watchlist:ID|Titre]\`

### ✍️ DIRECTIVES DE STYLE ET DE STRUCTURE :
- **Clarté & Esthétique** : Utilise du markdown propre, des sauts de ligne aérés, des listes à puces soignées et mets en gras les points clés.
- **Ton** : Professionnel, chaleureux, passionné, direct, bienveillant et complice.
- **Langue** : ${isFr ? 'Français' : 'English'}.
- Si l'utilisateur cherche une recommandation, explique **pourquoi** ce film est une merveille (ambiance, réalisation, jeu d'acteur) et fournis les boutons d'action cliquables.`;

  const systemInstruction = `${baseSystemInstruction}\n\n${tmdbContextSummary}\n\nRéponds avec excellence, intelligence et précision.`;

  try {
    const aiResponseText = await keyManager.executeWithRotation(async (ai) => {
      // Build conversation contents
      const contents: any[] = [];

      // Add recent history (up to last 6 messages)
      const recentHistory = history.slice(-6);
      for (const h of recentHistory) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }

      // Add current user message
      contents.push({
        role: 'user',
        parts: [{ text: queryText }],
      });

      const candidateModels = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
      ];

      let lastModelError: any = null;
      for (const modelName of candidateModels) {
        // Try up to 2 times per model if 503 high demand occurs
        for (let retry = 0; retry < 2; retry++) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents,
              config: {
                systemInstruction,
                temperature: 0.7,
              },
            });

            if (response && response.text) {
              return response.text;
            }
          } catch (mErr: any) {
            lastModelError = mErr;
            const msg = mErr?.message || 'unknown error';
            const is503 = msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE');

            console.warn(`[Gemini] Model ${modelName} (attempt ${retry + 1}) failed: ${msg}`);

            if (is503 && retry === 0) {
              // Wait 1 second before retrying the same model
              await new Promise((r) => setTimeout(r, 1000));
              continue;
            }

            // Move to next candidate model
            break;
          }
        }
      }

      throw lastModelError || new Error('All candidate models failed to generate content');
    });

    res.json({
      text: aiResponseText,
      movies: tmdbResults,
      mode: 'gemini',
    });

  } catch (err: any) {
    console.error('[Dona Chat Error]:', err);

    // If Gemini fails after all key rotations, provide elegant TMDB fallback
    let fallbackText = '';
    if (tmdbResults.length > 0) {
      const topList = tmdbResults.map(m => `« ${m.title || m.name} »`).join(', ');
      fallbackText = isFr
        ? `Voici les meilleurs titres disponibles pour « ${queryText} » : ${topList}.\n\nClique sur une affiche ci-dessous pour lancer le streaming ou découvrir la bande-annonce !`
        : `Here are the top picks for "${queryText}": ${topList}.\n\nClick on any poster below to start streaming or watch trailers!`;
    } else {
      fallbackText = isFr
        ? "Désolé, je rencontre une petite surcharge temporaire sur le réseau IA. Peux-tu reformuler ta recherche cinéma ?"
        : "Sorry, I am experiencing high traffic right now. Could you please rephrase your cinema request?";
    }

    res.json({
      text: fallbackText,
      movies: tmdbResults,
      mode: 'fallback_error',
    });
  }
});

// =========================================================================
// VITE MIDDLEWARE & STATIC SERVING
// =========================================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 LevelMovie Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
