import { View, Text, StyleSheet, Image } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { fetchAnimalData } from '../UserFunctions.js'; // Adjust the import path as needed
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";

const AdoptAnimal = () => {
  const [animals, setAnimals] = useState([]);
  const [animalIds, setAnimalIds] = useState([]);
  const [imageUris, setImageUris] = useState({});




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
  };

  useEffect(() => {
    if (animalIds.length > 0) {
      fetchImageUrls();
    }
  }, [animalIds]);
  /////////////////////////////////////



  const navigation=useNavigation();
  const goChat=(OwnerId,AnimalId)=>{
    console.log("animalid:" ,{AnimalId})
    

    console.log("ownerId",{OwnerId})
    //navigation.goBack();
    navigation.navigate("ChattingConcern",{OwnerId,AnimalId})

  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 50, marginLeft: 5, marginRight: 5 }}>
        <FlatList
          style={{
            flexDirection: "row",
            borderRadius: 20,
            padding: 30,
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
                <Text>Age: {item.AnimalAge}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tinyLogo: {
    width: 100,
    height: 100,
    borderBottomColor:'blue'
  },
});

export { AdoptAnimal };
