import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import MainNavbar from "../home_page/MainNavbar/MainNavbar";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <>
      <MainNavbar />
      <Container className="position-relative">
        <Row className="d-flex justify-content-center mt-5">
          <Col
            md={8}
            lg={6}
            className="mt-5 d-flex flex-column justify-content-center align-items-center gap-5 z-1"
          >
            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-sm-center gap-3">
              <Image
                src="/ni-open-box.svg"
                className="h-100"
                style={{
                  filter: "brightness(0) invert(1)",
                  minHeight: "100px",
                  maxHeight: "20px",
                }}
                alt=""
              />
              <h1 className="text-center m-0 align-center">
                Oops! This page doesn't exist.
              </h1>
            </div>
            <Button
              variant="secondary"
              className="fw-semibold border-black"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default NotFoundPage;
