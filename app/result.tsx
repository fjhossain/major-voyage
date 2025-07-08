import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

const personalityData: Record<
  string,
  { description: string; majors: string[] }
> = {
  ISTJ: {
    description:
      "You are responsible, organized, and practical. You value tradition and consistency, making you a reliable contributor in any team.",
    majors: ["Accounting", "Criminal Justice"],
  },
  ISFJ: {
    description:
      "You are nurturing, detail-oriented, and dependable. You enjoy helping others and working behind the scenes.",
    majors: ["Nursing", "Social Work"],
  },
  INFJ: {
    description:
      "You are insightful, compassionate, and driven by a strong sense of purpose. You thrive in meaningful work and enjoy helping others succeed.",
    majors: ["Psychology", "Education"],
  },
  INTJ: {
    description:
      "You are strategic, independent, and have a strong desire for knowledge. You enjoy working alone on complex problems.",
    majors: ["Engineering", "Data Science"],
  },
  ISTP: {
    description:
      "You are analytical, practical, and prefer hands-on work. You excel at solving real-world problems efficiently.",
    majors: ["Mechanical Engineering", "Information Technology"],
  },
  ISFP: {
    description:
      "You are gentle, sensitive, and have a strong aesthetic appreciation. You prefer flexible environments and value inner harmony.",
    majors: ["Graphic Design", "Interior Design"],
  },
  INFP: {
    description:
      "You are idealistic, creative, and guided by strong values. You seek careers where you can express yourself and help others.",
    majors: ["Creative Writing", "Human Services"],
  },
  INTP: {
    description:
      "You are analytical, logical, and love solving complex problems. You prefer working independently and value innovative thinking.",
    majors: ["Computer Science", "Philosophy"],
  },
  ESTP: {
    description:
      "You are energetic, action-oriented, and love hands-on learning. You excel in fast-paced environments and enjoy leading dynamic projects.",
    majors: ["Business Administration", "Sports Management"],
  },
  ESFP: {
    description:
      "You are outgoing, friendly, and love entertaining others. You thrive in environments where you can engage and connect.",
    majors: ["Performing Arts", "Hospitality Management"],
  },
  ENFP: {
    description:
      "You are enthusiastic, creative, and a great communicator. You enjoy exploring possibilities and connecting with others.",
    majors: ["Marketing", "Journalism"],
  },
  ENTP: {
    description:
      "You are curious, clever, and thrive on challenge and change. You enjoy debating ideas and creating novel solutions.",
    majors: ["Entrepreneurship", "Political Science"],
  },
  ESTJ: {
    description:
      "You are organized, assertive, and like to be in charge. You value efficiency and clear structures.",
    majors: ["Management", "Public Administration"],
  },
  ESFJ: {
    description:
      "You are cooperative, loyal, and enjoy helping others. You thrive in structured environments and value harmony.",
    majors: ["Nursing", "Elementary Education"],
  },
  ENFJ: {
    description:
      "You are charismatic, empathetic, and natural at leading. You’re passionate about helping others grow.",
    majors: ["Counseling", "Communications"],
  },
  ENTJ: {
    description:
      "You are ambitious, strategic, and enjoy taking charge. You excel in leadership roles and long-term planning.",
    majors: ["Law", "Finance"],
  },
};

export default function ResultScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const result = typeof type === "string" ? type.toUpperCase() : "";
  const data = personalityData[result];

  return (
    <LinearGradient
      colors={["#d0e6ff", "#e0c3fc", "#f8f9fa"]}
      style={styles.container}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
    >
      <Text style={styles.title}>Your Personality Type: {result}</Text>
      {data ? (
        <>
          <Text style={styles.description}>{data.description}</Text>
          <Text style={styles.subheading}>Suggested Majors:</Text>
          {data.majors.map((major, index) => (
            <Pressable
              key={index}
              style={styles.majorButton}
               onPress={() => router.push(`/game?major=${major}`)}
                 
            >
              <Text style={styles.majorText}>{major}</Text>
            </Pressable>
          ))}
        </>
      ) : (
        <Text style={styles.description}>
          Oops! No feedback available for this personality type.
        </Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginBottom: 30,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  majorButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  majorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6a1b9a",
  },
});
