import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, AMAZIGH_SYMBOL } from '../utils/theme';
import { useApp } from '../context/AppContext';
import EntryCard from '../components/EntryCard';
import { DictionaryEntry, FavoriteItem } from '../types';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useApp();
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

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <View style={styles.favoriteItem}>
      <EntryCard
        entry={item.entry}
        categoryId={item.categoryId}
        onPress={() => handleEntryPress(item.entry)}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.entry.id)}
      >
        <Text style={styles.removeIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSymbol}>{AMAZIGH_SYMBOL}</Text>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Imenyafen</Text>
          <Text style={styles.headerSubtitle}>Favoris</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{favorites.length}</Text>
        </View>
      </View>

      {/* Content */}
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptyText}>
            Ajoutez des mots à vos favoris en appuyant sur l'étoile ☆
          </Text>
        </View>
      )}

      {/* Entry Detail Modal */}
      <Modal
        visible={!!selectedEntry}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedEntry(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setSelectedEntry(null)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            {selectedEntry && (
              <ScrollView>
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
    backgroundColor: COLORS.accent
  },
  headerSymbol: {
    fontSize: FONTS.sizes.xxxl,
    color: COLORS.text,
    marginRight: SPACING.sm
  },
  headerText: {
    flex: 1
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    opacity: 0.7
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs
  },
  badgeText: {
    color: COLORS.textOnPrimary,
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.lg
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 100
  },
  favoriteItem: {
    position: 'relative'
  },
  removeButton: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.round,
    padding: SPACING.sm,
    ...SHADOWS.sm
  },
  removeIcon: {
    fontSize: FONTS.sizes.lg
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
    textAlign: 'center',
    lineHeight: 24
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '80%',
    paddingBottom: SPACING.xxl
  },
  modalClose: {
    alignSelf: 'flex-end',
    padding: SPACING.lg
  },
  modalCloseText: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.textSecondary
  }
});
