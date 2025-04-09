import React, {useMemo, useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AlarmList from '../screens/Home/AlarmList';
import ResetPassword from '../screens/Auth/ResetPassword';
import ForgotPassword from '../screens/Auth/ForgetPassword';
import VerifyEmail from '../screens/Auth/VerifyEmail';
import Profile from '../screens/Home/Profile/Profile';
import {LoginForm} from '../screens';

import LogoutForm from '../screens/Auth/LogoutForm';
import {useSelector, useDispatch} from 'react-redux';
import Home from '../screens/Home/Home';
import {RasieAlarm} from './RaiseAlarm';
import {checkPermission} from './react-notification';
import LoadingScreen from './LoaderScreen';
import {loginReducer} from '../Redux/authSlice';
import {getUser} from '../utils/tokenServices';
const ScreenC = () => (
  <View>
    <Text>Screen C</Text>
  </View>
);
const ScreenX = () => (
  <View>
    <Text>Screen X</Text>
  </View>
);

const HomeStack = createStackNavigator();
const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="/"
      component={AlarmList}
      options={{headerShown: false}}
    />
    <HomeStack.Screen name="ViewPatientDetails" component={ScreenX} />
    <HomeStack.Screen name="ScreenC" component={ScreenC} />
  </HomeStack.Navigator>
);

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => (
  <Drawer.Navigator screenOptions={{lazy: true}}>
    <Drawer.Screen
      name="HomePage"
      options={{headerShown: false}}
      component={Home}
    />
    <Drawer.Screen
      name="RaiseAlarm"
      options={{headerShown: false}}
      component={RasieAlarm}
    />

    <Drawer.Screen
      name="AlarmList"
      options={{headerShown: false}}
      component={HomeStackNavigator}
    />
    <Drawer.Screen
      name="Logout"
      options={{headerShown: false}}
      component={LogoutForm}
    />
    <Drawer.Screen
      name="Profile"
      component={Profile}
      options={{headerShown: false}}
    />
  </Drawer.Navigator>
);

const Stack = createStackNavigator();
export const PublicRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="/" options={{headerShown: false}}>
        {() => <LoginForm />}
      </Stack.Screen>

      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
    </Stack.Navigator>
  );
};

const PrivateRoutes = () => {
  const memoizedDrawer = useMemo(() => <DrawerNavigator />, []);

  return memoizedDrawer;
};
const App = () => {
  const user = useSelector(state => state.auth);

  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    let isMounted = true;

    const fillUser = async () => {
      const fetchedUser = await getUser();
      if (fetchedUser) {
        console.log('user>>>>>>>', fetchedUser);
        dispatch(loginReducer({result: fetchedUser, isAuthenticated: true}));
      }
      setLoader(false);
    };
    fillUser();
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    const hasPermission = async () => {
      await checkPermission();
    };
    hasPermission();
  }, []);
  if (loader) {
    return <LoadingScreen />;
  }
  return user.isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
};

export default App;
