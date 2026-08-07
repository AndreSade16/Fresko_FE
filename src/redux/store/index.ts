import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/AuthSlice";
import userReducer from "../reducers/UserSlice";
import dashboardReducer from "../reducers/DashboardSlice";
import pantryReducer from "../reducers/PantrySlice";
import ingredientdefinitionsReducer from "../reducers/IngredientDefinitionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    dashboard: dashboardReducer,
    pantry: pantryReducer,
    ingredientDefinitions: ingredientdefinitionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
