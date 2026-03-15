import { useState, useCallback } from 'react';

type SupportedLanguage = 'en' | 'hi' | 'pa' | 'mr' | 'gu' | 'bn' | 'te' | 'ta' | 'kn' | 'ml' | 'or' | 'ur';

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'हिंदी',
  pa: 'ਪੰਜਾਬੀ',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  bn: 'বাংলা',
  te: 'తెలుగు',
  ta: 'தமிழ்',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  or: 'ଓଡ଼ିଆ',
  ur: 'اردو',
};

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('hi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (text: string, targetLanguage: SupportedLanguage) => {
    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Translation failed');
      }

      return result.data.translatedText;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const changeLanguage = useCallback(async (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    
    // Save preference to backend
    try {
      await fetch(`/api/user/language?lang=${lang}`, {
        method: 'PUT',
      });
    } catch (err) {
      console.error('Failed to save language preference:', err);
    }
  }, []);

  return {
    currentLanguage,
    languageName: LANGUAGE_NAMES[currentLanguage],
    availableLanguages: Object.entries(LANGUAGE_NAMES).map(([code, name]) => ({
      code: code as SupportedLanguage,
      name,
    })),
    isTranslating,
    error,
    translate,
    changeLanguage,
  };
}
