const express = require("express");
const app = express();

let accessCode = generateCode();
let isActive = true;
let lastUpdate = new Date();

app.use(express.json());

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Página de prueba (opcional)
app.get("/", (req, res) => {
  res.send("API corriendo correctamente");
});

// Verificar estado
app.get("/status", (req, res) => {
  res.json({
    code: accessCode,
    active: isActive,
    lastUpdate
  });
});

// Cambiar estado ON/OFF
app.post("/power", (req, res) => {
  const { action } = req.body;
  if (action === "on") isActive = true;
  if (action === "off") isActive = false;
  res.json({ ok: true });
});

// Generar nuevo código
app.post("/update", (req, res) => {
  accessCode = generateCode();
  lastUpdate = new Date();
  res.json({ code: accessCode });
});

// Verificar código
app.get("/verify/:code", (req, res) => {
  if (!isActive) return res.status(403).send("Acceso deshabilitado.");
  if (req.params.code === accessCode) {
    return res.send("Código válido.");
  } else {
    return res.status(400).send("Código inválido.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});
