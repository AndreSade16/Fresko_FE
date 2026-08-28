import { useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import "./LandingNavbar.css";
import { useNavigate } from "react-router";

function LandingNavbar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleNavigate = (path: string) => {
    setExpanded(false);
    navigate(path);
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      className="blur-navbar-dark"
      sticky="top"
      expanded={expanded}
      onToggle={(isExpanded) => setExpanded(isExpanded)}
    >
      <Container fluid className="px-4">
        <div className="d-flex align-items-center flex-nowrap w-100 w-lg-auto">
          <Navbar.Brand
            href="#home"
            className="d-flex align-items-center flex-shrink-1 overflow-hidden me-auto me-lg-0"
            onClick={() => setExpanded(false)}
          >
            <img
              src="/Fresko-Title.png"
              alt="Fresko Logo"
              style={{
                height: "40px",
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="border-0 flex-shrink-0"
          />
        </div>
        <Navbar.Collapse id="basic-navbar-nav" className="pb-3 pb-lg-0">
          <Nav className="ms-auto align-items-center gap-3 mt-3 mt-lg-0">
            <Nav.Link
              className="text-light text-nowrap"
              onClick={() => {
                setExpanded(false);
                navigate("/");
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              href="#landing-mission"
              className="text-light text-nowrap"
              onClick={() => setExpanded(false)}
            >
              How does it work
            </Nav.Link>
            <Button
              className="rounded-pill bg-secondary text-black fw-semibold text-nowrap px-4 border-0"
              onClick={() => handleNavigate("/login")}
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
