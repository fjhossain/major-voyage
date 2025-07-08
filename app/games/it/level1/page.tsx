'use client';

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

type Problem = {
  id: string;
  problem: string;
  solution: string;
};

const problems: Problem[] = [
  { id: '1', problem: 'Wi-Fi not working', solution: 'Restart router' },
  { id: '2', problem: 'Computer is slow', solution: 'Clear cache' },
  { id: '3', problem: 'No sound', solution: 'Check speakers' },
];

export default function Page() {
  const router = useRouter();
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);

  const handleSelect = (problemId: string, chosen: string) => {
    const updated = { ...matches, [problemId]: chosen };
    setMatches(updated);

    let correct = problems.filter(
      p => updated[p.id] === p.solution
    ).length;

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
      <Text style={styles.title}> Troubleshoot IT - Level 1</Text>

      {problems.map(p => (
        <View key={p.id} style={styles.card}>
          <Text style={styles.problem}>{p.problem}</Text>
          <Pressable
            style={styles.solution}
            onPress={() => handleSelect(p.id, p.solution)}
          >
            <Text> {p.solution}</Text>
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
  container: { padding: 20, backgroundColor: '#f0f8ff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  problem: { fontSize: 16, marginBottom: 10, fontWeight: 'bold' },
  solution: {
    backgroundColor: '#d0e6ff',
    padding: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  score: { marginTop: 20, fontSize: 16, textAlign: 'center' },
});
