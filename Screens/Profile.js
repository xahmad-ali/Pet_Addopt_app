import { View, Text,StyleSheet,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUser,get_currentUser } from '../UserFunctions.js';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';


const Profile = () => {
  const [email,setEmail]=useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [imageUri,setImageUri] = useState("");

  const[uploadStatus,setUploadStatus] = useState(false);

//////////////////////////////
  useEffect(() => {
    const getEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("Email");
        if (storedEmail) {
          setEmail(storedEmail);
          console.log("this   is  email from AscynS from loginSCreen  ", storedEmail);
          const userData = await fetchUser(storedEmail);
          if (userData) {
            setUsername(userData.userName);
            setUserId(userData.id);
          }
        }
      } catch (error) {
        console.error("Error getting user email:", error.message);
      }
    };

    getEmail();
  }, []);
//////////////////////////
  useEffect(() => {
    if (userId) {
      fetch_media_fireStorage();
    }
  }, [userId, uploadStatus]);
///////////////////////////////////////

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
     // allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      on_fireStorage(result.assets[0].uri); // Pass the uri to the on_fireStorage function
    }
  };

  const storage = getStorage();
  const on_fireStorage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob(); //converts in binary

    const storageRef = ref(storage, "UserImage/" +""+userId, new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on('state_changed',
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // Handle unsuccessful uploads
            console.log(error)
            Alert.alert('Error', 'There was an error uploading the image.');
        },
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL)
                setImageUri(downloadURL);
                setUploadStatus(true);
            });
        }
    );
};


const fetch_media_fireStorage=async()=>{
  try {
      // Create a reference to the image in Firebase Storage
      const storageRef = ref(storage, `UserImage/${userId}`);

      // Get the download URL of the image
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Image download URL:', downloadURL);

      setImageUri(downloadURL);
      //await AsyncStorage.setItem("ImageURL",downloadURL)


      // Return the download URL
      return downloadURL;
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      console.log('Image does not exist');
    } else {
      console.error('Error retrieving image download URL:', error);
    }
    return null;
  }
};
 

  return (
    <View style={styles.container}>
      <View style={{flex:0.3}}>
      <Image
        style={styles.tinyLogo}
        source={imageUri ? { uri: imageUri } : require('../assets/profile.png')}
      />
      <TouchableOpacity onPress={pickImage}>
      <FontAwesome5 name="folder-plus" size={26} color="black" />
      </TouchableOpacity>
      </View>
      <View style={{flex:0.3}}>
        <Text>Email: {email}</Text>
      </View>
      <View style={{flex:0.3}}>
        <Text>UserName: {username}</Text>
      </View>
      <View style={{flex:0.3}}>
        <Text>User ID: {userId}</Text>
      </View>
    </View>
  )
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
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export { Profile};