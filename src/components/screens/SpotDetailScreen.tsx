import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../common/RatingStars';
import { TAG_DEFINITIONS, ChasenIcon } from '../../design-system/theme';
import { formatDistance, calculateDistanceKm } from '../../utils/geo';
import {
  ArrowLeft,
  Share2,
  Heart,
  Bookmark,
  MapPin,
  Phone,
  Globe,
  Instagram,
  Clock,
  ThumbsUp,
  Flag,
  Edit3,
  Trash2,
  Sparkles,
  Plus,
  Compass,
  CheckCircle2,
  Star,
  Copy,
  Check,
  Coffee,
  Leaf,
} from 'lucide-react';

export const SpotDetailScreen: React.FC = () => {
  const {
    selectedSpot,
    closeSpotDetail,
    userLocation,
    reviews,
    user,
    saved,
    toggleFavorite,
    toggleWantToTry,
    openReviewModal,
    deleteReview,
    toggleHelpfulReview,
    reportReview,
    openAuthModal,
    language,
    t,
    rateSpot,
    getUserRatingForSpot,
  } = useApp();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [reviewSort, setReviewSort] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!selectedSpot) return null;

  const handleCopyAddress = () => {
    if (navigator.clipboard && selectedSpot) {
      navigator.clipboard.writeText(
        `${selectedSpot.name}, ${selectedSpot.address}, ${selectedSpot.neighborhood}, ${selectedSpot.city}`
      );
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const isFavorite = saved.favorites.includes(selectedSpot.id);
  const isWantToTry = saved.wantToTry.includes(selectedSpot.id);

  const distanceKm = calculateDistanceKm(
    userLocation.lat,
    userLocation.lng,
    selectedSpot.lat,
    selectedSpot.lng
  );

  // Spot reviews
  const spotReviews = reviews
    .filter((r) => r.spotId === selectedSpot.id)
    .sort((a, b) => {
      if (reviewSort === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (reviewSort === 'highest') {
        return b.rating - a.rating;
      }
      if (reviewSort === 'lowest') {
        return a.rating - b.rating;
      }
      return 0;
    });

  const myReview = user
    ? reviews.find((r) => r.spotId === selectedSpot.id && r.userId === user.id)
    : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedSpot.name} — MatchApp`,
        text: `Descubre ${selectedSpot.name} en MatchApp, el mejor matcha de ${selectedSpot.city}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `${selectedSpot.name} en ${selectedSpot.address} - MatchApp`
      );
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.lat},${selectedSpot.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#F6F1E7] overflow-y-auto max-w-md mx-auto animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Top Floating Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50 flex items-center justify-between p-3.5 pointer-events-none">
        <button
          type="button"
          id="detail-back-btn"
          onClick={closeSpotDetail}
          className="pointer-events-auto w-10 h-10 rounded-full bg-[#FFFDF8]/90 text-[#4F6340] backdrop-blur-md shadow-md flex items-center justify-center hover:bg-[#FFFDF8] transition-all active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            id="detail-share-btn"
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-[#FFFDF8]/90 text-[#4F6340] backdrop-blur-md shadow-md flex items-center justify-center hover:bg-[#FFFDF8] transition-all active:scale-95"
            title={t.share}
            aria-label="Compartir"
          >
            <Share2 size={17} />
          </button>

          <button
            type="button"
            id={`detail-try-btn-${selectedSpot.id}`}
            onClick={() => toggleWantToTry(selectedSpot.id)}
            className={`w-10 h-10 rounded-full backdrop-blur-md shadow-md flex items-center justify-center transition-all active:scale-95 ${
              isWantToTry
                ? 'bg-[#A8B98A] text-[#FFFDF8]'
                : 'bg-[#FFFDF8]/90 text-[#4F6340] hover:bg-[#FFFDF8]'
            }`}
            title={t.wantToTry}
            aria-label="Por probar"
          >
            <Bookmark size={18} fill={isWantToTry ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            id={`detail-fav-btn-${selectedSpot.id}`}
            onClick={() => toggleFavorite(selectedSpot.id)}
            className={`w-10 h-10 rounded-full backdrop-blur-md shadow-md flex items-center justify-center transition-all active:scale-95 ${
              isFavorite
                ? 'bg-[#E8C9C0] text-rose-700'
                : 'bg-[#FFFDF8]/90 text-[#4F6340] hover:bg-[#FFFDF8]'
            }`}
            title={t.addToFavorites}
            aria-label="Favorito"
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Share Toast */}
      {copiedShare && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#4F6340] text-[#FFFDF8] text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
          {language === 'es' ? '¡Enlace copiado al portapapeles!' : 'Link copied to clipboard!'}
        </div>
      )}

      {/* Hero Photo Gallery */}
      <div className="relative aspect-4/3 w-full bg-[#E9DFCB]">
        <img
          src={selectedSpot.photos[activePhotoIndex]}
          alt={selectedSpot.name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Gallery pagination thumbnails */}
        {selectedSpot.photos.length > 1 && (
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-center gap-2">
            {selectedSpot.photos.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActivePhotoIndex(i)}
                className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all shadow-md ${
                  activePhotoIndex === i
                    ? 'border-[#FFFDF8] scale-110'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Spot Details Card Container */}
      <div className="-mt-6 relative z-10 bg-[#FFFDF8] rounded-t-3xl border-t border-[#E9DFCB] p-5 space-y-5 pb-32">
        {/* Title & Ratings Overview */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                selectedSpot.isOpenNow
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {selectedSpot.isOpenNow ? t.openBadge : t.closedBadge}
            </span>
            <span className="text-xs font-semibold text-[#4F6340]/70 bg-[#F6F1E7] px-2 py-0.5 rounded-full">
              {selectedSpot.priceLevel}
            </span>
            <span className="text-xs text-[#4F6340]/70 flex items-center gap-1">
              <MapPin size={12} className="text-[#A8B98A]" />
              {formatDistance(distanceKm)}
            </span>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#4F6340] leading-tight">
            {selectedSpot.name}
          </h1>

          <p className="text-xs font-medium text-[#A8B98A] mt-1">
            {selectedSpot.tagline}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <RatingStars rating={selectedSpot.avgRating} size={16} />
            <span className="text-sm font-bold text-[#4F6340]">
              {selectedSpot.avgRating.toFixed(1)}
            </span>
            <span className="text-xs text-[#4F6340]/60">
              · {selectedSpot.reviewCount} {t.reviews}
            </span>
          </div>

          {selectedSpot.featuredMatchaOrigin && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A8B98A]/20 text-[#4F6340] text-xs font-semibold">
              <Sparkles size={13} className="text-[#D9B25F]" />
              <span>Origen: {selectedSpot.featuredMatchaOrigin}</span>
            </div>
          )}
        </div>

        {/* Action Buttons: Directions, Call, Instagram */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            id="detail-directions-action-btn"
            onClick={openDirections}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#4F6340] text-[#FFFDF8] hover:bg-[#3C4D30] transition-colors shadow-xs"
          >
            <Compass size={18} />
            <span className="text-xs font-bold mt-1">{t.directions}</span>
          </button>

          <a
            id="detail-call-action-btn"
            href={`tel:${selectedSpot.phone}`}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F6F1E7] text-[#4F6340] hover:bg-[#E9DFCB] transition-colors border border-[#E9DFCB]"
          >
            <Phone size={18} />
            <span className="text-xs font-semibold mt-1">{t.call}</span>
          </a>

          {selectedSpot.instagram ? (
            <a
              id="detail-instagram-action-btn"
              href={`https://instagram.com/${selectedSpot.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F6F1E7] text-[#4F6340] hover:bg-[#E9DFCB] transition-colors border border-[#E9DFCB]"
            >
              <Instagram size={18} />
              <span className="text-xs font-semibold mt-1">{t.instagram}</span>
            </a>
          ) : selectedSpot.website ? (
            <a
              id="detail-website-action-btn"
              href={selectedSpot.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F6F1E7] text-[#4F6340] hover:bg-[#E9DFCB] transition-colors border border-[#E9DFCB]"
            >
              <Globe size={18} />
              <span className="text-xs font-semibold mt-1">{t.website}</span>
            </a>
          ) : (
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F6F1E7] text-[#4F6340]/40 border border-[#E9DFCB]">
              <Globe size={18} />
              <span className="text-xs mt-1">N/D</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#4F6340]/70">
            {language === 'es' ? 'Sobre este templo de té' : 'About this space'}
          </h2>
          <p className="text-sm text-[#4F6340] leading-relaxed font-normal">
            {selectedSpot.description}
          </p>
        </div>

        {/* Matcha Quality & Craft Sheet */}
        <div className="p-4 bg-linear-to-br from-[#F4EFE6] to-[#EBE3D3] rounded-3xl border border-[#D9CEBF] space-y-3">
          <div className="flex items-center justify-between border-b border-[#D9CEBF]/60 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#4F6340] text-[#FFFDF8] flex items-center justify-center">
                <ChasenIcon size={15} />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-[#2C3826]">
                  {language === 'es' ? 'Ficha de Calidad Matcha' : 'Matcha Quality Sheet'}
                </h3>
                <p className="text-[10px] text-[#5D6B53]">
                  {language === 'es' ? 'Verificado por la comunidad MatchApp' : 'Verified by the MatchApp community'}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#4F6340] text-[#FFFDF8]">
              {selectedSpot.tags.includes('ceremonial') ? 'Grado Ceremonial' : 'Matcha Premium'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#FFFDF8]/80 p-2.5 rounded-2xl border border-[#E9DFCB]">
              <span className="text-[10px] text-[#5D6B53] font-semibold uppercase tracking-wider block">
                {language === 'es' ? 'Terroir & Origen' : 'Terroir & Origin'}
              </span>
              <span className="font-bold text-[#2C3826] mt-0.5 block">
                {selectedSpot.featuredMatchaOrigin || 'Uji / Kioto (Japón)'}
              </span>
            </div>

            <div className="bg-[#FFFDF8]/80 p-2.5 rounded-2xl border border-[#E9DFCB]">
              <span className="text-[10px] text-[#5D6B53] font-semibold uppercase tracking-wider block">
                {language === 'es' ? 'Método de Preparación' : 'Preparation Method'}
              </span>
              <span className="font-bold text-[#2C3826] mt-0.5 block">
                Chasen de bambú (100 púas)
              </span>
            </div>

            <div className="bg-[#FFFDF8]/80 p-2.5 rounded-2xl border border-[#E9DFCB]">
              <span className="text-[10px] text-[#5D6B53] font-semibold uppercase tracking-wider block">
                {language === 'es' ? 'Opciones de Leche' : 'Milk Alternatives'}
              </span>
              <span className="font-bold text-[#2C3826] mt-0.5 block">
                Avena Barista, Soja, Entera
              </span>
            </div>

            <div className="bg-[#FFFDF8]/80 p-2.5 rounded-2xl border border-[#E9DFCB]">
              <span className="text-[10px] text-[#5D6B53] font-semibold uppercase tracking-wider block">
                {language === 'es' ? 'Perfil de Sabor' : 'Flavor Profile'}
              </span>
              <span className="font-bold text-[#2C3826] mt-0.5 block">
                Umami sedoso, baja astringencia
              </span>
            </div>
          </div>
        </div>

        {/* Location & Opening Hours */}
        <div className="p-4 bg-[#F6F1E7] rounded-2xl border border-[#E9DFCB] space-y-3">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5 min-w-0">
              <MapPin size={17} className="text-[#A8B98A] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#4F6340]">
                  {selectedSpot.address}
                </p>
                <p className="text-[11px] text-[#4F6340]/70">
                  {selectedSpot.neighborhood}, {selectedSpot.postalCode} {selectedSpot.city}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="detail-copy-address-btn"
              onClick={handleCopyAddress}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 shrink-0 transition-all ${
                copiedAddress
                  ? 'bg-emerald-600 text-[#FFFDF8] border-emerald-600'
                  : 'bg-[#FFFDF8] text-[#4F6340] border-[#E9DFCB] hover:bg-[#E9DFCB]/60'
              }`}
              title="Copiar dirección"
            >
              {copiedAddress ? <Check size={14} /> : <Copy size={14} />}
              <span className="text-[11px]">
                {copiedAddress ? (language === 'es' ? '¡Copiada!' : 'Copied!') : (language === 'es' ? 'Copiar' : 'Copy')}
              </span>
            </button>
          </div>

          <div className="flex items-start gap-2.5 pt-2 border-t border-[#E9DFCB]/60">
            <Clock size={17} className="text-[#A8B98A] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-[#4F6340] block">{t.openingHours}</span>
              {selectedSpot.openingHours.map((schedule, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 text-[#4F6340]/80">
                  <span>{schedule.day}</span>
                  <span className="font-medium">{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags & Specialties */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#4F6340]/70">
            {language === 'es' ? 'Especialidades & Servicios' : 'Tags & Specialties'}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {selectedSpot.tags.map((tagKey) => {
              const def = TAG_DEFINITIONS[tagKey];
              if (!def) return null;
              return (
                <span
                  key={tagKey}
                  className="text-xs px-3 py-1 rounded-full bg-[#FFFDF8] border border-[#E9DFCB] text-[#4F6340] font-medium flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{def.emoji}</span>
                  <span>{language === 'es' ? def.labelEs : def.labelEn}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Ratings Breakdown (5 to 1 star histogram) */}
        <div className="p-4 bg-[#FFFDF8] rounded-2xl border border-[#E9DFCB] space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#4F6340]/70">
            {t.ratingBreakdown}
          </h2>

          <div className="flex items-center gap-4">
            <div className="text-center shrink-0">
              <span className="font-serif text-3xl font-bold text-[#4F6340] block">
                {selectedSpot.avgRating.toFixed(1)}
              </span>
              <RatingStars rating={selectedSpot.avgRating} size={13} />
              <span className="text-[10px] text-[#4F6340]/60 block mt-0.5">
                {selectedSpot.reviewCount} {t.reviews}
              </span>
            </div>

            {/* Histogram bars */}
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count =
                  selectedSpot.ratingBreakdown[stars as 1 | 2 | 3 | 4 | 5] || 0;
                const total = selectedSpot.reviewCount || 1;
                const percentage = Math.round((count / total) * 100);

                return (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-[11px] font-semibold text-[#4F6340]/70">
                      {stars}
                    </span>
                    <div className="flex-1 h-2 bg-[#F6F1E7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#A8B98A] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-6 text-[10px] text-[#4F6340]/60 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews Feed Header & Sorting */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#4F6340]">
                {t.communityReviews}
              </h2>
              <p className="text-xs text-[#4F6340]/60">
                {spotReviews.length} {t.reviews}
              </p>
            </div>

            {/* Sort reviews dropdown */}
            <select
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value as any)}
              className="text-xs bg-[#F6F1E7] text-[#4F6340] font-medium border border-[#E9DFCB] rounded-xl px-2 py-1 outline-none"
            >
              <option value="newest">{t.sortReviewsNewest}</option>
              <option value="highest">{t.sortReviewsHighest}</option>
              <option value="lowest">{t.sortReviewsLowest}</option>
            </select>
          </div>

          {/* Quick 5-Star Rating Widget */}
          {(() => {
            const currentStar = getUserRatingForSpot(selectedSpot.id);
            return (
              <div className="p-3.5 mb-3 rounded-2xl bg-[#FFFDF8] border border-[#E9DFCB] flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#3B4D31]">
                    {currentStar
                      ? (language === 'es' ? `Tu calificación: ${currentStar} estrellas` : `Your rating: ${currentStar} stars`)
                      : (language === 'es' ? '¿Has probado su matcha?' : 'Tried their matcha?')}
                  </span>
                  <span className="text-[10px] text-[#7B8A6F]">
                    {language === 'es' ? 'Toca las estrellas para calificar' : 'Tap stars to give your rating'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      id={`detail-star-${star}`}
                      onClick={() => rateSpot(selectedSpot.id, star)}
                      className="p-1 hover:scale-125 transition-transform"
                      title={`${star} estrellas`}
                    >
                      <Star
                        size={20}
                        className={
                          currentStar && star <= currentStar
                            ? 'text-[#D9B25F] fill-[#D9B25F]'
                            : 'text-[#D5DCBF] hover:text-[#D9B25F]'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* User's own review section or call-to-action */}
          {myReview ? (
            <div className="p-3 mb-4 rounded-2xl bg-[#A8B98A]/15 border border-[#A8B98A]/30">
              <div className="flex items-center justify-between text-xs font-semibold text-[#4F6340] mb-1">
                <span>{language === 'es' ? 'Tu reseña publicada' : 'Your posted review'}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openReviewModal(selectedSpot, myReview)}
                    className="flex items-center gap-1 text-[#4F6340] hover:underline"
                  >
                    <Edit3 size={13} />
                    <span>{language === 'es' ? 'Editar' : 'Edit'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteReview(myReview.id)}
                    className="flex items-center gap-1 text-rose-700 hover:underline"
                  >
                    <Trash2 size={13} />
                    <span>{language === 'es' ? 'Borrar' : 'Delete'}</span>
                  </button>
                </div>
              </div>
              <RatingStars rating={myReview.rating} size={14} />
              <p className="text-xs text-[#4F6340] mt-1.5">{myReview.text}</p>
            </div>
          ) : (
            <button
              type="button"
              id="write-review-hero-btn"
              onClick={() => {
                if (!user) {
                  openAuthModal();
                } else {
                  openReviewModal(selectedSpot);
                }
              }}
              className="w-full py-3 mb-4 rounded-2xl bg-[#4F6340] text-[#FFFDF8] hover:bg-[#3C4D30] font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Plus size={16} />
              <span>{t.writeReviewBtn}</span>
            </button>
          )}

          {/* Review items */}
          <div className="space-y-3">
            {spotReviews.map((rev) => {
              const hasLiked = user ? rev.helpfulUserIds.includes(user.id) : false;

              return (
                <div
                  key={rev.id}
                  className="p-4 bg-[#FFFDF8] rounded-2xl border border-[#E9DFCB] space-y-2.5 shadow-2xs"
                >
                  {/* Review header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-9 h-9 rounded-full object-cover border border-[#E9DFCB]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#4F6340] block">
                          {rev.userName}
                        </span>
                        <span className="text-[10px] text-[#4F6340]/60">
                          {new Date(rev.createdAt).toLocaleDateString(
                            language === 'es' ? 'es-ES' : 'en-US',
                            { year: 'numeric', month: 'short', day: 'numeric' }
                          )}
                        </span>
                      </div>
                    </div>

                    <RatingStars rating={rev.rating} size={14} />
                  </div>

                  {/* Sub-ratings breakdown if present */}
                  {rev.subRatings && (
                    <div className="grid grid-cols-2 gap-1 py-1 px-2 bg-[#F6F1E7] rounded-xl text-[11px] text-[#4F6340]">
                      <div>
                        <span className="text-[#4F6340]/70">{t.matchaQuality}: </span>
                        <span className="font-bold">★ {rev.subRatings.matcha}</span>
                      </div>
                      <div>
                        <span className="text-[#4F6340]/70">{t.ambience}: </span>
                        <span className="font-bold">★ {rev.subRatings.ambience}</span>
                      </div>
                      <div>
                        <span className="text-[#4F6340]/70">{t.valueForMoney}: </span>
                        <span className="font-bold">★ {rev.subRatings.value}</span>
                      </div>
                      <div>
                        <span className="text-[#4F6340]/70">{t.service}: </span>
                        <span className="font-bold">★ {rev.subRatings.service}</span>
                      </div>
                    </div>
                  )}

                  {/* Review text */}
                  <p className="text-xs text-[#4F6340] leading-relaxed">
                    {rev.text}
                  </p>

                  {/* Photos attached */}
                  {rev.photos && rev.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {rev.photos.map((img, i) => (
                        <div
                          key={i}
                          className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E9DFCB]"
                        >
                          <img
                            src={img}
                            alt="Foto de la reseña"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Review footer: Helpful & Report */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#E9DFCB]/50 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        if (!user) openAuthModal();
                        else toggleHelpfulReview(rev.id);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors ${
                        hasLiked
                          ? 'bg-[#A8B98A]/25 text-[#4F6340] font-bold'
                          : 'text-[#4F6340]/70 hover:bg-[#F6F1E7]'
                      }`}
                    >
                      <ThumbsUp size={13} fill={hasLiked ? 'currentColor' : 'none'} />
                      <span>
                        {t.helpful} ({rev.helpfulCount})
                      </span>
                    </button>

                    {rev.reported ? (
                      <span className="text-[11px] text-amber-700 font-medium">
                        {t.reportedBadge}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => reportReview(rev.id)}
                        className="text-[11px] text-[#4F6340]/50 hover:text-rose-600 flex items-center gap-1 transition-colors"
                      >
                        <Flag size={12} />
                        <span>{t.report}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
