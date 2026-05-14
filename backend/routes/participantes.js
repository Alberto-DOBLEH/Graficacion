const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); // Importamos el validador
const participantesController = require('../controllers/participantesController');

// --- MIDDLEWARE DE VALIDACIÓN ---
// Esta función revisa si los "checks" fallaron y detiene la petición si hay errores
const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next(); // Si todo está bien, lo deja pasar al controlador
};

// --------------------------------------------------------
// RUTAS
// --------------------------------------------------------

router.get('/', participantesController.obtenerParticipantes);

// Le agregamos un arreglo de "checks" antes de que llegue al controlador
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un correo válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos // Llamamos a nuestro middleware para que actúe de cadenero
], participantesController.crearParticipante);

module.exports = router;