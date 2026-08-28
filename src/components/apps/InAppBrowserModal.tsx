import React, { useState, useEffect } from 'react';
import {
  X, Lock, RotateCw, Copy, Check,
  BookOpen, Globe, Share2,
  ShieldCheck, Loader2
} from 'lucide-react';

export interface InAppBrowserData {
  url: string;
  title?: string;
  source?: string;
  snippet?: string;
  img?: string;
  date?: string;
}

interface InAppBrowserModalProps {
  data: InAppBrowserData | null;
  onClose: () => void;
  lang?: string;
}

interface ExtractedArticle {
  title: string;
  img: string;
  desc: string;
  paragraphs: string[];
  url: string;
}

export const InAppBrowserModal: React.FC<InAppBrowserModalProps> = ({
  data,
  onClose,
  lang = 'fr'
}) => {
  const isFr = lang === 'fr';

  if (!data || !data.url) return null;

  const [currentUrl, setCurrentUrl] = useState(data.url);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'web' | 'reader'>('web');
  const [iframeKey, setIframeKey] = useState(0);

  // Reader Mode State
  const [extractedData, setExtractedData] = useState<ExtractedArticle | null>(null);
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    setCurrentUrl(data.url);
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
    fetchArticleDetails(data.url);
  }, [data.url]);

  const fetchArticleDetails = async (url: string) => {
    setExtracting(true);
    try {
      const res = await fetch(`/api/extract-article?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const json = await res.json();
        setExtractedData(json);
      }
    } catch {
      // ignore
    } finally {
      setExtracting(false);
    }
  };

  // Helper to get clean domain and path
  const getDomain = (rawUrl: string) => {
    try {
      const parsed = new URL(rawUrl);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return rawUrl;
    }
  };

  const getPathname = (rawUrl: string) => {
    try {
      const parsed = new URL(rawUrl);
      return parsed.pathname + parsed.search;
    } catch {
      return '';
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
    if (viewMode === 'reader') {
      fetchArticleDetails(currentUrl);
    }
  };

  // Proxied Web URL to bypass iframe X-Frame-Options blocks
  const proxiedUrl = `/api/proxy-web?url=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-[9990] bg-[#07080f] text-white flex flex-col w-full h-full overflow-hidden select-none animate-in fade-in duration-150">
      
      {/* ========================================================================= */}
      {/* TOP FIXED NAVIGATION & ADDRESS BAR (FLAT, CLEAN, NO BUBBLES, NO PUSHING)  */}
      {/* ========================================================================= */}
      <header className="h-13 w-full bg-[#0d0f18] border-b border-white/10 px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0 z-40">
        
        {/* Left Actions: Close & Reload */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onClose}
            className="h-8 px-2.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/80 hover:text-red-400 border border-white/10 flex items-center gap-1.5 font-semibold text-xs transition-colors cursor-pointer active:scale-95 shrink-0"
            title={isFr ? "Fermer le navigateur" : "Close browser"}
          >
            <X className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{isFr ? "Fermer" : "Close"}</span>
          </button>

          <button
            onClick={handleRefresh}
            className={`w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
              isLoading ? 'animate-spin text-purple-400' : ''
            }`}
            title={isFr ? "Actualiser" : "Reload"}
          >
            <RotateCw className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

        {/* Center: Address Bar (Omnibar) - STRICT truncate prevention with min-w-0 */}
        <div className="flex-1 min-w-0 max-w-2xl mx-1 sm:mx-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#06070d] border border-white/10 shadow-inner">
          <div className="flex items-center gap-1 text-emerald-400 shrink-0">
            <Lock className="w-3 h-3 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline text-emerald-400">
              HTTPS
            </span>
          </div>

          <div className="w-[1px] h-3.5 bg-white/15 shrink-0" />

          {/* URL text truncated so buttons NEVER shift */}
          <div className="flex-1 min-w-0 truncate text-xs font-mono select-all">
            <span className="text-white font-bold">{getDomain(currentUrl)}</span>
            <span className="text-white/40">{getPathname(currentUrl)}</span>
          </div>

          <button
            onClick={handleCopyUrl}
            className="p-1 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer shrink-0"
            title={isFr ? "Copier le lien" : "Copy URL"}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right Actions: View Mode Switcher (Web / Reader) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex bg-[#06070d] p-0.5 rounded-lg border border-white/10 shrink-0">
            <button
              onClick={() => setViewMode('web')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                viewMode === 'web'
                  ? 'bg-purple-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Vue Web Standard"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Web</span>
            </button>

            <button
              onClick={() => setViewMode('reader')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                viewMode === 'reader'
                  ? 'bg-purple-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Mode Lecture Épuré"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{isFr ? "Lecture" : "Reader"}</span>
            </button>
          </div>
        </div>

      </header>

      {/* Loading Bar */}
      {isLoading && viewMode === 'web' && (
        <div className="h-0.5 w-full bg-purple-950/50 overflow-hidden shrink-0">
          <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 animate-pulse w-full" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* BROWSER BODY (FULLSCREEN FIXED)                                           */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full h-full relative bg-[#06070c] overflow-hidden">

        {/* 1. WEB IFRAME PROXIED VIEW (Bypasses all X-Frame-Options) */}
        {viewMode === 'web' && (
          <div className="w-full h-full relative">
            <iframe
              key={iframeKey}
              src={proxiedUrl}
              title={data.title || "Navigateur LevelUp"}
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation allow-downloads"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>
        )}

        {/* 2. OPTIMIZED READER MODE (Dark, Clean Typography, Zero Ads) */}
        {viewMode === 'reader' && (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-5 sm:p-10 max-w-4xl mx-auto space-y-6 animate-in fade-in">
            
            {/* Source & Date Badge */}
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
              <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>{data.source || getDomain(currentUrl)}</span>
              </span>
              {data.date && (
                <span className="text-white/40">
                  {new Date(data.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              {extractedData?.title || data.title || 'Actualité & Analyse'}
            </h1>

            {/* Image Hero */}
            {(extractedData?.img || data.img) && (
              <div className="rounded-2xl overflow-hidden border border-white/10 max-h-[420px] bg-black/50 shadow-2xl">
                <img 
                  src={extractedData?.img || data.img} 
                  alt="" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}

            {/* Description / Lead */}
            {(extractedData?.desc || data.snippet) && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm sm:text-base text-purple-200/90 font-medium leading-relaxed italic">
                {extractedData?.desc || data.snippet?.replace(/<[^>]*>?/gm, '')}
              </div>
            )}

            {/* Main Paragraphs extracted */}
            {extracting ? (
              <div className="py-12 text-center text-xs text-white/40 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                <span>{isFr ? "Optimisation du texte pour la lecture..." : "Optimizing content for reader..."}</span>
              </div>
            ) : extractedData && extractedData.paragraphs.length > 0 ? (
              <div className="text-sm sm:text-base text-white/85 leading-relaxed space-y-4 font-sans">
                {extractedData.paragraphs.map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              <div className="text-sm sm:text-base text-white/80 leading-relaxed space-y-4">
                <p>{data.snippet?.replace(/<[^>]*>?/gm, '')}</p>
                <div className="p-4 rounded-xl bg-[#0f111d] border border-white/10 text-xs text-white/60 flex items-center justify-between gap-4">
                  <span>{isFr ? "Pour lire la totalité de l'article avec sa mise en page d'origine :" : "To read the full article with original layout:"}</span>
                  <button
                    onClick={() => setViewMode('web')}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shrink-0 cursor-pointer shadow-md"
                  >
                    {isFr ? "Basculer en vue Web" : "Switch to Web view"}
                  </button>
                </div>
              </div>
            )}

            {/* Action Footer */}
            <div className="pt-8 border-t border-white/10 flex items-center justify-between gap-4 pb-12">
              <button
                onClick={() => setViewMode('web')}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Globe className="w-4 h-4 text-purple-400" />
                <span>{isFr ? 'Afficher la page web d’origine' : 'View original web page'}</span>
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: data.title, url: currentUrl }).catch(() => {});
                  } else {
                    handleCopyUrl();
                  }
                }}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>{isFr ? 'Partager' : 'Share'}</span>
              </button>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
