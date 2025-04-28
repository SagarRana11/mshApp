import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    header: {
      width: '100%',
      paddingTop: verticalScale(20),
      justifyContent: 'center',
      alignItems: 'center',
  
      position: 'absolute',
      zIndex: 10,
      top: 0,
      backgroundColor: 'white',
    },
    AlarmHistory: {
      width: '95%',
      marginBottom: verticalScale(18),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: moderateScale(20),
    },
    chatIcon: {
      marginLeft: 'auto',
    },
    searchBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: Horizontalscale(20),
      width: '90%',
      borderRadius: verticalScale(20),
      marginBottom: Horizontalscale(20),
      padding: Horizontalscale(5),
      borderWidth: 2,
      borderColor: '#4fbfff',
      backgroundColor: '#fff',
    },
  
    textInput: {
      width: '95%',
      fontSize: moderateScale(18),
      padding: 5,
      paddingLeft: Horizontalscale(10),
    },
  });