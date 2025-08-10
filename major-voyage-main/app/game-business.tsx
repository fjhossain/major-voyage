import { useState } from "react";
import {
  Text,
  View,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native"; 
import { useRouter } from "expo-router";

export default function GameBusiness() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const scenarios = [
    {
      situation: "Your startup is low on funds. What do you do?",
      choices: [
        { text: "Pitch to investors", score: 3 },
        { text: "Cut team salaries", score: 1 },
        { text: "Pause new features", score: 2 },
      ],
    },
    {
      situation: "A competitor launches a similar product. Your move?",
      choices: [
        { text: "Innovate quickly", score: 3 },
        { text: "Lower your price", score: 2 },
        { text: "File a complaint", score: 1 },
      ],
    },
    {
      situation: "Your team is missing deadlines. How do you handle it?",
      choices: [
        { text: "Hold a retrospective meeting", score: 3 },
        { text: "Give them a warning", score: 1 },
        { text: "Hire external help", score: 2 },
      ],
    },
    {
      situation:
        "You need to increase brand visibility. What’s the best strategy?",
      choices: [
        { text: "Launch a social media campaign", score: 3 },
        { text: "Buy print ads", score: 1 },
        { text: "Sponsor a local event", score: 2 },
      ],
    },
    {
      situation: "A key team member wants to leave. What’s your reaction?",
      choices: [
        { text: "Offer them a promotion", score: 2 },
        { text: "Conduct an exit interview", score: 1 },
        { text: "Understand their goals and try to align", score: 3 },
      ],
    },
    {
      situation: "Your product has a critical bug affecting customers.",
      choices: [
        { text: "Fix it quietly", score: 1 },
        { text: "Acknowledge and offer a discount", score: 3 },
        { text: "Blame a third-party vendor", score: 0 },
      ],
    },
    {
      situation: "Your marketing budget got cut by 40%. You...",
      choices: [
        { text: "Focus on organic marketing", score: 3 },
        { text: "Lay off the team", score: 0 },
        { text: "Double down on what’s working", score: 2 },
      ],
    },
    {
      situation: "You’re expanding into a new region. First step?",
      choices: [
        { text: "Do market research", score: 3 },
        { text: "Open an office immediately", score: 1 },
        { text: "Hire local influencers", score: 2 },
      ],
    },
    {
      situation: "You’re offered a partnership with a controversial brand.",
      choices: [
        { text: "Decline to protect brand image", score: 3 },
        { text: "Accept for short-term gain", score: 1 },
        { text: "Do a neutral co-marketing campaign", score: 2 },
      ],
    },
    {
      situation: "Your product is receiving mixed reviews. You...",
      choices: [
        { text: "Gather feedback and iterate", score: 3 },
        { text: "Ignore it and push forward", score: 1 },
        { text: "Release a PR statement", score: 2 },
      ],
    },
    {
      situation:
        "Sales are stagnant for the last two quarters. What do you do?",
      choices: [
        { text: "Analyze customer feedback and pivot", score: 3 },
        { text: "Increase ad spending immediately", score: 1 },
        { text: "Offer big discounts", score: 2 },
      ],
    },
    {
      situation: "You're getting negative employee reviews online.",
      choices: [
        { text: "Launch internal listening sessions", score: 3 },
        { text: "Ignore them — they’re anonymous", score: 1 },
        { text: "Offer a public statement", score: 2 },
      ],
    },
    {
      situation: "You want to launch a new product in 3 months. You...",
      choices: [
        { text: "Build an MVP and test early", score: 3 },
        { text: "Wait until it’s fully polished", score: 2 },
        { text: "Focus on marketing before building", score: 1 },
      ],
    },
  ];

  const handleChoice = (points: number) => {
    const newScore = score + points;

    if (index < scenarios.length - 1) {
      setScore(newScore);
      setIndex(index + 1);
    } else {
      const finalScore = (newScore / (scenarios.length * 3)) * 100;
      setCompleted(true);

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
                `/FeedbackBusiness?score=${finalScore}&major=Business Administration&personality=ESTP`
              ),
          },
        ]
      );
    }
  };

  const scenario = scenarios[index];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.progress}>
        Scenario {index + 1} of {scenarios.length}
      </Text>
      <Text style={styles.situation}>{scenario.situation}</Text>

      {scenario.choices.map((choice, i) => (
        <Pressable
          key={i}
          style={styles.choice}
          onPress={() => handleChoice(choice.score)}
        >
          <Text style={styles.choiceText}>{choice.text}</Text>
        </Pressable>
      ))}

      {completed && (
        <Pressable
          style={[styles.choice, { backgroundColor: "#a3c9f1", marginTop: 20 }]}
          onPress={() => {
            setIndex(0);
            setScore(0);
            setCompleted(false);
          }}
        >
          <Text style={[styles.choiceText, { fontWeight: "bold" }]}>
            🔁 Restart Game
          </Text>
        </Pressable>
      )}
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
  progress: {
    fontSize: 15,
    color: "#555",
    marginBottom: 12,
    textAlign: "center",
  },
  situation: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#222",
  },
  choice: {
    backgroundColor: "#e0ecff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  choiceText: {
    fontSize: 15,
    color: "#333",
  },
});

