import { type Recipe } from "../../../types/recipe.type";

interface RecipeItemProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

// Helper function to format date for display
const formatDate = (dateStr: unknown) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr as string | Date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function RecipeItem({ recipe, onSelect }: RecipeItemProps) {
  return (
    <tr
      onClick={() => onSelect(recipe)}
      className="border-b hover:bg-gray-50 cursor-pointer"
    >
      <td className="px-4 py-2">{recipe.name}</td>
      <td className="px-4 py-2 text-gray-500 truncate max-w-xs">
        {recipe.description || "—"}
      </td>
      <td className="px-4 py-2">{recipe.prepTime} min</td>
      <td className="px-4 py-2">{recipe.cookTime} min</td>
      <td className="px-4 py-2">{recipe.calories} kcal</td>
      <td className="px-4 py-2">{recipe.ingredients.length}</td>
      <td className="px-4 py-2">{formatDate(recipe.createdAt)}</td>
    </tr>
  );
}

export default RecipeItem;
