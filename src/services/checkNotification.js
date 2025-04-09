import axios from 'axios';
import store from '../Redux/store';
import { REACT_APP_BASE_URL } from '../mshAppServices';
const checkNotification = async () => {
  const state = store.getState();
  const {_id} = state?.auth.user;
  const tokenForRequest = state?.auth.token
  try {
    console.log('checking notification...');
    const uriProps = {
      id: 'checkNotification',
      paramValue: {
        _allPageSelected: false,
        _id: _id,
        _model: null,
        _query: {},
        _selectedIds_: null,
        data: null,
      },
      platform: 'web',
      timezoneOffset: -330,
      token: tokenForRequest,
    };

    const response = await axios.post(`${REACT_APP_BASE_URL}/invoke`, uriProps);
    console.log('response', response);
    return response;

  } catch (error) {
    console.error('check Notification failed:', error?.response || error);
  }
};


export default checkNotification;
