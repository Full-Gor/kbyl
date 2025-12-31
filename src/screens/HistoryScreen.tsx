import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { getLanguageInfo } from '../services/translationService';
import { HistoryItem } from '../types';

// Inline styles matching the glassmorphism/gradient design
const inlineStyles = {
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  headerLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  amazighSymbol: {
    fontSize: 36,
    color: '#FFC107',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  clearButton: {
    backgroundColor: 'rgba(229, 57, 53, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.3)',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  historyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  langRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  langBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  langFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  langCode: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500' as const,
  },
  arrow: {
    fontSize: 18,
    color: '#667eea',
    marginHorizontal: 12,
  },
  translationContent: {
    marginBottom: 16,
  },
  sourceText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    marginVertical: 12,
  },
  translatedText: {
    fontSize: 18,
    color: '#667eea',
    fontWeight: '500' as const,
  },
  rtlText: {
    textAlign: 'right' as const,
  },
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400' as const,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  deleteIcon: {
    fontSize: 14,
    color: '#E53935',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center' as const,
    lineHeight: 24,
  },
};

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
      <View style={inlineStyles.historyCard}>
        <View style={inlineStyles.langRow}>
          <View style={inlineStyles.langBadge}>
            <Text style={inlineStyles.langFlag}>{sourceInfo.flag}</Text>
            <Text style={inlineStyles.langCode}>{sourceInfo.nativeName}</Text>
          </View>
          <Text style={inlineStyles.arrow}>→</Text>
          <View style={inlineStyles.langBadge}>
            <Text style={inlineStyles.langFlag}>{targetInfo.flag}</Text>
            <Text style={inlineStyles.langCode}>{targetInfo.nativeName}</Text>
          </View>
        </View>

        <View style={inlineStyles.translationContent}>
          <Text
            style={[
              inlineStyles.sourceText,
              sourceInfo.direction === 'rtl' && inlineStyles.rtlText
            ]}
          >
            {item.sourceText}
          </Text>
          <View style={inlineStyles.divider} />
          <Text
            style={[
              inlineStyles.translatedText,
              targetInfo.direction === 'rtl' && inlineStyles.rtlText
            ]}
          >
            {item.translatedText}
          </Text>
        </View>

        <View style={inlineStyles.footer}>
          <Text style={inlineStyles.timestamp}>{formatDate(item.timestamp)}</Text>
          <TouchableOpacity
            style={inlineStyles.deleteButton}
            onPress={() => removeFromHistory(item.id)}
          >
            <Text style={inlineStyles.deleteIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={inlineStyles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={inlineStyles.gradientBackground}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          {/* Header */}
          <View style={inlineStyles.header}>
            <View style={inlineStyles.headerRow}>
              <View style={inlineStyles.headerLeft}>
                <Text style={inlineStyles.amazighSymbol}>ⵣ</Text>
                <View>
                  <Text style={inlineStyles.headerTitle}>Amezruy</Text>
                  <Text style={inlineStyles.headerSubtitle}>Historique</Text>
                </View>
              </View>
              {history.length > 0 && (
                <TouchableOpacity
                  style={inlineStyles.clearButton}
                  onPress={handleClearHistory}
                  activeOpacity={0.8}
                >
                  <Text style={inlineStyles.clearButtonText}>Effacer</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Content */}
          <View style={inlineStyles.contentContainer}>
            {history.length > 0 ? (
              <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={inlineStyles.listContent}
              />
            ) : (
              <View style={inlineStyles.emptyContainer}>
                <Text style={inlineStyles.emptyIcon}>📜</Text>
                <Text style={inlineStyles.emptyTitle}>Aucun historique</Text>
                <Text style={inlineStyles.emptyText}>
                  Vos traductions apparaîtront ici
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
