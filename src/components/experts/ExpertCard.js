// src/components/experts/ExpertCard.js
'use client';
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Phone, Video, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ExpertBadge from './ExpertBadge';
import RatingStars from './RatingStars';

const ExpertCard = memo(({ expert, lang = 'en' }) => {
  const router = useRouter();
  const isHindi = lang === 'hi';
  
  const name = isHindi ? expert.nameHindi : expert.name;
  const title = isHindi ? expert.titleHindi : expert.title;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative"
    >
      {/* Online indicator & Badges */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {expert.isOnline && (
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            ONLINE
          </div>
        )}
        {expert.isKVK && <ExpertBadge type="KVK_FREE" />}
        {expert.isFeatured && !expert.isKVK && <ExpertBadge type="FEATURED" />}
      </div>

      {/* Profile Info */}
      <div className="p-5 pt-12">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img 
              src={expert.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} 
              alt={name}
              className="w-20 h-20 rounded-full object-cover border-4 border-green-50"
            />
            {expert.isVerified && (
              <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-white">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{name}</h3>
            <p className="text-sm font-medium text-green-700 mb-1">{title}</p>
            <p className="text-xs text-gray-500">{expert.organization}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 pb-4 border-b border-gray-100">
          <div>
            <RatingStars rating={expert.rating} size={14} showCount count={expert.ratingCount} />
          </div>
          <div className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
            📞 {expert.totalSessions} {isHindi ? 'सत्र' : 'sessions'}
          </div>
        </div>

        {/* Skills & Details */}
        <div className="mt-4 space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <span className="text-gray-400 mt-0.5">🌾</span>
            <p className="text-gray-600 line-clamp-1">
              {expert.crops.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
            </p>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-gray-400 mt-0.5">🗣️</span>
            <p className="text-gray-600 line-clamp-1">{expert.languages.join(', ')}</p>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-gray-400 mt-0.5">🎓</span>
            <p className="text-gray-600">{expert.experience} {isHindi ? 'वर्ष का अनुभव' : 'years experience'}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {expert.isKVK ? (
              <p className="text-green-700 font-bold text-lg">₹0<span className="text-xs text-gray-500 font-normal">/{isHindi ? 'कॉल' : 'call'}</span></p>
            ) : (
              <p className="text-gray-900 font-bold text-lg">₹{expert.pricePerCall}<span className="text-xs text-gray-500 font-normal">/{isHindi ? 'कॉल' : 'call'}</span></p>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push(`/experts/${expert.id}`)}
              className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              {isHindi ? 'प्रोफाइल देखें' : 'View Profile'}
            </button>
            <button 
              onClick={() => router.push(`/experts/booking/${expert.id}`)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors shadow-sm shadow-green-700/20"
            >
              {isHindi ? 'कॉल बुक करें' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ExpertCard.displayName = 'ExpertCard';
export default ExpertCard;
