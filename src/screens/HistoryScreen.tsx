import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, AMAZIGH_SYMBOL } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { getLanguageInfo } from '../services/translationService';
import { HistoryItem } from '../types';

export default function HistoryScreen() {
  const { history, clearHistory, removeFromHistory } = useApp();

  const handleClearHistory = () => {
    Alert.alert(
      'Effacer l\'historique',
      'Voulez-vous vraiment effacer tout l\'historique?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: clearHistory
        }
      ]
    );
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const sourceInfo = getLanguageInfo(item.sourceLang);
    const targetInfo = getLanguageInfo(item.targetLang);

    return (
      <View style={styles.historyItem}>
        <View style={styles.langRow}>
          <View style={styles.langBadge}>
            <Text style={styles.langFlag}>{sourceInfo.flag}</Text>
            <Text style={styles.langCode}>{sourceInfo.nativeName}</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
          <View style={styles.langBadge}>
            <Text style={styles.langFlag}>{targetInfo.flag}</Text>
            <Text style={styles.langCode}>{targetInfo.nativeName}</Text>
          </View>
        </View>

        <View style={styles.translationContent}>
          <Text
            style={[
              styles.sourceText,
              sourceInfo.direction === 'rtl' && styles.rtlText
            ]}
          >
            {item.sourceText}
          </Text>
          <View style={styles.divider} />
          <Text
            style={[
              styles.translatedText,
              targetInfo.direction === 'rtl' && styles.rtlText
            ]}
          >
            {item.translatedText}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeFromHistory(item.id)}
          >
            <Text style={styles.deleteIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSymbol}>{AMAZIGH_SYMBOL}</Text>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Amezruy</Text>
          <Text style={styles.headerSubtitle}>Historique</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearHistory}
          >
            <Text style={styles.clearButtonText}>Effacer</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📜</Text>
          <Text style={styles.emptyTitle}>Aucun historique</Text>
          <Text style={styles.emptyText}>
            Vos traductions apparaîtront ici
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.primaryDark
  },
  headerSymbol: {
    fontSize: FONTS.sizes.xxxl,
    color: COLORS.accent,
    marginRight: SPACING.sm
  },
  headerText: {
    flex: 1
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textOnPrimary
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textOnPrimary,
    opacity: 0.8
  },
  clearButton: {
    backgroundColor: COLORS.error + '30',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md
  },
  clearButtonText: {
    color: COLORS.textOnPrimary,
    fontWeight: FONTS.weights.semiBold
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 100
  },
  historyItem: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  langBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md
  },
  langFlag: {
    fontSize: FONTS.sizes.lg,
    marginRight: SPACING.xs
  },
  langCode: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary
  },
  arrow: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textLight,
    marginHorizontal: SPACING.sm
  },
  translationContent: {
    marginBottom: SPACING.md
  },
  sourceText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm
  },
  translatedText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.primary
  },
  rtlText: {
    textAlign: 'right'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: SPACING.sm
  },
  timestamp: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight
  },
  deleteButton: {
    padding: SPACING.sm
  },
  deleteIcon: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg
  },
  emptyTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textLight,
    textAlign: 'center'
  }
});
