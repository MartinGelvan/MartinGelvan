import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import emailjs from "@emailjs/browser";
import "../css/GelvanCocina.css";

export const GelvanCocina = () => {
  const [menu, setMenu] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    plato: "",
    cantidad: 1,
    mensaje: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🔹 Traer platos desde Firestore (solo los disponibles)
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuCol = collection(db, "recetas");
        const menuSnap = await getDocs(menuCol);
        const menuData = menuSnap.docs
          .map((doc) => ({ recetaId: doc.id, ...doc.data() }))
          .filter((plato) => plato.disponible !== false); // 👈 solo disponibles
        setMenu(menuData);
      } catch (error) {
        console.error("Error al traer el menú:", error);
      }
    };

    fetchMenu();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        "service_cnpd73f",
        "template_dm3s1sw",
        formData,
        "j4X89sa_z5zLURDP0"
      );
      setSuccess(true);
      setFormData({ name: "", email: "", plato: "", cantidad: 1, mensaje: "" });
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      alert("Error al enviar el pedido, intentalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="gelvan-cocina">
      {/* HERO */}
      <section className="hero-cocina">
        <div className="heroCocina-overlay">
          <h1>GELVAN COCINA</h1>
          <p>Platos caseros hechos con pasión</p>
        </div>
      </section>

      {/* MENÚ */}
      <section className="menu-section">
        <h2>Menú del Día</h2>
        <div className="menu-grid">
          {menu.map((item) => (
            <div className="menu-card" key={item.recetaId}>
              <img
                src={item.imagen || "https://via.placeholder.com/300x200"}
                alt={item.nombre}
              />
              <div className="menu-info">
                <h3>{item.nombre}</h3>
                <p className="descripcion">{item.descripcion}</p>
                <span className="precio">${item.precio}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="pedido">
        <h2>Hacé tu Pedido</h2>
        {success && (
          <p className="success-msg">
            ✅ ¡Pedido enviado con éxito! Te contactaremos pronto.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Tu email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <select
            name="plato"
            value={formData.plato}
            onChange={handleChange}
            required
          >
            <option value="">Seleccioná un plato</option>
            {menu.map((item) => (
              <option
                key={item.recetaId}
                value={item.nombre}
                style={{ color: "black" }}
              >
                {item.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="cantidad"
            min="1"
            value={formData.cantidad}
            onChange={handleChange}
            placeholder="Cantidad"
            required
          />
          <textarea
            name="mensaje"
            placeholder="Mensaje adicional (opcional)"
            value={formData.mensaje}
            onChange={handleChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Pedido"}
          </button>
        </form>
      </section>
    </main>
  );
};
