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
} from "react-native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { fetchAnimalData, fetchUser,removeAnimal } from "../UserFunctions"; // Adjust the import path as needed

const AdoptAnimal = () => {
  const [animals, setAnimals] = useState([]);
  const [animalIds, setAnimalIds] = useState([]);
  const [imageUris, setImageUris] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);

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

  useEffect(() => {
    if (animalIds.length > 0) {
      fetchImageUrls();
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

  const navigation = useNavigation();
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
  

  const storage = getStorage();

  const confirmDelete = async (myAnimalId) => {
    console.log("Delete Pressed", myAnimalId);
    const deletion = await removeAnimal(myAnimalId);
    if (deletion) {
      console.log("deleted animalId now picture");
  
      const desertRef = ref(storage, `AnimalMedia/${myAnimalId}`);
      
      await deleteObject(desertRef)
        .then(() => {
          console.log("deleted image");
        })
        .catch((error) => {
          console.log("error deleting image", error);
        });
    }
  };
  
 
  

  const filteredAnimals = animals.filter((animal) =>
    animal.AnimalType.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ImageBackground
      source={require("../assets/e3.jpg")}
      style={{ flex: 1, justifyContent: "center" }}
      blurRadius={3}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="peru" />
          </View>
        ) : (
          <View style={{ flex: 1, padding: 20 }}>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}
            >
              Pet Haven Adoption
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 10,
                paddingHorizontal: 10,
              }}
              placeholder="Search by type"
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              style={{ marginTop: 20 }}
              data={filteredAnimals}
              renderItem={({ item }) => (
                <View
                  style={{
                    padding: 10,
                    backgroundColor: "#fff",
                    marginBottom: 10,
                    borderRadius: 10,
                  }}
                >
                  {imageUris[item.id] && (
                    <Image
                      style={{ width: "100%", height: 200, borderRadius: 10 }}
                      source={{ uri: imageUris[item.id] }}
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      goChat(item.OwnerId, item.id);
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      {item.AnimalName}
                    </Text>
                    <Text>Type: {item.AnimalType}</Text>
                    <Text>Breed: {item.AnimalBreed}</Text>
                    <Text>Age: {item.AnimalAge}</Text>
                  </TouchableOpacity>
                  {loggedInUserId === item.OwnerId && (
                    <TouchableOpacity
                      onPress={() => handleDeletePress(item.id)}
                      style={{
                        backgroundColor: "peru",
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                      }}
                    >
                      <Text style={{ color: "#fff", textAlign: "center" }}>
                        Delete
                      </Text>
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  title: {
    padding: 30,
    fontSize: 40,
    textAlign: "center",
    color: "peru",
    fontWeight: "300",
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  flatList: {
    borderRadius: 10,
  },
  animalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  tinyLogo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  animalName: {
    fontSize: 20,
    fontWeight: "400",
    fontSize: 32,
  },
  deleteButton: {
    marginLeft: 100,
    backgroundColor: "peru",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "400",
  },
  activity: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export { AdoptAnimal };
