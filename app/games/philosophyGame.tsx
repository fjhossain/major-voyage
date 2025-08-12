import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../lib/api";

const { width } = Dimensions.get("window");
const CURRENT_MAJOR = "Philosophy";

const challenges = [
  {
    question: "Which philosophy values pleasure as the highest good?",
    options: ["Stoicism", "Epicureanism", "Existentialism"],
    correctIndex: 1,
    emoji: "🍷",
  },
  {
    question: "Which philosophy asks, 'What can I know?'",
    options: ["Rationalism", "Skepticism", "Empiricism"],
    correctIndex: 1,
    emoji: "❓",
  },
  {
    question: "Who said 'I think, therefore I am'?",
    options: ["Kant", "Plato", "Descartes"],
    correctIndex: 2,
    emoji: "🧠",
  },
  {
    question: "Which philosopher believed in the 'will to power'?",
    options: ["Nietzsche", "Socrates", "Hobbes"],
    correctIndex: 0,
    emoji: "⚡",
  },
  {
    question: "What is the 'categorical imperative' associated with?",
    options: ["Kant", "Mill", "Aristotle"],
    correctIndex: 0,
    emoji: "📜",
  },
  {
    question: "Who said, 'The unexamined life is not worth living'?",
    options: ["Plato", "Socrates", "Descartes"],
    correctIndex: 1,
    emoji: "🔍",
  },
  {
    question: "Which philosophy emphasizes living in harmony with nature?",
    options: ["Epicureanism", "Stoicism", "Existentialism"],
    correctIndex: 1,
    emoji: "🌿",
  },
  {
    question: "Who wrote 'Thus Spoke Zarathustra'?",
    options: ["Nietzsche", "Kant", "Locke"],
    correctIndex: 0,
    emoji: "📚",
  },
  {
    question: "Which philosophy argues all knowledge comes from experience?",
    options: ["Empiricism", "Rationalism", "Skepticism"],
    correctIndex: 0,
    emoji: "👁️",
  },
  {
    question: "Who is famous for the 'social contract' theory?",
    options: ["Hobbes", "Mill", "Nietzsche"],
    correctIndex: 0,
    emoji: "🤝",
  },
];

type Params = { userId?: string; sessionId?: string; otherMajor?: string };

