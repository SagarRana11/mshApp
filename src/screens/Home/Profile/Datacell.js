import * as React from 'react';
import { Icon, MD3Colors } from 'react-native-paper';
import styles from './styles';
import {View,Text} from 'react-native';
const Datacell = ({detail}) => {
  const {icon, label, value} = detail;
  console.log('details>>>>>>>>>>>>>>>>>>>>', detail);
  return (
    <View style={styles.cell}>
      <View style={styles.rowFlexed}>
        <Icon source={icon} color={MD3Colors.gray} size={20} />{' '}
        <Text>{label}</Text>
      </View>
      <View>
        <Text>{value}</Text>
      </View>
    </View>
  );
};

export default Datacell;
