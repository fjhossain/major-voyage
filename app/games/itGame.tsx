
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function ITGame() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = [
    {
      id: 1,
      question: "A user can't connect to Wi-Fi. What do you do first?",
      options: ['Restart router', 'Replace the hard drive', 'Update browser'],
      correct: 'Restart router',
    },
    {
      id: 2,
      question: "Computer is slow. What is the likely cause?",
      options: ['Too many programs', 'Broken monitor', 'Low Wi-Fi signal'],
      correct: 'Too many programs',
    },
    {
      id: 3,
      question: "Keyboard not working. What to check first?",
      options: ['Plug connection', 'Battery of mouse', 'Screen resolution'],
      correct: 'Plug connection',
    },
  ];

  const handleOption = (selected: string) => {
    if (questions[questionIndex].correct === selected) {
      setScore(score + 1);
    }

    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setFinished(true);
    }
  };

  if (!started) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Troubleshoot IT - Level 1</Text>
        <Pressable onPress={() => setStarted(true)} style={styles.button}>
          <Text style={styles.buttonText}>Start Game</Text>
        </Pressable>
      </View>
    );
  }

  if (finished) {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{passed ? 'You Passed!' : 'You Failed'}</Text>
        <Text style={styles.score}>Score: {percentage.toFixed(0)}%</Text>
        <Text style={styles.text}>{passed ? 'You can proceed to next level.' : 'Try again!'}</Text>
      </View>
    );
  }

  const current = questions[questionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{current.question}</Text>
      {current.options.map((option) => (
        <Pressable key={option} onPress={() => handleOption(option)} style={styles.option}>
          <Text>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  button: { backgroundColor: '#4ade80', padding: 12, borderRadius: 8 },
  buttonText: { color: '#000', fontWeight: 'bold' },
  option: { backgroundColor: '#e0e0e0', padding: 10, marginVertical: 8, width: '90%', borderRadius: 6 },
  score: { fontSize: 24, fontWeight: 'bold', marginTop: 12 },
  text: { fontSize: 16, marginTop: 8 },
});
