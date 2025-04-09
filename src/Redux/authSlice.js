import {createSlice} from '@reduxjs/toolkit';
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    isAuthenticated:false
  },
  reducers: {
    loginReducer: (state, action) => {
      state.token = action.payload.result.token
      state.user = action.payload.result.user;
      state.isAuthenticated = action.payload.isAuthenticated
    },
    logoutReducer: state => {
      state.token = null
      state.user = null;
      state.isAuthenticated = false; 
    },  

  },
});

export const { loginReducer, logoutReducer } = authSlice.actions;
export default authSlice.reducer;
