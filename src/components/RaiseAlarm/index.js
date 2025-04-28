import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Button, Icon} from 'react-native-paper';
import PatientDetailForm from './components/PatientDetailForm';
import Gap from '../Gap';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {
  verticalScale,
  Horizontalscale,
  lineHeightScale,
} from '../../utils/normalize';
import {styles} from './components/styles'
export const RasieAlarm = () => {
  console.log('Raise Alarm Called');
  return (
    <SafeAreaProvider style={styles.mainContainer}>
      <SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
              <LinearGradient
                colors={['#cfddfd', 'white', 'white']} // Three colors
                locations={[0, 0.9, 1]} // First color at 0%, Second at 50%, Third at 100%
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.pageHeader}>
                <View
                  style={[styles.rowFlexed, styles.centered, styles.header]}>
                  <Icon source="clipboard-outline" size={30} color="#2978A0" />
                  <Text style={styles.headerText}>Patient Details</Text>
                </View>
              </LinearGradient>
              <View style={[styles.container, styles.centered]}>
                <Gap />
                <Gap />

                <PatientDetailForm />
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     height: '100%',
//     justifyContent: 'flex-start',
//     backgroundColor: 'white',
//   },
//   header: {
//     width: '100%',
//     // backgroundColor: '#cfddfd',
//     paddingVertical: verticalScale(7),
//     paddingHorizontal: Horizontalscale(7),
//     borderRadius: 10,
//   },
//   centered: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     width: '100%',
//     backgroundColor: 'white',
//   },
//   pageHeader: {height: 80, paddingVertical: verticalScale(10)},
//   rowFlexed: {
//     flexDirection: 'row',
//   },
//   headerText: {
//     fontSize: lineHeightScale(22),
//     fontFamily: 'Exo2-Italic-VariableFont_wght',
//     marginLeft: 10,
//     color: '#2978A0',
//   },
//   gap: {
//     paddingBottom: verticalScale(7),
//   },
//   inner: {
//     flexGrow: 1,
//   },
// });
