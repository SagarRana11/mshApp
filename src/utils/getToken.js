const getToken = async () => {
    try {
      const token= await AsyncStorage.getItem('loggedUserToken');
      if (token) {
        return token
      } else {
        return;
      }
    } catch (error) {
      console.error("Error fetching token", error);
    }
};
export default getToken

