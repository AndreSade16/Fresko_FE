import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";

function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <Container fluid className="px-4 px-md-5">
        <hr className="my-4 border-secondary opacity-25" />

        <Row className="gy-4">
          <Col lg={3} md={6}>
            <h5 className="fw-bold mb-3 text-secondary text-md-center">
              Partnership
            </h5>
            <ul className="list-unstyled mb-0 opacity-75 text-md-center">
              <li className="mb-2">BioFarm Global</li>
              <li className="mb-2">Green Logistics Co.</li>
              <li className="mb-2">FreshMarket Network</li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <a
              onClick={() => navigate("/login")}
              className="h5 fw-bold text-secondary text-decoration-none d-block mb-3 text-md-center"
              style={{ cursor: "pointer" }}
            >
              Go shopping
            </a>
          </Col>

          <Col lg={3} md={6}>
            <a
              onClick={() => navigate("/login")}
              className="h5 fw-bold text-secondary text-decoration-none d-block mb-3 text-md-center"
              style={{ cursor: "pointer" }}
            >
              Recipes
            </a>
          </Col>

          <Col lg={3} md={6}>
            <a
              href="#contacts"
              className="h5 fw-bold text-secondary text-decoration-none d-block mb-3 text-md-center"
            >
              Contacts
            </a>
          </Col>
        </Row>

        <hr className="my-4 border-secondary opacity-25" />
        <Row>
          <Col className="text-center text-secondary small">
            © {new Date().getFullYear()} FresKo. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default LandingFooter;
