import { Container } from "react-bootstrap";
import LandingNavbar from "./LandingNavbar/LandingNavbar";
import LandingHero from "./LandingHero/LandingHero";
import LandingMission from "./LandingMission/LandingMission";
import LandingVision from "./LandingVision/LandingVision";
import LandingFooter from "./LandingFooter/LandingFooter";
import { Navigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useEffect } from "react";

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
      <LandingHero />
      <LandingMission />
      <LandingVision />
      <LandingFooter />
    </Container>
  );
}

export default LandingPage;
