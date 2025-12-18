import dictionary from '../data/dictionary.json';
import {
  Language,
  DictionaryEntry,
  TranslationResult,
  Dictionary,
  Category
} from '../types';

const dict = dictionary as Dictionary;

// Latin to Tifinagh mapping
const latinToTifinagh: Record<string, string> = {
  'a': 'ⴰ', 'b': 'ⴱ', 'g': 'ⴳ', 'd': 'ⴷ', 'ḍ': 'ⴹ',
  'e': 'ⴻ', 'f': 'ⴼ', 'k': 'ⴽ', 'h': 'ⵀ', 'ḥ': 'ⵃ',
  'ɛ': 'ⵄ', 'â': 'ⵄ', 'ε': 'ⵄ', 'x': 'ⵅ', 'q': 'ⵇ',
  'i': 'ⵉ', 'j': 'ⵊ', 'l': 'ⵍ', 'm': 'ⵎ', 'n': 'ⵏ',
  'u': 'ⵓ', 'r': 'ⵔ', 'ṛ': 'ⵕ', 'ɣ': 'ⵖ', 'γ': 'ⵖ',
  's': 'ⵙ', 'ṣ': 'ⵚ', 'c': 'ⵛ', 'č': 'ⵛ', 't': 'ⵜ',
  'ṭ': 'ⵟ', 'w': 'ⵡ', 'y': 'ⵢ', 'z': 'ⵣ', 'ẓ': 'ⵥ',
  'o': 'ⵓ', 'p': 'ⴱ', 'v': 'ⴼ'
};

// Tifinagh to Latin mapping (reverse)
const tifinaghToLatin: Record<string, string> = {};
Object.entries(latinToTifinagh).forEach(([latin, tifinagh]) => {
  if (!tifinaghToLatin[tifinagh]) {
    tifinaghToLatin[tifinagh] = latin;
  }
});

// Convert Latin Kabyle to Tifinagh
export function latinToTifinaghText(text: string): string {
  let result = '';
  const lowerText = text.toLowerCase();

  for (let i = 0; i < lowerText.length; i++) {
    const char = lowerText[i];
    if (latinToTifinagh[char]) {
      result += latinToTifinagh[char];
    } else if (char === ' ' || char === '\n' || char === '\t') {
      result += char;
    } else if (/[.,!?;:'"-]/.test(char)) {
      result += char;
    } else {
      result += char;
    }
  }

  return result;
}

// Convert Tifinagh to Latin Kabyle
export function tifinaghToLatinText(text: string): string {
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (tifinaghToLatin[char]) {
      result += tifinaghToLatin[char];
    } else {
      result += char;
    }
  }

  return result;
}

// Check if text contains Tifinagh characters
export function containsTifinagh(text: string): boolean {
  return /[\u2D30-\u2D7F]/.test(text);
}

// Get all entries from dictionary
export function getAllEntries(): DictionaryEntry[] {
  return dict.categories.flatMap(category => category.entries);
}

// Get all categories
export function getCategories(): Category[] {
  return dict.categories;
}

// Get category by ID
export function getCategoryById(id: string): Category | undefined {
  return dict.categories.find(cat => cat.id === id);
}

// Get Tifinagh alphabet
export function getTifinaghAlphabet() {
  return dict.alphabet.tifinagh;
}

// Normalize text for search (remove accents, lowercase)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ɛ|â|ε/g, 'a')
    .replace(/ɣ|γ/g, 'g')
    .replace(/ḍ/g, 'd')
    .replace(/ṭ/g, 't')
    .replace(/ṣ/g, 's')
    .replace(/ṛ/g, 'r')
    .replace(/ẓ/g, 'z')
    .replace(/ḥ/g, 'h')
    .trim();
}

