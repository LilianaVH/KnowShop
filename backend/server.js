const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // cambia si tu usuario es distinto
  password: "",       // pon tu contraseña si tiene
  database: "test1" // cambia por tu base
});

// Probar conexión
db.connect(err => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

// 🔹 Ruta de prueba
app.get("/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});

// 🔹 Iniciar servidor
app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});
