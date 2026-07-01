import { type Recipe } from "../../../types/recipe.type";
import RecipeItem from "./RecipeItem";
import EmptyState from "../../../components/EmptyState";

type SortKey = "name" | "createdAt";
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface RecipeListProps {
  recipes: Recipe[];
  sortConfig: SortConfig;
  onSortChange: (key: SortKey) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

function SortHeader({
  label,
  sortKey,
  sortConfig,
  onSortChange,
}: {
  label: string;
  sortKey: SortKey;
  sortConfig: SortConfig;
  onSortChange: (key: SortKey) => void;
}) {
  const isActive = sortConfig.key === sortKey;
  const arrow = isActive
    ? sortConfig.direction === "asc"
      ? " ↑"
      : " ↓"
    : " ↕";
  return (
    <th
      className="px-4 py-2 cursor-pointer select-none hover:text-green-600 whitespace-nowrap"
      onClick={() => onSortChange(sortKey)}
    >
      {label}
      <span className="text-xs text-gray-400">{arrow}</span>
    </th>
  );
}

function RecipeList({
  recipes,
  sortConfig,
  onSortChange,
  onSelectRecipe,
}: RecipeListProps) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-3">Recipes</h3>
      {recipes.length === 0 ? (
        <EmptyState message="No recipes found." />
      ) : (
        <table className="mb-4 w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <SortHeader
                label="Name"
                sortKey="name"
                sortConfig={sortConfig}
                onSortChange={onSortChange}
              />
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Prep Time</th>
              <th className="px-4 py-2">Cook Time</th>
              <th className="px-4 py-2">Calories</th>
              <th className="px-4 py-2">Ingredients</th>
              <SortHeader
                label="Created"
                sortKey="createdAt"
                sortConfig={sortConfig}
                onSortChange={onSortChange}
              />
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
