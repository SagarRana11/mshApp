import React from 'react';
import { NativeRouter, Routes, Route } from 'react-router-native';
import AllRoutes from './src/routes';
const App = () => {
  return (
    <NativeRouter>
       <AllRoutes />
    </NativeRouter>
  );
};

export default App;

