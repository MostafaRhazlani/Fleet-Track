import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../tools/axios';

const initialState = {
  drivers: [],
  status: 'idle',
  error: null
};

export const fetchDrivers = createAsyncThunk('users/fetchDrivers', async () => {
  const res = await api.get('/auth/drivers');
  return res.data?.drivers || [];
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.drivers = action.payload;
      })

      .addCase(fetchDrivers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
