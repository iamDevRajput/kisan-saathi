'use client'
import React from 'react'

export default function LanguageToggle({ lang, toggleLang }) {
  const isHi = lang === 'hi'
  return (
    <div className="flex bg-white/20 backdrop-blur-sm p-1 rounded-full border border-white/30 w-fit">
      <button
        onClick={() => !isHi && toggleLang()}
        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
          isHi
            ? 'bg-white text-green-800 shadow-md'
            : 'text-white hover:bg-white/10'
        }`}
      >
        🇮🇳 हिंदी
      </button>
      <button
        onClick={() => isHi && toggleLang()}
        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
          !isHi
            ? 'bg-white text-green-800 shadow-md'
            : 'text-white hover:bg-white/10'
        }`}
      >
        🇬🇧 English
      </button>
    </div>
  )
}
