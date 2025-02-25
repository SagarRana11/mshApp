import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchUrl = "http://192.168.3.242:5000";

const storeToken = async (value) => {
  try {
    await AsyncStorage.setItem("loggedUserToken", value);
    console.log("Data stored!");
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

const login = async ({ email, password }) => {
  try {
    console.log("Logging in...");

    const uriProps = {
      id: "_authenticateUser",
      paramValue: {
        email,
        password,
        platform: "android",
        sessionOut: false,
      },
      platform: "web",
      timezoneOffset: -330,
    };

    const response = await axios.post(`${fetchUrl}/invoke`, uriProps);

    const responseData = response.data?.response;
    if (!responseData) {
      console.error("Error: responseData is undefined!");
      return;
    }

    const resultData = responseData?.result;
    if (!resultData) {
      console.error("Error: resultData is undefined!");
      return;
    }

    const token = resultData?.token;
    if (token) {
      console.log("token--------------------------------", token);
      await storeToken(token);
    } else {
      console.warn("No token found in response!");
    }
    return response;
  } catch (error) {
    console.error("Login failed:", error?.response || error);
  }
};

export default login;
