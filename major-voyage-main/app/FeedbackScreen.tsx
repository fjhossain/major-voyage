import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";

type FeedbackScreenProps = {
  totalScore: number;
  totalMaxImpact: number;
  passed: boolean;
  major: string;
  personality: string;
  onRestart: () => void;
};

export default function FeedbackScreen({
  totalScore,
  totalMaxImpact,
  passed,
  major,
  personality,
  onRestart,
}: FeedbackScreenProps) {
  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>Game Over</Text>
        <Text style={styles.result}>
          Your Total Score: {totalScore} / {totalMaxImpact}
        </Text>
        <Text style={[styles.result, { color: passed ? "green" : "red" }]}>
          {passed ? "You Passed!" : "You Failed!"}
        </Text>

        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackTitle}>Recommended Major:</Text>
          <Text style={styles.feedbackMajor}>{major}</Text>
          <Text style={styles.feedbackText}>
            {major} is a dynamic and fast-paced field that requires strategic
            decision-making, leadership, and the ability to thrive under
            pressure. Professionals in this area handle athlete development,
            team logistics, marketing strategies, and event coordination.
          </Text>
          <Text style={styles.feedbackTitle}>
            Your Personality: {personality}
          </Text>
          <Text style={styles.feedbackText}>
            {personality === "ESTP"
              ? "As an ESTP (The Dynamo), you’re energetic, action-oriented, and thrive in situations that require quick thinking. Your confidence and adaptability make you an excellent fit for the competitive and unpredictable world of sports management. ESTPs excel at networking, motivating teams, and making high-impact decisions — all essential traits for success in this major."
              : `Your ${personality} personality type brings unique strengths to this major.`}
          </Text>
        </View>

        <Pressable onPress={onRestart} style={styles.button}>
          <Text style={styles.buttonText}>Restart</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    minHeight: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  result: {
    fontSize: 20,
    marginVertical: 10,
    textAlign: "center",
  },
  feedbackBox: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  feedbackMajor: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
