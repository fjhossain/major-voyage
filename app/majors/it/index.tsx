import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function ItMajorScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the IT Mini Game Menu</Text>

      <Pressable style={styles.button} onPress={() => router.push('/games/it/level1')}>
        <Text style={styles.buttonText}> Start Level 1</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0f7fa' },
  text: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  button: { backgroundColor: '#4ade80', padding: 16, borderRadius: 10 },
  buttonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});
