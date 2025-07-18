'use client';

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  LayoutRectangle,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
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
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
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
  const [level, setLevel] = useState<1 | 2>(1);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [dropZones, setDropZones] = useState<Record<string, LayoutRectangle>>({});

  const [connections, setConnections] = useState<string[]>([]);
  const [networkComplete, setNetworkComplete] = useState(false);

  const handleDrop = (solution: string, x: number, y: number) => {
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
          prob => updatedMatches[prob.id] === prob.solution
        ).length;
        const newScore = (correct / problems.length) * 100;
        setScore(newScore);
        return;
      }
    }
  };

  const handleLevel1Submit = () => {
    setCompleted(true);
  };

  const handleConnection = (device: string) => {
    if (!connections.includes(device)) {
      const newConnections = [...connections, device];
      setConnections(newConnections);
      if (
        newConnections.length === 3 &&
        JSON.stringify(newConnections) === JSON.stringify(['PC', 'Router', 'Printer'])
      ) {
        setNetworkComplete(true);
        setScore(100);
        setCompleted(true);
      } else if (newConnections.length === 3) {
        setScore(33);
        setCompleted(true);
      }
    }
  };

  const handleReset = () => {
    setStarted(false);
    setCompleted(false);
    setScore(0);
    setMatches({});
    setDropZones({});
    setConnections([]);
    setNetworkComplete(false);
  };

  if (!started) {
    return (
      <View style={[styles.startScreen, level === 1 ? { backgroundColor: '#9f7aea' } : { backgroundColor: '#ffe4f0' }]}>
        <Image
          source={
            level === 1
              ? require('@/assets/images/it-start.png')
              : require('@/assets/images/network-start.png')
          }
          style={styles.fullImage}
        />
        <Text style={styles.title}>{level === 1 ? 'Troubleshoot IT - Level 1' : 'Build the Network - Level 2'}</Text>
        <Pressable style={styles.startButton} onPress={() => setStarted(true)}>
          <Text style={styles.buttonText}>Start Game</Text>
        </Pressable>
      </View>
    );
  }

  if (completed) {
    const passed = score >= 70;
    return (
      <View style={[styles.startScreen, { backgroundColor: level === 1 ? '#9f7aea' : '#ffe4f0' }]}>
        <Text style={styles.resultText}>
          {passed ? ` Success! You scored ${Math.round(score)}%` : ` Failed. You scored ${Math.round(score)}%`}
        </Text>
        {passed ? (
          <Pressable style={styles.nextButton} onPress={() => {
            if (level === 1) {
              setLevel(2);
              handleReset();
            }
          }}>
            <Text style={styles.buttonText}>Play Level 2</Text>
          </Pressable>
        ) : (
          <>
            <Pressable style={styles.tryAgainButton} onPress={handleReset}>
              <Text style={styles.buttonText}>Try Again</Text>
            </Pressable>
            <Pressable style={styles.homeButton} onPress={() => setLevel(1)}>
              <Text style={styles.buttonText}>Go Home</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={level === 1 ? styles.gameScreen : styles.gameScreenPink}>
      {level === 1 ? (
        <>
          <Text style={styles.subtitle}>Drag solutions to the correct problems</Text>
          {problems.map(p => (
            <View
              key={p.id}
              onLayout={e => {
                const layout = e.nativeEvent.layout;
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
          <View style={styles.draggables}>
            {solutions.map((sol, i) => (
              <DraggablePill key={i} label={sol} onDrop={handleDrop} />
            ))}
          </View>
          <Pressable style={styles.submitButton} onPress={handleLevel1Submit}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Tap in correct order: PC → Router → Printer</Text>
          <View style={styles.iconRow}>
            {['PC', 'Router', 'Printer'].map((device) => (
              <Pressable key={device} style={styles.iconCircle} onPress={() => handleConnection(device)}>
                <Text style={styles.iconText}>{device}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'contain',
  },
  gameScreen: {
    flex: 1,
    backgroundColor: '#f3e8ff',
    padding: 20,
  },
  gameScreenPink: {
    flex: 1,
    backgroundColor: '#ffe4f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 15,
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
  nextButton: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  tryAgainButton: {
    backgroundColor: '#f59e0b',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  homeButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
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
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 80,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#c084fc',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  iconText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
