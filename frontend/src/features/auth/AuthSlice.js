import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  signupUser,
  fetchUserProfile,
  updateUserinProfile,
  getUserById,
} from "../../services/authService";

export const login = createAsyncThunk("auth/login", async (data) => {
  const res = await loginUser(data);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data.user;
});

export const signup = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await signupUser(data);
      return res.data;
    } catch (err) {
      console.error("Signup error:", err);

      return rejectWithValue(
        err.response?.data?.error || "Signup failed. Please try again."
      );
    }
  }
);

export const getuserByid = createAsyncThunk("auth/getUserById", async (id) => {
  const res = await getUserById(id);
  localStorage.setItem("user", JSON.stringify(res.user));
  return res.user;
});

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await fetchUserProfile();
      localStorage.setItem("user", JSON.stringify(res.user));
      return res.user;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("user");
        return null;
      }
      return thunkAPI.rejectWithValue("Failed to fetch current user");
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (data, thunkAPI) => {
    try {
      const res = await updateUserinProfile(data);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Update failed"
      );
    }
  }
);

const storedUser = localStorage.getItem("user");
const initialUser =
  storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    loading: false,
    error: null,
    successMsg: null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem("user");
      state.user = null;
    },
    clearFlash(state) {
      state.error = null;
      state.successMsg = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })

      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
        localStorage.removeItem("user");
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMsg = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.successMsg = "Profile updated successfully!";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearFlash } = AuthSlice.actions;
export default AuthSlice.reducer;
