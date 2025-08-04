import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function HomeScreen() {
  const router = useRouter();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const startPoint = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const endPoint = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={StyleSheet.absoluteFill}>
        <AnimatedLinearGradient
          colors={["#7F00FF", "#2196F3", "#FFFFFF"]}
          start={{ x: startPoint, y: 0 }}
          end={{ x: endPoint, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={styles.loginButton}
      >
        <Image
          source={require("../assets/images/Profile logo.png")}
          style={styles.profileIcon}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.welcome}> 🎓Welcome!🎓</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    position: "absolute",
    top: 100,
    right: 20,
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileIcon: {
    width: 30,
    height: 30,
    tintColor: "#4B0082",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 400,
    height: 500,
    marginTop: 50,
    marginBottom: 5,
  },
  welcome: {
    fontSize: 50,
    color: "white",
    marginBottom: 40,
    fontWeight: "600",
    borderColor: "purple",
  },
});
