import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUser } from "../UserFunctions.js";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import { FontAwesome5 } from "@expo/vector-icons";

const Profile = () => {
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [city, setCity] = useState("");

  const [uploadStatus, setUploadStatus] = useState(false);
  const [imageMetadata, setImageMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("Email");
        if (storedEmail) {
          setEmail(storedEmail);
          console.log(
            "this is email from AsyncStorage from loginScreen",
            storedEmail
          );
          const userData = await fetchUser(storedEmail);
          if (userData) {
            setUsername(userData.userName);
            setUserId(userData.id);
            setDateOfBirth(userData.DOB);
            setCity(userData.City);
          }
        }
      } catch (error) {
        console.error("Error getting user email:", error.message);
      }
    };

    getEmail();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchMediaFireStorage();
    }
  }, [userId, uploadStatus]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      // setLoading(true);
      const exist = await getImageMetadata(userId);
      if (exist) {
        await deleteImage(userId);
      }
      onFireStorage(result.assets[0].uri);
    }
  };

  const deleteImage = async (userId) => {
    try {
      const desertRef = ref(storage, `UserImage/${userId}`);
      await deleteObject(desertRef);
      console.log("Previous image deleted");
    } catch (error) {
      console.error("Error deleting previous image:", error);
    }
  };

  const getImageMetadata = async (userId) => {
    try {
      const storageRef = ref(storage, `UserImage/${userId}`);
      const metadata = await getMetadata(storageRef);
      console.log("Image metadata:", metadata);
      setImageMetadata(metadata);
      return metadata;
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        console.log("Image does not exist");
      } else {
        console.error("Error retrieving image metadata:", error);
      }
      return null;
    }
  };

  const storage = getStorage();

  const onFireStorage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `UserImage/${userId}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error("Error uploading image:", error);
          Alert.alert("Error", "There was an error uploading the image.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          setImageUri(downloadURL);
          setUploadStatus(true);
        }
      );
    } catch (error) {
      console.error("Error during upload:", error);
    }
  };

  const fetchMediaFireStorage = async () => {
    try {
      const storageRef = ref(storage, `UserImage/${userId}`);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Image download URL:", downloadURL);
      setImageUri(downloadURL);
      setLoading(false);

      return downloadURL;
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        console.log("Image does not exist");
      } else {
        console.error("Error retrieving image download URL:", error);
      }
      setLoading(false);
      return null;
    }
  };

  return (
    <ImageBackground
      source={require("../assets/eeb.jpg")}
      style={styles.container}
      blurRadius={3}
    >
      {loading ? (
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.content}>
            <Image
              source={
                imageUri ? { uri: imageUri } : require("../assets/profile.jpg")
              }
              style={styles.image}
            />
            <TouchableOpacity
              onPress={pickImage}
              style={styles.changePicButton}
            >
              <Text style={styles.changePicButtonText}>Change Picture</Text>
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.text1}>Email: {email}</Text>
              <Text style={styles.text2}>Username: {username}</Text>
              <Text style={styles.text3}>User ID: {userId}</Text>
              <Text style={styles.text3}>Date of Birth: {dateOfBirth}</Text>
              <Text style={styles.text3}>City: {city}</Text>
            </View>
          </View>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "300",
    fontSize: 60,
    textAlign: "center",
    color: "peru",
    padding: 15,
    marginTop: 30,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePicButton: {
    backgroundColor: "peru",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  changePicButtonText: {
    color: "white",
    fontWeight: "300",
  },
  userInfo: {
    padding: 10,
    borderRadius: 10,
    width: "80%",
    maxWidth: 400,
    marginBottom: 100,
  },
  text1: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "300",
    color: "white",
    backgroundColor: "peru",
    padding: 5,
  },
  text2: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "300",
    color: "white",
    backgroundColor: "peru",
    padding: 5,
  },
  text3: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "300",
    color: "white",
    backgroundColor: "peru",
    padding: 5,
  },
});

export { Profile };
