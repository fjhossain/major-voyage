// app/game-business.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const scenarios = [
  {
    situation: "Your company’s sales are dropping. What do you do?",
    choices: [
      { text: "Launch a big marketing campaign", score: 2 },
      { text: "Cut employee costs", score: 1 },
      { text: "Research customer feedback", score: 3 },
    ],
  },
  {
    situation: "A competitor releases a similar product. How do you respond?",
    choices: [
      { text: "Lower your prices immediately", score: 1 },
      { text: "Emphasize your product’s unique value", score: 3 },
      { text: "Ignore them", score: 0 },
    ],
  },
  {
    situation: "You’re offered a risky but high-reward partnership. Do you:",
    choices: [
      { text: "Take the risk and invest", score: 2 },
      { text: "Request more data before deciding", score: 3 },
      { text: "Decline to stay safe", score: 1 },
    ],
  },
];

export default function BusinessScenarioGame() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const router = useRouter();

  const current = scenarios[index];

  const handleChoice = (points: number) => {
    setScore((prev) => prev + points);

    if (index < scenarios.length - 1) {
      setIndex(index + 1);
    } else {
      const finalScore = ((score + points) / (scenarios.length * 3)) * 100;

      Alert.alert(
        "Simulation Complete",
        `Score: ${finalScore.toFixed(0)}%\n\n${
          finalScore >= 70
            ? "✅ You handled the scenarios well!"
            : "❌ You may want to explore more options before committing."
        }`,
        [
          {
            text: "See Feedback",
            onPress: () =>
              router.push(
                `/result/final?score=${finalScore}&major=Business Administration`
              ),
          },
        ]
      );
    }
  };

  return (
    <LinearGradient colors={["#ffffff", "#d0e6ff"]} style={styles.container}>
      <Text style={styles.title}>💼 Business Scenario Game</Text>
      <Text style={styles.situation}>{current.situation}</Text>

      {current.choices.map((choice, i) => (
        <Pressable
          key={i}
          style={styles.choice}
          onPress={() => handleChoice(choice.score)}
        >
          <Text style={styles.choiceText}>{choice.text}</Text>
        </Pressable>
      ))}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333366",
    marginBottom: 30,
    textAlign: "center",
  },
  situation: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
    color: "#000",
  },
  choice: {
    backgroundColor: "#e0e0e0",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  choiceText: {
    fontSize: 16,
    color: "#333",
  },
});
