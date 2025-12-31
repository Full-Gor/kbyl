import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import EntryCard from '../components/EntryCard';
import { DictionaryEntry, FavoriteItem } from '../types';

// Inline styles matching the glassmorphism/gradient design
const inlineStyles = {
  container: {
    flex: 1,
    backgroundColor: '#FFC107',
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
    color: '#1a1a2e',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a2e',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(26, 26, 46, 0.7)',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeText: {
    color: '#FFC107',
    fontWeight: '700' as const,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.05)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  favoriteItem: {
    position: 'relative' as const,
    marginBottom: 16,
  },
  favoriteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  removeButton: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.2)',
    zIndex: 10,
  },
  removeIcon: {
    fontSize: 18,
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
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: 'rgba(26, 26, 46, 0.9)',
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(26, 26, 46, 0.6)',
    textAlign: 'center' as const,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end' as const,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '85%',
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center' as const,
    marginTop: 12,
    marginBottom: 8,
  },
  modalClose: {
    alignSelf: 'flex-end' as const,
    padding: 16,
  },
  modalCloseText: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300' as const,
  },
  // Entry card styles within favorite
  entryKabyle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFC107',
    marginBottom: 8,
  },
  entryTranslation: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  entryPhonetic: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic' as const,
    marginTop: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start' as const,
    marginTop: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#FFC107',
    fontWeight: '600' as const,
  },
};

export default function FavoritesScreen() {
  const { favorites, removeFavorite, kabyleAlphabet } = useApp();
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);

  const handleEntryPress = (entry: DictionaryEntry) => {
    setSelectedEntry(entry);
  };

  const handleRemoveFavorite = (entryId: string) => {
    Alert.alert(
      'Supprimer des favoris',
      'Voulez-vous vraiment supprimer ce mot de vos favoris?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => removeFavorite(entryId)
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => {
    const kabyleText = kabyleAlphabet === 'tifinagh'
      ? item.entry.kab_tifinagh
      : item.entry.kab_latin;

    return (
      <View style={inlineStyles.favoriteItem}>
        <TouchableOpacity
          style={inlineStyles.favoriteCard}
          onPress={() => handleEntryPress(item.entry)}
          activeOpacity={0.8}
        >
          <Text style={inlineStyles.entryKabyle}>{kabyleText}</Text>
          <Text style={inlineStyles.entryTranslation}>🇫🇷 {item.entry.fr}</Text>
          {item.entry.ar && (
            <Text style={[inlineStyles.entryTranslation, { textAlign: 'right' }]}>
              🇸🇦 {item.entry.ar}
            </Text>
          )}
          {item.entry.en && (
            <Text style={inlineStyles.entryTranslation}>🇬🇧 {item.entry.en}</Text>
          )}
          {item.entry.phonetic && (
            <Text style={inlineStyles.entryPhonetic}>/{item.entry.phonetic}/</Text>
          )}
          {item.categoryId && (
            <View style={inlineStyles.categoryBadge}>
              <Text style={inlineStyles.categoryText}>{item.categoryId}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={inlineStyles.removeButton}
          onPress={() => handleRemoveFavorite(item.entry.id)}
        >
          <Text style={inlineStyles.removeIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={inlineStyles.container}>
      <LinearGradient
        colors={['#FFC107', '#FFD54F', '#FFEB3B']}
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
                  <Text style={inlineStyles.headerTitle}>Imenyafen</Text>
                  <Text style={inlineStyles.headerSubtitle}>Mes Favoris</Text>
                </View>
              </View>
              <View style={inlineStyles.badge}>
                <Text style={inlineStyles.badgeText}>{favorites.length}</Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={inlineStyles.contentContainer}>
            {favorites.length > 0 ? (
              <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={inlineStyles.listContent}
              />
            ) : (
              <View style={inlineStyles.emptyContainer}>
                <Text style={inlineStyles.emptyIcon}>⭐</Text>
                <Text style={inlineStyles.emptyTitle}>Aucun favori</Text>
                <Text style={inlineStyles.emptyText}>
                  Ajoutez des mots à vos favoris en appuyant sur l'étoile ☆ dans le dictionnaire
                </Text>
              </View>
            )}
          </View>

          {/* Entry Detail Modal */}
          <Modal
            visible={!!selectedEntry}
            transparent
            animationType="slide"
            onRequestClose={() => setSelectedEntry(null)}
          >
            <View style={inlineStyles.modalOverlay}>
              <View style={inlineStyles.modalContent}>
                <View style={inlineStyles.modalHandle} />
                <TouchableOpacity
                  style={inlineStyles.modalClose}
                  onPress={() => setSelectedEntry(null)}
                >
                  <Text style={inlineStyles.modalCloseText}>✕</Text>
                </TouchableOpacity>

                {selectedEntry && (
                  <ScrollView style={{ paddingHorizontal: 20 }}>
                    <EntryCard
                      entry={selectedEntry}
                      showAllTranslations
                    />
                  </ScrollView>
                )}
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
