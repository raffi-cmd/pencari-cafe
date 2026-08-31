import React from "react";
import { Star } from "lucide-react";

export function StarRating({ rating = 0, size = "w-4 h-4", showValue = true, count = null }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-stone-300 dark:text-stone-700"
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className="font-bold text-xs sm:text-sm text-stone-800 dark:text-stone-200">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== null && (
        <span className="text-xs text-stone-400">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
