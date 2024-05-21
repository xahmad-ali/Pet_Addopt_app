import { View, Text,StyleSheet } from 'react-native'
import React, { useState ,useEffect} from 'react';
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { fetch_media_fireStorage } from '../UserFunctions.js';


const ChattingConcern = ({route}) => {
    const [ownerId,setOwnerId]=useState("Owner id ");
    const [imageUri,setImageUri]=useState(null);

  const OwnerId = route.params?.OwnerId;
  const AnimalId = route.params?.AnimalId;

  useEffect(() => {
    if (OwnerId) {
      setOwnerId(OwnerId);
      console.log("abc",ownerId)
      console.log("--> ",OwnerId)

    }
    SettingImage(ownerId);
    
  }, []);

  const SettingImage=async(ownerId)=>{
    const uri=await fetch_media_fireStorage(ownerId);
     setImageUri(uri);
    console.log("this is url:",imageUri)

  };

  

  return (
    <View style={styles.container}> 

    <View style={{padding:30}}>
              <Text>Chatting   Concern</Text>
              <Text>{ownerId}</Text>
        <Text>{OwnerId}</Text>
        <Text>{AnimalId}</Text>

        </View>
        <TouchableOpacity>
    
        <Text>chat with the :{ownerId}</Text>
        <Text>Animal id :{AnimalId}</Text>


      </TouchableOpacity>
      
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

export  {ChattingConcern};