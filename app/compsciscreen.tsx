import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ComputerScienceResultScreen() {
  const router = useRouter();
  
  return (
    <LinearGradient colors={['#B57EDC', '#E6E6FA']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.backgroundEmojis}>
          💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡
        </Text>

        <Text style={styles.title}>💻 Computer Science Major: You're a Natural Fit!</Text>

        <Text style={styles.highlight}>
          🥇 You scored highest in the Computer Science game!
        </Text>

        <Text style={styles.description}>
          Your performance shows logical reasoning, analytical thinking, and strong problem-solving skills, core strengths for computing and technology fields.
        </Text>

        <Text style={styles.personality}>
          As an <Text style={styles.bold}>INTP</Text>, you likely excel in structured environments, strategic planning, and tackling complex challenges. 
          The MBTI research by Mohd Rustam Mohd Rameli (2020) found that students with these traits often thrive in science-oriented disciplines like Computer Science, where systematic thinking and precision are key.
        </Text>

        <Text style={styles.benefit}>
          Research supports that aligning your major with your personality type can increase academic satisfaction and career success. MBTI-compatible students in Computer Science often enjoy higher confidence in decision-making, reduced career indecision, and better long-term performance.
        </Text>

        <View style={styles.tryAgainContainer}>
          <Text style={styles.tryAgainText}>
            Want to try again? Tap below:
          </Text>
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
