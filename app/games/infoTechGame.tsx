'use client';

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  //Image,
  Alert,
  LayoutRectangle,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const problems = [
  { id: '1', problem: 'Wi-Fi not working', solution: 'Restart router' },
  { id: '2', problem: 'Computer is slow', solution: 'Clear cache' },
  { id: '3', problem: 'No sound', solution: 'Check speakers' },
];

const solutions = [
  'Restart router',
  'Clear cache',
  'Check speakers',
];

export default function InfoTechGame() {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [dropZones, setDropZones] = useState<Record<string, LayoutRectangle>>({});

  const onDrop = (solution: string, gestureX: number, gestureY: number) => {
    for (const p of problems) {
      const zone = dropZones[p.id];
      if (
        zone &&
        gestureX > zone.x &&
        gestureX < zone.x + zone.width &&
        gestureY > zone.y &&
        gestureY < zone.y + zone.height
      ) {
        setMatches(prev => ({ ...prev, [p.id]: solution }));

        const correct = problems.filter(pr => prev[pr.id] === pr.solution || (pr.id === p.id && solution === pr.solution)).length;
        const newScore = (correct / problems.length) * 100;
        setScore(newScore);
        return;
      }
    }
  };

  const renderDraggable = (text: string, index: number) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler({
      onActive: (event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      },
      onEnd: (event) => {
        runOnJS(onDrop)(text, event.absoluteX, event.absoluteY);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      },
    });

    const style = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    }));

    return (
      <PanGestureHandler key={index} onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.draggable, style]}>
          <Text style={styles.dragText}>{text}</Text>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  const handleSubmit = () => {
    setCompleted(true);
    const passed = score >= 70;
    Alert.alert(
      passed ? ' Level Complete' : ' Try Again',
      `You scored ${Math.round(score)}%`
    );
  };

  if (!started) {
    return (
      <View style={styles.startScreen}>
       
        <Text style={styles.title}>Troubleshoot IT - Level 1</Text>
        <Pressable style={styles.startButton} onPress={() => setStarted(true)}>
          <Text style={styles.buttonText}>Start Game</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.gameScreen}>
      <Text style={styles.subtitle}>Drag solutions to the correct problems</Text>

      <View>
        {problems.map(p => (
          <View
            key={p.id}
            onLayout={e => {
              const { layout } = e.nativeEvent;
              setDropZones(prev => ({ ...prev, [p.id]: layout }));
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
        {solutions.map((sol, i) => renderDraggable(sol, i))}
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>

      {completed && (
        <Text style={[styles.resultText, score >= 70 ? styles.pass : styles.fail]}>
          {score >= 70 ? ` Passed with ${Math.round(score)}%` : ` Failed with ${Math.round(score)}%`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9f7aea',
    padding: 20,
  },
  gameScreen: {
    flex: 1,
    backgroundColor: '#f3e8ff',
    padding: 20,
  },
  
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    color: '#4c1d95',
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
  resultText: {
    marginTop: 25,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pass: {
    color: 'green',
  },
  fail: {
    color: 'red',
  },
});
