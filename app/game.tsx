import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";

export default function GameRedirector() {
  const { major } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof major === "string") {
      if (major === "Information Technology") {
        router.replace("/majors/it"); 
      } else {
        alert(`Mini-game for "${major}" is coming soon!`);
        router.replace("/"); 
      }
    }
  }, [major]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
      <Text style={styles.text}>Loading your mini-game...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { marginTop: 16, fontSize: 16 },
});
