import React from 'react';
import {View, Text, Button} from 'react-native';
import checkNotification from '../../../services/checkNotification';
import fetchUser from '../../../services/fetchUserDetails';
import {useSelector} from 'react-redux';

import styles from './styles';
const Profile = () => {
  const user = useSelector(state => state.auth.user);
  console.log('user>>>>>>', user);
  const {
    email,
    location: {fullName},
    role,
    name,
    phone = '',
  } = user;
  const userDetails = [
    {key: 'Email', value: email},
    {key: 'Location', value: fullName},
    {key: 'Role', value: role},
    {key: 'Name', value: name},
    {key: 'Phone', value: phone},
  ];

  console.log('userDetails>>>>', userDetails);
  // console.log("userDetails>>>>>>", userDetails);
  const handleCheckNotification = async () => {
    try {
      const result = await checkNotification(); // If checkNotification is async
      console.log('Notification check result:', result);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };
  const getUserdetails = async () => {
    try {
      const result = await fetchUser(); // If checkNotification is async
      console.log('fetch user details:', result);
    } catch (error) {
      console.error('Error fetchin user details:', error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>User Details</Text>
      {userDetails.map(row => {
        return (
          <View style={[styles.rowFlexed, styles.row]}>
            <Text>{row.key}</Text>
            <Text>{row.value}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default Profile;
