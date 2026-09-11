import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RecipePage, StandardError } from "../../interfaces/interfaces";
import { logout } from "./AuthSlice";
import { apiFetch } from "../../tools/fetchHelper";

export interface RecipeState {
  data: RecipePage | null;
  isLoading: boolean;
  error: StandardError | null | string;
}

const initialState: RecipeState = {
  data: null,
  isLoading: false,
  error: null,
};

export const fetchPersonalRecipes = createAsyncThunk<
  RecipePage,
  Record<string, string> | URLSearchParams | void,
  { rejectValue: StandardError | string }
>(
  "personalRecipes/fetchPersonalRecipes",
  async (filters, { rejectWithValue }) => {
    try {
      const queryString =
        filters instanceof URLSearchParams
          ? filters.toString()
          : new URLSearchParams(filters ?? {}).toString();

      const data = await apiFetch<RecipePage>(`/recipes/saved?${queryString}`, {
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
  },
);

export const savePersonalRecipe = createAsyncThunk<
  string,
  string,
  { rejectValue: StandardError | string }
>(
  "personalRecipes/savePersonalRecipe",
  async (recipeId, { rejectWithValue }) => {
    try {
      const data = await apiFetch<string>(`/recipes/${recipeId}/save`, {
        method: "POST",
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
  },
);

const personalRecipesSlice = createSlice({
  name: "personalRecipes",
  initialState,
  reducers: {
    setRecipes: (_state, action: PayloadAction<RecipeState>) => {
      return action.payload;
    },
  },
  //   Extraredurcers are reducers' siblings. They are used to listen to other slices actions, granting us a way to not duplicate our code.
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersonalRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPersonalRecipes.fulfilled, (state, action) => {
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
      .addCase(fetchPersonalRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(logout, () => {
        return initialState;
      });
  },
});

export const { setRecipes } = personalRecipesSlice.actions;
export default personalRecipesSlice.reducer;
