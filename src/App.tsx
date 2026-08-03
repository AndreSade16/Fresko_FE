import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import LandingPage from "./components/landing_page/LandingPage";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 bg-dark">
        <BrowserRouter>
          {isAuthenticated ? (
            <Routes></Routes>
          ) : (
            <Routes>
              <Route path="*" element={<LandingPage />} />
            </Routes>
          )}
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
