import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../tools/axios';

const initialState = {
  vehicles: [],
  myVehicle: null,
};

export const fetchMyVehicle = createAsyncThunk('vehicle/my', async () => {
  return (await api.get('/vehicle/my-vehicle')).data.vehicle;
});

export const updateMyVehicle = createAsyncThunk('vehicle/updateMy', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.patch('/vehicle/my-vehicle', payload);
    return response.data.vehicle;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update my vehicle');
  }
});

export const fetchVehicles = createAsyncThunk('vehicles', async () => {
    return (await api.get('/vehicle/vehicles')).data.vehicles;
})

export const createVehicle = createAsyncThunk('vehicle/create', async (formData, { rejectWithValue }) => {
    try {
        const response = await api.post('/vehicle/create', formData);
        return response.data.vehicle;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to create');
    }
});

export const updateVehicle = createAsyncThunk('vehicle/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/vehicle/${id}/update`, formData);
    return response.data.vehicle;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update');
  }
});

export const deleteVehicle = createAsyncThunk('vehicle/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/vehicle/${id}/delete`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete');
    }
});

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder

    .addCase(fetchVehicles.fulfilled, (state, action) => {
      state.vehicles = action.payload;
    })

    .addCase(createVehicle.fulfilled, (state, action) => {
      state.vehicles.push(action.payload);
    })

    .addCase(updateVehicle.fulfilled, (state, action) => {
      state.vehicles = state.vehicles.map(v => v._id === action.payload._id ? action.payload : v);
    })

    .addCase(deleteVehicle.fulfilled, (state, action) => {
      state.vehicles = state.vehicles.filter(v => v._id !== action.payload);
    });
    builder.addCase(fetchMyVehicle.fulfilled, (state, action) => {
      state.myVehicle = action.payload;
    });
    builder.addCase(updateMyVehicle.fulfilled, (state, action) => {
      state.myVehicle = action.payload;
      state.vehicles = state.vehicles.map(v => v._id === action.payload._id ? action.payload : v);
    });
  },
});

export default vehicleSlice.reducer;
