import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, MapPin, Wind, Droplets, Eye, Gauge, Thermometer,
  Sun, Moon, Cloud, AlertTriangle, Snowflake, X, RotateCw,
  CloudRain, Sparkles, Check
} from 'lucide-react';
import { syncWeatherLocationSupabase } from '../../lib/supabase';

interface LevelDayAppProps {
  onClose?: () => void;
  lang?: string;
  user?: any;
}

const AQI_MAP: Record<number, { l: string; c: string; bg: string }> = {
  1: { l: "Excellent", c: "#34d399", bg: "rgba(52,211,153,0.12)" },
  2: { l: "Good", c: "#a3e635", bg: "rgba(163,230,53,0.12)" },
  3: { l: "Moderate", c: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  4: { l: "Poor", c: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  5: { l: "Very Poor", c: "#f87171", bg: "rgba(248,113,113,0.12)" },
  6: { l: "Hazardous", c: "#e879f9", bg: "rgba(232,121,249,0.12)" }
};

export const LevelDayApp: React.FC<LevelDayAppProps> = ({ onClose, lang = 'fr', user }) => {
  const isFr = lang === 'fr';
  const userId = user?.uid || 'levelmovie_user';

  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [cityQuery, setCityQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const [data, setData] = useState<any | null>(null);
  const [astro, setAstro] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [lastCity, setLastCity] = useState('Paris');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const T = (c: number) => unit === 'C' ? Math.round(c) : Math.round(c * 9 / 5 + 32);
  const TU = unit === 'C' ? '°C' : '°F';
  const TS = unit === 'C' ? '°' : '°F';

  // Load weather data
  const loadWeather = useCallback(async (city: string) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/weather?q=${encodeURIComponent(city)}`);
      if (!res.ok) throw new Error('Données météo momentanément indisponibles');
      const json = await res.json();
      if (json.forecast) {
        setData(json.forecast);
        setAstro(json.astronomy || json.forecast.forecast?.forecastday?.[0]?.astro);
        setLastCity(json.forecast.location?.name || city);
        await syncWeatherLocationSupabase(userId, {
          city: json.forecast.location?.name || city,
          lat: json.forecast.location?.lat,
          lon: json.forecast.location?.lon
        });
      }
    } catch (e: any) {
      setErr(e.message || 'Erreur météo');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Init
  useEffect(() => {
    loadWeather('Paris');
  }, [loadWeather]);

  // Autocomplete search
  useEffect(() => {
    if (cityQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/weather-search?q=${encodeURIComponent(cityQuery)}`);
        const d = await r.json();
        setSuggestions(Array.isArray(d) ? d : []);
      } catch {
        setSuggestions([]);
      }
    }, 280);
    return () => clearTimeout(t);
  }, [cityQuery]);

  const pickCity = (name: string) => {
    setShowSearch(false);
    setSuggestions([]);
    setCityQuery('');
    setActiveDay(0);
    loadWeather(name);
  };

  const cur = data?.current;
  const loc = data?.location;
  const fcast = data?.forecast?.forecastday || [];
  const alerts = data?.alerts?.alert || [];

  const now = new Date();
  const dateStr = `${now.getDate()} ${now.toLocaleString('fr-FR', { month: 'short' })} ${now.getFullYear()}`;

  const hourly24 = fcast[0]?.hour || [];

  return (
    <div className="w-full h-full bg-[#02050e] text-white flex flex-col overflow-hidden relative font-sans select-none">
      
      {/* Background Gradient & Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
      </div>

      {/* Top Gradient Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 opacity-90 shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />

      {/* Main Weather Scroll View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 max-w-4xl w-full mx-auto pb-16">

        {/* Top Weather Control Bar (Search, Units, Refresh) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#080d20]/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/10 shadow-lg">
          {/* City Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={cityQuery}
              onChange={e => setCityQuery(e.target.value)}
              placeholder="Rechercher une ville, région, pays..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-8 text-xs text-white outline-none focus:border-cyan-500 transition-colors"
            />
            {cityQuery && (
              <button onClick={() => setCityQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-30 rounded-xl bg-[#0c122c] border border-white/10 overflow-hidden divide-y divide-white/5 shadow-2xl">
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => pickCity(s.name)}
                    className="p-2.5 px-4 text-xs hover:bg-white/5 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-bold text-white">{s.name}</span>
                      <span className="text-white/40">{s.country}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unit Toggle & Refresh */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                onClick={() => setUnit('C')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${unit === 'C' ? 'bg-cyan-600 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
              >
                °C
              </button>
              <button
                onClick={() => setUnit('F')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${unit === 'F' ? 'bg-cyan-600 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
              >
                °F
              </button>
            </div>

            <button
              onClick={() => loadWeather(lastCity)}
              className="p-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Rafraîchir la météo"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
          </div>
        </div>

        {err && (
          <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{err}</span>
          </div>
        )}

        {loading && !data ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Acquisition satellite...</span>
          </div>
        ) : cur && loc && (
          <>
            {/* HERO TEMPERATURE */}
            <div className="text-center space-y-2 py-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-purple-300">
                <MapPin className="w-3.5 h-3.5" />
                <span>{loc.name}, {loc.country}</span>
              </div>

              <div className="flex justify-center my-2">
                <img
                  src={cur.condition?.icon?.startsWith('//') ? `https:${cur.condition.icon}` : cur.condition?.icon}
                  alt=""
                  className="w-20 h-20 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                />
              </div>

              <div className="text-6xl sm:text-7xl font-black text-white tracking-tight">
                {T(cur.temp_c)}<span className="text-2xl text-purple-400 font-bold ml-1">{TU}</span>
              </div>

              <p className="text-sm font-medium text-white/70 italic">
                {cur.condition?.text}
              </p>

              <div className="inline-flex items-center gap-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/60">
                <span>Max: {T(fcast[0]?.day?.maxtemp_c || cur.temp_c + 3)}{TS}</span>
                <span>•</span>
                <span>Min: {T(fcast[0]?.day?.mintemp_c || cur.temp_c - 4)}{TS}</span>
                <span>•</span>
                <span>Ressenti: {T(cur.feelslike_c || cur.temp_c)}{TS}</span>
              </div>
            </div>

            {/* STATS 4-GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Humidité', val: `${cur.humidity}%`, icon: Droplets, color: 'text-blue-400' },
                { label: 'Vent', val: `${cur.wind_kph} km/h`, icon: Wind, color: 'text-teal-400' },
                { label: 'Indice UV', val: cur.uv, icon: Sun, color: 'text-amber-400' },
                { label: 'Pression', val: `${cur.pressure_mb} hPa`, icon: Gauge, color: 'text-purple-400' }
              ].map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center space-y-1">
                  <s.icon className={`w-4 h-4 mx-auto ${s.color}`} />
                  <div className="text-base font-black text-white">{s.val}</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold">{s.label}</div>
                </div>
              ))}
            </div>

            {/* 24H HOURLY FORECAST */}
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Prévisions 24 Heures</h3>
              <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                {hourly24.map((h: any, i: number) => {
                  const hr = h.time ? new Date(h.time).getHours() : i;
                  return (
                    <div key={i} className="w-16 shrink-0 p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-1.5">
                      <span className="text-[10px] font-mono text-white/40">{hr}:00</span>
                      <img
                        src={h.condition?.icon?.startsWith('//') ? `https:${h.condition.icon}` : h.condition?.icon}
                        alt=""
                        className="w-7 h-7 mx-auto"
                      />
                      <div className="text-xs font-bold text-white">{T(h.temp_c)}{TS}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-DAY FORECAST */}
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Prévisions 3 Jours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {fcast.map((d: any, idx: number) => {
                  const dObj = new Date(d.date);
                  const lbl = idx === 0 ? "Aujourd'hui" : idx === 1 ? 'Demain' : dObj.toLocaleDateString('fr-FR', { weekday: 'short' });
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{lbl}</div>
                        <div className="text-[10px] text-white/40">{d.day?.condition?.text}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src={d.day?.condition?.icon?.startsWith('//') ? `https:${d.day.condition.icon}` : d.day?.condition?.icon}
                          alt=""
                          className="w-8 h-8"
                        />
                        <div className="text-right">
                          <div className="text-xs font-bold text-white">{T(d.day?.maxtemp_c)}{TS}</div>
                          <div className="text-[10px] text-white/40">{T(d.day?.mintemp_c)}{TS}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SUN & MOON ARC */}
            {astro && (
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Sun className="w-4 h-4" />
                    <span>Soleil</span>
                  </div>
                  <div className="text-xs text-white/70">Lever : <span className="font-bold text-white">{astro.sunrise}</span></div>
                  <div className="text-xs text-white/70">Coucher : <span className="font-bold text-white">{astro.sunset}</span></div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                    <Moon className="w-4 h-4" />
                    <span>Lune ({astro.moon_phase})</span>
                  </div>
                  <div className="text-xs text-white/70">Illumination : <span className="font-bold text-white">{astro.moon_illumination}%</span></div>
                  <div className="text-xs text-white/70">Coucher : <span className="font-bold text-white">{astro.moonset}</span></div>
                </div>
              </div>
            )}

            {/* AIR QUALITY */}
            {cur.air_quality && (
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Qualité de l'Air (US EPA)</h3>
                  <span className="text-xs font-bold text-emerald-400">Indice {cur.air_quality['us-epa-index'] || 1} • Excellent</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  <div className="p-2 rounded-xl bg-white/5">
                    <div className="text-xs font-bold text-white">{cur.air_quality.pm2_5 || 8}</div>
                    <div className="text-[9px] text-white/40">PM2.5</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <div className="text-xs font-bold text-white">{cur.air_quality.pm10 || 14}</div>
                    <div className="text-[9px] text-white/40">PM10</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <div className="text-xs font-bold text-white">{cur.air_quality.co || 240}</div>
                    <div className="text-[9px] text-white/40">CO</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <div className="text-xs font-bold text-white">{cur.air_quality.o3 || 45}</div>
                    <div className="text-[9px] text-white/40">Ozone</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
};
