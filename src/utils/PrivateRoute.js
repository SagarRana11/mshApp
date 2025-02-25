import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token= await AsyncStorage.getItem('loggedUserToken');
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error fetching token", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null; // or a loading indicator
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
