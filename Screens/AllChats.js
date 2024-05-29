import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground
} from "react-native";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../Firebase_File"; // Adjust the path to your Firebase configuration
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUser } from "../UserFunctions";
import { useNavigation } from "@react-navigation/native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const AllChats = () => {
  const [senderId, setSenderId] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [imageUris, setImageUris] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getChatUsers = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("Email");
        if (storedEmail) {
          const userData = await fetchUser(storedEmail);
          if (userData) {
            await fetchChatUsers(userData.id);
          }
        }
      } catch (error) {
        console.error("Error getting chat users:", error.message);
      }
    };

    getChatUsers();
  }, []);

  const fetchChatUsers = async (currentId) => {
    try {
      console.log("Current User email:", currentId);

      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);

      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          Email: doc.data().Email,
          UserName: doc.data().UserName,
        });
      });

      console.log("Before filter:", data);

      const filteredData = data.filter((user) => user.id !== currentId);

      console.log("Filtered Users:", filteredData);
      setSenderId(currentId);
      setChatUsers(filteredData);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    if (chatUsers.length > 0) {
      fetchImageUrls();
    }
  }, [chatUsers]);

  const fetchImageUrls = async () => {
    const storage = getStorage();
    const newImageUris = {};

    for (const user of chatUsers) {
      try {
        const storageRef = ref(storage, `UserImage/${user.id}`);
        const downloadURL = await getDownloadURL(storageRef);
        newImageUris[user.id] = downloadURL;
      } catch (error) {
        if (error.code === 'storage/object-not-found') {
          console.log(`Image does not exist for ${user.id}`);
        } else {
          console.error('Error retrieving image download URL:', error);
        }
        newImageUris[user.id] = null;
      }
    }

    setImageUris(newImageUris);
    setLoading(false);
  };

  const navigation = useNavigation();
  const goChat = (ownerId) => {
    navigation.navigate("Chatting", { senderId, ownerId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => goChat(item.id)}>
      <Image
        style={styles.avatar}
        source={
          imageUris[item.id]
            ? { uri: imageUris[item.id] }
            : require("../assets/a.jpg")
        }
      />
      <View style={styles.itemContent}>
        <Text style={styles.userName}>{item.UserName}</Text>
        <Text style={styles.userEmail}>{item.Email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../assets/91.jpg')}
      style={styles.container}
      blurRadius={4}
    >
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <Image 
              source={require('../assets/paw.png')}
              style={styles.pawImage}
            />
            <Text style={styles.title}>Haven Chat</Text>
          </View>
          <FlatList
            data={chatUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
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
   // backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    borderTopColor:"gray",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#888",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
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
});

export { AllChats };
