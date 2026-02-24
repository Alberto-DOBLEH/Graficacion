const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const { connection } = require("../db/config");

const getProcesosporProyecto = (request, response) => {
  const id = request.params.id;

  connection.query(
    "SELECT * FROM proceso WHERE proyecto = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).json({ error: "Error al obtener procesos" });
      }
      response.status(200).json(results);
    }
  );
};

app.route("/proceso/:id").get(getProcesosporProyecto);

const agregarProceso = (request, response) => {
  const { nombre, descripcion, stakeholder, area, proyecto } = request.body;

  connection.query(
    "INSERT INTO proceso(nombre, descripcion, stakeholder, area, proyecto) VALUES (?,?,?,?,?)",
    [nombre, descripcion, stakeholder, area, proyecto],
    (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).json({ error: "Error al agregar proceso" });
      }
      response.status(201).json({ "Proceso agregado": results.affectedRows });
    }
  );
};

app.route("/proceso").post(agregarProceso);

// Agregar paso a un proceso (tabla detalle_proceso)
const agregarpasoProceso = (request, response) => {
  const id = request.params.id; // id_proceso
  const { paso, texto } = request.body;

  connection.query(
    "INSERT INTO detalle_proceso(proceso, paso, texto) VALUES (?,?,?)",
    [id, paso, texto],
    (error, results) => {
      if (error) {
        console.log(error);
        return response
          .status(500)
          .json({ error: "Error al agregar paso del proceso" });
      }
      response
        .status(201)
        .json({ "Paso del proceso agregado": results.affectedRows });
    }
  );
};

app.route("/proceso/:id").post(agregarpasoProceso);

const eliminarProceso = (request, response) => {
  const id = request.params.id;

  connection.query(
    "DELETE FROM proceso WHERE id_proceso = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).json({ error: "Error al eliminar proceso" });
      }
      response.status(201).json({ "Proceso eliminado": results.affectedRows });
    }
  );
};

app.route("/proceso/:id").delete(eliminarProceso);

module.exports = app;