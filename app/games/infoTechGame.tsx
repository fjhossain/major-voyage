'use client';

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Draggable from 'react-native-draggable';

const problems = [
  { id: '1', problem: 'Wi-Fi not working', solution: 'Restart router' },
  { id: '2', problem: 'Computer is slow', solution: 'Clear cache' },
  { id: '3', problem: 'No sound', solution: 'Check speakers' },
];

export default function InfoTechGame() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [matches, setMatches] = useState({});
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const startGame = () => {
    setStarted(true);
    setMatches({});
    setScore(0);
    setCompleted(false);
  };

  const handleDrop = (problemId: string, droppedSolution: string) => {
    const updated = { ...matches, [problemId]: droppedSolution };
    setMatches(updated);

    const correct = problems.filter(p => updated[p.id] === p.solution).length;
    const newScore = (correct / problems.length) * 100;
    setScore(newScore);
  };

  const submit = () => {
    if (score >= 70) {
      Alert.alert('Success!', `You passed with ${Math.round(score)}%`);
    } else {
      Alert.alert('Try Again', `You scored ${Math.round(score)}%.`);
    }
    setCompleted(true);
  };

  if (!started) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Troubleshoot IT - Level 1</Text>
        <Pressable style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match Problems to Solutions</Text>

      {problems.map((p) => (
        <View key={p.id} style={styles.card}>
          <Text style={styles.problem}>{p.problem}</Text>
          <Pressable
            style={styles.dropZone}
            onPress={() => handleDrop(p.id, p.solution)}
          >
            <Text>{matches[p.id] || 'Drop Solution Here'}</Text>
          </Pressable>
        </View>
      ))}

      <Text style={styles.score}>Score: {Math.round(score)}%</Text>

      <Pressable style={styles.submitButton} onPress={submit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>

      {completed && score >= 70 && <Text style={styles.success}> Level Complete!</Text>}
      {completed && score < 70 && <Text style={styles.fail}> Try Again</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { marginVertical: 10, padding: 15, backgroundColor: '#eee', borderRadius: 8 },
  problem: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  dropZone: { backgroundColor: '#fff', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 6 },
  button: { backgroundColor: '#4ade80', padding: 15, borderRadius: 10, marginTop: 20 },
  submitButton: { backgroundColor: '#6c5ce7', padding: 15, borderRadius: 10, marginTop: 30 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  score: { textAlign: 'center', fontSize: 18, marginTop: 20 },
  success: { textAlign: 'center', color: 'green', fontSize: 20, marginTop: 20 },
  fail: { textAlign: 'center', color: 'red', fontSize: 20, marginTop: 20 },
});
