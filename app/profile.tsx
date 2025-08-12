import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../lib/api";

export default function ProfileScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (!userString) {
          router.push("/login");
          return;
        }
        const user = JSON.parse(userString);
        setUserId(Number(user.id));
        setUsername(user.username || "");
        setEmail(user.email || "");

        try {
          const res = await fetch(`${API_URL}/user/${user.id}`);
          if (res.ok) {
            const fresh = await res.json();
            setUsername(fresh.username || "");
            setEmail(fresh.email || "");
          }
        } catch {}
      } catch (e) {
        console.error("Error loading user data:", e);
        await AsyncStorage.removeItem("user");
        router.push("/login");
      }
    })();
  }, []);

  const onScores = () => {
    if (!userId) {
      Alert.alert("Not signed in", "Please log in again.");
      router.push("/login");
      return;
    }
    router.push("/scores" as any);
  };

  const onPerfectMajor = () => {
    router.push("/perfect-major");
  };

  return (
    <LinearGradient colors={["#a18cd1", "#fbc2eb"]} style={styles.container}>
      <Image
        source={require("../assets/images/Profile logo.png")}
        style={styles.profileImage}
        resizeMode="contain"
      />

      <Text style={styles.greeting}>
        Hi {username || "User"}, welcome back!
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Username:</Text>
        <Text style={styles.infoText}>{username}</Text>

        <Text style={styles.infoTitle}>Email:</Text>
        <Text style={styles.infoText}>{email}</Text>

        <Text style={styles.infoTitle}>Password:</Text>
        <Text style={styles.infoText}>********</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onScores}>
        <Text style={styles.buttonText}>View My Scores</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onPerfectMajor}>
        <Text style={styles.buttonText}>View My Perfect Major</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  infoBox: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#8e2de2",
    fontWeight: "bold",
    fontSize: 16,
  },
});
