import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-paper-dropdown';
import { Locations } from '../../../constants/HospitalLocations';

export default function App({formik, title, name, placeholder, data}) {
  const handleChange =(locationName)=>{
    const location = Locations.filter(a => a.name === locationName)
    console.log('locationObj new', location[0] );
    console.log("locationObj before setting value", formik.values[name]);
    formik.setFieldValue(name, location[0]);
    console.log("name", name);
    console.log("locationObj after", formik.values[name]);
  }
  const LocationNameToShow = formik.values[name] && formik.values[name].name;
  return (
    <View style={styles.container}>
      <Dropdown
        mode="outlined"
        outlineColor="#2978A0"
        activeOutlineColor="#2978A0"
        label={title}
        options={data}
        value={LocationNameToShow}
        onSelect={handleChange}
        textInputProps={{
          outlineColor: '#2978A0', // Default outline color
          activeOutlineColor: '#2978A0', // Focused outline color
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textInput: {
    color: '',
    fontSize: 13,
    width: '85%',
  },
});
