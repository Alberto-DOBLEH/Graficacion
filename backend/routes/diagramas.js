const express = require('express');
const router = express.Router();
const diagramasController = require('../controllers/diagramasController');
const { verificarToken } = require('../middleware/authMiddleware');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validadorMiddleware');

router.use(verificarToken);

router.post('/', [
    check('id_proyecto', 'El id_proyecto es obligatorio y numérico').isInt(),
    check('tipo_diagrama', 'El tipo de diagrama es obligatorio').not().isEmpty(),
    check('codigo_generado', 'El código generado es obligatorio').not().isEmpty(),
    validarCampos
], diagramasController.guardarDiagrama);

router.get('/proyecto/:id', [
    check('id', 'El ID del proyecto debe ser numérico').isInt(),
    validarCampos
], diagramasController.obtenerDiagramasPorProyecto);

router.get('/:id', [
    check('id', 'El ID del diagrama debe ser numérico').isInt(),
    validarCampos
], diagramasController.obtenerDiagrama);

router.put('/:id', [
    check('id', 'El ID del diagrama debe ser numérico').isInt(),
    validarCampos
], diagramasController.actualizarDiagrama);

router.delete('/:id', [
    check('id', 'El ID del diagrama debe ser numérico').isInt(),
    validarCampos
], diagramasController.eliminarDiagrama);

module.exports = router;
