import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../common/RatingStars';
import { SubRatings } from '../../types';
import { X, Camera, Sparkles, Check, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WriteReviewModal: React.FC = () => {
  const {
    reviewingSpot,
    editingReview,
    closeReviewModal,
    addReview,
    updateReview,
    deleteReview,
    language,
    t,
  } = useApp();

  if (!reviewingSpot) return null;

  const [rating, setRating] = useState<number>(editingReview?.rating || 5.0);
  const [text, setText] = useState<string>(editingReview?.text || '');
  const [matchaQuality, setMatchaQuality] = useState<number>(
    editingReview?.subRatings?.matcha || 5
  );
  const [ambience, setAmbience] = useState<number>(
    editingReview?.subRatings?.ambience || 5
  );
  const [valueForMoney, setValueForMoney] = useState<number>(
    editingReview?.subRatings?.value || 4
  );
  const [service, setService] = useState<number>(
    editingReview?.subRatings?.service || 5
  );
  const [photos, setPhotos] = useState<string[]>(editingReview?.photos || []);
  const [showPhotoInput, setShowPhotoInput] = useState<boolean>(false);
  const [photoUrlInput, setPhotoUrlInput] = useState<string>('');
  const [showSubRatings, setShowSubRatings] = useState<boolean>(
    Boolean(editingReview?.subRatings)
  );

  const sampleMatchaPhotos = [
    'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515823662273-ad92a691c4d0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  ];

  const maxChars = 500;
  const charsRemaining = maxChars - text.length;

  const handleAddPhoto = (url: string) => {
    if (photos.length < 3 && url.trim()) {
      setPhotos([...photos, url.trim()]);
      setPhotoUrlInput('');
      setShowPhotoInput(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const subRatings: SubRatings = showSubRatings
      ? {
          matcha: matchaQuality,
          ambience,
          value: valueForMoney,
          service,
        }
      : {
          matcha: Math.round(rating),
          ambience: Math.round(rating),
          value: Math.round(rating),
          service: Math.round(rating),
        };

    if (editingReview) {
      updateReview(editingReview.id, rating, text, subRatings, photos);
    } else {
      addReview(reviewingSpot.id, rating, text, subRatings, photos);
      // Soft celebration confetti
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#A8B98A', '#C9D3B0', '#4F6340', '#D9B25F'],
        });
      } catch (err) {
        // Fallback gracefully
      }
    }

    closeReviewModal();
  };

  const handleDelete = () => {
    if (editingReview) {
      deleteReview(editingReview.id);
      closeReviewModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FFFDF8] w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-[#E9DFCB] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#E9DFCB] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#4F6340]">
              {editingReview ? t.editReviewBtn : t.modalWriteTitle}
            </h2>
            <p className="text-xs text-[#A8B98A] font-semibold truncate max-w-[280px]">
              {reviewingSpot.name}
            </p>
          </div>

          <button
            type="button"
            onClick={closeReviewModal}
            className="w-8 h-8 rounded-full bg-[#F6F1E7] text-[#4F6340] hover:bg-[#E9DFCB] flex items-center justify-center transition-colors"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Main 1-5 Star selector with half stars */}
          <div className="text-center py-2 bg-[#F6F1E7] rounded-2xl border border-[#E9DFCB] space-y-1">
            <span className="text-xs font-semibold text-[#4F6340]/80 block">
              {t.overallRatingLabel}
            </span>
            <div className="flex items-center justify-center gap-2">
              <RatingStars
                rating={rating}
                size={26}
                interactive={true}
                onRatingChange={(newVal) => setRating(newVal)}
              />
              <span className="text-lg font-serif font-bold text-[#4F6340] min-w-[32px]">
                {rating.toFixed(1)}
              </span>
            </div>
            <p className="text-[11px] text-[#4F6340]/60">
              {language === 'es'
                ? 'Pulsa en la mitad izquierda o derecha de cada estrella para medias décimas'
                : 'Tap left or right half of each star for half-star precision'}
            </p>
          </div>

          {/* Sub-ratings toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowSubRatings(!showSubRatings)}
              className="text-xs font-semibold text-[#4F6340] flex items-center gap-1.5 hover:underline"
            >
              <Sparkles size={14} className="text-[#D9B25F]" />
              <span>{t.subRatingsOptional}</span>
              <span className="text-[11px] text-[#4F6340]/60">
                {showSubRatings ? '(Ocultar)' : '(Desplegar)'}
              </span>
            </button>

            {showSubRatings && (
              <div className="mt-2 p-3 bg-[#F6F1E7] rounded-2xl border border-[#E9DFCB] space-y-2.5">
                {/* Matcha Quality */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4F6340] font-medium">{t.matchaQuality}</span>
                  <RatingStars
                    rating={matchaQuality}
                    size={18}
                    interactive={true}
                    onRatingChange={(v) => setMatchaQuality(Math.round(v))}
                  />
                </div>

                {/* Ambience */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4F6340] font-medium">{t.ambience}</span>
                  <RatingStars
                    rating={ambience}
                    size={18}
                    interactive={true}
                    onRatingChange={(v) => setAmbience(Math.round(v))}
                  />
                </div>

                {/* Value for Money */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4F6340] font-medium">{t.valueForMoney}</span>
                  <RatingStars
                    rating={valueForMoney}
                    size={18}
                    interactive={true}
                    onRatingChange={(v) => setValueForMoney(Math.round(v))}
                  />
                </div>

                {/* Service */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4F6340] font-medium">{t.service}</span>
                  <RatingStars
                    rating={service}
                    size={18}
                    interactive={true}
                    onRatingChange={(v) => setService(Math.round(v))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Review Text Input (Max 500 chars) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="review-text-input" className="font-semibold text-[#4F6340]">
                {t.reviewTextLabel}
              </label>
              <span
                className={`text-[11px] ${
                  charsRemaining < 30 ? 'text-amber-700 font-bold' : 'text-[#4F6340]/60'
                }`}
              >
                {charsRemaining} {t.charsLeft}
              </span>
            </div>

            <textarea
              id="review-text-input"
              rows={4}
              maxLength={maxChars}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.reviewTextPlaceholder}
              className="w-full p-3 bg-[#FFFDF8] border border-[#E9DFCB] rounded-2xl text-xs text-[#4F6340] placeholder:text-[#4F6340]/40 outline-none focus:border-[#4F6340] transition-colors resize-none"
              required
            />
          </div>

          {/* Photo upload / attach simulator (up to 3 photos) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#4F6340]">{t.addPhotosLabel}</span>
              <span className="text-[#4F6340]/60 text-[11px]">
                {photos.length}/3
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {photos.map((url, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E9DFCB]"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-[#FFFDF8] flex items-center justify-center hover:bg-rose-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {photos.length < 3 && (
                <button
                  type="button"
                  id="add-photo-btn"
                  onClick={() => setShowPhotoInput(true)}
                  className="w-16 h-16 rounded-xl border border-dashed border-[#A8B98A] bg-[#F6F1E7] text-[#4F6340] flex flex-col items-center justify-center hover:bg-[#E9DFCB]/50 transition-colors"
                >
                  <Camera size={18} />
                  <span className="text-[10px] mt-0.5 font-medium">+ Foto</span>
                </button>
              )}
            </div>

            {/* Photo preset picker / Custom URL input */}
            {showPhotoInput && (
              <div className="p-3 bg-[#F6F1E7] rounded-2xl border border-[#E9DFCB] space-y-2 animate-in fade-in">
                <span className="text-[11px] font-semibold text-[#4F6340] block">
                  {language === 'es'
                    ? 'Selecciona una foto rápida o pega una URL:'
                    : 'Pick a sample photo or paste a URL:'}
                </span>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {sampleMatchaPhotos.map((sampleUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPhoto(sampleUrl)}
                      className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E9DFCB] hover:border-[#4F6340]"
                    >
                      <img src={sampleUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-[#FFFDF8] border border-[#E9DFCB] rounded-xl text-[#4F6340] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddPhoto(photoUrlInput)}
                    className="px-3 py-1.5 bg-[#4F6340] text-[#FFFDF8] rounded-xl text-xs font-semibold"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit and Delete Actions */}
          <div className="pt-2 flex items-center gap-2">
            {editingReview && (
              <button
                type="button"
                onClick={handleDelete}
                className="py-3 px-4 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title={t.deleteReview}
              >
                <Trash2 size={16} />
              </button>
            )}

            <button
              type="submit"
              id="submit-review-btn"
              disabled={!text.trim()}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#4F6340] hover:bg-[#3C4D30] text-[#FFFDF8] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              <Check size={16} />
              <span>{editingReview ? t.updateReview : t.submitReview}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
