import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function FeedbackBusiness() {
  const { score, major, personality } = useLocalSearchParams();
  const router = useRouter();

  const feedbackMessages: Record<string, string> = {
    ESTP: `As an ESTP, you're energetic, quick-thinking, and thrive in dynamic environments — perfect for ${major}. 
    Your ability to make fast, confident decisions means you can handle high-pressure business challenges with ease.
    Just remember to also consider the long-term impacts of your choices.`,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feedback for {major}</Text>
      <Text style={styles.score}>Final Score: {Number(score).toFixed(0)}%</Text>
      <Text
        style={[styles.result, Number(score) >= 70 ? styles.pass : styles.fail]}
      >
        {Number(score) >= 70 ? "✅ Passed" : "❌ Failed"}
      </Text>

      <Text style={styles.feedbackText}>
        {feedbackMessages[personality as string] ||
          "No feedback available for your personality type."}
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/game-business")}
      >
        <Text style={styles.buttonText}>🔁 Play Again</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  score: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
  },
  result: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  pass: {
    color: "green",
  },
  fail: {
    color: "red",
  },
  feedbackText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  button: {
    backgroundColor: "#e0ecff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 15,
    color: "#333",
  },
});
