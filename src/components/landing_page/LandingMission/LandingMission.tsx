import { Col, Container, Image, Row } from "react-bootstrap";

function LandingMission() {
  return (
    <Container fluid={true} className="mt-5" id="landing-mission">
      <Row className="d-flex flex-column-reverse flex-md-row justify-content-around px-2 px-md-3 g-3">
        <Col md={6}>
          <Image
            src="https://cdn.loveandlemons.com/wp-content/uploads/2026/07/crispy-rice-salad-recipe.jpg"
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
            Mission mission mission
          </h2>
          <p className="text-md-end ps-md-4">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet,
            totam distinctio, quae illo deleniti quaerat delectus
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default LandingMission;
