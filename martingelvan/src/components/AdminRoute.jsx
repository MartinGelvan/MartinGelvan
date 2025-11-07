import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>; // espera a que se cargue user
  if (!user) return <Navigate to="/login" />; // no logueado
  if (user.rol !== "admin") return <p>No tienes acceso</p>; // no admin

  return children;
};
