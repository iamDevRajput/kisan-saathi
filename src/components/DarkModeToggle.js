'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function DarkModeToggle({ className = '' }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`
        relative inline-flex items-center gap-2 px-3 py-2 rounded-xl
        transition-all duration-300 font-medium text-sm
        ${isDark
          ? 'bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 border border-yellow-400/20'
          : 'bg-gray-800/10 text-gray-700 hover:bg-gray-800/20 border border-gray-300 dark:border-gray-600'
        }
        ${className}
      `}
    >
      {/* Pill toggle */}
      <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${isDark ? 'bg-yellow-400' : 'bg-gray-300'}`}>
        <div
          className={`
            absolute top-0.5 w-4 h-4 rounded-full shadow-sm transition-all duration-300
            ${isDark ? 'translate-x-5 bg-gray-900' : 'translate-x-0.5 bg-white'}
          `}
        />
      </div>
      {isDark ? (
        <Moon size={14} className="text-yellow-300" />
      ) : (
        <Sun size={14} className="text-amber-500" />
      )}
      <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  )
}
