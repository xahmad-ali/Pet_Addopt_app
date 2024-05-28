import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../Firebase_File';
import { signOut } from 'firebase/auth';

const Home = () => {
  const navigation = useNavigation();

  const logOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/kk.jpg')}
      style={styles.container}
      blurRadius={2}
    >
      <TouchableOpacity style={styles.drawerIcon} onPress={() => navigation.openDrawer()}>
        <Image
          source={require('../assets/menu.png')}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <Image 
          source={require('../assets/paw.png')}
          style={styles.pawImage}
        />
        <Text style={styles.logo}>Pet Haven.co</Text>
        <Text style={styles.description}>
          Welcome to Pet Haven, where we strive to find loving homes for animals in need. 
          Our mission is to rescue, rehabilitate, and rehome pets, providing them with 
          a second chance at a happy life. 
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={logOut}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  drawerIcon: {
    position: 'absolute',
    top: 40, // Adjust according to your needs
    left: 10, // Adjust according to your needs
    zIndex: 1, // Ensure it's above other components
  },
  pawImage: {
    width: 50,
    height: 50,
    position: 'relative',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 70,
    fontWeight: '300',
    color: '#d2691e',
    top: 1,
    alignSelf: 'flex-start',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: 'grey',
    fontSize: 16,
  },
  button: {
    position: 'absolute',
    top: 40,
    right: 10,
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    borderRadius: 5,
    fontWeight: '200'
  },
  buttonText: {
    color: 'white',
    fontWeight: '300',
  },
});

export { Home };