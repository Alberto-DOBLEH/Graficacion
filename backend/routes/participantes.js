const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const { connection } = require("../db/config");

// Stakeholders
const getStakeholderporproyecto = (request, response) => {
  const id = request.params.id; // id_proyecto

  connection.query(
    "SELECT * FROM stakeholder WHERE proyecto = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        return response
          .status(500)
          .json({ error: "Error al obtener stakeholders" });
      }
      response.status(200).json(results);
    }
  );
};

app.route("/stakeholder/:id").get(getStakeholderporproyecto);

const agregarStakeholder = (request, response) => {
  const {
    nombre,
    apellido1,
    apellido2,
    rol,
    correo_electronica,
    numero_telefono,
    proyecto,
  } = request.body;

  connection.query(
    "INSERT INTO stakeholder(nombre, apellido1, apellido2, rol, correo_electronica, numero_telefono, proyecto) VALUES (?,?,?,?,?,?,?)",
    [nombre, apellido1, apellido2, rol, correo_electronica, numero_telefono, proyecto],
    (error, results) => {
      if (error) {
        console.log(error);
        return response
          .status(500)
          .json({ error: "Error al agregar stakeholder" });
      }
      response.status(201).json({ "Stakeholder agregado": results.affectedRows });
    }
  );
};

app.route("/stakeholder").post(agregarStakeholder);

const eliminarStakeholder = (request, response) => {
  const id = request.params.id;

  connection.query(
    "DELETE FROM stakeholder WHERE id_stakeholder = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        return response
          .status(500)
          .json({ error: "Error al eliminar stakeholder" });
      }
      response.status(201).json({ "Stakeholder eliminado": results.affectedRows });
    }
  );
};

app.route("/stakeholder/:id").delete(eliminarStakeholder);

// Integrantes
const getIntegrantesporproyecto = (request, response) => {
  const id = request.params.id; // id_proyecto

  connection.query(
    "SELECT * FROM integrantes WHERE proyecto = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        return response
          .status(500)
          .json({ error: "Error al obtener integrantes" });
      }
      response.status(200).json(results);
    }
  );
};

app.route("/integrantes/:id").get(getIntegrantesporproyecto);

const agregarIntegrante = (request, response) => {
  const {
    nombre,
    apellido1,
    apellido2,
    rol,
    correo_electronico,
    numero_telefonico,
    proyecto,
  } = request.body;

  connection.query(
    "INSERT INTO integrantes(nombre, apellido1, apellido2, rol, correo_electronico, numero_telefonico, proyecto) VALUES (?,?,?,?,?,?,?)",
    [nombre, apellido1, apellido2, rol, correo_electronico, numero_telefonico, proyecto],
    (error, results) => {
      if (error) {
        console.log(error);
        return response
          .status(500)
          .json({ error: "Error al agregar integrante" });
      }
      response.status(201).json({ "Integrante agregado": results.affectedRows });
    }
  );
};

app.route("/integrantes").post(agregarIntegrante);

const eliminarIntegrantes = (request, response) => {
  const id = request.params.id;

  connection.query(
    "DELETE FROM integrantes WHERE id_integrante = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        return response
          .status(500)
          .json({ error: "Error al eliminar integrante" });
      }
      response.status(201).json({ "Integrante eliminado": results.affectedRows });
    }
  );
};

app.route("/integrantes/:id").delete(eliminarIntegrantes);

module.exports = app;