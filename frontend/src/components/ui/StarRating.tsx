"use client";

import { FiStar } from "react-icons/fi";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  maxStars = 5,
  interactive = false,
  onRate,
  size = "md",
}: StarRatingProps) {
  const sizeClasses = { sm: "w-3 h-3", md: "w-5 h-5", lg: "w-6 h-6" };

  return (
    <div className="flex items-center space-x-0.5">
      {Array.from({ length: maxStars }, (_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(i + 1)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <FiStar
            className={`${sizeClasses[size]} ${
              i < Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
