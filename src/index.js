import {View} from 'react-native';
import AppNavigator from './components/AppNavigation';
import NotificationHandler from './components/react-notification/NotificationHandler';
const Main = () => {
  return (
    <View style={{flex: 1}}>
      <View>
        <NotificationHandler />
      </View>
     <AppNavigator />
    </View>
  );
};

export default Main;
