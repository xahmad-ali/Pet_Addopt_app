import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase_File.js";
import { useRoute } from "@react-navigation/native";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const route=useRoute();
  const propEmail = route.params?.email || "";

  useEffect(() => {
    if (propEmail) {
      setEmail(propEmail);
    }
      
  }, [propEmail]);


  const saveEmail = (value) => {
    setEmail(value);
  };

  const savePassword = (value) => {
    setPassword(value);
  };

  //----->
  const handleLogin = async () => {
  
    const trimmedEmail = email.trim().toLowerCase();
    setEmail(trimmedEmail);
    console.log(trimmedEmail)
      try {
        await AsyncStorage.setItem("Email", trimmedEmail);
      console.log("Stored email from AsyncStorage:", trimmedEmail);
      } catch (e) {
        console.error("Failed to retrieve  email from storage", e);
      }
    

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User logged in :", user);
      go_home();
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.log("User does not exist. Please sign up.");
      } else if (error.code === "auth/wrong-password") {
        console.log("Incorrect email or password.");
      } else {
        console.error(error);
      }
    }
  };

  const go_home = () => {
    navigation.navigate("DrawerNavigation")
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={saveEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={savePassword}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "plum" }]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: 250,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Login;
