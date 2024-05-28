import { View, Text,StyleSheet,ActivityIndicator } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';



const UploadAnimalIamge = ({route}) => {

  const [animalId, setAnimalId] = useState(null);
  const [uploadStatus,setUploadStatus]=useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.animalId) {
      setAnimalId(route.params.animalId);
      console.log("Animal ID:", route.params.animalId);
    }
  }, [route.params?.animalId]);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setLoading(true);
      on_fireStorage(result.assets[0].uri); // Pass the uri to the on_fireStorage function
    }
  };

  const storage = getStorage();
  const on_fireStorage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob(); //converts in binary

    const storageRef = ref(storage, "AnimalMedia/" +""+animalId, new Date().getTime());
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
            setLoading(false);
        },
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL)
               // setImageUri(downloadURL);
               setLoading(false);
                setUploadStatus(true);
                goBackTwoScreens();
            });
        }
    );
};

const navigation = useNavigation();
const goBackTwoScreens = () => {
  navigation.goBack();
};

return (
  <View style={styles.container}>
    {loading ? (
      <View style={[styles.activity, styles.horizontal]}>
        <ActivityIndicator size="large" color="peru" />
      </View>
    ) : (
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage}>
          <FontAwesome5 name="folder-plus" size={86} color="black" />
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


export { UploadAnimalIamge };
