import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://10.0.0.44:5000/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Save user info to AsyncStorage for profile screen
        const userInfo = {
          id: response.data.userId,
          email: response.data.email,
          username: response.data.username,
        };
        await AsyncStorage.setItem("user", JSON.stringify(userInfo));

        setLoading(false);
        router.push("/personality");
      } else {
        setLoading(false);
        Alert.alert(
          "Login Failed",
          response.data.message || "Invalid credentials"
        );
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        Alert.alert("Login error", error.response.data.message);
      } else {
        Alert.alert("Login error", "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/Profile logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.registerText}>
          Don't have an account? Create one
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    tintColor: "#4B0082",
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    fontWeight: "700",
    color: "#4B0082",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#9370DB",
  },
  button: {
    backgroundColor: "#4B0082",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  registerText: {
    color: "#4B0082",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
