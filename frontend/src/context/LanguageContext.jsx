import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, LANGUAGES, detectLanguage, getHeroCopy } from '../i18n/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  // No visible switcher: the tagline simply follows the visitor's own browser
  // language, so an English reader sees the English tagline and a Marathi
  // reader sees Marathi - with no controls cluttering the hero.
  const [lang] = useState(() => detectLanguage());

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      meta: LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0],
      languages: LANGUAGES,
      defaultLanguage: DEFAULT_LANGUAGE,
      hero: getHeroCopy(lang)
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};