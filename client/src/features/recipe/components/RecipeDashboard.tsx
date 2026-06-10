interface RecipeDashboardProps {
  recipeCount: number;
  onAddClick: () => void;
}

function RecipeDashboard({ recipeCount, onAddClick }: RecipeDashboardProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Recipe Catalog</h2>
      <span className="text-gray-600 mr-4">Total Recipes: {recipeCount}</span>
      <button
        onClick={onAddClick}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add Recipe
      </button>
    </div>
  );
}

export default RecipeDashboard;
