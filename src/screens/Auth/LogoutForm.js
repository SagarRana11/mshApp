import React, {useEffect} from 'react';
import LoadingScreen from '../../components/LoaderScreen';
import {logout} from '../../services';
import { logoutReducer } from '../../Redux/authSlice';
import { useDispatch } from 'react-redux';
const LogoutForm = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const logoutfunc = async () => {
      await logout();
      dispatch(logoutReducer())
    };
    logoutfunc()
  },[]);
  return (
    <LoadingScreen />
  );
};

export default LogoutForm
