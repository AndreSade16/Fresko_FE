import { Container } from "react-bootstrap";
import LandingNavbar from "./LandingNavbar/LandingNavbar";
import LandingHero from "./LandingHero/LandingHero";
import LandingMission from "./LandingMission/LandingMission";
import LandingVision from "./LandingVision/LandingVision";
import LandingFooter from "./LandingFooter/LandingFooter";
import { Navigate, Route, Routes, useLocation } from "react-router";
import LoginPage from "../login_page/LoginPage";
import RegisterPage from "../register_page/RegisterPage";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useEffect } from "react";
import ForgotPasswordPage from "../password_reset_pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "../password_reset_pages/ResetPasswordPage/ResetPasswordPage";

function LandingPage() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <Container fluid={true} className="p-0">
      <LandingNavbar />
      <Routes>
        <Route
          index
          element={
            <>
              <LandingHero />
              <LandingMission />
              <LandingVision />
              <LandingFooter />
            </>
          }
        ></Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Container>
  );
}

export default LandingPage;
