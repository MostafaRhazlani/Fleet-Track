import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../tools/axios';

const initialState = {
  vehicles: [],
};

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
  },
});

export default vehicleSlice.reducer;
