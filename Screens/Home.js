import { View, Text } from 'react-native'
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';


const Home = () => {

    
    const navigation = useNavigation();
    const goBack = () => {
        navigation.goBack();
      };


  return (
    <View style={{padding:30}}>
      <Text>Home</Text>
      <TouchableOpacity style={{width:100,borderRadius:20,backgroundColor:'pink'}}
        
        onPress={goBack}
      >
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home;