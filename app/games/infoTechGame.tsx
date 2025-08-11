'use client';

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const problems = [
  { id: '1', problem: 'Wi-Fi not working', solution: 'Restart router' },
  { id: '2', problem: 'Computer is slow', solution: 'Clear cache' },
  { id: '3', problem: 'No sound', solution: 'Check speakers' },
];
const solutions = ['Restart router', 'Clear cache', 'Check speakers'];

const networkDevices = [
  { id: 'pc', label: 'PC', x: 50, y: 100 },
  { id: 'router', label: 'Router', x: 250, y: 100 },
  { id: 'printer', label: 'Printer', x: 150, y: 250 },
  { id: 'server', label: 'Server', x: 50, y: 350 },
  { id: 'switch', label: 'Switch', x: 250, y: 350 },
];

const correctConnections = [
  ['pc', 'router'],
  ['router', 'switch'],
  ['switch', 'server'],
  ['switch', 'printer'],
];

export default function InfoTechGame() {
  const [level, setLevel] = useState<'start1' | 'game1' | 'result1' | 'start2' | 'game2' | 'result2'>('start1');
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [dropZones, setDropZones] = useState({});
  const [connections, setConnections] = useState<[string, string][]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);


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
        const updated = { ...matches, [p.id]: solution };
        setMatches(updated);
        const correct = problems.filter(prob => updated[prob.id] === prob.solution).length;
        setScore((correct / problems.length) * 100);
      }
    }
  };

  const handleSubmitLevel1 = () => {
    setLevel('result1');
  };

  const DraggablePill = ({ label }: { label: string }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler({
      onActive: (e) => {
        translateX.value = e.translationX;
        translateY.value = e.translationY;
      },
      onEnd: (e) => {
        runOnJS(onDrop)(label, e.absoluteX, e.absoluteY);
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
  };


  const handleTapDevice = (id: string) => {
    if (selectedDevice === null) {
      setSelectedDevice(id);
    } else if (selectedDevice === id) {
      setSelectedDevice(null);
    } else {
      const newConn: [string, string] = [selectedDevice, id];
      const updated = [...connections, newConn];
      setConnections(updated);

      const valid = updated.filter(([a, b]) =>
        correctConnections.some(
          ([x, y]) => (x === a && y === b) || (x === b && y === a)
        )
      ).length;
      setScore((valid / correctConnections.length) * 100);
      setSelectedDevice(null);
    }
  };

  const renderCables = () => (
    <Svg style={StyleSheet.absoluteFill}>
      {connections.map(([fromId, toId], i) => {
        const from = networkDevices.find(d => d.id === fromId);
        const to = networkDevices.find(d => d.id === toId);
        if (!from || !to) return null;
        return (
          <Line
            key={i}
            x1={from.x + 40}
            y1={from.y + 20}
            x2={to.x + 40}
            y2={to.y + 20}
            stroke="#8b5cf6"
            strokeWidth={4}
          />
        );
      })}
    </Svg>
  );


  if (level === 'start1') {
    return (
      <View style={styles.startScreen}>
        <Image source={require('@/assets/images/it-start.png')} style={styles.fullImage} />
        <View style={styles.overlay}>
          <Text style={styles.startTitle}>Troubleshoot IT - Level 1</Text>
          <Pressable style={styles.startButton} onPress={() => setLevel('game1')}>
            <Text style={styles.buttonText}>Start Game</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (level === 'game1') {
    return (
      <GestureHandlerRootView style={styles.gameScreen1}>
        <Text style={styles.subtitle}>Match Problems to Solutions</Text>
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
              <Text>{matches[p.id] || 'Drop Here'}</Text>
            </View>
          </View>
        ))}
        <View style={styles.draggables}>
          {solutions.map((s, i) => (
            <DraggablePill key={i} label={s} />
          ))}
        </View>
        <Pressable style={styles.submitButton} onPress={handleSubmitLevel1}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </GestureHandlerRootView>
    );
  }

  if (level === 'result1') {
    return (
      <View style={styles.resultScreen}>
        <Text style={styles.resultText}>{score >= 70 ? ` Passed with ${Math.round(score)}%` : ` Failed with ${Math.round(score)}%`}</Text>
        {score >= 70 ? (
          <Pressable style={styles.successButton} onPress={() => setLevel('start2')}>
            <Text style={styles.buttonText}>Play Level 2</Text>
          </Pressable>
        ) : (
          <>
            <Pressable style={styles.retryButton} onPress={() => setLevel('game1')}>
              <Text style={styles.buttonText}>Try Again</Text>
            </Pressable>
            <Pressable style={styles.retryButton} onPress={() => setLevel('start1')}>
              <Text style={styles.buttonText}>Go Home</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  if (level === 'start2') {
    return (
      <View style={[styles.startScreen, { backgroundColor: '#ffe4e6' }]}>
        <Image source={require('@/assets/images/network-start.png')} style={styles.fullImage} />
        <View style={styles.overlay}>
          <Text style={styles.startTitle}>Build the Network - Level 2</Text>
          <Pressable style={styles.startButton} onPress={() => setLevel('game2')}>
            <Text style={styles.buttonText}>Start Game</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (level === 'game2') {
    return (
      <View style={styles.networkScreen}>
        {renderCables()}
        <Text style={styles.subtitle}>Tap devices to connect</Text>
        {networkDevices.map((dev, i) => (
          <Pressable
            key={i}
            style={[styles.deviceIcon, { left: dev.x, top: dev.y, backgroundColor: selectedDevice === dev.id ? '#8b5cf6' : '#ddd' }]}
            onPress={() => handleTapDevice(dev.id)}
          >
            <Text>{dev.label}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.submitButton} onPress={() => setLevel('result2')}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </View>
    );
  }

  if (level === 'result2') {
    return (
      <View style={styles.resultScreen}>
        <Text style={styles.resultText}>{score >= 70 ? ` Connected! ${Math.round(score)}%` : ` Failed: ${Math.round(score)}%`}</Text>
        {score >= 70 ? (
          <Pressable style={styles.successButton}>
            <Text style={styles.buttonText}>Play Level 3</Text>
          </Pressable>
        ) : (
          <>
            <Pressable style={styles.retryButton} onPress={() => setLevel('game2')}>
              <Text style={styles.buttonText}>Try Again</Text>
            </Pressable>
            <Pressable style={styles.retryButton} onPress={() => setLevel('start1')}>
              <Text style={styles.buttonText}>Go Home</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  } 
   

  return null;
}

const styles = StyleSheet.create({
  startScreen: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  startButton: {
    backgroundColor: '#6b21a8',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gameScreen1: {
    flex: 1,
    backgroundColor: '#ede9fe',
    padding: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 20,
    color: '#4c1d95',
  },
  problemCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '90%',
    alignItems: 'center',
  },
  problemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropZone: {
    borderWidth: 2,
    borderColor: '#c4b5fd',
    backgroundColor: '#faf5ff',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  draggables: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
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
  resultScreen: {
    flex: 1,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginVertical: 10,
  },
  retryButton: {
    backgroundColor: '#f87171',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginVertical: 10,
  },
  networkScreen: {
    flex: 1,
    backgroundColor: '#ffe4e6',
    padding: 20,
    justifyContent: 'center',
  },
  deviceIcon: {
    position: 'absolute',
    width: 80,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4b5563',
  },
});
