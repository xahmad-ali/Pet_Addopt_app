import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions
} from "react-native";
import { getStorage, ref, getDownloadURL,deleteObject } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation,useFocusEffect } from "@react-navigation/native";
import { fetchAnimalData, fetchUser, removeAnimal } from "../UserFunctions"; // Adjust the import path as needed

const { width } = Dimensions.get("window");

const AdoptAnimal = () => {
  const [animals, setAnimals] = useState([]);
  const [animalIds, setAnimalIds] = useState([]);
  const [imageUris, setImageUris] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigation = useNavigation();
  const storage = getStorage();

  useEffect(() => {
    // Fetch animal data once
    fetchAnimalData(setAnimals, setAnimalIds);
    // Fetch logged-in user data
    AsyncStorage.getItem("Email").then((email) => {
      fetchUser(email).then((user) => {
        setLoggedInUserId(user.id);
      });
    });

    
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Component is focused, perform any necessary actions
      console.log('Screen is focused');
      fetchAnimalData(setAnimals,setAnimalIds)


      // Return a function to run when the component is unfocused
      return () => {
        console.log('Screen is unfocused');
        // Perform any cleanup tasks
      };
    }, [])
  );


  useEffect(() => {
    if (animalIds.length > 0) {
      fetchImageUrls();
    }
  }, [animalIds]);

  const fetchImageUrls = async () => {
    setLoading(true);
    const newImageUris = {};
    for (const id of animalIds) {
      try {
        const storageRef = ref(storage, `AnimalMedia/${id}`);
        const downloadURL = await getDownloadURL(storageRef);
        newImageUris[id] = downloadURL;
      } catch (error) {
        if (error.code === "storage/object-not-found") {
          console.log("Image does not exist for", id);
        } else {
          console.error("Error retrieving image download URL:", error);
        }
        newImageUris[id] = null;
      }
    }
    setImageUris(newImageUris);
    setLoading(false);
  };

  const goChat = async (OwnerId, AnimalId) => {
    const email = await AsyncStorage.getItem("Email");
    const user = await fetchUser(email);

    if (user.id !== OwnerId) {
      navigation.navigate("ChattingConcern", {
        OwnerId,
        AnimalId,
        userId: user.id,
      });
    }
  };

  const handleDeletePress = (myAnimalId) => {
    Alert.alert(
      "Delete",
      "Do you want to delete?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => confirmDelete(myAnimalId) },
      ],
      { cancelable: false }
    );
  };

  const confirmDelete = async (myAnimalId) => {
    console.log("Delete Pressed", myAnimalId);
    const deletion = await removeAnimal(myAnimalId);
    if (deletion) {
      console.log("deleted animalId now picture");

      const desertRef = ref(storage, `AnimalMedia/${myAnimalId}`);

      await deleteObject(desertRef)
        .then(() => {
          console.log("Image is deleted successful");
          fetchAnimalData(setAnimals,setAnimalIds)
        })
        .catch((error) => {
          console.log("error deleting Image", error);
        });
    }
  };

  const filteredAnimals = animals.filter((animal) =>
    animal.AnimalType.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ImageBackground
      source={require("../assets/e3.jpg")}
      style={styles.background}
      blurRadius={3}
    >
      <View style={styles.overlay}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="peru" />
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.title}>Pet Haven Adoption</Text>
            <TextInput
              style={styles.searchBar}
              placeholder="Search by type"
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              style={styles.flatList}
              data={filteredAnimals}
              renderItem={({ item }) => (
                <View style={styles.animalItem}>
                  {imageUris[item.id] && (
                    <Image
                      style={styles.animalImage}
                      source={{ uri: imageUris[item.id] }}
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      goChat(item.OwnerId, item.id);
                    }}
                  >
                    <Text style={styles.animalName}>{item.AnimalName}</Text>
                    <Text style={styles.animalDetails}>
                      Type: {item.AnimalType}
                    </Text>
                    <Text style={styles.animalDetails}>
                      Breed: {item.AnimalBreed}
                    </Text>
                    <Text style={styles.animalDetails}>
                      Age: {item.AnimalAge}
                    </Text>
                  </TouchableOpacity>
                  {loggedInUserId === item.OwnerId && (
                    <TouchableOpacity
                      onPress={() => handleDeletePress(item.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    paddingVertical: 30,
    fontSize: 30,
    textAlign: "center",
    color: "peru",
    fontWeight: "400",
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  flatList: {
    borderRadius: 10,
  },
  animalItem: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  animalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  animalName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  animalDetails: {
    fontSize: 16,
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "peru",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export { AdoptAnimal };
