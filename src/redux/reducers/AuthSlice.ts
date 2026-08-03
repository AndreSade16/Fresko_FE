import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
}

const savedToken = localStorage.getItem("accessToken");

const initialState: AuthState = {
  accessToken: savedToken,
  isAuthenticated: !!savedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("accessToken", action.payload);
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
