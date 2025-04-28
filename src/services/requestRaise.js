import store from '../Redux/store';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import moment from 'moment';
import {Locations} from '../constants/HospitalLocations';
import {REACT_APP_BASE_URL} from '../mshAppServices';

import 'react-native-get-random-values';

export const raiseRequest = async ({values, uploadResult}) => {
  let {patientName, dob, phone, medicalContact, location, tolocation} =
    values;
  console.log("petient_name", patientName)  
  console.log('location before>>>>>', location)  
  console.log('tolocation before>>>>>', tolocation)  

  console.log('dob', dob);
  console.log('dob', moment(dob, 'DD/MM/YYYY').toDate().toISOString());
  console.log('first med', medicalContact);
  console.log(
    'medical contact',
    moment(medicalContact, 'DD/MM/YYYY, HH:mm').toDate().toISOString(),
  );

  dob = moment(dob, 'DD/MM/YYYY').toDate().toISOString();
  medicalContact = moment(medicalContact, 'DD/MM/YYYY, HH:mm')
    .toDate()
    .toISOString();
  const uuid = uuidv4();
  console.log('uuid', uuid);
 
  // throw new Error("manual stop guys relax");
  const user = store.getState().auth.user;
  console.log(user.token);
  const uriProps = {
    timezoneOffset: -330,
    platform: 'android',
    token: user.token,
    paramValue: {
      updates: [
        {
          updates: {
            insert: {
              _id: `new_${uuid}`,
              patient_name: patientName,
              dob: dob, // 2025-03-10T00:00:00.000Z
              phone_number: phone,
              first_medical_contact: medicalContact, //'2025-03-10T10:32:00.000Z'
              location: location, // {
              //     _id: '5d70afc2f9129f02a297b108',
              //     fullName: 'Mount Sinai Queens',
              //     name: 'MSQ',
              //   }
              toLocation: tolocation,
              // {
              //     _id: '60433bca2bdfc3543c374d09',
              //     fullName: 'Mount Sinai Hospital',
              //     name: 'MSH',
              //   },
              ecg_images: uploadResult ? uploadResult : [],
            },
          },
          model: 'Request',
        },
      ],
    },
    id: '_batchSave',
  };
  console.log(">>>>>>>>>uriProps", uriProps);
  // throw new Error("custom error");
  try {
    const response = await axios.post(`${REACT_APP_BASE_URL}/invoke`, uriProps);
    console.log('result', response.data.response.result[0].result);
    return response.data.response.result[0].result;
  } catch (error) {
    console.error(
      'Error:',
      error.response ? error.response.data : error.message,
    );
  }
};
