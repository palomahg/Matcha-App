import React from 'react';
import { Spot } from '../../types';
import { useApp } from '../../context/AppContext';
import { RatingStars } from './RatingStars';
import { calculateDistanceKm, formatDistance } from '../../utils/geo';
import { TAG_DEFINITIONS } from '../../design-system/theme';
import { Bookmark, Heart, MapPin, Clock, Sparkles } from 'lucide-react';

interface SpotCardProps {
  spot: Spot;
  compact?: boolean;
}

export const SpotCard: React.FC<SpotCardProps> = ({ spot, compact = false }) => {
  const {
    openSpotDetail,
    userLocation,
    saved,
    toggleFavorite,
    toggleWantToTry,
    language,
    t,
  } = useApp();

  const isFavorite = saved.favorites.includes(spot.id);
  const isWantToTry = saved.wantToTry.includes(spot.id);

  const distanceKm = calculateDistanceKm(
    userLocation.lat,
    userLocation.lng,
    spot.lat,
    spot.lng
  );

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(spot.id);
  };

  const handleWantToTryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWantToTry(spot.id);
  };

  // Compact List Item View
  if (compact) {
    return (
      <div
        id={`spot-card-compact-${spot.id}`}
        onClick={() => openSpotDetail(spot.id)}
        className="group cursor-pointer bg-[#FFFDF8] rounded-2xl p-3 border border-[#E9DFCB] hover:border-[#A8B98A] transition-all duration-150 shadow-xs hover:shadow-sm active:scale-[0.99] flex items-center gap-3.5"
      >
        {/* Compact Thumbnail */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#E9DFCB]">
          <img
            src={spot.photos[0]}
            alt={spot.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute bottom-1 left-1 bg-black/60 text-[#FFFDF8] text-[9px] font-bold px-1.5 py-0.2 rounded-md">
            {spot.priceLevel}
          </span>
        </div>

        {/* Compact Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                spot.isOpenNow ? 'bg-emerald-500' : 'bg-stone-400'
              }`}
            />
            <span className="text-[11px] font-medium text-[#4F6340]/70 truncate">
              {spot.isOpenNow ? t.openBadge : t.closedBadge} · {formatDistance(distanceKm)}
            </span>
          </div>

          <h3 className="font-serif text-base font-bold text-[#4F6340] truncate group-hover:text-[#3C4D30] mt-0.5">
            {spot.name}
          </h3>

          <p className="text-xs text-[#4F6340]/75 truncate">
            {spot.neighborhood} · {spot.city}
          </p>

          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-1">
              <RatingStars rating={spot.avgRating} max={1} size={13} />
              <span className="text-xs font-bold text-[#4F6340]">
                {spot.avgRating.toFixed(1)}
              </span>
              <span className="text-[10px] text-[#4F6340]/60">
                ({spot.reviewCount})
              </span>
            </div>

            {spot.featuredMatchaOrigin && (
              <span className="text-[10px] bg-[#E5EBD8] text-[#3B4D31] font-semibold px-2 py-0.2 rounded-full truncate">
                {spot.featuredMatchaOrigin}
              </span>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <button
            type="button"
            id={`card-compact-fav-${spot.id}`}
            onClick={handleFavoriteClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-[#E8C9C0] text-rose-700'
                : 'text-[#4F6340]/60 hover:text-[#4F6340] hover:bg-[#F6F1E7]'
            }`}
            title={t.addToFavorites}
          >
            <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            id={`card-compact-try-${spot.id}`}
            onClick={handleWantToTryClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isWantToTry
                ? 'bg-[#A8B98A] text-[#FFFDF8]'
                : 'text-[#4F6340]/60 hover:text-[#4F6340] hover:bg-[#F6F1E7]'
            }`}
            title={t.wantToTry}
          >
            <Bookmark size={15} fill={isWantToTry ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`spot-card-${spot.id}`}
      onClick={() => openSpotDetail(spot.id)}
      className="group cursor-pointer bg-[#FFFDF8] rounded-3xl overflow-hidden border border-[#E9DFCB] hover:border-[#A8B98A] transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.99] flex flex-col"
    >
      {/* Top Media Area */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-[#E9DFCB]">
        <img
          src={spot.photos[0]}
          alt={spot.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Open / Closed badge */}
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${
                spot.isOpenNow
                  ? 'bg-[#4F6340]/90 text-[#FFFDF8]'
                  : 'bg-stone-800/80 text-[#F6F1E7]'
              }`}
            >
              {spot.isOpenNow ? t.openBadge : t.closedBadge}
            </span>

            {/* Moderation Pending badge if applicable */}
            {spot.status === 'pending' && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-700/90 text-[#FFFDF8] backdrop-blur-md">
                En revisión
              </span>
            )}

            {/* Featured Matcha Origin */}
            {spot.featuredMatchaOrigin && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FFFDF8]/90 text-[#4F6340] backdrop-blur-md">
                <Sparkles size={11} className="text-[#D9B25F]" />
                {spot.featuredMatchaOrigin}
              </span>
            )}
          </div>

          {/* Quick Action: Favorite & Want to try */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id={`card-try-btn-${spot.id}`}
              onClick={handleWantToTryClick}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-90 ${
                isWantToTry
                  ? 'bg-[#A8B98A] text-[#FFFDF8]'
                  : 'bg-[#FFFDF8]/80 text-[#4F6340] hover:bg-[#FFFDF8]'
              }`}
              title={t.wantToTry}
              aria-label="Por probar"
            >
              <Bookmark size={15} fill={isWantToTry ? 'currentColor' : 'none'} />
            </button>

            <button
              type="button"
              id={`card-fav-btn-${spot.id}`}
              onClick={handleFavoriteClick}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-90 ${
                isFavorite
                  ? 'bg-[#E8C9C0] text-rose-700'
                  : 'bg-[#FFFDF8]/80 text-[#4F6340] hover:bg-[#FFFDF8]'
              }`}
              title={t.addToFavorites}
              aria-label="Favorito"
            >
              <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Bottom image overlay: Price & Distance */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[#FFFDF8] text-xs font-medium">
          <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
            {spot.priceLevel}
          </span>
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
            <MapPin size={12} className="text-[#C9D3B0]" />
            {formatDistance(distanceKm)}
          </span>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-bold text-[#4F6340] leading-snug group-hover:text-[#3C4D30]">
              {spot.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0 bg-[#F6F1E7] px-2 py-0.5 rounded-full border border-[#E9DFCB]">
              <RatingStars rating={spot.avgRating} max={1} size={14} />
              <span className="text-xs font-bold text-[#4F6340]">
                {spot.avgRating.toFixed(1)}
              </span>
              <span className="text-[10px] text-[#4F6340]/60">
                ({spot.reviewCount})
              </span>
            </div>
          </div>

          <p className="text-xs text-[#4F6340]/70 font-medium mt-0.5 line-clamp-1">
            {spot.neighborhood} · {spot.city}
          </p>

          <p className="text-xs text-[#4F6340]/85 font-normal mt-1.5 line-clamp-2 leading-relaxed">
            {spot.description}
          </p>
        </div>

        {/* Tags pills */}
        <div className="flex flex-wrap items-center gap-1 pt-1">
          {spot.tags.slice(0, 3).map((tagKey) => {
            const def = TAG_DEFINITIONS[tagKey];
            if (!def) return null;
            return (
              <span
                key={tagKey}
                className="text-[11px] px-2 py-0.5 rounded-md bg-[#F6F1E7] text-[#4F6340] font-medium border border-[#E9DFCB]/70 flex items-center gap-1"
              >
                <span>{def.emoji}</span>
                <span>{language === 'es' ? def.labelEs : def.labelEn}</span>
              </span>
            );
          })}
          {spot.tags.length > 3 && (
            <span className="text-[10px] text-[#4F6340]/60 font-semibold px-1">
              +{spot.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
