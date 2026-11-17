import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starNumber = index + 1;
        const filled = starNumber <= rating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(starNumber)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              style={{ width: size, height: size }}
              className={`${filled ? 'text-amber-400 fill-amber-400' : 'text-stone-300'}`}
            />
          </button>
        );
      })}
    </div>
  );
}
