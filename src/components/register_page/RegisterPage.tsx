import { Col, Container, Row } from "react-bootstrap";
import RegisterCard from "./RegisterCard/RegisterCard";

function RegisterPage() {
  return (
    <Container>
      <Row className="d-flex justify-content-center mt-5">
        <RegisterCard />
        <Col md={8} lg={6} xl={4} className="mt-5"></Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
