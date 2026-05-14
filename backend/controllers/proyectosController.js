const db = require('../db/config');

const obtenerProyectos = (req, res) => {
    db.query('SELECT * FROM Proyectos', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD' });
        res.json(results);
    });
};

const crearProyecto = (req, res) => {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre obligatorio' });

    db.query('INSERT INTO Proyectos (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion || null], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD' });
        res.status(201).json({ mensaje: 'Proyecto creado', id_proyecto: results.insertId });
    });
};

const asignarParticipante = (req, res) => {
    const { id_proyecto, id_participante, id_rol } = req.body;
    if (!id_proyecto || !id_participante || !id_rol) return res.status(400).json({ error: 'Faltan datos' });

    const query = 'INSERT INTO Proyecto_Participantes (id_proyecto, id_participante, id_rol) VALUES (?, ?, ?)';
    db.query(query, [id_proyecto, id_participante, id_rol], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Ya está asignado' });
            return res.status(500).json({ error: 'Error BD' });
        }
        res.status(201).json({ mensaje: 'Asignado exitosamente' });
    });
};

module.exports = { obtenerProyectos, crearProyecto, asignarParticipante };