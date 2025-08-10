import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

const challenges = [
  {
    id: 1,
    type: "sorting",
    question:
      "🧠 Arrange the Git commands in the correct order to push a repo:",
    options: [
      "git add .",
      'git commit -m "message"',
      "git push -u origin main",
      "git init",
      "git remote add origin URL",
    ],
    answer: [
      "git init",
      "git add .",
      'git commit -m "message"',
      "git remote add origin URL",
      "git push -u origin main",
    ],
  },
  {
    id: 2,
    type: "command",
    question: "💻 Type the command to create a new folder named 'project':",
    correctAnswer: "mkdir project",
  },
  {
    id: 3,
    type: "sorting",
    question: "🧠 Arrange the steps of compiling and running a C program:",
    options: ["gcc hello.c -o hello", "./hello", "nano hello.c"],
    answer: ["nano hello.c", "gcc hello.c -o hello", "./hello"],
  },
  {
    id: 4,
    type: "command",
    question: "💻 Type the command to list all files in a directory:",
    correctAnswer: "ls",
  },
];

export default function CompGameScreen() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const challenge = challenges[currentChallenge];

  const handleSelect = (option: string) => {
    if (!selectedOrder.includes(option)) {
      setSelectedOrder([...selectedOrder, option]);
    }
  };

  const checkAnswer = () => {
    let isCorrect = false;

    if (challenge.type === "sorting" && challenge.answer) {
      isCorrect =
        JSON.stringify(selectedOrder) === JSON.stringify(challenge.answer);
    } else if (challenge.type === "command" && "correctAnswer" in challenge) {
      isCorrect = userInput.trim() === challenge.correctAnswer;
    }

    if (isCorrect) {
      setScore((prev) => prev + 25);
    }
    nextChallenge();
  };

  const nextChallenge = () => {
    setSelectedOrder([]);
    setUserInput("");
    if (currentChallenge + 1 < challenges.length) {
      setCurrentChallenge(currentChallenge + 1);
    } else {
      setCompleted(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setSelectedOrder([]);
    setUserInput("");
    setCurrentChallenge(0);
    setCompleted(false);
  };

  return (
    <LinearGradient
      colors={["#ffffff", "#fddde6", "#e0c3fc"]}
      style={styles.container}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
    >
      {completed ? (
        <View>
          <Text style={styles.title}>Game Over!</Text>
          <Text style={styles.score}>Your Score: {score} / 100</Text>
          <Text style={styles.result}>
            {score >= 70
              ? "🎉 👨‍🎓 You Passed! 👩‍🎓 🎉"
              : "😢 Oops sorry you Didn't Pass!"}
          </Text>
          <Pressable style={styles.resetBtn} onPress={resetGame}>
            <Text style={styles.resetText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text style={styles.title}>Challenge {currentChallenge + 1}</Text>
          <Text style={styles.question}>{challenge.question}</Text>

          {challenge.type === "sorting" && challenge.options && (
            <View style={styles.optionsContainer}>
              {challenge.options.map((option, index) => (
                <Pressable
                  key={index}
                  style={
                    selectedOrder.includes(option)
                      ? styles.optionDisabled
                      : styles.option
                  }
                  disabled={selectedOrder.includes(option)}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </Pressable>
              ))}

              <Text style={styles.subheading}>Your Order:</Text>
              <View style={styles.selectedContainer}>
                {selectedOrder.map((item, index) => (
                  <Text key={index} style={styles.selectedItem}>
                    {index + 1}. {item}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {challenge.type === "command" && (
            <TextInput
              style={styles.input}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Type your answer..."
              placeholderTextColor="#666"
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}

          <Pressable style={styles.checkBtn} onPress={checkAnswer}>
            <Text style={styles.checkText}>Submit</Text>
          </Pressable>
        </KeyboardAvoidingView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    backgroundColor: "#6a1b9a",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
  },
  optionDisabled: {
    backgroundColor: "#bbb",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  selectedContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  selectedItem: {
    fontSize: 14,
    marginVertical: 2,
  },
  checkBtn: {
    backgroundColor: "#6a1b9a",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  checkText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  result: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
    color: "#6a1b9a",
  },
  resetBtn: {
    backgroundColor: "#6a1b9a",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  resetText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
