// src/components/experts/ExpertBadge.js
'use client';
import React from 'react';

export default function ExpertBadge({ type, className = '' }) {
  const getBadgeStyle = () => {
    switch (type) {
      case 'KVK_FREE':
        return 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-sm';
      case 'VERIFIED':
        return 'bg-blue-500 text-white';
      case 'TOP_RATED':
        return 'bg-green-600 text-white';
      case 'NEW':
        return 'bg-purple-500 text-white';
      case 'FEATURED':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getBadgeLabel = () => {
    switch (type) {
      case 'KVK_FREE':
        return 'KVK FREE';
      case 'VERIFIED':
        return 'VERIFIED ✓';
      case 'TOP_RATED':
        return 'TOP RATED';
      case 'NEW':
        return 'NEW';
      case 'FEATURED':
        return 'FEATURED';
      default:
        return type;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 tracking-wider text-[10px] font-bold uppercase rounded-md ${getBadgeStyle()} ${className}`}
    >
      {getBadgeLabel()}
    </span>
  );
}
