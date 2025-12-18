import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteItem, HistoryItem, AppSettings, DictionaryEntry, Language } from '../types';

const FAVORITES_KEY = '@kabyle_favorites';
const HISTORY_KEY = '@kabyle_history';
const SETTINGS_KEY = '@kabyle_settings';

const MAX_HISTORY_ITEMS = 100;

// Favorites
export async function getFavorites(): Promise<FavoriteItem[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}

export async function addFavorite(
  entry: DictionaryEntry,
  categoryId: string
): Promise<FavoriteItem[]> {
  try {
    const favorites = await getFavorites();

    // Check if already exists
    const exists = favorites.some(fav => fav.entry.id === entry.id);
    if (exists) {
      return favorites;
    }

    const newFavorite: FavoriteItem = {
      id: `fav_${Date.now()}`,
      entry,
      categoryId,
      addedAt: new Date().toISOString()
    };

    const updatedFavorites = [newFavorite, ...favorites];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}

export async function removeFavorite(entryId: string): Promise<FavoriteItem[]> {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.entry.id !== entryId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}

export async function isFavorite(entryId: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.entry.id === entryId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}

// History
export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
}

export async function addToHistory(
  sourceText: string,
  translatedText: string,
  sourceLang: Language,
  targetLang: Language,
  entry?: DictionaryEntry
): Promise<HistoryItem[]> {
  try {
    const history = await getHistory();

    // Check if same translation already exists at the top
    if (history.length > 0) {
      const lastItem = history[0];
      if (
        lastItem.sourceText === sourceText &&
        lastItem.sourceLang === sourceLang &&
        lastItem.targetLang === targetLang
      ) {
        return history;
      }
    }

    const newItem: HistoryItem = {
      id: `hist_${Date.now()}`,
      sourceText,
      translatedText,
      sourceLang,
      targetLang,
      timestamp: new Date().toISOString(),
      entry
    };

    let updatedHistory = [newItem, ...history];

    // Limit history size
    if (updatedHistory.length > MAX_HISTORY_ITEMS) {
      updatedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    }

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Error adding to history:', error);
    throw error;
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
}

export async function removeFromHistory(historyId: string): Promise<HistoryItem[]> {
  try {
    const history = await getHistory();
    const updatedHistory = history.filter(item => item.id !== historyId);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Error removing from history:', error);
    throw error;
  }
}

// Settings
const defaultSettings: AppSettings = {
  kabyleAlphabet: 'latin',
  showPhonetic: true,
  fontSize: 'medium'
};

export async function getSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch (error) {
    console.error('Error getting settings:', error);
    return defaultSettings;
  }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  try {
    const currentSettings = await getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    return updatedSettings;
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}
