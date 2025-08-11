import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ArtsResultScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#B57EDC', '#E6E6FA']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.backgroundEmojis}>
          🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️🎭🎨🖌️📚🎬🎶🧠🌈🎭🎨🖌️
        </Text>

        <Text style={styles.title}>🎭 Arts Major: You're a Natural Fit!</Text>

        <Text style={styles.highlight}>
          🥇 You scored highest in the Arts game!
        </Text>

        <Text style={styles.description}>
          Your performance in Memory Maze shows creative thinking, pattern recognition, and emotional expression—core strengths for arts-related disciplines.
        </Text>

        <Text style={styles.personality}>
          As an <Text style={styles.bold}>ESFP</Text>, you're energized by real-world interaction, spontaneous expression, and engaging others emotionally. ESFPs often thrive in the performing arts, visual design, media, and literature—fields where their charisma and enthusiasm shine. 
        </Text>

        <Text style={styles.benefit}>
          Research supports that matching your major with your personality type increases satisfaction and success. Studies like Goldschmid (1967) show personality traits can predict interest and performance in certain fields—ESFPs are often drawn to expressive, interactive disciplines like the arts.
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
