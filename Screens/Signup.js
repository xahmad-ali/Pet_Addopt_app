import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Firebase_File.js";
import { addDoc, collection } from "firebase/firestore";

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const saveUsername = async (value) => {
    setUsername(value);
    await AsyncStorage.setItem("Name", username);
  };
  const savePassword = (value) => {
    setPassword(value);
  };
  const saveEmail = async (value) => {
    setEmail(value);
    await AsyncStorage.setItem("Email", email);
  };

  const handleSignup = async () => {
    await saveUsername(username);
    await saveEmail(email);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("User signed up:", user);

      //--> Add user data to Firestore
      const usersCollectionRef = collection(db, "users"); // Get reference to 'users' collection
      const docRef = await addDoc(usersCollectionRef, {
        // Pass collection reference to addDoc
        Email: email,
        UserName: username,
      });
      console.log("Document written with ID:", docRef.id);
      go_login();
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  const go_login = () => {
    console.log("go home");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textstyle}>REGISTER</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={saveEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={saveUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={savePassword}
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "plum" }]}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderRadius: 50,
    height: 50,
    width: 300,
    backgroundColor: "lavender",
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  textstyle: {
    fontSize: 40,
    marginBottom: 10,
    fontWeight: "bold",
    color: "lavender",
    backgroundColor: "plum",
    width: 300,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export default Signup;
