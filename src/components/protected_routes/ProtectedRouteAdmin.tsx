import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "../../redux/store";

function ProtectedRouteAdmin() {
  const role = useSelector((state: RootState) => state.auth.role);

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;

  return;
}

export default ProtectedRouteAdmin;
