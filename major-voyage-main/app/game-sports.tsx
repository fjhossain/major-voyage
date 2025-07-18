import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type Category = "training" | "equipment" | "marketing";

type Option = {
  label: string;
  cost: number;
  impact: number;
};

const options: Record<Category, Option[]> = {
  training: [
    { label: "Basic Training ($10K)", cost: 10000, impact: 1 },
    { label: "Advanced Training ($30K)", cost: 30000, impact: 3 },
    { label: "Elite Training ($50K)", cost: 50000, impact: 5 },
    { label: "Performance Coaching ($70K)", cost: 70000, impact: 7 },
    { label: "Full International Program ($90K)", cost: 90000, impact: 9 },
  ],
  equipment: [
    { label: "Standard Gear ($10K)", cost: 10000, impact: 1 },
    { label: "Upgraded Gear ($25K)", cost: 25000, impact: 3 },
    { label: "Pro Gear ($40K)", cost: 40000, impact: 5 },
    { label: "Custom Smart Equipment ($60K)", cost: 60000, impact: 7 },
    { label: "AI-Enhanced Gear Set ($80K)", cost: 80000, impact: 9 },
  ],
  marketing: [
    { label: "Local Ads ($5K)", cost: 5000, impact: 1 },
    { label: "Online Campaign ($15K)", cost: 15000, impact: 3 },
    { label: "National Promo ($30K)", cost: 30000, impact: 5 },
    { label: "Influencer Blitz ($45K)", cost: 45000, impact: 7 },
    { label: "Global Sponsorship Deal ($60K)", cost: 60000, impact: 9 },
  ],
};

export default function BudgetChallenge() {
  const [budget, setBudget] = useState<number>(100000);
  const [selected, setSelected] = useState<Record<Category, Option | null>>({
    training: null,
    equipment: null,
    marketing: null,
  });
  const [result, setResult] = useState<string>("");

  function selectOption(category: Category, option: Option) {
    const old = selected[category];
    const oldCost = old?.cost || 0;
    const newBudget = budget + oldCost - option.cost;

    if (newBudget < 0) {
      alert("❌ Not enough budget for this choice!");
      return;
    }

    setSelected({ ...selected, [category]: option });
    setBudget(newBudget);
  }

  function calculateResult() {
    const totalImpact =
      (selected.training?.impact || 0) +
      (selected.equipment?.impact || 0) +
      (selected.marketing?.impact || 0);

    if (totalImpact >= 24) {
      setResult("🏆 Legendary Season! Your leadership was elite.");
    } else if (totalImpact >= 15) {
      setResult("👍 Great Season. The team performed very well.");
    } else if (totalImpact >= 8) {
      setResult("😐 Decent Season. You managed to stay competitive.");
    } else {
      setResult("😓 Rough Year. Poor planning impacted your team.");
    }
  }

  function resetGame() {
    setBudget(100000);
    setSelected({ training: null, equipment: null, marketing: null });
    setResult("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Budget Challenge</Text>
      <Text style={styles.budget}>
        Remaining Budget: ${budget.toLocaleString()}
      </Text>

      {result === "" ? (
        <>
          {Object.keys(options).map((category) => {
            const typedCategory = category as Category;
            return (
              <View key={typedCategory} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {typedCategory.toUpperCase()}
                </Text>
                {options[typedCategory].map((option: Option, index: number) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.optionButton,
                      selected[typedCategory]?.label === option.label &&
                        styles.selected,
                    ]}
                    onPress={() => selectOption(typedCategory, option)}
                  >
                    <Text style={styles.optionText}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
            );
          })}
          <Pressable style={styles.submitButton} onPress={calculateResult}>
            <Text style={styles.submitText}>Submit Choices</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.result}>{result}</Text>
          <Pressable style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetText}>🔁 Try Again</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f8e9",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#33691e",
  },
  budget: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#558b2f",
  },
  optionButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selected: {
    borderColor: "#558b2f",
    backgroundColor: "#dcedc8",
  },
  optionText: {
    fontSize: 16,
    color: "#33691e",
  },
  submitButton: {
    backgroundColor: "#689f38",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  result: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 30,
    color: "#33691e",
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "#33691e",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  resetText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});

