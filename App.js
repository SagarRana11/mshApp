import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Main from './src';
import store from './src/Redux/store';
import { Provider } from 'react-redux';
const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Main />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
