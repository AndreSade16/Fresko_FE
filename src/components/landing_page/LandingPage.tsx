import { Container } from "react-bootstrap";
import LandingNavbar from "./LandingNavbar/LandingNavbar";
import LandingHero from "./LandingHero/LandingHero";
import LandingMission from "./LandingMission/LandingMission";
import LandingVision from "./LandingVision/LandingVision";
import LandingFooter from "./LandingFooter/LandingFooter";
import { Route, Routes } from "react-router";
import LoginPage from "../login_page/LoginPage";

function LandingPage() {
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
      </Routes>
    </Container>
  );
}

export default LandingPage;
