import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import "./App.css";
import LandingPage from "./components/landing_page/LandingPage";

import ProtectedRouteLogged from "./components/protected_routes/ProtectedRouteLogged";
import ProtectedRouteAdmin from "./components/protected_routes/ProtectedRouteAdmin";
import HomePage from "./components/home_page/HomePage";
import PantryPage from "./components/pantry_page/PantryPage";
import IngredientPage from "./components/ingredients_page/IngredientsPage";
import ShoppingListPage from "./components/shopping_list_page/ShoppingListPage";
import RecipesPage from "./components/recipes_page/RecipesPage";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 bg-dark">
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<LandingPage />} />

            <Route element={<ProtectedRouteLogged />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/pantry" element={<PantryPage />} />
              <Route path="/ingredients" element={<IngredientPage />} />
              <Route path="/my-list" element={<ShoppingListPage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/me" element={<div>Profile Page</div>} />

              <Route element={<ProtectedRouteAdmin />}>
                <Route
                  path="/create-recipe"
                  element={<div>Create Recipe</div>}
                />
                <Route
                  path="/create-ingredient-definition"
                  element={<div>Create Ingredient</div>}
                />
                <Route path="/users" element={<div>Users Page</div>} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
