import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Welcome } from './Screens/Welcome.js';
import { AdoptAnimal } from './Screens/AdoptAnimal.js';
import { DonateAnimal } from './Screens/DonateAnimal.js';
import { Home } from './Screens/Home.js';
import Login from './Screens/Login.js';
import Signup from './Screens/Signup.js';
import { Profile } from './Screens/Profile.js';
import { UploadAnimalIamge } from './Screens/UploadAnimalIamge.js';
import { ChattingConcern } from './Screens/ChattingConcern.js';
import { Chatting } from './Screens/Chatting.js';
import { AllChats } from './Screens/AllChats.js';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function DrawerNavigation() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="MyTabs" component={MyTabs} options={{ headerShown: false }} />
      <Drawer.Screen name="AdoptAnimal" component={AdoptAnimal} options={{ headerShown: false }} />
      <Drawer.Screen name="Donate" component={DonateAnimal} options={{ headerShown: false }} />
      <Drawer.Screen name="AllChats" component={AllChats}options={{headerShown: false}} />
    </Drawer.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'peru',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: 0,
          height: 60,
          elevation: 2, // Android
          shadowOpacity: 0.3, // iOS
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/l.png')}
              style={{ width: 40, height: 40, opacity: focused ? 1 : 0.5 }}
            />
          ),
          tabBarLabel: () => null, // To hide the tab label
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/n.png')}
              style={{ width: 40, height: 40, opacity: focused ? 1 : 0.5 }}
            />
          ),
          tabBarLabel: () => null, // To hide the tab label
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="UploadAnimalIamge" component={UploadAnimalIamge} />
        <Stack.Screen name="ChattingConcern" component={ChattingConcern} options={{ headerShown: false }} />
        <Stack.Screen name="Chatting" component={Chatting} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
