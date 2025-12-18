import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, AMAZIGH_SYMBOL } from '../utils/theme';
import { getTifinaghAlphabet } from '../services/translationService';
import { TifinaghLetter } from '../types';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - SPACING.md * 4) / 3;

export default function AlphabetScreen() {
  const [selectedLetter, setSelectedLetter] = useState<TifinaghLetter | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const alphabet = getTifinaghAlphabet();

  const handleLetterPress = (letter: TifinaghLetter) => {
    setSelectedLetter(letter);
  };

  const startQuiz = () => {
    setQuizMode(true);
    setQuizIndex(0);
    setShowAnswer(false);
    setScore(0);
  };

  const nextQuizQuestion = (correct: boolean) => {
    if (correct) {
      setScore(score + 1);
    }

    if (quizIndex < alphabet.length - 1) {
      setQuizIndex(quizIndex + 1);
      setShowAnswer(false);
    } else {
      // Quiz finished
      setQuizMode(false);
    }
  };

  const renderLetter = ({ item }: { item: TifinaghLetter }) => (
    <TouchableOpacity
      style={styles.letterCard}
      onPress={() => handleLetterPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.tifinaghChar}>{item.char}</Text>
      <Text style={styles.latinChar}>{item.latin}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSymbol}>{AMAZIGH_SYMBOL}</Text>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Tifinagh</Text>
          <Text style={styles.headerSubtitle}>Agemmay - Alphabet</Text>
        </View>
        <TouchableOpacity style={styles.quizButton} onPress={startQuiz}>
          <Text style={styles.quizButtonText}>Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Introduction */}
      <View style={styles.intro}>
        <Text style={styles.introText}>
          L'alphabet Tifinagh est l'écriture traditionnelle des Berbères.
          Appuyez sur une lettre pour voir les détails.
        </Text>
      </View>

      {/* Alphabet Grid */}
      <FlatList
        data={alphabet}
        keyExtractor={(item) => item.char}
        renderItem={renderLetter}
        numColumns={3}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
      />

      {/* Letter Detail Modal */}
      <Modal
        visible={!!selectedLetter}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedLetter(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedLetter(null)}
        >
          <View style={styles.modalContent}>
            {selectedLetter && (
              <>
                <Text style={styles.modalTifinagh}>{selectedLetter.char}</Text>
                <Text style={styles.modalLatin}>{selectedLetter.latin}</Text>
                <View style={styles.modalDivider} />
                <View style={styles.modalInfo}>
                  <Text style={styles.modalLabel}>Nom:</Text>
                  <Text style={styles.modalValue}>{selectedLetter.name}</Text>
                </View>
                <View style={styles.modalInfo}>
                  <Text style={styles.modalLabel}>Prononciation:</Text>
                  <Text style={styles.modalValue}>/{selectedLetter.phonetic}/</Text>
                </View>
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setSelectedLetter(null)}
                >
                  <Text style={styles.modalCloseText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Quiz Modal */}
      <Modal
        visible={quizMode}
        transparent
        animationType="slide"
        onRequestClose={() => setQuizMode(false)}
      >
        <View style={styles.quizOverlay}>
          <View style={styles.quizContent}>
            <View style={styles.quizHeader}>
              <Text style={styles.quizTitle}>Quiz Tifinagh</Text>
              <Text style={styles.quizProgress}>
                {quizIndex + 1} / {alphabet.length}
              </Text>
              <TouchableOpacity
                style={styles.quizCloseButton}
                onPress={() => setQuizMode(false)}
              >
                <Text style={styles.quizCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quizBody}>
              <Text style={styles.quizQuestion}>
                Quelle est la transcription latine de cette lettre?
              </Text>
              <Text style={styles.quizLetter}>{alphabet[quizIndex].char}</Text>

              {!showAnswer ? (
                <TouchableOpacity
                  style={styles.revealButton}
                  onPress={() => setShowAnswer(true)}
                >
                  <Text style={styles.revealButtonText}>Voir la réponse</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.answerSection}>
                  <Text style={styles.answerText}>
                    {alphabet[quizIndex].latin} - {alphabet[quizIndex].name}
                  </Text>
                  <Text style={styles.phoneticAnswer}>
                    /{alphabet[quizIndex].phonetic}/
                  </Text>

                  <Text style={styles.selfEvalLabel}>Vous avez trouvé?</Text>
                  <View style={styles.evalButtons}>
                    <TouchableOpacity
                      style={[styles.evalButton, styles.wrongButton]}
                      onPress={() => nextQuizQuestion(false)}
                    >
                      <Text style={styles.evalButtonText}>Non ✗</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.evalButton, styles.correctButton]}
                      onPress={() => nextQuizQuestion(true)}
                    >
                      <Text style={styles.evalButtonText}>Oui ✓</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Score: {score}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Quiz Result Modal */}
      {!quizMode && score > 0 && (
        <Modal
          visible={true}
          transparent
          animationType="fade"
          onRequestClose={() => setScore(0)}
        >
          <TouchableOpacity
            style={styles.resultOverlay}
            activeOpacity={1}
            onPress={() => setScore(0)}
          >
            <View style={styles.resultContent}>
              <Text style={styles.resultEmoji}>
                {score >= alphabet.length * 0.8 ? '🎉' : score >= alphabet.length * 0.5 ? '👍' : '💪'}
              </Text>
              <Text style={styles.resultTitle}>Quiz terminé!</Text>
              <Text style={styles.resultScore}>
                {score} / {alphabet.length}
              </Text>
              <Text style={styles.resultMessage}>
                {score >= alphabet.length * 0.8
                  ? 'Excellent! Tu maîtrises le Tifinagh!'
                  : score >= alphabet.length * 0.5
                  ? 'Bien joué! Continue à pratiquer!'
                  : 'Continue à apprendre, tu vas y arriver!'}
              </Text>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={() => {
                  setScore(0);
                  startQuiz();
                }}
              >
                <Text style={styles.restartButtonText}>Recommencer</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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
    backgroundColor: COLORS.tifinagh
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
  quizButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md
  },
  quizButtonText: {
    color: COLORS.text,
    fontWeight: FONTS.weights.bold
  },
  intro: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm
  },
  introText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22
  },
  gridContent: {
    padding: SPACING.md,
    paddingBottom: 100
  },
  gridRow: {
    justifyContent: 'space-between'
  },
  letterCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm
  },
  tifinaghChar: {
    fontSize: FONTS.sizes.huge,
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold
  },
  latinChar: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300
  },
  modalTifinagh: {
    fontSize: 72,
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold
  },
  modalLatin: {
    fontSize: FONTS.sizes.xxxl,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm
  },
  modalDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    width: '100%',
    marginVertical: SPACING.lg
  },
  modalInfo: {
    flexDirection: 'row',
    marginBottom: SPACING.sm
  },
  modalLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm
  },
  modalValue: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium
  },
  modalClose: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md
  },
  modalCloseText: {
    color: COLORS.textOnPrimary,
    fontWeight: FONTS.weights.semiBold
  },
  quizOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: SPACING.lg
  },
  quizContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden'
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: SPACING.lg
  },
  quizTitle: {
    flex: 1,
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textOnPrimary
  },
  quizProgress: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textOnPrimary,
    opacity: 0.8,
    marginRight: SPACING.md
  },
  quizCloseButton: {
    padding: SPACING.sm
  },
  quizCloseText: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.textOnPrimary
  },
  quizBody: {
    padding: SPACING.xl,
    alignItems: 'center'
  },
  quizQuestion: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl
  },
  quizLetter: {
    fontSize: 100,
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xl
  },
  revealButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg
  },
  revealButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold
  },
  answerSection: {
    alignItems: 'center'
  },
  answerText: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.secondary,
    fontWeight: FONTS.weights.bold
  },
  phoneticAnswer: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SPACING.xs
  },
  selfEvalLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md
  },
  evalButtons: {
    flexDirection: 'row',
    gap: SPACING.md
  },
  evalButton: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg
  },
  wrongButton: {
    backgroundColor: COLORS.error
  },
  correctButton: {
    backgroundColor: COLORS.success
  },
  evalButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold
  },
  scoreContainer: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider
  },
  scoreText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium
  },
  resultOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl
  },
  resultContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg
  },
  resultTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.md
  },
  resultScore: {
    fontSize: FONTS.sizes.huge,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    marginBottom: SPACING.md
  },
  resultMessage: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl
  },
  restartButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg
  },
  restartButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold
  }
});
