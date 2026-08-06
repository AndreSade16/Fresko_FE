import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import LandingPage from "./components/landing_page/LandingPage";

import ProtectedRouteLogged from "./components/protected_routes/ProtectedRouteLogged";
import ProtectedRouteAdmin from "./components/protected_routes/ProtectedRouteAdmin";
import HomePage from "./components/home_page/HomePage";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 bg-dark">
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRouteLogged />}>
              <Route path="/home" element={<HomePage />}></Route>
              <Route path="/pantry"></Route>
              <Route path="/my-list"></Route>
              <Route path="/recipes"></Route>
              <Route path="/me"></Route>
              <Route element={<ProtectedRouteAdmin />}>
                <Route path="/create-recipe"></Route>
                <Route path="/create-ingredient-definition"></Route>
                <Route path="/users"></Route>
              </Route>
            </Route>
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
