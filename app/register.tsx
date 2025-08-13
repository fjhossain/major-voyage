import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as wierdscript from "../JustinsguessworkArea/backend-expogo/newServerRequestHandler";
/*
setOfData contains(in this order){
    STUDENT_EMAIL, 
    STUDENT_USERNAME, 
    PASSWORD_ENCRYPT, 
    persona1,
    persona2,
    persona3,
    persona4,
    selectedDegreeNo, this can be set as a null variable, will handle as 0 which is the undecided var
    numbers related to degree percents(starting at 0 ending in the last degree)
}
the set of degrees currently is:
1: arts
2: business
3: Management
4: hospitiality
5: undecided
6: informantion tech
*/
/*
  var inputs = [
    false, //persona1
    false, //persona2
    false, //persona3
    false, //persona4
    0, //selectedDegreeNo
    [
      0, //arts
      0, //business
      0, //Management
      0, //hospitiality
      0, //undecided
      0, //informantion tech
    ] //numbers related to degree percents(starting at 0 ending in the last degree)
  ]*/
export default function RegisterScreen() {
  const router = useRouter();

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Persona and degree data
  const [personas, setPersonas] = useState([false, false, false, false]);
  const [selectedDegreeNo, setSelectedDegreeNo] = useState(0); // 0 = undecided
  const [degreePercents, setDegreePercents] = useState([0, 0, 0, 0, 0, 0]);

  const handleRegister = async () => {
    

    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      const result = await wierdscript.registerRequest([
        email,
        username,
        password,
        personas[0],
        personas[1],
        personas[2],
        personas[3],
        selectedDegreeNo,
        [
          degreePercents[0],
          degreePercents[1],
          degreePercents[2],
          degreePercents[3],
          degreePercents[4],
          degreePercents[5]
        ]]
      );

      if (!result) {
        Alert.alert("Error", "Registration failed. Please try again.");
        return;
      }

      Alert.alert("Account Created", "Your account has been successfully registered!");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Create Account</Text>

      <GradientInput
        placeholder="User Name"
        value={username}
        onChangeText={setUsername}
      />
      <GradientInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <GradientInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.linkBold}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

// 🧩 Reusable gradient input component
function GradientInput(props: any) {
  return (
    <LinearGradient
      colors={["#7F00FF", "#2196F3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientBorder}
    >
      <TextInput
        style={styles.input}
        placeholderTextColor="#888"
        {...props}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 30,
    textAlign: "center",
  },
  gradientBorder: {
    borderRadius: 12,
    padding: 2,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4B0082",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  linkBold: {
    color: "#4B0082",
    fontWeight: "600",
  },
});
