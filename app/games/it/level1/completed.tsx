'use client';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Completed() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Level 1 Complete!</Text>
      <Text style={styles.message}>You passed the Troubleshoot IT challenge!</Text>
      <Pressable style={styles.button} onPress={() => router.push('/majors/it')}>
        <Text style={styles.buttonText}>Back to IT Menu</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  message: { fontSize: 16, textAlign: 'center', marginBottom: 30 },
  button: { backgroundColor: '#6c5ce7', padding: 14, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
