import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Firebase_File.js";
import { addDoc, collection } from "firebase/firestore";

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth,setDateOfBirth]= useState("");
  const [city,setCity]=useState("");
  const [showPassword, setShowPassword] = useState(false);

  const saveUsername = async (value) => {
    setUsername(value);
  };

  const savePassword = (value) => {
    setPassword(value);
  };

  const saveEmail = async (value) => {
    setEmail(value);
  };
  
  const saveDateOfBirth = async(value)=>{
    setDateOfBirth(value);
  };

  const saveCity= async(value)=>{
    setCity(value)
  };

  const handleSignup = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    setEmail(trimmedEmail); 
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("User signed up:", user);

      const usersCollectionRef = collection(db, "users");
      const docRef = await addDoc(usersCollectionRef, {
        Email: email,
        UserName: username,
        DOB:dateOfBirth,
        City:city,
      });
      console.log("Document written with ID:", docRef.id);
      go_login();
    } catch (error) {
      console.error("Error signing up:", error.message);
    } 
  };

  const go_login = () => {
    navigation.navigate("Login",{email});
  };

  return (
    <ImageBackground
    source={require('../assets/signup.jpg')}
    style={styles.container}
    blurRadius={2}
  >
    <View style={styles.container}>
      <Text style={styles.textstyle}>Signup</Text>

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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={savePassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.toggleButtonText}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Date of Birth MM/DD/YYYY"
        value={dateOfBirth}
        onChangeText={saveDateOfBirth}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={saveCity}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "peru" }]}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
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
button: {
  marginTop:20,
  width: 170,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 5,
},
buttonText: {
  fontSize: 18,
  fontWeight: "300",
  color: "white",
},
textstyle: {
  fontSize: 40,
  marginBottom: 10,
  fontWeight: "300",
  color: "peru",
  width: 300,
  textAlign: "center",
  textAlignVertical: "center",
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
});

export default Signup;