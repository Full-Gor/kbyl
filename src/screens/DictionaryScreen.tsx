import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, AMAZIGH_SYMBOL } from '../utils/theme';
import { useApp } from '../context/AppContext';
import EntryCard from '../components/EntryCard';
import {
  getCategories,
  searchDictionary,
  getEntriesByCategory
} from '../services/translationService';
import { Category, DictionaryEntry } from '../types';

export default function DictionaryScreen() {
  const { kabyleAlphabet } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);

  const categories = getCategories();

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchDictionary(searchQuery, 'kab_latin');
  }, [searchQuery]);

  const categoryEntries = useMemo(() => {
    if (!selectedCategory) return [];
    return getEntriesByCategory(selectedCategory.id);
  }, [selectedCategory]);

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleEntryPress = (entry: DictionaryEntry) => {
    setSelectedEntry(entry);
  };

  const getCategoryName = (category: Category) => {
    return kabyleAlphabet === 'tifinagh'
      ? category.name.kab_tifinagh
      : category.name.kab_latin;
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{getCategoryName(item)}</Text>
        <Text style={styles.categoryNameFr}>{item.name.fr}</Text>
        <Text style={styles.categoryCount}>
          {item.entries.length} mots
        </Text>
      </View>
      <Text style={styles.categoryArrow}>›</Text>
    </TouchableOpacity>
  );

  const renderEntryItem = ({ item }: { item: DictionaryEntry }) => (
    <EntryCard
      entry={item}
      categoryId={selectedCategory?.id}
      onPress={() => handleEntryPress(item)}
      compact
    />
  );

  const renderSearchResult = ({ item }: { item: DictionaryEntry }) => (
    <EntryCard
      entry={item}
      onPress={() => handleEntryPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {selectedCategory ? (
          <>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToCategories}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerIcon}>{selectedCategory.icon}</Text>
              <Text style={styles.headerTitle}>
                {getCategoryName(selectedCategory)}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.headerSymbol}>{AMAZIGH_SYMBOL}</Text>
            <Text style={styles.headerTitle}>Amawal</Text>
            <Text style={styles.headerSubtitle}>Dictionnaire</Text>
          </>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un mot..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {searchQuery.trim() ? (
        // Search Results
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderSearchResult}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
              <Text style={styles.emptySubtext}>
                Essayez un autre mot ou vérifiez l'orthographe
              </Text>
            </View>
          }
        />
      ) : selectedCategory ? (
        // Category Entries
        <FlatList
          data={categoryEntries}
          keyExtractor={(item) => item.id}
          renderItem={renderEntryItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        // Categories List
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoryItem}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.categoryRow}
        />
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
                  categoryId={selectedCategory?.id}
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
    backgroundColor: COLORS.secondary
  },
  backButton: {
    marginRight: SPACING.sm,
    padding: SPACING.sm
  },
  backIcon: {
    fontSize: FONTS.sizes.xxxl,
    color: COLORS.textOnPrimary,
    fontWeight: FONTS.weights.bold
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  headerIcon: {
    fontSize: FONTS.sizes.xxl,
    marginRight: SPACING.sm
  },
  headerSymbol: {
    fontSize: FONTS.sizes.xxxl,
    color: COLORS.accent,
    marginRight: SPACING.sm
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textOnPrimary
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textOnPrimary,
    opacity: 0.8,
    marginLeft: SPACING.sm
  },
  searchContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md
  },
  searchIcon: {
    fontSize: FONTS.sizes.lg,
    marginRight: SPACING.sm
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text
  },
  clearIcon: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    padding: SPACING.sm
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 100
  },
  categoryRow: {
    justifyContent: 'space-between'
  },
  categoryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    width: '48%',
    ...SHADOWS.sm
  },
  categoryIcon: {
    fontSize: FONTS.sizes.huge,
    marginBottom: SPACING.sm
  },
  categoryInfo: {
    flex: 1
  },
  categoryName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary
  },
  categoryNameFr: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  categoryCount: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs
  },
  categoryArrow: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.textLight,
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.md
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm
  },
  emptySubtext: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    textAlign: 'center'
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
