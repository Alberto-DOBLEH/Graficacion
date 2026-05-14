const db = require('../db/config');

const obtenerAnalisisPorProyecto = (req, res) => {
    const { id_proyecto } = req.params;
    db.query('SELECT * FROM Analisis_Requerimientos WHERE id_proyecto = ?', [id_proyecto], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD' });
        res.json(results);
    });
};

const crearAnalisis = (req, res) => {
    const { id_proyecto, tipo_metodo, contenido } = req.body;
    if (!id_proyecto || !tipo_metodo || !contenido) return res.status(400).json({ error: 'Faltan datos' });

    // Regla de oro: convertir JSON a string para MySQL
    const contenidoString = JSON.stringify(contenido);

    const query = 'INSERT INTO Analisis_Requerimientos (id_proyecto, tipo_metodo, contenido) VALUES (?, ?, ?)';
    db.query(query, [id_proyecto, tipo_metodo, contenidoString], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al guardar análisis' });
        res.status(201).json({ mensaje: 'Análisis guardado', id_analisis: results.insertId });
    });
};

module.exports = { obtenerAnalisisPorProyecto, crearAnalisis };