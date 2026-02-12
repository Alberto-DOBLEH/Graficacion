const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const {connection} = require("../db/config")

const getProcesosporProyecto = (request, response) => {
    const id = request.params.id
    connection.query("SELECT * FROM proceso WHERE proyecto = ?",[id],
        (error, results) => {
            if(error)
                throw error;
            response.status(200).json(results);
        });
};

app.route("/proceso/:id").get(getProcesosporProyecto);

const agregarProceso = (request, response) => {
    const {nombre, descripcion, stakeholder, area, proyecto} = request.body;
    connection.query("INSERT INTO proceso(nombre, descripcion, stakeholder, area, proyecto) VALUE (?,?,?,?,?)",
    [nombre, descripcion, stakeholder, area, proyecto],
    (error, results) => {
        if(error)
            throw error;
    response.status(201).json({"Proceso agregado":results.affectedRows});
    });
};

app.route("/proceso").post(agregarProceso);

const agregarpasoProceso = (request, response) => {
    const id = request.params.id;
    const {paso, texto} = request.body;
    connection.query("INSERT INTO proceso(proceso, paso, texto) VALUE (?,?,?)",
    [id, paso, texto],
    (error, results) => {
        if(error)
            throw error;
    response.status(201).json({"Paso del proceso agregado":results.affectedRows});
    });
};

app.route("/proceso/:id").post(agregarpasoProceso);


const eliminarProceso = (request, response) => {
    const id = request.params.id;
    connection.query("DELETE FROM proceso WHERE id = ?",[id],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Proyecto eliminado":results.affectedRows});
    });
};

app.route("/proceso/:id").delete(eliminarProceso);

module.exports = app;