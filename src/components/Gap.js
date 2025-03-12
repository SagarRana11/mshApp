import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
    verticalScale,
} from '../utils/normalize';
const Gap = () => {
  return <View style={styles.gap}></View>;
};

const styles = StyleSheet.create({
  gap: {
    paddingBottom: verticalScale(7),
  },
});
export default Gap;
