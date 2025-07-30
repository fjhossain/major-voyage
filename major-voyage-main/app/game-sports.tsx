import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";

type Category = "training" | "equipment" | "marketing";

type Option = {
  label: string;
  cost: number;
  impact: number;
};

type LevelOptions = {
  [key in Category]: Option[];
};

const levelOptions: LevelOptions[] = [
  {
    training: [
      { label: "Basic Training ($10K)", cost: 10, impact: 1 },
      { label: "Advanced Training ($20K)", cost: 20, impact: 3 },
      { label: "Elite Training ($30K)", cost: 30, impact: 5 },
    ],
    equipment: [
      { label: "Standard Gear ($10K)", cost: 10, impact: 1 },
      { label: "Pro Gear ($30K)", cost: 30, impact: 5 },
    ],
    marketing: [
      { label: "Local Ads ($5K)", cost: 5, impact: 1 },
      { label: "National Promo ($30K)", cost: 30, impact: 5 },
    ],
  },
  {
    training: [
      { label: "Performance Coaching ($40K)", cost: 40, impact: 7 },
      { label: "Full International Program ($60K)", cost: 60, impact: 9 },
    ],
    equipment: [
      { label: "Smart Equipment ($40K)", cost: 40, impact: 7 },
      { label: "AI-Enhanced Gear ($60K)", cost: 60, impact: 9 },
    ],
    marketing: [
      { label: "Influencer Blitz ($40K)", cost: 40, impact: 7 },
      { label: "Global Deal ($60K)", cost: 60, impact: 9 },
    ],
  },
  {
    training: [
      { label: "Olympic-Level Bootcamp ($80K)", cost: 80, impact: 10 },
    ],
    equipment: [
      { label: "Neural Performance Gear ($80K)", cost: 80, impact: 10 },
    ],
    marketing: [{ label: "Metaverse Branding ($80K)", cost: 80, impact: 10 }],
  },
];

const maxImpactPerLevel = levelOptions.map((level) =>
  Object.values(level).reduce((sum, options) => {
    const max = Math.max(...options.map((opt) => opt.impact));
    return sum + max;
  }, 0)
);
const totalMaxImpact = maxImpactPerLevel.reduce((a, b) => a + b, 0);

export default function SportsAdminGame() {
  const [level, setLevel] = useState(0);
  const [selections, setSelections] = useState<
    Partial<Record<Category, Option>>
  >({});
  const [totalScore, setTotalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentOptions = levelOptions[level];

  const handleSelect = (category: Category, option: Option) => {
    setSelections((prev) => ({
      ...prev,
      [category]: option,
    }));
  };

  const handleNext = () => {
    const levelScore = Object.values(selections).reduce(
      (sum, opt) => sum + (opt?.impact || 0),
      0
    );
    const updatedTotal = totalScore + levelScore;

    if (level < levelOptions.length - 1) {
      setTotalScore(updatedTotal);
      setSelections({});
      setLevel(level + 1);
    } else {
      setTotalScore(updatedTotal);
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setLevel(0);
    setSelections({});
    setTotalScore(0);
    setShowResult(false);
  };

  if (showResult) {
    const passed = totalScore >= totalMaxImpact * 0.7;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Game Over</Text>
        <Text style={styles.result}>
          Your Total Score: {totalScore} / {totalMaxImpact}
        </Text>
        <Text style={[styles.result, { color: passed ? "green" : "red" }]}>
          {passed ? "You Passed!" : "You Failed!"}
        </Text>
        <Pressable onPress={handleRestart} style={styles.button}>
          <Text style={styles.buttonText}>Restart</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>Level {level + 1}</Text>

        {(Object.keys(currentOptions) as Category[]).map((category) => (
          <View key={category}>
            <Text style={styles.category}>{category.toUpperCase()}</Text>
            {currentOptions[category].map((opt, index) => {
              const selected = selections[category]?.label === opt.label;
              return (
                <Pressable
                  key={index}
                  onPress={() => handleSelect(category, opt)}
                  style={[styles.option, selected && styles.selected]}
                >
                  <Text style={styles.optionText}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}

        {Object.keys(selections).length === 3 && (
          <Pressable onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        )}
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
  },
  category: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 15,
  },
  option: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginVertical: 5,
  },
  selected: {
    backgroundColor: "#cce5ff",
  },
  optionText: {
    fontSize: 16,
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
  result: {
    fontSize: 20,
    marginVertical: 10,
    textAlign: "center",
  },
});
