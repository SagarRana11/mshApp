import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Button, Icon} from 'react-native-paper';
import Gap from './Gap';
import {
  verticalScale,
  Horizontalscale,
  moderateScale,
  lineHeightScale,
} from '../utils/normalize';
const ImageUpload = () => {
  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>Add Images</Text>
      <Gap />
      <View style={styles.imageContainer}>
        <View style={[styles.centered, styles.imageInnerView]}>
          {false && (
            <View style={[styles.imageBox, styles.centered]}>
              <Icon source="camera" size={35} color="#2978A0" />
              <Text style={styles.ImageUploadText}>+ Upload Image</Text>
            </View>
          )}

          {true && (
            <View style={styles.selectedImageContainer}>
              <Image
                source={require('../../assets/images/imageBack5.jpg')}
                style={styles.image}
              />
              <Image
                source={require('../../assets/images/imageBack5.jpg')}
                style={styles.image}
              />
              <Image
                source={require('../../assets/images/imageBack5.jpg')}
                style={styles.image}
              />
              {true && (
                <View style={[styles.uploadButton, styles.centered]}>
                  <Icon source="upload" size={35} color="#2978A0" />
                  <Text>Upload </Text>
                </View>
              )}
            </View>
          )}
        </View>
        <Gap />
        {true && (
          <View
            style={[styles.imageBox, styles.imageSelected, styles.centered]}>
            <Icon source="camera" size={20} color="#2978A0" />
            <Text style={styles.ImageUploadText}>+ Upload Image</Text>
          </View>
        )}
        <Gap />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '93%',
    // backgroundColor:'#cfddfd',
    justifyContent: 'center',
  },
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

  rowFlexed: {
    flexDirection: 'row',
  },
  headerText: {
    fontSize: lineHeightScale(20),
    fontFamily: 'Roboto-Regular',
    marginLeft: 20,
  },
  imageContainer: {
    width: '100%',
  },
  ImageUploadText: {
    fontSize: 10,
  },
  imageBox: {
    width: '25%',
    borderRadius: 7,
    borderWidth: 1,
    paddingVertical: verticalScale(15),
    borderColor: '#2978A0',
  },
  imageSelected: {
    flexDirection: 'row',
    paddingVertical: verticalScale(2),
    width: '35%',
  },
  selectedImageContainer: {
    // backgroundColor:'pink',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    paddingVertical: verticalScale(7),
    gap: 10,
  },
  image: {
    borderRadius: 7,
    width: '22%',
    height: 80,
  },
  uploadButton: {
    width: '22%',
    height: 80,
    borderRadius: 7,
    backgroundColor: '#cfddfd',
  },
  imageInnerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    color: '#2978A0',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ImageUpload;
