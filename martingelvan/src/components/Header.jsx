import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import "../css/Header.css"; // import del CSS

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userRef = doc(db, "usuarios", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserRole(data.rol);
          }
        } catch (error) {
          console.error("Error al obtener el rol del usuario:", error);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!user) return null;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span>Gelvan</span>Proyectos
        </Link>

        <button
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/gelvancocina">Gelvan Cocina</Link>
          </li>
          <li>
            <Link to="/gifloox">Gifloox</Link>
          </li>

          {userRole === "admin" && (
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          )}

          <li>
            <button onClick={logout} className="logout-btn">
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};
