import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { PantryPage, StandardError } from "../../interfaces/interfaces";
import { logout } from "./AuthSlice";
import { apiFetch } from "../../tools/fetchHelper";

export interface PantryState {
  data: PantryPage | null;
  isLoading: boolean;
  error: StandardError | null | string;
}

const initialState: PantryState = {
  data: null,
  isLoading: false,
  error: null,
};

export const fetchPantry = createAsyncThunk<
  PantryPage,
  Record<string, string> | URLSearchParams | void,
  { rejectValue: StandardError | string }
>("pantry/fetchPantry", async (filters, { rejectWithValue }) => {
  // Here we name the function with [sliceName]/[functionName], then the first argument after "async" is what we should pass to the function (in this case is Record<string, string> | URLSearchParams | void, because filters may be provided. To access the second argument, which is an object given to us from redux toolkit. This object (named thunkAPI) contains useful methods like rejectWithValue, which we need to personalize our error message. Otherwise, redux would have sent a default error message structure.)
  try {
    const queryString = filters
      ? `?${new URLSearchParams(filters as Record<string, string>).toString()}`
      : "";
    const data = await apiFetch<PantryPage>(`/pantry-items/me${queryString}`); // Here we use our fetchHelper. We need to declare what type of response it will give through it's generic so that now the thunk knows that the "successful" return will be exactly the one we declared before.
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

export const deletePantryItem = createAsyncThunk<
  string,
  string,
  { rejectValue: StandardError | string }
>("pantry/deletePantryItem", async (pantryItemId, { rejectWithValue }) => {
  // Here we name the function with [sliceName]/[functionName], then the first argument after "async" is what we should pass to the function (in this case is Record<string, string> | URLSearchParams | void, because filters may be provided. To access the second argument, which is an object given to us from redux toolkit. This object (named thunkAPI) contains useful methods like rejectWithValue, which we need to personalize our error message. Otherwise, redux would have sent a default error message structure.)
  try {
    await apiFetch<void>(`me/pantry-items/${pantryItemId}`, {
      method: "DELETE",
    }); // Here we use our fetchHelper. We need to declare what type of response it will give through it's generic so that now the thunk knows that the "successful" return will be exactly the one we declared before.
    return pantryItemId;
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

const pantrySlice = createSlice({
  name: "pantry",
  initialState,
  reducers: {
    setPantry: (_state, action: PayloadAction<PantryState>) => {
      return action.payload;
    },
  },
  //   Extraredurcers are reducers' siblings. They are used to listen to other slices actions, granting us a way to not duplicate our code.
  extraReducers: (builder) => {
    builder
      .addCase(fetchPantry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPantry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const newPageData = action.payload;

        if (state.data && newPageData.number > 0) {
          state.data = {
            ...newPageData,
            content: [...state.data.content, ...newPageData.content],
          };
        } else {
          state.data = newPageData;
        }
      })
      .addCase(fetchPantry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(deletePantryItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePantryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (state.data) {
          state.data.content = state.data.content.filter(
            (item) => item.pantryItemId !== action.payload,
          );
          state.data.totalElements -= 1;
        }
      })
      .addCase(deletePantryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(logout, () => {
        return initialState;
      });
  },
});

export const { setPantry } = pantrySlice.actions;
export default pantrySlice.reducer;
