import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../tools/axios';

const initialState = {
  tires: [],
};

export const fetchTires = createAsyncThunk('tires', async () => {
  return (await api.get('/tire/tires')).data.tires;
});

export const createTire = createAsyncThunk('tire/create', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/tire/create', formData);
    return response.data.tire;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to create');
  }
});

export const updateTire = createAsyncThunk('tire/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/tire/${id}/update`, formData);
    return response.data.tire;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update');
  }
});

export const deleteTire = createAsyncThunk('tire/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tire/${id}/delete`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to delete');
  }
});

const tireSlice = createSlice({
  name: 'tire',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTires.fulfilled, (state, action) => {
        state.tires = action.payload;
      })
      .addCase(createTire.fulfilled, (state, action) => {
        state.tires.push(action.payload);
      })
      .addCase(updateTire.fulfilled, (state, action) => {
        state.tires = state.tires.map(t => t._id === action.payload._id ? action.payload : t);
      })
      .addCase(deleteTire.fulfilled, (state, action) => {
        state.tires = state.tires.filter(t => t._id !== action.payload);
      });
  },
});

export default tireSlice.reducer;
