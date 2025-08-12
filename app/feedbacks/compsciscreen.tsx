// app/feedbacks/compsciscreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

function normalizeMajor(name?: string) {
  if (!name) return "";
  const n = name.trim().toLowerCase();
  if (["cs", "comp sci", "computer-science"].includes(n))
    return "computer science";
  return n;
}

export default function ComputerScienceResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    major?: string;
    sessionId?: string;
    userId?: string;
    mbti?: string;
  }>();

  // Optional: if you passed MBTI through params
  const mbti = (params.mbti && String(params.mbti).toUpperCase()) || "INTP";

  // If you ever want to guard this screen to CS only:
  // const isCS = normalizeMajor(params.major) === 'computer science';

  return (
    <LinearGradient colors={["#B57EDC", "#E6E6FA"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.backgroundEmojis}>
          💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡💻🖥️⌨️💻🖥️⌨️🧠📊📚🔍⚙️💡
        </Text>

        <Text style={styles.title}>
          💻 Computer Science Major: You're a Natural Fit!
        </Text>

        <Text style={styles.highlight}>
          🥇 You scored highest in the Computer Science game!
        </Text>

        <Text style={styles.description}>
          Your performance shows logical reasoning, analytical thinking, and
          strong problem-solving skills, core strengths for computing and
          technology fields.
        </Text>

        <Text style={styles.personality}>
          As an <Text style={styles.bold}>{mbti}</Text>, you likely excel in
          structured environments, strategic planning, and tackling complex
          challenges. The MBTI research by Mohd Rustam Mohd Rameli (2020) found
          that students with these traits often thrive in science-oriented
          disciplines like Computer Science, where systematic thinking and
          precision are key.
        </Text>

        <Text style={styles.benefit}>
          Research supports that aligning your major with your personality type
          can increase academic satisfaction and career success. MBTI-compatible
          students in Computer Science often enjoy higher confidence in
          decision-making, reduced career indecision, and better long-term
          performance.
        </Text>

        <View style={styles.tryAgainContainer}>
          <Text style={styles.tryAgainText}>Want to try again? Tap below:</Text>
          <Button
            title="🔁 Play Again"
            onPress={() => router.push("/personality")}
          />
        </View>

        {params.sessionId || params.userId ? (
          <Text style={styles.meta}>
            Session #{params.sessionId ?? "—"} • User #{params.userId ?? "—"}
          </Text>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundEmojis: {
    fontSize: 26,
    opacity: 0.15,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 12,
    textAlign: "center",
  },
  highlight: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4B0082",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  personality: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  benefit: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 24,
  },
  bold: { fontWeight: "bold" },
  tryAgainContainer: { marginTop: 20, alignItems: "center" },
  tryAgainText: {
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  meta: {
    marginTop: 14,
    textAlign: "center",
    color: "#6b6b6b",
    fontSize: 12,
  },
});
