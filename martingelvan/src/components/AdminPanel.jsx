import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "../css/AdminPanel.css";
import { uploadToImgbb } from "../services/uploadImage";

export const AdminPanel = () => {
  const { user, loading } = useAuth();

  // Estados generales
  const [usuarios, setUsuarios] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [talle, setTalle] = useState([]);
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [nuevoTalle, setNuevoTalle] = useState("");

  // Formularios
  const [formDataMenu, setFormDataMenu] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    disponible: true,
  });

  const [formDataProductos, setFormDataProductos] = useState({
    nombre: "",
    descripcion: "",
    titulo: "",
    estilo: [],
    precio: "",
    tipo: "",
    imagen: "",
    disponible: true,
    sexo: "",
    talle: [],
    color: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [mostrarEstilos, setMostrarEstilos] = useState(false);
  const [mostrarTalles, setMostrarTalles] = useState(false);

  // ====== Cargar datos desde Firebase ======
  useEffect(() => {
    if (!user || user.rol !== "admin") return;

    const fetchUsuarios = async () => {
      try {
        const snapshot = await getDocs(collection(db, "usuarios"));
        setUsuarios(
          snapshot.docs.map((doc) => ({ userId: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error al traer usuarios:", error);
        alert("No tienes permisos para ver los usuarios");
      }
    };

    const fetchPlatos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "recetas"));
        setPlatos(
          snapshot.docs.map((doc) => ({ recetaId: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error al traer platos:", error);
      }
    };
    const fetchTipos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "tipos"));
        setTipos(snapshot.docs.map((doc) => doc.data().nombre));
      } catch (error) {
        console.error("Error al traer tipos:", error);
      }
    };

    const fetchProductos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "productos"));
        setProductos(
          snapshot.docs.map((doc) => ({ productoId: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error al traer productos:", error);
      }
    };

    fetchUsuarios();
    fetchPlatos();
    fetchProductos();
    fetchTipos();
  }, [user]);

  // ====== Usuarios ======
  const hacerAdmin = async (userId) => {
    try {
      const userRef = doc(db, "usuarios", userId);
      await updateDoc(userRef, { rol: "admin" });
      setUsuarios((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, rol: "admin" } : u))
      );
      alert("Usuario ahora es admin");
    } catch (error) {
      console.error("Error al hacer admin:", error);
    }
  };

  // ====== Tipos ======
  const agregarTipo = async () => {
    if (!nuevoTipo.trim()) return;
    try {
      await addDoc(collection(db, "tipos"), { nombre: nuevoTipo.trim() });
      setTipos((prev) => [...prev, nuevoTipo.trim()]);
      setNuevoTipo("");
    } catch (error) {
      console.error("Error al agregar tipo:", error);
    }
  };

  const eliminarTipo = async (tipo) => {
    if (!window.confirm(`¿Eliminar el tipo "${tipo}"?`)) return;
    try {
      const snapshot = await getDocs(collection(db, "tipos"));
      const docToDelete = snapshot.docs.find((d) => d.data().nombre === tipo);
      if (docToDelete) {
        await deleteDoc(doc(db, "tipos", docToDelete.id));
        setTipos((prev) => prev.filter((t) => t !== tipo));
      }
    } catch (error) {
      console.error("Error al eliminar tipo:", error);
    }
  };

  // ====== Talle ======
  const agregarTalle = () => {
    if (!nuevoTalle.trim()) return;
    setTalle((prev) => [...prev, nuevoTalle.trim()]);
    setNuevoTalle("");
  };

  const eliminarTalle = (talle) => {
    if (!window.confirm(`¿Eliminar el talle "${talle}"?`)) return;
    setTalle((prev) => prev.filter((t) => t !== talle));
  };

  // ====== Platos ======
  const handleChangePlatos = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDataMenu({
      ...formDataMenu,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmitPlatos = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const ref = doc(db, "recetas", editingId);
        await updateDoc(ref, {
          ...formDataMenu,
          precio: Number(formDataMenu.precio),
        });
        setPlatos((prev) =>
          prev.map((p) =>
            p.recetaId === editingId
              ? { ...p, ...formDataMenu, precio: Number(formDataMenu.precio) }
              : p
          )
        );
        setEditingId(null);
        alert("Plato actualizado");
      } else {
        const docRef = await addDoc(collection(db, "recetas"), {
          ...formDataMenu,
          precio: Number(formDataMenu.precio),
        });
        setPlatos((prev) => [
          ...prev,
          { recetaId: docRef.id, ...formDataMenu },
        ]);
        alert("Plato agregado");
      }
      setFormDataMenu({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: "",
        disponible: true,
      });
    } catch (error) {
      console.error(error);
      alert("Error al guardar plato");
    }
  };

  const eliminarPlato = async (id) => {
    if (!window.confirm("¿Eliminar este plato?")) return;
    try {
      await deleteDoc(doc(db, "recetas", id));
      setPlatos((prev) => prev.filter((p) => p.recetaId !== id));
      alert("Plato eliminado");
    } catch (error) {
      console.error(error);
    }
  };

  // ====== Productos ======
  const handleChangeProductos = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDataProductos((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Maneja la subida de imagen a ImgBB
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadToImgbb(file);
      setFormDataProductos((prev) => ({
        ...prev,
        imagen: imageUrl,
      }));
      console.log("✅ Imagen subida con éxito:", imageUrl);
    } catch (error) {
      console.error("❌ Error subiendo la imagen:", error);
    }
  };
  const handleSubmitProductos = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const ref = doc(db, "productos", editingId);
        await updateDoc(ref, {
          ...formDataProductos,
          precio: Number(formDataProductos.precio),
        });
        setProductos((prev) =>
          prev.map((p) =>
            p.productoId === editingId
              ? {
                  ...p,
                  ...formDataProductos,
                  precio: Number(formDataProductos.precio),
                }
              : p
          )
        );
        setEditingId(null);
        alert("Producto actualizado");
      } else {
        const docRef = await addDoc(collection(db, "productos"), {
          ...formDataProductos,
          precio: Number(formDataProductos.precio),
        });
        setProductos((prev) => [
          ...prev,
          { productoId: docRef.id, ...formDataProductos },
        ]);
        alert("Producto agregado");
      }

      setFormDataProductos({
        nombre: "",
        descripcion: "",
        titulo: "",
        estilo: [],
        precio: "",
        tipo: "",
        imagen: "",
        disponible: true,
        sexo: "",
        talle: [],
        color: "",
      });
      setMostrarEstilos(false);
      setMostrarTalles(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar producto");
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await deleteDoc(doc(db, "productos", id));
      setProductos((prev) => prev.filter((p) => p.productoId !== id));
      alert("Producto eliminado");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!user || user.rol !== "admin") return <p>No tienes acceso</p>;

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>

      {/* ===== Usuarios ===== */}
      <section className="admin-section">
        <h2>Usuarios</h2>
        <div className="usuarios-list">
          {usuarios.map((u) => (
            <div key={u.userId} className="usuario-item">
              <span>
                {u.nombre} {u.apellido} - {u.rol}
              </span>
              {u.rol !== "admin" && (
                <button className="btn" onClick={() => hacerAdmin(u.userId)}>
                  Hacer Admin
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== Tipos ===== */}
      <section className="admin-section">
        <h2>Tipos de Productos</h2>
        <div className="tipos-list">
          {tipos.map((t, i) => (
            <div key={i} className="tipo-item">
              <span>{t}</span>
              <button onClick={() => eliminarTipo(t)}>Eliminar</button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Nuevo tipo"
          value={nuevoTipo}
          onChange={(e) => setNuevoTipo(e.target.value)}
        />
        <button onClick={agregarTipo}>Agregar Tipo</button>
      </section>
      {/* ===== Tipos de Talles ===== 
      <section className="admin-section">
        <h2>Talles</h2>
        <div className="tipos-list">
          {talle.map((t, i) => (
            <div key={i} className="tipo-item">
              <span>{t}</span>
              <button onClick={() => eliminarTalle(t)}>Eliminar</button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Nuevo talle"
          value={nuevoTalle}
          onChange={(e) => setNuevoTalle(e.target.value)}
        />
        <button onClick={agregarTalle}>Agregar Talle</button>
      </section>
      */}

      {/* ===== Platos ===== */}
      <section className="admin-section">
        <h2>Gestión de Platos</h2>
        <form className="form-panel" onSubmit={handleSubmitPlatos}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formDataMenu.nombre}
            onChange={handleChangePlatos}
            required
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={formDataMenu.descripcion}
            onChange={handleChangePlatos}
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formDataMenu.precio}
            onChange={handleChangePlatos}
            required
          />
          <input
            type="text"
            name="imagen"
            placeholder="URL de imagen"
            value={formDataMenu.imagen}
            onChange={handleChangePlatos}
          />
          <label>
            <input
              type="checkbox"
              name="disponible"
              checked={formDataMenu.disponible}
              onChange={handleChangePlatos}
            />
            Disponible
          </label>
          <div className="form-buttons">
            <button type="submit">
              {editingId ? "Actualizar" : "Agregar"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormDataMenu({
                    nombre: "",
                    descripcion: "",
                    precio: "",
                    imagen: "",
                    disponible: true,
                  });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="cards-grid">
          {platos.map((p) => (
            <div className="card" key={p.recetaId}>
              <img src={p.imagen} alt={p.nombre} />
              <h3>{p.nombre}</h3>
              <p>${p.precio}</p>
              <p>{p.descripcion}</p>
              <p>
                Estado:{" "}
                <strong style={{ color: p.disponible ? "green" : "red" }}>
                  {p.disponible ? "Disponible" : "No disponible"}
                </strong>
              </p>
              <div className="card-buttons">
                <button
                  onClick={() => {
                    setEditingId(p.recetaId);
                    setFormDataMenu(p);
                  }}
                >
                  Editar
                </button>
                <button onClick={() => eliminarPlato(p.recetaId)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Productos ===== */}
      <section className="admin-section">
        <h2>Gestión de Productos</h2>

        <form className="form-panel" onSubmit={handleSubmitProductos}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formDataProductos.nombre}
            onChange={handleChangeProductos}
            required
          />
          <input
            type="text"
            name="titulo"
            placeholder="Título (opcional)"
            value={formDataProductos.titulo}
            onChange={handleChangeProductos}
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={formDataProductos.descripcion}
            onChange={handleChangeProductos}
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formDataProductos.precio}
            onChange={handleChangeProductos}
            required
          />

          {/* Selección de tipo */}
          <select
            name="tipo"
            value={formDataProductos.tipo}
            onChange={handleChangeProductos}
            required
          >
            <option value="">Seleccionar tipo</option>
            {tipos.map((t, i) => (
              <option key={`${t}-${i}`} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Botón para estilos */}
          <button
            type="button"
            onClick={() => setMostrarEstilos((prev) => !prev)}
          >
            {mostrarEstilos ? "Ocultar Estilos" : "Agregar Estilos"}
          </button>
          {mostrarEstilos && (
            <input
              type="text"
              name="estilo"
              placeholder='Escribir estilos separados por coma (Ej: "Disney, Cartoon")'
              value={formDataProductos.estilo.join(", ")}
              onChange={(e) =>
                setFormDataProductos((prev) => ({
                  ...prev,
                  estilo: e.target.value.split(",").map((s) => s.trim()),
                }))
              }
            />
          )}

          {/* Campos para Remera Estampada */}
          {formDataProductos.tipo === "Remera Estampada" && (
            <>
              <select
                name="sexo"
                value={formDataProductos.sexo}
                onChange={handleChangeProductos}
                required
              >
                <option value="">Seleccionar sexo</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Unisex">Unisex</option>
              </select>

              <button
                type="button"
                onClick={() => setMostrarTalles((prev) => !prev)}
              >
                {mostrarTalles ? "Ocultar Talles" : "Agregar Talles"}
              </button>
              {mostrarTalles && (
                <input
                  type="text"
                  name="talle"
                  placeholder='Escribir talles separados por coma (Ej: "S, M")'
                  value={formDataProductos.talle.join(", ")}
                  onChange={(e) =>
                    setFormDataProductos((prev) => ({
                      ...prev,
                      talle: e.target.value.split(",").map((s) => s.trim()),
                    }))
                  }
                />
              )}
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={formDataProductos.color}
                onChange={handleChangeProductos}
                required
              />
            </>
          )}

          {/* Input para seleccionar la imagen */}
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {/* Vista previa */}
          {formDataProductos.imagen && (
            <img
              src={formDataProductos.imagen}
              alt="Vista previa"
              width="200"
              style={{ marginTop: "10px", borderRadius: "10px" }}
            />
          )}

          <label>
            <input
              type="checkbox"
              name="disponible"
              checked={formDataProductos.disponible}
              onChange={handleChangeProductos}
            />
            Disponible
          </label>

          <div className="form-buttons">
            <button type="submit">
              {editingId ? "Actualizar" : "Agregar"}
            </button>
            {editingId && (
              <button type="button" onClick={() => setEditingId(null)}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Lista de productos */}
        <div className="cards-grid">
          {productos.map((p) => (
            <div className="card" key={p.productoId}>
              <img src={p.imagen} alt={p.nombre} />
              <h3>{p.nombre}</h3>
              <p>${p.precio}</p>
              <p>{p.descripcion}</p>
              {p.tipo && (
                <p>
                  <strong>Tipo:</strong> {p.tipo}
                </p>
              )}
              {Array.isArray(p.estilo) && p.estilo.length > 0 && (
                <p>
                  <strong>Estilos:</strong> {p.estilo.join(", ")}
                </p>
              )}
              {p.tipo === "Remera Estampada" && (
                <p>
                  <strong>Sexo:</strong>{" "}
                  {Array.isArray(p.sexo) ? p.sexo.join(", ") : p.sexo} |{" "}
                  <strong>Talle:</strong>{" "}
                  {Array.isArray(p.talle) ? p.talle.join(", ") : p.talle} |{" "}
                  <strong>Color:</strong>{" "}
                  {Array.isArray(p.color) ? p.color.join(", ") : p.color}
                </p>
              )}

              <p>
                Estado:{" "}
                <strong style={{ color: p.disponible ? "green" : "red" }}>
                  {p.disponible ? "Disponible" : "No disponible"}
                </strong>
              </p>
              <div className="card-buttons">
                <button
                  onClick={() => {
                    setEditingId(p.productoId);
                    setFormDataProductos(p);
                    if (p.estilo && p.estilo.length > 0)
                      setMostrarEstilos(true);
                  }}
                >
                  Editar
                </button>
                <button onClick={() => eliminarProducto(p.productoId)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
