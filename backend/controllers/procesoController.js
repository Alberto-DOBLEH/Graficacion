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

const actualizarAnalisis = (req, res) => {
    const { id } = req.params;
    const { tipo_metodo, contenido } = req.body;
    let query = 'UPDATE Analisis_Requerimientos SET ';
    const params = [];
    
    if (tipo_metodo) { query += 'tipo_metodo = ?, '; params.push(tipo_metodo); }
    if (contenido) { query += 'contenido = ?, '; params.push(JSON.stringify(contenido)); }
    
    if (params.length === 0) return res.status(400).json({ error: 'No hay datos para actualizar' });
    
    query = query.slice(0, -2) + ' WHERE id_analisis = ?';
    params.push(id);
    
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Análisis no encontrado' });
        res.json({ mensaje: 'Análisis actualizado' });
    });
};

const eliminarAnalisis = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Analisis_Requerimientos WHERE id_analisis = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Análisis no encontrado' });
        res.json({ mensaje: 'Análisis eliminado' });
    });
};

const analizarArchivoAnexo = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const file = req.files.archivo;
    let extractedText = '';

    try {
        const pdfParser = require('pdf-parse');
        if (file.mimetype === 'application/pdf' || file.name.endsWith('.pdf')) {
            const data = await pdfParser(file.data);
            extractedText = data.text;
        } else {
            // Asumir texto plano (TXT, HTML, JSON, MD)
            extractedText = file.data.toString('utf8');
        }

        if (!extractedText || !extractedText.trim()) {
            return res.status(400).json({ error: 'El archivo está vacío o no contiene texto legible.' });
        }

        res.json({ texto: extractedText });
    } catch (error) {
        console.error('Error al analizar archivo:', error);
        res.status(500).json({ error: error.message || 'Error al procesar el archivo' });
    }
};

module.exports = { obtenerAnalisisPorProyecto, crearAnalisis, actualizarAnalisis, eliminarAnalisis, analizarArchivoAnexo };