import apiClient from "./axios.api";
import { type PantryItem } from "../types/pantry.type";

// Pantry API functions
// These functions interact with the backend API to perform CRUD operations on pantry items.
// Each function returns a Promise that resolves to the expected data type, allowing for easy integration with React components and other parts of the application.
export const getAllPantryItems = async (): Promise<PantryItem[]> => {
  const response = await apiClient.get("/pantries");
  return response.data;
};

export const getPantryItemById = async (_id: string): Promise<PantryItem> => {
  const response = await apiClient.get(`/pantries/${_id}`);
  return response.data;
};

export const createPantryItem = async (
  item: Omit<PantryItem, "_id">,
): Promise<PantryItem> => {
  const response = await apiClient.post("/pantries", item);
  return response.data;
};

export const updatePantryItem = async (
  _id: string,
  item: Partial<Omit<PantryItem, "_id">>,
): Promise<PantryItem> => {
  const response = await apiClient.put(`/pantries/${_id}`, item);
  return response.data;
};

export const deletePantryItem = async (_id: string): Promise<void> => {
  await apiClient.delete(`/pantries/${_id}`);
};
