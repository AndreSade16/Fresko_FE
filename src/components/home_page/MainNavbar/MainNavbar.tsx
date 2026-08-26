import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { AppDispatch, RootState } from "../../../redux/store";
import { fetchUserProfile } from "../../../redux/reducers/UserSlice";
import { logout } from "../../../redux/reducers/AuthSlice";

function MainNavbar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
  const dispatch = useDispatch<AppDispatch>();

  const { username, firstName, avatar, role } = useSelector(
    (state: RootState) => state.user,
  );

  const handleNavigate = (path: string) => {
    setExpanded(false);
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(fetchUserProfile());

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const avatarSrc =
    avatar ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return (
    <>
      <style>{`
        .blur-navbar-dark .navbar-toggler-icon {
          display: none !important;
        }
        .text-stroke {
          text-shadow: 
            -1px -1px 0 #000,  
             1px -1px 0 #000,
            -1px  1px 0 #000,
             1px  1px 0 #000;
        }
      `}</style>
      <Navbar
        variant="dark"
        expand="lg"
        className="blur-navbar-dark"
        sticky="top"
        expanded={expanded}
        onToggle={(isExpanded) => setExpanded(isExpanded)}
      >
        <Container fluid className="px-4">
          <div className="d-flex align-items-center justify-content-between flex-nowrap w-100 w-lg-auto">
            <Navbar.Brand
              onClick={() => handleNavigate("/")}
              style={{ cursor: "pointer" }}
              className="d-flex align-items-center"
            >
              <img
                src="/Fresko-Title.png"
                alt="Fresko Logo"
                style={{ height: "40px", width: "auto", objectFit: "contain" }}
              />
            </Navbar.Brand>

            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="border border-2 border-light p-0 rounded-circle overflow-hidden shadow-sm flex-shrink-0"
              style={{ width: "42px", height: "42px" }}
            >
              <img
                src={avatarSrc}
                alt="User Avatar Menu"
                className="w-100 h-100 object-fit-cover"
              />
            </Navbar.Toggle>
          </div>

          <Navbar.Collapse id="basic-navbar-nav" className="pb-3 pb-lg-0">
            <Nav className="ms-auto align-items-center gap-3 mt-3 mt-lg-0">
              {role === "ADMIN" && (
                <Nav.Link
                  className="text-warning text-nowrap fw-bold text-stroke"
                  onClick={() => handleNavigate("/admin")}
                >
                  Admin
                </Nav.Link>
              )}
              <Nav.Link
                className="text-light text-nowrap text-stroke"
                onClick={() => handleNavigate("/home")}
              >
                Home
              </Nav.Link>
              <Nav.Link
                className="text-light text-nowrap text-stroke"
                onClick={() => handleNavigate("/ingredients")}
              >
                Ingredients
              </Nav.Link>
              <Nav.Link
                className="text-light text-nowrap text-stroke"
                onClick={() => handleNavigate("/recipes")}
              >
                Recipes
              </Nav.Link>
              <Nav.Link
                className="text-light text-nowrap text-stroke"
                onClick={() => handleNavigate("/pantry")}
              >
                Pantry
              </Nav.Link>
              <Nav.Link
                className="text-light text-nowrap text-stroke"
                onClick={() => handleNavigate("/my-list")}
              >
                Shopping List
              </Nav.Link>
              <Nav.Link
                className="text-light text-nowrap fw-semibold text-stroke"
                onClick={() => handleLogout()}
              >
                Logout
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
                    src={avatarSrc}
                    alt="User Avatar"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
              ) : (
                <p
                  onClick={() => handleNavigate("/me")}
                  role="button"
                  tabIndex={0}
                  className="text-light mb-0 fw-semibold text-nowrap text-stroke"
                  style={{ cursor: "pointer" }}
                >
                  {firstName || username || "Guest"}'s profile
                </p>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default MainNavbar;
