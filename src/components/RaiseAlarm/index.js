import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {Button, Icon} from 'react-native-paper';
import PatientDetailForm from './PatientDetailForm';
// import PatientForm from './newPatientForm';
import ImageUpload from '../ImageUpload';
import Gap from '../Gap';
import PatientForm from './patientForm';
import {
  verticalScale,
  Horizontalscale,
  moderateScale,
  lineHeightScale,
} from '../../utils/normalize';
export const RasieAlarm = () => {
  return (
    <ScrollView style={{marginTop:45}}>
    <View style={[styles.container, styles.centered]}>
        <View style={[styles.rowFlexed, styles.centered, styles.header]}>
          <Icon source="clipboard-outline" size={30} />
          <Text style={styles.headerText}>Patient Details</Text>
        </View>
        <Gap />
        <Gap />
        <Gap />
        <ImageUpload />
        <Gap />
        <PatientDetailForm />
    </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '70%',
    backgroundColor: '#cfddfd',
    paddingVertical: verticalScale(7),
    paddingHorizontal: Horizontalscale(7),
    borderRadius: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  rowFlexed: {
    flexDirection: 'row',
  },
  headerText: {
    fontSize: lineHeightScale(20),
    fontFamily: 'Roboto-Regular',
    marginLeft: 20,
  },
  gap: {
    paddingBottom: verticalScale(7),
  },
});
