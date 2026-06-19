import apiClient from "./axios.api";
import {
  type GroceryList,
  type GroceryListItem,
} from "../types/groceryList.type";

// --- GroceryList ---

export const getAllGroceryLists = async (): Promise<GroceryList[]> => {
  const response = await apiClient.get("/grocery-lists");
  return response.data;
};

export const createGroceryList = async (
  listName: string,
): Promise<GroceryList> => {
  const response = await apiClient.post("/grocery-lists", { listName });
  return response.data;
};

export const updateGroceryList = async (
  _id: string,
  data: Partial<GroceryList>,
): Promise<GroceryList> => {
  const response = await apiClient.put(`/grocery-lists/${_id}`, data);
  return response.data;
};

export const deleteGroceryList = async (_id: string): Promise<void> => {
  await apiClient.delete(`/grocery-lists/${_id}`);
};

export const createFromRecipe = async (
  recipeId: string,
): Promise<{ list: GroceryList; items: GroceryListItem[] }> => {
  const response = await apiClient.post(
    `/grocery-lists/from-recipe/${recipeId}`,
  );
  return response.data;
};

export const purchaseList = async (
  listId: string,
): Promise<{ message: string; pantryItems: unknown[] }> => {
  const response = await apiClient.post(`/grocery-lists/${listId}/purchase`);
  return response.data;
};

// --- GroceryListItem ---

export const getItemsByListId = async (
  listId: string,
): Promise<GroceryListItem[]> => {
  const response = await apiClient.get(`/grocery-list-items?listId=${listId}`);
  return response.data;
};

export const createGroceryListItem = async (
  item: Omit<GroceryListItem, "_id">,
): Promise<GroceryListItem> => {
  const response = await apiClient.post("/grocery-list-items", item);
  return response.data;
};

export const updateGroceryListItem = async (
  _id: string,
  data: Partial<GroceryListItem>,
): Promise<GroceryListItem> => {
  const response = await apiClient.put(`/grocery-list-items/${_id}`, data);
  return response.data;
};

export const deleteGroceryListItem = async (_id: string): Promise<void> => {
  await apiClient.delete(`/grocery-list-items/${_id}`);
};
