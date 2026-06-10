import PantryManager from "./features/pantry/components/PantryManager";
import RecipeManager from "./features/recipe/components/RecipeManager";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <PantryManager />
        <RecipeManager />
      </main>
    </div>
  );
}

export default App;
