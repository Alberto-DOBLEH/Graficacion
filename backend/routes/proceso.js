const express = require('express');
const router = express.Router();
const procesoController = require('../controllers/procesoController');
const { verificarToken } = require('../middleware/authMiddleware');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validadorMiddleware');

router.use(verificarToken);

router.get('/proyecto/:id_proyecto', [
    check('id_proyecto', 'El id_proyecto debe ser numérico').isInt(),
    validarCampos
], procesoController.obtenerAnalisisPorProyecto);

router.post('/', [
    check('id_proyecto', 'El id_proyecto es obligatorio y numérico').isInt(),
    check('tipo_metodo', 'El tipo de método es obligatorio').not().isEmpty(),
    check('contenido', 'El contenido es obligatorio').not().isEmpty(),
    validarCampos
], procesoController.crearAnalisis);

router.put('/:id', [
    check('id', 'El ID debe ser numérico').isInt(),
    validarCampos
], procesoController.actualizarAnalisis);

router.delete('/:id', [
    check('id', 'El ID debe ser numérico').isInt(),
    validarCampos
], procesoController.eliminarAnalisis);

module.exports = router;