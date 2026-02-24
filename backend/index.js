const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use(require("./routes/proyectos"));
app.use(require("./routes/proceso"));
app.use(require("./routes/roles"));
app.use(require("./routes/participantes"));

app.listen(process.env.PORT || 3300, () => {
  console.log("Servidor corriendo en el puerto 3300");
});

module.exports = app;