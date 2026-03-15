'use client'
import React, { memo } from 'react'
import Link from 'next/link'

const CropCard = memo(({ crop, isHindi }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col items-center">
      <div className="w-full p-6 relative flex flex-col items-center flex-grow">
        <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
          {isHindi ? crop.seasonBadgeHindi : crop.seasonBadge}
        </div>
        
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
          {crop.emoji}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-1 text-center">
          {isHindi ? crop.nameHindi : crop.name}
        </h3>
        
        <p className="text-gray-500 text-sm mb-4 text-center">
          {isHindi ? crop.name : crop.nameHindi}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6 w-full">
          <div className="bg-gray-50 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500 mb-1">{isHindi ? 'अवधि' : 'Duration'}</div>
            <div className="font-semibold text-gray-800 text-sm">{isHindi ? crop.durationHindi : crop.duration}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500 mb-1">{isHindi ? 'पानी' : 'Water'}</div>
            <div className="font-semibold text-gray-800 text-sm">{isHindi ? crop.waterHindi : crop.water}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <div className="bg-gray-50 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500 mb-1">{isHindi ? 'कठिनाई' : 'Difficulty'}</div>
            <div className="font-semibold text-gray-800 text-sm">{isHindi ? crop.difficultyHindi : crop.difficulty}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500 mb-1">{isHindi ? 'कमाई/एकड़' : 'Profit/Acre'}</div>
            <div className="font-semibold text-green-700 text-sm">{isHindi ? crop.profitHindi : crop.profit}</div>
          </div>
        </div>

        <div className="mt-auto w-full">
          <Link
            href={`/wiki/${crop.slug}`}
            className="block w-full text-center bg-green-50 text-green-700 font-bold py-3 rounded-xl hover:bg-green-600 hover:text-white transition-colors"
          >
            {isHindi ? 'पूरी जानकारी →' : 'View Details →'}
          </Link>
        </div>
      </div>
    </div>
  )
})

CropCard.displayName = 'CropCard'
export default CropCard
