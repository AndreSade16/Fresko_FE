import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  IngredientDefinitionPage,
  StandardError,
} from "../../interfaces/interfaces";
import { logout } from "./AuthSlice";
import { apiFetch } from "../../tools/fetchHelper";

export interface IngredientDefinitionsState {
  data: IngredientDefinitionPage | null;
  isLoading: boolean;
  error: StandardError | null | string;
}

const initialState: IngredientDefinitionsState = {
  data: null,
  isLoading: false,
  error: null,
};

export const searchIngredientDefinitions = createAsyncThunk<
  IngredientDefinitionPage,
  string | URLSearchParams | void,
  { rejectValue: StandardError | string }
>(
  "ingredientdefinitions/searchIngredientDefinitions",
  async (filters, { rejectWithValue }) => {
    try {
      const queryString = filters ? `${filters}` : "";
      const data = await apiFetch<IngredientDefinitionPage>(
        `/ingredients?name=${queryString}`,
        { method: "GET" },
      );

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

export const fetchIngredients = createAsyncThunk<
  IngredientDefinitionPage,
  Record<string, string> | URLSearchParams | void,
  { rejectValue: StandardError | string }
>(
  "ingredientdefinitions/fetchIngredients",
  async (filters, { rejectWithValue }) => {
    try {
      const queryString = filters
        ? `?${new URLSearchParams(filters as Record<string, string>).toString()}`
        : "";
      const data = await apiFetch<IngredientDefinitionPage>(
        `/ingredients${queryString}`,
        { method: "GET" },
      );

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

export const deleteIngredientDefinitionsItem = createAsyncThunk<
  string,
  string,
  { rejectValue: StandardError | string }
>(
  "ingredientdefinitions/deleteIngredientDefinitionsItem",
  async (ingredientdefinitionsItemId, { rejectWithValue }) => {
    // Here we name the function with [sliceName]/[functionName], then the first argument after "async" is what we should pass to the function (in this case is Record<string, string> | URLSearchParams | void, because filters may be provided. To access the second argument, which is an object given to us from redux toolkit. This object (named thunkAPI) contains useful methods like rejectWithValue, which we need to personalize our error message. Otherwise, redux would have sent a default error message structure.)
    try {
      await apiFetch<void>(
        `/ingredientdefinitions-items/me/${ingredientdefinitionsItemId}`,
        {
          method: "DELETE",
        },
      ); // Here we use our fetchHelper. We need to declare what type of response it will give through it's generic so that now the thunk knows that the "successful" return will be exactly the one we declared before.
      return ingredientdefinitionsItemId;
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

// export const createIngredientDefinitionsItem = createAsyncThunk<
//   IngredientDefinitionsItemCreatedDTO,
//   IngredientDefinitionsItemDTO,
//   { rejectValue: StandardError | string }
// >(
//   "ingredientdefinitions/createIngredientDefinitionsItem",
//   async (ingredientdefinitionsItemDto, { rejectWithValue }) => {
//     try {
//       const data = await apiFetch<IngredientDefinitionsItemCreatedDTO>(
//         `/ingredientdefinitions-items/me`,
//         {
//           method: "POST",
//           body: ingredientdefinitionsItemDto as unknown as BodyInit,
//         },
//       );

//       return data;
//     } catch (error: unknown) {
//       if (typeof error === "object" && error !== null && "message" in error) {
//         return rejectWithValue(error as StandardError);
//       }

//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }

//       return rejectWithValue("An unexpected error occurred.");
//     }
//   },
// );

const ingredientdefinitionsSlice = createSlice({
  name: "ingredientdefinitions",
  initialState,
  reducers: {
    setIngredientDefinitions: (
      _state,
      action: PayloadAction<IngredientDefinitionsState>,
    ) => {
      return action.payload;
    },
  },
  //   Extraredurcers are reducers' siblings. They are used to listen to other slices actions, granting us a way to not duplicate our code.
  extraReducers: (builder) => {
    builder
      .addCase(searchIngredientDefinitions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchIngredientDefinitions.fulfilled, (state, action) => {
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
      .addCase(searchIngredientDefinitions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
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
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown error";
      })
      //   .addCase(deleteIngredientDefinitionsItem.pending, (state) => {
      //     state.isLoading = true;
      //     state.error = null;
      //   })
      //   .addCase(deleteIngredientDefinitionsItem.fulfilled, (state, action) => {
      //     state.isLoading = false;
      //     state.error = null;
      //     if (state.data) {
      //       state.data.content = state.data.content.filter(
      //         (item) => item.ingredientdefinitionId !== action.payload,
      //       );
      //       state.data.totalElements -= 1;
      //     }
      //   })
      //   .addCase(deleteIngredientDefinitionsItem.rejected, (state, action) => {
      //     state.isLoading = false;
      //     state.error = action.payload ?? "Unknown error";
      //   })
      //   .addCase(createIngredientDefinitionsItem.pending, (state) => {
      //     state.isLoading = true;
      //     state.error = null;
      //   })
      //   .addCase(createIngredientDefinitionsItem.fulfilled, (state) => {
      //     state.isLoading = false;
      //     state.error = null;
      //   })
      //   .addCase(createIngredientDefinitionsItem.rejected, (state, action) => {
      //     state.isLoading = false;
      //     state.error = action.payload ?? "Unknown error";
      //   })
      .addCase(logout, () => {
        return initialState;
      });
  },
});

export const { setIngredientDefinitions } = ingredientdefinitionsSlice.actions;
export default ingredientdefinitionsSlice.reducer;
