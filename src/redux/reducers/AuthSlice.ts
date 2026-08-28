import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getRoleFromToken } from "../../tools/auth";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  role: string | null;
}

const savedToken = localStorage.getItem("accessToken");

const initialState: AuthState = {
  accessToken: savedToken,
  isAuthenticated: !!savedToken,
  role: savedToken ? getRoleFromToken(savedToken) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      state.role = getRoleFromToken(action.payload);
      localStorage.setItem("accessToken", action.payload);
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      state.role = null;
    },
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
