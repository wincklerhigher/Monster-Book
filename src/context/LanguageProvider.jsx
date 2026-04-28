import { useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageContext, translations } from './Language-Context';

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lang') || 'pt';
    }
    return 'pt';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = useCallback((key) => translations[lang][key] || key, [lang]);

  const contextValue = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};