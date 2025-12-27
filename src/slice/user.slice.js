import { createSlice } from "@reduxjs/toolkit";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "../utils";
import { authApi } from "../services/auth.service";

const initialState = {
  data: null,
  token: getFromLocalStorage("token") || null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.data = action.payload.data;
      state.role = action.payload.data.role;
    },
    logout: (state) => {
      state.data = null;
      state.token = null;
      state.role = null;

      removeFromLocalStorage("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.userLogin.matchFulfilled,
        (state, action) => {
          state.data = action.payload.data.user;
          state.token = action.payload.data.accessToken;
          state.role = action.payload.data.user.role;
          saveToLocalStorage("token", action.payload.data.accessToken);
        }
      )
      .addMatcher(
        authApi.endpoints.adminLogin.matchFulfilled,
        (state, action) => {
          state.data = action.payload.data.user;
          state.token = action.payload.data.accessToken;
          state.role = action.payload.data.user.role;
          saveToLocalStorage("token", action.payload.data.accessToken);
        }
      )
      .addMatcher(
        authApi.endpoints.userRegister.matchFulfilled,
        (state, action) => {
          // Registration successful, but don't auto-login
          // User needs to login separately
        }
      );
  },
});

export const { setUserDetails, logout } = userSlice.actions;

export default userSlice.reducer;
