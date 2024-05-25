import { View, Text,StyleSheet } from 'react-native'
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { auth } from '../Firebase_File';
import { signOut } from 'firebase/auth';


const Home = () => {

    
    const navigation = useNavigation();
    const goBack = () => {
        console.log("i do nothing ")
        console.log("i am global",global.currentUserId)
      };

      const logOut = async()=>{
        try {
          await signOut(auth);
          navigation.replace('Login'); 
        } catch (error) {
          console.error('Error logging out: ', error);
        }
      };


  return (
    <View style={{padding:30}}>
      <Text>Home</Text>
      <TouchableOpacity style={{width:100,borderRadius:20,backgroundColor:'pink'}}
        
        onPress={goBack}
      >
        <Text>Go Back</Text>
      </TouchableOpacity>

      <View style={{padding:20}}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "plum" }]}
        onPress={logOut}
      >
        <Text style={styles.buttonText}>LogOut</Text>
      </TouchableOpacity>
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
    borderRadius: 5
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Home;