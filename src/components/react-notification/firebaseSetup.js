import FirebaseMessaging from '@react-native-firebase/messaging';
import {Platform, PermissionsAndroid,Alert} from 'react-native';
import axios from 'axios';

import store from '../../Redux/store';
import {setNotificationTokenReducer} from '../../Redux/notificationSlice';
import { REACT_APP_BASE_URL } from '../../mshAppServices';
const state = store.getState();
const {auth, notification:notificationState} = state;
const user = auth.user;

// const notificationState = store.getState().notification;
export const checkPermission = async () => {
  const enabled = await FirebaseMessaging().hasPermission();
  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }
  if (enabled) {
    getToken();
  } else {
    requestPermission();
  }
};
export const requestPermission = async () => {
  try {
    await FirebaseMessaging().requestPermission();
    getToken();
  } catch (error) {
    console.warn('permission rejected');
  }
};
export const getAPNSToken = async () => {
  while (true) {
    const apnsToken = await FirebaseMessaging().getAPNSToken();
    if (apnsToken !== null) return apnsToken;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};
export const getToken = async () => {
  if (Platform.OS == 'android') {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
  let fcmToken = await FirebaseMessaging().getToken();
  let apnsToken = null;
  let notificationToken = {};
  // console.log("fcmToken>>>>",fcmToken)
  if (fcmToken) {
    notificationToken = {
      apn: apnsToken,
      notification_token: fcmToken,
    };
    setNotification(notificationToken);
  }
  if (Platform.OS === 'ios') {
    // await FirebaseMessaging().registerForRemoteNotifications();
    apnsToken = await getAPNSToken();
    notificationToken = {
      apn: apnsToken,
      notification_token: fcmToken,
    };
    setNotification(notificationToken);
  }
  // let fcmAPNSToken = await firebase.FirebaseMessaging().ios.getAPNSToken();
};

export const setNotification = payload => {
  loadNotificationToken &&
    loadNotificationToken({
      ...payload,
    });
};

export const loadNotificationToken = async (notificationObject) => {
  try {
    store.dispatch(setNotificationTokenReducer(notificationObject)); // make notification token in state new slice will e required.
  } catch (error) {
    console.log(error)
  }
  // let tokenUpdated = await AsyncStorage.getItem("TokenUpdated")
  const user = store.getState().auth.user;
  if (user) {
    registerNotificationToken({type: Platform.OS,notificationObject});
  }
};

export const registerNotificationToken = async ({type, notificationObject}) => {
  
  const auth = store.getState().auth;
  if (!notificationObject) {
    getToken();
  } else {
    const uriProps = {
      timezoneOffset: -330,
      platform: 'web',
      token: auth.token,
      id: '_notificationRegistration',
      paramValue: {
        device: notificationObject.notification_token,
        apn: notificationObject.apn,
        type: type,
      },
    };
    try {
      const response = await axios.post(`${REACT_APP_BASE_URL}/invoke`, uriProps);
      console.log("response from registerNotification", response)
    } catch (error) {
       console.log(error)
    }
    const responseData = response.data?.response;
    if (!responseData) {
      console.error('Error: responseData is undefined!');
    }  
  }
};




