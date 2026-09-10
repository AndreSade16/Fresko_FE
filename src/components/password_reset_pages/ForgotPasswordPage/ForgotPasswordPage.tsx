import { Button, Col, Container, Row } from "react-bootstrap";
import LemonImage from "../../LemonImage/LemonImage";
import ForgotPasswordCard from "./ForgotPasswordCard/ForgotPasswordCard";
import { useNavigate } from "react-router";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  return (
    <Container className="position-relative">
      <LemonImage leftToRight={true} />
      <Row className="d-flex justify-content-center mt-5">
        <Col
          md={8}
          lg={6}
          xl={4}
          className="mt-5 d-flex flex-column align-items-center gap-3"
        >
          <ForgotPasswordCard />
          <Button
            variant="secondary"
            className="border-black fw-semibold z-1"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPasswordPage;
