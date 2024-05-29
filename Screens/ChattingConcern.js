import { View, Text, StyleSheet, Image, ActivityIndicator,ImageBackground } from "react-native";
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
    <ImageBackground
      source={require('../assets/5dba.jpg')}
      style={styles.container}
      blurRadius={1}
    >
    <View style={styles.container}>
      {loading ? (
        <View style={[styles.activity, styles.horizontal]}>
          <ActivityIndicator size="large" color='peru' />
        </View>
      ) : (
        <View style={{ padding: 30 }}>
          <View>
            
          </View>
          <Image
            style={styles.tinyLogo}
            source={
              imageUri ? { uri: imageUri } : require("../assets/profile.png")
            }
          />
         
     
          {userData && <Text style ={styles.input}>Owner Name: {userData.UserName}</Text>}
          {userData && <Text style ={styles.input}>Owner mail: {userData.Email}</Text>}

        <View>

          <TouchableOpacity style={styles.button} onPress={goToChat}>
            <Text style={styles.buttonText}>Chat</Text>
          </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  </ImageBackground>
  );
};

const styles = StyleSheet.create({
  pawImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    padding:20,

    fontSize: 50,
    fontWeight: "400",
    color: "peru",
  },

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
    borderRadius:50,
    marginLeft:60,
    paddingBottom:10,
    marginBottom:15
  },
  input: {
    width: 230,
    height: 40,
    borderWidth: 1,
    borderColor: "peru",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor:'peru',
    top:50,
    left:58
    
  },
  buttonText: {
    color: "white",
    fontWeight: "300",
    fontSize:18,

    
  },
});

export { ChattingConcern };
