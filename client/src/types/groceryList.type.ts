import { type RecipeMeasurement } from "./recipe.type";

export type GroceryListItemStatus =
  | "Pending"
  | "In Cart"
  | "Purchased"
  | "Out of Stock";

export type GroceryListItemType =
  | "Canned"
  | "Fresh"
  | "Frozen"
  | "Dry"
  | "Refrigerated";

export interface GroceryList {
  _id: string;
  listName: string;
  recipeId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  lastUpdated?: string;
}

export interface GroceryListItem {
  _id: string;
  listId: string;
  itemName: string;
  quantityNeeded: number;
  measurement?: RecipeMeasurement;
  type?: GroceryListItemType;
  status: GroceryListItemStatus;
  pantryId?: string;
  createdBy?: string;
  updatedBy?: string;
}
