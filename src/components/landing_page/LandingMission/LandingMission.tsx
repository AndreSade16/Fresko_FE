import { Col, Container, Image, Row } from "react-bootstrap";

function LandingMission() {
  return (
    <Container fluid={true} className="mt-5" id="landing-mission">
      <Row className="d-flex flex-column-reverse flex-md-row justify-content-around px-2 px-md-3 g-3">
        <Col md={6}>
          <Image
            src="/public/MissionImg.jpg"
            alt="Mission image"
            fluid
            className="rounded-4 w-100 object-fit-cover"
            style={{ maxHeight: "300px" }}
          />
        </Col>
        <Col
          md={6}
          className="d-flex flex-column text-light justify-content-center"
        >
          <h2 className="text-md-end fw-bold fst-italic">
            Waste less, eat it fresher
          </h2>
          <p className="text-md-end ps-md-4">
            Our mission is to make food waste easier to prevent in everyday
            life. Fresko helps you keep track of expiration dates, discover
            recipes based on what you already have, and make smarter choices
            about the food you buy and use.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default LandingMission;
