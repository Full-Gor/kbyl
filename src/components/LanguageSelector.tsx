import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList
} from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { Language } from '../types';
import { getLanguageInfo } from '../services/translationService';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  excludeLanguage?: Language;
  isKabyle?: boolean;
}

const languages: Language[] = ['kab_latin', 'kab_tifinagh', 'fr', 'ar', 'en'];

export default function LanguageSelector({
  selectedLanguage,
  onSelectLanguage,
  excludeLanguage,
  isKabyle = false
}: LanguageSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedInfo = getLanguageInfo(selectedLanguage);

  const availableLanguages = languages.filter(lang => {
    if (excludeLanguage) {
      // If excluding a kabyle variant, exclude both variants
      if (excludeLanguage.startsWith('kab_') && lang.startsWith('kab_')) {
        return false;
      }
      return lang !== excludeLanguage;
    }
    return true;
  });

  const handleSelect = (lang: Language) => {
    onSelectLanguage(lang);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flag}>{selectedInfo.flag}</Text>
        <View style={styles.langInfo}>
          <Text style={styles.langName}>{selectedInfo.nativeName}</Text>
          <Text style={styles.langSubName}>{selectedInfo.name}</Text>
        </View>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir la langue</Text>

            <FlatList
              data={availableLanguages}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const info = getLanguageInfo(item);
                const isSelected = item === selectedLanguage;

                return (
                  <TouchableOpacity
                    style={[
                      styles.langItem,
                      isSelected && styles.langItemSelected
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.langFlag}>{info.flag}</Text>
                    <View style={styles.langItemInfo}>
                      <Text
                        style={[
                          styles.langItemName,
                          isSelected && styles.langItemNameSelected
                        ]}
                      >
                        {info.nativeName}
                      </Text>
                      <Text style={styles.langItemSubName}>{info.name}</Text>
                    </View>
                    {isSelected && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm
  },
  flag: {
    fontSize: FONTS.sizes.xxl,
    marginRight: SPACING.sm
  },
  langInfo: {
    flex: 1
  },
  langName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text
  },
  langSubName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary
  },
  arrow: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 350,
    maxHeight: '70%',
    ...SHADOWS.lg
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md
  },
  langItemSelected: {
    backgroundColor: COLORS.primaryLight + '20'
  },
  langFlag: {
    fontSize: FONTS.sizes.xxl,
    marginRight: SPACING.md
  },
  langItemInfo: {
    flex: 1
  },
  langItemName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text
  },
  langItemNameSelected: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold
  },
  langItemSubName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary
  },
  checkmark: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.divider
  }
});
