import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type RoomStatus = "vacant" | "occupied" | "checkout";

interface Room {
  id: number;
  status: RoomStatus;
  timer: number;
}

const INITIAL_ROOMS: Room[] = [
  { id: 0, status: "vacant", timer: 0 },
  { id: 1, status: "vacant", timer: 0 },
  { id: 2, status: "vacant", timer: 0 },
];

export default function hospminiGame() {
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

      setRooms((prev) =>
        prev.map((room) => {
          if (room.status === "vacant") return room;
          if (room.timer > 1) {
            return { ...room, timer: room.timer - 1 };
          }
          if (room.status === "occupied") {
            return { ...room, status: "checkout", timer: 5 };
          } else if (room.status === "checkout") {
            setHappiness((h) => Math.max(0, h - 1));
            return { ...room, status: "vacant", timer: 0 };
          }
          return room;
        })
      );

      if (Math.random() < 0.2) {
        setRooms((prev) => {
          const idx = prev.findIndex((r) => r.status === "vacant");
          if (idx === -1) return prev;
          const upd = [...prev];
          upd[idx] = { ...upd[idx], status: "occupied", timer: 5 };
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
    if (room.status === "checkout") {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === room.id ? { ...r, status: "vacant", timer: 0 } : r
        )
      );
      setCoins((c) => c + 1);
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
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>🏨 Hotel Havoc</Text>
      <Text style={styles.stats}>
        💵 {coins}  😊 {happiness}
      </Text>

      <View style={styles.grid}>
        {rooms.map((room) => (
          <Pressable
            key={room.id}
            onPress={() => handleRoomPress(room)}
            style={[
              styles.room,
              room.status === "vacant" && styles.vacant,
              room.status === "occupied" && styles.occupied,
              room.status === "checkout" && styles.checkout,
            ]}
          >
            <Text style={styles.roomText}>
              {room.status === "vacant" && "🛏️"}
              {room.status === "occupied" && `⏳${room.timer}`}
              {room.status === "checkout" && `🧹${room.timer}`}
            </Text>
          </Pressable>
        ))}
      </View>

      <Modal visible={showInstructions} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🧼 How to Play</Text>
            <Text style={styles.modalText}>
              Guests will check in. After a short time, they request checkout
              (🧹). Tap the room before the timer hits 0 to clean and earn
              coins! Missed checkouts reduce happiness. Survive 30 seconds!
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14213d",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fca311",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  stats: {
    color: "#e5e5e5",
    marginBottom: 20,
    fontSize: 16,
  },
  grid: {
    flexDirection: "row",
    gap: 10,
  },
  room: {
    width: 90,
    height: 90,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  roomText: {
    fontSize: 24,
  },
  vacant: {
    backgroundColor: "#2d6a4f",
  },
  occupied: {
    backgroundColor: "#d90429",
  },
  checkout: {
    backgroundColor: "#4361ee",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: "#fca311",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
