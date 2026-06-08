const db = require('../db/config');
const { buildProjectContext } = require('../services/projectContextBuilder');
const claudeService = require('../services/claudeService');

const guardarPrompt = (req, res) => {
    const { id_proyecto, contenido_prompt } = req.body;
    const query = 'INSERT INTO Prompts_Finales (id_proyecto, contenido_prompt) VALUES (?, ?)';
    db.query(query, [id_proyecto, contenido_prompt], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD al guardar prompt' });
        res.status(201).json({ mensaje: 'Prompt guardado', id_prompt: results.insertId });
    });
};

const obtenerPromptsProyecto = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Prompts_Finales WHERE id_proyecto = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD al consultar prompts' });
        res.json(results);
    });
};

const obtenerPrompt = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Prompts_Finales WHERE id_prompt = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD al consultar prompt' });
        if (results.length === 0) return res.status(404).json({ error: 'Prompt no encontrado' });
        res.json(results[0]);
    });
};

const actualizarPrompt = (req, res) => {
    const { id } = req.params;
    const { contenido_prompt } = req.body;
    
    if (!contenido_prompt) return res.status(400).json({ error: 'El contenido del prompt es obligatorio' });
    
    const query = 'UPDATE Prompts_Finales SET contenido_prompt = ? WHERE id_prompt = ?';
    db.query(query, [contenido_prompt, id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD al actualizar prompt' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Prompt no encontrado' });
        res.json({ mensaje: 'Prompt actualizado' });
    });
};

const eliminarPrompt = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Prompts_Finales WHERE id_prompt = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error BD al eliminar prompt' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Prompt no encontrado' });
        res.json({ mensaje: 'Prompt eliminado' });
    });
};

const generarPromptMaestroConIA = async (req, res) => {
    const { id } = req.params; // ID del proyecto
    try {
        const contexto = await buildProjectContext(id);
        const contenido_prompt = await claudeService.generarPromptMaestro(contexto);
        
        const queryCheck = 'SELECT id_prompt FROM Prompts_Finales WHERE id_proyecto = ?';
        db.query(queryCheck, [id], (err, results) => {
            if (err) return res.status(500).json({ error: 'Error BD al verificar prompt' });
            
            if (results.length > 0) {
                db.query('UPDATE Prompts_Finales SET contenido_prompt = ? WHERE id_proyecto = ?', [contenido_prompt, id], (errUp) => {
                    if (errUp) return res.status(500).json({ error: 'Error BD al actualizar prompt generado' });
                    res.json({ mensaje: 'Prompt Maestro generado y actualizado', contenido_prompt });
                });
            } else {
                db.query('INSERT INTO Prompts_Finales (id_proyecto, contenido_prompt) VALUES (?, ?)', [id, contenido_prompt], (errIn) => {
                    if (errIn) return res.status(500).json({ error: 'Error BD al guardar prompt generado' });
                    res.status(201).json({ mensaje: 'Prompt Maestro generado y guardado', contenido_prompt });
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { guardarPrompt, obtenerPromptsProyecto, obtenerPrompt, actualizarPrompt, eliminarPrompt, generarPromptMaestroConIA };
