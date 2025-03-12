import {Text, StyleSheet} from 'react-native'
import {
    verticalScale,
    Horizontalscale,
    moderateScale,
    lineHeightScale,
  } from '../utils/normalize';
const ShowError = ({errorTextMessage}) => {
  return <Text style={styles.errorMessageStyle}>{errorTextMessage}</Text>;
};

const styles = StyleSheet.create({
    errorMessageStyle: {
        color: 'red',
        fontSize: 12,
        marginBottom: verticalScale(5),
      },
})
export default ShowError;