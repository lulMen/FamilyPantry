import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import PantryPage from "./pages/pantry.page";
import RecipePage from "./pages/recipe.page";
import ShoppingListPage from "./pages/shopping-list.page";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/pantry" replace />} />
            <Route path="/pantry" element={<PantryPage />} />
            <Route path="/recipes" element={<RecipePage />} />
            <Route path="/shopping-lists" element={<ShoppingListPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
