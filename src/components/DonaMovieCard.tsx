import React from 'react';
import { Play, Film, Users, Info, Bookmark, Star, Sparkles, Check } from 'lucide-react';

export interface DonaMovieCardProps {
  movie: any;
  onPlayMovie: (movie: any) => void;
  onOpenTrailer: (movie: any) => void;
  onCreateParty: (movie: any) => void;
  onSelectMovie: (movie: any) => void;
  onToggleWatchlist?: (movie: any) => void;
  isWatchlisted?: boolean;
  isFr?: boolean;
}

export const DonaMovieCard: React.FC<DonaMovieCardProps> = ({
  movie,
  onPlayMovie,
  onOpenTrailer,
  onCreateParty,
  onSelectMovie,
  onToggleWatchlist,
  isWatchlisted = false,
  isFr = true,
}) => {
  if (!movie) return null;

  const title = movie.title || movie.name || 'Titre inconnu';
  const rawDate = movie.release_date || movie.first_air_date;
  const year = rawDate ? new Date(rawDate).getFullYear() : null;
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : null;
  const isTv = movie.media_type === 'tv' || Boolean(movie.first_air_date && !movie.release_date);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';

  const overview = movie.overview || (isFr ? 'Aucun synopsis disponible pour ce titre.' : 'No synopsis available.');

  return (
    <div 
      id={`dona-card-${movie.id}`}
      className="group relative flex flex-col sm:flex-row bg-gradient-to-b sm:bg-gradient-to-r from-[#0d0d16] to-[#090910] border border-white/10 hover:border-[#a855f7]/50 rounded-2xl overflow-hidden transition-all duration-250 hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] select-none text-left"
    >
      {/* Visual Poster Column */}
      <div 
        className="relative w-full sm:w-36 md:w-40 aspect-[16/10] sm:aspect-[2/3] shrink-0 overflow-hidden bg-black/60 cursor-pointer"
        onClick={() => onPlayMovie(movie)}
      >
        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090910] via-transparent to-black/30 sm:hidden" />
        
        {/* Play Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-[#a855f7] text-white flex items-center justify-center shadow-lg shadow-purple-500/50 scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Badges Top Left & Right */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
          <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-purple-300 border border-purple-500/30">
            {isTv ? (isFr ? 'SÉRIE' : 'TV') : (isFr ? 'FILM' : 'MOVIE')}
          </span>
        </div>

        {rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-black text-amber-400 border border-amber-400/30 z-10">
            <Star className="w-3 h-3 fill-current" />
            <span>{rating}</span>
          </div>
        )}
      </div>

      {/* Content & Metadata Column */}
      <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 min-w-0">
        <div>
          {/* Header Row: Title & Action to full details */}
          <div className="flex items-start justify-between gap-2">
            <h4 
              onClick={() => onSelectMovie(movie)}
              className="text-base sm:text-lg font-black text-white group-hover:text-[#c084fc] transition-colors line-clamp-1 cursor-pointer"
              title={title}
            >
              {title}
            </h4>
            
            {onToggleWatchlist && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(movie);
                }}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                  isWatchlisted 
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                }`}
                title={isWatchlisted ? (isFr ? 'Retirer de ma liste' : 'Remove from watchlist') : (isFr ? 'Ajouter à ma liste' : 'Add to watchlist')}
              >
                {isWatchlisted ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Sub-meta: Year, Quality, Audio */}
          <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-white/50">
            {year && <span>{year}</span>}
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-emerald-400 font-semibold">4K UHD</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-white/60">VF & VOSTFR</span>
          </div>

          {/* Synopsis */}
          <p className="mt-2 text-xs text-white/70 line-clamp-2 leading-relaxed font-normal">
            {overview}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Direct Play */}
          <button
            type="button"
            onClick={() => onPlayMovie(movie)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isFr ? 'Lancer' : 'Play'}</span>
          </button>

          {/* Trailer */}
          <button
            type="button"
            onClick={() => onOpenTrailer(movie)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-pink-300 hover:text-pink-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
            title={isFr ? 'Regarder la bande-annonce' : 'Watch trailer'}
          >
            <Film className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden xs:inline">{isFr ? 'Trailer' : 'Trailer'}</span>
          </button>

          {/* Watch Party */}
          <button
            type="button"
            onClick={() => onCreateParty(movie)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-purple-300 hover:text-purple-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
            title={isFr ? 'Créer un salon Watch Party' : 'Create Watch Party lounge'}
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xs:inline">{isFr ? 'Watch Party' : 'Party'}</span>
          </button>

          {/* Details */}
          <button
            type="button"
            onClick={() => onSelectMovie(movie)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer ml-auto"
            title={isFr ? 'Fiche complète et casting' : 'Details & Cast'}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
