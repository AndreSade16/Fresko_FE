import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { UserPage, StandardError } from "../../interfaces/interfaces";
import { logout } from "./AuthSlice";
import { apiFetch } from "../../tools/fetchHelper";

export interface AdminUsersState {
  data: UserPage | null;
  isLoading: boolean;
  error: StandardError | null | string;
}

const initialState: AdminUsersState = {
  data: null,
  isLoading: false,
  error: null,
};

// export const searchUsers = createAsyncThunk<
//   UserPage,
//   string | URLSearchParams | void,
//   { rejectValue: StandardError | string }
// >("users/searchUsers", async (filters, { rejectWithValue }) => {
//   try {
//     const queryString = filters ? `${filters}` : "";
//     const data = await apiFetch<IngredientDefinitionPage>(
//       `/ingredients?name=${queryString}`,
//       { method: "GET" },
//     );

//     return data;
//   } catch (error: unknown) {
//     if (typeof error === "object" && error !== null && "message" in error) {
//       return rejectWithValue(error as StandardError);
//     }

//     if (error instanceof Error) {
//       return rejectWithValue(error.message);
//     }

//     // Fallback to always have a return value
//     return rejectWithValue("An unexpected error occurred.");
//   }
// });

export const fetchAdminUsers = createAsyncThunk<
  UserPage,
  Record<string, string> | URLSearchParams | void,
  { rejectValue: StandardError | string }
>(
  "ingredientdefinitions/fetchIngredients",
  async (filters, { rejectWithValue }) => {
    try {
      const queryString = filters
        ? `?${new URLSearchParams(filters as Record<string, string>).toString()}`
        : "";
      const data = await apiFetch<UserPage>(`/ingredients${queryString}`, {
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

export const deleteIngredientDefinitionsItem = createAsyncThunk<
  string,
  string,
  { rejectValue: StandardError | string }
>(
  "ingredientdefinitions/deleteIngredientDefinitionsItem",
  async (ingredientdefinitionsItemId, { rejectWithValue }) => {
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

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    setAdminUsers: (_state, action: PayloadAction<AdminUsersState>) => {
      return action.payload;
    },
  },
  //   Extraredurcers are reducers' siblings. They are used to listen to other slices actions, granting us a way to not duplicate our code.
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
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
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(logout, () => {
        return initialState;
      });
  },
});

export const { setAdminUsers } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
