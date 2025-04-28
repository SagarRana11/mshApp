import axios from 'axios';
import store from '../Redux/store';
import {REACT_APP_BASE_URL} from '../mshAppServices';
export const sendPubNubMessages = async ({channel_id,messages, userId} ) => {
  console.log("channelid>>", channel_id);
  console.log("message>>", messages);
  console.log("userId>>", userId);
  const state = store.getState();
  const tokenForRequest = state?.auth?.token;
  console.log("token>>>", tokenForRequest)
  const uriProps = {
    timezoneOffset: -330,
    platform: 'web',
    token: tokenForRequest,
    paramValue: {
      _allPageSelected: false,
      _query: {},
      updates: {
        _updates: {
          insert: {
            messageType: 'text',
            text: messages,
            channel_id: channel_id,
            user: {
              _id: userId,
            },
          },
        },
      },
      model: 'PubnubChat',
    },
    id: '_save',
  };
  try {
    const response = await axios.post(`${REACT_APP_BASE_URL}/invoke`, uriProps);
    console.log("repsol>>>>>>>", JSON.stringify(response.data, null, 2));
    // const result = response.data.response?.result ?? [];
    // return { data: result };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};


