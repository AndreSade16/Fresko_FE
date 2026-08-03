import { Button, Container, Nav, Navbar } from "react-bootstrap";
import "./LandingNavbar.css";
import { useNavigate } from "react-router";

function LandingNavbar() {
  const navigate = useNavigate();

  return (
    <Navbar
      variant="dark"
      expand="lg"
      className="blur-navbar-dark"
      sticky="top"
    >
      <Container fluid className="px-4">
        <Navbar.Brand
          href="#home"
          className="fs-2 fw-bolder fst-italic text-light text-decoration-underline"
        >
          FresKo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <Navbar.Collapse id="basic-navbar-nav" className="pb-3 pb-lg-0">
          <Nav className="ms-auto align-items-center gap-3 mt-3 mt-lg-0">
            <Nav.Link href="#landing-hero" className="text-light text-nowrap">
              Home
            </Nav.Link>
            <Nav.Link
              href="#landing-mission"
              className="text-light text-nowrap"
            >
              How does it work
            </Nav.Link>
            <Button
              className="rounded-pill bg-secondary text-black fw-semibold text-nowrap px-4 border-0"
              onClick={() => navigate("/login")}
            >
              Get in
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LandingNavbar;
