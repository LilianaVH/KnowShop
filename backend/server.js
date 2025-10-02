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
  password: "",        // pon tu contraseña si tiene
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

// 🔹 Ruta de prueba (ver usuarios)
app.get("/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      console.error("❌ Error en consulta /usuarios:", err);
      return res.status(500).json({ success: false, error: err.sqlMessage || err.message });
    }
    res.json(results);
  });
});

// 🔹 Ruta de login
app.post("/login", (req, res) => {
  const { usuario, contrasena } = req.body;

  console.log("📩 Datos recibidos en /login:", req.body);

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
        usuario: results[0] // 👈 aquí está el usuario logueado
      });
    } else {
      return res.json({ success: false, message: "Credenciales inválidas" });
    }
  });
});

// 🔹 Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
