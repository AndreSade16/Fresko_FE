import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
  sub?: string;
  role?: string;
}

export const getRoleFromToken = (token: string): string | null => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    return decoded.role || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
