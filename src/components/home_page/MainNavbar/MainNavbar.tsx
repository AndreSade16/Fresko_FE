import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { AppDispatch, RootState } from "../../../redux/store";
import { fetchUserProfile } from "../../../redux/reducers/UserSlice";

function MainNavbar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
  //   const role = useSelector((state: RootState) => state.auth.role);
  const dispatch = useDispatch<AppDispatch>();

  const { username, firstName, avatar } = useSelector(
    (state: RootState) => state.user,
  );

  const handleNavigate = (path: string) => {
    setExpanded(false);
    navigate(path);
  };

  useEffect(() => {
    dispatch(fetchUserProfile());

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

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
        <Navbar.Brand
          className="fs-2 fw-bolder fst-italic text-light text-decoration-underline"
          onClick={() => handleNavigate("/")}
          style={{ cursor: "pointer" }}
        >
          FresKo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <Navbar.Collapse id="basic-navbar-nav" className="pb-3 pb-lg-0">
          <Nav className="ms-auto align-items-center gap-3 mt-3 mt-lg-0">
            <Nav.Link
              className="text-light text-nowrap"
              onClick={() => handleNavigate("/home")}
            >
              Home
            </Nav.Link>
            <Nav.Link
              className="text-light text-nowrap"
              onClick={() => handleNavigate("/recipes")}
            >
              Recipes
            </Nav.Link>
            <Nav.Link
              className="text-light text-nowrap"
              onClick={() => handleNavigate("/pantry")}
            >
              Pantry
            </Nav.Link>
            <Nav.Link
              className="text-light text-nowrap"
              onClick={() => handleNavigate("/my-list")}
            >
              Shopping List
            </Nav.Link>

            {isDesktop ? (
              <div
                onClick={() => handleNavigate("/me")}
                role="button"
                tabIndex={0}
                className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center border border-2 border-light shadow-sm"
                style={{
                  width: "42px",
                  height: "42px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <img
                  src={
                    avatar ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt="User Avatar"
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            ) : (
              <p
                onClick={() => handleNavigate("/me")}
                role="button"
                tabIndex={0}
                className="text-light mb-0 fw-semibold text-nowrap"
                style={{ cursor: "pointer" }}
              >
                {firstName || username || "Guest"}
              </p>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;
