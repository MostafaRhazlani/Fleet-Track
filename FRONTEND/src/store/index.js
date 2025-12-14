import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import vehicleReducer from './vehicle/vehicleSlice';
import userReducer from './user/userSlice';
import modalReducer from './ui/modalSlice';
import tireReducer from './tire/tireSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehicleReducer,
    users: userReducer,
    modal: modalReducer,
    tires: tireReducer,
  },
});

export default store;
