'use client';

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ITMenu() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IT Major - Game Menu</Text>

      <Pressable style={styles.button} onPress={() => router.push('/games/it/level1')}>
        <Text style={styles.buttonText}>Level 1: Troubleshoot IT</Text>
      </Pressable>

      <Pressable style={[styles.button, { backgroundColor: '#ccc' }]} disabled>
        <Text style={styles.buttonText}> Level 2: Coming Soon</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  button: {
    backgroundColor: '#0984e3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: 250,
  },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});
