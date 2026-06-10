import apiClient from "./axios.api";
import { type Recipe } from "../types/recipe.type";

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const response = await apiClient.get("/recipes");
  return response.data;
};

export const getRecipeById = async (_id: string): Promise<Recipe> => {
  const response = await apiClient.get(`/recipes/${_id}`);
  return response.data;
};

export const createRecipe = async (
  recipe: Omit<Recipe, "_id">,
): Promise<Recipe> => {
  const response = await apiClient.post("/recipes", recipe);
  return response.data;
};

export const updateRecipe = async (
  _id: string,
  recipe: Partial<Omit<Recipe, "_id">>,
): Promise<Recipe> => {
  const response = await apiClient.put(`/recipes/${_id}`, recipe);
  return response.data;
};

export const deleteRecipe = async (_id: string): Promise<void> => {
  await apiClient.delete(`/recipes/${_id}`);
};
