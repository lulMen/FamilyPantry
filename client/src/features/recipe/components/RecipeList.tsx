import { type Recipe } from "../../../types/recipe.type";
import RecipeItem from "./RecipeItem";

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

function RecipeList({ recipes, onSelectRecipe }: RecipeListProps) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-3">Recipes</h3>
      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes yet.</p>
      ) : (
        <table className="mb-4 w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Prep Time</th>
              <th className="px-4 py-2">Cook Time</th>
              <th className="px-4 py-2">Calories</th>
              <th className="px-4 py-2">Ingredients</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <RecipeItem
                key={recipe._id}
                recipe={recipe}
                onSelect={onSelectRecipe}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RecipeList;
