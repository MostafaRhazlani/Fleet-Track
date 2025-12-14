import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import vehicleReducer from './vehicle/vehicleSlice';
import userReducer from './user/userSlice';
import modalReducer from './ui/modalSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehicleReducer,
    users: userReducer,
    modal: modalReducer,
  },
});

export default store;
