import AsyncStorage from '@react-native-async-storage/async-storage';
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('loggedUserToken');
  } catch (error) {
    console.error('Error taking token:', error);
  }
};

export const storeToken = async value => {
  try {
    await AsyncStorage.setItem('loggedUserToken', value);
    console.log('Data stored!');
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const deleteToken = async () => {
  try {
    await AsyncStorage.removeItem('loggedUserToken');
  } catch (error) {
    console.error(error);
  }
};

export const storeUser = async value => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(value));
    console.log('Data stored!');
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getUser = async () => {
  try {
    const userInfo = await AsyncStorage.getItem('user');
    return JSON.parse(userInfo);
  } catch (error) {
    console.error('Error taking token:', error);
  }
};

export const deletUser = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error(error);
  }
};

