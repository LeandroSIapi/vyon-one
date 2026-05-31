const express = require("express");
const path = require("path");

const app = express();

// ✅ serve arquivos da build
app.use(express.static(path.join(__dirname, "build")));

// ✅ fallback para React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});