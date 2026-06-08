const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const participantesController = require('../controllers/participantesController');
const { verificarToken } = require('../middleware/authMiddleware');
const { validarCampos } = require('../middleware/validadorMiddleware');

// --------------------------------------------------------
// RUTAS
// --------------------------------------------------------

router.get('/', verificarToken, participantesController.obtenerParticipantes);

// Le agregamos un arreglo de "checks" antes de que llegue al controlador
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un correo válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos // Llamamos a nuestro middleware para que actúe de cadenero
], participantesController.crearParticipante);

router.put('/:id', [
    verificarToken,
    check('id', 'El ID debe ser numérico').isInt(),
    validarCampos
], participantesController.actualizarParticipante);

router.delete('/:id', [
    verificarToken,
    check('id', 'El ID debe ser numérico').isInt(),
    validarCampos
], participantesController.eliminarParticipante);

module.exports = router;