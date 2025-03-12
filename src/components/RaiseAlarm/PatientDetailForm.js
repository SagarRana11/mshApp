import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { raiseRequest } from '../../services/requestRaise';
import DatePickerField from './DatePickerField';
import DateAndTimePicker from './DateAndTimePicker';
import LocationDropDown from './LocationDropDown';
import ShowError from '../ShowError';
import Gap from '../Gap';

const locationOptions = [
  { label: 'MSH', value: 'MSH' },
  { label: 'MSQ', value: 'MSQ' },
  { label: 'MSB', value: 'MSB' },
  { label: 'MSW', value: 'MSW' },
  { label: 'MSM', value: 'MSM' },
  { label: 'MSSB', value: 'MSSB' },
  { label: 'MSSN', value: 'MSSN' },
  { label: 'MSBI', value: 'MSBI' },
];

const validationSchema = Yup.object({
  patientName: Yup.string().required('Patient Name is required'),
  dob: Yup.string().required('Date of Birth is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  medicalContact: Yup.string().required('Medical Contact Date is required'),
  location: Yup.string().required('Location is required'),
  tolocation: Yup.string().required('Cathlab Location is required'),
});

const PatientDetailForm = () => {
  const requestRaiseMutation = useMutation({
    mutationFn: async values => await raiseRequest(values),
    onSuccess: data => console.log('Request raised successfully:', data),
    onError: error => console.error('Request failed:', error),
  });

  const formik = useFormik({
    initialValues: {
      patientName: '',
      dob: '',
      phone: '',
      medicalContact: '',
      location: '',
      tolocation: '',
    },
    validationSchema,
    onSubmit: values => requestRaiseMutation.mutate(values),
  });

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView>
        <TextInput
          label="Patient Name"
          mode="outlined"
                    outlineColor="#2978A0"
          activeOutlineColor="#2978A0"
          value={formik.values.patientName}
          onChangeText={formik.handleChange('patientName')}
          onBlur={formik.handleBlur('patientName')}
          style={styles.textInput}
          error={formik.touched.patientName && formik.errors.patientName ? true : false}

        />
        {formik.touched.patientName && formik.errors.patientName && (
          <ShowError errorTextMessage={formik.errors.patientName} />
        )}
        <Gap />

        <DatePickerField formik={formik} name="dob" title="Date Of Birth" />
        {formik.touched.dob && formik.errors.dob && <ShowError errorTextMessage={formik.errors.dob} />}
        <Gap />

        <TextInput
          label="Phone Number"
          mode="outlined"
          keyboardType="numeric"
                    outlineColor="#2978A0"
          activeOutlineColor="#2978A0"
          maxLength={10}
          value={formik.values.phone}
          onChangeText={formik.handleChange('phone')}
          onBlur={formik.handleBlur('phone')}
          style={styles.textInput}
          error={formik.touched.phone && formik.errors.phone ? true : false}

        />
        {formik.touched.phone && formik.errors.phone && <ShowError errorTextMessage={formik.errors.phone} />}
        <Gap />

        <DateAndTimePicker formik={formik} name="medicalContact" title="First Medical Contact" />
        {formik.touched.medicalContact && formik.errors.medicalContact && (
          <ShowError errorTextMessage={formik.errors.medicalContact} />
        )}
        <Gap />

        <LocationDropDown name="location" title="Location" placeholder="Select Location" data={locationOptions} formik={formik} />
        {formik.touched.location && formik.errors.location && <ShowError errorTextMessage={formik.errors.location} />}
        <Gap />

        <LocationDropDown name="tolocation" title="CathLab Location" placeholder="Select CathLab Location" data={locationOptions} formik={formik} />
        {formik.touched.tolocation && formik.errors.tolocation && <ShowError errorTextMessage={formik.errors.tolocation} />}
        <Gap />

        <TouchableOpacity style={styles.loginButton} onPress={formik.handleSubmit}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '93%',
  },
  textInput: {
    fontSize: 13,
    width: '100%',
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#67c9fd',
    marginTop: 20,
    marginBottom: 50,
    borderRadius: 5,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default PatientDetailForm;
