import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions
} from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/theme';
import { getTifinaghAlphabet } from '../services/translationService';

interface TifinaghKeyboardProps {
  visible: boolean;
  onClose: () => void;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
}

const { width } = Dimensions.get('window');
const KEY_SIZE = (width - 80) / 8;

export default function TifinaghKeyboard({
  visible,
  onClose,
  onKeyPress,
  onBackspace,
  onSpace
}: TifinaghKeyboardProps) {
  const alphabet = getTifinaghAlphabet();
  const [showLatin, setShowLatin] = useState(true);

  // Group letters into rows
  const rows = [
    alphabet.slice(0, 8),
    alphabet.slice(8, 16),
    alphabet.slice(16, 24),
    alphabet.slice(24, 31)
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} />
        <View style={styles.keyboardContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>ⵣ Tifinagh</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowLatin(!showLatin)}
            >
              <Text style={styles.toggleText}>
                {showLatin ? 'A→ⵣ' : 'ⵣ'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.keysContainer}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((letter) => (
                  <TouchableOpacity
                    key={letter.char}
                    style={styles.key}
                    onPress={() => onKeyPress(letter.char)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.keyChar}>{letter.char}</Text>
                    {showLatin && (
                      <Text style={styles.keyLatin}>{letter.latin}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionKey, styles.backspaceKey]}
                onPress={onBackspace}
              >
                <Text style={styles.actionText}>⌫</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionKey, styles.spaceKey]}
                onPress={onSpace}
              >
                <Text style={styles.actionText}>espace</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionKey, styles.doneKey]}
                onPress={onClose}
              >
                <Text style={styles.doneText}>OK</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.specialChars}>
            <Text style={styles.specialTitle}>Caractères spéciaux:</Text>
            <View style={styles.specialRow}>
              {['.', ',', '?', '!', "'", '-'].map((char) => (
                <TouchableOpacity
                  key={char}
                  style={styles.specialKey}
                  onPress={() => onKeyPress(char)}
                >
                  <Text style={styles.specialChar}>{char}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  dismissArea: {
    flex: 1
  },
  keyboardContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: 20,
    ...SHADOWS.lg
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary
  },
  toggleButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md
  },
  toggleText: {
    color: COLORS.textOnPrimary,
    fontWeight: FONTS.weights.semiBold
  },
  closeButton: {
    padding: SPACING.sm
  },
  closeText: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.textSecondary
  },
  keysContainer: {
    padding: SPACING.md
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.sm
  },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    margin: 3,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm
  },
  keyChar: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold
  },
  keyLatin: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md
  },
  actionKey: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm
  },
  backspaceKey: {
    backgroundColor: COLORS.error,
    flex: 1,
    marginRight: SPACING.sm
  },
  spaceKey: {
    backgroundColor: COLORS.textSecondary,
    flex: 2,
    marginHorizontal: SPACING.sm
  },
  doneKey: {
    backgroundColor: COLORS.primary,
    flex: 1,
    marginLeft: SPACING.sm
  },
  actionText: {
    color: COLORS.textOnPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold
  },
  doneText: {
    color: COLORS.textOnPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold
  },
  specialChars: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider
  },
  specialTitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm
  },
  specialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  specialKey: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm
  },
  specialChar: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.text
  }
});
