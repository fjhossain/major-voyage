// app/perfect-major.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { API_URL } from "../lib/api";

function normalize(m?: string) {
  return (m ?? "").trim().toLowerCase();
}

export default function PerfectMajorRedirect() {
  const router = useRouter();
  const { major, sessionId, userId } = useLocalSearchParams<{
    major?: string;
    sessionId?: string;
    userId?: string;
  }>();

  const [busy, setBusy] = useState(true);

  const goToScores = () => {
    // If your typed routes don’t yet include /scores, the cast keeps TS quiet.
    router.replace("/scores" as any);
  };

  const routeToFeedback = (winner: string, sid?: string | number) => {
    const key = normalize(winner);

    if (
      key === "computer science" ||
      key === "cs" ||
      key === "comp sci" ||
      key === "computer-science"
    ) {
      router.replace({
        pathname: "/feedbacks/compsciscreen",
        params: {
          major: winner,
          sessionId: String(sid ?? sessionId ?? ""),
          userId: String(userId ?? ""),
        },
      } as any);
      return;
    }

    if (key === "philosophy") {
      router.replace({
        pathname: "/feedbacks/philscreen",
        params: {
          major: winner,
          sessionId: String(sid ?? sessionId ?? ""),
          userId: String(userId ?? ""),
        },
      } as any);
      return;
    }

    // Unknown major — send them back to scores
    Alert.alert(
      "Unsupported major",
      `Don't have a feedback screen for "${winner}" yet.`
    );
    goToScores();
  };

  useEffect(() => {
    const go = async () => {
      try {
        // 1) If a major is already provided, route immediately
        if (major && major.length > 0) {
          routeToFeedback(String(major), sessionId);
          return;
        }

        // 2) If we have a sessionId, determine the winner from the backend
        if (sessionId) {
          const res = await fetch(
            `${API_URL}/api/sessions/${sessionId}/winner`
          );
          if (!res.ok) throw new Error(await res.text());
          const data: { winner?: string } = await res.json();

          if (!data?.winner || data.winner === "tie") {
            Alert.alert(
              "No clear winner",
              "Scores are tied or missing for this session."
            );
            goToScores();
            return;
          }

          routeToFeedback(data.winner, sessionId);
          return;
        }

        // 3) Nothing to go on
        Alert.alert("Missing info", "No major or session provided.");
        goToScores();
      } catch (e: any) {
        Alert.alert(
          "Error",
          e?.message ?? "Unable to find your perfect major right now."
        );
        goToScores();
      } finally {
        setBusy(false);
      }
    };

    void go();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient colors={["#a18cd1", "#fbc2eb"]} style={{ flex: 1 }}>
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>
          {busy ? "Finding your perfect major…" : "Redirecting…"}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { marginTop: 10, color: "#fff", fontWeight: "700" },
});
