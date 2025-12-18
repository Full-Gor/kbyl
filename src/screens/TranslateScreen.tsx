import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, AMAZIGH_SYMBOL } from '../utils/theme';
import { useApp } from '../context/AppContext';
import LanguageSelector from '../components/LanguageSelector';
import TifinaghKeyboard from '../components/TifinaghKeyboard';
import EntryCard from '../components/EntryCard';
import {
  translate,
  searchDictionary,
  getLanguageInfo,
  containsTifinagh
} from '../services/translationService';
import { DictionaryEntry, TranslationResult } from '../types';

export default function TranslateScreen() {
  const {
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang,
    swapLanguages,
    kabyleAlphabet,
    toggleKabyleAlphabet,
    addToHistory
  } = useApp();

  const [sourceText, setSourceText] = useState('');
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [suggestions, setSuggestions] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTifinaghKeyboard, setShowTifinaghKeyboard] = useState(false);

  // Auto-translate on text change
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
        // Add to history
        if (result.translation) {
          addToHistory(
            sourceText,
            result.translation,
            sourceLang,
            targetLang,
            result.entry
          );
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
      translation
    });
    setSuggestions([]);

    addToHistory(
      entry[sourceLang],
      translation,
      sourceLang,
      targetLang,
      entry
    );
  };

  const handleClear = () => {
    setSourceText('');
    setTranslationResult(null);
    setSuggestions([]);
  };

  const handleTifinaghKeyPress = (char: string) => {
    setSourceText(prev => prev + char);
  };

  const handleTifinaghBackspace = () => {
    setSourceText(prev => prev.slice(0, -1));
  };

  const handleTifinaghSpace = () => {
    setSourceText(prev => prev + ' ');
  };

  const sourceInfo = getLanguageInfo(sourceLang);
  const targetInfo = getLanguageInfo(targetLang);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSymbol}>{AMAZIGH_SYMBOL}</Text>
          <Text style={styles.headerTitle}>Kabyle</Text>
          <TouchableOpacity
            style={styles.alphabetToggle}
            onPress={toggleKabyleAlphabet}
          >
            <Text style={styles.alphabetToggleText}>
              {kabyleAlphabet === 'latin' ? 'ⵣ' : 'A'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Language Selectors */}
          <View style={styles.languageRow}>
            <View style={styles.langSelector}>
              <LanguageSelector
                selectedLanguage={sourceLang}
                onSelectLanguage={setSourceLang}
                excludeLanguage={targetLang}
              />
            </View>

            <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
              <Text style={styles.swapIcon}>⇄</Text>
            </TouchableOpacity>

            <View style={styles.langSelector}>
              <LanguageSelector
                selectedLanguage={targetLang}
                onSelectLanguage={setTargetLang}
                excludeLanguage={sourceLang}
              />
            </View>
          </View>

          {/* Source Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>{sourceInfo.nativeName}</Text>
              {sourceText.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                  <Text style={styles.clearButton}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={[
                styles.textInput,
                sourceInfo.direction === 'rtl' && styles.rtlInput
              ]}
              placeholder={`Saisir en ${sourceInfo.name}...`}
              placeholderTextColor={COLORS.textLight}
              value={sourceText}
              onChangeText={setSourceText}
              multiline
              textAlignVertical="top"
              textAlign={sourceInfo.direction === 'rtl' ? 'right' : 'left'}
            />
            {(sourceLang === 'kab_tifinagh' || sourceLang === 'kab_latin') && (
              <TouchableOpacity
                style={styles.tifinaghButton}
                onPress={() => setShowTifinaghKeyboard(true)}
              >
                <Text style={styles.tifinaghButtonText}>ⵣ Tifinagh</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Translation Result */}
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>{targetInfo.nativeName}</Text>

            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : translationResult?.exactMatch && translationResult.translation ? (
              <View>
                <Text
                  style={[
                    styles.resultText,
                    targetInfo.direction === 'rtl' && styles.rtlText
                  ]}
                >
                  {translationResult.translation}
                </Text>
                {translationResult.entry && (
                  <View style={styles.entryDetails}>
                    <Text style={styles.phoneticText}>
                      /{translationResult.entry.phonetic}/
                    </Text>
                    <Text style={styles.usageText}>
                      {translationResult.entry.usage}
                    </Text>
                  </View>
                )}
              </View>
            ) : translationResult?.found === false && sourceText.trim() ? (
              <Text style={styles.notFoundText}>
                Traduction non trouvée dans le dictionnaire
              </Text>
            ) : (
              <Text style={styles.placeholderText}>
                La traduction apparaîtra ici
              </Text>
            )}
          </View>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Suggestions:</Text>
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

        {/* Tifinagh Keyboard Modal */}
        <TifinaghKeyboard
          visible={showTifinaghKeyboard}
          onClose={() => setShowTifinaghKeyboard(false)}
          onKeyPress={handleTifinaghKeyPress}
          onBackspace={handleTifinaghBackspace}
          onSpace={handleTifinaghSpace}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  keyboardView: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.primary
  },
  headerSymbol: {
    fontSize: FONTS.sizes.xxxl,
    color: COLORS.accent,
    marginRight: SPACING.sm
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textOnPrimary,
    flex: 1
  },
  alphabetToggle: {
    backgroundColor: COLORS.accent,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center'
  },
  alphabetToggleText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: SPACING.md
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg
  },
  langSelector: {
    flex: 1
  },
  swapButton: {
    backgroundColor: COLORS.secondary,
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.sm,
    ...SHADOWS.md
  },
  swapIcon: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.textOnPrimary,
    fontWeight: FONTS.weights.bold
  },
  inputContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  inputLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium
  },
  clearButton: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    padding: SPACING.xs
  },
  textInput: {
    minHeight: 100,
    fontSize: FONTS.sizes.xl,
    color: COLORS.text,
    textAlignVertical: 'top'
  },
  rtlInput: {
    textAlign: 'right'
  },
  tifinaghButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary + '15',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm
  },
  tifinaghButtonText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold
  },
  resultContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    minHeight: 120,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    ...SHADOWS.sm
  },
  resultLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
    marginBottom: SPACING.sm
  },
  resultText: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium
  },
  rtlText: {
    textAlign: 'right'
  },
  entryDetails: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider
  },
  phoneticText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.secondary,
    fontStyle: 'italic'
  },
  usageText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs
  },
  notFoundText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    fontStyle: 'italic'
  },
  placeholderText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textLight,
    fontStyle: 'italic'
  },
  suggestionsContainer: {
    marginTop: SPACING.md
  },
  suggestionsTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.md
  }
});
