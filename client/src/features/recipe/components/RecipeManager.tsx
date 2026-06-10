import { useState, useEffect } from "react";
import { type Recipe } from "../../../types/recipe.type";
import {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../../../api/recipe.api";

import RecipeDashboard from "./RecipeDashboard";
import RecipeList from "./RecipeList";
import RecipeDetail from "./RecipeDetail";
import RecipeForm from "./RecipeForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

function RecipeManager() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const data = await getAllRecipes();
        setRecipes(data);
        setError(null);
      } catch {
        setError("Failed to fetch recipes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setFormMode(null);
  };

  const handleAddRecipe = async (
    formData: Omit<Recipe, "_id" | "createdBy" | "updatedBy">,
  ) => {
    const newRecipe = await createRecipe(formData as Omit<Recipe, "_id">);
    setRecipes((prev) => [...prev, newRecipe]);
    setFormMode(null);
  };

  const handleUpdateRecipe = async (formData: Partial<Omit<Recipe, "_id">>) => {
    if (!selectedRecipe) return;
    const updatedRecipe = await updateRecipe(selectedRecipe._id, formData);
    setRecipes((prev) =>
      prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r)),
    );
    setSelectedRecipe(updatedRecipe);
    setFormMode(null);
  };

  const handleDeleteRecipe = async (_id: string) => {
    await deleteRecipe(_id);
    setRecipes((prev) => prev.filter((r) => r._id !== _id));
    setSelectedRecipe(null);
  };

  return (
    <div>
      <RecipeDashboard
        recipeCount={recipes.length}
        onAddClick={() => {
          setSelectedRecipe(null);
          setFormMode("add");
        }}
      />

      {isLoading && <p>Loading recipes...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <RecipeList recipes={recipes} onSelectRecipe={handleSelectRecipe} />

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          formMode={formMode === "add" ? null : formMode}
          onEdit={() => setFormMode("edit")}
          onDelete={() => handleDeleteRecipe(selectedRecipe._id)}
          onClose={() => setSelectedRecipe(null)}
          onCancel={() => setFormMode(null)}
          onSubmit={(data) => handleUpdateRecipe(data)}
        />
      )}

      <Dialog
        open={formMode === "add"}
        onOpenChange={(isOpen) => !isOpen && setFormMode(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Recipe</DialogTitle>
            <DialogDescription>
              Fill in the details for the new recipe.
            </DialogDescription>
          </DialogHeader>

          <RecipeForm
            selectedRecipe={null}
            onSubmit={handleAddRecipe}
            onCancel={() => setFormMode(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RecipeManager;
