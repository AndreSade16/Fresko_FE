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
import ProfilePage from "./components/profile_page/ProfilePage";
import AdminPage from "./components/admin/admin_page/AdminPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "./redux/store";
import { logout } from "./redux/reducers/AuthSlice";
import UsersPage from "./components/admin/UsersPage/UsersPage";
import IngredientDetails from "./components/detail_pages/IngredientDetails";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logout());
    };

    window.addEventListener("unauthorized_logout", handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized_logout", handleUnauthorized);
    };
  }, [dispatch]);

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
              <Route path="/me" element={<ProfilePage />} />
              <Route
                path="/ingredients/:ingredientId"
                element={<IngredientDetails />}
              />

              <Route element={<ProtectedRouteAdmin />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/users" element={<UsersPage />} />
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
