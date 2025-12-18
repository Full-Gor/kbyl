import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { DictionaryEntry, KabyleAlphabet } from '../types';
import { useApp } from '../context/AppContext';

interface EntryCardProps {
  entry: DictionaryEntry;
  categoryId?: string;
  showAllTranslations?: boolean;
  onPress?: () => void;
  compact?: boolean;
}

export default function EntryCard({
  entry,
  categoryId = '',
  showAllTranslations = true,
  onPress,
  compact = false
}: EntryCardProps) {
  const { isFavorite, addFavorite, removeFavorite, kabyleAlphabet, settings } = useApp();
  const favorite = isFavorite(entry.id);

  const handleFavoritePress = async () => {
    if (favorite) {
      await removeFavorite(entry.id);
    } else {
      await addFavorite(entry, categoryId);
    }
  };

  const kabyleText = kabyleAlphabet === 'tifinagh' ? entry.kab_tifinagh : entry.kab_latin;
  const kabyleAlt = kabyleAlphabet === 'tifinagh' ? entry.kab_latin : entry.kab_tifinagh;

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.compactContent}>
          <Text style={styles.compactKabyle}>{kabyleText}</Text>
          <Text style={styles.compactFr}>{entry.fr}</Text>
        </View>
        <TouchableOpacity
          style={styles.compactFavorite}
          onPress={handleFavoritePress}
        >
          <Text style={styles.favoriteIcon}>{favorite ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.kabyleContainer}>
          <Text style={styles.kabyleText}>{kabyleText}</Text>
          <Text style={styles.kabyleAlt}>({kabyleAlt})</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Text style={[styles.favoriteIcon, favorite && styles.favoriteActive]}>
            {favorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      {settings.showPhonetic && (
        <Text style={styles.phonetic}>/{entry.phonetic}/</Text>
      )}

      {showAllTranslations && (
        <View style={styles.translations}>
          <View style={styles.translationRow}>
            <Text style={styles.langLabel}>🇫🇷</Text>
            <Text style={styles.translationText}>{entry.fr}</Text>
          </View>

          <View style={styles.translationRow}>
            <Text style={styles.langLabel}>🇬🇧</Text>
            <Text style={styles.translationText}>{entry.en}</Text>
          </View>

          <View style={styles.translationRow}>
            <Text style={styles.langLabel}>🇩🇿</Text>
            <Text style={[styles.translationText, styles.arabicText]}>{entry.ar}</Text>
          </View>
        </View>
      )}

      {entry.usage && (
        <Text style={styles.usage}>{entry.usage}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    ...SHADOWS.sm
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  kabyleContainer: {
    flex: 1
  },
  kabyleText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary
  },
  kabyleAlt: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  favoriteButton: {
    padding: SPACING.sm
  },
  favoriteIcon: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.textLight
  },
  favoriteActive: {
    color: COLORS.accent
  },
  phonetic: {
    fontSize: FONTS.sizes.md,
    color: COLORS.secondary,
    fontStyle: 'italic',
    marginTop: SPACING.xs
  },
  translations: {
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.md
  },
  translationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  langLabel: {
    fontSize: FONTS.sizes.lg,
    width: 30
  },
  translationText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    flex: 1
  },
  arabicText: {
    textAlign: 'right',
    fontFamily: undefined // Use default Arabic-supporting font
  },
  usage: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    marginHorizontal: SPACING.md,
    ...SHADOWS.sm
  },
  compactContent: {
    flex: 1
  },
  compactKabyle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.primary
  },
  compactFr: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary
  },
  compactFavorite: {
    padding: SPACING.sm
  }
});
