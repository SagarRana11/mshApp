import {StyleSheet} from 'react-native';
import {
  verticalScale,
  Horizontalscale,
  lineHeightScale,
} from '../../../utils/normalize';
export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    // backgroundColor: '#cfddfd',
    paddingVertical: verticalScale(7),
    paddingHorizontal: Horizontalscale(7),
    borderRadius: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: 'white',
  },
  pageHeader: {height: 80, paddingVertical: verticalScale(10)},
  rowFlexed: {
    flexDirection: 'row',
  },
  headerText: {
    fontSize: lineHeightScale(22),
    fontFamily: 'Exo2-Italic-VariableFont_wght',
    marginLeft: 10,
    color: '#2978A0',
  },
  gap: {
    paddingBottom: verticalScale(7),
  },
  inner: {
    flexGrow: 1,
  },
});
