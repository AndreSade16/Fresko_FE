import { Container } from "react-bootstrap";
import LandingMission from "../landing_page/LandingMission/LandingMission";
import LandingVision from "../landing_page/LandingVision/LandingVision";
import LandingFooter from "../landing_page/LandingFooter/LandingFooter";

function InfoPage() {
  return (
    <Container fluid={true} className="p-0">
      <LandingMission />
      <LandingVision />
      <LandingFooter />
    </Container>
  );
}

export default InfoPage;
