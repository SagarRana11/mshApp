import React, {useCallback, useEffect, useState} from 'react';
import {
  Modal,
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import {Icon, TextInput} from 'react-native-paper';
import {useFormik, FastField} from 'formik';
import * as Yup from 'yup';
import {useMutation} from '@tanstack/react-query';
import {raiseRequest} from '../../../services/requestRaise';
import DatePickerField from './DatePickerField';
import DateAndTimePicker from './DateAndTimePicker';
import LocationDropDown from './LocationDropDown';
import ShowError from '../../ShowError';
import Gap from '../../Gap';
import InfoComponents from '../../info-components/InfoComponents';
import {useSelector} from 'react-redux';
import {getLocationInfo} from '../../../utils/getLocation';
import ImagePicker from './ImagePicker';
import uploadImage from '../../../services/uploadPicture';
import debounce from 'lodash.debounce';

import {io} from 'socket.io-client';
import {
  Horizontalscale,
  verticalScale,
  moderateScale,
  lineHeightScale,
} from '../../../utils/normalize';
import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';

const locationOptions = [
  {label: 'MSH', value: 'MSH'},
  {label: 'MSQ', value: 'MSQ'},
  {label: 'MSB', value: 'MSB'},
  {label: 'MSW', value: 'MSW'},
  {label: 'MSM', value: 'MSM'},
  {label: 'MSSB', value: 'MSSB'},
  {label: 'MSSN', value: 'MSSN'},
  {label: 'MSBI', value: 'MSBI'},
];

const validationSchema = Yup.object({
  patientName: Yup.string().required('Patient Name is required'),
  dob: Yup.string().required('Date of Birth is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  medicalContact: Yup.string().required('Medical Contact Date is required'),
  location: Yup.object().required('Location is required'),
  tolocation: Yup.object().required('Cathlab Location is required'),
});

const PatientDetailForm = () => {
  const [phone, setPhone] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [images, setImages] = useState([]);
  const [imageUri, setImageUri] = useState('');
  const [modalVisible, setModalVisible] = useState('');
  const [openCamera, setOpenCamera] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const user = useSelector(state => state.auth.user);
  console.log('here is the user from patientForm', user);
  const requestRaiseMutation = useMutation({
    mutationFn: async values => {
      const uploadResult = await uploadImage({file: [...images]});
      // throw new Error("calm down boys")
      await raiseRequest({values, uploadResult});
    },
    onSuccess: data => {
      setShowLoader(false);
      setImages([]);
      console.log('Request raised successfully:', data);
    },
    onError: error => console.error('Request failed:', error),
  });

  const debouncedPhoneChange = useCallback(
    debounce(value => {
      formik.setFieldValue('phone', value);
    }, 500),
    [],
  );

  const formik = useFormik({
    initialValues: {
      patientName: '',
      dob: '',
      phone: '',
      medicalContact: '',
      location: {},
      tolocation: {},
    },
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      console.log('>>>>onSubmit called');
      setShowLoader(true);
      requestRaiseMutation.mutate(values);
      formikHelpers.resetForm({
        values: {
          patientName: '',
          dob: '',
          phone: '',
          medicalContact: '',
          location: {},
          tolocation: {},
        },
      });
    },
  });
  const cameraPermission = async () => {
    console.log('called again');
    const permissionStatement =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    try {
      const permissionsStatus = await check(permissionStatement);
      if (permissionsStatus === RESULTS.GRANTED) {
        return true;
      }
      if (
        permissionsStatus === RESULTS.DENIED ||
        permissionsStatus === RESULTS.LIMITED
      ) {
        const requestPermission = await request(permissionStatement);
        return requestPermission === RESULTS.GRANTED;
      }
    } catch (error) {
      console.error(error.response.message);
    }

    return false;
  };

  const selectImage = async () => {
    console.log('called');
    let hasPermission;
    try {
      hasPermission = await cameraPermission();
    } catch (error) {
      hasPermission = false;
    }
    setOpenCamera(hasPermission);
  };

  const deleteSelectedImage = () => {
    Alert.alert('Delete the Image', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => {
          return;
        },
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          setImages(images.filter(img => img.uri != imageUri));
          setImageUri('');
          setOpenModal(false);
        },
      },
    ]);
  };

  useEffect(() => {
    const location = formik?.values.location;
    if (formik.values.location && Object.keys(location).length != 0) {
      const locationName = location.name;
      const toLocationObj = locationOptions.filter(
        a => a.label === locationName,
      );
      if (Object.keys(toLocationObj).length != 0) {
        const toLocationName = toLocationObj[0].value;
        console.log('toLocationName--------------->', toLocationName);
        const toLocation = getLocationInfo(toLocationName);
        console.log('location------>', location);
        formik.setFieldValue('tolocation', toLocation);
      }
    }
  }, [formik?.values.location]);

  useEffect(() => {
    console.log('images-----------------------------------_>', images);
  }, [images]);

  return openCamera ? (
    <ImagePicker
      closeCamera={({data}) => {
        const newImages = data.filter(
          a => !images.map(img => img.uri).includes(a.uri),
        );
        setImages([...images, ...newImages]);
        setOpenCamera(false);
      }}
      previewImages={[...images]}
    />
  ) : (
    <View style={styles.container}>
      <Modal visible={showLoader} transparent={true}>
        <ActivityIndicator
          style={{
            position: 'absolute',
            zIndex: 100,
            justifyContent: 'center',
            alignItems: 'center',
            top: Horizontalscale(400),
            left: verticalScale(180),
          }}
          color="#2978A0"
          size="large"
          animating={showLoader}
        />
      </Modal>
      <Text style={styles.title}>Add Images</Text>
      <Gap />
      {images.length === 0 && (
        <TouchableOpacity onPress={() => selectImage()}>
          <View style={[styles.imageBox, styles.centered]}>
            <Icon source="camera" size={35} color="#2978A0" />
            <Text style={styles.ImageUploadText}>+ Upload Image</Text>
          </View>
        </TouchableOpacity>
      )}
      {images.length > 0 && (
        <View style={styles.selectedImageContainer}>
          {images.map((img, key) => (
            <TouchableOpacity
              key={key}
              onPress={() => {
                setImageUri(img.uri);
                setOpenModal(true);
              }}>
              <Image source={{uri: img.uri}} style={styles.imagePreview} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Gap />

      {images.length > 0 && images.length < 3 && (
        <TouchableOpacity
          style={[styles.imageBox, styles.imageSelected, styles.centered]}
          onPress={() => selectImage()}>
          <Icon source="camera" size={20} color="#2978A0" />
          <Text style={styles.ImageUploadText}>+ Upload Image</Text>
        </TouchableOpacity>
      )}
      <Gap />
      <TextInput
        label="Patient Name"
        mode="outlined"
        outlineColor="#2978A0"
        activeOutlineColor="#2978A0"
        value={formik.values.patientName}
        onChangeText={formik.handleChange('patientName')}
        onBlur={formik.handleBlur('patientName')}
        style={styles.textInput}
        error={
          formik.touched.patientName && formik.errors.patientName ? true : false
        }
      />
      <Gap />
      {formik.touched.patientName && formik.errors.patientName && (
        <ShowError errorTextMessage={formik.errors.patientName} />
      )}
      <Gap />

      <DatePickerField formik={formik} name="dob" title="Date Of Birth" />
      <Gap />
      {formik.touched.dob && formik.errors.dob && (
        <ShowError errorTextMessage={formik.errors.dob} />
      )}
      <Gap />

      <TextInput
        label="Phone Number"
        mode="outlined"
        keyboardType="numeric"
        outlineColor="#2978A0"
        activeOutlineColor="#2978A0"
        theme={{
          colors: {
            onSurfaceVariant: 'black',
          },
        }}
        maxLength={10}
        value={phone}
        onChangeText={value => {
          setPhone(value);
          debouncedPhoneChange(value);
        }}
        onBlur={formik.handleBlur('phone')}
        style={styles.textInput}
        error={formik.touched.phone && formik.errors.phone ? true : false}
      />
      <Gap />
      {formik.touched.phone && formik.errors.phone && (
        <ShowError errorTextMessage={formik.errors.phone} />
      )}
      <Gap />

      <DateAndTimePicker
        formik={formik}
        name="medicalContact"
        title="First Medical Contact"
      />
      <Gap />

      {formik.touched.medicalContact && formik.errors.medicalContact && (
        <ShowError errorTextMessage={formik.errors.medicalContact} />
      )}
      <Gap />

      <LocationDropDown
        name="location"
        title="Location"
        placeholder="Select Location"
        data={locationOptions}
        formik={formik}
      />
      <Gap />

      {formik.touched.location && formik.errors.location && (
        <ShowError errorTextMessage={formik.errors.location} />
      )}
      <Gap />

      <LocationDropDown
        name="tolocation"
        title="CathLab Location"
        placeholder="Select CathLab Location"
        data={locationOptions}
        formik={formik}
      />
      <Gap />

      {formik.touched.tolocation && formik.errors.tolocation && (
        <ShowError errorTextMessage={formik.errors.tolocation} />
      )}
      <Gap />
      {formik.values.location && formik.values.tolocation && (
        <InfoComponents formik={formik} user={user} />
      )}
      <Gap />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={formik.handleSubmit}>
        <Text style={{color: 'white'}}>Submit</Text>
      </TouchableOpacity>
      {openModal && (
        <Modal
          visible={openModal}
          onDismiss={() => {
            setOpenModal(false);
          }}
          transparent={true}
          // style={[styles.modalStyling, styles.centered]}
          animationType="slide">
          <View style={[styles.centered, styles.modalStyling]}>
            <Image source={{uri: imageUri}} style={styles.modalImagePreview} />
            <View style={styles.modalControlView}>
              <TouchableOpacity
                // style={styles.closeIcon}
                onPress={() => setOpenModal(false)}>
                <Icon
                  source="minus"
                  size={30}
                  color="white"
                  onPress={() => setOpenModal(false)}
                />
              </TouchableOpacity>

              <TouchableOpacity
                // style={styles.closeIcon}
                onPress={() => deleteSelectedImage(false)}>
                <Icon
                  source="close"
                  size={30}
                  color="white"
                  onPress={() => setOpenModal(false)}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '93%',
  },
  imageBox: {
    width: '25%',
    borderRadius: 7,
    borderWidth: 1,
    paddingVertical: verticalScale(15),
    borderColor: '#2978A0',
    // backgroundColor: 'pink',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageUploadText: {
    fontSize: 10,
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
    backgroundColor: '#2978A0',
    color: 'white',
    marginTop: 20,
    marginBottom: 50,
    borderRadius: 5,
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedImageContainer: {
    // backgroundColor:'pink',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingVertical: verticalScale(7),
    gap: 20,
    // backgroundColor:'pink'
  },
  imagePreview: {
    borderRadius: 7,
    width: Horizontalscale(90),
    height: verticalScale(90),
  },
  title: {
    color: '#2978A0',
    fontWeight: 'bold',
    fontSize: 19,
  },
  imageSelected: {
    flexDirection: 'row',
    paddingVertical: verticalScale(2),
    width: '35%',
  },
  modalStyling: {
    flex: 1,
  },
  modalImagePreview: {
    position: 'absolute',
    width: Dimensions.get('window').width - 50,
    height: 400,
  },
  modalControlView: {
    width: '88%',
    flexDirection: 'row',
    backgroundColor: 'black',
    position: 'relative',
    justifyContent: 'flex-end',
    // right: -151,
    top: -185,
    zIndex: 100,
  },
});

export default PatientDetailForm;
