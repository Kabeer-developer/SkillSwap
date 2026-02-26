import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBartersAPI,
  createBarterAPI,
  updateBarterStatusAPI,
  scheduleSessionAPI,
} from "./bartersAPI";

// ================= FETCH =================
export const fetchBarters = createAsyncThunk(
  "barters/fetch",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await fetchBartersAPI(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch barters"
      );
    }
  }
);

// ================= CREATE =================
export const createBarter = createAsyncThunk(
  "barters/create",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await createBarterAPI(data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create barter"
      );
    }
  }
);

// ================= UPDATE STATUS =================
export const updateBarterStatus = createAsyncThunk(
  "barters/updateStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await updateBarterStatusAPI(id, status, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// ================= SCHEDULE =================
export const scheduleSession = createAsyncThunk(
  "barters/schedule",
  async ({ id, data }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await scheduleSessionAPI(id, data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to schedule session"
      );
    }
  }
);

// ================= SLICE =================
const bartersSlice = createSlice({
  name: "barters",
  initialState: {
    barters: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchBarters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBarters.fulfilled, (state, action) => {
        state.loading = false;
        state.barters = action.payload;
      })
      .addCase(fetchBarters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createBarter.fulfilled, (state, action) => {
        state.barters.push(action.payload);
      })

      // UPDATE STATUS
      .addCase(updateBarterStatus.fulfilled, (state, action) => {
        const index = state.barters.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) {
          state.barters[index] = action.payload;
        }
      })

      // SCHEDULE
      .addCase(scheduleSession.fulfilled, (state, action) => {
        const index = state.barters.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) {
          state.barters[index] = action.payload;
        }
      });
  },
});

export default bartersSlice.reducer;