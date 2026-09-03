import { Col, Container, Row } from "react-bootstrap";
import LemonImage from "../../LemonImage/LemonImage";
import ForgotPasswordCard from "./ForgotPasswordCard/ForgotPasswordCard";

function ForgotPasswordPage() {
  return (
    <Container className="position-relative">
      <LemonImage leftToRight={true} />
      <Row className="d-flex justify-content-center mt-5">
        <Col md={8} lg={6} xl={4} className="mt-5">
          <ForgotPasswordCard />
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPasswordPage;
