// app/scores/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_URL } from "../../lib/api";

type SessionRow = {
  id: number;
  major1: string;
  major2: string;
  created_at: string;
};
type ScoreRow = { major: string; score: number };
type SessionInfo = {
  id: number;
  user_id: number;
  major1: string;
  major2: string;
  created_at: string;
};
type ScoresResponse = { session: SessionInfo; scores: ScoreRow[] };

export default function ScoresScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [scoreModalVisible, setScoreModalVisible] = useState(false);
  const [activeScores, setActiveScores] = useState<ScoresResponse | null>(null);
  const [mountedAt] = useState(() => new Date().toLocaleTimeString());

  // 1) Load current user from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const userStr = await AsyncStorage.getItem("user");
        if (!userStr) {
          router.push("/login");
          return;
        }
        const user = JSON.parse(userStr);
        setUserId(Number(user.id));
      } catch {
        router.push("/login");
      }
    })();
  }, []);

  const loadSessions = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}/sessions`);
      if (!res.ok) {
        const text = await res.text();
        console.log("GET /api/users/:id/sessions failed:", res.status, text);
        throw new Error(text || `HTTP ${res.status}`);
      }
      const data: SessionRow[] = await res.json();
      setSessions(data);
      console.log("Sessions loaded:", data);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) loadSessions();
  }, [userId, loadSessions]);

  const openScores = async (sessionId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/sessions/${sessionId}/scores`);
      if (!res.ok) throw new Error(await res.text());
      const data: ScoresResponse = await res.json();
      setActiveScores(data);
      setScoreModalVisible(true);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to fetch scores.");
    }
  };

  const gotoPerfectMajor = async (sessionId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/sessions/${sessionId}/winner`);
      if (!res.ok) throw new Error(await res.text());
      const data: { winner: string; scores: Record<string, number> } =
        await res.json();
      if (!data?.winner || data.winner === "tie") {
        Alert.alert(
          "No clear winner",
          "Scores are tied or missing for this session."
        );
        return;
      }

      const winnerKey = data.winner.trim().toLowerCase();
      const to =
        winnerKey === "computer science"
          ? "/feedbacks/compsciscreen"
          : winnerKey === "philosophy"
          ? "/feedbacks/philscreen"
          : "/perfect-major";

      router.push({
        pathname: to as any,
        params: { sessionId: String(sessionId), userId: String(userId ?? "") },
      });
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to compute winner.");
    }
  };

  return (
    <LinearGradient colors={["#a18cd1", "#fbc2eb"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.debug}>/scores mounted at {mountedAt}</Text>
        <Text style={styles.debugSmall}>API_URL: {API_URL}</Text>
        <Text style={styles.debugSmall}>userId: {userId ?? "(none)"}</Text>

        <Text style={styles.title}>My Sessions</Text>

        {!userId ? (
          <View style={styles.center}>
            <Text style={{ fontSize: 16, color: "#333", textAlign: "center" }}>
              Loading user…
            </Text>
          </View>
        ) : loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 8 }}>Loading…</Text>
          </View>
        ) : (
          <>
            <Pressable style={styles.refreshBtn} onPress={loadSessions}>
              <Text style={styles.refreshText}>Refresh</Text>
            </Pressable>

            {sessions.length === 0 ? (
              <View style={styles.center}>
                <Text
                  style={{ fontSize: 16, color: "#333", textAlign: "center" }}
                >
                  No sessions yet for user #{userId}. From your Personality
                  Result screen, tap a major to start a session, then play both
                  games.
                </Text>
              </View>
            ) : (
              <FlatList
                data={sessions}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                      {item.major1} vs {item.major2}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {new Date(item.created_at).toLocaleString()}
                    </Text>

                    <View style={styles.row}>
                      <Pressable
                        style={styles.btnPrimary}
                        onPress={() => openScores(item.id)}
                      >
                        <Text style={styles.btnText}>View Scores</Text>
                      </Pressable>
                      <Pressable
                        style={styles.btnSecondary}
                        onPress={() => gotoPerfectMajor(item.id)}
                      >
                        <Text style={styles.btnText}>Perfect Major</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              />
            )}
          </>
        )}

        {/* Score Modal */}
        <Modal
          visible={scoreModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setScoreModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Session Scores</Text>
              {activeScores ? (
                <>
                  <Text style={styles.meta}>
                    Session #{activeScores.session.id} •{" "}
                    {new Date(activeScores.session.created_at).toLocaleString()}
                  </Text>
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreLine}>
                      {activeScores.session.major1}:{" "}
                      {activeScores.scores.find(
                        (s) => s.major === activeScores.session.major1
                      )?.score ?? 0}
                    </Text>
                    <Text style={styles.scoreLine}>
                      {activeScores.session.major2}:{" "}
                      {activeScores.scores.find(
                        (s) => s.major === activeScores.session.major2
                      )?.score ?? 0}
                    </Text>
                  </View>
                </>
              ) : (
                <Text>No scores yet for this session.</Text>
              )}

              <Pressable
                style={styles.closeBtn}
                onPress={() => setScoreModalVisible(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  debug: {
    textAlign: "center",
    color: "#333",
    marginTop: 8,
    fontWeight: "700",
  },
  debugSmall: {
    textAlign: "center",
    color: "#333",
    marginTop: 2,
    fontSize: 12,
  },
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 12,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  refreshBtn: {
    alignSelf: "center",
    backgroundColor: "#6a1b9a",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  refreshText: { color: "#fff", fontWeight: "700" },

  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
    color: "#3d2c8d",
  },
  cardMeta: { fontSize: 12, color: "#555", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  btnPrimary: {
    backgroundColor: "#6a1b9a",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  btnSecondary: {
    backgroundColor: "#9c27b0",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  meta: { textAlign: "center", color: "#444", marginBottom: 12 },
  scoreBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  scoreLine: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 4,
    textAlign: "center",
  },
  closeBtn: {
    backgroundColor: "#6a1b9a",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontWeight: "700" },
});
