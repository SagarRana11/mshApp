import React from 'react';
import { View, Text, Button, Image, TouchableOpacity,Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AlarmList from './AlarmList';
import PrivacyPolicy from './PrivacyPolicy';
import { logout } from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from 'react-router-native';
// Create Drawer Navigator
const Drawer = createDrawerNavigator();

// Home Screen (Receiving Props)


// Profile Screen (Receiving Props)
const ProfileScreen = ({ route }) => {
  const username = route.params?.username || 'User';

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Profile of {username}</Text>
    </View>
  );
};

const handleLogout = async ({navigate}) => {
  try {
    const loggedOut = await logout();
    console.log("Logout Response:", loggedOut);

    if (loggedOut?.data?.status === 'ok' && loggedOut?.data?.code === 200) {
      await AsyncStorage.removeItem("loggedUserToken"); 
      navigate('/');
    } else {
      Alert.alert("Logout Failed", "Unable to log out. Please try again.");
    }
  } catch (error) {
    console.error("Logout Error:", error);
    Alert.alert("Error", "Something went wrong during logout.");
  }
};

// Custom Drawer Component
const CustomDrawer = (props) => {
  const navigate = useNavigate();
  return(
  <DrawerContentScrollView {...props}>
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Image 
        source={require('../../../assets/images/imageBack2.jpg')} 
        style={{ width: 80, height: 80, borderRadius: 40 }}
      />
      <Text style={{ fontSize: 18, marginTop: 10 }}>John Doe</Text>
    </View>
    <DrawerItemList {...props} />
    <TouchableOpacity onPress={() => handleLogout({navigate})} style={{ padding: 20 }}>
      <Text style={{ color: 'red' }}>Logout</Text>
    </TouchableOpacity>
  </DrawerContentScrollView>
  )
};

// Main App Component
export default function App() {
  const user = { username: 'JohnDoe123' }; // Example props

  return (
    <NavigationContainer>
      <Drawer.Navigator 
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="Home">
          {(props) => <AlarmList {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        {/* <Drawer.Screen name='activeAlarm'/> */}
        <Drawer.Screen name='T&C and Privacy Policy' component={PrivacyPolicy} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
