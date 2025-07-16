'use client';

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Alert,
  LayoutRectangle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const problems = [
  { id: '1', problem: 'Wi-Fi not working', solution: 'Restart router' },
  { id: '2', problem: 'Computer is slow', solution: 'Clear cache' },
  { id: '3', problem: 'No sound', solution: 'Check speakers' },
];

const solutions = ['Restart router', 'Clear cache', 'Check speakers'];

type DraggablePillProps = {
  label: string;
  onDrop: (solution: string, x: number, y: number) => void;
};

function DraggablePill({ label, onDrop }: DraggablePillProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      runOnJS(onDrop)(label, event.absoluteX, event.absoluteY);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.draggable, style]}>
        <Text style={styles.dragText}>{label}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
}

export default function InfoTechGame() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [dropZones, setDropZones] = useState<Record<string, LayoutRectangle>>({});

  const onDrop = (solution: string, x: number, y: number) => {
    for (const p of problems) {
      const zone = dropZones[p.id];
      if (
        zone &&
        x > zone.x &&
        x < zone.x + zone.width &&
        y > zone.y &&
        y < zone.y + zone.height
      ) {
        const updatedMatches = { ...matches, [p.id]: solution };
        setMatches(updatedMatches);

        const correct = problems.filter(
          (prob) => updatedMatches[prob.id] === prob.solution
        ).length;
        const newScore = (correct / problems.length) * 100;
        setScore(newScore);
        return;
      }
    }
  };

  const handleSubmit = () => {
    setCompleted(true);
  };

  const restart = () => {
    setCompleted(false);
    setStarted(false);
    setMatches({});
    setScore(0);
  };

  if (!started) {
    return (
      <ImageBackground
        source={require('@/assets/images/it-start.png')}
        style={styles.fullscreenImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Troubleshoot IT - Level 1</Text>
          <Pressable style={styles.startButton} onPress={() => setStarted(true)}>
            <Text style={styles.buttonText}>Start Game</Text>
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  if (completed) {
    const passed = score >= 70;
    return (
      <View style={styles.resultScreen}>
        <Text style={styles.resultText}>
          {passed
            ? ` Success! You scored ${Math.round(score)}%`
            : ` Failed! You scored ${Math.round(score)}%`}
        </Text>
        {passed ? (
          <Pressable
            style={styles.nextButton}
            onPress={() => Alert.alert('Coming Soon', 'Level 2 will be unlocked!')}
          >
            <Text style={styles.buttonText}>Play Level 2</Text>
          </Pressable>
        ) : (
          <>
            <Pressable style={styles.retryButton} onPress={restart}>
              <Text style={styles.buttonText}>Try Again</Text>
            </Pressable>
            <Pressable style={styles.homeButton} onPress={() => router.push('/')}>
              <Text style={styles.buttonText}>Go Home</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.gameScreen}>
      <Text style={styles.subtitle}>Drag solutions to the correct problems</Text>

      <View>
        {problems.map((p) => (
          <View
            key={p.id}
            onLayout={(e) => {
              const layout = e.nativeEvent.layout;
              setDropZones((prev) => ({ ...prev, [p.id]: layout }));
            }}
            style={styles.problemCard}
          >
            <Text style={styles.problemText}>{p.problem}</Text>
            <View style={styles.dropZone}>
              <Text style={{ color: '#888' }}>
                {matches[p.id] || 'Drop Solution Here'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.draggables}>
        {solutions.map((sol, i) => (
          <DraggablePill key={i} label={sol} onDrop={onDrop} />
        ))}
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fullscreenImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  gameScreen: {
    flex: 1,
    backgroundColor: '#f3e8ff',
    padding: 20,
  },
  resultScreen: {
    flex: 1,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#6b21a8',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    color: '#4c1d95',
  },
  problemCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  problemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropZone: {
    borderWidth: 2,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  draggables: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    flexWrap: 'wrap',
  },
  draggable: {
    padding: 12,
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    margin: 10,
  },
  dragText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#6d28d9',
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
    alignSelf: 'center',
  },
  nextButton: {
    backgroundColor: '#4ade80',
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
  },
  retryButton: {
    backgroundColor: '#f87171',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  homeButton: {
    backgroundColor: '#60a5fa',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  resultText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});
