import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  ActiveShoppingList,
  PantryItem,
  StandardError,
  SuggestedRecipe,
} from "../../interfaces/interfaces";
import { logout } from "./AuthSlice";
import { apiFetch } from "../../tools/fetchHelper";

export interface DashboardState {
  expiringItems: PantryItem[] | null;
  activeShoppingList: ActiveShoppingList | null;
  suggestedRecipes: SuggestedRecipe[] | null;
  isLoading: boolean;
  error: StandardError | string | null;
}

const initialState: DashboardState = {
  expiringItems: null,
  activeShoppingList: null,
  suggestedRecipes: null,
  isLoading: false,
  error: null,
};

export const fetchDashboard = createAsyncThunk<
  // Generic parameters:
  // 1. Success return type.
  // 2. Parameter to pass to the function when you call it inside a dispatch. Now it is void, so no need to add parameters when you call it.
  // 3. Return type in case of error.
  Partial<DashboardState>,
  void,
  { rejectValue: StandardError | string }
>("dashboard/fetchDashboard", async (_, { rejectWithValue }) => {
  // Here we name the function with [sliceName]/[functionName], then the first argument after "async" is what we should pass to the function (in this case is void, so _ is provided to access the second argument, which is an object given to us from redux toolkit. This object (named thunkAPI) contains useful methods like rejectWithValue, which we need to personalize our error message. Otherwise, redux would have sent a default error message structure.)
  try {
    const data = await apiFetch<Partial<DashboardState>>("/dashboard"); // Here we use our fetchHelper. We need to declare what type of response it will give through it's generic so that now the thunk knows that the "successful" return will be exactly the one we declared before.
    return data;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "message" in error) {
      return rejectWithValue(error as StandardError);
    }

    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    // Fallback to always have a return value
    return rejectWithValue("An unexpected error occurred.");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboard: (_state, action: PayloadAction<DashboardState>) => {
      return action.payload;
    },
  },
  //   Extraredurcers are reducers' siblings. They are used to listen to other slices actions, granting us a way to not duplicate our code.
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        Object.assign(state, action.payload);
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(logout, () => {
        return initialState;
      });
  },
});

export const { setDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
