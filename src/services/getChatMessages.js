import axios from 'axios';
import {REACT_APP_BASE_URL} from '../mshAppServices';
import store from "../Redux/store";

const state = store.getState();
const tokenForRequest = state?.auth?.token;
export const getChatMessages = async ({pageParam=0, queryKey}) => {
  const [_key, channel_id] = queryKey;
  const uriProps = {
    timezoneOffset: -330,
    platform: 'web',
    token: tokenForRequest,
    paramValue: {
      _allPageSelected: false,
      _query: {},
      query: {
        id: 'allPubnubChats',
        addOnFilter: {
          channel_id: channel_id,
        },
        limit: 20,
        skip: pageParam,
        sort: {
          _id: -1,
        },
      },
      model: 'PubnubChat',
    },
    id: '_find',
  };
  try {
    const response = await axios.post(`${REACT_APP_BASE_URL}/invoke`, uriProps);
    // console.log("Fetched Data:", JSON.stringify(response.data, null, 2));
    const result = response.data.response?.result ?? [];
    const nextSkip = result.length === 20 ? pageParam + 20 : undefined; 
    return { data: result,nextSkip };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};

export const sendChatMessages = async ({channel_id,messages, userId} ) => {
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




