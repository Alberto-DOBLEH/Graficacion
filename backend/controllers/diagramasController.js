const db = require('../db/config');

const guardarDiagrama = (req, res) => {
    const { id_proyecto, tipo_diagrama, codigo_generado } = req.body;
    const query = 'INSERT INTO Diagramas_Generados (id_proyecto, tipo_diagrama, codigo_generado) VALUES (?, ?, ?)';
    db.query(query, [id_proyecto, tipo_diagrama, codigo_generado], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD al guardar diagrama' });
        res.status(201).json({ mensaje: 'Diagrama guardado', id_diagrama: results.insertId });
    });
};

const obtenerDiagramasPorProyecto = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Diagramas_Generados WHERE id_proyecto = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD al consultar diagramas' });
        res.json(results);
    });
};

const obtenerDiagrama = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Diagramas_Generados WHERE id_diagrama = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD al consultar diagrama' });
        if (results.length === 0) return res.status(404).json({ error: 'Diagrama no encontrado' });
        res.json(results[0]);
    });
};

const actualizarDiagrama = (req, res) => {
    const { id } = req.params;
    const { tipo_diagrama, codigo_generado } = req.body;
    let query = 'UPDATE Diagramas_Generados SET ';
    const params = [];
    
    if (tipo_diagrama) { query += 'tipo_diagrama = ?, '; params.push(tipo_diagrama); }
    if (codigo_generado) { query += 'codigo_generado = ?, '; params.push(codigo_generado); }
    
    if (params.length === 0) return res.status(400).json({ error: 'No hay datos para actualizar' });
    
    query = query.slice(0, -2) + ' WHERE id_diagrama = ?';
    params.push(id);
    
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD al actualizar diagrama' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Diagrama no encontrado' });
        res.json({ mensaje: 'Diagrama actualizado' });
    });
};

const eliminarDiagrama = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Diagramas_Generados WHERE id_diagrama = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD al eliminar diagrama' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Diagrama no encontrado' });
        res.json({ mensaje: 'Diagrama eliminado' });
    });
};

module.exports = { guardarDiagrama, obtenerDiagramasPorProyecto, obtenerDiagrama, actualizarDiagrama, eliminarDiagrama };
