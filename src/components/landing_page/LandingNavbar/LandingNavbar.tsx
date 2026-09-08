import { useEffect, useRef, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import "./LandingNavbar.css";
import { useNavigate } from "react-router";

function LandingNavbar() {
  const navigate = useNavigate();
  const navbarRef = useRef<HTMLDivElement | null>(null);

  const [expanded, setExpanded] = useState(false);

  const handleNavigate = (path: string) => {
    setExpanded(false);
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={navbarRef}
      style={{ position: "sticky", top: "0" }}
      className="z-3"
    >
      <Navbar
        variant="dark"
        expand="lg"
        className="blur-navbar-dark position-relative"
        sticky="top"
        expanded={expanded}
        onToggle={(isExpanded) => setExpanded(isExpanded)}
      >
        <Container fluid className="px-4">
          <div className="d-flex align-items-center flex-nowrap w-100 w-lg-auto">
            <Navbar.Brand
              className="d-flex align-items-center flex-shrink-1 overflow-hidden me-auto me-lg-0"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setExpanded(false);
                navigate("/");
              }}
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
              aria-label="Toggle navbar menu"
            />
          </div>
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="navbar-collapse-overlay pb-3 pb-lg-0"
          >
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
                style={{ cursor: "pointer" }}
                className="text-light text-nowrap"
                onClick={() => {
                  setExpanded(false);
                  navigate("/#landing-mission");
                }}
              >
                Our Values
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
    </div>
  );
}

export default LandingNavbar;
