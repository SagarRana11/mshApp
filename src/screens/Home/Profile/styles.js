import {StyleSheet} from 'react-native';
// const { Horizontalscale, verticalScale, moderateScale, lineHeightScale} from 'no'
const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowFlexed: {
    flexDirection: 'row',
  },
  row:{
    justifyContent:"space-between",
    width:'100%'
  },
  tableCell:{
    width: "20%"
  },
  tableCell2:{
    width: "80%"
  },
  cell:{
    height: 50,
    width: "100%"
  }
});

export default styles;
