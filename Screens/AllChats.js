import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image, // Import Image component
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
  const [loading, setLoading] = useState(true); // Add loading state

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
      // Get the current user ID
      console.log("Current User email:", currentId);

      // Fetch users from Firestore
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);

      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          Email: doc.data().Email,
          UserName: doc.data().UserName,
          City:doc.data().City,
          Dob:doc.data().DOB
        });
      });

      console.log("Before filter:", data);

      // Filter out the current user's data
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
      {imageUris[item.id] && (
        <Image
          style={styles.tinyLogo}
          source={{ uri: imageUris[item.id] }}
        />
      )}
      <Text>{item.UserName}</Text>
      <Text>{item.Email}</Text>
      <Text>{item.City}</Text>

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={[styles.activity, styles.horizontal]}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>All Chats</Text>
          <FlatList
            data={chatUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
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
  activity: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tinyLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export { AllChats };
