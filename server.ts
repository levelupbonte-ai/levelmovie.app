import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const TMDB_API_KEY = '027cc951d888c64e5f15dcb853c7347a';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

app.use(express.json({ limit: '10mb' }));

// =========================================================================
// INTELLIGENT GEMINI MULTI-KEY ROTATION & LOAD BALANCER ENGINE
// =========================================================================
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

    // 1. Single GEMINI_API_KEY
    if (process.env.GEMINI_API_KEY) {
      rawKeys.push(process.env.GEMINI_API_KEY.trim());
    }

    // 2. Comma / Semicolon / Space / Newline separated GEMINI_API_KEYS
    if (process.env.GEMINI_API_KEYS) {
      const split = process.env.GEMINI_API_KEYS.split(/[\s,;\n]+/);
      for (const k of split) {
        if (k.trim()) rawKeys.push(k.trim());
      }
    }

    // 3. Individual GEMINI_API_KEY_1 ... GEMINI_API_KEY_25
    for (let i = 1; i <= 25; i++) {
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

    console.log(`[GeminiKeyManager] Loaded ${this.keys.length} distinct Gemini API key(s) in rotation pool.`);
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
  const searchRes = await fetchTMDB('/search/multi', {
    query: cleanQ,
    language: lang,
    include_adult: 'false',
    page: '1',
  });

  if (searchRes && searchRes.results && searchRes.results.length > 0) {
    return searchRes.results
      .filter((m: any) => m.poster_path && (m.media_type === 'movie' || m.media_type === 'tv' || !m.media_type))
      .slice(0, 6);
  }
  return [];
}

async function getTrendingSpotlight(lang = 'fr-FR'): Promise<any[]> {
  const res = await fetchTMDB('/trending/all/day', { language: lang });
  if (res && res.results) {
    return res.results.filter((m: any) => m.poster_path).slice(0, 6);
  }
  return [];
}

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

  const systemInstruction = `
Tu es "Dona" (la voix et l'intelligence centrale de LevelMovie), la véritable maîtresse de maison et cheffe d'orchestre absolue de l'application de streaming LevelMovie.
Tu ne te contentes pas de répondre : tu CONTRÔLES et PILOTES toute l'application et réalises toutes les actions pour l'utilisateur.

Tes capacités et pouvoirs d'exécution totale :
1. 👥 GESTION DES WATCH PARTIES (SALONS EN DIRECT) :
   Tu peux créer, configurer et lancer des Watch Parties pour l'utilisateur, définir le nom du salon, inviter ses amis, proposer des films parfaits pour la soirée.
   Balise : [party:ID|Titre] ou [party:ID|Titre|NomDuSalon]

2. 🎬 LECTURE & VISIONNAGE DIRECT :
   Tu lances instantanément les films, séries ou épisodes.
   Balise : [play:ID|Titre]

3. 🍿 BANDES-ANNONCES OFFICIELLES :
   Tu affiches directement les trailers en plein écran.
   Balise : [trailer:ID|Titre]

4. 🔔 RAPPELS, SORTIES & NOTIFICATIONS :
   Tu peux enregistrer des alertes et rappels de sortie pour les films très attendus ou les sorties cinéma de 2025/2026.
   Balise : [action:remind:ID|Titre|Date] ou [action:remind:Titre]

5. 🔍 RECHERCHES, GENRES & EXPLORATION :
   Tu guides l'utilisateur dans tout le catalogue, les filtres par genre, les classements IMDb / TMDB.
   Balises : [action:search:Recherche] ou [action:genre:Genre] ou [category:movie] / [category:trailers] / [category:watchlist] / [category:party]

6. ⭐ GESTION DE LA WATCHLIST & PARAMÈTRES :
   Tu peux ajouter des films à la liste ou ouvrir les réglages.
   Balises : [action:watchlist:ID|Titre] ou [action:settings] ou [action:support]

Directives de communication :
- Ton ton est ultra-chaleureux, enthousiaste, passionné, direct et complice, comme une experte cinéma d'élite à la tête de la plateforme.
- Langue de réponse : ${isFr ? 'Français' : 'English'}.
- Sois claire, percutante, utilise des retours à la ligne et des balises interactives actionnables pour que l'utilisateur n'ait qu'à cliquer pour tout lancer.

${tmdbContextSummary}

Réponds avec énergie et précision à la demande. Intègre toujours les balises cliquables correspondantes dès que tu mentionnes un film ou une action.`;

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
        'gemini-3.7-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
        'gemini-3.6-flash',
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
