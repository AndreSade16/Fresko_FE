import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/AuthSlice";
import userReducer from "../reducers/UserSlice";
import dashboardReducer from "../reducers/DashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
