import firebase from '@react-native-firebase/app';
import FirebaseMessaging from '@react-native-firebase/messaging';
import {Platform, PermissionsAndroid,Alert} from 'react-native';
import axios from 'axios';

import store from '../../Redux/store';
import {setNotificationTokenReducer} from '../../Redux/notificationSlice';
const user = store.getState().auth.user;
const notificationState = store.getState().notification;
const fetchUrl = "https://uatapi.stemicathaid.com";
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
  console.log("fcmToken================================================+>", fcmToken)
  let apnsToken = null;
  let notificationToken = {};
  // console.log("fcmToken>>>>",fcmToken)
  if (fcmToken) {
    notificationToken = {
      apn: apnsToken,
      notification_token: fcmToken,
    };
    console.log('notificationToken object-------------------------------------------->', notificationToken)
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
  console.log('-------reached here also ------');
  loadNotificationToken &&
    loadNotificationToken({
      ...payload,
    });
};

export const loadNotificationToken = async ({notification_token, apn}) => {
  console.log(
    '============================================================================================================load Notification called',
  );
  const notificationObj = {
    notificationToken: notification_token,
    apnToken: apn,
  };
  try {
    store.dispatch(setNotificationTokenReducer(notificationObj)); // make notification token in state new slice will e required.
  } catch (error) {
    console.log(error)
  }
  // let tokenUpdated = await AsyncStorage.getItem("TokenUpdated")
  console.log('notification in state', notificationState)
  if (user) {
    registerNotificationToken({type: Platform.OS});
  }
};

export const registerNotificationToken = async ({type}) => {
  
  const notificationState = store.getState().notification;
  const user = store.getState().auth.user;


  console.log("notificationState from register-=-=-=-=", notificationState);
  if (!notificationState) {
    getToken();
  } else {
    const uriProps = {
      timezoneOffset: -330,
      platform: 'web',
      token: user.token,
      id: '_notificationRegistration',
      paramValue: {
        device: notificationState.notificationToken,
        apn: notificationState.apnToken,
        type: type,
      },
    };
    console.log("uri props of registerNotification-----", uriProps )
    try {
      const response = await axios.post(`${fetchUrl}/invoke`, uriProps);
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




export function setupNotificationListeners() {
  // Foreground: Handles incoming notifications when app is open
  FirebaseMessaging().onMessage(async remoteMessage => {
    console.log("Foreground Notification:", remoteMessage);
    Alert.alert("New Notification", remoteMessage.notification?.body);
  });

  // Background & Quit: Handles notifications when app is in background
  FirebaseMessaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("Background Notification:", remoteMessage);
  });

  // Open notification when app is in background
  FirebaseMessaging().onNotificationOpenedApp(remoteMessage => {
    console.log("Opened Notification:", remoteMessage);
  });

  // Open notification when app is killed
  FirebaseMessaging().getInitialNotification().then(remoteMessage => {
    if (remoteMessage) {
      console.log("App opened from a killed state:", remoteMessage);
    }
  });
}



