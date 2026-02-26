import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBartersAPI,
  createBarterAPI,
  updateBarterStatusAPI,
} from "./bartersAPI";

export const fetchBarters = createAsyncThunk(
  "barters/fetch",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    return await fetchBartersAPI(token);
  }
);

export const createBarter = createAsyncThunk(
  "barters/create",
  async (data, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    return await createBarterAPI(data, token);
  }
);

export const updateBarterStatus = createAsyncThunk(
  "barters/updateStatus",
  async ({ id, status }, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    return await updateBarterStatusAPI(id, status, token);
  }
);

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
      .addCase(fetchBarters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBarters.fulfilled, (state, action) => {
        state.loading = false;
        state.barters = action.payload;
      })
      .addCase(createBarter.fulfilled, (state, action) => {
        state.barters.push(action.payload);
      })
      .addCase(updateBarterStatus.fulfilled, (state, action) => {
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