// Search in dictionary
export function searchDictionary(
  query: string,
  sourceLang: Language
): DictionaryEntry[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = normalizeText(query);
  const entries = getAllEntries();

  // For Tifinagh input, convert to latin first
  const searchQuery = containsTifinagh(query)
    ? normalizeText(tifinaghToLatinText(query))
    : normalizedQuery;

  const results: { entry: DictionaryEntry; score: number }[] = [];

  entries.forEach(entry => {
    let score = 0;

    // Check Kabyle Latin
    const kabLatin = normalizeText(entry.kab_latin);
    if (kabLatin === searchQuery) {
      score = 100;
    } else if (kabLatin.startsWith(searchQuery)) {
      score = 80;
    } else if (kabLatin.includes(searchQuery)) {
      score = 60;
    }

    // Check other languages based on source
    const langFields: Language[] = ['fr', 'ar', 'en'];
    langFields.forEach(lang => {
      const fieldValue = normalizeText(entry[lang]);
      if (fieldValue === searchQuery) {
        score = Math.max(score, 100);
      } else if (fieldValue.startsWith(searchQuery)) {
        score = Math.max(score, 80);
      } else if (fieldValue.includes(searchQuery)) {
        score = Math.max(score, 60);
      }
    });

    // Check Tifinagh
    if (entry.kab_tifinagh.includes(query)) {
      score = Math.max(score, 90);
    }

    if (score > 0) {
      results.push({ entry, score });
    }
  });

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.map(r => r.entry);
}

// Translate function
export function translate(
  text: string,
  sourceLang: Language,
  targetLang: Language
): TranslationResult {
  if (!text || text.trim().length === 0) {
    return { found: false, exactMatch: false };
  }

  const normalizedText = normalizeText(text);
  const entries = getAllEntries();

  // Handle Tifinagh input
  const searchText = containsTifinagh(text)
    ? normalizeText(tifinaghToLatinText(text))
    : normalizedText;

  // Try exact match first
  let exactEntry: DictionaryEntry | undefined;

  for (const entry of entries) {
    const sourceValue = sourceLang === 'kab_tifinagh'
      ? normalizeText(tifinaghToLatinText(entry.kab_tifinagh))
      : normalizeText(entry[sourceLang]);

    if (sourceValue === searchText) {
      exactEntry = entry;
      break;
    }
  }

  if (exactEntry) {
    let translation = exactEntry[targetLang];

    // If target is Kabyle and user wants Tifinagh
    if (targetLang === 'kab_tifinagh') {
      translation = exactEntry.kab_tifinagh;
    } else if (targetLang === 'kab_latin') {
      translation = exactEntry.kab_latin;
    }

    return {
      found: true,
      exactMatch: true,
      entry: exactEntry,
      translation
    };
  }

  // Get suggestions for partial matches
  const suggestions = searchDictionary(text, sourceLang).slice(0, 5);

  if (suggestions.length > 0) {
    return {
      found: true,
      exactMatch: false,
      suggestions
    };
  }

  return { found: false, exactMatch: false };
}

// Get language display info
export function getLanguageInfo(lang: Language) {
  const languages = {
    kab_latin: {
      code: 'kab_latin',
      name: 'Kabyle (Latin)',
      nativeName: 'Taqbaylit',
      flag: 'ⵣ',
      direction: 'ltr' as const
    },
    kab_tifinagh: {
      code: 'kab_tifinagh',
      name: 'Kabyle (Tifinagh)',
      nativeName: 'ⵜⴰⵇⴱⴰⵢⵍⵉⵜ',
      flag: 'ⵣ',
      direction: 'ltr' as const
    },
    fr: {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      direction: 'ltr' as const
    },
    ar: {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇩🇿',
      direction: 'rtl' as const
    },
    en: {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      direction: 'ltr' as const
    }
  };

  return languages[lang];
}

// Get entries by category
export function getEntriesByCategory(categoryId: string): DictionaryEntry[] {
  const category = dict.categories.find(cat => cat.id === categoryId);
  return category ? category.entries : [];
}
