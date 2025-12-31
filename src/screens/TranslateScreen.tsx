import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import LanguageSelector from '../components/LanguageSelector';
import TifinaghKeyboard from '../components/TifinaghKeyboard';
import EntryCard from '../components/EntryCard';
import {
  translate,
  searchDictionary,
  getLanguageInfo,
} from '../services/translationService';
import { DictionaryEntry, TranslationResult } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TranslateScreen() {
  const {
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang,
    swapLanguages,
    kabyleAlphabet,
    toggleKabyleAlphabet,
    addToHistory,
  } = useApp();

  const [sourceText, setSourceText] = useState('');
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [suggestions, setSuggestions] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTifinaghKeyboard, setShowTifinaghKeyboard] = useState(false);
  const [swapPressed, setSwapPressed] = useState(false);
  const [togglePressed, setTogglePressed] = useState(false);

  useEffect(() => {
    if (!sourceText.trim()) {
      setTranslationResult(null);
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      performTranslation();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [sourceText, sourceLang, targetLang]);

  const performTranslation = useCallback(() => {
    if (!sourceText.trim()) return;

    setIsLoading(true);

    try {
      const result = translate(sourceText, sourceLang, targetLang);
      setTranslationResult(result);

      if (!result.exactMatch) {
        const searchResults = searchDictionary(sourceText, sourceLang);
        setSuggestions(searchResults.slice(0, 5));
      } else {
        setSuggestions([]);
        if (result.translation) {
          addToHistory(sourceText, result.translation, sourceLang, targetLang, result.entry);
        }
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sourceText, sourceLang, targetLang, addToHistory]);

  const handleSwap = () => {
    if (translationResult?.translation) {
      setSourceText(translationResult.translation);
    }
    swapLanguages();
    setTranslationResult(null);
    setSuggestions([]);
  };

  const handleSuggestionPress = (entry: DictionaryEntry) => {
    const translation = entry[targetLang];
    setTranslationResult({
      found: true,
      exactMatch: true,
      entry,
      translation,
    });
    setSuggestions([]);
    addToHistory(entry[sourceLang], translation, sourceLang, targetLang, entry);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslationResult(null);
    setSuggestions([]);
  };

  const handleTifinaghKeyPress = (char: string) => {
    setSourceText((prev) => prev + char);
  };

  const sourceInfo = getLanguageInfo(sourceLang);
  const targetInfo = getLanguageInfo(targetLang);

  // Quick phrases - Style Image 2
  const quickPhrases = [
    { label: 'Azul', color: '#4facfe' },
    { label: 'Tanamiṛt', color: '#a855f7' },
    { label: 'Amek?', color: '#f472b6' },
    { label: 'Saḥḥa', color: '#fb7185' },
  ];

  return (
    <SafeAreaView style={inlineStyles.container} edges={['top']}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={inlineStyles.gradientBackground}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={inlineStyles.keyboardView}
        >
          {/* Header - Style Dashboard Image 2 */}
          <View style={inlineStyles.header}>
            <View style={inlineStyles.headerRow}>
              <View style={inlineStyles.headerLeft}>
                <Text style={inlineStyles.amazighSymbol}>ⵣ</Text>
                <Text style={inlineStyles.headerTitle}>Kabyle</Text>
              </View>
              <Pressable
                onPressIn={() => setTogglePressed(true)}
                onPressOut={() => setTogglePressed(false)}
                onPress={toggleKabyleAlphabet}
                style={[
                  inlineStyles.alphabetToggle,
                  togglePressed && inlineStyles.alphabetTogglePressed,
                ]}
              >
                <Text style={inlineStyles.alphabetToggleText}>
                  {kabyleAlphabet === 'latin' ? 'ⵣ' : 'A'}
                </Text>
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={inlineStyles.scrollView}
            contentContainerStyle={inlineStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Quick Phrases - Pill Buttons Style Image 2 */}
            <View style={inlineStyles.quickActionsRow}>
              {quickPhrases.map((phrase, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSourceText(phrase.label)}
                  style={({ pressed }) => [
                    inlineStyles.pillButton,
                    { backgroundColor: phrase.color },
                    {
                      shadowColor: phrase.color,
                      shadowOffset: { width: 0, height: pressed ? 2 : 6 },
                      shadowOpacity: pressed ? 0.3 : 0.5,
                      shadowRadius: pressed ? 4 : 12,
                      elevation: pressed ? 4 : 10,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                    },
                  ]}
                >
                  <Text style={inlineStyles.pillButtonText}>{phrase.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Language Selectors - Glassmorphism Style */}
            <View style={inlineStyles.languageRow}>
              <View style={inlineStyles.langSelectorWrapper}>
                <View style={inlineStyles.langSelector}>
                  <LanguageSelector
                    selectedLanguage={sourceLang}
                    onSelectLanguage={setSourceLang}
                    excludeLanguage={targetLang}
                  />
                </View>
              </View>

              <Pressable
                onPressIn={() => setSwapPressed(true)}
                onPressOut={() => setSwapPressed(false)}
                onPress={handleSwap}
                style={[
                  inlineStyles.swapButton,
                  swapPressed && inlineStyles.swapButtonPressed,
                ]}
              >
                <Text style={inlineStyles.swapIcon}>⇄</Text>
              </Pressable>

              <View style={inlineStyles.langSelectorWrapper}>
                <View style={inlineStyles.langSelector}>
                  <LanguageSelector
                    selectedLanguage={targetLang}
                    onSelectLanguage={setTargetLang}
                    excludeLanguage={sourceLang}
                  />
                </View>
              </View>
            </View>

            {/* Source Input - Glass Card Style */}
            <View style={inlineStyles.inputContainer}>
              <View style={inlineStyles.inputHeader}>
                <Text style={inlineStyles.inputLabel}>{sourceInfo.nativeName}</Text>
                {sourceText.length > 0 && (
                  <TouchableOpacity style={inlineStyles.clearButton} onPress={handleClear}>
                    <Text style={inlineStyles.clearButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={[
                  inlineStyles.textInput,
                  sourceInfo.direction === 'rtl' && inlineStyles.rtlInput,
                ]}
                placeholder={`Saisir en ${sourceInfo.name}...`}
                placeholderTextColor="#94a3b8"
                value={sourceText}
                onChangeText={setSourceText}
                multiline
                textAlignVertical="top"
                textAlign={sourceInfo.direction === 'rtl' ? 'right' : 'left'}
              />
              {(sourceLang === 'kab_tifinagh' || sourceLang === 'kab_latin') && (
                <TouchableOpacity
                  style={inlineStyles.tifinaghButton}
                  onPress={() => setShowTifinaghKeyboard(true)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 18 }}>ⵣ</Text>
                  <Text style={inlineStyles.tifinaghButtonText}>Tifinagh</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Translation Result - Glass Card with accent border */}
            <View style={inlineStyles.resultContainer}>
              <Text style={inlineStyles.resultLabel}>{targetInfo.nativeName}</Text>

              {isLoading ? (
                <ActivityIndicator size="small" color="#7c3aed" />
              ) : translationResult?.exactMatch && translationResult.translation ? (
                <View>
                  <Text
                    style={[
                      inlineStyles.resultText,
                      targetInfo.direction === 'rtl' && inlineStyles.rtlText,
                    ]}
                  >
                    {translationResult.translation}
                  </Text>
                  {translationResult.entry && (
                    <View style={inlineStyles.entryDetails}>
                      <Text style={inlineStyles.phoneticText}>
                        /{translationResult.entry.phonetic}/
                      </Text>
                      <Text style={inlineStyles.usageText}>{translationResult.entry.usage}</Text>
                    </View>
                  )}
                </View>
              ) : translationResult?.found === false && sourceText.trim() ? (
                <Text style={inlineStyles.notFoundText}>
                  Traduction non trouvée dans le dictionnaire
                </Text>
              ) : (
                <Text style={inlineStyles.placeholderText}>La traduction apparaîtra ici</Text>
              )}
            </View>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <View style={inlineStyles.suggestionsContainer}>
                <Text style={inlineStyles.suggestionsTitle}>Suggestions:</Text>
                {suggestions.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    compact
                    onPress={() => handleSuggestionPress(entry)}
                  />
                ))}
              </View>
            )}
          </ScrollView>

          <TifinaghKeyboard
            visible={showTifinaghKeyboard}
            onClose={() => setShowTifinaghKeyboard(false)}
            onKeyPress={handleTifinaghKeyPress}
            onBackspace={() => setSourceText((prev) => prev.slice(0, -1))}
            onSpace={() => setSourceText((prev) => prev + ' ')}
          />
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Inline styles as JavaScript objects - matching Image 2 Dashboard style
const inlineStyles = {
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  gradientBackground: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  headerLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  amazighSymbol: {
    fontSize: 36,
    color: '#FFC107',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  alphabetToggle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  alphabetTogglePressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  alphabetToggleText: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  quickActionsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 10,
    marginBottom: 20,
  },
  pillButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pillButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  languageRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
    gap: 8,
  },
  langSelectorWrapper: {
    flex: 1,
  },
  langSelector: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  swapButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#43A047',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  swapButtonPressed: {
    transform: [{ scale: 0.9 }],
    shadowOffset: { width: 0, height: 2 },
  },
  swapIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700' as const,
  },
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  inputHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fee2e2',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600' as const,
  },
  textInput: {
    minHeight: 100,
    fontSize: 20,
    color: '#1e293b',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textAlignVertical: 'top' as const,
    lineHeight: 28,
  },
  rtlInput: {
    textAlign: 'right' as const,
  },
  tifinaghButton: {
    alignSelf: 'flex-start' as const,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#ede9fe',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  tifinaghButtonText: {
    color: '#7c3aed',
    fontWeight: '600' as const,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  resultContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#43A047',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  resultLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  resultText: {
    fontSize: 24,
    color: '#1e293b',
    fontWeight: '600' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 32,
  },
  rtlText: {
    textAlign: 'right' as const,
  },
  entryDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  phoneticText: {
    fontSize: 16,
    color: '#43A047',
    fontStyle: 'italic' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  usageText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  notFoundText: {
    fontSize: 16,
    color: '#94a3b8',
    fontStyle: 'italic' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  placeholderText: {
    fontSize: 16,
    color: '#cbd5e1',
    fontStyle: 'italic' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    marginLeft: 4,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
};
