const db = require('../db/config');

const buildProjectContext = async (idProyecto) => {
    const context = {
        proyecto: {},
        participantes: [],
        entrevistas: [],
        cuestionarios: [],
        historiasUsuario: [],
        focusGroups: [],
        observaciones: [],
        documentos: [],
        seguimientoTransaccional: [],
        diagramas: []
    };

    // Helper wrapper para promesas de db.query
    const queryPromise = (sql, params) => {
        return new Promise((resolve, reject) => {
            db.query(sql, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    };

    try {
        // 1. Obtener datos del proyecto
        const proyectoRes = await queryPromise('SELECT * FROM Proyectos WHERE id_proyecto = ?', [idProyecto]);
        if (proyectoRes.length > 0) context.proyecto = proyectoRes[0];

        // 2. Obtener participantes y sus roles
        const participantesRes = await queryPromise(`
            SELECT p.nombre, p.email, r.nombre_rol as rol
            FROM Proyecto_Participantes pp
            JOIN Participantes p ON pp.id_participante = p.id_participante
            JOIN Roles r ON pp.id_rol = r.id_rol
            WHERE pp.id_proyecto = ?
        `, [idProyecto]);
        context.participantes = participantesRes;

        // 3. Obtener técnicas de análisis (Entrevistas, Cuestionarios, Requerimientos, etc.)
        const analisisRes = await queryPromise('SELECT * FROM Analisis_Requerimientos WHERE id_proyecto = ?', [idProyecto]);
        
        analisisRes.forEach(item => {
            let contenidoParsed = item.contenido;
            if (typeof item.contenido === 'string') {
                try { contenidoParsed = JSON.parse(item.contenido); } catch (e) { /* ignore */ }
            }

            switch(item.tipo_metodo) {
                case 'entrevista': context.entrevistas.push(contenidoParsed); break;
                case 'cuestionario': context.cuestionarios.push(contenidoParsed); break;
                case 'historias_usuarios': context.historiasUsuario.push(contenidoParsed); break;
                case 'focus_group': context.focusGroups.push(contenidoParsed); break;
                case 'observaciones': context.observaciones.push(contenidoParsed); break;
                case 'documentos': context.documentos.push(contenidoParsed); break;
                case 'seguimiento_transaccional': context.seguimientoTransaccional.push(contenidoParsed); break;
            }
        });

        // 4. Obtener diagramas generados
        const diagramasRes = await queryPromise('SELECT tipo_diagrama, codigo_generado FROM Diagramas_Generados WHERE id_proyecto = ?', [idProyecto]);
        context.diagramas = diagramasRes;

        return context;

    } catch (error) {
        console.error('Error construyendo el contexto del proyecto:', error);
        throw new Error('Fallo al construir el contexto: ' + error.message);
    }
};

module.exports = { buildProjectContext };
