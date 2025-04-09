import axios from 'axios';
import {REACT_APP_BASE_URL} from '../mshAppServices';
import store from '../Redux/store';
const user = store.getState().auth?.user;

const fetchUser = async () => {
  const image = await getUserImage();
  try {
    console.log('fetching user data');
    const uriProps = {
      timezoneOffset: -330,
      platform: 'web',
      token: user.token,
      id: '_find',
      paramValue: {
        query: {
          id: 'userDetail',
          paramValue: {
            user: user.user._id,
          },
          limit: 1,
          skip: 0,
          metadata: true,
        },
        model: 'User',
        subscribe: true,
      },
    };
    console.log('usiProps>>>>>>>>>>', uriProps);

    const response = await axios.post(`${REACT_APP_BASE_URL}/invoke`, uriProps);
    const responseData = response.data?.response;
    if (!responseData) {
      console.error('Error: responseData is undefined!');
      return;
    }

    const userData = responseData?.result;
    console.log('finalUserData>>>>>>>>', {...userData, photo:image});
    return userData;
  } catch (error) {
    console.error('userFetch error:', error?.response || error);
  }
};

const getUserImage = async () => {
  console.log('user>>>>>>>>>>>>>', user);
  try {
    console.log('fetching user image');
    const uriProps = {
      timezoneOffset: -330,
      platform: 'web',
      token: user.token,
      id: '_find',
      paramValue: {
        query: {
          id: 'getUserByEmail',
          paramValue: {
            email: user.user.email,
          },

          limit: 1,
          skip: 0,
          metadata: true,
        },
        model: 'User',
        subscribe: true,
      },
    };
    const response = await axios.post(`${REACT_APP_BASE_URL}/invoke`, uriProps);
    const responseData = response.data?.response;
    if (!responseData) {
      console.error('Error: responseData is undefined!');
      return;
    }

    const image = responseData?.result?.photo;
    console.log('Image>>>>>>>>', image);

    return image;
  } catch (error) {
    console.error('userFetch error:', error?.response || error);
  }
};

export default fetchUser;
