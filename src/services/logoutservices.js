import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchUrl = "http://192.168.3.242:5000";

const getToken = async () => {
    try {
      return await AsyncStorage.getItem("loggedUserToken");
    } catch (error) {
      console.error("Error taking token:", error);
    }
  };

const logout = async () => {
    const tokenforlogout = await getToken()
    try {
      console.log("Logging in...");
  
      const uriProps = {
        id: "removeFcmToken",
        paramValue: {
          _allPageSelected: false,
          _model: null,
          _query: {},
          _selectedIds_: null,
          data: null,
          fcmToken: "fAzP0MjZQB-2ZQhJJZ0vhz:APA91bEZcKUdE8ydeMszCIytteW0NUQSSs5nqzcJ8Sr0JAc91ZpTJxU4_BI3JaO6gWT-zf4fuUzfoBqOYF2GFX5vbwcMVn0EPywfkxzQVSuf3dFPZEzwujI",
          token: tokenforlogout,
          type: "android"
        },
        "platform": "web",
        "timezoneOffset": -330,
        "token": tokenforlogout
      }
  
      return await axios.post(`${fetchUrl}/invoke`, uriProps);

     
    } catch (error) {
      console.error("Login failed:", error?.response || error);
    }
  };
  
  export default logout;