import React, {useRef, useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import {Camera, CameraType} from 'react-native-camera-kit';
import {Icon} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';
import ImageResizer from 'react-native-image-resizer';
import {
  Horizontalscale,
  verticalScale,
  moderateScale,
  lineHeightScale,
} from '../../../utils/normalize';
const ImagePicker = props => {
  const [uri, setUri] = useState('');
  const [cameraType, setCameraType] = useState(CameraType.Back);
  const [flashModeNumber, setFlashModeNumber] = useState(0);
  const [images, setImages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const {closeCamera, previewImages} = props;
  const cameraRef = useRef(null);
  const isEmpty = arr => Array.isArray(arr) && arr.length === 0;
  useEffect(() => {
    try {
      if (!isEmpty(previewImages)) {
        setImages(previewImages); // No need to spread, just set the array
      }
    } catch (error) {
      console.error(error);
    }
  }, [previewImages]);

  const flashModes = [
    {
      mode: 'on',
      image: require('../../../../assets/images/flash_open.png'),
    },
    {
      mode: 'off',
      image: require('../../../../assets/images/flash_close.png'),
    },
    {
      mode: 'auto',
      image: require('../../../../assets/images/flash_auto.png'),
    },
  ];

  const deleteSelectedImage = () => {
    setImages(images.filter(imgObj => imgObj != imageUri));
    setImageUri('');
    setOpenModal(false);
  };

  const setFlashMode = () => {
    const nextNumber = (flashModeNumber + 1) % 3;
    setFlashModeNumber(nextNumber);
  };

  const galleryPermission = async () => {
    const permissionStatemnt =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
    try {
      const galleryPermissionStatus = await check(permissionStatemnt);
      console.log(galleryPermissionStatus);
      if (galleryPermissionStatus === RESULTS.GRANTED) {
        return true;
      }

      if (
        galleryPermissionStatus === RESULTS.DENIED ||
        galleryPermissionStatus === RESULTS.BLOCKED
      ) {
        const takePermission = await request(permissionStatemnt);
        return takePermission === RESULTS.GRANTED;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openGallery = async () => {
    const permission = await galleryPermission();
    // if (!permission) return;
    const options = {
      mediaType: 'photo',
      selectionLimit: 3,
    };
    try {
      launchImageLibrary(options, async response => {
        if (!(response.didCancel || response.errorCode)) {
          let newWidth = 1000;
          let newHeight = 1000;
          console.log('response', response);
          if (!(response.didCancel || response.errorCode)) {
            let newWidth = 1000;
            let newHeight = 1000;
            console.log('response', response);
            const allImages = response.assets;
            for (let i = 0; i < allImages.length; i++) {
              const item = allImages[i];
              if (Platform.OS === 'ios') {
                if (item.uri.startsWith('file://')) {
                  item.uri = item.uri.substring(7);
                }
              }
              if (item.height && item.height < 1000) {
                newHeight = item.height;
              }
              if (item.width && item.width < 1000) {
                newWidth = item.width;
              }
              const resizedImage = await ImageResizer.createResizedImage(
                item.uri,
                newWidth,
                newHeight,
                'JPEG',
                70,
              );
              console.log(resizedImage);
              if (resizedImage) {
                resizedImage["height"] = newHeight;
                resizedImage["width"] = newWidth;
              }

              if(images.length >=3){
                Alert.alert("Maximum of 3 pictures only");
                return;
              }else{
                setImages((prevImages) => [...prevImages, resizedImage]);
              }
            }
          }
        }
      });
    } catch (error) {}
  };
  const takePicture = async () => {
    try {
      // const data = await cameraRef.current?.capture();
      // console.log(data); // Ensuring proper access to the image URI
      // if (images.length >= 3) {
      //   Alert.alert('Maximum of three images can be selected');
      //   return;
      // }
      // setImages([...images, data]);
      let newWidth = 1000;
      let newHeight = 1000;
      const item = await cameraRef.current?.capture();
      setUri(item.uri);


        if (Platform.OS === "ios") {
          if (item.uri.startsWith("file://")) {
            item.uri = item.uri.substring(7);
          }
        }
        if (item.height && item.height < 1000) {
          newHeight = item.height;
        }
        if (item.width && item.width < 1000) {
          newWidth = item.width;
        }
        const resizedImage = await ImageResizer.createResizedImage(item.uri, newWidth, newHeight, "JPEG", 70);
        console.log(resizedImage);
        if (resizedImage) {
          resizedImage["height"] = newHeight;
          resizedImage["width"] = newWidth;
        }

        if(images.length >=3){
          Alert.alert("Maximum of 3 pictures only");
          return;
        }else{
          setImages((prevImages) => [...prevImages, resizedImage]);
        }
      // const URI = data.uri;
      // const filePath = URI.replace('file://', '');
      // const pathSplitter = '/';

      // // /foo/bar.jpg => [foo, bar.jpg]
      // const pathSegments = filePath.split(pathSplitter);
      // // [foo, bar.jpg] => bar.jpg
      // const fileName = pathSegments[pathSegments.length - 1];
      // try {
      //   await RNFS.moveFile(
      //     filePath,
      //     `${RNFS.ExternalStorageDirectoryPath}/Pictures/${fileName}`,
      //   );
      // } catch (error) {
      //   console.error(error);
      // }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };
  const changeCameraType = () => {
    cameraType === CameraType.Back
      ? setCameraType(CameraType.Front)
      : setCameraType(CameraType.Back);
  };
  return (
    <View styles={styles.centered}>
      <View
        style={[
          styles.UpperControlStyles,
          styles.centered,
          {justifyContent: 'space-between'},
        ]}>
        <TouchableOpacity onPress={() => setFlashMode()}>
          <Image
            style={styles.upperIcons}
            source={flashModes[flashModeNumber].image}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeCameraType()}>
          <Image
            style={styles.upperIcons}
            source={require('../../../../assets/images/switch_camera.png')}
          />
        </TouchableOpacity>
      </View>
      <Camera
        ref={cameraRef}
        style={styles.cameraScreen}
        cameraType={cameraType} // front/back(default)
        flashMode={flashModes[flashModeNumber].mode}
        actions={{
          rightButtonText: 'Done',
          leftButtonText: 'Cancel',
        }}
      />
      <View
        style={[
          styles.controlStyles,
          styles.centered,
          {justifyContent: 'space-between'},
        ]}>
        <TouchableOpacity onPress={() => openGallery()}>
          <Image
            style={styles.imageStyle}
            source={require('../../../../assets/images/gallery.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => takePicture()}>
          <Image
            style={styles.imageStyle}
            source={require('../../../../assets/images/shutter.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => closeCamera({data: [...images]})}>
          <Text style={{color: 'white'}}>Done</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imagePreview}>
        {images.map((imgObj, key) => (
          <TouchableOpacity
            onPress={() => {
              setOpenModal(true);
              setImageUri(imgObj);
            }}>
            <Image
              key={key}
              source={{uri: imgObj.uri}}
              style={styles.eachImageStyles}
            />
          </TouchableOpacity>
        ))}
      </View>

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

      {/* <Image source={{uri: uri}} style={styles.logo} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 400,
  },
  cameraScreen: {
    width: Dimensions.get('window').width,
    height: 500,
  },
  UpperControlStyles: {
    width: Dimensions.get('window').width,
    paddingHorizontal: Horizontalscale(15),
    height: 45,
    backgroundColor: 'black',
    flexDirection: 'row',
  },
  controlStyles: {
    width: Dimensions.get('window').width,
    paddingHorizontal: Horizontalscale(15),
    flexDirection: 'row',
    height: 65,
    backgroundColor: 'black',
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
  upperIcons: {
    width: 30,
    height: 30,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    height: 100,
    width: Dimensions.get('window').width,
    paddingHorizontal: Horizontalscale(35),
    flexDirection: 'row',
    gap: 20,
  },
  eachImageStyles: {
    width: 100,
    height: 100,
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

export default ImagePicker;
