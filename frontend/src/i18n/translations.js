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

// Owner-locked brand line. Exact wording, three languages, in order:
//   1. Marathi  — शुद्ध पाणी
//   2. Hindi    — भरोसा पक्का
//   3. English  — Complete RO solutions for modern Navi Mumbai homes.
// The line is intentionally the SAME in every site language: it is the brand
// lockup, not translated body copy. Nothing else in the brand copy may be
// reworded or romanised.
const TAGLINE_LINES = [
  { text: 'शुद्ध पाणी', lang: 'mr' },
  { text: 'भरोसा पक्का', lang: 'hi' },
  { text: 'Complete RO solutions for modern Navi Mumbai homes.', lang: 'en' }
];

const TAGLINE = TAGLINE_LINES.map((line) => line.text).join(' ');

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

export function getHeroCopy() {
  return {
    ...HERO_EN,
    tagline: TAGLINE,
    taglineLines: TAGLINE_LINES
  };
}

export const getTagline = () => TAGLINE;
export const getTaglineLines = () => TAGLINE_LINES;