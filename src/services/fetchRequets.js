import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";

const fetchUrl = "http://192.168.3.242:5000";
const twoDaysAgoUTC = moment().subtract(2, "days").utc().format();
const sevenDaysAgoUTC = moment().subtract(7, "days").utc().format();

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("loggedUserToken");
    return token || "";
  } catch (error) {
    console.error("Error getting token:", error);
    return "";
  }
};

const fetchRequests = async ({ pageParam = 0 }) => {
  const tokenForRequest = await getToken();
  
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
            {
              $and: [
                { status: { $in: ["Completed", "Rejected", "Cancelled", "Reject with transfer"] } },
                {
                  $and: [
                    { alarm_raise_on: { $lte: twoDaysAgoUTC } },
                    { status_updated_on: { $lte: twoDaysAgoUTC } }
                  ]
                }
              ]
            },
            {
              $and: [
                { status: { $in: ["Accepted", "Under Review", "Pending Review"] } },
                {
                  $or: [
                    { $and: [{ status_updated_on: { $lte: sevenDaysAgoUTC } }] },
                    {
                      $and: [
                        { status_updated_on: { $exists: false } },
                        { alarm_raise_on: { $lte: sevenDaysAgoUTC } }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        sort: { alarm_raise_on: -1 },
        skip: pageParam,  // Fix: Use dynamic pageParam
        limit: 20,
        metadata: true,
        dataParams: {}
      },
      subscribe: true
    }
  };

  console.log("Fetching requests with:", JSON.stringify(uriProps, null, 2));

  try {
    const response = await axios.post(`${fetchUrl}/invoke`, uriProps);

    console.log("Fetched Data:", JSON.stringify(response.data, null, 2));

    const result = response.data.response?.result ?? [];
    const nextSkip = result.length === 20 ? pageParam + 20 : undefined;  // Fix: Correct nextSkip calculation

    return { data: result, nextSkip };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};

export default fetchRequests;
