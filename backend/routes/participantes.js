const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const {connection} = require("../db/config");
const { response } = require("./proyectos");

//Stakeholders Endpoints
const getStakeholderporproyecto = (request, response) => {
    const id = request.params.id;
    connection.query("SELECT FROM stakeholder WHERE id = ?",[id],
        (error, results) => {
            if(error)
                throw error;
            response.status(200).json(results);
        });
};
app.route("/stakeholder/:id").get(getStakeholderporproyecto);

const agregarStakeholder = (request, reponse) => {
    const {nombre, apellido1, apellido2, rol, correo_electronico, numero_telefonico, proyecto} = request.body;
    connection.query("INSERT INTO stakeholder(nombre, apellido1, apellido2, rol, correo_electronico, numero_telefonico, proyecto) VALUES (?,?,?,?,?,?,?)",[nombre, apellido1, apellido2, rol, correo_electronico, numero_telefonico, proyecto],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Stakeholder agregado":results.affectedRows});
        });
};
app.route("/stakeholder").post(agregarStakeholder);

const eliminarStakeholder = (request, response) => {
    const id = request.params.id;
    connection.query("DELETE FROM stakeholder WHERE id = ?",[id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Stakeholder eliminado":results.affectedRows});
        });
};
app.route("/stakeholder/:id").delete(eliminarStakeholder);

//Integrantes Endpoints
const getIntegrantesporproyecto = (request, response) => {
    const id = request.params.id;
    connection.query("SELECT FROM integrantes WHERE id = ?",[id],
        (error, results) => {
            if(error)
                throw error;
            response.status(200).json(results);
        });
};
app.route("/integrantes/:id").get(getIntegrantesporproyecto);

const agregarIntegrante = (request, reponse) => {
    const {nombre, apellido1, apellido2, rol, correo_electronico, numero_telefonico, proyecto} = request.body;
    connection.query("INSERT INTO integrantes(nombre, apellido1, apellido2, rol, correo_electronico, numero_telefonico, proyecto) VALUES (?,?,?,?,?,?,?)",[nombre, apellido1, apellido2, rol, correo_electronico, numero_telefonico, proyecto],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Integrante agregado":results.affectedRows});
        });
};
app.route("/integrantes").post(agregarStakeholder);

const eliminarIntegrantes = (request, response) => {
    const id = request.params.id;
    connection.query("DELETE FROM integrantes WHERE id = ?",[id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Integrante eliminado":results.affectedRows});
        });
};
app.route("/integrantes/:id").delete(eliminarIntegrantes);

module.exports = app;