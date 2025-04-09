import {useSelector} from 'react-redux';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AlarmList from './AlarmList';
import {Icon, Chip} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

import {
  Horizontalscale,
  verticalScale,
  moderateScale,
  lineHeightScale,
} from '../../utils/normalize';

const App = () => {
  const userObj = useSelector(state => state.auth.user);
  console.log("user>>>>>>>>>>", userObj);
  const navigation = useNavigation();
  console.log('home called');
  if (
    ['Referring MD', 'ED Resident/PA'].includes(userObj.role) ||
    (userObj.role === 'Accepting MD' &&
      userObj.specialization === 'Stemi')
  ) {
    return (
      <LinearGradient
        colors={['#cfddfd', 'white']} // Three colors
        locations={[0.1, 0.9]}
        start={{x: 1, y: 0}}
        end={{x: 0, y: 0}}
        style={styles.container}>
        <Text style={styles.instruction}>
          Tap Below and upload {'\n'} ECG/EKG image to raise alarm for STEMI
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RaiseAlarm')}>
          <View style={[styles.outerRingTwo, styles.centered]}>
            <View style={[styles.outerRingOne, styles.centered]}>
              <View style={[styles.outerRing, styles.centered]}>
                <View style={[styles.button, styles.shadowWrapper]}>
                  <Icon source="hospital-box" color="white" size={100}></Icon>
                  <Text style={styles.textStyle}>Raise Alarm</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return <AlarmList />;
};

const styles = StyleSheet.create({
  instruction: {
    textAlign: 'center',
    lineHeight: 28,
    padding: verticalScale(20),
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    fontWeight: 600,
    color: '#2978A0',
    marginBottom: verticalScale(100),
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '',
    paddingBottom: 100,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    height: 180,
    backgroundColor: '#2978A0',
    borderRadius: '50%',
  },
  shadowWrapper: {
    shadowColor: 'white',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 800,
  },
  ChipStyle: {
    width: 180,
    height: 40,
    fontSize: 18,
  },
  outerRing: {
    width: 210,
    height: 210,
    backgroundColor: '#ecf1fe',
    borderRadius: '50%',
  },
  outerRingOne: {
    width: 240,
    height: 240,
    backgroundColor: '#f8f9fd',
    borderRadius: '50%',
  },
  outerRingTwo: {
    width: 270,
    height: 270,
    backgroundColor: 'white',
    borderRadius: '50%',
  },
  IconStyle: {
    elevation: 5,
  },
});

export default App;
