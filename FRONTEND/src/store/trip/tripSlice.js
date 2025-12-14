import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../tools/axios';

const initialState = {
  trips: [],
  mytrips: [],
};

export const fetchTrips = createAsyncThunk('trips', async () => {
  return (await api.get('/trip/trips')).data.trips;
});

export const fetchMyTrips = createAsyncThunk('trips/my', async () => {
  return (await api.get('/trip/my-trips')).data.trips;
});

export const createTrip = createAsyncThunk('trip/create', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/trip/create', formData);
    return response.data.trip;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to create');
  }
});

export const updateTrip = createAsyncThunk('trip/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/trip/${id}/update`, formData);
    return response.data.trip;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update');
  }
});

export const updateTripStatus = createAsyncThunk('trip/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/trip/${id}/status`, { status });
    return response.data.trip;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update status');
  }
});

export const deleteTrip = createAsyncThunk('trip/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/trip/${id}/delete`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to delete');
  }
});

export const downloadTripPdf = createAsyncThunk('trip/downloadPdf', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/trip/${id}/pdf`, { responseType: 'blob' });
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trip-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    return { id };
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to download PDF');
  }
});

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.trips = action.payload;
      })
      .addCase(fetchMyTrips.fulfilled, (state, action) => {
        state.mytrips = action.payload;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.trips.push(action.payload);
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        state.trips = state.trips.map(t => t._id === action.payload._id ? action.payload : t);
      })
      .addCase(updateTripStatus.fulfilled, (state, action) => {
        state.trips = state.trips.map(t => t._id === action.payload._id ? action.payload : t);
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.trips = state.trips.filter(t => t._id !== action.payload);
      });
  },
});

export default tripSlice.reducer;
