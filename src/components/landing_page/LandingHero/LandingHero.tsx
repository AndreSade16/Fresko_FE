import { Button, Col, Container, Row } from "react-bootstrap";
import "./LandingHero.css";
import { useNavigate } from "react-router";
import BlurText from "../../../tools/Blurtext";

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
            <h1 className="display-2 fw-bolder">
              Save food,
              <br />
              keep it{" "}
              <BlurText
                text="Fresko"
                delay={200}
                animateBy="letters"
                direction="top"
                className="text-2xl mb-8 d-inline"
              />
            </h1>
            <p className="lead mb-4 text-light opacity-90">
              Fresko helps you keep track of the food you have at home, from
              your pantry to your fridge.
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
