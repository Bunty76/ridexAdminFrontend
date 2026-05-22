import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchDrivers = createAsyncThunk('drivers/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.get(`${API_URL}/drivers`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch drivers');
  }
});

export const approveDriver = createAsyncThunk('drivers/approve', async (driverId, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.patch(`${API_URL}/drivers/approve/${driverId}`, {}, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to approve driver');
  }
});

const driverSlice = createSlice({
  name: 'drivers',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateDriverLocation: (state, action) => {
      const { driverId, location } = action.payload;
      const driver = state.list.find(d => d._id === driverId);
      if (driver) {
        driver.location = location;
      }
    },
    updateDriverStatus: (state, action) => {
      const { driverId, status } = action.payload;
      const driver = state.list.find(d => d._id === driverId);
      if (driver) {
        driver.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveDriver.fulfilled, (state, action) => {
        const index = state.list.findIndex(d => d._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export const { updateDriverLocation, updateDriverStatus } = driverSlice.actions;
export default driverSlice.reducer;
