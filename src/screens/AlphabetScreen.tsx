import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getTifinaghAlphabet } from '../services/translationService';
import { TifinaghLetter } from '../types';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 64) / 3;

// Inline styles matching the neumorphic/dark mode design from Image 1
const inlineStyles = {
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 20,
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
    textShadowColor: 'rgba(255, 193, 7, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  quizButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  quizButtonText: {
    color: '#1a1a2e',
    fontWeight: '700' as const,
    fontSize: 14,
  },
  introContainer: {
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  introText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    textAlign: 'center' as const,
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  gridRow: {
    justifyContent: 'space-between' as const,
  },
  letterCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // Neumorphic shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  letterCardPressed: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderColor: 'rgba(255, 193, 7, 0.3)',
    transform: [{ scale: 0.95 }],
  },
  tifinaghChar: {
    fontSize: 36,
    color: '#FFC107',
    fontWeight: '700' as const,
    textShadowColor: 'rgba(255, 193, 7, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  latinChar: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
    fontWeight: '500' as const,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1e1e3f',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center' as const,
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  modalTifinagh: {
    fontSize: 80,
    color: '#FFC107',
    fontWeight: '700' as const,
    textShadowColor: 'rgba(255, 193, 7, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  modalLatin: {
    fontSize: 32,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    fontWeight: '600' as const,
  },
  modalDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: '100%',
    marginVertical: 24,
  },
  modalInfo: {
    flexDirection: 'row' as const,
    marginBottom: 12,
    alignItems: 'center' as const,
  },
  modalLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginRight: 8,
    width: 100,
  },
  modalValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500' as const,
  },
  modalClose: {
    marginTop: 24,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  modalCloseText: {
    color: '#FFC107',
    fontWeight: '600' as const,
    fontSize: 16,
  },
  // Quiz styles
  quizOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center' as const,
    padding: 20,
  },
  quizContent: {
    backgroundColor: '#1e1e3f',
    borderRadius: 28,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quizHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  quizTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFC107',
  },
  quizProgress: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginRight: 16,
  },
  quizCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  quizCloseText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quizBody: {
    padding: 32,
    alignItems: 'center' as const,
  },
  quizQuestion: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  quizLetter: {
    fontSize: 100,
    color: '#FFC107',
    fontWeight: '700' as const,
    marginBottom: 32,
    textShadowColor: 'rgba(255, 193, 7, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
  },
  revealButton: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.4)',
  },
  revealButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  answerSection: {
    alignItems: 'center' as const,
  },
  answerText: {
    fontSize: 28,
    color: '#43A047',
    fontWeight: '700' as const,
  },
  phoneticAnswer: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic' as const,
    marginTop: 8,
  },
  selfEvalLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 32,
    marginBottom: 16,
  },
  evalButtons: {
    flexDirection: 'row' as const,
    gap: 16,
  },
  evalButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  wrongButton: {
    backgroundColor: '#E53935',
    shadowColor: '#E53935',
  },
  correctButton: {
    backgroundColor: '#43A047',
    shadowColor: '#43A047',
  },
  evalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  scoreContainer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    alignItems: 'center' as const,
  },
  scoreText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500' as const,
  },
  // Result modal
  resultOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 24,
  },
  resultContent: {
    backgroundColor: '#1e1e3f',
    borderRadius: 32,
    padding: 40,
    alignItems: 'center' as const,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
  resultEmoji: {
    fontSize: 72,
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: '#FFC107',
    marginBottom: 16,
    textShadowColor: 'rgba(255, 193, 7, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  resultMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center' as const,
    marginBottom: 32,
    lineHeight: 24,
  },
  restartButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  restartButtonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: '700' as const,
  },
};

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
      setQuizMode(false);
    }
  };

  const renderLetter = ({ item }: { item: TifinaghLetter }) => (
    <TouchableOpacity
      style={inlineStyles.letterCard}
      onPress={() => handleLetterPress(item)}
      activeOpacity={0.7}
    >
      <Text style={inlineStyles.tifinaghChar}>{item.char}</Text>
      <Text style={inlineStyles.latinChar}>{item.latin}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={inlineStyles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f0f23']}
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
                  <Text style={inlineStyles.headerTitle}>Tifinagh</Text>
                  <Text style={inlineStyles.headerSubtitle}>Agemmay - Alphabet</Text>
                </View>
              </View>
              <TouchableOpacity
                style={inlineStyles.quizButton}
                onPress={startQuiz}
                activeOpacity={0.8}
              >
                <Text style={inlineStyles.quizButtonText}>Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Introduction */}
          <View style={inlineStyles.introContainer}>
            <Text style={inlineStyles.introText}>
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
            contentContainerStyle={inlineStyles.gridContent}
            columnWrapperStyle={inlineStyles.gridRow}
          />

          {/* Letter Detail Modal */}
          <Modal
            visible={!!selectedLetter}
            transparent
            animationType="fade"
            onRequestClose={() => setSelectedLetter(null)}
          >
            <TouchableOpacity
              style={inlineStyles.modalOverlay}
              activeOpacity={1}
              onPress={() => setSelectedLetter(null)}
            >
              <View style={inlineStyles.modalContent}>
                {selectedLetter && (
                  <>
                    <Text style={inlineStyles.modalTifinagh}>{selectedLetter.char}</Text>
                    <Text style={inlineStyles.modalLatin}>{selectedLetter.latin}</Text>
                    <View style={inlineStyles.modalDivider} />
                    <View style={inlineStyles.modalInfo}>
                      <Text style={inlineStyles.modalLabel}>Nom:</Text>
                      <Text style={inlineStyles.modalValue}>{selectedLetter.name}</Text>
                    </View>
                    <View style={inlineStyles.modalInfo}>
                      <Text style={inlineStyles.modalLabel}>Prononciation:</Text>
                      <Text style={inlineStyles.modalValue}>/{selectedLetter.phonetic}/</Text>
                    </View>
                    <TouchableOpacity
                      style={inlineStyles.modalClose}
                      onPress={() => setSelectedLetter(null)}
                    >
                      <Text style={inlineStyles.modalCloseText}>Fermer</Text>
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
            <View style={inlineStyles.quizOverlay}>
              <View style={inlineStyles.quizContent}>
                <View style={inlineStyles.quizHeader}>
                  <Text style={inlineStyles.quizTitle}>Quiz Tifinagh</Text>
                  <Text style={inlineStyles.quizProgress}>
                    {quizIndex + 1} / {alphabet.length}
                  </Text>
                  <TouchableOpacity
                    style={inlineStyles.quizCloseButton}
                    onPress={() => setQuizMode(false)}
                  >
                    <Text style={inlineStyles.quizCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={inlineStyles.quizBody}>
                  <Text style={inlineStyles.quizQuestion}>
                    Quelle est la transcription latine de cette lettre?
                  </Text>
                  <Text style={inlineStyles.quizLetter}>{alphabet[quizIndex].char}</Text>

                  {!showAnswer ? (
                    <TouchableOpacity
                      style={inlineStyles.revealButton}
                      onPress={() => setShowAnswer(true)}
                    >
                      <Text style={inlineStyles.revealButtonText}>Voir la réponse</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={inlineStyles.answerSection}>
                      <Text style={inlineStyles.answerText}>
                        {alphabet[quizIndex].latin} - {alphabet[quizIndex].name}
                      </Text>
                      <Text style={inlineStyles.phoneticAnswer}>
                        /{alphabet[quizIndex].phonetic}/
                      </Text>

                      <Text style={inlineStyles.selfEvalLabel}>Vous avez trouvé?</Text>
                      <View style={inlineStyles.evalButtons}>
                        <TouchableOpacity
                          style={[inlineStyles.evalButton, inlineStyles.wrongButton]}
                          onPress={() => nextQuizQuestion(false)}
                        >
                          <Text style={inlineStyles.evalButtonText}>Non ✗</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[inlineStyles.evalButton, inlineStyles.correctButton]}
                          onPress={() => nextQuizQuestion(true)}
                        >
                          <Text style={inlineStyles.evalButtonText}>Oui ✓</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  <View style={inlineStyles.scoreContainer}>
                    <Text style={inlineStyles.scoreText}>Score: {score}</Text>
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
                style={inlineStyles.resultOverlay}
                activeOpacity={1}
                onPress={() => setScore(0)}
              >
                <View style={inlineStyles.resultContent}>
                  <Text style={inlineStyles.resultEmoji}>
                    {score >= alphabet.length * 0.8 ? '🎉' : score >= alphabet.length * 0.5 ? '👍' : '💪'}
                  </Text>
                  <Text style={inlineStyles.resultTitle}>Quiz terminé!</Text>
                  <Text style={inlineStyles.resultScore}>
                    {score} / {alphabet.length}
                  </Text>
                  <Text style={inlineStyles.resultMessage}>
                    {score >= alphabet.length * 0.8
                      ? 'Excellent! Tu maîtrises le Tifinagh!'
                      : score >= alphabet.length * 0.5
                      ? 'Bien joué! Continue à pratiquer!'
                      : 'Continue à apprendre, tu vas y arriver!'}
                  </Text>
                  <TouchableOpacity
                    style={inlineStyles.restartButton}
                    onPress={() => {
                      setScore(0);
                      startQuiz();
                    }}
                  >
                    <Text style={inlineStyles.restartButtonText}>Recommencer</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
