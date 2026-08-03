import { Col, Container, Image, Row } from "react-bootstrap";

function LandingVision() {
  return (
    <Container fluid={true} className="mt-5">
      <Row className="d-flex flex-column-reverse flex-md-row-reverse justify-content-around px-2 px-md-3 g-3">
        <Col md={6}>
          <Image
            src="https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/539993.jpg"
            alt="Vision image"
            fluid
            className="rounded-4 w-100 object-fit-cover"
            style={{ maxHeight: "300px" }}
          />
        </Col>
        <Col
          md={6}
          className="d-flex flex-column text-light justify-content-center"
        >
          <h2 className="fw-bold fst-italic">Vision Vision Vision</h2>
          <p className="pe-md-4">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet,
            totam distinctio, quae illo deleniti quaerat delectus
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default LandingVision;
