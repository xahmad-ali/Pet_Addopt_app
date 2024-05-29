import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase_File";
import { useRoute } from "@react-navigation/native";

const Login = ({ navigation }) => {
 const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility


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
    <ImageBackground
      source={require('../assets/bg.jpg')}
      style={styles.container}
      blurRadius={0}
    >
      <View style={styles.innerContainer}>
        <View>
          <Text style={styles.logo}>
            Login
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={saveEmail}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={savePassword}
              secureTextEntry={!showPassword} // Hide or show password based on the state
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)} // Toggle the state on press
              style={styles.toggleButton}
            >
              <Text style={styles.toggleButtonText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "peru" }]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  logo: {
    fontSize: 50,
    fontWeight: '300',
    color: '#d2691e',
    marginBottom:10
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: "burlywood",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordContainer: {
    position: "relative",
  },
  toggleButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  toggleButtonText: {
    color: "peru",
  },
  button: {
    width: 170,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "300",
  },
});

export default Login;
