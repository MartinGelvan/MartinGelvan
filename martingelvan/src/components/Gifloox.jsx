import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import emailjs from "@emailjs/browser";
import "../css/Gifloox.css";

export const Gifloox = () => {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    productoId: "",
    estilo: "",
    estampa: "",
    talle: "",
    color: "",
    mensaje: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "productos"));
        const data = snapshot.docs
          .map((doc) => ({ productoId: doc.id, ...doc.data() }))
          .filter((p) => p.disponible !== false); // solo disponibles
        setProductos(data);
      } catch (error) {
        console.error("Error al traer los productos:", error);
      }
    };
    fetchProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductoChange = (e) => {
    const productoId = e.target.value;
    setFormData({
      ...formData,
      productoId,
      estilo: "",
      estampa: "",
      talle: "",
      color: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailjs.send(
        "service_cnpd73f",
        "template_e7ylhqj",
        formData,
        "j4X89sa_z5zLURDP0"
      );
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        productoId: "",
        estilo: "",
        estampa: "",
        talle: "",
        color: "",
        mensaje: "",
      });
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      alert("Error al enviar el pedido");
    } finally {
      setLoading(false);
    }
  };

  const productoSeleccionado = productos.find(
    (p) => p.productoId === formData.productoId
  );

  return (
    <main className="gifloox-container">
      {/* HERO */}
      <section className="hero-gifloox">
        <div className="heroGifloox-overlay">
          <h1>Gifloox</h1>
          <p>Productos listos para regalar</p>
        </div>
      </section>
      <h1>Gifloox - Productos Personalizados</h1>
      <p className="subtitulo">Elegí tu producto y personalizalo a tu gusto</p>

      {/* GRID DE PRODUCTOS */}
      <section className="productos-grid">
        {productos.map((p) => (
          <div className="producto-card" key={p.productoId}>
            <img
              src={p.imagen || "https://via.placeholder.com/300"}
              alt={p.nombre}
            />
            <div className="producto-info">
              <h3>{p.nombre}</h3>
              <p className="precio">${p.precio}</p>
              <p>{p.descripcion}</p>
              {p.talle && (
                <p>
                  <strong>Talle:</strong>{" "}
                  {Array.isArray(p.talle) ? p.talle.join(", ") : p.talle}
                </p>
              )}

              {p.tipo && (
                <p>
                  <strong>Tipo:</strong> {p.tipo}
                </p>
              )}
              {p.estilo && Array.isArray(p.estilo) && (
                <p>
                  <strong>Estilos:</strong> {p.estilo.join(", ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* FORMULARIO DE PEDIDO */}
      <section className="pedido-form">
        <h2>Hacé tu pedido</h2>
        {success && <p className="success-msg">✅ Pedido enviado con éxito!</p>}
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
            name="productoId"
            value={formData.productoId}
            onChange={handleProductoChange}
            required
          >
            <option value="">Seleccioná un producto</option>
            {productos.map((p) => (
              <option key={p.productoId} value={p.productoId}>
                {p.nombre}
              </option>
            ))}
          </select>

          {/* Estilos según producto */}
          {productoSeleccionado &&
            productoSeleccionado.estilo &&
            Array.isArray(productoSeleccionado.estilo) &&
            productoSeleccionado.estilo.length > 0 && (
              <select
                name="estilo"
                value={formData.estilo}
                onChange={handleChange}
                required
              >
                <option value="">Elegí un estilo</option>
                {productoSeleccionado.estilo.map((e, i) => (
                  <option key={i} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            )}

          {/* Remera personalizada */}
          {productoSeleccionado &&
            productoSeleccionado.tipo === "Remera Estampada" && (
              <>
                <input
                  type="text"
                  name="estampa"
                  placeholder="Qué querés en la estampa?"
                  value={formData.estampa}
                  onChange={handleChange}
                  required
                />

                {/* Talle */}
                {productoSeleccionado.talle &&
                  Array.isArray(productoSeleccionado.talle) &&
                  productoSeleccionado.talle.length > 0 && (
                    <select
                      name="talle"
                      value={formData.talle}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Elegí un Talle</option>
                      {productoSeleccionado.talle.map((e, i) => (
                        <option key={i} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  )}

                {/* Sexo */}
                {productoSeleccionado.sexo &&
                  (Array.isArray(productoSeleccionado.sexo)
                    ? productoSeleccionado.sexo.length > 0
                    : typeof productoSeleccionado.sexo === "string") && (
                    <select
                      name="sexo"
                      value={formData.sexo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Elegí un Sexo</option>
                      {(Array.isArray(productoSeleccionado.sexo)
                        ? productoSeleccionado.sexo
                        : productoSeleccionado.sexo
                            .split(",")
                            .map((s) => s.trim())
                      ).map((e, i) => (
                        <option key={i} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  )}

                <input
                  type="text"
                  name="color"
                  placeholder="Color de la remera"
                  value={formData.color}
                  onChange={handleChange}
                  required
                />
              </>
            )}

          <textarea
            name="mensaje"
            placeholder="Mensaje adicional (opcional)"
            value={formData.mensaje}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar pedido"}
          </button>
        </form>
      </section>
    </main>
  );
};
