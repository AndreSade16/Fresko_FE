import { Col, Container, Row } from "react-bootstrap";
import LoginCard from "./LoginCard/LoginCard";

function LoginPage() {
  return (
    <Container>
      <Row className="d-flex justify-content-center mt-5">
        <Col md={8} lg={6} xl={4} className="mt-5">
          <LoginCard />
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
