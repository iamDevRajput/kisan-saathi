// src/components/experts/RatingStars.js
'use client';
import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RatingStars({ rating = 0, size = 16, showCount = false, count = 0 }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <motion.div whileHover={{ scale: 1.2 }} key={`full-${i}`}>
            <Star size={size} className="fill-yellow-500 text-yellow-500" />
          </motion.div>
        ))}
        {hasHalfStar && (
          <motion.div whileHover={{ scale: 1.2 }}>
            <StarHalf size={size} className="fill-yellow-500 text-yellow-500" />
          </motion.div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-300" />
        ))}
      </div>
      {showCount && (
        <span className="text-sm font-medium text-gray-600 block mt-[2px] ml-1">
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
