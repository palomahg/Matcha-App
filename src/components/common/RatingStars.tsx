import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number; // e.g. 4.8 or 5.0
  max?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
  showValue?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 18,
  interactive = false,
  onRatingChange,
  className = '',
  showValue = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleStarClick = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!interactive || !onRatingChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isHalf = clickX < rect.width / 2;
    const newRating = isHalf ? index - 0.5 : index;
    onRatingChange(newRating);
  };

  const handleMouseMove = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isHalf = clickX < rect.width / 2;
    setHoverRating(isHalf ? index - 0.5 : index);
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => interactive && setHoverRating(null)}
      >
        {Array.from({ length: max }, (_, i) => {
          const starIndex = i + 1;
          const isFull = displayRating >= starIndex;
          const isHalf = !isFull && displayRating >= starIndex - 0.5;

          if (interactive) {
            return (
              <button
                type="button"
                key={i}
                id={`rating-star-btn-${starIndex}`}
                onClick={(e) => handleStarClick(starIndex, e)}
                onMouseMove={(e) => handleMouseMove(starIndex, e)}
                className="p-1 transition-transform hover:scale-125 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4F6340] rounded-full"
                aria-label={`${starIndex} estrellas`}
              >
                <div className="relative inline-block">
                  <Star
                    size={size}
                    className="text-[#E9DFCB] fill-[#E9DFCB]"
                  />
                  {(isFull || isHalf) && (
                    <div
                      className="absolute top-0 left-0 overflow-hidden"
                      style={{ width: isHalf ? '50%' : '100%' }}
                    >
                      <Star
                        size={size}
                        className="text-[#D9B25F] fill-[#D9B25F]"
                      />
                    </div>
                  )}
                </div>
              </button>
            );
          }

          return (
            <div key={i} className="relative inline-block">
              {/* Background empty star */}
              <Star
                size={size}
                className="text-[#E9DFCB] fill-[#E9DFCB]"
              />
              {/* Foreground filled star */}
              {(isFull || isHalf) && (
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: isHalf ? '50%' : '100%' }}
                >
                  <Star
                    size={size}
                    className="text-[#D9B25F] fill-[#D9B25F]"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-semibold text-[#4F6340] ml-1 tracking-tight">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
