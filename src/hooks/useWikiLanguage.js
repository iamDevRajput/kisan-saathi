'use client'
import { useState, useEffect } from 'react'

export function useWikiLanguage() {
  const [lang, setLang] = useState('hi')

  useEffect(() => {
    const saved = localStorage.getItem('wiki_lang')
    if (saved) {
      setLang(saved)
    }
  }, [])

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'hi' : 'en'
    setLang(newLang)
    localStorage.setItem('wiki_lang', newLang)
  }

  return { lang, toggleLang, isHindi: lang === 'hi' }
}
