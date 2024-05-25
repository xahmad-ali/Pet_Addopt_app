import { View, Text, StyleSheet, Image,ActivityIndicator } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { fetchAnimalData } from '../UserFunctions.js'; // Adjust the import path as needed
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { fetchUser } from "../UserFunctions.js";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AdoptAnimal = () => {
  const [animals, setAnimals] = useState([]);
  const [animalIds, setAnimalIds] = useState([]);
  const [imageUris, setImageUris] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state





  //////////////////////////////
  useEffect(() => {
    const unsubscribe = fetchAnimalData(setAnimals, setAnimalIds);

    return () => {
      // Clean up the listener on component unmount
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (animalIds.length > 0) {
      console.log("Animal IDs:", animalIds);
    }
  }, [animalIds]);

  const fetchImageUrls = async () => {
    const storage = getStorage();
    const newImageUris = {};

    for (const id of animalIds) {
      try {
        const storageRef = ref(storage, `AnimalMedia/${id}`);
        const downloadURL = await getDownloadURL(storageRef);
        newImageUris[id] = downloadURL;
      } catch (error) {
        if (error.code === 'storage/object-not-found') {
          console.log(`Image does not exist for ${id}`);
        } else {
          console.error('Error retrieving image download URL:', error);
        }
        newImageUris[id] = null;
      }
    }

    setImageUris(newImageUris);
    setLoading(false);
  };

  useEffect(() => {
    if (animalIds.length > 0) {
      fetchImageUrls();
    }
  }, [animalIds]);
  /////////////////////////////////////



  const navigation=useNavigation();
  const goChat=async(OwnerId,AnimalId)=>{
    const email = await AsyncStorage.getItem("Email");
    const user = await fetchUser(email);

    if (user.id !== OwnerId) {
      console.log("animalid:", { AnimalId });
      console.log("owner Id:", { OwnerId });
      navigation.navigate("ChattingConcern", { OwnerId, AnimalId,userId: user.id });
    }

  };

  return (
    <View style={styles.container}>
        {loading ? (
        <View style={[styles.activity, styles.horizontal]}>
    <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (

      <View style={{ marginTop: 50, marginLeft: 5, marginRight: 5 }}>

        <TouchableOpacity ><Text>delete my donation</Text></TouchableOpacity>
        <FlatList
          style={{
            flexDirection: "row",
            borderRadius: 20,
            padding: 20,
            backgroundColor: "plum",
            margin: 20,
            alignSelf: "auto",
          }}
          data={animals}
          renderItem={({ item }) => (
            <View style={{ padding: 15, borderColor: "black" }}>
          {imageUris[item.id] && ( // Render image only if URL exists
            <Image
              style={styles.tinyLogo}
              source={{ uri: imageUris[item.id] }}
            />
          )}
              <TouchableOpacity onPress={() => {goChat(item.OwnerId,item.id)}}>
                <Text style={{ fontSize: 30 }}>{item.AnimalName}</Text>
                <Text>Type: {item.AnimalType}</Text>
                <Text>Breed: {item.AnimalBreed}</Text>
                <Text>Age:  {item.AnimalAge}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      )}
    </View>
        
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activity:{
      flex:2,
      justifyContent: "center",
    alignItems: "center",

  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  tinyLogo: {
    width: 100,
    height: 100,
    borderBottomColor:'blue'
  },
});

export { AdoptAnimal };
