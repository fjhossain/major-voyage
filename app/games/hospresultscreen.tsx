import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HospitalityResultScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#B57EDC', '#E6E6FA']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.backgroundEmojis}>
          🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️🛎️🏨🧼👥💼🍽️🎉💬🛏️🧳🛎️
        </Text>

        <Text style={styles.title}>🏨 Hospitality Major: You’re Built for This!</Text>

        <Text style={styles.highlight}>
          🥇 You scored highest in the Hospitality game!
        </Text>

        <Text style={styles.description}>
          Your top score in Hotel Havoc reveals your multitasking ability, interpersonal skills, and knack for keeping people happy—all essential in the world of hospitality and event management.
        </Text>

        <Text style={styles.personality}>
          As an <Text style={styles.bold}>ESFP</Text>, you’re outgoing, empathetic, and excel in real-time situations. Hospitality is ideal for ESFPs because it thrives on spontaneity, connection, and hands-on service—areas where ESFPs feel most fulfilled.
        </Text>

        <Text style={styles.benefit}>
          According to Goldschmid (1967), personality can help predict academic and career choices. Matching your ESFP traits to majors like hospitality or tourism enhances satisfaction, motivation, and success across your studies and beyond.
        </Text>

        <View style={styles.tryAgainContainer}>
          <Text style={styles.tryAgainText}>Want to try again? Tap below:</Text>
          <Button
            title="🔁 Play Again"
            onPress={() => router.push('/personality')}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundEmojis: {
    fontSize: 26,
    opacity: 0.15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 12,
    textAlign: 'center',
  },
  highlight: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4B0082',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  personality: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  benefit: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  tryAgainContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  tryAgainText: {
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
