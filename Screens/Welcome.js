import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Welcome = () => {
  const navigation = useNavigation();

  const logining = () => {
    navigation.navigate('Login');
  };

  const signing = () => {
    navigation.navigate('Signup');
  };

  return (
    <ImageBackground 
      source={require('../assets/2.jpg')} 
      style={styles.background}
      blurRadius={2}
    >
      <View style={styles.container}>
        <Image 
          source={require('../assets/paw.png')}
          style={styles.pawImage}
        />
        <Text style={styles.logo}>Pet Haven</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'hsl(30, 40%, 70%)' }]}
          onPress={logining}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.textstyle1}>Ready to adopt more paw friends?</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'peru' }]}
          onPress={signing}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  logo: {
    fontSize: width * 0.12, // Adjusted font size
    fontWeight: '600',
    color: '#d2691e',
    marginBottom: height * 0.4, // Adjusted margin bottom
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.02, // Adjusted margin bottom
  },
  pawImage: {
    width: width * 0.12, 
    height: width * 0.12,
    marginBottom: height * 0.02, // Adjusted margin bottom
  },
  button: {
    width: width * 0.35, // Adjusted width
    height: height * 0.06, // Adjusted height
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: width * 0.045, // Adjusted font size
    fontWeight: '300',
    color: 'white',
  },
  textstyle1: {
    fontSize: width * 0.04, // Adjusted font size
    color: 'brown',
    textAlign: 'center',
    width: width * 0.9, // Adjusted width
    fontWeight: '300',
  },
});

export { Welcome };
