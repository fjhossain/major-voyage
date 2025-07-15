import React, { useEffect, useRef } from "react";
import 'react-native-gesture-handler';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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

      <View style={styles.content}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.welcome}> 🎓Welcome!🎓</Text>

        <TouchableOpacity
          onPress={() => router.push("/personality")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Take a Personality Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 400,
    height: 500,
    marginBottom: 5,
  },
  welcome: {
    fontSize: 50,
    color: "white",
    marginBottom: 40,
    fontWeight: "600",
    borderColor: "purple",
  },
  button: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    borderColor: "purple",
  },
  buttonText: {
    color: "#4B0082",
    fontSize: 20,
    fontWeight: "600",
  },
});
