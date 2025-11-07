import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../css/AuthForms.css";

export const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    edad: "",
    email: "",
    telefono: "",
  });
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        userId: user.uid,
        nombre: form.nombre,
        apellido: form.apellido,
        direccion: form.direccion,
        edad: Number(form.edad),
        email: form.email,
        telefono: form.telefono,
        rol: "usuario",
      });

      alert("Usuario registrado correctamente");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Hubo un error al registrarse");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        <h2 className="titulo">Crear Cuenta</h2>

        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          required
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
        />
        <input
          name="edad"
          type="number"
          placeholder="Edad"
          value={form.edad}
          onChange={handleChange}
          required
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Registrarme</button>

        <p>
          ¿Ya tenés cuenta? <a href="/login">Iniciá sesión</a>
        </p>
      </form>
    </div>
  );
};
