import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const LINES: string[] = [
  "To be or not to be",
  "All the world's a stage",
  "The play's the thing"
];

const GAME_TIME = 10;

export default function App() {
  const [started, setStarted] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(0);
  const [showLine, setShowLine] = useState<boolean>(true);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_TIME);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const currentLine: string = LINES[level];

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
  };

  // Start Screen
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
          <Button title="Start Game" onPress={() => setStarted(true)} />
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

  // Game Over Screen
  if (gameOver) {
    return (
      <LinearGradient colors={['#6a0dad', '#E6E6FA']} style={styles.gradient}>
        <View style={styles.container}>
          <Animatable.Text animation="fadeInDown" style={styles.title}>
            🎭 Game Over!
          </Animatable.Text>
          <Animatable.Text animation="zoomIn" duration={800} style={styles.score}>
            Your Score: {score} / {LINES.length}
          </Animatable.Text>
          <Button title="Play Again" onPress={resetGame} />
        </View>
      </LinearGradient>
    );
  }

  // Game Screen
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
            <Button title="Submit" onPress={handleSubmit} />
          </>
        )}
      </View>
    </LinearGradient>
  );
}

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
  emoji: {
    fontSize: 120,
    marginBottom: 40,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: undefined, // uses system font
  },
  instructionsTitle: {
    fontSize: 20,
    marginTop: 40,
    marginBottom: 10,
    color: '#000000',
    fontWeight: '600',
    fontFamily: undefined,
  },
  instructions: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: undefined,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000000',
    fontFamily: undefined,
  },
  timer: {
    fontSize: 18,
    color: '#FF0000',
    marginBottom: 10,
    fontFamily: undefined,
  },
  line: {
    fontSize: 22,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000000',
    fontFamily: undefined,
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
    fontFamily: undefined,
  },
  selectedText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: '#000000',
    fontFamily: undefined,
  },
  score: {
    fontSize: 24,
    marginVertical: 20,
    color: '#FF0000',
    fontWeight: 'bold',
    fontFamily: undefined,
  },
});
