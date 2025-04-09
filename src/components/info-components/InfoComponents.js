import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const InfoComponents = props => {
  console.log('we are here');
  let locationNameToDisplay = '';
  let cathLabNameToDisplay = '';
  const {formik, user} = props;

  const data = {
    location: formik.values.location,
    toLocation: formik.values.tolocation,
  };
  const {location, toLocation} = data || {};
  const {location: userLocation = {}} = user;

  const {
    _id: locationId = '',
    name: locationName = '',
    fullName: locationFullName = '',
  } = location || {};
  const {
    _id: cathLabId = '',
    name: cathLabName = '',
    fullName: cathLabFullName = '',
  } = toLocation || {};
  if (locationName && cathLabName) {
    if (locationName == 'Floor') {
      locationNameToDisplay = userLocation.fullName;
    } else {
      locationNameToDisplay = locationFullName;
    }
    cathLabNameToDisplay = cathLabFullName;
  }

  return locationNameToDisplay &&
    locationNameToDisplay.length > 0 &&
    cathLabNameToDisplay &&
    cathLabNameToDisplay.length > 0 ? (
    <Text style={{fontSize: 18}}>
      Info: STEMI Alarm from
      {locationName == 'Floor' ? (
        <Text style={{fontWeight: 'bold'}}> outside</Text>
      ) : null}
      <Text style={{fontWeight: 'bold'}}> the {locationNameToDisplay} ED</Text>{' '}
      to
      <Text style={{fontWeight: 'bold'}}>
        {' '}
        {cathLabNameToDisplay} Cardiac Cath Lab
      </Text>
      <Text> for</Text>
      {locationNameToDisplay == cathLabNameToDisplay ? (
        <Text>
          <Text style={{fontWeight: 'bold'}}> local</Text> management
        </Text>
      ) : (
        <Text>
          {' '}
          patient<Text style={{fontWeight: 'bold'}}> transfer</Text>
        </Text>
      )}
    </Text>
  ) : null;
};

export default InfoComponents;
