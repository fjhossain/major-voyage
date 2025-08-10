import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [perfectMajor, setPerfectMajor] = useState("");

  const [hidePassword, setHidePassword] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {};

    fetchUserData();
  }, []);

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
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your name"
          placeholderTextColor="#ddd"
        />

        <Text style={styles.infoTitle}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#ddd"
        />

        <Text style={styles.infoTitle}>Password:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={hidePassword}
            placeholderTextColor="#ddd"
          />
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              name={hidePassword ? "eye-off" : "eye"}
              size={20}
              color="#fff"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Pressable style={styles.button} onPress={() => router.push("")}>
        <Text style={styles.buttonText}>View My Scores</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push("")}>
        <Text style={styles.buttonText}>View My Perfect Major</Text>
      </Pressable>
    </LinearGradient>
  );
};

export default ProfileScreen;

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
  },
  input: {
    fontSize: 16,
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginBottom: 15,
    paddingVertical: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginBottom: 15,
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
  },
  buttonText: {
    color: "#8e2de2",
    fontWeight: "bold",
    fontSize: 16,
  },
});
