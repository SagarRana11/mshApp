import axios from "axios";
import moment from "moment";
import store from "../Redux/store";
import { REACT_APP_BASE_URL } from '../mshAppServices';
const twoDaysAgoUTC = moment().subtract(2, "days").utc().format();
const sevenDaysAgoUTC = moment().subtract(7, "days").utc().format();

const fetchRequests = async ({ pageParam = 0 }) => {
  const state = store.getState();
  const tokenForRequest = state?.auth?.token;

  
  const uriProps = {
    timezoneOffset: -330,
    platform: "web",
    token: tokenForRequest,
    id: "_find",
    paramValue: {
      model: "Request",
      query: {
        id: "requests",
        addOnFilter: {
          $or: [
            { $and: [
              {
                status: {
                  $in: [
                    "Completed",
                    "Rejected",
                    "Cancelled",
                    "Reject with transfer"
                  ]
                }
              },
              {
                status_updated_on: {
                  $gte: twoDaysAgoUTC
                }
              }
              
            ]},
            { $and: [
              {
                status: {
                  $in: [
                    "Accepted",
                    "Under Review",
                    "Pending Review",
                  ]
                }
              },
              {$or : [
                {
                  alarm_raise_on :{
                    $gte: sevenDaysAgoUTC
                  }
                }, {
                  status_updated_on: {
                    $gte: sevenDaysAgoUTC
                  }
                }
              ]}
            ]},

          ]
        },
        sort: { alarm_raise_on: -1 },
        skip: pageParam, 
        limit: 20,
        metadata: true,
        dataParams: {}
      },
      subscribe: true
    }
  };

  // console.log("Fetching requests with:", JSON.stringify(uriProps, null, 2));

  try {
    const response = await axios.post(`${REACT_APP_BASE_URL}/invoke`, uriProps);
    // console.log("Fetched Data:", JSON.stringify(response.data, null, 2));
    const result = response.data.response?.result ?? [];
    const nextSkip = result.length === 20 ? pageParam + 20 : undefined; 
    return { data: result, nextSkip };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};

export default fetchRequests;