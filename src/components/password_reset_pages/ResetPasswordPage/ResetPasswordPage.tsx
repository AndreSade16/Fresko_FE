import { Col, Container, Row } from "react-bootstrap";
import ResetPasswordCard from "./ResetPasswordCard/ResetPasswordCard";
import LemonImage from "../../LemonImage/LemonImage";

function ResetPasswordPage() {
  return (
    <Container className="position-relative">
      <LemonImage leftToRight={true} />
      <Row className="d-flex justify-content-center mt-5">
        <Col md={8} lg={6} xl={4} className="mt-5">
          <ResetPasswordCard />
        </Col>
      </Row>
    </Container>
  );
}

export default ResetPasswordPage;
