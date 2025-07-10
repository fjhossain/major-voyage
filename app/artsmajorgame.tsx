import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const LINES: string[] = [
  "To be or not to be",
  "All the world's a stage",
  "The play's the thing",
  "Brevity is the soul of wit",
  "Some are born great",
  "Et tu, Brute"
];

const GAME_TIME = 10;

export default function App() {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(0);
  const [showLine, setShowLine] = useState(true);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const currentLine = LINES[level];

  useEffect(() => {
    if (!started || gameOver) return;

    const words = currentLine.split(' ');
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setSelectedWords([]);
    setShowLine(true);
    setTimeLeft(GAME_TIME);

    const hideTimer = setTimeout(() => setShowLine(false), 3000);
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleSubmit();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(hideTimer);
      clearInterval(countdown);
    };
  }, [level, started]);

  const handleWordPress = (word: string) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords((prev) => [...prev, word]);
    }
  };

  const handleSubmit = () => {
    const userLine = selectedWords.join(' ');
    if (userLine === currentLine) {
      setScore((prev) => prev + 1);
    }

    if (level + 1 >= LINES.length) {
      setGameOver(true);
      setShowModal(true);
    } else {
      setLevel((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    setLevel(0);
    setScore(0);
    setGameOver(false);
    setTimeLeft(GAME_TIME);
    setSelectedWords([]);
    setStarted(false);
    setShowModal(false);
  };

  const getFinalMessage = () => {
    const percent = (score / LINES.length) * 100;
    if (percent >= 70) {
      return {
        title: "🎉 Congratulations!",
        message: `You passed with ${Math.round(percent)}%!`,
      };
    }
    return {
      title: "📘 Game Over",
      message: `You scored ${score} out of ${LINES.length}. Better luck next time!`,
    };
  };

  // Start screen
  if (!started) {
    return (
      <LinearGradient colors={['#6a0dad', '#E6E6FA']} style={styles.gradient}>
        <View style={styles.mainContainer}>
          <Animatable.Text animation="fadeInDown" style={styles.title}>
            Memory Maze
          </Animatable.Text>
          <Animatable.Text animation="zoomIn" style={styles.emoji}>
            🎭
          </Animatable.Text>
          <TouchableOpacity style={styles.startButton} onPress={() => setStarted(true)}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
          <Text style={styles.instructionsTitle}>How to Play:</Text>
          <Text style={styles.instructions}>
            • Memorize the line shown.{"\n"}
            • After 3 seconds, tap the words in the correct order.{"\n"}
            • You have 10 seconds to complete each level.
          </Text>
        </View>
      </LinearGradient>
    );
  }

  // Game screen
  return (
    <LinearGradient colors={['#6a0dad', '#E6E6FA']} style={styles.gradient}>
      <View style={styles.container}>
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          🎭 Line Memorizer
        </Animatable.Text>
        <Text style={styles.subtitle}>Level {level + 1} / {LINES.length}</Text>
        <Text style={styles.timer}>⏱ Time Left: {timeLeft}s</Text>

        {showLine ? (
          <Animatable.Text animation="fadeIn" style={styles.line}>
            "{currentLine}"
          </Animatable.Text>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.wordContainer}>
              {shuffledWords.map((word, index) => (
                <Animatable.View animation="bounceIn" delay={index * 100} key={index}>
                  <TouchableOpacity
                    style={styles.wordButton}
                    onPress={() => handleWordPress(word)}
                  >
                    <Text style={styles.wordText}>{word}</Text>
                  </TouchableOpacity>
                </Animatable.View>
              ))}
            </ScrollView>
            <Text style={styles.selectedText}>
              Selected: {selectedWords.join(' ')}
            </Text>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Modal for final score */}
        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: getFinalMessage().title.includes("🎉") ? "#4CAF50" : "#D32F2F" },
                ]}
              >
                {getFinalMessage().title}
              </Text>
              <Text style={styles.modalMessage}>{getFinalMessage().message}</Text>
              <TouchableOpacity style={styles.startButton} onPress={resetGame}>
                <Text style={styles.startButtonText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

// Styles
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 120,
    marginBottom: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  timer: {
    fontSize: 18,
    color: '#FF0000',
    marginBottom: 10,
  },
  line: {
    fontSize: 22,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000',
  },
  wordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  wordButton: {
    backgroundColor: '#d1c4e9',
    padding: 10,
    margin: 5,
    borderRadius: 8,
  },
  wordText: {
    fontSize: 16,
    color: '#4a148c',
  },
  selectedText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#7e57c2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#6a0dad',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  instructionsTitle: {
    fontSize: 20,
    marginTop: 40,
    marginBottom: 10,
    color: '#000',
    fontWeight: '600',
  },
  instructions: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});
