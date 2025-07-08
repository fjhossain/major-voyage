'use client';

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const problems = [
  { id: '1', problem: 'Wi-Fi not working', solution: 'Restart router' },
  { id: '2', problem: 'Computer is slow', solution: 'Clear cache' },
  { id: '3', problem: 'No sound', solution: 'Check speakers' },
];

export default function Level1Game() {
  console.log("Level 1 index.tsx loaded");
  
  const [matches, setMatches] = useState({});
  const [score, setScore] = useState(0);
  const router = useRouter();

  const handleMatch = (id: string, answer: string) => {
    const updated = { ...matches, [id]: answer };
    setMatches(updated);

    const correct = problems.filter(p => updated[p.id] === p.solution).length;
    const newScore = (correct / problems.length) * 100;
    setScore(newScore);
  };

  const submit = () => {
    if (score >= 70) {
      router.push('/games/it/level1/completed');
    } else {
      Alert.alert('Try Again', `Score: ${Math.round(score)}%`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Troubleshoot IT</Text>
      {problems.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.problem}>{item.problem}</Text>
          <Pressable
            style={styles.solution}
            onPress={() => handleMatch(item.id, item.solution)}
          >
            <Text>{item.solution}</Text>
          </Pressable>
        </View>
      ))}

      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>

      <Text style={styles.score}>Score: {Math.round(score)}%</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#f0f0f0', padding: 16, borderRadius: 8, marginBottom: 15 },
  problem: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  solution: { backgroundColor: '#d0e6ff', padding: 10, borderRadius: 6 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, marginTop: 20 },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  score: { marginTop: 15, textAlign: 'center', fontSize: 16 },
});
