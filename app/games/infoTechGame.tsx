'use client';

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Alert,
  PanResponder,
} from 'react-native';
import { useRouter } from 'expo-router';

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

  const animation = new Animated.Value(0);

  const startGame = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setStarted(true);
      setMatches({});
      setScore(0);
      setCompleted(false);
    });
  };

  const handleDrop = (problemId: string, droppedSolution: string) => {
    const updated = { ...matches, [problemId]: droppedSolution };
    setMatches(updated);
    const correct = problems.filter(p => updated[p.id] === p.solution).length;
    setScore((correct / problems.length) * 100);
  };

  const submit = () => {
    setCompleted(true);
  };

  if (!started) {
    return (
      <View style={styles.startScreen}>
        <Animated.Text style={[styles.startTitle, { opacity: animation }]}>
          Troubleshoot IT - Level 1
        </Animated.Text>
        <Pressable style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Start Game</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.gameScreen}>
      <Text style={styles.gameTitle}>Match the Problems to Solutions</Text>

      {problems.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.problemText}>{item.problem}</Text>
          <Pressable
            style={styles.dropZone}
            onPress={() => handleDrop(item.id, item.solution)}
          >
            <Text>{matches[item.id] || 'Drop solution here'}</Text>
          </Pressable>
        </View>
      ))}

      <View style={styles.optionsRow}>
        {problems.map((item, idx) => (
          <Pressable
            key={idx}
            style={styles.optionBox}
            onPress={() => Alert.alert('Drag Feature', 'Pretend you dragged this')}
          >
            <Text>{item.solution}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.scoreText}>Score: {Math.round(score)}%</Text>

      <Pressable style={styles.submitButton} onPress={submit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>

      {completed && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            {score >= 70 ? 'Success!' : 'Failed'}
          </Text>
          <Text style={styles.resultPercent}>{Math.round(score)}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  startScreen: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  startTitle: {
    fontSize: 28,
    color: 'white',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#9333ea',
    padding: 16,
    borderRadius: 10,
  },
  gameScreen: {
    flex: 1,
    backgroundColor: '#ede9fe',
    padding: 20,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4c1d95',
  },
  card: {
    backgroundColor: '#f5f3ff',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
  },
  problemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropZone: {
    backgroundColor: 'white',
    padding: 10,
    borderColor: '#a78bfa',
    borderWidth: 2,
    borderRadius: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  optionBox: {
    padding: 12,
    backgroundColor: '#ddd6fe',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#7c3aed',
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#4c1d95',
  },
  resultBox: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6b21a8',
  },
  resultPercent: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#6d28d9',
  },
});
