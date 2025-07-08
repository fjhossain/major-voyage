import { View, Text, StyleSheet } from 'react-native';

export default function ItMajorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the IT Mini Game Menu </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
