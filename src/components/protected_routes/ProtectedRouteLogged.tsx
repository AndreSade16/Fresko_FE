import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router";
import MainNavbar from "../home_page/MainNavbar/MainNavbar";

function ProtectedRouteLogged() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <MainNavbar />
      <Outlet />
    </>
  );
}

export default ProtectedRouteLogged;
