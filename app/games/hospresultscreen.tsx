import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HotelHavocResultScreen() {
  const coins = 4; // Example static score
  const happiness = 5;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏨 Hospitality Management</Text>
      <Text style={styles.description}>
        🎉 Congratulations on scoring higher in Hotel Havoc!
Your quick thinking and ability to manage multiple tasks under pressure are exactly what the Hospitality Management major is all about. If you enjoy creating positive guest experiences, leading teams, and working in dynamic environments like hotels and events, this major might be the perfect match for you.
      </Text>

      <Text style={styles.resultTitle}>Hotel Havoc Result</Text>
      <Text style={styles.resultText}>Coins Earned: {coins}</Text>
      <Text style={styles.resultText}>Happiness: {happiness}</Text>

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
    marginBottom: 10,
  },
});
