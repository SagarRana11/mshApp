import axios from 'axios';
import {removeUserInfoOnServer} from '../components/react-notification'
import store from '../Redux/store';
import {removeNotificationReducer} from '../Redux/notificationSlice'
import { deletUser } from '../utils/tokenServices';
import { REACT_APP_BASE_URL } from "../mshAppServices";


const notificationState = store.getState().notification;

const logout = async () => {
  const state = store.getState();
  const tokenforlogout = state?.auth?.token;
  try {
    console.log('Logging out...');

    const uriProps = {
      id: 'removeFcmToken',
      paramValue: {
        _allPageSelected: false,
        _model: null,
        _query: {},
        _selectedIds_: null,
        data: null,
        fcmToken: notificationState.notificationToken,
        token: tokenforlogout,
        type: 'android',
      },
      platform: 'web',
      timezoneOffset: -330,
      token: tokenforlogout,
    };
    const response = await axios.post(`${REACT_APP_BASE_URL}/invoke`, uriProps);
    // await removeUserInfoOnServer();
    store.dispatch(removeNotificationReducer());
    await deletUser();
    return response;
  } catch (error) {
    console.error('Logout failed:', error?.response || error);
  }
};

export default logout;
