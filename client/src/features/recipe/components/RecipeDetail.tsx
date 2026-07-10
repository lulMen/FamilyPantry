import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Recipe } from "../../../types/recipe.type";
import { createFromRecipe } from "../../../api/groceryList.api";
import { getErrorMessage } from "../../../utils/errorMessage";
import RecipeForm from "./RecipeForm";
import ErrorBanner from "../../../components/ErrorBanner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";

interface RecipeDetailProps {
  recipe: Recipe;
  formMode: "edit" | null;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onClose: () => void;
  onCancel: () => void;
  onSubmit: (
    data: Omit<Recipe, "_id" | "createdBy" | "updatedBy">,
  ) => Promise<void>;

  error?: string | null;
  onDismissError?: () => void;
}

function RecipeDetail({
  recipe,
  formMode,
  onEdit,
  onDelete,
  onClose,
  onCancel,
  onSubmit,
  error,
  onDismissError,
}: RecipeDetailProps) {
  const navigate = useNavigate();
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSendToShoppingList = async () => {
    setIsSending(true);
    try {
      await createFromRecipe(recipe._id);
      navigate("/shopping-lists");
    } catch (err) {
      setSendError(
        getErrorMessage(
          err,
          "Failed to generate a shopping list from this recipe.",
        ),
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Sheet open={!!recipe} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-[560px] overflow-y-auto overflow-x-hidden p-6"
      >
        {formMode === "edit" ? (
          <RecipeForm
            selectedRecipe={recipe}
            onSubmit={onSubmit}
            onCancel={onCancel}
            error={error}
          />
        ) : (
          <div>
            {(error || sendError) && (
              <ErrorBanner
                message={error ?? sendError ?? ""}
                onDismiss={() => {
                  onDismissError?.();
                  setSendError(null);
                }}
              />
            )}

            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">
                {recipe.name}
              </SheetTitle>
              <SheetDescription>
                {recipe.description || "No description."}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Prep Time:</span>
                <span>{recipe.prepTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Cook Time:</span>
                <span>{recipe.cookTime} min</span>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium mb-2">Nutrition (per recipe)</p>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <span className="text-gray-600">Calories:</span>
                  <span>{recipe.calories} kcal</span>
                  <span className="text-gray-600">Protein:</span>
                  <span>{recipe.protein.toFixed(1)} g</span>
                  <span className="text-gray-600">Total Fat:</span>
                  <span>{recipe.totalFat.toFixed(1)} g</span>
                  <span className="text-gray-600">Carbohydrates:</span>
                  <span>{recipe.totalCarbohydrates.toFixed(1)} g</span>
                  <span className="text-gray-600">Sodium:</span>
                  <span>{recipe.sodium.toFixed(1)} mg</span>
                  <span className="text-gray-600">Yield:</span>
                  <span>{recipe.yield}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium mb-2">Ingredients</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i}>
                      {ing.ingredientsQuantity} {ing.ingredientsMeasurements}{" "}
                      {ing.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium mb-2">Instructions</p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  {recipe.instructions.map((ins, i) => (
                    <li key={i}>{ins.description}</li>
                  ))}
                </ol>
              </div>

              {recipe.notes.length > 0 && (
                <div className="border-t pt-4">
                  <p className="font-medium mb-2">Notes</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {recipe.notes.map((note, i) => (
                      <li key={i}>{note.description}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
                <button
                  onClick={handleSendToShoppingList}
                  disabled={isSending || isDeleting}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-60"
                >
                  {isSending ? "Generating..." : "Send to Shopping List"}
                </button>
                <button
                  onClick={onEdit}
                  disabled={isDeleting}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-60"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default RecipeDetail;
