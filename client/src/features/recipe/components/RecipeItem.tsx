import { type Recipe } from "../../../types/recipe.type";

interface RecipeItemProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

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
    </tr>
  );
}

export default RecipeItem;
