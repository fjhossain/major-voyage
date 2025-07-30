import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/* ─── Types ─────────────────────────────────────────────────── */
type RoomStatus = 'vacant' | 'occupied' | 'checkout';

interface Room {
  id: number;
  status: RoomStatus;
  timer: number;
}

const INITIAL_ROOMS: Room[] = [
  { id: 0, status: 'vacant', timer: 0 },
  { id: 1, status: 'vacant', timer: 0 },
  { id: 2, status: 'vacant', timer: 0 },
];

export default function App() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [coins, setCoins] = useState(0);
  const [happiness, setHappiness] = useState(5);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const loop = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    if (showInstructions) return;

    loop.current = setInterval(() => {
      timeRef.current += 1;

      setRooms(prev =>
        prev.map(room => {
          if (room.status === 'vacant') return room;
          if (room.timer > 1) {
            return { ...room, timer: room.timer - 1 };
          }
          if (room.status === 'occupied') {
            return { ...room, status: 'checkout', timer: 5 };
          } else if (room.status === 'checkout') {
            setHappiness(h => Math.max(0, h - 1));
            return { ...room, status: 'vacant', timer: 0 };
          }
          return room;
        })
      );

      if (Math.random() < 0.2) {
        setRooms(prev => {
          const idx = prev.findIndex(r => r.status === 'vacant');
          if (idx === -1) return prev;
          const upd = [...prev];
          upd[idx] = { ...upd[idx], status: 'occupied', timer: 5 };
          return upd;
        });
      }

      if (timeRef.current >= 30) {
        clearInterval(loop.current!);
        setGameOver(true);
      }
    }, 1000);

    return () => {
      if (loop.current !== null) clearInterval(loop.current);
    };
  }, [showInstructions]);

  const handleRoomPress = (room: Room) => {
    if (room.status === 'checkout') {
      setRooms(prev =>
        prev.map(r =>
          r.id === room.id ? { ...r, status: 'vacant', timer: 0 } : r
        )
      );
      setCoins(c => c + 1);
    }
  };

  const resetGame = () => {
    setRooms(INITIAL_ROOMS);
    setCoins(0);
    setHappiness(5);
    setGameOver(false);
    timeRef.current = 0;
    setShowInstructions(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.title}>🏨 Hotel Havoc</Text>
        <Text style={styles.stats}>💵 {coins}  😊 {happiness}</Text>

        <View style={styles.grid}>
          {rooms.map(room => (
            <Pressable
              key={room.id}
              onPress={() => handleRoomPress(room)}
              style={[
                styles.room,
                room.status === 'vacant' && styles.vacant,
                room.status === 'occupied' && styles.occupied,
                room.status === 'checkout' && styles.checkout,
              ]}
            >
              <Text style={styles.roomText}>
                {room.status === 'vacant' && '🛏️'}
                {room.status === 'occupied' && `⏳${room.timer}`}
                {room.status === 'checkout' && `🧹${room.timer}`}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Instructions Modal */}
        <Modal visible={showInstructions} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>🧼 How to Play</Text>
              <Text style={styles.modalText}>
                Guests will check in. After a short time, they request checkout (🧹).
                Tap the room before the timer hits 0 to clean and earn coins!
                Missed checkouts reduce happiness. Survive 30 seconds!
              </Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => setShowInstructions(false)}
              >
                <Text style={styles.modalButtonText}>Start Game</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Game Over Modal */}
        <Modal visible={gameOver} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>⏱ Time's Up!</Text>
              <Text style={styles.modalText}>
                You earned {coins} coins and had {happiness} happiness.
              </Text>
              <Text style={styles.modalText}>
                {coins >= 3
                  ? "🎉 Congratulations! You passed!"
                  : "😢 You didn’t earn enough coins. Try again!"}
              </Text>
              <Pressable style={styles.modalButton} onPress={resetGame}>
                <Text style={styles.modalButtonText}>Play Again</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

/* ─── Styles ───────────────────────────────────────────────── */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4B0082', // deep purple background
  },
  container: {
    flex: 1,
    backgroundColor: '#4B0082',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: '#D8BFD8', // light lavender
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  stats: {
    color: '#E6E6FA', // light lavender
    marginBottom: 20,
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'center',  // centers rooms closer
    width: '100%',
    marginBottom: 30,
  },
  room: {
    width: 75,
    height: 75,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,  // tighter spacing between squares
  },
  roomText: {
    fontSize: 24,
    color: '#fff', // white text for visibility
  },
  vacant: {
    backgroundColor: '#B57EDC', // lavender
  },
  occupied: {
    backgroundColor: '#7B68EE', // medium purple
  },
  checkout: {
    backgroundColor: '#5D3A99', // dark purple
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4B0082', // deep purple
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4B0082', // deep purple
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#7B68EE', // medium purple
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
