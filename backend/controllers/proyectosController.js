const db = require('../db/config');

// GET /api/proyectos — solo los proyectos del usuario autenticado
const obtenerProyectos = (req, res) => {
    const id_participante = req.usuario.id; // viene del JWT via authMiddleware
    db.query(
        'SELECT * FROM Proyectos WHERE id_participante = ? ORDER BY fecha_creacion DESC',
        [id_participante],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error BD' });
            res.json(results);
        }
    );
};

// GET /api/proyectos/:id — solo si pertenece al usuario autenticado
const obtenerProyecto = (req, res) => {
    const { id } = req.params;
    const id_participante = req.usuario.id;
    db.query(
        'SELECT * FROM Proyectos WHERE id_proyecto = ? AND id_participante = ?',
        [id, id_participante],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error BD' });
            if (results.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
            res.json(results[0]);
        }
    );
};

// POST /api/proyectos — asocia el proyecto al usuario que lo crea
const crearProyecto = (req, res) => {
    const { nombre, descripcion, estado } = req.body;
    const id_participante = req.usuario.id;

    if (!nombre) return res.status(400).json({ error: 'Nombre obligatorio' });

    db.query(
        'INSERT INTO Proyectos (nombre, descripcion, estado, id_participante) VALUES (?, ?, ?, ?)',
        [nombre, descripcion || null, estado || 'activo', id_participante],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error BD' });
            res.status(201).json({ mensaje: 'Proyecto creado', id_proyecto: results.insertId });
        }
    );
};

// PUT /api/proyectos/:id
const actualizarProyecto = (req, res) => {
    const { id } = req.params;
    const id_participante = req.usuario.id;
    const { nombre, descripcion, estado } = req.body;

    let query = 'UPDATE Proyectos SET ';
    const params = [];

    if (nombre)               { query += 'nombre = ?, ';      params.push(nombre); }
    if (descripcion !== undefined) { query += 'descripcion = ?, '; params.push(descripcion); }
    if (estado)               { query += 'estado = ?, ';      params.push(estado); }

    if (params.length === 0) return res.status(400).json({ error: 'No hay datos para actualizar' });

    query = query.slice(0, -2) + ' WHERE id_proyecto = ? AND id_participante = ?';
    params.push(id, id_participante);

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Proyecto no encontrado o sin permisos' });
        res.json({ mensaje: 'Proyecto actualizado' });
    });
};

// DELETE /api/proyectos/:id
const eliminarProyecto = (req, res) => {
    const { id } = req.params;
    const id_participante = req.usuario.id;
    db.query(
        'DELETE FROM Proyectos WHERE id_proyecto = ? AND id_participante = ?',
        [id, id_participante],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Error BD' });
            if (results.affectedRows === 0) return res.status(404).json({ error: 'Proyecto no encontrado o sin permisos' });
            res.json({ mensaje: 'Proyecto eliminado' });
        }
    );
};

// POST /api/proyectos/asignar — asignar colaborador a un proyecto
const asignarParticipante = (req, res) => {
    const { id_proyecto, id_participante, id_rol } = req.body;
    if (!id_proyecto || !id_participante || !id_rol) return res.status(400).json({ error: 'Faltan datos' });

    db.query(
        'INSERT INTO Proyecto_Participantes (id_proyecto, id_participante, id_rol) VALUES (?, ?, ?)',
        [id_proyecto, id_participante, id_rol],
        (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Ya está asignado' });
                return res.status(500).json({ error: 'Error BD' });
            }
            res.status(201).json({ mensaje: 'Asignado exitosamente' });
        }
    );
};

module.exports = { obtenerProyectos, obtenerProyecto, crearProyecto, actualizarProyecto, eliminarProyecto, asignarParticipante };