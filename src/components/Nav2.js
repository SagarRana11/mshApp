import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerActions} from '@react-navigation/drawer';
import AlarmList from '../screens/Home/AlarmList';
import ResetPassword from '../screens/Auth/ResetPassword';
import ForgotPassword from '../screens/Auth/ForgetPassword';
import VerifyEmail from '../screens/Auth/VerifyEmail';
import PrivacyPolicy from '../screens/Home/PrivacyPolicy';
import Profile from '../screens/Home/Profile';
import {LoginForm} from '../screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import LogoutForm from '../screens/Auth/LogoutForm';
import {useDispatch, useSelector} from 'react-redux';
import { checkPermission } from './react-notification';
import {setupNotificationListeners} from './react-notification/index'
import { getUser } from '../services/tokenServices';
import { loginReducer, logoutReducer } from '../Redux/authSlice';
import NotificationHandler from './react-notification/NotificationHandler';
import { deletUser } from '../services/tokenServices';
import Home from '../screens/Home/Home';
import { RasieAlarm } from './RaiseAlarm';
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
const ScreenY = () => (
  <View>
    <Text>Screen Y</Text>
  </View>
);
const ScreenZ = () => (
  <View>
    <Text>Screen Z</Text>
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

// Drawer Navigator
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => (
  <Drawer.Navigator>
        <Drawer.Screen
      name="RaiseAlarm"
      options={{headerShown: false}}
      component={RasieAlarm}
    />
    <Drawer.Screen
      name="HomePage"
      options={{headerShown: false}}
      component={Home}
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
    />
  </Drawer.Navigator>
);

const Stack = createStackNavigator();
const PublicRoutes = () => {
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

const PrivateRoutes = () => <DrawerNavigator />;
export default function App() {
  //   const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  // useEffect(()=>{
  //   setupNotificationListeners()
  // },[])
  // useEffect(()=>{
  //   async()=>{
  //     await deletUser();
  //     dispatch(logoutReducer())
  //   }
  // },[])
  useEffect(()=>{
     const fillUser = async()=>{
        const userInfo = await getUser();
        console.log("========>",userInfo);
        userInfo && dispatch(loginReducer(userInfo));
     }
     fillUser()
  },[])

  useEffect(()=>{
     const hasPermission = async()=>{
       await checkPermission()
     }
     hasPermission();
  },[])

  const notification = useSelector(state => state.notification);
  console.log("notification", notification)
  console.log('user--------->', user);

  return user ? <PrivateRoutes /> : <PublicRoutes />;
}
