const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const { connection } = require("../db/config");

const getProyectos = (request, response) => {
  connection.query("SELECT * FROM proyecto", (error, results) => {
    if (error) {
      console.log(error);
      return response.status(500).json({ error: "Error al obtener proyectos" });
    }
    response.status(200).json(results);
  });
};

app.route("/proyecto").get(getProyectos);

const agregarProyecto = (request, response) => {
  const { nombre, descripcion } = request.body;

  connection.query(
    "INSERT INTO proyecto(nombre, descripcion) VALUES (?,?)",
    [nombre, descripcion],
    (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).json({ error: "Error al agregar proyecto" });
      }
      response.status(201).json({ "Proyecto agregado": results.affectedRows });
    }
  );
};

app.route("/proyecto").post(agregarProyecto);

const eliminarProyecto = (request, response) => {
  const id = request.params.id;

  connection.query(
    "DELETE FROM proyecto WHERE id_proyecto = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).json({ error: "Error al eliminar proyecto" });
      }
      response.status(201).json({ "Proyecto eliminado": results.affectedRows });
    }
  );
};

app.route("/proyecto/:id").delete(eliminarProyecto);

module.exports = app;