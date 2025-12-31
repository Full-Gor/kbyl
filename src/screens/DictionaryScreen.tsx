import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import EntryCard from '../components/EntryCard';
import {
  getCategories,
  searchDictionary,
  getEntriesByCategory
} from '../services/translationService';
import { Category, DictionaryEntry } from '../types';

const { width } = Dimensions.get('window');

// Inline styles matching the glassmorphism/gradient design
const inlineStyles = {
  container: {
    flex: 1,
    backgroundColor: '#43A047',
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700' as const,
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
  headerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  clearButton: {
    padding: 8,
  },
  clearIcon: {
    fontSize: 16,
    color: '#999',
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
  categoryRow: {
    justifyContent: 'space-between' as const,
  },
  categoryCard: {
    width: (width - 48) / 2,
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
  categoryIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#43A047',
    marginBottom: 4,
  },
  categoryNameFr: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  categoryCount: {
    fontSize: 11,
    color: '#999',
    backgroundColor: 'rgba(67, 160, 71, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start' as const,
  },
  categoryArrow: {
    position: 'absolute' as const,
    right: 16,
    top: 16,
    fontSize: 24,
    color: 'rgba(67, 160, 71, 0.4)',
  },
  emptyContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 20,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center' as const,
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
};

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
      style={inlineStyles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <Text style={inlineStyles.categoryArrow}>›</Text>
      <Text style={inlineStyles.categoryIcon}>{item.icon}</Text>
      <Text style={inlineStyles.categoryName}>{getCategoryName(item)}</Text>
      <Text style={inlineStyles.categoryNameFr}>{item.name.fr}</Text>
      <Text style={inlineStyles.categoryCount}>
        {item.entries.length} mots
      </Text>
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
    <View style={inlineStyles.container}>
      <LinearGradient
        colors={['#43A047', '#2E7D32', '#1B5E20']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={inlineStyles.gradientBackground}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          {/* Header */}
          <View style={inlineStyles.header}>
            <View style={inlineStyles.headerRow}>
              {selectedCategory ? (
                <View style={inlineStyles.headerLeft}>
                  <TouchableOpacity
                    style={inlineStyles.backButton}
                    onPress={handleBackToCategories}
                    activeOpacity={0.7}
                  >
                    <Text style={inlineStyles.backIcon}>‹</Text>
                  </TouchableOpacity>
                  <Text style={inlineStyles.headerIcon}>{selectedCategory.icon}</Text>
                  <View>
                    <Text style={inlineStyles.headerTitle}>
                      {getCategoryName(selectedCategory)}
                    </Text>
                    <Text style={inlineStyles.headerSubtitle}>
                      {selectedCategory.entries.length} mots
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={inlineStyles.headerLeft}>
                  <Text style={inlineStyles.amazighSymbol}>ⵣ</Text>
                  <View>
                    <Text style={inlineStyles.headerTitle}>Amawal</Text>
                    <Text style={inlineStyles.headerSubtitle}>Dictionnaire Kabyle</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Search Bar */}
          <View style={inlineStyles.searchContainer}>
            <View style={inlineStyles.searchBox}>
              <Text style={inlineStyles.searchIcon}>🔍</Text>
              <TextInput
                style={inlineStyles.searchInput}
                placeholder="Rechercher un mot..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={inlineStyles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={inlineStyles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Content */}
          <View style={inlineStyles.contentContainer}>
            {searchQuery.trim() ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={renderSearchResult}
                contentContainerStyle={inlineStyles.listContent}
                ListEmptyComponent={
                  <View style={inlineStyles.emptyContainer}>
                    <Text style={inlineStyles.emptyIcon}>🔍</Text>
                    <Text style={inlineStyles.emptyText}>Aucun résultat trouvé</Text>
                    <Text style={inlineStyles.emptySubtext}>
                      Essayez un autre mot ou vérifiez l'orthographe
                    </Text>
                  </View>
                }
              />
            ) : selectedCategory ? (
              <FlatList
                data={categoryEntries}
                keyExtractor={(item) => item.id}
                renderItem={renderEntryItem}
                contentContainerStyle={inlineStyles.listContent}
              />
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={renderCategoryItem}
                contentContainerStyle={inlineStyles.listContent}
                numColumns={2}
                columnWrapperStyle={inlineStyles.categoryRow}
              />
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
                      categoryId={selectedCategory?.id}
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
