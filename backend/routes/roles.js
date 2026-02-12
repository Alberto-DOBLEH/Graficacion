const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const {connection} = require("../db/config")

const getRolesporProyecto = (request, response) => {
    const id = request.params.id
    connection.query("SELECT * FROM roles WHERE proyecto = ?",[id],
        (error, results) => {
            if(error)
                throw error;
            response.status(200).json(results);
        });
};

app.route("/roles/:id").get(getRolesporProyecto);

const agregarRoles = (request, response) => {
    const {nombre, proyecto} = request.body;
    connection.query("INSERT INTO roles(nombre, proyecto) VALUE (?,?)",
    [nombre, proyecto],
    (error, results) => {
        if(error)
            throw error;
    response.status(201).json({"Rol agregado":results.affectedRows});
    });
};

app.route("/roles").post(agregarRoles);

const eliminarRoles = (request, response) => {
    const id = request.params.id;
    connection.query("DELETE FROM roles WHERE id = ?",[id],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Rol eliminado":results.affectedRows});
    });
};

app.route("/roles/:id").delete(eliminarRoles);

module.exports = app;