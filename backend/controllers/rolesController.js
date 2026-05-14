// backend/controllers/rolesController.js
const db = require('../db/config');

// Función para obtener todos los roles
const obtenerRoles = (req, res) => {
    const query = 'SELECT * FROM Roles';

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error al obtener roles:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
        res.json(results);
    });
};

// Función para crear un nuevo rol
const crearRol = (req, res) => {
    const { nombre_rol } = req.body;

    if (!nombre_rol) {
        return res.status(400).json({ error: 'El campo nombre_rol es obligatorio' });
    }

    const query = 'INSERT INTO Roles (nombre_rol) VALUES (?)';

    db.query(query, [nombre_rol], (err, results) => {
        if (err) {
            console.error('❌ Error al crear rol:', err);
            return res.status(500).json({ error: 'Error al guardar en la base de datos' });
        }

        res.status(201).json({
            mensaje: 'Rol creado exitosamente',
            id_rol: results.insertId
        });
    });
};

// Exportamos las funciones para que las rutas las puedan usar
module.exports = {
    obtenerRoles,
    crearRol
};