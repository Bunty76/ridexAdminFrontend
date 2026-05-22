import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createTrip = createAsyncThunk('trips/create', async (tripData, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.post(`${API_URL}/trips/create`, tripData, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create trip');
  }
});

export const fetchTrips = createAsyncThunk('trips/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.get(`${API_URL}/trips`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch trips');
  }
});

const tripSlice = createSlice({
  name: 'trips',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateTripStatus: (state, action) => {
      const { tripId, status } = action.payload;
      const trip = state.list.find(t => t._id === tripId);
      if (trip) {
        trip.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export const { updateTripStatus } = tripSlice.actions;
export default tripSlice.reducer;
