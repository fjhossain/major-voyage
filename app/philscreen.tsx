import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PhilosophyResultScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#B57EDC', '#E6E6FA']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.backgroundEmojis}>
          🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️🧠📚🤔💭🗣️🧐⚖️
        </Text>

        <Text style={styles.title}>🧠 Philosophy Major: You're a Natural Fit!</Text>

        <Text style={styles.highlight}>
          🥇 You scored highest in the Philosophy game!
        </Text>

        <Text style={styles.description}>
          Your performance indicates deep reflection, pattern recognition, and abstract reasoning, core strengths for philosophical inquiry.
        </Text>

        <Text style={styles.personality}>
          As an <Text style={styles.bold}>INTP</Text>, you value introspection and exploring complex ideas. Research from <Text style={styles.italic}>Education and Training</Text> (2014) found that MBTI preferences—especially the Sensing–Intuition dimension—are significantly correlated with students’ faculty selection and enthusiasm for specific subjects, including disciplines emphasizing conceptual thinking and introspection.
        </Text>

        <Text style={styles.benefit}>
          Aligning your academic path with your personality type can enrich engagement and academic satisfaction. Philosophical studies thrive with personalities drawn to deep conceptual analysis and meaning-making.
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
  italic: {
    fontStyle: 'italic',
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
