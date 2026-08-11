import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/AuthSlice";
import userReducer from "../reducers/UserSlice";
import dashboardReducer from "../reducers/DashboardSlice";
import pantryReducer from "../reducers/PantrySlice";
import shoppingListReducer from "../reducers/ShoppingListSlice";
import ingredientdefinitionsReducer from "../reducers/IngredientDefinitionSlice";
import recipesReducer from "../reducers/RecipesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    dashboard: dashboardReducer,
    pantry: pantryReducer,
    ingredientDefinitions: ingredientdefinitionsReducer,
    shoppingList: shoppingListReducer,
    recipes: recipesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
