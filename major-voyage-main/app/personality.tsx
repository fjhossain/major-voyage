import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

const questions = [
  {
    text: "You enjoy social gatherings and meeting new people.",
    image: require("../assets/images/q1pic.png"),
    traits: { A: "E", N: "", D: "I" },
  },
  {
    text: "You prefer deep one-on-one conversations over group activities.",
    image: require("../assets/images/q2pic.jpg"),
    traits: { A: "I", N: "", D: "E" },
  },
  {
    text: "You rely more on facts than theories when making decisions.",
    image: require("../assets/images/q3pic.jpg"),
    traits: { A: "S", N: "", D: "N" },
  },
  {
    text: "You trust your instincts more than data.",
    image: require("../assets/images/q4pic.jpg"),
    traits: { A: "N", N: "", D: "S" },
  },
  {
    text: "You value logic more than emotions.",
    image: require("../assets/images/q5pic.jpg"),
    traits: { A: "T", N: "", D: "F" },
  },
  {
    text: "You consider people's feelings when making decisions.",
    image: require("../assets/images/q6pic.jpg"),
    traits: { A: "F", N: "", D: "T" },
  },
  {
    text: "You like having a detailed plan.",
    image: require("../assets/images/q7pic.png"),
    traits: { A: "J", N: "", D: "P" },
  },
  {
    text: "You prefer to be spontaneous rather than planning everything.",
    image: require("../assets/images/q8pic.png"),
    traits: { A: "P", N: "", D: "J" },
  },
];

export default function PersonalityScreen() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(true);
  const router = useRouter();

  const handleAnswer = (choice: "A" | "N" | "D") => {
    const updatedAnswers = [...answers];
    const trait = questions[current].traits[choice];
    if (trait) updatedAnswers[current] = trait;
    setAnswers(updatedAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const result = calculateMBTI(updatedAnswers);
      router.push(`/result?type=${result}`);
    }
  };

  const calculateMBTI = (ans: string[]) => {
    const counts: Record<string, number> = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    ans.forEach((letter) => {
      if (letter) counts[letter]++;
    });

    return (
      (counts["E"] >= counts["I"] ? "E" : "I") +
      (counts["S"] >= counts["N"] ? "S" : "N") +
      (counts["T"] >= counts["F"] ? "T" : "F") +
      (counts["J"] >= counts["P"] ? "J" : "P")
    );
  };

  return (
    <LinearGradient
      colors={["#add8e6", "#d8b4fe", "#ffffff"]}
      style={styles.container}
    >
      <Image source={questions[current].image} style={styles.image} />
      <Text style={styles.question}>{questions[current].text}</Text>

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.choiceButton, { backgroundColor: "#a3e635" }]}
          onPress={() => handleAnswer("A")}
        >
          <Text style={styles.buttonText}>Agree</Text>
        </Pressable>
        <Pressable
          style={[styles.choiceButton, { backgroundColor: "#facc15" }]}
          onPress={() => handleAnswer("N")}
        >
          <Text style={styles.buttonText}>Neutral</Text>
        </Pressable>
        <Pressable
          style={[styles.choiceButton, { backgroundColor: "#f87171" }]}
          onPress={() => handleAnswer("D")}
        >
          <Text style={styles.buttonText}>Disagree</Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <LinearGradient
            colors={["#d0bfff", "#e0c3fc", "#f8f9fa"]}
            style={styles.modalContainer}
          >
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
            <Text style={styles.modalTitle}>
              🔍 Understand Yourself with MBTI
            </Text>
            <Text style={styles.modalText}>
              The{" "}
              <Text style={{ fontWeight: "bold" }}>
                MBTI (Myers-Briggs Type Indicator)
              </Text>{" "}
              is a widely used personality framework that helps you discover how
              you perceive the world and make decisions.{"\n\n"}
              This short test will identify your{" "}
              <Text style={{ fontWeight: "bold" }}>personality type</Text>{" "}
              across 4 key dimensions:{"\n"}• Introversion (I) or Extraversion
              (E){"\n"}• Sensing (S) or Intuition (N){"\n"}• Thinking (T) or
              Feeling (F){"\n"}• Judging (J) or Perceiving (P){"\n\n"}
              Once complete, your personality type (e.g., INFJ, ESTP, etc.) will
              help us suggest college majors and career paths that align with
              your strengths, interests, and natural preferences.{"\n\n"}
              🧭 Take your time and answer honestly — there are no right or
              wrong answers!
            </Text>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "white",
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 16,
    padding: 4,
  },

  backText: {
    color: "#1e3a8a",
    fontSize: 17,
    fontWeight: "500",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  image: {
    width: "90%",
    height: 500,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 16,
    borderRadius: 90,
  },
  question: {
    fontSize: 24,
    color: "black",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 20,
  },
  choiceButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 90,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "85%",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
  },
  modalTitle: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  modalText: {
    marginTop: 60,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});
