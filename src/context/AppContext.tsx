import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  FavoriteItem,
  HistoryItem,
  AppSettings,
  Language,
  KabyleAlphabet,
  DictionaryEntry
} from '../types';
import * as StorageService from '../services/storageService';

interface AppContextType {
  // Favorites
  favorites: FavoriteItem[];
  addFavorite: (entry: DictionaryEntry, categoryId: string) => Promise<void>;
  removeFavorite: (entryId: string) => Promise<void>;
  isFavorite: (entryId: string) => boolean;

  // History
  history: HistoryItem[];
  addToHistory: (
    sourceText: string,
    translatedText: string,
    sourceLang: Language,
    targetLang: Language,
    entry?: DictionaryEntry
  ) => Promise<void>;
  clearHistory: () => Promise<void>;
  removeFromHistory: (historyId: string) => Promise<void>;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;

  // Language selection
  sourceLang: Language;
  targetLang: Language;
  setSourceLang: (lang: Language) => void;
  setTargetLang: (lang: Language) => void;
  swapLanguages: () => void;

  // Kabyle alphabet preference
  kabyleAlphabet: KabyleAlphabet;
  toggleKabyleAlphabet: () => void;

  // Loading state
  isLoading: boolean;
}

const defaultSettings: AppSettings = {
  kabyleAlphabet: 'latin',
  showPhonetic: true,
  fontSize: 'medium'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [sourceLang, setSourceLang] = useState<Language>('fr');
  const [targetLang, setTargetLang] = useState<Language>('kab_latin');
  const [kabyleAlphabet, setKabyleAlphabet] = useState<KabyleAlphabet>('latin');
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [loadedFavorites, loadedHistory, loadedSettings] = await Promise.all([
        StorageService.getFavorites(),
        StorageService.getHistory(),
        StorageService.getSettings()
      ]);

      setFavorites(loadedFavorites);
      setHistory(loadedHistory);
      setSettings(loadedSettings);
      setKabyleAlphabet(loadedSettings.kabyleAlphabet);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Favorites functions
  const addFavorite = async (entry: DictionaryEntry, categoryId: string) => {
    const updatedFavorites = await StorageService.addFavorite(entry, categoryId);
    setFavorites(updatedFavorites);
  };

  const removeFavorite = async (entryId: string) => {
    const updatedFavorites = await StorageService.removeFavorite(entryId);
    setFavorites(updatedFavorites);
  };

  const isFavorite = (entryId: string): boolean => {
    return favorites.some(fav => fav.entry.id === entryId);
  };

  // History functions
  const addToHistory = async (
    sourceText: string,
    translatedText: string,
    srcLang: Language,
    tgtLang: Language,
    entry?: DictionaryEntry
  ) => {
    const updatedHistory = await StorageService.addToHistory(
      sourceText,
      translatedText,
      srcLang,
      tgtLang,
      entry
    );
    setHistory(updatedHistory);
  };

  const clearHistory = async () => {
    await StorageService.clearHistory();
    setHistory([]);
  };

  const removeFromHistory = async (historyId: string) => {
    const updatedHistory = await StorageService.removeFromHistory(historyId);
    setHistory(updatedHistory);
  };

  // Settings functions
  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updatedSettings = await StorageService.saveSettings(newSettings);
    setSettings(updatedSettings);
    if (newSettings.kabyleAlphabet) {
      setKabyleAlphabet(newSettings.kabyleAlphabet);
    }
  };

  // Language functions
  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  // Toggle Kabyle alphabet
  const toggleKabyleAlphabet = () => {
    const newAlphabet = kabyleAlphabet === 'latin' ? 'tifinagh' : 'latin';
    setKabyleAlphabet(newAlphabet);
    updateSettings({ kabyleAlphabet: newAlphabet });

    // Update source/target lang if they are kabyle
    if (sourceLang.startsWith('kab_')) {
      setSourceLang(newAlphabet === 'latin' ? 'kab_latin' : 'kab_tifinagh');
    }
    if (targetLang.startsWith('kab_')) {
      setTargetLang(newAlphabet === 'latin' ? 'kab_latin' : 'kab_tifinagh');
    }
  };

  const value: AppContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
    settings,
    updateSettings,
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang,
    swapLanguages,
    kabyleAlphabet,
    toggleKabyleAlphabet,
    isLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
