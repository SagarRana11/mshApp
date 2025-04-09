import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationToken: null,
  apnToken: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationTokenReducer: (state, action) => {
      state.notificationToken = action.payload.notificationToken;
      state.apnToken = action.payload.apnToken;
    },
    removeNotificationReducer: (state) => {  // ✅ Fixed typo in function name
      state.notificationToken = null;
      state.apnToken = null;
    },
  },
});

export const { setNotificationTokenReducer, removeNotificationReducer } = notificationSlice.actions;
export default notificationSlice.reducer;
