export type RecipeMeasurement =
  | "pound"
  | "gram"
  | "ounce"
  | "cup"
  | "teaspoon"
  | "tablespoon"
  | "each"
  | "kilogram"
  | "liter"
  | "piece";

export interface RecipeIngredient {
  _id?: string;
  pantryId?: string | null;
  name: string;
  ingredientsQuantity: number;
  ingredientsMeasurements: RecipeMeasurement;
}

export interface RecipeInstruction {
  _id?: string;
  description: string;
}

export interface RecipeNote {
  _id?: string;
  description: string;
}

export interface Recipe {
  _id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  notes: RecipeNote[];
  yield: number;
  calories: number;
  totalFat: number;
  sodium: number;
  totalCarbohydrates: number;
  protein: number;
  prepTime: number;
  cookTime: number;
  createdBy?: string;
  updatedBy?: string;
}
