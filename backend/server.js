const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // cambia si tu usuario es distinto
  password: "",        // pon tu contraseña si la tienes
  database: "test1"    // tu base de datos
});

// Probar conexión
db.connect(err => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

// ---------------------------------------------------
// 🔹 Ruta de prueba (usuarios)
app.get("/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      console.error("❌ Error en consulta /usuarios:", err);
      return res.status(500).json({ success: false, error: err.sqlMessage || err.message });
    }
    res.json(results);
  });
});

// ---------------------------------------------------
// 🔹 Ruta de login
app.post("/login", (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  const query = "SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?";
  db.query(query, [usuario, contrasena], (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta MySQL:", err);
      return res.status(500).json({
        success: false,
        message: "Error en servidor",
        error: err.sqlMessage || err.message
      });
    }

    if (results.length > 0) {
      return res.json({
        success: true,
        message: "Login exitoso",
        usuario: results[0]
      });
    } else {
      return res.json({ success: false, message: "Credenciales inválidas" });
    }
  });
});

// ---------------------------------------------------
// 🔹 Ruta para mostrar todos los anuncios
app.get("/anuncios", (req, res) => {
  const query = "SELECT numero, imagen, descripcion FROM anuncios ORDER BY numero ASC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error en consulta /anuncios:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener anuncios",
        error: err.sqlMessage || err.message
      });
    }
    res.json(results);
  });
});

// 🔹 Eliminar un anuncio por ID (numero)
app.delete("/anuncios/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM anuncios WHERE numero = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar:", err);
      return res.status(500).json({ success: false, message: "Error en la eliminación" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "No se encontró el registro" });
    }

    res.json({ success: true, message: `Anuncio con ID ${id} eliminado correctamente` });
  });
});

// ---------------------------------------------------
// 🔹 Editar un anuncio por ID (numero)
app.put("/anuncios/:id", (req, res) => {
  const id = req.params.id;
  const { imagen, descripcion } = req.body;

  const query = "UPDATE anuncios SET imagen = ?, descripcion = ? WHERE numero = ?";
  db.query(query, [imagen, descripcion, id], (err, result) => {
    if (err) {
      console.error("❌ Error al actualizar:", err);
      return res.status(500).json({ success: false, message: "Error en la actualización" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "No se encontró el registro" });
    }

    res.json({ success: true, message: `Anuncio con ID ${id} actualizado correctamente` });
  });
});

app.delete("/test", (req, res) => {
  res.json({ ok: true });
});

// ---------------------------------------------------
// 🔹 Agregar un nuevo anuncio
app.post("/anuncios", (req, res) => {
  const { numero, imagen, descripcion } = req.body;

  if (!numero || !descripcion) {
    return res
      .status(400)
      .json({ success: false, message: "Faltan datos obligatorios (numero y descripcion)" });
  }

  // Si no envían imagen, se pone una por defecto
  const img = imagen && imagen.trim() !== "" ? imagen : "https://via.placeholder.com/80";

  const query = "INSERT INTO anuncios (numero, imagen, descripcion) VALUES (?, ?, ?)";
  db.query(query, [numero, img, descripcion], (err, result) => {
    if (err) {
      console.error("❌ Error al agregar:", err);
      return res.status(500).json({
        success: false,
        message: "Error al insertar el anuncio",
        error: err.sqlMessage || err.message,
      });
    }

    res.json({
      success: true,
      message: `Anuncio agregado correctamente con número ${numero}`,
    });
  });
});

// ---------------------------------------------------
// 🔹 Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});