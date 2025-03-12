import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-paper-dropdown';

export default function App({formik, title, name, placeholder, data}) {
  return (
    <View style={styles.container}>
      <Dropdown
        mode="outlined"
        outlineColor="#2978A0"
        activeOutlineColor="#2978A0"
        label={title}
        options={data}
        value={formik.values[name]}
        onSelect={formik.handleChange(name)}


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
