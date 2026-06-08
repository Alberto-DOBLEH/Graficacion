const db = require('../db/config');
const bcrypt = require('bcrypt');


const obtenerParticipantes = (req, res) => {
    const query = 'SELECT id_participante, nombre, email, fecha_registro FROM Participantes';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al consultar la BD' });
        res.json(results);
    });
};

const crearParticipante = async (req, res) => { // <-- Le agregamos 'async' porque encriptar toma unos milisegundos
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {

        const passwordHash = await bcrypt.hash(password, 10);


        const query = 'INSERT INTO Participantes (nombre, email, password_hash) VALUES (?, ?, ?)';

        db.query(query, [nombre, email, passwordHash], (err, results) => {
            if (err) {

                console.error('🕵️‍♂️ Error exacto de MySQL:', err.sqlMessage);

                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email ya registrado' });
                return res.status(500).json({ error: 'Error al guardar en BD' });
            }
            res.status(201).json({ mensaje: 'Registrado exitosamente', id_participante: results.insertId });
        });
    } catch (error) {
        console.error('Error al encriptar:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const actualizarParticipante = (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;
    let query = 'UPDATE Participantes SET ';
    const params = [];
    if (nombre) { query += 'nombre = ?, '; params.push(nombre); }
    if (email) { query += 'email = ?, '; params.push(email); }
    
    if (params.length === 0) return res.status(400).json({ error: 'No hay datos para actualizar' });
    
    query = query.slice(0, -2) + ' WHERE id_participante = ?';
    params.push(id);
    
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Participante no encontrado' });
        res.json({ mensaje: 'Participante actualizado' });
    });
};

const eliminarParticipante = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Participantes WHERE id_participante = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Participante no encontrado' });
        res.json({ mensaje: 'Participante eliminado' });
    });
};

module.exports = { obtenerParticipantes, crearParticipante, actualizarParticipante, eliminarParticipante };