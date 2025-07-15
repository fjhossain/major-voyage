
'use client';

import 'react-native-gesture-handler';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  LayoutRectangle,
 
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

type Item = { id: string; problem: string; solution: string };

const problems: Item[] = [
  { id: '1', problem: 'Wi-Fi not working', solution: 'Restart router' },
  { id: '2', problem: 'Computer is slow', solution: 'Clear cache' },
  { id: '3', problem: 'No sound', solution: 'Check speakers' },
];

export default function InfoTechGame() {
  
  const [started, setStarted] = useState(false);
  const [placements, setPlacements] = useState<Record<string, LayoutRectangle>>(
    {},
  ); 
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;


  const handleDrop = (probId: string, solId: string) => {
    const updated = { ...matches, [probId]: solId };
    setMatches(updated);

    if (Object.keys(updated).length === problems.length) {
      const correct = problems.filter((p) => updated[p.id] === p.solution)
        .length;
      const pct = (correct / problems.length) * 100;
      setScore(pct);
      setCompleted(true);
      Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  };

  if (!started) {
    return (
      <View style={styles.startScreen}>
        
        <Text style={styles.startTitle}>Troubleshoot IT — Level 1</Text>
        <Pressable style={styles.startBtn} onPress={() => setStarted(true)}>
          <Text style={styles.startBtnTxt}>Start Game</Text>
        </Pressable>
      </View>
    );
  }

  if (completed) {
    return (
      <Animated.View style={[styles.resultScreen, { opacity: fade }]}>
        <Text style={styles.resultMain}>
          {score >= 70 ? 'Success ' : 'Failed '}
        </Text>
        <Text style={styles.resultPct}>{Math.round(score)} %</Text>
        <Pressable style={styles.startBtn} onPress={() => setStarted(false)}>
          <Text style={styles.startBtnTxt}>Play Again</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View style={styles.gameScreen}>
      <Text style={styles.gameTitle}>Drag each solution onto the right problem</Text>

    
      {problems.map((item) => (
        <View
          key={item.id}
          style={[
            styles.problemBox,
            matches[item.id] && { borderColor: '#4ade80' },
          ]}
          onLayout={(e) =>
            setPlacements((prev) => ({ ...prev, [item.id]: e.nativeEvent.layout }))
          }
        >
          <Text style={styles.problemTxt}>{item.problem}</Text>
          <Text style={styles.dropTxt}>
            {matches[item.id] ? ' Placed!' : 'Drop solution here'}
          </Text>
        </View>
      ))}

    
      <View style={styles.solutionsRow}>
        {problems.map((item) => (
          <DraggablePill
            key={item.id}
            label={item.solution}
            id={item.solution}
            placements={placements}
            onDrop={handleDrop}
          />
        ))}
      </View>
    </View>
  );
}


function DraggablePill({
  id,
  label,
  placements,
  onDrop,
}: {
  id: string;
  label: string;
  placements: Record<string, LayoutRectangle>;
  onDrop: (probId: string, solId: string) => void;
}) {
  const transX = useRef(new Animated.Value(0)).current;
  const transY = useRef(new Animated.Value(0)).current;
  const [dragging, setDragging] = useState(false);

  return (
    <PanGestureHandler
      onGestureEvent={Animated.event([{ nativeEvent: { translationX: transX, translationY: transY } }], {
        useNativeDriver: false,
      })}
      onBegan={() => setDragging(true)}
      onEnded={(e) => {
        setDragging(false);
        // check overlap with any drop-zone
        const drop = Object.entries(placements).find(([, rect]) => {
          const x = e.nativeEvent.absoluteX;
          const y = e.nativeEvent.absoluteY;
          return (
            x > rect.x &&
            x < rect.x + rect.width &&
            y > rect.y &&
            y < rect.y + rect.height
          );
        });
        if (drop) {
          onDrop(drop[0], id); // probId, solId
        }
        // reset position
        transX.setValue(0);
        transY.setValue(0);
      }}
    >
      <Animated.View
        style={[
          styles.solutionPill,
          {
            transform: [{ translateX: transX }, { translateY: transY }],
            opacity: dragging ? 0.8 : 1,
          },
        ]}
      >
        <Text style={styles.solutionTxt}>{label}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
}


const styles = StyleSheet.create({
 
  startScreen: {
    flex: 1,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  //hero: { width: 220, height: 140, marginBottom: 40 },
  startTitle: { fontSize: 26, color: 'white', fontWeight: '700', textAlign: 'center', marginBottom: 30 },
  startBtn: { backgroundColor: '#4c1d95', padding: 16, borderRadius: 10 },
  startBtnTxt: { color: 'white', fontWeight: 'bold' },


  gameScreen: { flex: 1, backgroundColor: '#ede9fe', padding: 20 },
  gameTitle: { textAlign: 'center', fontSize: 18, fontWeight: '600', color: '#4c1d95', marginBottom: 10 },
  problemBox: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#ddd6fe',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
  },
  problemTxt: { fontWeight: 'bold', marginBottom: 6, color: '#4c1d95' },
  dropTxt: { color: '#6b7280', fontStyle: 'italic' },
  solutionsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 },
  solutionPill: {
    backgroundColor: '#c4b5fd',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    elevation: 3,
  },
  solutionTxt: { color: '#37296b', fontWeight: '600' },


  resultScreen: {
    flex: 1,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultMain: { fontSize: 28, fontWeight: '700', color: 'white' },
  resultPct: { fontSize: 40, fontWeight: '800', color: 'white', marginTop: 10 },
});
