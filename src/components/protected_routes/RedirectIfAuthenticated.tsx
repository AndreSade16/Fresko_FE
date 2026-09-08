import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router";
import LandingNavbar from "../landing_page/LandingNavbar/LandingNavbar";

function RedirectIfAuthenticated() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      <LandingNavbar />
      <Outlet />
    </>
  );
}

export default RedirectIfAuthenticated;
