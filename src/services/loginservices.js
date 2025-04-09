import axios from "axios";
import { storeToken, storeUser } from "../utils/tokenServices";
import { REACT_APP_BASE_URL } from "../mshAppServices";
//  "https://uatapi.stemicathaid.com"
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
    const response = await axios.post(`${REACT_APP_BASE_URL}/invoke`, uriProps);
    const responseData = response.data?.response;
    if (!responseData) {
      console.error("Error: responseData is undefined!");
      return;
    }

    const userData = responseData?.result;
    userData && (await storeUser(userData));
    return userData;
  } catch (error) {
    console.error("Login failed:", error?.response || error);
  }
};

export default login;
