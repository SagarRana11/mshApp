import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { logout, fetchRequests } from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from 'react-router-native';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
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

  const fetchData = async () => {
    try {
      const response = await fetchRequests({ pageParam: 0 }); 
  
      if (!response || !Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }
  
      console.log("Fetched Data: from home", response.data);
    } catch (error) {
      console.error("Fetch Requests Error:", error.response ?? error.message);
      Alert.alert("Error", "Failed to fetch data. Please try again.");
    }
  };
  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Home Screen</Text>
      <Button onPress={handleLogout} title="Logout" />
      <Button onPress={fetchData} title="Request" />
    </View>
  );
};

export default Home;
