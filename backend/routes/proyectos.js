const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');
const { verificarToken } = require('../middleware/authMiddleware');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validadorMiddleware');

// Todas las rutas requieren token
router.use(verificarToken);

router.get('/', proyectosController.obtenerProyectos);

router.get('/:id', [
    check('id', 'El ID debe ser numérico').isInt(),
    validarCampos
], proyectosController.obtenerProyecto);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], proyectosController.crearProyecto);

router.post('/asignar', [
    check('id_proyecto', 'id_proyecto debe ser numérico').isInt(),
    check('id_participante', 'id_participante debe ser numérico').isInt(),
    check('id_rol', 'id_rol debe ser numérico').isInt(),
    validarCampos
], proyectosController.asignarParticipante);

router.put('/:id', proyectosController.actualizarProyecto);

router.delete('/:id', [
    check('id', 'El ID debe ser numérico').isInt(),
    validarCampos
], proyectosController.eliminarProyecto);

module.exports = router;