export default function PhilosophyEmojiDrag() {
  const {
    userId: userIdParam,
    sessionId: sessionIdParam,
    otherMajor,
  } = useLocalSearchParams<Params>();
  const userId = userIdParam ? Number(userIdParam) : undefined;
  const initialSessionId = sessionIdParam ? Number(sessionIdParam) : undefined;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [sessionId, setSessionId] = useState<number | undefined>(
    initialSessionId
  );

  const hasSavedRef = useRef(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const optionLayouts = useRef<
    (null | { x: number; y: number; width: number; height: number })[]
  >([]);

  useEffect(() => {
    // Recover sessionId if missing
    (async () => {
      if (sessionId || !userId) return;
      try {
        const res = await fetch(`${API_URL}/api/users/${userId}/sessions`);
        if (!res.ok) return;
        const rows: Array<{
          id: number;
          major1: string;
          major2: string;
          created_at: string;
        }> = await res.json();
        const normalize = (s: string) => s.trim().toLowerCase();
        const other = (otherMajor || "").trim();
        const found = rows.find((r) => {
          const a = normalize(r.major1);
          const b = normalize(r.major2);
          const x = normalize(CURRENT_MAJOR);
          const y = normalize(other);
          return (
            (a === x && b === y) || (a === y && b === x) || a === x || b === x
          );
        });
        if (found) setSessionId(found.id);
      } catch {}
    })();
  }, [sessionId, userId, otherMajor]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gesture) => {
        pan.flattenOffset();
        const layouts = optionLayouts.current;
        const touchX = gesture.moveX;
        const touchY = gesture.moveY;
        let droppedOnIndex = -1;
        for (let i = 0; i < layouts.length; i++) {
          const layout = layouts[i];
          if (layout) {
            if (
              touchX >= layout.x &&
              touchX <= layout.x + layout.width &&
              touchY >= layout.y &&
              touchY <= layout.y + layout.height
            ) {
              droppedOnIndex = i;
              break;
            }
          }
        }
        if (droppedOnIndex === challenges[currentIndex].correctIndex) {
          setScore((prev) => prev + 10);
          goNext();
        } else if (droppedOnIndex !== -1) {
          goNext();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const fetchWithTimeout = async (
    input: RequestInfo | URL,
    init?: RequestInit,
    ms = 12000
  ) =>
    await Promise.race([
      fetch(input, init),
      new Promise<Response>((_r, reject) =>
        setTimeout(() => reject(new Error("timeout")), ms)
      ),
    ]);

  const saveScore = async () => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;
    try {
      if (userId && sessionId) {
        const res = await fetchWithTimeout(
          `${API_URL}/api/sessions/${sessionId}/score`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ major: CURRENT_MAJOR, score }),
          }
        );
        if (res.ok) {
          console.log("Saved to session scoring");
          return;
        }
      }
      if (userId) {
        await fetchWithTimeout(`${API_URL}/save-single-score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, majorName: CURRENT_MAJOR, score }),
        });
        console.log("Saved via legacy scoring");
      }
    } catch (e) {
      console.log("Save score failed (ignored):", (e as any)?.message || e);
    }
  };

  const goNext = () => {
    pan.setValue({ x: 0, y: 0 });
    if (currentIndex + 1 === challenges.length) {
      setShowResults(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (showResults) saveScore();
  }, [showResults]);

  const restart = () => {
    setScore(0);
    setCurrentIndex(0);
    setShowResults(false);
    pan.setValue({ x: 0, y: 0 });
    hasSavedRef.current = false;
  };

  const challenge = challenges[currentIndex];

  if (showResults || !challenge) {
    return (
      <LinearGradient
        colors={["#5f72be", "#9921e8"]}
        style={styles.resultsContainer}
      >
        <Text style={styles.finalText}>Game Over!</Text>
        <Text style={styles.scoreText}>
          Your Score: {score} / {challenges.length * 10}
        </Text>
        <Text style={styles.resultText}>
          {score >= 70 ? "🎉 You Passed!" : "💡 Try Again!"}
        </Text>
        <TouchableOpacity onPress={restart} style={styles.restartButton}>
          <Text style={styles.restartText}>Play Again</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#8194e0ff", "#c097dbff"]}
      style={styles.container}
    >
      <Text style={styles.question}>{challenge.question}</Text>

      <View style={styles.optionsContainer}>
        {challenge.options.map((option, i) => (
          <View
            key={i}
            style={styles.option}
            onLayout={(e) => {
              e.target.measure?.((x, y, w, h, pageX, pageY) => {
                optionLayouts.current[i] = {
                  x: pageX,
                  y: pageY,
                  width: w,
                  height: h,
                };
              });
            }}
          >
            <Text style={styles.optionText}>{option}</Text>
          </View>
        ))}
      </View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.emojiContainer,
          { transform: pan.getTranslateTransform() },
        ]}
      >
        <Text style={styles.emoji}>{challenge.emoji}</Text>
      </Animated.View>

      <Text style={styles.instruction}>
        Drag the emoji to the correct answer
      </Text>
      <Text style={styles.scoreDisplay}>Score: {score}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  question: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#fff",
  },
  optionsContainer: { marginBottom: 60, width: "100%" },
  option: {
    backgroundColor: "rgba(94, 14, 88, 0.22)",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  optionText: { fontSize: 18, fontWeight: "600", color: "#fff" },
  emojiContainer: {
    position: "absolute",
    bottom: 100,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    backgroundColor: "purple",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  emoji: { fontSize: 36 },
  instruction: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#eee",
  },
  scoreDisplay: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#fff",
  },
  finalText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  scoreText: { fontSize: 24, color: "#fff", textAlign: "center" },
  resultText: {
    fontSize: 22,
    color: "#fff",
    marginTop: 16,
    textAlign: "center",
  },
  restartButton: {
    marginTop: 30,
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  restartText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});
