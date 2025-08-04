import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function MemoryMazeResultScreen() {
  const score = 2; // Example static score
  const total = 3;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎭 Arts Major</Text>
      <Text style={styles.description}>
       🎉 Congratulations on scoring higher in Memory Maze!
This suggests you have strong creativity and attention to detail. If you enjoy expressing ideas, thinking critically, and exploring fields like theatre, literature, or visual arts, the Arts major could be a great fit for your talents and interests.
      </Text>

      <Text style={styles.resultTitle}>Memory Maze Result</Text>
      <Text style={styles.resultText}>Score: {score} / {total}</Text>

      <Button title="Continue" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A176C6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 20,
    marginBottom: 20,
  },
});
