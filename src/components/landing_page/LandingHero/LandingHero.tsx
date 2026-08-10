import { Button, Col, Container, Row } from "react-bootstrap";
import "./LandingHero.css";
import { useNavigate } from "react-router";

function LandingHero() {
  const navigate = useNavigate();

  return (
    <Container fluid className="landing-hero p-0" id="landing-hero">
      <Container
        fluid
        className="h-100 d-flex align-items-center py-5 px-4 px-md-5"
      >
        <Row className="w-100">
          <Col
            lg={7}
            md={9}
            className="text-start text-white py-4 px-3 px-md-5"
          >
            <h1 className="display-2 fw-bolder">Payoff payoff payoff</h1>
            <p className="lead mb-4 text-light opacity-90">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
              fugit voluptate tempora voluptatibus, rem.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="px-4 py-2 fw-semibold shadow-sm"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default LandingHero;
