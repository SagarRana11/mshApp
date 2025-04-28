import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
  Pressable
} from "react-native";
import ImageResizer from "react-native-image-resizer";
import { CameraScreen } from 'react-native-camera-kit';
import { launchImageLibrary } from "react-native-image-picker";
import { RESULTS, PERMISSIONS,check, request } from "react-native-permissions";
const sideType = {
    front: 'front',
    back: 'back'
}
const flashMode = {
    on: 'on',
    off: 'off'
}


export default class App extends Component {
  static defaultProps = {
    maxSize: 3,
    sideType: sideType.back,
    flashMode: 0,
    pictureOptions: {}
  };
  constructor(props) {
    super(props);
    this.flashModes = [
        flashMode.off,
        flashMode.on
    ];
    this.state = {
      data: [],
      previewImageData : [],
      isPreview: false,
      sideType: sideType.back,
      flashMode: flashMode.off,
      galleryData: [],
      modalVisible: true,
      loader: false,
      galleryIconHovered : false,
    };
    this.camera = null;

    if(this.props.pickedImages){
      for(let i = 0; i < this.props.pickedImages.length; i++){
        this.state.previewImageData.push(this.props.pickedImages[i].response);
      }
    }
    
  }


  hasStoragePermission = async () => {
    let storagePermission = PERMISSIONS.IOS.PHOTO_LIBRARY;

    try {
      const permissionStatus = await check(storagePermission);

      if (permissionStatus === RESULTS.GRANTED) {
        return true;
      }

      if (permissionStatus === RESULTS.DENIED || permissionStatus === RESULTS.LIMITED) {
        const requestResult = await request(storagePermission);
        return requestResult === RESULTS.GRANTED;
      }

      return false;
    }catch (error) {
      return false;
    }
  };


  _clickFlashMode = () => {
    // const newMode = (this.state.flashMode + 1) % this.flashModes.length;
    this.setState({ flashMode: this.state.flashMode === flashMode.off ? flashMode.on : flashMode.off});
  };
  _clickTakePicture = async () => {
    if (this.camera) {
      let newWidth = 1000;
      let newHeight = 1000;
      this.setState({ loader: true });
      this.camera
        .takePictureAsync({
          mirrorImage: this.state.sideType === sideType.front,
          fixOrientation: true,
          forceUpOrientation: true,
          ...this.props.pictureOptions
        })
        .then(item => {
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

          return ImageResizer.createResizedImage(item.uri, newWidth, newHeight, "JPEG", 70);
        })
        .then(item => {
          if (item) {
            item["height"] = newHeight;
            item["width"] = newWidth;
          }
          if (this.props.maxSize > 1) {
            if (this.state.data.length >= this.props.maximumSize) {
              Alert.alert(`Upload maximum ${this.props.maximumSize} pictures`);
            } else {
              this.setState({
                data: [...this.state.data, item]
              });
            }
          } else {
            this.setState({
              data: [item],
              isPreview: true
            });
          }
          this.setState({ loader: false });
        })
        .catch(err => {
          this.setState({ loader: false });
        });
    }
  };
  _clickSwitchSide = () => {
    const target =
      this.state.sideType === sideType.back
        ? sideType.front
        : sideType.back;
    this.setState({ sideType: target });
  };

  openGallery = async() => {
    if(Platform.OS == 'ios'){
      const hasStoragePermission = await this.hasStoragePermission();   
      if(!hasStoragePermission){
        return
      }
    }
   
    const options = {
      mediaType: 'photo',
      selectionLimit: 3,
    };
  
    launchImageLibrary(options, async(response) => {
      if(!(response.didCancel || response.errorCode) ){
        let newWidth = 1000;
        let newHeight = 1000;  
        console.log('response', response);
        const allImages = response.assets;
        for(let i = 0; i < allImages.length; i++){
          const item = allImages[i];
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
    
          if (resizedImage) {
            resizedImage["height"] = newHeight;
            resizedImage["width"] = newWidth;
          }
            if (this.state.previewImageData.length >= this.props.maximumSize) {
              Alert.alert(`Upload maximum 3 pictures`);
              return;
            } else {
              this.setState({
                data: [...this.state.data, resizedImage],
                previewImageData : [...this.state.previewImageData, resizedImage]
              });
            }
          this.setState({ loader: false });

       } 
      }
    });
  };
  
