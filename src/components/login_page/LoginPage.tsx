import { Col, Container, Row } from "react-bootstrap";
import LoginCard from "./LoginCard/LoginCard";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Navigate } from "react-router";

function LoginPage() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
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
