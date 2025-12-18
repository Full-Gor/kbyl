export type Language = 'kab_latin' | 'kab_tifinagh' | 'fr' | 'ar' | 'en';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export interface DictionaryEntry {
  id: string;
  kab_latin: string;
  kab_tifinagh: string;
  fr: string;
  ar: string;
  en: string;
  phonetic: string;
  usage: string;
}

export interface CategoryName {
  kab_latin: string;
  kab_tifinagh: string;
  fr: string;
  ar: string;
  en: string;
}

export interface Category {
  id: string;
  name: CategoryName;
  icon: string;
  entries: DictionaryEntry[];
}

export interface TifinaghLetter {
  char: string;
  latin: string;
  name: string;
  phonetic: string;
}

export interface Dictionary {
  metadata: {
    version: string;
    name: string;
    description: string;
    alphabets: string[];
  };
  categories: Category[];
  alphabet: {
    tifinagh: TifinaghLetter[];
  };
}

export interface FavoriteItem {
  id: string;
  entry: DictionaryEntry;
  categoryId: string;
  addedAt: string;
}

export interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: Language;
  targetLang: Language;
  timestamp: string;
  entry?: DictionaryEntry;
}

export interface TranslationResult {
  found: boolean;
  exactMatch: boolean;
  entry?: DictionaryEntry;
  translation?: string;
  suggestions?: DictionaryEntry[];
}

export type KabyleAlphabet = 'latin' | 'tifinagh';

export interface AppSettings {
  kabyleAlphabet: KabyleAlphabet;
  showPhonetic: boolean;
  fontSize: 'small' | 'medium' | 'large';
}
