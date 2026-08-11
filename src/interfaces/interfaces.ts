export interface UserDTO {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  authorities: Authority[];
  pantryItems: unknown[];
  role: string;
  userId: string;
}

export interface Authority {
  authority: string;
}

export interface StandardError {
  message: string;
  time: string;
}

export interface PantryPage {
  content: PantryPageContent[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  totalElements: number;
  totalPages: number;
}

export interface PantryPageContent {
  ingredientDefinition: IngredientDefinition;
  quantity: number;
  purchaseDate: Date;
  expirationDate: Date;
  storageLocation: string;
  pantryItemId: string;
}

export interface IngredientDefinition {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  unit: string;
  defaultStorageLocation: string;
  shelfLifeDays: number;
  alternativeUsages: string;
  seasonality: string[];
  ingredientDefinitionId: string;
}

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: Sort;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface DashboardResponse {
  expiringItems: PantryItem[];
  activeShoppingList: ActiveShoppingList;
  suggestedRecipes: SuggestedRecipe[];
}

export interface ActiveShoppingList {
  shoppingListId: string;
  createdAt: Date;
  updatedAt: Date;
  shoppingListStatus: string;
  items: ShoppingListItem[];
}

export interface ShoppingListItem {
  ingredientDefinition: IngredientDefinition;
  suggestedQuantity: number;
  suggestedUnit: string;
  purchasedQuantity: number | null;
  shoppingListItemId: string;
}

export interface IngredientDefinition {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  unit: string;
  defaultStorageLocation: string;
  shelfLifeDays: number;
  alternativeUsages: string;
  seasonality: string[];
  ingredientDefinitionId: string;
}

export interface PantryItem {
  pantryItemId: string;
  ingredientDefinitionId: string;
  ingredientName: string;
  imageUrl: string;
  quantity: number;
  unit: string;
  storageLocation: string;
  expirationDate: Date;
  daysUntilExpiration: number;
  category: string;
}

export interface SuggestedRecipe {
  id: string;
  name: string;
  imageUrl: string;
  totalTime: number;
  difficulty: string;
  cost: string;
}

export interface PantryItemUpdateDTO {
  quantity: number | null;
  purchaseDate: Date | null;
  expirationDate: Date | null;
  storageLocation: StorageLocation | null | string;
}

export interface PantryItemCreatedDTO {
  pantryItemId: string;
}

export interface ShoppingListItemCreatedDTO {
  shoppingListItemId: string;
}

export interface IngredientDefinitionPage {
  content: IngredientDefinitionPageContent[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  totalElements: number;
  totalPages: number;
}

export interface IngredientDefinitionPageContent {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  unit: Unit;
  defaultStorageLocation: StorageLocation;
  shelfLifeDays: number;
  alternativeUsages: string;
  seasonality: Seasonality[];
  ingredientDefinitionId: string;
}

export type StorageLocation = "PANTRY" | "REFRIGERATOR";

export type Seasonality = "SUMMER" | "AUTUMN" | "WINTER" | "SPRING";

export type Unit = "GRAMS" | "UNITS" | "MILLILITERS";

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: Sort;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface ShoppingListCompletedDTO {
  shoppingListId: string;
  shoppingListStatus: string;
}

export interface ShoppingListCreatedDTO {
  shoppingListId: string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toIngredientDefinitionPage(
    json: string,
  ): IngredientDefinitionPage {
    return JSON.parse(json);
  }

  public static ingredientDefinitionPageToJson(
    value: IngredientDefinitionPage,
  ): string {
    return JSON.stringify(value);
  }
}
