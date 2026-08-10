import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  ActiveShoppingList,
  StandardError,
} from "../../interfaces/interfaces";
import { logout } from "./AuthSlice";
import { apiFetch } from "../../tools/fetchHelper";

export interface ShoppingListState {
  data: ActiveShoppingList | null;
  isLoading: boolean;
  error: StandardError | null | string;
}

const initialState: ShoppingListState = {
  data: null,
  isLoading: false,
  error: null,
};

export const fetchActiveShoppingList = createAsyncThunk<
  ActiveShoppingList,
  void,
  { rejectValue: StandardError | string }
>("shoppinglists/fetchActiveShoppingList", async (_, { rejectWithValue }) => {
  try {
    const data = await apiFetch<ActiveShoppingList>(`/shopping-lists/me`, {
      method: "GET",
    });

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

const shoppinglistsSlice = createSlice({
  name: "shoppinglists",
  initialState,
  reducers: {
    setShoppingLists: (_state, action: PayloadAction<ShoppingListState>) => {
      return action.payload;
    },
  },
  //   Extraredurcers are reducers' siblings. They are used to listen to other slices actions, granting us a way to not duplicate our code.
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveShoppingList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveShoppingList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchActiveShoppingList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(logout, () => {
        return initialState;
      });
  },
});

export const { setShoppingLists } = shoppinglistsSlice.actions;
export default shoppinglistsSlice.reducer;
