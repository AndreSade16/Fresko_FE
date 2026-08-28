import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "../../../redux/store";

function LandingFooter() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <Container fluid className="px-4 px-md-5 ">
        <hr className="my-4 border-secondary opacity-25" />

        <Row className="gy-4">
          <Col lg={3} md={6}>
            <h5 className="fw-bold mb-3 text-secondary text-md-center">
              Partnership
            </h5>
            <ul className="list-unstyled mb-0 text-md-center">
              <li className="mb-2">BioFarm Global</li>
              <li className="mb-2">Green Logistics Co.</li>
              <li className="mb-2">FreshMarket Network</li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <a
              onClick={() => navigate(isAuthenticated ? "/my-list" : "/login")}
              className="h5 fw-bold text-secondary text-decoration-none d-block mb-3 text-md-center"
              style={{ cursor: "pointer" }}
            >
              Go shopping
            </a>
          </Col>

          <Col lg={3} md={6}>
            <a
              onClick={() => navigate(isAuthenticated ? "/recipes" : "/login")}
              className="h5 fw-bold text-secondary text-decoration-none d-block mb-3 text-md-center"
              style={{ cursor: "pointer" }}
            >
              Recipes
            </a>
          </Col>

          <Col lg={3} md={6}>
            <a className="h5 fw-bold text-secondary text-decoration-none d-block mb-3 text-md-center">
              Contacts
            </a>
            <ul className="list-unstyled mb-0 text-md-center">
              <li className="mb-2">
                <a
                  href="mailto:info@fresko.com"
                  className="text-light text-break text-decoration-none"
                >
                  info@fresko.com
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="mailto:andrea.saderi16@gmail.com"
                  className="text-light text-break text-decoration-none"
                >
                  andrea.saderi16@gmail.com
                </a>
              </li>
            </ul>
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
