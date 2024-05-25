import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  fetchUserDataById,
  fetch_media_fireStorage,
} from "../UserFunctions.js";
import { useNavigation } from "@react-navigation/native";

const ChattingConcern = ({ route }) => {
  const [ownerId, setOwnerId] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [senderId, setSenderId] = useState(null);
  const [userData, setUserData] = useState(null);

  const routeOwnerId = route.params?.OwnerId;
  const routeAnimalId = route.params?.AnimalId;
  const userId = route.params?.userId;

  useEffect(() => {
    if (routeOwnerId) {
      setOwnerId(routeOwnerId);
      setSenderId(userId);
      console.log("Route OwnerId: ", routeOwnerId);
      console.log("Routed User id: ", userId);
      getOwnerData(routeOwnerId);
      fetchAndSetImage(routeOwnerId);
    }
  }, [routeOwnerId]);

  const fetchAndSetImage = async (ownerId) => {
    try {
      const uri = await fetch_media_fireStorage(ownerId);
      setImageUri(uri);
      console.log("Image download uri: ", uri);
    } catch (error) {
      console.error("Error fetching image: ", error);
    }
    setLoading(false);
  };

  const getOwnerData = async (id) => {
    const data = await fetchUserDataById(id);

    if (data) {
      setUserData(data);
      console.log("i m in the concern");
    }
  };

  const navigation = useNavigation();
  const goToChat = () => {
    console.log(userId)
    navigation.navigate("Chatting", { senderId:userId,ownerId });
  };
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={[styles.activity, styles.horizontal]}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <View style={{ padding: 30 }}>
          <Image
            style={styles.tinyLogo}
            source={
              imageUri ? { uri: imageUri } : require("../assets/profile.png")
            }
          />
          <Text>Chatting Concern</Text>
          <Text>{ownerId}</Text>
          {userData && <Text>Owner Name: {userData.UserName}</Text>}
          {userData && <Text>Owner Name: {userData.Email}</Text>}

          <Text>{routeAnimalId}</Text>

          <TouchableOpacity style={styles.button} onPress={goToChat}>
            <Text>start Chatting</Text>
          </TouchableOpacity>
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
  inputContainer: {
    marginBottom: 20,
  },
  tinyLogo: {
    width: 100,
    height: 100,
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
    backgroundColor:'pink'
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export { ChattingConcern };
