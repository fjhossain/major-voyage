'use client';

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Draggable from 'react-native-draggable';

const problems = [
  { id: '1', problem: 'Wi-Fi not working', solution: 'Restart router' },
  { id: '2', problem: 'Computer is slow', solution: 'Clear cache' },
  { id: '3', problem: 'No sound', solution: 'Check speakers' },
];

export default function InfoTechGame() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showResultScreen, setShowResultScreen] = useState(false);

  const startGame = () => {
    setStarted(true);
    setMatches({});
    setScore(0);
    setCompleted(false);
    setShowResultScreen(false);
  };

  const handleDrop = (problemId: string, solution: string) => {
    setMatches((prev) => ({ ...prev, [problemId]: solution }));
  };

  const submitGame = () => {
    const correctCount = problems.filter(
      (p) => matches[p.id] === p.solution
    ).length;
    const newScore = (correctCount / problems.length) * 100;
    setScore(newScore);
    setCompleted(true);
    setShowResultScreen(true);
  };

  const tryAgain = () => {
    setStarted(false);
    setMatches({});
    setScore(0);
    setCompleted(false);
    setShowResultScreen(false);
  };

  if (!started) {
    return (
      <View style={styles.startContainer}>
        <Animated.View entering={FadeIn}>
          <Image source={require('@/assets/images/it-start.png')} style={styles.image} />
          <Text style={styles.title}>Troubleshoot IT - Level 1</Text>
          <Pressable style={styles.startButton} onPress={startGame}>
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  if (showResultScreen) {
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          {score >= 70 ? ' Success!' : ' You Failed'}
        </Text>
        <Text style={styles.resultScore}>Your Score: {Math.round(score)}%</Text>

        {score >= 70 ? (
          <Pressable
            style={styles.resultButton}
            onPress={() => Alert.alert('Next Level', 'Level 2 coming soon!')}
          >
            <Text style={styles.buttonText}>Play Level 2</Text>
          </Pressable>
        ) : (
          <>
            <Pressable style={styles.resultButton} onPress={tryAgain}>
              <Text style={styles.buttonText}>Try Again</Text>
            </Pressable>
            <Pressable
              style={styles.resultButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.buttonText}>Go Home</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Match Problems to Solutions</Text>

      {problems.map((problem) => (
        <View key={problem.id} style={styles.card}>
          <Text style={styles.problemText}>{problem.problem}</Text>
          <Text style={styles.dropZone}>
            {matches[problem.id] ?? 'Drop solution here'}
          </Text>
        </View>
      ))}

      <View style={styles.draggables}>
        {problems.map((item) => (
          <Draggable
            key={item.solution}
            x={50}
            y={0}
            renderColor="#ffffff"
            renderText={item.solution}
            onDragRelease={(e, gestureState) => {
              const randomProblem = problems.find(
                (p) => !matches[p.id] && p.solution === item.solution
              );
              if (randomProblem) {
                handleDrop(randomProblem.id, item.solution);
              }
            }}
          />
        ))}
      </View>

      <Pressable style={styles.submitButton} onPress={submitGame}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  startContainer: {
    flex: 1,
    backgroundColor: '#6a1b9a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#6a1b9a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#6a1b9a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 280,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#9c27b0',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginTop: 40,
    alignItems: 'center',
  },
  resultButton: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#6a1b9a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#e1bee7',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  problemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a148c',
  },
  dropZone: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  draggables: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  resultScore: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
});