  saveGallery = () => {
    const { data } = this.state;
    this.setState({ modalVisible: false });
    this.props.closeCamera(false);
    data.map((value, key) => {
      this.props.showData({ uri: value.uri, response: value });
    });
  };
  _renderControlsView = () => {
    const { data, previewImageData } = this.state;
        return (
      <View style={styles.controlView}>
        <View style={styles.bottom}>
            
          <View style={[styles.actionBarView, { marginHorizontal: 5, height: 84 }]}>
            <View style={styles.previewView}>
              {previewImageData.map((value, key) => (
                <Image key={key} style={styles.previewImage} source={{ uri: value.uri }} />
              ))}
            </View>
            {previewImageData.length > 0 && (
              <TouchableOpacity onPress={this.saveGallery} style={[styles.doneView, styles.buttonView]}>
                <Text style={{ color: "white", fontSize: 20 }}>{previewImageData.length ? previewImageData.length : "0"}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };
  galleryView =()=>{
    return(
      <View 
       style={styles.touchableGallery}
      >
        <TouchableOpacity
          onPress={() =>{
            this.openGallery()}}
        >
          <Image 
            source={require("../../public/images/gallery.png")}
            style={styles.galleryIconPreview}
          />
      </TouchableOpacity>      
    </View>
    )
  }

  onBottomButtonPressed = async (event) =>{
    let newWidth = 1000;
    let newHeight = 1000;
    if(event.type == 'capture'){
      let item = event.image;
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

      if (resizedImage) {
        resizedImage["height"] = newHeight;
        resizedImage["width"] = newWidth;
      }
        if (this.state.previewImageData.length >= this.props.maximumSize) {
          Alert.alert(`Upload maximum 3 pictures`);
        } else {
          this.setState({
            data: [...this.state.data, resizedImage],
            previewImageData : [...this.state.previewImageData, resizedImage]
          });

        }
      this.setState({ loader: false });
    }

    else if(event.type== 'right'){
      this.saveGallery();
    }
  }

  render() {
    return (
      <Modal
        visible={this.state.modalVisible}
        style={styles.container}
        onRequestClose={() => {
          this.setState({ loader: false, modalVisible: false });
          this.props.closeCamera(false);
        }}
        presentationStyle={"fullScreen"}
      >
        {this.state.loader && (
          <View
            style={{
              zIndex: 100,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              position: "absolute",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <ActivityIndicator size="large" color="rgb(38,172,245)" />
          </View>
        )}
        <CameraScreen
            ref={(ref) => (this.camera = ref)}
            actions={{ rightButtonText:  'Done'}}
            pointerEvents="box-none"
            onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
            flashImages={{
                // optional, images for flash state
                on: require("../../public/images/flash_open.png"),
                off: require("../../public/images/flash_close.png"),
                auto: require("../../public/images/flash_auto.png"),
            }}
            cameraFlipImage={require("../../public/images/switch_camera.png")} // optional, image for flipping camera button
            captureButtonImage={require("../../public/images/shutter.png")} // optional, image capture button
            torchOnImage={require("../../public/images/flash_open.png")} // optional, image for toggling on flash light
            torchOffImage={require("../../public/images/flash_close.png")} // optional, image for toggling off flash light
            hideControls={false} // (default false) optional, hides camera controls
            showCapturedImageCount={false} // (default false) optional, show count for photos taken during that capture session
            scanBarcode = {false}
        />
        {this.galleryView()}
        {this._renderControlsView()}
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  controlView: {
    // position: "absolute",
    // bottom: 10,
    // // top: 0,
    // left: 0,
    // right: 0,
    // zIndex: 1
    flex: 0.1,
    width: '100%',
    backgroundColor:'#000000'
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  actionBarView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  buttonView: {
    justifyContent: "center",
    alignItems: "center"
  },
  buttonImage: {
    width: 44,
    height: 44,
    margin: 10
  },
  takeImage: {
    width: 64,
    height: 64,
    margin: 10
  },
  previewView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  previewImage: {
    width: 64,
    height: 64,
    margin: 7
  },
  doneView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#87CEEB",
    marginRight: 5
  },
  galleryIconPreview :{
    width : 48,
    height : 48,

  },
  touchableGallery:{
    position:'absolute',
    bottom:83,
    left:15,
    width:64,
    height:64,
    zIndex : 1000,
  },
});
