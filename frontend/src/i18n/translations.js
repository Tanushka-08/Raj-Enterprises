// Only the tagline is localised. Everything else on the site stays in English
// so the page never reads as a half-translated, unprofessional mix.
export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी', short: 'हिं', dir: 'ltr' },
  { code: 'mr', label: 'मराठी', short: 'मरा', dir: 'ltr' }
];

export const DEFAULT_LANGUAGE = 'en';

// Detect from the browser/OS locale. Devanagari locales are Hindi or Marathi;
// Marathi is distinguished by the 'mr' prefix (mr-IN, mr-IN-x etc).
export function detectLanguage() {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;

  const candidates = [navigator.language, ...(navigator.languages || [])]
    .filter(Boolean)
    .map((tag) => String(tag).toLowerCase());

  for (const tag of candidates) {
    if (tag.startsWith('mr')) return 'mr';
    if (tag.startsWith('hi')) return 'hi';
    if (tag.startsWith('en')) return 'en';
  }
  return DEFAULT_LANGUAGE;
}

export function isSupportedLanguage(code) {
  return LANGUAGES.some((l) => l.code === code);
}

// Written in real Devanagari vocabulary rather than transliterated English:
// no "RO" and no "solutions" in Latin-letter dress.
const TAGLINES = {
  en: 'Shuddha Paani, Bharosa Pakka — Complete RO Solutions.',
  hi: 'शुद्ध जल, पक्का भरोसा — घर के लिए पूरा जल शुद्धिकरण।',
  mr: 'शुद्ध पाणी, पक्का भरवसा — घरासाठी संपूर्ण जल शुद्धीकरण.'
};

const HERO_EN = {
  badge: "Navi Mumbai's Trusted RO Service",
  lead: 'Premium Domestic RO Water Purification Services.',
  services: 'Installation • Service • Repair • AMC',
  points: ['Navi Mumbai Service Area', 'Installation • Repair • AMC', '1 Year Warranty'],
  explore: 'Explore Products',
  book: 'Book a Service',
  whatsapp: 'WhatsApp Us',
  imageAlt: 'Home RO water purifier'
};

export function getHeroCopy(code) {
  return { ...HERO_EN, tagline: TAGLINES[code] || TAGLINES[DEFAULT_LANGUAGE] };
}

export const getTagline = (code) => TAGLINES[code] || TAGLINES[DEFAULT_LANGUAGE];