import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ArtsMajorGameScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Performing Arts Screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6a1b9a",
  },
});

