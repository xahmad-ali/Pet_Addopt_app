import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../Firebase_File.js";
import { addDoc, collection } from "firebase/firestore";
import { fetchUser, get_currentUser } from "../UserFunctions.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DonateAnimal = () => {
  const [animalName, setAnimalName] = useState(null);
  const [breed, setBreed] = useState(null);
  const [animalType, setanimalType] = useState(null);
  const [animalAge, setanimalAge] = useState(null);
  const [userId, setUserId] = useState(null);

  const saveInfo = async () => {
    setAnimalName(animalName);
    setBreed(breed);
    setanimalType(animalType);
    setanimalAge(animalAge);
  
    try {
      const storedEmail = await AsyncStorage.getItem("Email");
      if (storedEmail) {
        console.log("this is email from AsyncStorage from loginScreen ", storedEmail);
        const userData = await fetchUser(storedEmail);
        if (userData) {
          const fetchedUserId = userData.id;
          console.log("my valu userData: ", fetchedUserId);
          setUserId(fetchedUserId); // Update state for future use
          console.log("my valu userId: ", fetchedUserId);
  
          // Use fetchedUserId directly for Firestore operations
          try {
            const usersCollectionRef = collection(db, "animalinfo");
            const docRef = await addDoc(usersCollectionRef, {
              OwnerId:fetchedUserId,
              AnimalName: animalName,
              AnimalType: animalType,
              AnimalBreed: breed,
              AnimalAge: animalAge,
              createdAt: new Date().getTime(),
            });
            console.log("Document written with ID:", docRef.id);
            console.log("info uploaded ");
            go_UploadIamge(docRef.id);
          } catch (error) {
            console.error("Error adding document:", error.message);
          } 
        } 
      }
    } catch (error) {
      console.error("Error getting user email:", error.message);
    }
  };
  

  const navigation = useNavigation();
  const go_UploadIamge = (animalId) => {
    navigation.navigate("UploadAnimalIamge", { animalId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Animal Type(cat / dog)"
          value={animalType}
          onChangeText={setanimalType}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Animal Name"
          value={animalName}
          onChangeText={setAnimalName}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Animal Breed i.e(cat-persian)"
          value={breed}
          onChangeText={setBreed}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Animal Age"
          // keyboardType='numeric'
          value={animalAge}
          onChangeText={setanimalAge}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "plum" }]}
        onPress={saveInfo}
      >
        <Text style={styles.buttonText}>Save</Text>
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

export { DonateAnimal };
