import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchStores,
  fetchStoresWithReactions,
  toggleLikeStore,
} from "../../services/storeService";
import axios from "axios";
import api from "../../api";

export const getStores = createAsyncThunk(
  "stores/fetch",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const user = state.auth.user;
    if (user) {
      const res = await fetchStoresWithReactions(user.id);
      return res.data;
    } else {
      const res = await fetchStores();
      return res.data;
    }
  }
);

export const createStore = createAsyncThunk(
  "store/createStore",
  async (data, thunkAPI) => {
    try {
      console.log("in store slice to create");
      const res = await api.post("/stores/Create-Store", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("comes back to create store");
      return res.data;
    } catch (err) {
      let message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "stores/like",
  async (storeId, { rejectWithValue }) => {
    try {
      const res = await toggleLikeStore(storeId);
      return { id: storeId, isliked: res.data.reaction === "like" };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "Failed to toggle" }
      );
    }
  }
);

const StoresSlice = createSlice({
  name: "stores",
  initialState: {
    list: [],
    likeLoading: {},
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getStores.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(toggleLike.pending, (state, action) => {
        state.likeLoading[action.meta.arg] = true;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.likeLoading[action.payload.id] = false;
        state.list = state.list.map((store) =>
          store.id === action.payload.id
            ? { ...store, isliked: action.payload.isliked }
            : store
        );
      })
      .addCase(toggleLike.rejected, (state, action) => {
        const storeId = action.meta.arg;
        state.likeLoading[storeId] = false;
      })
      .addCase(createStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default StoresSlice.reducer;
export const { toggleLikeLocal } = StoresSlice.actions;
