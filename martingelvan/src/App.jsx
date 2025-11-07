import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import { AdminPanel } from "./components/AdminPanel";
import { useAuth } from "./context/AuthContext";
import { Footer } from "./components/Footer";
import { GelvanCocina } from "./components/GelvanCocina";
import { Gifloox } from "./components/Gifloox";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>; // opcional: spinner

  return (
    <Router>
      {/* 🔒 Muestra el header solo si hay usuario logueado */}
      {user && <Header />}

      <Routes>
        {/* Si NO hay usuario, solo puede ver login/register */}
        {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* redirige cualquier otra ruta al login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {/* Si hay usuario logueado */}
            <Route path="/" element={<Home />} />
            <Route path="/gelvancocina" element={<GelvanCocina />} />
            <Route path="/gifloox" element={<Gifloox></Gifloox>} />
            {user.rol === "admin" && (
              <Route path="/admin" element={<AdminPanel />} />
            )}
          </>
        )}
      </Routes>
      {user && <Footer></Footer>}
    </Router>
  );
};

export default App;
