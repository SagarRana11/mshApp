import React, {useEffect, useMemo} from 'react';
import firebase from '@react-native-firebase/app';
import FirebaseMessaging from '@react-native-firebase/messaging';
import emergency_alert from '../../../assets/sound/emergency_alert.mp3'
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Platform, PermissionsAndroid} from 'react-native';
import Sound from 'react-native-sound';
import { loadNotificationToken } from './firebaseSetup';

import Snackbar from '../SnackBar';
import {showSnackBar} from '../SnackBar'
let whoosh = null;

const NotificationHandler = () => {
  let messageListener;
  let onTokenRefreshListener;
  let backgroundMessagehandler;
  let notificationOpenedApp;
  useEffect(() => {
    const initialSetup = async () => {
      await checkPermission();
      notificationEventListener();
    };
    initialSetup();

    return () => {
      // Cleanup listeners on unmount
      messageListener && messageListener();
      onTokenRefreshListener && onTokenRefreshListener();
      backgroundMessagehandler && backgroundMessagehandler();
      notificationOpenedApp && notificationOpenedApp();
    };
  }, []);

  const checkPermission = async () => {
    const enabled = await FirebaseMessaging().hasPermission();
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
    if (enabled) {
      getToken();
    } else {
      requestPermission();
    }
  };
  const requestPermission = async () => {
    try {
      await FirebaseMessaging().requestPermission();
      getToken();
    } catch (error) {
      console.warn('permission rejected');
    }
  };
  const getAPNSToken = async () => {
    while (true) {
      const apnsToken = await FirebaseMessaging().getAPNSToken();
      if (apnsToken !== null) return apnsToken;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };
  const getToken = async () => {
    if (Platform.OS == 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
    let fcmToken = await FirebaseMessaging().getToken();
    console.log(
      'fcmToken================================================+>',
      fcmToken,
    );
    let apnsToken = null;
    let notificationToken = {};
    // console.log("fcmToken>>>>",fcmToken)
    if (fcmToken) {
      notificationToken = {
        apn: apnsToken,
        notification_token: fcmToken,
      };
      console.log(
        'notificationToken object-------------------------------------------->',
        notificationToken,
      );
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

  const setNotification = payload => {
    console.log('-------reached here also ------');
    loadNotificationToken &&
      loadNotificationToken({
        ...payload,
      });
  };

  const notificationEventListener = () => {
    if (Platform.OS !== 'ios') {
      messageListener = FirebaseMessaging().onMessage(onMessage);
      backgroundMessagehandler = FirebaseMessaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log("Background Notification:", remoteMessage);
      });

      // Open notification when app is in background
      notificationOpenedApp = FirebaseMessaging().onNotificationOpenedApp(remoteMessage => {
        console.log("Opened Notification:", remoteMessage);
      });

      // Open notification when app is killed
      FirebaseMessaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
          console.log("App opened from a killed state:", remoteMessage);
        }
      });
    }
    onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh(onTokenRefresh);
  };

  const onTokenRefresh = token => {
    // Handle token refresh logic if needed
  };

  const onMessage = remoteData => {
    console.log('Message received >>>>', remoteData);
    onNotification(remoteData);
  };

  const onNotification = async notification_payload => {
    if (notification_payload.data.hasOwnProperty('data')) {
      console.log('onNotification payload:', notification_payload);
      notification_payload = notification_payload.data;
    }

    let {title, message = '', sound = ''} = notification_payload.data;
    let data = notification_payload.data.hasOwnProperty('data')
      ? notification_payload.data.data
      : notification_payload.data;

    let {
      fromVideo = false,
      special_sound = false,
      messageNotification = 'false',
    } = data;

    if (
      fromVideo ||
      special_sound ||
      (sound && sound.includes('notif_sound')) ||
      (sound && sound.includes('call_sound'))
    ) {
      if (whoosh && whoosh.isPlaying()) {
        return;
      }

      let soundToPlay =
        Platform.OS === 'ios'
          ? fromVideo
            ? 'call_sound.caf'
            : 'notif_sound.caf'
          : fromVideo
          ? 'call_sound.mp3'
          : emergency_alert;

      Sound.setCategory('Playback');
      let systemSoundVolume = 0;

      whoosh = new Sound(soundToPlay, Sound.MAIN_BUNDLE, error => {
        if (error) {
          return;
        }

        whoosh.setCategory('Playback');
        if (!fromVideo) {
          whoosh.setNumberOfLoops(-1);
          whoosh.setVolume(1);
          whoosh.getSystemVolume(res => {
            systemSoundVolume = res;
          });
          whoosh.setSystemVolume(0.6);
        }

        whoosh.play(success => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.log('Playback failed due to decoding errors');
          }
        });
      });

      showSnackBar({
        message,
        duration: fromVideo
          ? 23000
          : (sound && sound.includes('notif_sound')) || special_sound
          ? 30000
          : 6000,
        onSwipe: () => {
          whoosh.setSystemVolume(systemSoundVolume);
          whoosh.stop();
        },
        onConfirm: async () => {
          whoosh.stop();
          console.warn('Stopped');
          // navigation.navigate('Home', {
          //   screen: 'ViewPatientDetails',
          //   param:{},
          // });
          
        },
      });
    } else if (data && data.uri && messageNotification === 'false') {
      showSnackBar({
        message: message,
        duration: 6000,
        onConfirm: () => {
          console.log('Action will be handled later');
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Snackbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 50,
  },
});

export default NotificationHandler;
